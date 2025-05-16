import BeautySalonCard from "@/components/barber-salon/BeautySalonCard";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import FilterSlider from "@/components/common/FilterSlider";
import BarberCardSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import { useHttpClient } from "@/hooks/http-hook";
import { WomenSalonPlansType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function WomenSalonPage() {
  const MAX_FACE_CARE_PRICE = 300000;
  const MIN_FACE_CARE_PRICE = 50000;

  const MAX_HAIR_BOTOX_PRICE = 600000;
  const MIN_HAIR_BOTOX_PRICE = 200000;

  const MAX_HAIR_COLOR_PRICE = 500000;
  const MIN_HAIR_COLOR_PRICE = 150000;

  const MAX_MAKEUP_PRICE = 1000000;
  const MIN_MAKEUP_PRICE = 300000;

  const MAX_EYELASH_EXTENSION_PRICE = 400000;
  const MIN_EYELASH_EXTENSION_PRICE = 150000;

  const MAX_EYEBROW_SHAPE_PRICE = 100000;
  const MIN_EYEBROW_SHAPE_PRICE = 20000;

  const MAX_EYEBROW_LIFT_PRICE = 300000;
  const MIN_EYEBROW_LIFT_PRICE = 100000;

  const MAX_NAIL_EXTENSION_PRICE = 400000;
  const MIN_NAIL_EXTENSION_PRICE = 150000;

  const MAX_MANICURE_PRICE = 200000;
  const MIN_MANICURE_PRICE = 50000;

  const MAX_WAXING_PRICE = 300000;
  const MIN_WAXING_PRICE = 80000;

  const [faceCarePrice, setFaceCarePrice] = useState(MAX_FACE_CARE_PRICE);
  const [hairBotoxPrice, setHairBotoxPrice] = useState(MAX_HAIR_BOTOX_PRICE);
  const [hairColorPrice, setHairColorPrice] = useState(MAX_HAIR_COLOR_PRICE);
  const [makeupPrice, setMakeupPrice] = useState(MAX_MAKEUP_PRICE);
  const [eyelashExtensionPrice, setEyelashExtensionPrice] = useState(
    MAX_EYELASH_EXTENSION_PRICE
  );
  const [eyebrowShapePrice, setEyebrowShapePrice] = useState(
    MAX_EYEBROW_SHAPE_PRICE
  );
  const [eyebrowLiftPrice, setEyebrowLiftPrice] = useState(
    MAX_EYEBROW_LIFT_PRICE
  );
  const [nailExtensionPrice, setNailExtensionPrice] = useState(
    MAX_NAIL_EXTENSION_PRICE
  );
  const [manicurePrice, setManicurePrice] = useState(MAX_MANICURE_PRICE);
  const [waxingPrice, setWaxingPrice] = useState(MAX_WAXING_PRICE);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filteredPlans, setFilteredPlans] = useState<WomenSalonPlansType[]>([]);
  const [allPlans, setAllPlans] = useState<WomenSalonPlansType[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const isAnyFilterActive =
    faceCarePrice !== MAX_FACE_CARE_PRICE ||
    hairBotoxPrice !== MAX_HAIR_BOTOX_PRICE ||
    hairColorPrice !== MAX_HAIR_COLOR_PRICE ||
    makeupPrice !== MAX_MAKEUP_PRICE ||
    eyelashExtensionPrice !== MAX_EYELASH_EXTENSION_PRICE ||
    eyebrowShapePrice !== MAX_EYEBROW_SHAPE_PRICE ||
    eyebrowLiftPrice !== MAX_EYEBROW_LIFT_PRICE ||
    nailExtensionPrice !== MAX_NAIL_EXTENSION_PRICE ||
    manicurePrice !== MAX_MANICURE_PRICE ||
    waxingPrice !== MAX_WAXING_PRICE;

  const salonPlans = [
    {
      title: "سالن زیبایی پرنیان",
      faceCarePrice: 150000,
      hairBotoxPrice: 400000,
      hairColorPrice: 350000,
      makeupPrice: 800000,
      eyelashExtensionPrice: 300000,
      eyebrowShapePrice: 50000,
      eyebrowLiftPrice: 180000,
      nailExtensionPrice: 250000,
      manicurePrice: 120000,
      waxingPrice: 200000,
    },
    {
      title: "سالن زیبایی دیانا",
      faceCarePrice: 180000,
      hairBotoxPrice: 420000,
      hairColorPrice: 370000,
      makeupPrice: 850000,
      eyelashExtensionPrice: 320000,
      eyebrowShapePrice: 60000,
      eyebrowLiftPrice: 200000,
      nailExtensionPrice: 280000,
      manicurePrice: 140000,
      waxingPrice: 220000,
    },
    {
      title: "سالن زیبایی نیلوفر",
      faceCarePrice: 160000,
      hairBotoxPrice: 410000,
      hairColorPrice: 360000,
      makeupPrice: 830000,
      eyelashExtensionPrice: 310000,
      eyebrowShapePrice: 55000,
      eyebrowLiftPrice: 190000,
      nailExtensionPrice: 270000,
      manicurePrice: 130000,
      waxingPrice: 210000,
    },
    {
      title: "سالن زیبایی ارغوان",
      faceCarePrice: 260000,
      hairBotoxPrice: 510000,
      hairColorPrice: 460000,
      makeupPrice: 930000,
      eyelashExtensionPrice: 410000,
      eyebrowShapePrice: 65000,
      eyebrowLiftPrice: 290000,
      nailExtensionPrice: 370000,
      manicurePrice: 180000,
      waxingPrice: 270000,
    },
    {
      title: "سالن زیبایی مرجان خاتون",
      faceCarePrice: 110000,
      hairBotoxPrice: 210000,
      hairColorPrice: 160000,
      makeupPrice: 430000,
      eyelashExtensionPrice: 110000,
      eyebrowShapePrice: 25000,
      eyebrowLiftPrice: 90000,
      nailExtensionPrice: 120000,
      manicurePrice: 80000,
      waxingPrice: 150000,
    },
  ];

  function resetFilters() {
    setFaceCarePrice(MAX_FACE_CARE_PRICE);
    setHairBotoxPrice(MAX_HAIR_BOTOX_PRICE);
    setHairColorPrice(MAX_HAIR_COLOR_PRICE);
    setMakeupPrice(MAX_MAKEUP_PRICE);
    setEyelashExtensionPrice(MAX_EYELASH_EXTENSION_PRICE);
    setEyebrowShapePrice(MAX_EYEBROW_SHAPE_PRICE);
    setEyebrowLiftPrice(MAX_EYEBROW_LIFT_PRICE);
    setNailExtensionPrice(MAX_NAIL_EXTENSION_PRICE);
    setManicurePrice(MAX_MANICURE_PRICE);
    setWaxingPrice(MAX_WAXING_PRICE);
  }

  async function fetchHomeTariffs() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/aesthetic/women-salon`,
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
    fetchHomeTariffs();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const filteredData = allPlans.filter((plan) => {
        return (
          plan.faceCarePrice <= faceCarePrice &&
          plan.hairBotoxPrice <= hairBotoxPrice &&
          plan.hairColorPrice <= hairColorPrice &&
          plan.makeupPrice <= makeupPrice &&
          plan.eyelashExtensionPrice <= eyelashExtensionPrice &&
          plan.eyebrowShapePrice <= eyebrowShapePrice &&
          plan.eyebrowLiftPrice <= eyebrowLiftPrice &&
          plan.nailExtensionPrice <= nailExtensionPrice &&
          plan.manicurePrice <= manicurePrice &&
          plan.waxingPrice <= waxingPrice
        );
      });

      setFilteredPlans(filteredData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    faceCarePrice,
    hairBotoxPrice,
    hairColorPrice,
    makeupPrice,
    eyelashExtensionPrice,
    eyebrowShapePrice,
    eyebrowLiftPrice,
    nailExtensionPrice,
    manicurePrice,
    waxingPrice,
  ]);

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    return sortOrder === "asc"
      ? a.faceCarePrice - b.faceCarePrice
      : b.faceCarePrice - a.faceCarePrice;
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
        label="اصلاح صورت"
        min={MIN_FACE_CARE_PRICE}
        max={MAX_FACE_CARE_PRICE}
        step={10000}
        value={faceCarePrice}
        onChange={setFaceCarePrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="بوتاکس مو"
        min={MIN_HAIR_BOTOX_PRICE}
        max={MAX_HAIR_BOTOX_PRICE}
        step={10000}
        value={hairBotoxPrice}
        onChange={setHairBotoxPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="رنگ مو"
        min={MIN_HAIR_COLOR_PRICE}
        max={MAX_HAIR_COLOR_PRICE}
        step={10000}
        value={hairColorPrice}
        onChange={setHairColorPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="میکاپ"
        min={MIN_MAKEUP_PRICE}
        max={MAX_MAKEUP_PRICE}
        step={10000}
        value={makeupPrice}
        onChange={setMakeupPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="کاشت مژه"
        min={MIN_EYELASH_EXTENSION_PRICE}
        max={MAX_EYELASH_EXTENSION_PRICE}
        step={10000}
        value={eyelashExtensionPrice}
        onChange={setEyelashExtensionPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="اصلاح ابرو"
        min={MIN_EYEBROW_SHAPE_PRICE}
        max={MAX_EYEBROW_SHAPE_PRICE}
        step={10000}
        value={eyebrowShapePrice}
        onChange={setEyebrowShapePrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="لیفت ابرو"
        min={MIN_EYEBROW_LIFT_PRICE}
        max={MAX_EYEBROW_LIFT_PRICE}
        step={10000}
        value={eyebrowLiftPrice}
        onChange={setEyebrowLiftPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="کاشت ناخن"
        min={MIN_NAIL_EXTENSION_PRICE}
        max={MAX_NAIL_EXTENSION_PRICE}
        step={10000}
        value={nailExtensionPrice}
        onChange={setNailExtensionPrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="مانیکور"
        min={MIN_MANICURE_PRICE}
        max={MAX_MANICURE_PRICE}
        step={10000}
        value={manicurePrice}
        onChange={setManicurePrice}
        formatValue={(v) =>
          `حداکثر قیمت: ${englishToPersianDigits(v.toLocaleString())} تومان`
        }
      />
      <FilterSlider
        label="اپلاسیون"
        min={MIN_WAXING_PRICE}
        max={MAX_WAXING_PRICE}
        step={10000}
        value={waxingPrice}
        onChange={setWaxingPrice}
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
        <BeautySalonCard key={i} {...plan} />
      ))}
    </CustomCompareLayout>
  );
}
