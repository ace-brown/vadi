import i18n, { currentLocale } from "@/i18n";

export function formatPrice(value: number): string {
  return new Intl.NumberFormat(currentLocale(), {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

export function formatNumber(value: number): string {
  return value.toLocaleString(currentLocale());
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString(currentLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTerm(months: number): string {
  return months === 1
    ? i18n.t("term.monthly")
    : i18n.t("term.months", { count: months });
}

export function imageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  return /^https?:\/\//.test(path) ? path : `${import.meta.env.VITE_API_URL}/${path}`;
}

// Add or remove a value from a list of selected checkbox values
export function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

// Join selected checkbox values into a comma-separated query parameter
export function joinValues(values: string[]): string | null {
  return values.length > 0 ? values.join(",") : null;
}
