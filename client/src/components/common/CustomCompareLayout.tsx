import React from "react";
import { CornerUpLeft } from "lucide-react";
import { Link } from "react-router-dom";

type CustomCompareLayoutProps = {
  filters: React.ReactNode;
  children: React.ReactNode;
  isLoading: boolean;
  skeleton: React.ReactNode;
  emptyMessage?: string;
  isAnyFilterActive: boolean;
  currentResult: string;
  returnTxt: string;
  returnSlug: string;
  onResetFilters: () => void;
};

export default function CustomCompareLayout({
  filters,
  children,
  isLoading,
  skeleton,
  emptyMessage = "موردی یافت نشد.",
  isAnyFilterActive,
  currentResult,
  returnTxt,
  returnSlug,
  onResetFilters,
}: CustomCompareLayoutProps) {
  return (
    <div className="w-full mx-auto mt-8 py-4 px-0 grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Filter Column */}
      <div className="lg:col-span-1 bg-white p-4 rounded border min-h-[90vh]">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-bold text-xl text-gray-800 tracking-tight mb-4">
            فیلترها
          </h2>
          {isAnyFilterActive && (
            <button
              className="text-[12px] text-red-500 font-bold mb-3"
              onClick={onResetFilters}
            >
              حذف فیلتر ها
            </button>
          )}
        </div>
        <div className="space-y-4">{filters}</div>
      </div>

      {/* Card Column */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="flex items-center justify-between" dir="rtl">
          <h2 className="text-lg font-semibold text-gray-800">{`نتایج ${currentResult}`}</h2>
          {returnTxt && (
            <Link to={returnSlug}>
              <button className="flex items-center gap-1 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-sm text-black font-normal py-1.5 px-3 rounded-md transition">
                <CornerUpLeft className="w-4 h-4" />
                {returnTxt}
              </button>
            </Link>
          )}
        </div>
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
