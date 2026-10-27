import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { OfferType } from "@/types";
import ScoreBadge from "./ScoreBadge";

const PARTS = [
  { key: "price", weight: 50 },
  { key: "performance", weight: 30 },
  { key: "flexibility", weight: 10 },
  { key: "provider", weight: 10 },
] as const;

// The grade and how each part contributed (0–100 per part)
export default function ScoreBreakdown({ offer }: { offer: OfferType }) {
  const { t } = useTranslation();
  if (offer.score === null || offer.score === undefined || !offer.scoreDetails) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-4">
        <ScoreBadge score={offer.score} large />
        <p className="text-xs text-gray-600">
          {t("score.explain")}{" "}
          <Link to="/how-we-compare" className="text-blue-700 hover:underline">
            {t("common.howSorted")}
          </Link>
        </p>
      </div>
      <dl className="space-y-2">
        {PARTS.map(({ key, weight }) => {
          const value = offer.scoreDetails![key];
          return (
            <div key={key} className="grid grid-cols-[110px_1fr_40px] items-center gap-3 text-sm">
              <dt className="text-gray-700">
                {t(`score.parts.${key}`)} <span className="text-xs text-gray-500">{weight}%</span>
              </dt>
              <dd className="h-2 rounded-full bg-blue-100" aria-hidden>
                <div className="h-2 rounded-full bg-[#0077b6]" style={{ width: `${value}%` }} />
              </dd>
              <dd className="text-right tabular-nums text-gray-700">{value}</dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
