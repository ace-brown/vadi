import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterCollapseProps = {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (value: string) => void;
};

export default function FilterCollapse({
  label,
  options,
  selectedValues,
  onChange,
}: FilterCollapseProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => setIsOpen((prev) => !prev);

  return (
    <div className="border rounded mb-4">
      <button
        onClick={toggleCollapse}
        className="w-full text-right font-semibold px-3 py-2 hover:bg-gray-100 transition flex justify-between items-center"
      >
        <span>{label}</span>
        <span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isOpen && (
        <div className="px-3 py-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 mb-2 cursor-pointer"
            >
              <input
                type="checkbox"
                value={option}
                checked={selectedValues.includes(option)}
                onChange={() => onChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
