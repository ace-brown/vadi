import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function BarberDetailsSelectPage() {
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [salonType, setSalonType] = useState<string>("");
  const salonOptions = [
    { label: "مردانه", value: "men" },
    { label: "زنانه", value: "women" },
  ];

  function handleSubmit() {
    const searchParams = new URLSearchParams();

    // Add values to query params
    searchParams.set("state", selectedState);
    searchParams.set("city", selectedCity);
    searchParams.set("type", salonType);

    navigate(`/barber-compare?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع آرایشگاه"
      selectedItem={salonType}
      options={salonOptions}
      state={selectedState}
      city={selectedCity}
      onSelectedItem={setSalonType}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
