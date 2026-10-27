import { useCallback, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthContext } from "@/context/auth-context";
import { apiFetch, ApiError } from "@/lib/api";
import { OfferKind } from "@/types";
import { formatDate, formatPrice } from "@/utils/helpers";

type Alert = { offerId: string; targetPrice: number; active: boolean; triggeredAt: string | null; triggeredPrice: number | null };

// "Email me when the effective price drops to X"
export default function PriceAlertBox({ kind, offerId, currentPrice }: { kind: OfferKind; offerId: string; currentPrice: number }) {
  const { t } = useTranslation();
  const auth = useContext(AuthContext);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [target, setTarget] = useState(String(Math.max(1, Math.floor(currentPrice * 0.9))));

  const load = useCallback(() => {
    if (!auth.token) return;
    apiFetch<{ items: Alert[] }>("/api/me/price-alerts", { token: auth.token }).then((data) => {
      const found = data.items.find((item) => String(item.offerId) === offerId) ?? null;
      setAlert(found);
      if (found) setTarget(String(found.targetPrice));
    });
  }, [auth.token, offerId]);
  useEffect(load, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiFetch(`/api/me/price-alerts/${kind}/${offerId}`, {
        method: "PUT",
        token: auth.token,
        body: { targetPrice: Number(target.replace(",", ".")) },
      });
      toast.success(t("alert.saved"));
      load();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : String(err));
    }
  }

  async function remove() {
    await apiFetch(`/api/me/price-alerts/${kind}/${offerId}`, { method: "DELETE", token: auth.token });
    setAlert(null);
  }

  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 font-semibold">
        <BellRing className="w-4 h-4 text-[#023e8a]" />
        {t("alert.title")}
      </h2>
      {!auth.isLoggedIn ? (
        <Link to="/login" className="text-sm text-blue-700 hover:underline">
          {t("alert.login")}
        </Link>
      ) : (
        <>
          {alert?.active && <p className="text-sm text-emerald-700">{t("alert.active", { price: formatPrice(alert.targetPrice) })}</p>}
          {alert && !alert.active && alert.triggeredAt && (
            <p className="text-sm text-gray-700">
              {t("alert.triggered", { date: formatDate(alert.triggeredAt), price: formatPrice(alert.triggeredPrice ?? 0) })}
            </p>
          )}
          <form onSubmit={save} className="space-y-2">
            <label htmlFor="alert-target" className="block text-sm text-gray-700">
              {t("alert.text")}
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="alert-target"
                inputMode="decimal"
                className="w-28"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
              />
              <span className="text-sm text-gray-600">€ {t("common.perMonth")}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" size="sm">
                {alert ? t("alert.update") : t("alert.set")}
              </Button>
              {alert && (
                <Button type="button" size="sm" variant="outline" onClick={remove}>
                  {t("alert.remove")}
                </Button>
              )}
            </div>
          </form>
        </>
      )}
    </section>
  );
}
