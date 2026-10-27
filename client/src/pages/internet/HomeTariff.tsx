import { useState } from "react";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import { HomePlanCard } from "@/components/listing/PlanCards";
import { LimitSlider } from "@/components/listing/filters";
import { useListing } from "@/hooks/use-listing";
import { HomePlanType } from "@/types";
import { formatNumber, formatPrice, joinValues, toggleValue } from "@/utils/helpers";

const CONNECTION_OPTIONS = [
  { value: "Fiber", label: "Fiber" },
  { value: "Cable", label: "Cable" },
  { value: "VDSL", label: "VDSL" },
  { value: "DSL", label: "DSL" },
  { value: "LTE", label: "LTE / mobile home internet" },
];

const TERM_OPTIONS = [
  { value: "1", label: "Monthly cancellable" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

const SORT_OPTIONS = [
  { value: "monthlyPrice", label: "Cheapest first" },
  { value: "-monthlyPrice", label: "Most expensive first" },
  { value: "-downloadMbps", label: "Fastest first" },
  { value: "setupFee", label: "Lowest setup fee" },
];

export default function HomeTariffPage() {
  const [connectionTypes, setConnectionTypes] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [minSpeed, setMinSpeed] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState("monthlyPrice");

  const { items, total, ranges, isLoading, error, retry } =
    useListing<HomePlanType>("/api/internet/home-tariffs", {
      connectionType: joinValues(connectionTypes),
      termMonths: joinValues(terms),
      downloadMbpsMin: minSpeed,
      monthlyPriceMax: maxPrice,
      sort,
    });

  const isAnyFilterActive =
    connectionTypes.length > 0 ||
    terms.length > 0 ||
    minSpeed !== null ||
    maxPrice !== null;

  function resetFilters() {
    setConnectionTypes([]);
    setTerms([]);
    setMinSpeed(null);
    setMaxPrice(null);
  }

  const filters = (
    <>
      <FilterSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      <FilterCollapse label="Price & speed">
        <LimitSlider
          kind="max"
          label="Monthly price"
          range={ranges.monthlyPrice}
          value={maxPrice}
          onChange={setMaxPrice}
          format={formatPrice}
        />
        <LimitSlider
          kind="min"
          label="Download speed"
          range={ranges.downloadMbps}
          value={minSpeed}
          onChange={setMinSpeed}
          step={10}
          format={(v) => `${formatNumber(v)} Mbps`}
        />
      </FilterCollapse>
      <FilterCollapse
        label="Connection type"
        options={CONNECTION_OPTIONS}
        selectedValues={connectionTypes}
        onChange={(value) => setConnectionTypes((prev) => toggleValue(prev, value))}
      />
      <FilterCollapse
        label="Minimum term"
        options={TERM_OPTIONS}
        selectedValues={terms}
        onChange={(value) => setTerms((prev) => toggleValue(prev, value))}
      />
    </>
  );

  return (
    <CustomCompareLayout
      title="Home internet"
      filters={filters}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      total={total}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      returnTxt="Back to internet type selection"
      returnSlug="/internet/internet-details-select"
    >
      {items.map((plan) => (
        <HomePlanCard key={plan._id} {...plan} />
      ))}
    </CustomCompareLayout>
  );
}
