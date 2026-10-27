import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function VehicleDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const vehicleOptions = [
    { label: "Car repair", value: "autoRepair" },
    { label: "Motorcycle repair", value: "motorcycleRepair" },
  ];

  function handleSubmit() {
    if (!vehicleType) {
      alert("Please select your vehicle type.");
      return;
    }

    const routeMap: Record<string, string> = {
      autoRepair: "auto-repair",
      motorcycleRepair: "motorcycle-repair",
    };

    const slug = routeMap[vehicleType];
    if (!slug) return;

    const currentOpt = vehicleOptions.find((opt) => opt.value === vehicleType);
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: vehicleType,
      currentResult,
    });

    navigate(`/vehicle/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="Vehicle type"
      xType={vehicleType}
      options={vehicleOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setVehicleType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
