// components/CheckboxGroup.tsx

type CheckboxGroupProps = {
  options: string[];
  selected: string[];
  onChange: (value: string) => void;
};

export default function CheckboxGroup({
  options,
  selected,
  onChange,
}: CheckboxGroupProps) {
  return (
    <div className="space-y-1 mt-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            value={option}
            checked={selected.includes(option)}
            onChange={() => onChange(option)}
            className="cursor-pointer"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}
