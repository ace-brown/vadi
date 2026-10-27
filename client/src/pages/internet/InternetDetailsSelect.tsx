import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function InternetDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [netType, setNetType] = useState<string>("");
  const internetOptions = [
    { label: "Home internet", value: "homeNet" },
    { label: "Mobile internet", value: "mobileNet" },
  ];

  function handleSubmit() {
    if (!netType) {
      alert("Please select an internet type.");
      return;
    }

    const routeMap: Record<string, string> = {
      mobileNet: "mobile-tariff",
      homeNet: "home-tariff",
    };

    const slug = routeMap[netType];
    if (!slug) return;

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
      title="Internet type"
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
