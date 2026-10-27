import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import { useListing } from "@/hooks/use-listing";
import { ServicePlaceType } from "@/types";
import PlaceCard from "./PlaceCard";
import { LocationFilter, SearchFilter } from "./filters";

type Props = {
  endpoint: string;
  title: string;
  actionLabel?: string;
  searchPlaceholder?: string;
  returnTxt?: string;
  returnSlug?: string;
};

const SORT_OPTIONS = [
  { value: "-rating", label: "Top rated" },
  { value: "title", label: "Name (A–Z)" },
  { value: "city", label: "City (A–Z)" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "4", label: "4.0 and up" },
  { value: "4.5", label: "4.5 and up" },
];

// Shared page for every category made of places offering services
// (repairs, dentists, bookstores, farm shops...)
export default function PlaceListingPage({
  endpoint,
  title,
  actionLabel = "Contact",
  searchPlaceholder = "Search by name or service",
  returnTxt,
  returnSlug,
}: Props) {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState(searchParams.get("state") ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState("");
  const [sort, setSort] = useState("-rating");

  const { items, total, isLoading, error, retry } = useListing<ServicePlaceType>(
    endpoint,
    { state, city, q: query, ratingMin: minRating, sort }
  );

  const isAnyFilterActive = !!(state || city || query || minRating);

  function resetFilters() {
    setState("");
    setCity("");
    setQuery("");
    setMinRating("");
  }

  const filters = (
    <>
      <SearchFilter value={query} onChange={setQuery} placeholder={searchPlaceholder} />
      <FilterSelect value={sort} onChange={setSort} options={SORT_OPTIONS} />
      <FilterSelect
        label="Rating"
        value={minRating}
        onChange={setMinRating}
        options={RATING_OPTIONS}
      />
      <LocationFilter
        state={state}
        city={city}
        onStateChange={setState}
        onCityChange={setCity}
      />
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
      {items.map((place) => (
        <PlaceCard key={place._id} {...place} actionLabel={actionLabel} />
      ))}
    </CustomCompareLayout>
  );
}
