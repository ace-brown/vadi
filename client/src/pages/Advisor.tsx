import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Smartphone, Sparkles, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Seo from "@/components/common/Seo";
import OfferCard from "@/components/offers/OfferCard";
import { homeOfferFacts, mobileOfferFacts } from "@/components/offers/offer-details";
import { apiFetch, ApiError } from "@/lib/api";
import { HomePlanType, MobilePlanType, OfferKind } from "@/types";
import { formatPrice } from "@/utils/helpers";

type Reason = { code: string; params: Record<string, string | number> };
type Recommendation = { offer: HomePlanType | MobilePlanType; labels: string[]; reasons: Reason[] };
type AdvisorResult = {
  needs: { minDownloadMbps?: number; minUploadMbps?: number };
  relaxed: string[];
  recommendations: Recommendation[];
};

const NEGATIVE = new Set(["notEnoughData", "notEnoughSpeed", "overBudget", "missing"]);
const USAGES = ["basic", "streaming", "gaming", "homeoffice"] as const;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="checkbox" className="accent-[#023e8a]" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

const selectClass = "w-full border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";

export default function AdvisorPage() {
  const { t, i18n } = useTranslation();
  const [kind, setKind] = useState<OfferKind>("mobile");
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mobile answers
  const [dataGB, setDataGB] = useState("10");
  const [unlimitedCalls, setUnlimitedCalls] = useState(true);
  const [need5G, setNeed5G] = useState(false);
  const [planType, setPlanType] = useState("any");
  // Home answers
  const [postcode, setPostcode] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [people, setPeople] = useState("2");
  const [usage, setUsage] = useState<string[]>(["streaming"]);
  // Both
  const [monthlyCancellable, setMonthlyCancellable] = useState(false);
  const [budget, setBudget] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const budgetValue = budget ? Number(budget.replace(",", ".")) : null;
    try {
      const body =
        kind === "mobile"
          ? { dataGB: dataGB === "unlimited" ? null : Number(dataGB), unlimitedCalls, need5G, planType, monthlyCancellable, budget: budgetValue }
          : { postcode, street: street || undefined, houseNumber: houseNumber || undefined, people: Number(people), usage, monthlyCancellable, budget: budgetValue };
      setResult(await apiFetch<AdvisorResult>(`/api/advisor/${kind}`, { method: "POST", body }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : String(err));
      setResult(null);
    }
    setIsLoading(false);
  }

  function reasonText(reason: Reason) {
    const params = { ...reason.params };
    if (typeof params.difference === "number") params.amount = formatPrice(params.difference);
    if (typeof params.score === "number") params.score = params.score.toLocaleString(i18n.language === "en" ? "en-IE" : "de-DE", { minimumFractionDigits: 1 });
    if (typeof params.criterion === "string") params.criterion = t(`advisor.criteria.${params.criterion}`);
    return t(`advisor.reasons.${reason.code}`, params);
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      <Seo title={t("advisor.title")} description={t("advisor.subtitle")} />
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Sparkles className="w-6 h-6 text-[#023e8a]" />
          {t("advisor.title")}
        </h1>
        <p className="text-gray-600">{t("advisor.subtitle")}</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div role="tablist" className="flex border-b">
          {(
            [
              ["mobile", t("advisor.tabMobile"), <Smartphone key="m" className="w-4 h-4" />],
              ["home", t("advisor.tabHome"), <Wifi key="h" className="w-4 h-4" />],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={kind === id}
              onClick={() => {
                setKind(id);
                setResult(null);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold ${
                kind === id ? "text-[#023e8a] border-b-2 border-[#023e8a]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-5 space-y-4" role="tabpanel">
          {kind === "mobile" ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label={t("advisor.dataGB")}>
                <select className={selectClass} value={dataGB} onChange={(e) => setDataGB(e.target.value)}>
                  {["3", "5", "10", "20", "40", "80"].map((value) => (
                    <option key={value} value={value}>
                      {value} GB
                    </option>
                  ))}
                  <option value="unlimited">{t("advisor.unlimited")}</option>
                </select>
              </Field>
              <Field label={t("advisor.planType")}>
                <select className={selectClass} value={planType} onChange={(e) => setPlanType(e.target.value)}>
                  <option value="any">{t("advisor.any")}</option>
                  <option value="prepaid">{t("offer.prepaid")}</option>
                  <option value="contract">{t("offer.contract")}</option>
                </select>
              </Field>
              <Field label={t("advisor.budget")}>
                <Input inputMode="decimal" placeholder="15" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </Field>
              <div className="sm:col-span-3 flex flex-wrap gap-x-6 gap-y-2">
                <Toggle label={t("advisor.unlimitedCalls")} checked={unlimitedCalls} onChange={setUnlimitedCalls} />
                <Toggle label={t("advisor.need5G")} checked={need5G} onChange={setNeed5G} />
                <Toggle label={t("advisor.monthlyCancellable")} checked={monthlyCancellable} onChange={setMonthlyCancellable} />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label={t("home.postcode")}>
                <Input inputMode="numeric" maxLength={5} required placeholder="10115" value={postcode} onChange={(e) => setPostcode(e.target.value.replace(/\D/g, ""))} />
              </Field>
              <Field label={t("availability.street")}>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} />
              </Field>
              <Field label={t("availability.houseNumber")}>
                <Input value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
              </Field>
              <Field label={t("advisor.people")}>
                <select className={selectClass} value={people} onChange={(e) => setPeople(e.target.value)}>
                  {["1", "2", "3", "4", "5", "6"].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </Field>
              <fieldset className="sm:col-span-4">
                <legend className="mb-1 text-sm font-medium text-gray-700">{t("advisor.usage")}</legend>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {USAGES.map((value) => (
                    <Toggle
                      key={value}
                      label={t(`advisor.usages.${value}`)}
                      checked={usage.includes(value)}
                      onChange={(on) => setUsage((prev) => (on ? [...prev, value] : prev.filter((u) => u !== value)))}
                    />
                  ))}
                </div>
              </fieldset>
              <Field label={t("advisor.budget")}>
                <Input inputMode="decimal" placeholder="40" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </Field>
              <div className="sm:col-span-3 flex items-end">
                <Toggle label={t("advisor.monthlyCancellable")} checked={monthlyCancellable} onChange={setMonthlyCancellable} />
              </div>
            </div>
          )}
          <Button type="submit" size="lg" disabled={isLoading || (kind === "home" && postcode.length !== 5)}>
            {t("advisor.submit")}
          </Button>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        </form>
      </Card>

      {result && (
        <section className="space-y-4" aria-live="polite">
          <h2 className="text-xl font-bold">{t("advisor.results")}</h2>
          {result.needs.minDownloadMbps !== undefined && (
            <p className="text-gray-700">
              {t("advisor.needsHome", { down: result.needs.minDownloadMbps })}
              {result.needs.minUploadMbps ? t("advisor.needsUpload", { up: result.needs.minUploadMbps }) : ""}.
            </p>
          )}
          {result.relaxed.length > 0 && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              {t("advisor.relaxed", { list: result.relaxed.map((key) => t(`advisor.criteria.${key}`)).join(", ") })}
            </p>
          )}
          {result.recommendations.length === 0 && <p className="text-gray-600">{t("advisor.noResults")}</p>}
          {result.recommendations.map(({ offer, labels, reasons }) => (
            <div key={offer._id} className="space-y-2">
              <OfferCard
                kind={kind}
                offer={offer}
                highlights={labels.map((label) => t(`advisor.labels.${label}`))}
                {...(kind === "home" ? homeOfferFacts(offer as HomePlanType) : mobileOfferFacts(offer as MobilePlanType))}
              />
              <ul className="flex flex-wrap gap-x-5 gap-y-1 px-2 text-sm">
                {reasons.map((reason, index) => (
                  <li key={index} className={`flex items-center gap-1 ${NEGATIVE.has(reason.code) ? "text-amber-800" : "text-gray-700"}`}>
                    {NEGATIVE.has(reason.code) ? <X className="w-4 h-4" /> : <Check className="w-4 h-4 text-emerald-600" />}
                    {reasonText(reason)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
