import asiatech from "@/images/internet/home/asiatech.jpg";
import sabanet from "@/images/internet/home/sabanet.png";
import shatel from "@/images/internet/home/shatel.png";
import { useEffect, useState } from "react";
import { HomeNetType } from "@/types";
import HomeNetCard from "@/components/internet/home-tariff/HomeNetCard";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import { englishToPersianDigits } from "@/utils/helpers";
import CustomCompareLayout from "../../../components/common/CustomCompareLayout";
import FilterLabel from "@/components/common/FilterLabel";
import FilterDropdown from "@/components/common/FilterCollapse";
import FilterCollapse from "@/components/common/FilterCollapse";

export default function HomeTariffComparePage() {
  const [netTypeFilter, setNetTypeFilter] = useState<string[]>([]);
  const [speedFilter, setSpeedFilter] = useState<string[]>([]);
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

        return matchesType && matchesPrice && matchesSpeed;
      });

      setFilteredPackages(filteredData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [netTypeFilter, maxPrice, speedFilter]);

  // Sort operation
  const sortedPKGs = [...filteredPackages].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  const filters = (
    <>
      {/* sort */}
      <div className="block mb-4">
        <select
          onChange={(e) => setSortOrder(e.target.value)}
          className="min-w-[150px] border border-gray-300 text-sm rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
        >
          <option value="asc">ارزان‌ترین</option>
          <option value="desc">گران‌ترین</option>
        </select>
      </div>

      {/* نوع اینترنت */}
      <FilterCollapse
        label="نوع اینترنت"
        options={INTERNET_TYPES}
        selectedValues={netTypeFilter}
        onChange={(value) =>
          setNetTypeFilter((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          )
        }
      />

      {/* سرعت */}
      <FilterCollapse
        label="سرعت"
        options={SPEED_OPTIONS}
        selectedValues={speedFilter}
        onChange={(value) =>
          setSpeedFilter((prev) =>
            prev.includes(value)
              ? prev.filter((v) => v !== value)
              : [...prev, value]
          )
        }
      />

      {/* قیمت */}
      <div>
        <FilterLabel>مبلغ بسته</FilterLabel>
        <input
          type="range"
          min="0"
          max="2000000"
          step="20000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full p-2 cursor-pointer"
        />
        <p className="text-sm text-gray-600">
          حداکثر قیمت: {englishToPersianDigits(maxPrice.toLocaleString())} تومان
        </p>
      </div>
    </>
  );

  return (
    <CustomCompareLayout
      filters={filters}
      isLoading={isLoading}
      skeleton={<HomeNetCardSkeleton />}
    >
      {sortedPKGs.map((pkg, i) => (
        <HomeNetCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
