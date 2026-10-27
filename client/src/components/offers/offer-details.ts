import i18n from "@/i18n";
import { HomePlanType, MobilePlanType, OfferType } from "@/types";
import { formatDate, formatNumber, formatTerm } from "@/utils/helpers";

// The facts shown for each kind of offer, used by cards, the detail page and the compare table
export function homeOfferFacts(offer: HomePlanType) {
  const t = i18n.t;
  return {
    tags: [offer.connectionType],
    stats: [
      { label: t("offer.download"), value: `${formatNumber(offer.downloadMbps)} Mbit/s` },
      { label: t("offer.upload"), value: `${formatNumber(offer.uploadMbps)} Mbit/s` },
      { label: t("offer.term"), value: formatTerm(offer.termMonths) },
      { label: t("offer.connection"), value: offer.connectionType },
    ],
  };
}

export function mobileOfferFacts(offer: MobilePlanType) {
  const t = i18n.t;
  return {
    tags: [offer.network, offer.contractType === "prepaid" ? t("offer.prepaid") : t("offer.contract")],
    stats: [
      {
        label: t("offer.data"),
        value: offer.dataGB === null ? t("offer.unlimited") : `${formatNumber(offer.dataGB)} GB`,
      },
      {
        label: t("offer.calls"),
        value: offer.minutes === null ? t("offer.unlimited") : t("offer.minutes", { count: offer.minutes }),
      },
      { label: t("offer.term"), value: formatTerm(offer.termMonths) },
      { label: t("offer.network"), value: offer.network },
    ],
  };
}

// Labels like "Cheapest" for the best offers in the current results
export function highlightsFor<T extends OfferType>(items: T[], extra: { label: string; pick: (items: T[]) => T | undefined }[]) {
  const labels: Record<string, string[]> = {};
  if (items.length < 2) return labels;

  const add = (offer: T | undefined, label: string) => {
    if (offer) (labels[offer._id] ||= []).push(label);
  };
  add(
    items.reduce((best, item) => (item.effectiveMonthlyPrice < best.effectiveMonthlyPrice ? item : best)),
    i18n.t("offer.cheapest")
  );
  extra.forEach(({ label, pick }) => add(pick(items), label));
  return labels;
}

// Name of a Vadi score, like German school grades
export function gradeName(score: number) {
  const key = score <= 1.5 ? "veryGood" : score <= 2.5 ? "good" : score <= 3.5 ? "satisfactory" : score <= 4.5 ? "sufficient" : "poor";
  return i18n.t(`score.grades.${key}`);
}

// A price drop in the last 30 days, worth pointing out
export function recentPriceDrop(offer: OfferType) {
  if (!offer.previousEffectiveMonthlyPrice || !offer.priceChangedAt) return null;
  const days = (Date.now() - new Date(offer.priceChangedAt).getTime()) / (24 * 60 * 60 * 1000);
  return offer.previousEffectiveMonthlyPrice > offer.effectiveMonthlyPrice && days <= 30
    ? offer.previousEffectiveMonthlyPrice
    : null;
}

// Most recent "prices checked" date among the offers
export function lastCheckedNotice(items: OfferType[]) {
  const dates = items
    .map((item) => item.lastCheckedAt)
    .filter((value): value is string => !!value)
    .sort();
  return dates.length > 0
    ? i18n.t("common.pricesChecked", { date: formatDate(dates[dates.length - 1]) })
    : null;
}
