import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomDetailsSelect from "@/components/common/CustomDetailsSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TravelDetailsSelectPage() {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [netType, setNetType] = useState<string>("");
  const [travelPoint, setTravelPoint] = useState<string>("");
  const internetOptions = [{ label: " خانگی", value: "domestic" }];

  const TRAVEL_POINTS = [
    {
      label: "test1",
      value: "Wed 11",
    },
    {
      label: "test2",
      value: "Fri 22",
    },
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
    >
      <div className="space-y-2">
        <label className="block text-right font-medium"></label>
        <Select value={travelPoint} onValueChange={setTravelPoint}>
          <SelectTrigger className="w-full" style={{ direction: "rtl" }}>
            <SelectValue placeholder="انتخاب کنید" />
          </SelectTrigger>
          <SelectContent className="bg-white" style={{ direction: "rtl" }}>
            {TRAVEL_POINTS?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </CustomDetailsSelect>
  );
}
