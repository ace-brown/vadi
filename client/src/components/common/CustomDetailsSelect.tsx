import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StateCitySelect from "@/components/common/StateCitySelect";
import Search from "@/components/search/Search";

type Props = {
  title: string;
  xType: string;
  options: { label: string; value: string }[];
  state: string;
  city: string;
  onSetXType: (value: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onSubmit: () => void;
  children?: React.ReactNode;
};

export default function CustomDetailsSelect({
  title,
  xType,
  options,
  state,
  city,
  onStateChange,
  onCityChange,
  onSetXType,
  onSubmit,
  children,
}: Props) {
  return (
    <div className="max-w-5xl mx-auto">
      <Search />
      <Card className="max-w-md mx-auto min-h-[420px] grid grid-rows-[1fr_auto]">
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label className="block text-right font-medium">{title}</label>
            <Select value={xType} onValueChange={onSetXType}>
              <SelectTrigger className="w-full" style={{ direction: "rtl" }}>
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent className="bg-white" style={{ direction: "rtl" }}>
                {options.map((opt) => (
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

          <StateCitySelect
            state={state}
            city={city}
            onStateChange={onStateChange}
            onCityChange={onCityChange}
          />

          {children}
        </CardContent>
        <div className="px-6 pb-4 pt-0">
          <Button onClick={onSubmit} className="w-full">
            مقایسه
          </Button>
        </div>
      </Card>
    </div>
  );
}
