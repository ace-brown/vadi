import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function AgricultureDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [agricultureType, setAgricultureType] = useState<string>("");
  const agricultureOptions = [
    { label: "Fertilizer & garden supplies", value: "gardenSupplies" },
    { label: "Animal products", value: "animalBasedProducts" },
  ];

  function handleSubmit() {
    if (!agricultureType) {
      alert("Please select an agriculture service.");
      return;
    }

    const routeMap: Record<string, string> = {
      gardenSupplies: "garden-supplies",
      animalBasedProducts: "animal-based-products",
    };

    const slug = routeMap[agricultureType];
    if (!slug) return;

    const currentOpt = agricultureOptions.find(
      (opt) => opt.value === agricultureType
    );
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: agricultureType,
      currentResult,
    });

    navigate(`/agriculture/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="Agriculture service"
      xType={agricultureType}
      options={agricultureOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setAgricultureType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
