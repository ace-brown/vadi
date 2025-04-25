import React, { ReactNode } from "react";

interface SubSectionTitleProps {
  children: ReactNode;
  textAlign?: "left" | "center" | "right";
}

export default function SubSectionTitle({
  children,
  textAlign = "right",
}: SubSectionTitleProps) {
  return (
    <h2
      className={`text-3xl sm:text-2xl font-bold text-gray-800 mb-12 ${
        textAlign === "left"
          ? "text-left"
          : textAlign === "center"
          ? "text-center"
          : "text-right"
      }`}
    >
      {children}
    </h2>
  );
}
