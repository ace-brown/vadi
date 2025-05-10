import asiatech from "@/images/internet/home/asiatech.jpg";
import sabanet from "@/images/internet/home/sabanet.png";
import shatel from "@/images/internet/home/shatel.png";
import { useEffect, useState } from "react";
import { HomeNetType } from "@/types";
import HomeNetCard from "@/components/internet/home-tariff/HomeNetCard";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import { englishToPersianDigits } from "@/utils/helpers";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSelect from "@/components/common/FilterSelect";
import FilterSlider from "@/components/common/FilterSlider";
import { Button } from "@/components/ui/button";

export default function HomeTariffComparePage() {
  const [netTypeFilter, setNetTypeFilter] = useState<string[]>([]);
  const [speedFilter, setSpeedFilter] = useState<string[]>([]);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<HomeNetType[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");

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
  const homePackages = [
    {
      title: "آسیاتک",
      speed: "8 مگابیت بر ثانیه",
      duration: "12 ماهه",
      volume: "648 گیگ داخلی معادل 240 گیگ بین‌الملل",
      netType: "ADSL",
      price: 250000,
      image: asiatech,
    },
    {
      title: "صبانت",
      speed: "16 مگابیت بر ثانیه",
      duration: "6 ماهه",
      volume: "500 گیگ داخلی معادل 180 گیگ بین‌الملل",
      netType: "ADSL",
      price: 1530000,
      image: sabanet,
    },
    {
      title: "شاتل",
      speed: "100 تا 1000 مگابیت بر ثانیه",
      duration: "12 ماهه",
      volume: "1200 گیگ داخلی معادل 400 گیگ بین‌الملل",
      netType: "فیبر نوری",
      price: 690000,
      image: shatel,
    },
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
    maxPrice !== 2000000;

  function resetFilters() {
    setNetTypeFilter([]);
    setSpeedFilter([]);
    setDurationFilter([]);
    setMaxPrice(2000000);
  }

  // Filter operations
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filteredData = homePackages.filter((pkg) => {
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
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [netTypeFilter, maxPrice, speedFilter, durationFilter]);

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
        max={2000000}
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
    >
      {sortedPKGs.map((pkg, i) => (
        <HomeNetCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
