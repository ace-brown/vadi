import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import FilterCollapse from "@/components/common/FilterCollapse";
import FilterSlider from "@/components/common/FilterSlider";
import StateCitySelect from "@/components/common/StateCitySelect";
import { Range } from "@/types";

export function SearchFilter({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}

export function LocationFilter(props: {
  state: string;
  city: string;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}) {
  return (
    <FilterCollapse label="Location">
      <StateCitySelect {...props} />
    </FilterCollapse>
  );
}

// A slider for an upper ("max") or lower ("min") limit. `null` means no limit,
// and the slider's ends come from the range the server reports for the field.
export function LimitSlider({
  label,
  range,
  value,
  onChange,
  kind,
  step = 1,
  format,
}: {
  label: string;
  range?: Range;
  value: number | null;
  onChange: (value: number | null) => void;
  kind: "min" | "max";
  step?: number;
  format: (value: number) => string;
}) {
  if (!range || range.min === null || range.max === null) return null;
  const min = Math.floor(range.min / step) * step;
  const max = Math.ceil(range.max / step) * step;
  const current = value ?? (kind === "max" ? max : min);

  return (
    <FilterSlider
      label={label}
      min={min}
      max={max}
      step={step}
      value={current}
      onChange={(next) => {
        const isNoLimit = kind === "max" ? next >= max : next <= min;
        onChange(isNoLimit ? null : next);
      }}
      formatValue={(v) =>
        value === null
          ? "Any"
          : kind === "max"
            ? `Up to ${format(v)}`
            : `At least ${format(v)}`
      }
    />
  );
}
