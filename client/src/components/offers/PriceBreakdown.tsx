import { useTranslation } from "react-i18next";
import { OfferType } from "@/types";
import { formatPrice } from "@/utils/helpers";

const MONTHS = 24;

// How the effective price is put together, line by line
export default function PriceBreakdown({ offer }: { offer: OfferType }) {
  const { t } = useTranslation();
  const promoMonths = offer.regularPrice !== null ? Math.min(offer.promoMonths, MONTHS) : 0;
  const rows: { label: string; detail?: string; amount: number }[] = [];

  if (promoMonths > 0 && offer.regularPrice !== null) {
    rows.push({
      label: t("offer.monthsRange", { from: 1, to: promoMonths }),
      detail: `${promoMonths} × ${formatPrice(offer.monthlyPrice)}`,
      amount: promoMonths * offer.monthlyPrice,
    });
    if (promoMonths < MONTHS) {
      rows.push({
        label: t("offer.monthsRange", { from: promoMonths + 1, to: MONTHS }),
        detail: `${MONTHS - promoMonths} × ${formatPrice(offer.regularPrice)}`,
        amount: (MONTHS - promoMonths) * offer.regularPrice,
      });
    }
  } else {
    rows.push({
      label: t("offer.monthsRange", { from: 1, to: MONTHS }),
      detail: `${MONTHS} × ${formatPrice(offer.monthlyPrice)}`,
      amount: MONTHS * offer.monthlyPrice,
    });
  }
  if (offer.setupFee > 0) rows.push({ label: t("offer.setupFee"), amount: offer.setupFee });
  if (offer.hardwareFee > 0) rows.push({ label: t("offer.hardwareFee"), amount: offer.hardwareFee });
  if (offer.bonus > 0) rows.push({ label: t("offer.bonus"), amount: -offer.bonus });

  return (
    <table className="w-full text-sm">
      <caption className="text-left font-semibold mb-2">{t("offer.breakdown")}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b">
            <th scope="row" className="py-2 font-normal text-left">
              {row.label}
              {row.detail && <span className="block text-xs text-gray-500">{row.detail}</span>}
            </th>
            <td className={`py-2 text-right tabular-nums ${row.amount < 0 ? "text-emerald-700" : ""}`}>
              {row.amount < 0 ? `−${formatPrice(-row.amount)}` : formatPrice(row.amount)}
            </td>
          </tr>
        ))}
        <tr className="border-b font-semibold">
          <th scope="row" className="py-2 text-left">{t("offer.total24")}</th>
          <td className="py-2 text-right tabular-nums">{formatPrice(offer.totalCost24)}</td>
        </tr>
        <tr className="font-bold text-base">
          <th scope="row" className="py-2 text-left">
            {t("offer.effective")}
            <span className="block text-xs font-normal text-gray-500">{t("offer.effectiveHint")}</span>
          </th>
          <td className="py-2 text-right tabular-nums">{formatPrice(offer.effectiveMonthlyPrice)}</td>
        </tr>
      </tbody>
    </table>
  );
}
