type FilterSliderProps = {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
};

export default function FilterSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue,
}: FilterSliderProps) {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer"
      />
      <p className="text-sm text-gray-600 mt-1">
        {formatValue ? formatValue(value) : value}
      </p>
    </div>
  );
}
