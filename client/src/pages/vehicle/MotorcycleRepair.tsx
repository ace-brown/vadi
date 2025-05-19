import { useEffect, useState } from "react";
import { useHttpClient } from "@/hooks/http-hook";
import CustomCompareLayout from "@/components/common/CustomCompareLayout";
import { useLocation } from "react-router-dom";
import SimCardInfoSkeleton from "@/components/internet/mobile-tariff/SimCardInfoSkeleton";
import AutoRepairCard from "@/components/vehicle/auto-repair/AutoRepairCard";
import { AutoRepairType } from "@/types";

export default function MotorcycleRepairPage() {
  const MAX_PKG_PRICE = 500000;
  const MAX_SIM_PRICE = 1000000;
  const MAX_MINS = 2000;
  const [simTypeFilter, setSimTypeFilter] = useState<string[]>([]);
  const [maxPkgPrice, setMaxPkgPrice] = useState(MAX_PKG_PRICE);
  const [maxSimPrice, setMaxSimPrice] = useState(MAX_SIM_PRICE);
  const [maxMins, setMaxMins] = useState(MAX_MINS);
  const [durationFilter, setDurationFilter] = useState<string[]>([]);
  const [allMotorcycleRepairs, setAllMotorcycleRepairs] = useState<
    AutoRepairType[]
  >([]);
  // const [filteredPackages, setFilteredPackages] = useState<AutoRepairType[]>( [] );
  const { isLoading, sendRequest } = useHttpClient();
  // const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentResult = queryParams.get("currentResult") ?? "";

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

  async function fetchMotorcycleRepair() {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/api/vehicle/motorcycle-repair`,
        "GET"
      );

      if (responseData && Array.isArray(responseData)) {
        setAllMotorcycleRepairs(responseData);
        // setFilteredPackages(responseData);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchMotorcycleRepair();
    // eslint-disable-next-line
  }, []);

  const filters = <></>;

  return (
    <CustomCompareLayout
      filters={filters}
      isLoading={isLoading}
      skeleton={<SimCardInfoSkeleton />}
      isAnyFilterActive={isAnyFilterActive}
      onResetFilters={resetFilters}
      currentResult={currentResult}
      returnTxt="بازگشت به صحفه ی انتخاب نوع وسیله ی نقلیه"
      returnSlug="/vehicle/motorcycle-repair"
    >
      {allMotorcycleRepairs?.map((pkg, i) => (
        <AutoRepairCard key={i} {...pkg} />
      ))}
    </CustomCompareLayout>
  );
}
