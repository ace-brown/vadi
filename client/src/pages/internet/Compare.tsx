import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { Card } from "@/components/ui/card";
import { CardImage } from "@/components/listing/shared";
import { GoToOfferButton } from "@/components/offers/OfferCard";
import { homeOfferFacts, mobileOfferFacts } from "@/components/offers/offer-details";
import Seo from "@/components/common/Seo";
import { CompareContext } from "@/context/compare-context";
import { apiFetch, ApiError } from "@/lib/api";
import { HomePlanType, MobilePlanType, OfferKind, OfferType } from "@/types";
import { formatPrice } from "@/utils/helpers";

const ENDPOINTS: Record<OfferKind, string> = {
  home: "/api/internet/home-tariffs",
  mobile: "/api/internet/mobile-tariffs",
};

type Row = { label: string; values: string[]; best?: number };

export default function ComparePage() {
  const { t } = useTranslation();
  const { kind } = useParams();
  const { selected, remove } = useContext(CompareContext);
  const auth = useContext(AuthContext);
  const [offers, setOffers] = useState<OfferType[]>([]);
  const ids = kind === "home" || kind === "mobile" ? selected[kind] : [];
  const idsKey = ids.join(",");

  useEffect(() => {
    if (kind !== "home" && kind !== "mobile") return;
    const controller = new AbortController();
    Promise.all(
      idsKey
        .split(",")
        .filter(Boolean)
        .map((id) =>
          apiFetch<{ item: OfferType }>(`${ENDPOINTS[kind]}/${id}`, { signal: controller.signal })
            .then((res) => res.item)
            .catch((err) => {
              // Offers that no longer exist are dropped from the comparison;
              // cancelled requests and network errors are not
              if (err instanceof ApiError && err.status === 404) remove(kind, id);
              return null;
            })
        )
    ).then((items) => {
      if (!controller.signal.aborted) setOffers(items.filter((item): item is OfferType => item !== null));
    });
    return () => controller.abort();
  }, [kind, idsKey, remove]);

  if (kind !== "home" && kind !== "mobile") return <Navigate to="/" replace />;

  async function saveComparison() {
    if (!auth.token) {
      toast.info(t("save.loginFirst"));
      return;
    }
    const name = window.prompt(t("save.comparisonName")) ?? undefined;
    try {
      await apiFetch("/api/me/comparisons", {
        method: "POST",
        token: auth.token,
        body: { kind, offerIds: ids, name: name || undefined },
      });
      toast.success(t("save.comparisonSaved"));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : String(err));
    }
  }

  const shown = offers.filter((offer) => ids.includes(offer._id));
  const facts = shown.map((offer) =>
    kind === "home" ? homeOfferFacts(offer as HomePlanType) : mobileOfferFacts(offer as MobilePlanType)
  );
  const cheapest = shown.length > 1
    ? shown.reduce((best, offer, i) => (offer.effectiveMonthlyPrice < shown[best].effectiveMonthlyPrice ? i : best), 0)
    : undefined;

  const rows: Row[] = [
    { label: t("offer.effective"), values: shown.map((o) => formatPrice(o.effectiveMonthlyPrice)), best: cheapest },
    { label: t("offer.total24"), values: shown.map((o) => formatPrice(o.totalCost24)), best: cheapest },
    {
      label: t("offer.monthlyPrice"),
      values: shown.map((o) =>
        o.promoMonths > 0 && o.regularPrice !== null
          ? t("offer.promo", { price: formatPrice(o.monthlyPrice), months: o.promoMonths, after: formatPrice(o.regularPrice) })
          : formatPrice(o.monthlyPrice)
      ),
    },
    { label: t("offer.setupFee"), values: shown.map((o) => formatPrice(o.setupFee)) },
    { label: t("offer.hardwareFee"), values: shown.map((o) => formatPrice(o.hardwareFee)) },
    { label: t("offer.bonus"), values: shown.map((o) => (o.bonus > 0 ? `−${formatPrice(o.bonus)}` : "–")) },
    ...(facts[0]?.stats ?? []).map((stat, index) => ({
      label: stat.label,
      values: facts.map((fact) => fact.stats[index].value),
    })),
  ];

  return (
    <div className="max-w-6xl mx-auto mt-6 space-y-4">
      <Seo title={t("compare.title")} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{t("compare.title")}</h1>
        {ids.length > 0 && (
          <Button variant="outline" size="sm" onClick={saveComparison}>
            <Save className="w-4 h-4" />
            {t("save.comparison")}
          </Button>
        )}
      </div>
      {ids.length === 0 ? (
        <p className="text-gray-600">
          {t("compare.empty")}{" "}
          <Link to={kind === "home" ? "/internet/home-tariff" : "/internet/mobile-tariff"} className="text-blue-700 hover:underline">
            {kind === "home" ? t("nav.homeInternet") : t("nav.mobilePlans")}
          </Link>
        </p>
      ) : (
        <Card className="p-0 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr>
                <th className="p-4 w-48" />
                {shown.map((offer) => (
                  <th key={offer._id} scope="col" className="p-4 text-left align-top font-normal">
                    <div className="flex items-start justify-between gap-2">
                      <CardImage src={offer.providerId?.logo} alt={`${offer.provider} logo`} contain />
                      <button
                        type="button"
                        aria-label={t("compare.remove")}
                        className="text-gray-400 hover:text-gray-700"
                        onClick={() => remove(kind, offer._id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-gray-500">{offer.provider}</p>
                    <Link to={`/internet/${kind === "home" ? "home-tariff" : "mobile-tariff"}/${offer._id}`} className="font-bold text-base hover:underline">
                      {offer.name}
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t">
                  <th scope="row" className="p-4 text-left font-medium text-gray-600">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={index} className={`p-4 ${row.best === index ? "font-bold text-emerald-700" : ""}`}>
                      {value}
                      {row.best === index && row === rows[0] && (
                        <span className="block text-xs font-normal">{t("compare.best")}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t">
                <td className="p-4" />
                {shown.map((offer) => (
                  <td key={offer._id} className="p-4">
                    <GoToOfferButton kind={kind} offer={offer} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Card>
      )}
      <p className="text-xs text-gray-500">{t("common.vatNote")}</p>
    </div>
  );
}
