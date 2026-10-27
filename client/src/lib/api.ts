import { useCallback, useEffect, useState } from "react";
import i18n from "@/i18n";

export const API_URL = import.meta.env.VITE_API_URL as string;

type Options = {
  method?: string;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  errors?: { field: string; message: string }[];
  constructor(message: string, status: number, errors?: { field: string; message: string }[]) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

// JSON request to the API; throws ApiError with the server's message on failure
export async function apiFetch<T>(path: string, { method = "GET", body, token, signal }: Options = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      signal,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(i18n.t("common.serverDown"), 0);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.message || i18n.t("common.serverDown"), response.status, data.errors);
  }
  return data as T;
}

// Load one GET endpoint; `path` null means "don't load yet"
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(!!path);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setIsLoading(true);
    apiFetch<T>(path, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setError(null);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof ApiError ? err : new ApiError(String(err), 0));
        setIsLoading(false);
      });
    return () => controller.abort();
  }, [path, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  return { data, error, isLoading, reload };
}

// Link through the API's click-tracking redirect to the provider
export function goToOfferUrl(kind: "home" | "mobile", id: string) {
  return `${API_URL}/api/go/${kind}/${id}`;
}
