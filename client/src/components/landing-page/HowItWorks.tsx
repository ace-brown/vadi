import { useTranslation } from "react-i18next";
import { BadgeCheck, Calculator, ExternalLink, HandCoins, ListChecks, Scale } from "lucide-react";

type Item = { title: string; text: string };

export default function HowItWorks() {
  const { t } = useTranslation();
  const steps = t("home.steps", { returnObjects: true }) as Item[];
  const trust = t("home.trust", { returnObjects: true }) as Item[];
  const stepIcons = [ListChecks, Calculator, ExternalLink];
  const trustIcons = [Scale, BadgeCheck, HandCoins];

  return (
    <>
      <section className="py-12 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{t("home.howTitle")}</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
          {steps.map((step, index) => {
            const Icon = stepIcons[index];
            return (
              <li key={step.title} className="flex flex-col items-center gap-3">
                <Icon className="w-10 h-10 text-[#023e8a]" />
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </li>
            );
          })}
        </ol>
      </section>
      <section className="py-12 px-4 bg-white rounded-2xl border max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">{t("home.trustTitle")}</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {trust.map((item, index) => {
            const Icon = trustIcons[index];
            return (
              <li key={item.title} className="flex flex-col items-center gap-3">
                <Icon className="w-8 h-8 text-emerald-600" />
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.text}</p>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
