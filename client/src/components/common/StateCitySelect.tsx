import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import statesData from "@/data/germany_states_and_cities.json";

type Props = {
  state: string;
  city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
};

const citiesByState: Record<string, string[]> = {};
statesData.forEach((state) => {
  citiesByState[state.name] = state.cities;
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
        <label className="block text-sm font-medium">State</label>
        <Select
          value={state}
          onValueChange={(value) => {
            onStateChange(value);
            onCityChange(""); // Reset city when state changes
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any state" />
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
      {state && citiesByState[state] && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">City</label>
          <Select value={city} onValueChange={onCityChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any city" />
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

      {state && (
        <button
          type="button"
          className="text-xs text-blue-700 hover:underline"
          onClick={() => {
            onStateChange("");
            onCityChange("");
          }}
        >
          Clear location
        </button>
      )}
    </div>
  );
}
