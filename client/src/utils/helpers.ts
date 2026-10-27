const priceFormat = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(value: number): string {
  return priceFormat.format(value);
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatTerm(months: number): string {
  return months === 1 ? "Monthly cancellable" : `${months} months`;
}

export function imageUrl(path?: string): string | undefined {
  return path ? `${import.meta.env.VITE_API_URL}/${path}` : undefined;
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
