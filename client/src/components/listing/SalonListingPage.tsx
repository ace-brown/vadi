import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import { useListing } from "@/hooks/use-listing";
import { PlaceType } from "@/types";
import { formatPrice } from "@/utils/helpers";
import SalonCard, { SalonService } from "./SalonCard";
import { LimitSlider, LocationFilter, SearchFilter } from "./filters";

type Props = {
  endpoint: string;
  title: string;
  services: SalonService[];
  returnTxt?: string;
  returnSlug?: string;
};

type Salon = PlaceType & Record<string, unknown>;

export default function SalonListingPage({
  endpoint,
  title,
  services,
  returnTxt,
  returnSlug,
}: Props) {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(services[0].field);
  const [maxPrices, setMaxPrices] = useState<Record<string, number | null>>({});

  const priceParams: Record<string, number | null> = {};
  Object.entries(maxPrices).forEach(([field, max]) => {
    priceParams[`${field}Max`] = max;
  });

  const { items, total, ranges, isLoading, error, retry } = useListing<Salon>(
    endpoint,
    { state, city, q: query, sort, ...priceParams }
  );

  const isAnyFilterActive =
    !!(state || city || query) || Object.values(maxPrices).some((v) => v !== null);

  function resetFilters() {
    setState("");
    setCity("");
    setQuery("");
    setMaxPrices({});
  }

  const sortOptions = [
    ...services.map(({ field, label }) => ({
      value: field,
      label: `Cheapest ${label.toLowerCase()}`,
    })),
    { value: "-rating", label: "Top rated" },
    { value: "title", label: "Name (A–Z)" },
  ];

  const filters = (
    <>
      <SearchFilter value={query} onChange={setQuery} placeholder="Search by name or street" />
      <FilterSelect value={sort} onChange={setSort} options={sortOptions} />
      <LocationFilter
        state={state}
        city={city}
        onStateChange={setState}
        onCityChange={setCity}
      />
      <FilterCollapse label="Maximum price" defaultOpen={services.length <= 4}>
        <div className="space-y-2">
          {services.map(({ field, label }) => (
            <LimitSlider
              key={field}
              kind="max"
              label={label}
              range={ranges[field]}
              value={maxPrices[field] ?? null}
              onChange={(value) =>
                setMaxPrices((prev) => ({ ...prev, [field]: value }))
              }
              format={formatPrice}
            />
          ))}
        </div>
      </FilterCollapse>
    </>
  );

  return (
    <CustomCompareLayout
      title={city ? `${title} in ${city}` : state ? `${title} in ${state}` : title}
      filters={filters}
      isLoading={isLoading}
      error={error}
      onRetry={retry}
      total={total}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      returnTxt={returnTxt}
      returnSlug={returnSlug}
    >
      {items.map((salon) => (
        <SalonCard
          key={salon._id}
          salon={salon}
          services={services}
          highlight={services.some((s) => s.field === sort) ? sort : undefined}
        />
      ))}
    </CustomCompareLayout>
  );
}
