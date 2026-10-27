import { createContext } from "react";
import { OfferKind } from "@/types";

export const MAX_COMPARE = 3;
export const STORAGE_KEY = "compare";

export type CompareState = Record<OfferKind, string[]>;

interface CompareContextType {
  selected: CompareState;
  toggle: (kind: OfferKind, id: string) => boolean;
  remove: (kind: OfferKind, id: string) => void;
  clear: (kind: OfferKind) => void;
  // Replace the list, e.g. when opening a saved comparison
  replace: (kind: OfferKind, ids: string[]) => void;
}

export const CompareContext = createContext<CompareContextType>({
  selected: { home: [], mobile: [] },
  toggle: () => false,
  remove: () => {},
  clear: () => {},
  replace: () => {},
});
