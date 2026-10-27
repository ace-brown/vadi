import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function AestheticDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [salonType, setSalonType] = useState<string>("");
  const salonOptions = [
    { label: "Men's salon", value: "menBarber" },
    { label: "Women's salon", value: "womenBarber" },
  ];

  function handleSubmit() {
    if (!salonType) {
      alert("Please select a salon type.");
      return;
    }

    const routeMap: Record<string, string> = {
      menBarber: "men-salon",
      womenBarber: "women-salon",
    };

    const slug = routeMap[salonType];
    if (!slug) return;

    const currentOpt = salonOptions.find((opt) => opt.value === salonType);
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: salonType,
      currentResult,
    });

    navigate(`/aesthetic/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="Salon type"
      xType={salonType}
      options={salonOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setSalonType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
