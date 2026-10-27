import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LimitSlider } from "@/components/listing/filters";
import OfferCard from "@/components/offers/OfferCard";
import CompareBar from "@/components/offers/CompareBar";
import { highlightsFor, homeOfferFacts, lastCheckedNotice } from "@/components/offers/offer-details";
import Seo from "@/components/common/Seo";
import AvailabilityBox from "@/components/offers/AvailabilityBox";
import { useListing } from "@/hooks/use-listing";
import { useUrlParams } from "@/hooks/use-url-params";
import { HomePlanType } from "@/types";
import { formatNumber, formatPrice, toggleValue } from "@/utils/helpers";

const PAGE_SIZE = 20;

export default function HomeTariffPage() {
  const { t } = useTranslation();
  const url = useUrlParams();
  const postcode = url.get("postcode");
  const street = url.get("street");
  const houseNumber = url.get("houseNumber");
  const hasAddress = /^\d{5}$/.test(postcode) && !!street && !!houseNumber;
  const connectionTypes = url.getList("connectionType");
  const terms = url.getList("termMonths");
  const minSpeed = url.getNumber("downloadMbpsMin");
  const maxPrice = url.getNumber("effectiveMonthlyPriceMax");
  const sort = url.get("sort") || "effectiveMonthlyPrice";
  const [postcodeInput, setPostcodeInput] = useState(postcode);
  const [streetInput, setStreetInput] = useState(street);
  const [houseNumberInput, setHouseNumberInput] = useState(houseNumber);
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Keep the input in step with the URL (e.g. after "Clear filters")
  useEffect(() => setPostcodeInput(postcode), [postcode]);
  useEffect(() => setStreetInput(street), [street]);
  useEffect(() => setHouseNumberInput(houseNumber), [houseNumber]);
  const postcodeInvalid = postcodeInput !== "" && !/^\d{5}$/.test(postcodeInput);

  const { items, total, ranges, facets, isLoading, error, retry } = useListing<HomePlanType>(
    "/api/internet/home-tariffs",
    {
      postcode,
      // The exact address check needs all three
      street: hasAddress ? street : null,
      houseNumber: hasAddress ? houseNumber : null,
      connectionType: connectionTypes.join(","),
      termMonths: terms.join(","),
      downloadMbpsMin: minSpeed,
      effectiveMonthlyPriceMax: maxPrice,
      sort,
      limit,
    }
  );

  const isAnyFilterActive =
    !!postcode || connectionTypes.length > 0 || terms.length > 0 || minSpeed !== null || maxPrice !== null;

  function resetFilters() {
    url.set({ postcode: null, street: null, houseNumber: null, connectionType: null, termMonths: null, downloadMbpsMin: null, effectiveMonthlyPriceMax: null });
  }

  const highlights = highlightsFor(items, [
    {
      label: t("offer.fastest"),
      pick: (list) => list.reduce((best, item) => (item.downloadMbps > best.downloadMbps ? item : best)),
    },
  ]);

  const filters = (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!postcodeInvalid) {
            url.set({ postcode: postcodeInput, street: streetInput.trim(), houseNumber: houseNumberInput.trim() });
          }
        }}
        className="space-y-1"
      >
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
          {t("filters.postcode")}
        </label>
        <div className="flex gap-2">
          <Input
            id="postcode"
            inputMode="numeric"
            maxLength={5}
            placeholder={t("filters.postcodePlaceholder")}
            value={postcodeInput}
            aria-invalid={postcodeInvalid}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setPostcodeInput(value);
              if (value === "" || /^\d{5}$/.test(value)) url.set({ postcode: value });
            }}
          />
          <Button type="submit" variant="outline" disabled={postcodeInvalid}>
            OK
          </Button>
        </div>
        {postcodeInvalid && <p className="text-xs text-red-600">{t("filters.postcodeInvalid")}</p>}
        <div className="flex gap-2 pt-1">
          <Input
            aria-label={t("availability.street")}
            placeholder={t("availability.street")}
            autoComplete="address-line1"
            value={streetInput}
            onChange={(e) => setStreetInput(e.target.value)}
          />
          <Input
            aria-label={t("availability.houseNumber")}
            placeholder={t("availability.houseNumber")}
            className="w-20"
            value={houseNumberInput}
            onChange={(e) => setHouseNumberInput(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button type="submit" size="sm" variant="outline" disabled={postcodeInvalid || !postcodeInput || !streetInput.trim() || !houseNumberInput.trim()}>
            {t("availability.check")}
          </Button>
          {street && (
            <button
              type="button"
              className="text-xs text-blue-700 hover:underline"
              onClick={() => url.set({ street: null, houseNumber: null })}
            >
              {t("availability.clear")}
            </button>
          )}
        </div>
        {!street && <p className="text-xs text-gray-500">{t("availability.hint")}</p>}
      </form>
      <FilterSelect
        value={sort}
        onChange={(value) => url.set({ sort: value === "effectiveMonthlyPrice" ? null : value })}
        options={[
          { value: "effectiveMonthlyPrice", label: t("filters.sort.effective") },
          { value: "-effectiveMonthlyPrice", label: t("filters.sort.effectiveDesc") },
          { value: "monthlyPrice", label: t("filters.sort.monthly") },
          { value: "-downloadMbps", label: t("filters.sort.fastest") },
          { value: "score", label: t("filters.sort.score") },
          { value: "setupFee", label: t("filters.sort.setupFee") },
        ]}
      />
      <FilterCollapse label={t("filters.priceAndSpeed")}>
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
          label={t("filters.minSpeed")}
          range={ranges.downloadMbps}
          value={minSpeed}
          onChange={(value) => url.set({ downloadMbpsMin: value })}
          step={10}
          format={(v) => `${formatNumber(v)} Mbit/s`}
        />
      </FilterCollapse>
      <FilterCollapse
        label={t("filters.connectionType")}
        options={[
          { value: "Fiber", label: "Glasfaser / Fiber" },
          { value: "Cable", label: "Kabel / Cable" },
          { value: "VDSL", label: "VDSL" },
          { value: "DSL", label: "DSL" },
          { value: "LTE", label: t("filters.lte") },
        ].map((option) => ({ ...option, count: facets.connectionType?.[option.value] ?? 0 }))}
        selectedValues={connectionTypes}
        onChange={(value) => url.set({ connectionType: toggleValue(connectionTypes, value) })}
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
    </>
  );

  const checked = lastCheckedNotice(items);

  return (
    <>
      <Seo title={t("nav.homeInternet")} description={t("home.subtitle")} />
      <CustomCompareLayout
        title={postcode ? `${t("nav.homeInternet")} · ${postcode}` : t("nav.homeInternet")}
        intro={hasAddress ? <AvailabilityBox postcode={postcode} street={street} houseNumber={houseNumber} /> : undefined}
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
            {postcode && !hasAddress && <p className="mt-1">{t("offer.availabilityNote")}</p>}
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
            kind="home"
            offer={offer}
            highlights={highlights[offer._id]}
            {...homeOfferFacts(offer)}
          />
        ))}
      </CustomCompareLayout>
      <CompareBar kind="home" />
    </>
  );
}
