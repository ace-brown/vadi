import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import { Button } from "@/components/ui/button";
import { LimitSlider } from "@/components/listing/filters";
import OfferCard from "@/components/offers/OfferCard";
import CompareBar from "@/components/offers/CompareBar";
import { highlightsFor, lastCheckedNotice, mobileOfferFacts } from "@/components/offers/offer-details";
import Seo from "@/components/common/Seo";
import { useListing } from "@/hooks/use-listing";
import { useUrlParams } from "@/hooks/use-url-params";
import { MobilePlanType } from "@/types";
import { formatPrice, toggleValue } from "@/utils/helpers";

const PAGE_SIZE = 20;

export default function MobileTariffPage() {
  const { t } = useTranslation();
  const url = useUrlParams();
  const contractTypes = url.getList("contractType");
  const terms = url.getList("termMonths");
  const networks = url.getList("network");
  const minData = url.getNumber("dataGBMin");
  const maxPrice = url.getNumber("effectiveMonthlyPriceMax");
  const sort = url.get("sort") || "effectiveMonthlyPrice";
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { items, total, ranges, facets, isLoading, error, retry } = useListing<MobilePlanType>(
    "/api/internet/mobile-tariffs",
    {
      contractType: contractTypes.join(","),
      termMonths: terms.join(","),
      network: networks.join(","),
      dataGBMin: minData,
      effectiveMonthlyPriceMax: maxPrice,
      sort,
      limit,
    }
  );

  const isAnyFilterActive =
    contractTypes.length > 0 || terms.length > 0 || networks.length > 0 || minData !== null || maxPrice !== null;

  function resetFilters() {
    url.set({ contractType: null, termMonths: null, network: null, dataGBMin: null, effectiveMonthlyPriceMax: null });
  }

  const highlights = highlightsFor(items, [
    {
      label: t("offer.mostData"),
      pick: (list) =>
        list.find((item) => item.dataGB === null) ??
        list.reduce((best, item) => ((item.dataGB ?? 0) > (best.dataGB ?? 0) ? item : best)),
    },
  ]);

  const filters = (
    <>
      <FilterSelect
        value={sort}
        onChange={(value) => url.set({ sort: value === "effectiveMonthlyPrice" ? null : value })}
        options={[
          { value: "effectiveMonthlyPrice", label: t("filters.sort.effective") },
          { value: "-effectiveMonthlyPrice", label: t("filters.sort.effectiveDesc") },
          { value: "monthlyPrice", label: t("filters.sort.monthly") },
          { value: "setupFee", label: t("filters.sort.setupFee") },
          { value: "score", label: t("filters.sort.score") },
        ]}
      />
      <FilterCollapse label={t("filters.priceAndData")}>
        <LimitSlider
          kind="max"
          label={t("filters.maxEffective")}
          range={ranges.effectiveMonthlyPrice}
          value={maxPrice}
          onChange={(value) => url.set({ effectiveMonthlyPriceMax: value })}
          format={formatPrice}
        />
        <LimitSlider
          kind="min"
          label={t("filters.minData")}
          range={ranges.dataGB}
          value={minData}
          onChange={(value) => url.set({ dataGBMin: value })}
          step={5}
          format={(v) => `${v} GB`}
        />
      </FilterCollapse>
      <FilterCollapse
        label={t("filters.planType")}
        options={[
          { value: "prepaid", label: t("offer.prepaid") },
          { value: "contract", label: t("offer.contract") },
        ].map((option) => ({ ...option, count: facets.contractType?.[option.value] ?? 0 }))}
        selectedValues={contractTypes}
        onChange={(value) => url.set({ contractType: toggleValue(contractTypes, value) })}
      />
      <FilterCollapse
        label={t("filters.minTerm")}
        options={[
          { value: "1", label: t("term.monthly") },
          { value: "12", label: t("term.months", { count: 12 }) },
          { value: "24", label: t("term.months", { count: 24 }) },
        ].map((option) => ({ ...option, count: facets.termMonths?.[option.value] ?? 0 }))}
        selectedValues={terms}
        onChange={(value) => url.set({ termMonths: toggleValue(terms, value) })}
      />
      <FilterCollapse
        label={t("filters.network")}
        options={[
          { value: "5G", label: "5G" },
          { value: "4G", label: "4G" },
        ].map((option) => ({ ...option, count: facets.network?.[option.value] ?? 0 }))}
        selectedValues={networks}
        onChange={(value) => url.set({ network: toggleValue(networks, value) })}
      />
    </>
  );

  const checked = lastCheckedNotice(items);

  return (
    <>
      <Seo title={t("nav.mobilePlans")} description={t("home.subtitle")} />
      <CustomCompareLayout
        title={t("nav.mobilePlans")}
        filters={filters}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        total={total}
        isAnyFilterActive={isAnyFilterActive}
        onResetFilters={resetFilters}
        notice={
          <>
            {checked && `${checked} · `}
            {t("common.vatNote")} ·{" "}
            <Link to="/how-we-compare" className="text-blue-700 hover:underline">
              {t("common.howSorted")}
            </Link>
          </>
        }
        footer={
          items.length < total && (
            <Button variant="outline" className="self-center" onClick={() => setLimit((value) => value + PAGE_SIZE)}>
              {t("common.showMore")}
            </Button>
          )
        }
      >
        {items.map((offer) => (
          <OfferCard
            key={offer._id}
            kind="mobile"
            offer={offer}
            highlights={highlights[offer._id]}
            {...mobileOfferFacts(offer)}
          />
        ))}
      </CustomCompareLayout>
      <CompareBar kind="mobile" />
    </>
  );
}
