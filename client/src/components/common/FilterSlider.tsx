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
    <div className="py-1">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={min >= max}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full cursor-pointer accent-[#023e8a] disabled:cursor-not-allowed"
      />
      <p className="text-xs text-gray-600 mt-1">
        {formatValue ? formatValue(value) : value}
      </p>
    </div>
  );
}
