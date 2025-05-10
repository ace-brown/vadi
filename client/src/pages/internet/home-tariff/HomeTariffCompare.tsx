import asiatech from "@/images/internet/home/asiatech.jpg";
import sabanet from "@/images/internet/home/sabanet.png";
import shatel from "@/images/internet/home/shatel.png";
import { useEffect, useState } from "react";
import { HomeNetType } from "@/types";
import HomeNetCard from "@/components/internet/home-tariff/HomeNetCard";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import { englishToPersianDigits } from "@/utils/helpers";

export default function HomeTariffComparePage() {
  const [netTypeFilter, setNetTypeFilter] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<HomeNetType[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
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
      speed: "50 مگابیت بر ثانیه",
      duration: "12 ماهه",
      volume: "1200 گیگ داخلی معادل 400 گیگ بین‌الملل",
      netType: "فیبر نوری",
      price: 690000,
      image: shatel,
    },
  ];

  // Filter operations
  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filteredData = homePackages.filter((pkg) => {
        const matchesType =
          netTypeFilter.length === 0 || netTypeFilter.includes(pkg.netType);
        const matchesPrice = pkg.price <= maxPrice;
        return matchesType && matchesPrice;
      });

      setFilteredPackages(filteredData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [netTypeFilter, maxPrice]);

  // Sort operation
  const sortedPKGs = [...filteredPackages].sort((a, b) => {
    return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
  });

  return (
    <div className="w-full mx-auto mt-8 p-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Filter Column (20% width) */}
      <div className="lg:col-span-1 bg-white p-4 rounded border min-h-[90vh]">
        <h2 className="font-bold text-2xl text-gray-800 tracking-tight mb-4">
          فیلترها
        </h2>
        <div className="block mb-4">
          <select
            onChange={(e) => setSortOrder(e.target.value)}
            className="min-w-[150px] border border-gray-300 text-sm rounded px-3 py-1 focus:outline-none focus:ring focus:ring-blue-200 cursor-pointer"
          >
            <option value="asc">ارزان‌ترین</option>
            <option value="desc">گران‌ترین</option>
          </select>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              نوع اینترنت
            </label>
            <div className="mt-2 space-y-1">
              {INTERNET_TYPES.map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    className="cursor-pointer"
                    type="checkbox"
                    value={type}
                    checked={netTypeFilter.includes(type)}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNetTypeFilter(
                        (prev) =>
                          prev.includes(value)
                            ? prev.filter((t) => t !== value) // remove
                            : [...prev, value] // add
                      );
                    }}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-700 mb-1">
              مبلغ بسته
            </label>
            <input
              type="range"
              min="0"
              max="2000000"
              step="20000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full p-2 cursor-pointer"
            />
            <p className="text-sm mt-1 text-gray-600">
              حداکثر قیمت: {englishToPersianDigits(maxPrice.toLocaleString())}{" "}
              تومان
            </p>
          </div>
        </div>
      </div>

      {/* Card Column (80% width) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {isLoading ? (
          [...Array(5)].map((_, i) => <HomeNetCardSkeleton key={i} />)
        ) : sortedPKGs.length === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-8">
            هیچ بسته‌ای یافت نشد.
          </p>
        ) : (
          sortedPKGs.map((pkg, index) => <HomeNetCard key={index} {...pkg} />)
        )}
      </div>
    </div>
  );
}
