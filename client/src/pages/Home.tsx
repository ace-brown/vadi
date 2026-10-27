import { useTranslation } from "react-i18next";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import Seo from "@/components/common/Seo";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="max-w-6xl mx-auto pb-8">
      <Seo title={t("home.title")} description={t("home.subtitle")} />
      <Hero />
      <HowItWorks />
    </div>
  );
}
