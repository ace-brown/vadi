import { useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CornerUpLeft, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardImage, Rating, Stat } from "@/components/listing/shared";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";
import { GoToOfferButton } from "@/components/offers/OfferCard";
import PriceBreakdown from "@/components/offers/PriceBreakdown";
import Reviews from "@/components/offers/Reviews";
import { homeOfferFacts, lastCheckedNotice, mobileOfferFacts } from "@/components/offers/offer-details";
import Seo from "@/components/common/Seo";
import SaveButton from "@/components/offers/SaveButton";
import ScoreBreakdown from "@/components/offers/ScoreBreakdown";
import PriceHistoryChart from "@/components/offers/PriceHistoryChart";
import PriceAlertBox from "@/components/offers/PriceAlertBox";
import { CompareContext } from "@/context/compare-context";
import { useApi } from "@/lib/api";
import { HomePlanType, MobilePlanType, OfferKind } from "@/types";
import { formatPrice } from "@/utils/helpers";

const ENDPOINTS: Record<OfferKind, string> = {
  home: "/api/internet/home-tariffs",
  mobile: "/api/internet/mobile-tariffs",
};
const RESULTS_PATHS: Record<OfferKind, string> = {
  home: "/internet/home-tariff",
  mobile: "/internet/mobile-tariff",
};

export default function OfferDetailPage({ kind }: { kind: OfferKind }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { selected, toggle } = useContext(CompareContext);
  const { data, error, isLoading } = useApi<{ item: HomePlanType | MobilePlanType }>(`${ENDPOINTS[kind]}/${id}`);
  const offer = data?.item;

  const back = (
    <Link to={RESULTS_PATHS[kind]} className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline">
      <CornerUpLeft className="w-4 h-4" />
      {t("offer.backToResults")}
    </Link>
  );

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto mt-6">
        <ListingCardSkeleton />
      </div>
    );
  }
  if (error || !offer) {
    return (
      <div className="max-w-5xl mx-auto mt-10 text-center space-y-4">
        <p className="text-lg text-gray-600">{error?.status === 404 ? t("offer.notFound") : error?.message}</p>
        {back}
      </div>
    );
  }

  const facts = kind === "home" ? homeOfferFacts(offer as HomePlanType) : mobileOfferFacts(offer as MobilePlanType);
  const provider = offer.providerId;
  const checked = lastCheckedNotice([offer]);
  const coverage = kind === "home" ? (offer as HomePlanType).coverage : null;

  return (
    <div className="max-w-5xl mx-auto mt-6 space-y-6">
      <Seo
        title={`${offer.provider} ${offer.name}`}
        description={`${t("offer.effective")}: ${formatPrice(offer.effectiveMonthlyPrice)} ${t("common.perMonth")}`}
      />
      {back}

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 flex-1">
            <CardImage src={provider?.logo} alt={`${offer.provider} logo`} contain />
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-500">
                {offer.provider}
                <Rating value={provider?.rating} />
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{offer.name}</h1>
                {facts.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {facts.stats.map((stat) => (
                  <Stat key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>
              {coverage && (
                <p className="flex items-start gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    {coverage.nationwide ? t("offer.coverageNationwide") : t("offer.coverageRegional")}.{" "}
                    {t("offer.availabilityNote")}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="md:w-64 md:border-l md:pl-6 space-y-3">
            <div>
              <p className="text-xs text-gray-500">{t("offer.effective")}</p>
              <p className="text-3xl font-extrabold">
                {formatPrice(offer.effectiveMonthlyPrice)}
                <span className="text-sm font-normal text-gray-500"> {t("common.perMonth")}</span>
              </p>
              <p className="text-xs text-gray-500">{t("offer.effectiveHint")}</p>
            </div>
            <GoToOfferButton kind={kind} offer={offer} className="w-full" />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (!toggle(kind, offer._id)) toast.info(t("offer.compareLimit"));
              }}
            >
              {selected[kind].includes(offer._id) ? `✓ ${t("offer.compare")}` : t("offer.compare")}
            </Button>
            <div className="flex justify-center">
              <SaveButton kind={kind} offerId={offer._id} withLabel />
            </div>
            <p className="text-xs text-gray-500">
              {checked && `${checked}. `}
              {t("common.vatNote")}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card className="p-6 min-w-0">
          <PriceHistoryChart kind={kind} offerId={offer._id} />
        </Card>
        <Card className="p-6">
          <PriceAlertBox kind={kind} offerId={offer._id} currentPrice={offer.effectiveMonthlyPrice} />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <PriceBreakdown offer={offer} />
        </Card>
        <Card className="p-6">
          <ScoreBreakdown offer={offer} />
        </Card>
        {provider && (
          <Card className="p-6 space-y-3">
            <h2 className="font-semibold">{t("offer.provider")}</h2>
            {provider.description && <p className="text-sm text-gray-700">{provider.description}</p>}
            <dl className="text-sm space-y-2">
              {provider.legalName && (
                <div>
                  <dt className="text-gray-500">{t("offer.legalName")}</dt>
                  <dd>{provider.legalName}</dd>
                </div>
              )}
              {provider.rating !== undefined && (
                <div>
                  <dt className="text-gray-500">{t("offer.editorialRating")}</dt>
                  <dd>
                    <Rating value={provider.rating} />
                    {provider.ratingSource && <span className="block text-xs text-gray-500">{provider.ratingSource}</span>}
                  </dd>
                </div>
              )}
            </dl>
            <div className="flex flex-wrap gap-4 text-sm">
              {provider.website && (
                <a href={provider.website} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                  {t("offer.website")} <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {provider.imprintUrl && (
                <a href={provider.imprintUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue-700 hover:underline">
                  {t("offer.imprint")} <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </Card>
        )}
      </div>

      {provider && (
        <Card className="p-6">
          <Reviews providerId={provider._id} />
        </Card>
      )}
    </div>
  );
}
