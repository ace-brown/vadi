import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function BarberDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [salonType, setSalonType] = useState<string>("");
  const salonOptions = [
    { label: "مردانه", value: "menBarber" },
    { label: "زنانه", value: "womenBarber" },
  ];

  function handleSubmit() {
    if (!salonType) {
      alert("لطفاً نوع آرایشگاه را انتخاب کنید.");
      return;
    }

    const routeMap: Record<string, string> = {
      menBarber: "men-barber-compare",
      womenBarber: "women-barber-compare",
    };

    const slug = routeMap[salonType];
    if (!slug) return;

    // Send all the results from options
    const currentOpt = salonOptions.find((opt) => opt.value === salonType);
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: salonType,
      currentResult,
    });

    navigate(`/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع آرایشگاه"
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
