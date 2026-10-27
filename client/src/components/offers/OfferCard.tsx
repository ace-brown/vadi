import { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CardImage, Rating, Stat } from "@/components/listing/shared";
import { CompareContext } from "@/context/compare-context";
import { goToOfferUrl } from "@/lib/api";
import { OfferKind, OfferType } from "@/types";
import { formatPrice } from "@/utils/helpers";
import SaveButton from "./SaveButton";
import ScoreBadge from "./ScoreBadge";
import { recentPriceDrop } from "./offer-details";

type Props = {
  kind: OfferKind;
  offer: OfferType;
  tags: string[];
  stats: { label: string; value: string }[];
  highlights?: string[];
};

export function PriceLines({ offer }: { offer: OfferType }) {
  const { t } = useTranslation();
  const oneOff = offer.setupFee + offer.hardwareFee;
  return (
    <>
      <p className="text-xs text-gray-600">
        {offer.promoMonths > 0 && offer.regularPrice !== null
          ? t("offer.promo", {
              price: formatPrice(offer.monthlyPrice),
              months: offer.promoMonths,
              after: formatPrice(offer.regularPrice),
            })
          : `${t("offer.monthlyPrice")}: ${formatPrice(offer.monthlyPrice)}`}
      </p>
      <p className="text-xs text-gray-600">
        {oneOff > 0 ? t("offer.oneOff", { price: formatPrice(oneOff) }) : t("offer.noSetupFee")}
        {offer.bonus > 0 && ` · ${t("offer.bonus")}: −${formatPrice(offer.bonus)}`}
      </p>
    </>
  );
}

export function GoToOfferButton({ kind, offer, className }: { kind: OfferKind; offer: OfferType; className?: string }) {
  const { t } = useTranslation();
  return (
    <Button asChild className={className}>
      <a href={goToOfferUrl(kind, offer._id)} target="_blank" rel="sponsored nofollow noopener">
        {t("common.goToOffer")}
        <ExternalLink className="w-4 h-4" />
      </a>
    </Button>
  );
}

export default function OfferCard({ kind, offer, tags, stats, highlights = [] }: Props) {
  const { t } = useTranslation();
  const { selected, toggle } = useContext(CompareContext);
  const provider = offer.providerId;
  const isSelected = selected[kind].includes(offer._id);
  const detailsPath = `/internet/${kind === "home" ? "home-tariff" : "mobile-tariff"}/${offer._id}`;
  const droppedFrom = recentPriceDrop(offer);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {(highlights.length > 0 || droppedFrom) && (
        <div className="flex flex-wrap gap-2 -mt-1 mb-1">
          {highlights.map((label) => (
            <Badge key={label} className="bg-emerald-600 text-white border-transparent">
              {label}
            </Badge>
          ))}
          {droppedFrom && (
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
              ↓ {t("offer.priceDropped")} · {t("offer.priceWas", { price: formatPrice(droppedFrom) })}
            </Badge>
          )}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex gap-4 flex-1 min-w-0">
          <div className="flex flex-col items-center gap-2 shrink-0">
            <CardImage src={provider?.logo} alt={`${offer.provider} logo`} contain />
            <ScoreBadge score={offer.score} />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                {offer.provider}
                <Rating value={provider?.rating} />
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">
                  <Link to={detailsPath} className="hover:underline">
                    {offer.name}
                  </Link>
                </h2>
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <Stat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-[#023e8a]"
                  checked={isSelected}
                  onChange={() => {
                    if (!toggle(kind, offer._id)) toast.info(t("offer.compareLimit"));
                  }}
                />
                {t("offer.compare")}
              </label>
              <Link to={detailsPath} className="text-blue-700 hover:underline">
                {t("common.details")}
              </Link>
              <SaveButton kind={kind} offerId={offer._id} withLabel />
            </div>
          </div>
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:min-w-[190px] border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
          <div className="md:text-right">
            <p className="text-xs text-gray-500" title={t("offer.effectiveHint")}>
              {t("offer.effective")}
            </p>
            <p className="text-2xl font-extrabold text-gray-900">
              {formatPrice(offer.effectiveMonthlyPrice)}
              <span className="text-sm font-normal text-gray-500"> {t("common.perMonth")}</span>
            </p>
            <PriceLines offer={offer} />
          </div>
          <GoToOfferButton kind={kind} offer={offer} />
        </div>
      </div>
    </Card>
  );
}
