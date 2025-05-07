import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import provincesData from "@/data/provinces_and_main_cities.json";

type Props = {
  state: string;
  city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
};

const citiesByState: Record<string, string[]> = {};
provincesData.forEach((province) => {
  citiesByState[province.name] = province.cities;
});

export default function StateCitySelect({
  state,
  city,
  onStateChange,
  onCityChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* State selector */}
      <div className="space-y-2">
        <label className="block text-right font-medium">
          استان خود را انتخاب کنید
        </label>
        <Select
          value={state}
          onValueChange={(value) => {
            onStateChange(value);
            onCityChange(""); // Reset city when state changes
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="استان را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md rounded-md">
            {Object.keys(citiesByState).map((stateName) => (
              <SelectItem
                key={stateName}
                value={stateName}
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
              >
                {stateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City selector */}
      {state && (
        <div className="space-y-2">
          <label className="block text-right font-medium">
            شهر خود را انتخاب کنید
          </label>
          <Select value={city} onValueChange={onCityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="شهر را انتخاب کنید" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-md rounded-md">
              {citiesByState[state].map((cityName) => (
                <SelectItem
                  key={cityName}
                  value={cityName}
                  className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100"
                >
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
