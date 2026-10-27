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
