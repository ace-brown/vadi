import BarberCard from "@/components/barber/BarberCard";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import FilterSlider from "@/components/common/FilterSlider";
import BarberCardSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import img1 from "@/images/barber/1.jpg";
import img2 from "@/images/barber/2.jpg";
import img3 from "@/images/barber/3.jpg";
import { BarberPlansType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function WomenSalonPage() {
  const HAIRCUT_MAX_PRICE = 3000000;
  const [hairCutPrice, setHairCutPrice] = useState(HAIRCUT_MAX_PRICE);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPlans, setFilteredPlans] = useState<BarberPlansType[]>([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";
  const isAnyFilterActive = hairCutPrice !== HAIRCUT_MAX_PRICE;

  const barberPlans = [
    {
      title: "آرایشگاه عباس معصومی",
      haircutPrice: 120000,
      menLift: "۲۰۰٬۰۰۰ تومان",
      groomMakeup: "۷۵۰٬۰۰۰ تومان",
      curlyHairDo: "۳۰۰٬۰۰۰ تومان",
      image: img1,
    },
    {
      title: "آرایشگاه مردان آلفا",
      haircutPrice: 550000,
      menLift: "۲۲۰٬۰۰۰ تومان",
      groomMakeup: "۸۰۰٬۰۰۰ تومان",
      curlyHairDo: "۳۲۰٬۰۰۰ تومان",
      image: img2,
    },
    {
      title: "آرایشگاه متین",
      haircutPrice: 200000,
      menLift: "۲۱۰٬۰۰۰ تومان",
      groomMakeup: "۷۲۰٬۰۰۰ تومان",
      curlyHairDo: "۲۹۰٬۰۰۰ تومان",
      image: img3,
    },
  ];

  function resetFilters() {
    setHairCutPrice(HAIRCUT_MAX_PRICE);
  }

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      const filteredData = barberPlans.filter((plan) => {
        const matchesHairCutPrice = plan.haircutPrice <= hairCutPrice;
        return matchesHairCutPrice;
      });

      setFilteredPlans(filteredData);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hairCutPrice]);

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    return sortOrder === "asc"
      ? a.haircutPrice - b.haircutPrice
      : b.haircutPrice - a.haircutPrice;
  });

  const filters = (
    <>
      {/* sort based on hairCutPrice */}
      <FilterSelect
        value={sortOrder}
        onChange={setSortOrder}
        options={[
          { value: "asc", label: "ارزان‌ترین" },
          { value: "desc", label: "گران‌ترین" },
        ]}
      />

      {/* 
  
        <FilterCollapse
          label="مدت اعتبار"
          options={DURATION_OPTIONS}
          selectedValues={durationFilter}
          onChange={(value: string) =>
            handleDurationChnage({
              target: { value },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        /> */}

      {/* اصلاح مو و ریش*/}
      <FilterSlider
        label="اصلاح مو و ریش"
        min={0}
        max={HAIRCUT_MAX_PRICE}
        step={10000}
        value={hairCutPrice}
        onChange={setHairCutPrice}
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
      skeleton={<BarberCardSkeleton />}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      currentResult={currentResult}
      returnTxt="بازگشت به صحفه ی انتخاب نوع آرایشگاه"
      returnSlug="/barber-details-select"
    >
      {sortedPlans.map((plan, i) => (
        <BarberCard key={i} {...plan} />
      ))}
    </CustomCompareLayout>
  );
}
