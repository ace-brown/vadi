import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object or date string into a human-readable string.
 * @param date - The Date object or ISO date string to format.
 * @param locale - The locale string for formatting (default is 'fa-IR').
 * @param options - Optional Intl.DateTimeFormat options for customization.
 * @returns A formatted date string or 'Invalid Date' if the input is invalid.
 */
export function formatDate(
  date: Date | string | undefined,
  locale: string = "fa-IR",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  if (!date) return "تاریخ نامشخص";
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return isNaN(parsedDate.getTime())
    ? "تاریخ نامعتبر"
    : parsedDate.toLocaleDateString(locale, options);
}
