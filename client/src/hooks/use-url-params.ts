import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

type Value = string | number | string[] | null | undefined;

// Filter state kept in the URL, so results can be shared and survive a reload
export function useUrlParams() {
  const [params, setParams] = useSearchParams();

  const get = useCallback((key: string) => params.get(key) ?? "", [params]);

  const getList = useCallback(
    (key: string) => (params.get(key) ?? "").split(",").filter(Boolean),
    [params]
  );

  const getNumber = useCallback(
    (key: string) => {
      const value = params.get(key);
      if (value === null || value === "") return null;
      const number = Number(value);
      return Number.isNaN(number) ? null : number;
    },
    [params]
  );

  // Empty values remove the parameter
  const set = useCallback(
    (updates: Record<string, Value>) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            const text = Array.isArray(value) ? value.join(",") : value;
            if (text === null || text === undefined || text === "") {
              next.delete(key);
            } else {
              next.set(key, String(text));
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  return { get, getList, getNumber, set };
}
