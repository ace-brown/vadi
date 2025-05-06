import SimCardInfo from "@/components/mobile-tariff/SimCardInfo";
import irancel from "@/images/logos/irancel-logo.png";
import hamrahAval from "@/images/logos/hamrah-aval-logo.jpg";
import rightel from "@/images/logos/rightel-logo.jpg";
import { useEffect, useState } from "react";
import { persianToEnglishDigits } from "@/utils/helpers";
import { SimCardInfoType } from "@/types";
import SimCardInfoSkeleton from "@/components/mobile-tariff/SimCardInfoSkeleton";

export default function MobileTariffComparePage() {
  const [simTypeFilter, setSimTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPackages, setFilteredPackages] = useState<SimCardInfoType[]>(
    []
  );

  const mobilePackages = [
    {
      type: "اعتباری",
      simPrice: "۵۰,۰۰۰ تومان",
      validity: "۳۰ روز",
      packagePrice: "۱۲۰,۰۰۰ تومان",
      minutes: "۵۰۰ دقیقه",
      image: irancel,
    },
    {
      type: "دائمی",
      simPrice: "۷۵,۰۰۰ تومان",
      validity: "۶۰ روز",
      packagePrice: "۲۰۰,۰۰۰ تومان",
      minutes: "۱۰۰۰ دقیقه",
      image: hamrahAval,
    },
    {
      type: "اعتباری",
      simPrice: "۱۰۰,۰۰۰ تومان",
      validity: "۹۰ روز",
      packagePrice: "۳۰۰,۰۰۰ تومان",
      minutes: "۲۰۰۰ دقیقه",
      image: rightel,
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filteredData = mobilePackages.filter((pkg) => {
        const rawPrice = Number(
          persianToEnglishDigits(pkg.packagePrice).replace(/[^\d]/g, "")
        );
        const matchesType =
          simTypeFilter === "all" || pkg.type.includes(simTypeFilter);
        const matchesPrice = rawPrice <= maxPrice;
        return matchesType && matchesPrice;
      });

      setFilteredPackages(filteredData);
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
            <label className="block text-sm">نوع سیم‌کارت</label>
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
              حداکثر قیمت: {maxPrice.toLocaleString()} تومان
            </p>
          </div>
        </div>
      </div>

      {/* Card Column (80% width) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {isLoading
          ? [...Array(5)].map((_, i) => <SimCardInfoSkeleton key={i} />)
          : filteredPackages.map((pkg, index) => (
              <SimCardInfo key={index} {...pkg} />
            ))}
      </div>
    </div>
  );
}
