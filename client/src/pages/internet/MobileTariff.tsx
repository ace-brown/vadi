import SimCardInfo from "@/components/internet/mobile-tariff/SimCardInfo";
import { useEffect, useState } from "react";
import { englishToPersianDigits } from "@/utils/helpers";
import { SimCardInfoType } from "@/types";
import SimCardInfoSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import { useHttpClient } from "@/hooks/http-hook";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import FilterCollapse from "@/components/common/FilterCollapse";
import { useLocation } from "react-router-dom";
import FilterSlider from "@/components/common/FilterSlider";

export default function MobileTariffPage() {
  const MAX_PKG_PRICE = 1000000;
  const MAX_SIM_PRICE = 1000000;
  const MAX_MINS = 2000;
  const [simTypeFilter, setSimTypeFilter] = useState<string[]>([]);
  const [maxPkgPrice, setMaxPkgPrice] = useState(MAX_PKG_PRICE);
  const [maxSimPrice, setMaxSimPrice] = useState(MAX_SIM_PRICE);
  const [maxMins, setMaxMins] = useState(MAX_MINS);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [allPackages, setAllPackages] = useState<SimCardInfoType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<SimCardInfoType[]>(
    []
  );
  const { isLoading, sendRequest } = useHttpClient();
  const [sortOrder, setSortOrder] = useState("asc");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const DURATION_OPTIONS = [
    "1 ماهه",
    "3 ماهه",
    "6 ماهه",
    "12 ماهه",
    "18 ماهه",
    "24 ماهه",
  ];

  // Check if any filter is active
  const isAnyFilterActive =
    simTypeFilter.length > 0 ||
    durationFilter.length > 0 ||
    maxPkgPrice !== MAX_PKG_PRICE ||
    maxSimPrice !== MAX_SIM_PRICE ||
    maxMins !== MAX_MINS;

  function resetFilters() {
    setSimTypeFilter([]);
    setDurationFilter([]);
    setMaxPkgPrice(MAX_PKG_PRICE);
    setMaxSimPrice(MAX_SIM_PRICE);
    setMaxMins(MAX_MINS);
  }

  function handleNetTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSimTypeFilter(
      (prev) =>
        prev.includes(value)
          ? prev.filter((t) => t !== value) // remove
          : [...prev, value] // add
    );
  }

  function handleDurationChnage(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDurationFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function fetchMobileTariffs() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/mobile-tariffs`,
        "GET"
      );

      setAllPackages(responseData);
      setFilteredPackages(responseData); // show all at first
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchMobileTariffs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!Array.isArray(allPackages) || allPackages.length === 0) return;

      const filteredData = allPackages.filter((pkg) => {
        const matchesType =
          simTypeFilter.length === 0 || simTypeFilter.includes(pkg.type);

        const matchesPkgPrice = pkg.packagePrice <= maxPkgPrice;

        const matchesSimPrice = pkg.simPrice <= maxSimPrice;

        const matchesMins = pkg.minutes <= maxMins;

        const matchesDuration =
          durationFilter.length === 0 || durationFilter.includes(pkg.validity);

        return (
          matchesType &&
          matchesPkgPrice &&
          matchesSimPrice &&
          matchesMins &&
          matchesDuration
        );
      });

      setFilteredPackages(filteredData);
    }, 300);

    return () => clearTimeout(timer);
  }, [simTypeFilter, maxPkgPrice, allPackages, maxSimPrice, maxMins]);

  // Sort operation
  const sortedPKGs = [...filteredPackages].sort((a, b) => {
    return sortOrder === "asc"
      ? a.packagePrice - b.packagePrice
      : b.packagePrice - a.packagePrice;
  });

  const filters = (
    <>
      {/* sort */}
      <FilterSelect
        value={sortOrder}
        onChange={setSortOrder}
        options={[
          { value: "asc", label: "ارزان‌ترین" },
          { value: "desc", label: "گران‌ترین" },
        ]}
      />

      {/* نوع اینترنت */}
      <FilterCollapse
        label="نوع اینترنت"
        options={["اعتباری", "دائمی"]}
        selectedValues={simTypeFilter}
        onChange={(value: string) =>
          handleNetTypeChange({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />

      {/* مدت اعتبار */}
      <FilterCollapse
        label="مدت اعتبار"
        options={DURATION_OPTIONS}
        selectedValues={durationFilter}
        onChange={(value: string) =>
          handleDurationChnage({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />

      {/*  قیمت بسته */}
      <FilterSlider
        label="مبلغ بسته"
        min={0}
        max={MAX_PKG_PRICE}
        step={20000}
        value={maxPkgPrice}
        onChange={setMaxPkgPrice}
        formatValue={(v) =>
          ` بسته حداکثر قیمت: ${englishToPersianDigits(
            v.toLocaleString()
          )} تومان`
        }
      />

      {/* قیمت سیم کارت */}
      <FilterSlider
        label="مبلغ سیم کارت"
        min={0}
        max={MAX_SIM_PRICE}
        step={50000}
        value={maxSimPrice}
        onChange={setMaxSimPrice}
        formatValue={(v) =>
          ` حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      {/* مقدار دقیقه */}
      <FilterSlider
        label="مبلغ بسته"
        min={0}
        max={MAX_MINS}
        step={100}
        value={maxMins}
        onChange={setMaxPkgPrice}
        formatValue={(v) =>
          ` حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
    </>
  );

  return (
    <CustomCompareLayout
      filters={filters}
      isLoading={isLoading}
      skeleton={<SimCardInfoSkeleton />}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      currentResult={currentResult}
      returnTxt="بازگشت به صحفه ی انتخاب نوع اینترنت"
      returnSlug="/internet/internet-details-select"
    >
      {sortedPKGs.map((pkg, i) => (
        <SimCardInfo key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
