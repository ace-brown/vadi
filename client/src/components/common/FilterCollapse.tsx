import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type Option = { value: string; label: string };

type FilterCollapseProps = {
  label: string;
  defaultOpen?: boolean;
  // Either a list of checkboxes...
  options?: Option[];
  selectedValues?: string[];
  onChange?: (value: string) => void;
  // ...or any custom content
  children?: React.ReactNode;
};

export default function FilterCollapse({
  label,
  defaultOpen = true,
  options,
  selectedValues = [],
  onChange,
  children,
}: FilterCollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleCollapse = () => setIsOpen((prev) => !prev);

  return (
    <div className="border rounded-lg">
      <button
        type="button"
        onClick={toggleCollapse}
        aria-expanded={isOpen}
        className="w-full font-semibold text-sm px-3 py-2 hover:bg-gray-50 transition flex justify-between items-center"
      >
        <span>{label}</span>
        <span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isOpen && (
        <div className="px-3 pb-3 pt-1">
          {options?.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 py-1 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                className="accent-[#023e8a]"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => onChange?.(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
          {children}
        </div>
      )}
    </div>
  );
}
