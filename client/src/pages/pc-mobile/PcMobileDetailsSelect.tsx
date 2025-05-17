import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function PcMobileDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [repairType, setRepairType] = useState<string>("");
  const PMOptions = [
    { label: "کامپیوتر و لپ تاپ", value: "pc" },
    { label: "موبایل", value: "mobile" },
  ];

  function handleSubmit() {
    if (!repairType) {
      alert("لطفاً نوع تعمیرات را انتخاب کنید.");
      return;
    }

    const routeMap: Record<string, string> = {
      pc: "computer-repair",
      mobile: "mobile-repair",
    };

    const slug = routeMap[repairType];
    if (!slug) return;

    const currentOpt = PMOptions.find((opt) => opt.value === repairType);
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: repairType,
      currentResult,
    });

    navigate(`/pc-mobile/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع تعمیرات"
      xType={repairType}
      options={PMOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setRepairType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
