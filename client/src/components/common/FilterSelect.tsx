type FilterSelectProps = {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
};

export default function FilterSelect({
  label = "Sort by",
  options,
  value,
  onChange,
}: FilterSelectProps) {
  return (
    <label className="block">
      <span className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm bg-white hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
