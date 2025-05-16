import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { HomeNetType } from "@/types";
import HomeNetCard from "@/components/internet/home-tariff/HomeNetCard";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import { englishToPersianDigits } from "@/utils/helpers";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import FilterSlider from "@/components/common/FilterSlider";
import { useHttpClient } from "@/hooks/http-hook";

export default function HomeTariffPage() {
  const MAX_PRICE = 2000000;
  const [netTypeFilter, setNetTypeFilter] = useState<string[]>([]);
  const [speedFilter, setSpeedFilter] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [filteredPackages, setFilteredPackages] = useState<HomeNetType[]>([]);
  const [allPackages, setAllPackages] = useState<HomeNetType[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const { isLoading, sendRequest } = useHttpClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const SPEED_OPTIONS = [
    "2 مگابیت بر ثانیه",
    "4 مگابیت بر ثانیه",
    "8 مگابیت بر ثانیه",
    "16 مگابیت بر ثانیه",
    "2 تا 100 مگابیت بر ثانیه",
    "100 تا 1000 مگابیت بر ثانیه",
  ];
  const INTERNET_TYPES = ["ADSL", "VDSL", "فیبر نوری", "TD-LTE", "بی‌سیم"];
  const DURATION_OPTIONS = [
    "1 ماهه",
    "3 ماهه",
    "6 ماهه",
    "12 ماهه",
    "18 ماهه",
    "24 ماهه",
  ];

  function handleNetTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setNetTypeFilter(
      (prev) =>
        prev.includes(value)
          ? prev.filter((t) => t !== value) // remove
          : [...prev, value] // add
    );
  }

  function handleNetSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSpeedFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function handleDurationChnage(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDurationFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  // Check if any filter is active
  const isAnyFilterActive =
    netTypeFilter.length > 0 ||
    speedFilter.length > 0 ||
    durationFilter.length > 0 ||
    maxPrice !== MAX_PRICE;

  function resetFilters() {
    setNetTypeFilter([]);
    setSpeedFilter([]);
    setDurationFilter([]);
    setMaxPrice(MAX_PRICE);
  }

  async function fetchHomeTariffs() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/internet/home-tariffs`,
        "GET"
      );

      if (responseData && Array.isArray(responseData)) {
        setAllPackages(responseData);
        setFilteredPackages(responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchHomeTariffs();
    // eslint-disable-next-line
  }, []);

  // Filter operations
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!Array.isArray(allPackages) || allPackages.length === 0) return;

      const filteredData = allPackages.filter((pkg) => {
        const matchesType =
          netTypeFilter.length === 0 || netTypeFilter.includes(pkg.netType);

        const matchesPrice = pkg.price <= maxPrice;

        const matchesSpeed =
          speedFilter.length === 0 || speedFilter.includes(pkg.speed);

        const matchesDuration =
          durationFilter.length === 0 || durationFilter.includes(pkg.duration);

        return matchesType && matchesPrice && matchesSpeed && matchesDuration;
      });

      setFilteredPackages(filteredData);
    }, 300);

    return () => clearTimeout(timer);
  }, [netTypeFilter, maxPrice, allPackages, speedFilter, durationFilter]);

  // Sort operation
  const sortedPKGs = [...filteredPackages].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
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
        options={INTERNET_TYPES}
        selectedValues={netTypeFilter}
        onChange={(value: string) =>
          handleNetTypeChange({
            target: { value },
          } as React.ChangeEvent<HTMLInputElement>)
        }
      />

      {/* سرعت */}
      <FilterCollapse
        label="سرعت"
        options={SPEED_OPTIONS}
        selectedValues={speedFilter}
        onChange={(value: string) =>
          handleNetSpeedChange({
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

      {/* قیمت */}
      <FilterSlider
        label="مبلغ بسته"
        min={0}
        max={MAX_PRICE}
        step={20000}
        value={maxPrice}
        onChange={setMaxPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
    </>
  );

  return (
    <CustomCompareLayout
      filters={filters}
      isLoading={isLoading}
      skeleton={<HomeNetCardSkeleton />}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      currentResult={currentResult}
      returnTxt="بازگشت به صحفه ی انتخاب نوع اینترنت"
      returnSlug="/internet/internet-details-select"
    >
      {sortedPKGs.map((pkg, i) => (
        <HomeNetCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
