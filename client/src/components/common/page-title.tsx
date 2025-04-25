import React, { ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export default function PageTitle({ children, className }: TitleProps) {
  return (
    <h1 className={`text-4xl font-bold ${className ?? "text-gray-800"}`}>
      {children}
    </h1>
  );
}
