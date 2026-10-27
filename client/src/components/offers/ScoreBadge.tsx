import { useTranslation } from "react-i18next";
import { gradeName } from "./offer-details";

// "Vadi-Note 1,8 gut": the grade with its name, never color alone
export default function ScoreBadge({ score, large = false }: { score?: number | null; large?: boolean }) {
  const { t, i18n } = useTranslation();
  if (score === null || score === undefined) return null;
  const value = score.toLocaleString(i18n.language === "en" ? "en-IE" : "de-DE", { minimumFractionDigits: 1 });

  return (
    <span
      className={`inline-flex flex-col items-center justify-center rounded-lg border border-[#023e8a]/30 bg-blue-50 text-[#023e8a] leading-tight ${
        large ? "px-4 py-2" : "px-2 py-1"
      }`}
      title={t("score.explain")}
    >
      <span className={`${large ? "text-[11px]" : "text-[10px]"} uppercase tracking-wide text-gray-600`}>{t("score.label")}</span>
      <span className={`${large ? "text-2xl" : "text-lg"} font-extrabold`}>{value}</span>
      <span className={`${large ? "text-xs" : "text-[10px]"} text-gray-600`}>{gradeName(score)}</span>
    </span>
  );
}
