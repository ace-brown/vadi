import { useEffect, useState } from "react";
import { englishToPersianDigits } from "@/utils/helpers";
import { useHttpClient } from "@/hooks/http-hook";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import FilterSelect from "@/components/common/FilterSelect";
import FilterCollapse from "@/components/common/FilterCollapse";
import { useLocation } from "react-router-dom";
import FilterSlider from "@/components/common/FilterSlider";
import SimCardInfoSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import AutoRepairCard from "@/components/vehicle/auto-repair/AutoRepairCard";
import { AutoRepairType } from "@/types";

export default function AutoRepairPage() {
  const MAX_PKG_PRICE = 500000;
  const MAX_SIM_PRICE = 1000000;
  const MAX_MINS = 2000;
  const [simTypeFilter, setSimTypeFilter] = useState<string[]>([]);
  const [maxPkgPrice, setMaxPkgPrice] = useState(MAX_PKG_PRICE);
  const [maxSimPrice, setMaxSimPrice] = useState(MAX_SIM_PRICE);
  const [maxMins, setMaxMins] = useState(MAX_MINS);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [allAutoRepairs, setAllAutoRepairs] = useState<AutoRepairType[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<AutoRepairType[]>(
    []
  );
  const { isLoading, sendRequest } = useHttpClient();
  const [sortOrder, setSortOrder] = useState("asc");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const DURATION_OPTIONS = [
    "1 ماهه",
    "3 ماهه",
    "6 ماهه",
    "12 ماهه",
    "18 ماهه",
    "24 ماهه",
  ];

  // const autoRepairShops = [
  //   {
  //     title: "تعمیرگاه ولیعصر",
  //     address: "تهران، خیابان ولیعصر، بالاتر از پارک ملت، پلاک ۱۰۵",
  //     services: ["تعویض روغن", "تعویض فیلتر هوا", "شارژ گاز کولر"],
  //     image: autoRepair1,
  //   },
  //   {
  //     title: "گاراژ ونک",
  //     address: "تهران، میدان ونک، خیابان خدامی، پلاک ۲۳",
  //     services: ["تنظیم موتور", "تعویض تسمه تایم", "تعمیر جلوبندی"],
  //     image: autoRepair2,
  //   },
  //   {
  //     title: "مکانیکی گلبرگ",
  //     address: "تهران، نارمک، خیابان گلبرگ شرقی، کوچه نسترن، پلاک ۸",
  //     services: ["تعویض لنت ترمز", "تعویض باتری", "تعویض شمع"],
  //     image: autoRepair3,
  //   },
  // ];

  // Check if any filter is active
  const isAnyFilterActive =
    simTypeFilter.length > 0 ||
    durationFilter.length > 0 ||
    maxPkgPrice !== MAX_PKG_PRICE ||
    maxSimPrice !== MAX_SIM_PRICE ||
    maxMins !== MAX_MINS;

  function resetFilters() {
    setSimTypeFilter([]);
    setDurationFilter([]);
    setMaxPkgPrice(MAX_PKG_PRICE);
    setMaxSimPrice(MAX_SIM_PRICE);
    setMaxMins(MAX_MINS);
  }

  function handleNetTypeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSimTypeFilter(
      (prev) =>
        prev.includes(value)
          ? prev.filter((t) => t !== value) // remove
          : [...prev, value] // add
    );
  }

  function handleDurationChnage(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setDurationFilter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  async function fetchMobileTariffs() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/vehicle/auto-repair`,
        "GET"
      );

      if (responseData && Array.isArray(responseData)) {
        setAllAutoRepairs(responseData);
        setFilteredPackages(responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchMobileTariffs();
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (!Array.isArray(allAutoRepairs) || allAutoRepairs.length === 0) return;

  //     const filteredData = allAutoRepairs.filter((pkg) => {

  //       return (

  //       );
  //     });

  //     setFilteredPackages(filteredData);
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [simTypeFilter, maxPkgPrice, allAutoRepairs, maxSimPrice, maxMins]);

  // Sort operation
  // const sortedPKGs = [...filteredPackages].sort((a, b) => {
  //   return sortOrder === "asc"
  //     ? a.packagePrice - b.packagePrice
  //     : b.packagePrice - a.packagePrice;
  // });

  const filters = <></>;

  return (
    <CustomCompareLayout
      filters={filters}
      isLoading={isLoading}
      skeleton={<SimCardInfoSkeleton />}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      currentResult={currentResult}
      returnTxt="بازگشت به صحفه ی انتخاب نوع اینترنت"
      returnSlug="/internet/internet-details-select"
    >
      {filteredPackages?.map((pkg, i) => (
        <AutoRepairCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
