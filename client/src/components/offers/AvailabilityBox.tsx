import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api";
import { formatNumber } from "@/utils/helpers";

type Result = {
  providers: { providerId: string; provider: string; source: string; connections: { connectionType: string; maxDownloadMbps: number }[] }[];
};

// What each provider offers at the address (from POST /api/availability)
export default function AvailabilityBox({ postcode, street, houseNumber }: { postcode: string; street: string; houseNumber: string }) {
  const { t } = useTranslation();
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    setError(null);
    apiFetch<Result>("/api/availability", { method: "POST", body: { postcode, street, houseNumber }, signal: controller.signal })
      .then(setResult)
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof ApiError ? err.message : String(err));
      });
    return () => controller.abort();
  }, [postcode, street, houseNumber]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!result) return <p className="text-sm text-gray-500">{t("common.loading")}</p>;

  const available = result.providers.filter((provider) => provider.connections.length > 0);
  return (
    <section className="rounded-xl border bg-white p-4 space-y-2" aria-live="polite">
      <h2 className="flex items-center gap-2 font-semibold">
        <MapPin className="w-4 h-4 text-[#023e8a]" />
        {t("availability.title", { address: `${street} ${houseNumber}, ${postcode}` })}
      </h2>
      {available.length === 0 ? (
        <p className="text-sm text-gray-600">{t("availability.none")}</p>
      ) : (
        <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2 text-sm">
          {available.map((provider) => (
            <li key={provider.providerId}>
              <span className="font-medium">{provider.provider}:</span>{" "}
              {provider.connections
                .map((c) => `${c.connectionType} ${t("availability.upTo", { speed: formatNumber(c.maxDownloadMbps) })}`)
                .join(", ")}
            </li>
          ))}
        </ul>
      )}
      {result.providers.some((provider) => provider.source === "sample") && (
        <p className="text-xs text-gray-500">{t("availability.sample")}</p>
      )}
    </section>
  );
}
