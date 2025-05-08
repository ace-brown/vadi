import BarberCard from "@/components/barber/BarberCard";
import BarberCardSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import img1 from "@/images/barber/1.jpg";
import img2 from "@/images/barber/2.jpg";
import img3 from "@/images/barber/3.jpg";
import { BarberPlansType } from "@/types";
import {
  englishToPersianDigits,
  persianToEnglishDigits,
} from "@/utils/helpers";
import { useEffect, useState } from "react";

export default function BarberComparePage() {
  const [hairCutFilter, setHairCutFilter] = useState("all");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPlans, setFilteredPlans] = useState<BarberPlansType[]>([]);
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const state = params.get("state");
  // const city = params.get("city");
  // const type = params.get("type");

  const barberPlans = [
    {
      title: "آرایشگاه عباس معصومی",
      haircutPrice: "۱۵۰٬۰۰۰ تومان",
      menLift: "۲۰۰٬۰۰۰ تومان",
      groomMakeup: "۷۵۰٬۰۰۰ تومان",
      curlyHairDo: "۳۰۰٬۰۰۰ تومان",
      image: img1,
    },
    {
      title: "آرایشگاه مردان آلفا",
      haircutPrice: "۱۸۰٬۰۰۰ تومان",
      menLift: "۲۲۰٬۰۰۰ تومان",
      groomMakeup: "۸۰۰٬۰۰۰ تومان",
      curlyHairDo: "۳۲۰٬۰۰۰ تومان",
      image: img2,
    },
    {
      title: "آرایشگاه متین",
      haircutPrice: "۱۷۰٬۰۰۰ تومان",
      menLift: "۲۱۰٬۰۰۰ تومان",
      groomMakeup: "۷۲۰٬۰۰۰ تومان",
      curlyHairDo: "۲۹۰٬۰۰۰ تومان",
      image: img3,
    },
  ];

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filteredData = barberPlans.filter((plan) => {
        const rawPrice = Number(
          persianToEnglishDigits(plan.haircutPrice).replace(/[^\d]/g, "")
        );
        const matchesTitle =
          hairCutFilter === "all" || plan.title.includes(hairCutFilter);
        const matchesPrice = rawPrice <= maxPrice;
        return matchesTitle && matchesPrice;
      });

      setFilteredPlans(filteredData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hairCutFilter, maxPrice]);

  return (
    <div className="w-full mx-auto mt-8 p-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Filter Column (20% width) */}
      <div className="lg:col-span-1 bg-white p-4 rounded border min-h-[90vh]">
        <h2 className="font-semibold text-xl mb-4">فیلترها</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm">نوع</label>
            <select
              className="w-full p-2 border rounded-md mt-2"
              value={hairCutFilter}
              onChange={(e) => setHairCutFilter(e.target.value)}
            >
              <option value="all">همه</option>
              <option value="اعتباری">اعتباری</option>
              <option value="دائمی">دائمی</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">قیمت</label>
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
          ? [...Array(5)].map((_, i) => <BarberCardSkeleton key={i} />)
          : filteredPlans.map((pkg, index) => (
              <BarberCard key={index} {...pkg} />
            ))}
      </div>
    </div>
  );
}
