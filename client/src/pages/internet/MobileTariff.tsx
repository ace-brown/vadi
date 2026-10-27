import { useState } from "react";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import { MobilePlanCard } from "@/components/listing/PlanCards";
import { LimitSlider } from "@/components/listing/filters";
import { useListing } from "@/hooks/use-listing";
import { MobilePlanType } from "@/types";
import { formatPrice, joinValues, toggleValue } from "@/utils/helpers";

const CONTRACT_OPTIONS = [
  { value: "prepaid", label: "Prepaid" },
  { value: "contract", label: "Contract" },
];

const TERM_OPTIONS = [
  { value: "1", label: "Monthly cancellable" },
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
];

const NETWORK_OPTIONS = [
  { value: "5G", label: "5G" },
  { value: "4G", label: "4G" },
];

const SORT_OPTIONS = [
  { value: "monthlyPrice", label: "Cheapest first" },
  { value: "-monthlyPrice", label: "Most expensive first" },
  { value: "setupFee", label: "Lowest setup fee" },
];

export default function MobileTariffPage() {
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [networks, setNetworks] = useState<string[]>([]);
  const [minData, setMinData] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState("monthlyPrice");

  const { items, total, ranges, isLoading, error, retry } =
    useListing<MobilePlanType>("/api/internet/mobile-tariffs", {
      contractType: joinValues(contractTypes),
      termMonths: joinValues(terms),
      network: joinValues(networks),
      dataGBMin: minData,
      monthlyPriceMax: maxPrice,
      sort,
    });

  const isAnyFilterActive =
    contractTypes.length > 0 ||
    terms.length > 0 ||
    networks.length > 0 ||
    minData !== null ||
    maxPrice !== null;

  function resetFilters() {
    setContractTypes([]);
    setTerms([]);
    setNetworks([]);
    setMinData(null);
    setMaxPrice(null);
  }

  const filters = (
    <>
      <FilterSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      <FilterCollapse label="Price & data">
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
          label="Data per month"
          range={ranges.dataGB}
          value={minData}
          onChange={setMinData}
          step={5}
          format={(v) => `${v} GB`}
        />
      </FilterCollapse>
      <FilterCollapse
        label="Plan type"
        options={CONTRACT_OPTIONS}
        selectedValues={contractTypes}
        onChange={(value) => setContractTypes((prev) => toggleValue(prev, value))}
      />
      <FilterCollapse
        label="Minimum term"
        options={TERM_OPTIONS}
        selectedValues={terms}
        onChange={(value) => setTerms((prev) => toggleValue(prev, value))}
      />
      <FilterCollapse
        label="Network"
        options={NETWORK_OPTIONS}
        selectedValues={networks}
        onChange={(value) => setNetworks((prev) => toggleValue(prev, value))}
      />
    </>
  );

  return (
    <CustomCompareLayout
      title="Mobile plans"
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
        <MobilePlanCard key={plan._id} {...plan} />
      ))}
    </CustomCompareLayout>
  );
}
