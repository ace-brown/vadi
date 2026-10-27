import { createContext } from "react";
import { OfferKind } from "@/types";

interface SavedOffersContextType {
  // IDs of the offers on the logged-in user's watchlist
  savedIds: Set<string>;
  // Returns false if the user isn't logged in
  toggleSaved: (kind: OfferKind, id: string) => Promise<boolean>;
  refresh: () => void;
}

export const SavedOffersContext = createContext<SavedOffersContextType>({
  savedIds: new Set(),
  toggleSaved: async () => false,
  refresh: () => {},
});
