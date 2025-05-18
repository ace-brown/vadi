import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";

export default function EducationDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [educationTypes, setEducationTypes] = useState<string>("");
  const educationOptions = [
    { label: "آموزشگاه ها", value: "eduCenters" },
    { label: "کتابفروشی ها", value: "bookStores" },
  ];

  function handleSubmit() {
    if (!educationTypes) {
      alert("لطفاً نوع خدمات آموزشی را انتخاب کنید.");
      return;
    }

    const routeMap: Record<string, string> = {
      eduCenters: "centers",
      bookStores: "bookstores",
    };

    const slug = routeMap[educationTypes];
    if (!slug) return;

    const currentOpt = educationOptions.find(
      (opt) => opt.value === educationTypes
    );
    const currentResult = currentOpt?.label || "";

    const searchParams = new URLSearchParams({
      state: selectedState,
      city: selectedCity,
      type: educationTypes,
      currentResult,
    });

    navigate(`/education/${slug}?${searchParams.toString()}`);
  }

  return (
    <CustomDetailsSelect
      title="نوع خدمات آموزشی"
      xType={educationTypes}
      options={educationOptions}
      state={selectedState}
      city={selectedCity}
      onSetXType={setEducationTypes}
      onStateChange={setSelectedState}
      onCityChange={setSelectedCity}
      onSubmit={handleSubmit}
    />
  );
}
