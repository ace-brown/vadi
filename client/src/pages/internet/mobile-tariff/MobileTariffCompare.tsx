import SimCardInfo from "@/components/internet/mobile-tariff/SimCardInfo";
import { useEffect, useState } from "react";
import {
  englishToPersianDigits,
  persianToEnglishDigits,
} from "@/utils/helpers";
import { SimCardInfoType } from "@/types";
import SimCardInfoSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import { useHttpClient } from "@/hooks/http-hook";

export default function MobileTariffComparePage() {
  const [simTypeFilter, setSimTypeFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [allPackages, setAllPackages] = useState<SimCardInfoType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<SimCardInfoType[]>(
    []
  );
  const { isLoading, sendRequest } = useHttpClient();

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
        const rawPrice = Number(
          persianToEnglishDigits(pkg.packagePrice).replace(/[^\d]/g, "")
        );
        const matchesType =
          simTypeFilter === "all" || pkg.type.includes(simTypeFilter);
        const matchesPrice = rawPrice <= maxPrice;
        return matchesType && matchesPrice;
      });

      setFilteredPackages(filteredData);
    }, 300);

    return () => clearTimeout(timer);
  }, [simTypeFilter, maxPrice, allPackages]);

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
              حداکثر قیمت: {englishToPersianDigits(maxPrice.toLocaleString())}{" "}
              تومان
            </p>
          </div>
        </div>
      </div>

      {/* Card Column (80% width) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {isLoading
          ? [...Array(5)].map((_, i) => <SimCardInfoSkeleton key={i} />)
          : filteredPackages?.map((pkg, index) => (
              <SimCardInfo key={index} {...pkg} />
            ))}
      </div>
    </div>
  );
}
