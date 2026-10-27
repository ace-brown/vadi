import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import Seo from "@/components/common/Seo";

// Where "Go to offer" lands for sample offers that have no partner link yet
export default function PartnerRedirectPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const name = [params.get("provider"), params.get("offer")].filter(Boolean).join(" ");

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 space-y-3">
      <Seo title={t("partner.title")} />
      <meta name="robots" content="noindex" />
      <h1 className="flex items-center gap-2 text-xl font-bold">
        <Info className="w-5 h-5 text-blue-700" />
        {t("partner.title")}
      </h1>
      {name && <p className="font-medium">{name}</p>}
      <p className="text-gray-700">{t("partner.text")}</p>
      <Link to="/" className="text-blue-700 hover:underline">
        {t("partner.back")}
      </Link>
    </Card>
  );
}
