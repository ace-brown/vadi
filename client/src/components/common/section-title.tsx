import React, { ReactNode } from "react";

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-4xl font-bold text-center text-gray-800 mb-16 md:text-5xl">
      {children}
    </h2>
  );
}
