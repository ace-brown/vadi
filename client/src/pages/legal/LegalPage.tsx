import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import Seo from "@/components/common/Seo";

// Wrapper for legal texts, which are written out per language
export default function LegalPage({
  title,
  de,
  en,
}: {
  title: { de: string; en: string };
  de: React.ReactNode;
  en: React.ReactNode;
}) {
  const { i18n } = useTranslation();
  const isGerman = i18n.language !== "en";
  const heading = isGerman ? title.de : title.en;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <Seo title={heading} />
      <Card className="p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6">{heading}</h1>
        <div className="space-y-4 text-gray-800 leading-relaxed [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-blue-700 [&_a]:underline">
          {isGerman ? de : en}
        </div>
      </Card>
    </div>
  );
}
