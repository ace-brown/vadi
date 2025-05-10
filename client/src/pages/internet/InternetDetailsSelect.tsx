import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
      mobileNet: "mobile-tariff-compare",
      homeNet: "home-tariff-compare",
    };

    const slug = routeMap[netType];
    if (!slug) return;

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: netType,
    });

    navigate(`/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع اینترنت"
      selectedItem={netType}
      options={internetOptions}
      state={selectedState}
      city={selectedCity}
      onSelectedItem={setNetType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
