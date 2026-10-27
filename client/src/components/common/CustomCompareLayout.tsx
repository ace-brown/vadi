import React, { useState } from "react";
import { CornerUpLeft, SlidersHorizontal, SearchX, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import ListingCardSkeleton from "@/components/listing/ListingCardSkeleton";

type CustomCompareLayoutProps = {
  title: string;
  subtitle?: string;
  filters?: React.ReactNode;
  children: React.ReactNode;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
  total?: number;
  // Shown under the title, e.g. "Prices last checked" and "incl. VAT"
  notice?: React.ReactNode;
  // Shown above the results, e.g. an address check
  intro?: React.ReactNode;
  // Shown after the results, e.g. a "Show more" button
  footer?: React.ReactNode;
  emptyMessage?: string;
  isAnyFilterActive?: boolean;
  returnTxt?: string;
  returnSlug?: string;
  onResetFilters?: () => void;
};

export default function CustomCompareLayout({
  title,
  subtitle,
  filters,
  children,
  isLoading,
  error,
  onRetry,
  total,
  notice,
  intro,
  footer,
  emptyMessage,
  isAnyFilterActive,
  returnTxt,
  returnSlug,
  onResetFilters,
}: CustomCompareLayoutProps) {
  const { t } = useTranslation();
  const [showFilters, setShowFilters] = useState(false);
  const isEmpty = React.Children.count(children) === 0;

  function renderResults() {
    if (isLoading && isEmpty) {
      return [...Array(4)].map((_, i) => <ListingCardSkeleton key={i} />);
    }
    if (error) {
      return (
        <div className="flex flex-col items-center gap-3 text-center py-16 text-gray-600">
          <TriangleAlert className="w-10 h-10 text-red-500" />
          <p className="text-lg">{error}</p>
          {onRetry && <Button onClick={onRetry}>{t("common.retry")}</Button>}
        </div>
      );
    }
    if (isEmpty) {
      return (
        <div className="flex flex-col items-center gap-3 text-center py-16 text-gray-600">
          <SearchX className="w-10 h-10 text-gray-400" />
          <p className="text-lg">{emptyMessage ?? t("common.noResults")}</p>
          {isAnyFilterActive && onResetFilters && (
            <Button variant="outline" onClick={onResetFilters}>
              {t("common.clearFilters")}
            </Button>
          )}
        </div>
      );
    }
    // Keep showing the old results, slightly faded, while new ones load
    return (
      <div
        className={`flex flex-col gap-4 transition-opacity ${
          isLoading ? "opacity-60" : ""
        }`}
      >
        {children}
        {footer}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto mt-6 py-4 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Filter Column */}
      <aside className="lg:sticky lg:top-4 lg:self-start">
        <button
          type="button"
          className="lg:hidden w-full flex items-center justify-center gap-2 border rounded-lg bg-white py-2 font-medium"
          onClick={() => setShowFilters((prev) => !prev)}
          aria-expanded={showFilters}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? t("common.hideFilters") : t("common.showFilters")}
        </button>
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block mt-3 lg:mt-0 bg-white p-4 rounded-xl border`}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-bold text-lg text-gray-800">{t("common.filters")}</h2>
            {isAnyFilterActive && (
              <button
                type="button"
                className="text-xs text-red-500 font-bold"
                onClick={onResetFilters}
              >
                {t("common.clearFilters")}
              </button>
            )}
          </div>
          <div className="space-y-4">{filters}</div>
        </div>
      </aside>

      {/* Card Column */}
      <section className="flex flex-col gap-4 min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500" aria-live="polite">
              {subtitle ??
                (isLoading && isEmpty
                  ? t("common.loading")
                  : t("common.results", { count: total ?? 0 }))}
            </p>
            {notice && <div className="text-xs text-gray-500 mt-1">{notice}</div>}
          </div>
          {returnTxt && (
            <Link
              to={returnSlug ?? ""}
              className="flex items-center gap-1 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-sm py-1.5 px-3 rounded-md transition"
            >
              <CornerUpLeft className="w-4 h-4" />
              {returnTxt}
            </Link>
          )}
        </div>
        {intro}
        {renderResults()}
      </section>
    </div>
  );
}
