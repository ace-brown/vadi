import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AutoRepairType } from "@/types";
import HomeNetCardSkeleton from "@/components/internet/home-tariff/HomeNetCardSkeleton";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import { useHttpClient } from "@/hooks/http-hook";
import AutoRepairCard from "@/components/vehicle/auto-repair/AutoRepairCard";

export default function ApplianceRepairPage() {
  const [allServices, setAllServices] = useState<AutoRepairType[]>([]);
  const { isLoading, sendRequest } = useHttpClient();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

  async function fetchHomeTariffs() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/electronics/appliance-repair`,
        "GET"
      );

      if (responseData && Array.isArray(responseData)) {
        setAllServices(responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchHomeTariffs();
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
      {allServices.map((pkg, i) => (
        <AutoRepairCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
