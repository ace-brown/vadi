import { useCallback, useEffect, useState } from "react";
import { CompareContext, CompareState, MAX_COMPARE, STORAGE_KEY } from "./compare-context";
import { OfferKind } from "@/types";

function load(): CompareState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      home: Array.isArray(parsed.home) ? parsed.home.slice(0, MAX_COMPARE) : [],
      mobile: Array.isArray(parsed.mobile) ? parsed.mobile.slice(0, MAX_COMPARE) : [],
    };
  } catch {
    return { home: [], mobile: [] };
  }
}

// Offers picked for side-by-side comparison, remembered in this browser
export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<CompareState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // Not remembered across reloads, but still works
    }
  }, [selected]);

  // Returns false when the list is already full
  const toggle = useCallback(
    (kind: OfferKind, id: string) => {
      const current = selected[kind];
      if (!current.includes(id) && current.length >= MAX_COMPARE) return false;
      setSelected((prev) => ({
        ...prev,
        [kind]: prev[kind].includes(id)
          ? prev[kind].filter((value) => value !== id)
          : [...prev[kind], id],
      }));
      return true;
    },
    [selected]
  );

  const remove = useCallback((kind: OfferKind, id: string) => {
    setSelected((prev) => ({ ...prev, [kind]: prev[kind].filter((value) => value !== id) }));
  }, []);

  const clear = useCallback((kind: OfferKind) => {
    setSelected((prev) => ({ ...prev, [kind]: [] }));
  }, []);

  const replace = useCallback((kind: OfferKind, ids: string[]) => {
    setSelected((prev) => ({ ...prev, [kind]: ids.slice(0, MAX_COMPARE) }));
  }, []);

  return (
    <CompareContext.Provider value={{ selected, toggle, remove, clear, replace }}>
      {children}
    </CompareContext.Provider>
  );
}
