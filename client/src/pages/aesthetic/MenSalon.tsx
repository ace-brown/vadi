import BarberCard from "@/components/barber-salon/BarberCard";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import FilterSlider from "@/components/common/FilterSlider";
import BarberCardSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import { useHttpClient } from "@/hooks/http-hook";
import { MenSalonPlansType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function MenSalonPage() {
  const HAIRCUT_MAX_PRICE = 1000000;
  const MAX_MEN_LIFT_PRICE = 500000;
  const MAX_GROOM_MAKEUP_PRICE = 1000000;
  const MAX_CURLY_HAIRDO_PRICE = 500000;
  const HAIRCUT_MIN_PRICE = 50000;
  const MIN_MEN_LIFT_PRICE = 50000;
  const MIN_GROOM_MAKEUP_PRICE = 50000;
  const MIN_CURLY_HAIRDO_PRICE = 50000;

  const [hairCutPrice, setHairCutPrice] = useState(HAIRCUT_MAX_PRICE);
  const [menLiftPrice, setMenLiftPrice] = useState(MAX_MEN_LIFT_PRICE);
  const [groomMakeupPrice, setGroomMakeupPrice] = useState(
    MAX_GROOM_MAKEUP_PRICE
  );
  const [curlyHairDoPrice, setCurlyHairDoPrice] = useState(
    MAX_CURLY_HAIRDO_PRICE
  );
  const [sortOrder, setSortOrder] = useState("asc");
  const { isLoading, sendRequest } = useHttpClient();
  const [filteredPlans, setFilteredPlans] = useState<MenSalonPlansType[]>([]);
  const [allPlans, setAllPlans] = useState<MenSalonPlansType[]>([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const isAnyFilterActive =
    hairCutPrice !== HAIRCUT_MAX_PRICE ||
    menLiftPrice !== MAX_MEN_LIFT_PRICE ||
    groomMakeupPrice !== MAX_GROOM_MAKEUP_PRICE ||
    curlyHairDoPrice !== MAX_CURLY_HAIRDO_PRICE;

  // const barberPlans = [
  //   {
  //     title: "آرایشگاه عباس معصومی",
  //     haircutPrice: 120000,
  //     menLiftPrice: 300000,
  //     groomMakeupPrice: 750000,
  //     curlyHairDoPrice: 300000,
  //     image: img1,
  //   },
  //   {
  //     title: "آرایشگاه مردان آلفا",
  //     haircutPrice: 550000,
  //     menLiftPrice: 220000,
  //     groomMakeupPrice: 800000,
  //     curlyHairDoPrice: 320000,
  //     image: img2,
  //   },
  //   {
  //     title: "آرایشگاه متین",
  //     haircutPrice: 200000,
  //     menLiftPrice: 250000,
  //     groomMakeupPrice: 720000,
  //     curlyHairDoPrice: 290000,
  //     image: img3,
  //   },
  // ];

  function resetFilters() {
    setHairCutPrice(HAIRCUT_MAX_PRICE);
    setMenLiftPrice(MAX_MEN_LIFT_PRICE);
    setGroomMakeupPrice(MAX_GROOM_MAKEUP_PRICE);
    setCurlyHairDoPrice(MAX_CURLY_HAIRDO_PRICE);
  }

  async function fetchMenSalon() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/home-tariffs`,
        "GET"
      );
      console.log("responseData", responseData);

      if (responseData && Array.isArray(responseData)) {
        setAllPlans(responseData);
        setFilteredPlans(responseData);
      } else {
        console.warn("Unexpected response format:", responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchMenSalon();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredData = allPlans.filter((plan) => {
        return (
          plan.haircutPrice <= hairCutPrice &&
          plan.menLiftPrice <= menLiftPrice &&
          plan.groomMakeupPrice <= groomMakeupPrice &&
          plan.curlyHairDoPrice <= curlyHairDoPrice
        );
      });

      setFilteredPlans(filteredData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [hairCutPrice, menLiftPrice, groomMakeupPrice, curlyHairDoPrice]);

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    return sortOrder === "asc"
      ? a.haircutPrice - b.haircutPrice
      : b.haircutPrice - a.haircutPrice;
  });

  const filters = (
    <>
      <FilterSelect
        value={sortOrder}
        onChange={setSortOrder}
        options={[
          { value: "asc", label: "ارزان‌ترین" },
          { value: "desc", label: "گران‌ترین" },
        ]}
      />
      <FilterSlider
        label="اصلاح مو و ریش"
        min={HAIRCUT_MIN_PRICE}
        max={HAIRCUT_MAX_PRICE}
        step={10000}
        value={hairCutPrice}
        onChange={setHairCutPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="جوان سازی پوست"
        min={MIN_MEN_LIFT_PRICE}
        max={MAX_MEN_LIFT_PRICE}
        step={10000}
        value={menLiftPrice}
        onChange={setMenLiftPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="گریم داماد"
        min={MIN_GROOM_MAKEUP_PRICE}
        max={MAX_GROOM_MAKEUP_PRICE}
        step={10000}
        value={groomMakeupPrice}
        onChange={setGroomMakeupPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="فر کردن مو"
        min={MIN_CURLY_HAIRDO_PRICE}
        max={MAX_CURLY_HAIRDO_PRICE}
        step={10000}
        value={curlyHairDoPrice}
        onChange={setCurlyHairDoPrice}
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
      returnSlug="/aesthetic/aesthetic-details-select"
    >
      {sortedPlans.map((plan, i) => (
        <BarberCard key={i} {...plan} />
      ))}
    </CustomCompareLayout>
  );
}
