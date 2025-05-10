// components/CustomCompareLayout.tsx
import React from "react";

type CustomCompareLayoutProps = {
  filters: React.ReactNode;
  children: React.ReactNode; // the card list
  isLoading: boolean;
  skeleton: React.ReactNode;
  emptyMessage?: string;
};

export default function CustomCompareLayout({
  filters,
  children,
  isLoading,
  skeleton,
  emptyMessage = "موردی یافت نشد.",
}: CustomCompareLayoutProps) {
  return (
    <div className="w-full mx-auto mt-8 py-4 px-0 grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Filter Column */}
      <div className="lg:col-span-1 bg-white p-4 rounded border min-h-[90vh]">
        <h2 className="font-bold text-2xl text-gray-800 tracking-tight mb-4">
          فیلترها
        </h2>
        <div className="space-y-4">{filters}</div>
      </div>

      {/* Card Column */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {isLoading ? (
          [...Array(5)].map((_, i) =>
            React.cloneElement(skeleton as React.ReactElement, { key: i })
          )
        ) : React.Children.count(children) === 0 ? (
          <p className="text-center text-gray-500 text-lg mt-8">
            {emptyMessage}
          </p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
