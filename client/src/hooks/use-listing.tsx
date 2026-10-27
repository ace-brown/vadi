import { useCallback, useEffect, useRef, useState } from "react";
import { ListingResponse } from "@/types";
import { apiFetch } from "@/lib/api";

type Params = Record<string, string | number | null | undefined>;

function toQueryString(params: Params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  return searchParams.toString();
}

// Fetch a list endpoint, letting the server do the filtering and sorting.
// Changes to `params` are debounced so dragging a slider sends one request.
export function useListing<T>(endpoint: string, params: Params) {
  const [data, setData] = useState<ListingResponse<T> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const hasLoaded = useRef(false);

  const query = toQueryString(params);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const timer = setTimeout(
      async () => {
        try {
          const body = await apiFetch<ListingResponse<T>>(`${endpoint}?${query}`, {
            signal: controller.signal,
          });
          setData(body);
          setError(null);
          hasLoaded.current = true;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setError(err instanceof Error ? err.message : String(err));
        }
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      },
      hasLoaded.current ? 300 : 0
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [endpoint, query, reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    ranges: data?.ranges ?? {},
    facets: data?.facets ?? {},
    isLoading,
    error,
    retry,
  };
}
