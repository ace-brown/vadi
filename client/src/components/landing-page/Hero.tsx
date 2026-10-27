import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Smartphone, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "home" | "mobile";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-left">
      <span className="block mb-1 text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full border rounded-lg px-3 py-2 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";

// Short questionnaire that goes straight to the matching results
export default function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("home");
  const [postcode, setPostcode] = useState("");
  const [speed, setSpeed] = useState("");
  const [term, setTerm] = useState("");
  const [data, setData] = useState("");
  const [contractType, setContractType] = useState("");
  const [network, setNetwork] = useState("");

  const postcodeInvalid = postcode !== "" && !/^\d{5}$/.test(postcode);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const add = (key: string, value: string) => value && params.set(key, value);
    if (tab === "home") {
      if (postcodeInvalid) return;
      add("postcode", postcode);
      add("downloadMbpsMin", speed);
      add("termMonths", term);
      navigate(`/internet/home-tariff?${params}`);
    } else {
      add("dataGBMin", data);
      add("contractType", contractType);
      add("network", network);
      navigate(`/internet/mobile-tariff?${params}`);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: t("home.tabHome"), icon: <Wifi className="w-4 h-4" /> },
    { id: "mobile", label: t("home.tabMobile"), icon: <Smartphone className="w-4 h-4" /> },
  ];

  return (
    <section className="text-center pt-12 pb-8 px-4">
      <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{t("home.title")}</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">{t("home.subtitle")}</p>

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border">
        <div role="tablist" className="flex border-b">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 font-semibold transition ${
                tab === id ? "text-[#023e8a] border-b-2 border-[#023e8a]" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="p-5 grid gap-4 sm:grid-cols-3 items-end" role="tabpanel">
          {tab === "home" ? (
            <>
              <Field label={t("home.postcode")}>
                <Input
                  inputMode="numeric"
                  maxLength={5}
                  placeholder={t("filters.postcodePlaceholder")}
                  value={postcode}
                  aria-invalid={postcodeInvalid}
                  onChange={(e) => setPostcode(e.target.value.replace(/\D/g, ""))}
                />
              </Field>
              <Field label={t("home.speed")}>
                <select className={selectClass} value={speed} onChange={(e) => setSpeed(e.target.value)}>
                  <option value="">{t("common.any")}</option>
                  {["16", "50", "100", "250", "500", "1000"].map((value) => (
                    <option key={value} value={value}>
                      {value} Mbit/s
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("home.term")}>
                <select className={selectClass} value={term} onChange={(e) => setTerm(e.target.value)}>
                  <option value="">{t("home.termAny")}</option>
                  <option value="1">{t("home.termMonthly")}</option>
                </select>
              </Field>
            </>
          ) : (
            <>
              <Field label={t("home.data")}>
                <select className={selectClass} value={data} onChange={(e) => setData(e.target.value)}>
                  <option value="">{t("common.any")}</option>
                  {["5", "10", "20", "50", "100"].map((value) => (
                    <option key={value} value={value}>
                      {t("common.atLeast", { value: `${value} GB` })}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("home.contractType")}>
                <select className={selectClass} value={contractType} onChange={(e) => setContractType(e.target.value)}>
                  <option value="">{t("common.any")}</option>
                  <option value="prepaid">{t("offer.prepaid")}</option>
                  <option value="contract">{t("offer.contract")}</option>
                </select>
              </Field>
              <Field label={t("home.network")}>
                <select className={selectClass} value={network} onChange={(e) => setNetwork(e.target.value)}>
                  <option value="">{t("common.any")}</option>
                  <option value="5G">5G</option>
                  <option value="4G">4G</option>
                </select>
              </Field>
            </>
          )}
          <div className="sm:col-span-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <Button type="submit" size="lg" className="sm:w-auto w-full" disabled={postcodeInvalid}>
              {t("home.search")}
            </Button>
            {tab === "home" && (
              <p className={`text-xs text-left ${postcodeInvalid ? "text-red-600" : "text-gray-500"}`}>
                {postcodeInvalid ? t("filters.postcodeInvalid") : t("home.postcodeHint")}
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
