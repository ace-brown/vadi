import asiatech from "@/images/internet/home/asiatech.jpg";
import sabanet from "@/images/internet/home/sabanet.png";
import shatel from "@/images/internet/home/shatel.png";
import { useEffect, useState } from "react";
import { englishToPersianDigits } from "@/utils/helpers";
import { HomeNetType } from "@/types";
import HomeNetCard from "@/components/internet/home-tariff/HomeNetCard";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";

export default function HomeTariffComparePage() {
  const [simTypeFilter, setSimTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<HomeNetType[]>([]);

  const homePackages = [
    {
      title: "آسیاتک",
      speed: "8 مگابیت بر ثانیه",
      duration: "12 ماهه",
      volume: "648 گیگ داخلی معادل 240 گیگ بین‌الملل",
      netType: "ADSL",
      price: 350000,
      image: asiatech,
    },
    {
      title: "صبانت",
      speed: "16 مگابیت بر ثانیه",
      duration: "6 ماهه",
      volume: "500 گیگ داخلی معادل 180 گیگ بین‌الملل",
      netType: "VDSL",
      price: 530000,
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

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      // const filteredData = homePackages.filter((pkg) => {
      //   const rawPrice = Number(
      //     persianToEnglishDigits(pkg.speed).replace(/[^\d]/g, "")
      //   );
      //   const matchesType =
      //     simTypeFilter === "all" || pkg.netType.includes(simTypeFilter);
      //   const matchesPrice = rawPrice <= maxPrice;
      //   return matchesType && matchesPrice;
      // });

      setFilteredPackages(homePackages);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [simTypeFilter, maxPrice]);

  return (
    <div className="w-full mx-auto mt-8 p-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Filter Column (20% width) */}
      <div className="lg:col-span-1 bg-white p-4 rounded border min-h-[90vh]">
        <h2 className="font-semibold text-xl mb-4">فیلترها</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm">نوع </label>
            <select
              className="w-full p-2 border rounded-md mt-2"
              value={simTypeFilter}
              onChange={(e) => setSimTypeFilter(e.target.value)}
            >
              <option value="all">همه</option>
              <option value="اعتباری">اعتباری</option>
              <option value="دائمی">دائمی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">مبلغ بسته</label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="50000"
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full p-2"
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
        {isLoading
          ? [...Array(5)].map((_, i) => <HomeNetCardSkeleton key={i} />)
          : filteredPackages.map((pkg, index) => (
              <HomeNetCard key={index} {...pkg} />
            ))}
      </div>
    </div>
  );
}
