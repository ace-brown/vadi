import React from "react";

type FilterLabelProps = {
  children: React.ReactNode;
};

export default function FilterLabel({ children }: FilterLabelProps) {
  return (
    <label className="block text-base font-semibold text-gray-700 mb-1">
      {children}
    </label>
  );
}
