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

export default function BarberDetailsSelectPage() {
  const navigate = useNavigate();

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [salonType, setSalonType] = useState<string>("");

  function handleSubmit() {
    const searchParams = new URLSearchParams();

    // Add values to query params
    searchParams.set("state", selectedState);
    searchParams.set("city", selectedCity);
    searchParams.set("type", salonType);

    navigate(`/barber-compare?${searchParams.toString()}`);
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <Card className="min-h-[420px] grid grid-rows-[1fr_auto]">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="block text-right font-medium">نوع آرایشگاه</label>
            <Select value={salonType} onValueChange={setSalonType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem
                  value="all"
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  همه
                </SelectItem>
                <SelectItem
                  value="men"
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  مردانه
                </SelectItem>
                <SelectItem
                  value="women"
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  زنانه
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
