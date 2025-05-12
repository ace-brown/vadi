import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function InternetDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [netType, setNetType] = useState<string>("");
  const internetOptions = [
    { label: "اینترنت خانگی", value: "homeNet" },
    { label: "اینترنت موبایل", value: "mobileNet" },
  ];

  function handleSubmit() {
    if (!netType) {
      alert("لطفاً نوع اینترنت را انتخاب کنید.");
      return;
    }

    const routeMap: Record<string, string> = {
      mobileNet: "mobile-tariff",
      homeNet: "home-tariff",
    };

    const slug = routeMap[netType];
    if (!slug) return;

    // Send all the results from options
    const currentOpt = internetOptions.find((opt) => opt.value === netType);
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: netType,
      currentResult,
    });

    navigate(`/internet/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع اینترنت"
      xType={netType}
      options={internetOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setNetType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
