import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AutoRepairType } from "@/types";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import { useHttpClient } from "@/hooks/http-hook";
import AutoRepairCard from "@/components/vehicle/auto-repair/AutoRepairCard";
import { Button } from "@/components/ui/button";

export default function DentalPage() {
  const [allServices, setAllServices] = useState<AutoRepairType[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  const dentists: AutoRepairType[] = [
    {
      title: "کلینیک دندانپزشکی سلامت لبخند",
      address: "خیابان ولیعصر ۱۵، تهران",
      services: ["جرم‌گیری", "پرکردن دندان", "بلیچینگ"],
      image: "https://example.com/images/dentist1.jpg",
    },
    {
      title: "مرکز دندانپزشکی پارس",
      address: "خیابان انقلاب ۳۲، اصفهان",
      services: ["ارتودنسی", "کشیدن دندان", "عصب‌کشی"],
      image: "https://example.com/images/dentist2.jpg",
    },
    {
      title: "کلینیک تخصصی دندانپزشکی آرام",
      address: "خیابان حافظ ۷، شیراز",
      services: ["ایمپلنت", "روکش دندان", "جراحی لثه"],
      image: "https://example.com/images/dentist3.jpg",
    },
    {
      title: "دندانپزشکی پیشرفته لبخند زیبا",
      address: "بلوار آزادی ۲۳، مشهد",
      services: ["سفیدکردن دندان", "تشخیص و درمان پوسیدگی", "پروتز دندان"],
      image: "https://example.com/images/dentist4.jpg",
    },
  ];

  async function fetchApplianceRepair() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/healthcare/dental`,
        "GET"
      );

      if (responseData && Array.isArray(responseData)) {
        setAllServices(responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchApplianceRepair();
    // eslint-disable-next-line
  }, []);

  // Filter operations
  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       if (!Array.isArray(allPackages) || allPackages.length === 0) return;

  //       const filteredData = allPackages.filter((pkg) => {
  //         const matchesType =
  //           netTypeFilter.length === 0 || netTypeFilter.includes(pkg.netType);

  //         const matchesPrice = pkg.price <= maxPrice;

  //         const matchesSpeed =
  //           speedFilter.length === 0 || speedFilter.includes(pkg.speed);

  //         const matchesDuration =
  //           durationFilter.length === 0 || durationFilter.includes(pkg.duration);

  //         return matchesType && matchesPrice && matchesSpeed && matchesDuration;
  //       });

  //       setFilteredPackages(filteredData);
  //     }, 300);

  //     return () => clearTimeout(timer);
  //   }, [netTypeFilter, maxPrice, allPackages, speedFilter, durationFilter]);

  // Sort operation

  return (
    <CustomCompareLayout
      isLoading={isLoading}
      skeleton={<HomeNetCardSkeleton />}
      isAnyFilterActive={false}
      //   onResetFilters={resetFilters}
      currentResult={currentResult}
      //   returnTxt="بازگشت به صحفه ی انتخاب نوع اینترنت"
      //   returnSlug="/internet/internet-details-select"
    >
      {dentists.map((pkg, i) => (
        <AutoRepairCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
