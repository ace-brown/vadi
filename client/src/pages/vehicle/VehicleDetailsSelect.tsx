import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function VehicleDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [vehicleType, setVehicleType] = useState<string>("");
  const vehicleOptions = [
    { label: "تعمیرات خودرو", value: "autoRepair" },
    { label: "تعمیرات موتور سیکلت", value: "motorcycleRepair" },
  ];

  function handleSubmit() {
    if (!vehicleType) {
      alert("لطفاً نوع وسیله نقلیه ی خود را انتخاب کنید.");
      return;
    }

    const routeMap: Record<string, string> = {
      autoRepair: "auto-repair",
      motorcycleRepair: "motorcycle-repair",
    };

    const slug = routeMap[vehicleType];
    if (!slug) return;

    // Send all the results from options
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
      title="نوع وسیله نقلیه"
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
