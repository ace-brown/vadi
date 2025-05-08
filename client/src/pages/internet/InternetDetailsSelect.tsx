import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import StateCitySelect from "@/components/common/StateCitySelect";

export default function InternetDetailsSelectPage() {
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [netType, setNetType] = useState<string>("");

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
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card className="min-h-[420px] grid grid-rows-[1fr_auto]">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="block text-right font-medium">نوع اینترنت</label>
            <Select value={netType} onValueChange={setNetType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="mobileNet"
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  اینترنت موبایل
                </SelectItem>
                <SelectItem
                  value="homeNet"
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  اینترنت خانگی
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <StateCitySelect
            state={selectedState}
            city={selectedCity}
            onStateChange={setSelectedState}
            onCityChange={setSelectedCity}
          />
        </CardContent>
        <div className="px-6 pb-4 pt-0">
          <Button onClick={handleSubmit} className="w-full">
            مقایسه
          </Button>
        </div>
      </Card>
    </div>
  );
}
