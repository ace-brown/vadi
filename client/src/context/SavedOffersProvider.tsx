import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "./auth-context";
import { SavedOffersContext } from "./saved-offers-context";
import { apiFetch } from "@/lib/api";
import { OfferKind } from "@/types";

type SavedResponse = { saved: string[] };

export function SavedOffersProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(() => {
    if (!auth.token) {
      setSavedIds(new Set());
      return;
    }
    apiFetch<{ items: { offerId: string }[] }>("/api/me/saved-offers", { token: auth.token })
      .then((data) => setSavedIds(new Set(data.items.map((item) => item.offerId))))
      .catch(() => setSavedIds(new Set()));
  }, [auth.token]);

  useEffect(refresh, [refresh]);

  const toggleSaved = useCallback(
    async (kind: OfferKind, id: string) => {
      if (!auth.token) return false;
      try {
        const data = await apiFetch<SavedResponse>(`/api/me/saved-offers/${kind}/${id}`, {
          method: savedIds.has(id) ? "DELETE" : "PUT",
          token: auth.token,
        });
        setSavedIds(new Set(data.saved));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : String(err));
      }
      return true;
    },
    [auth.token, savedIds]
  );

  return (
    <SavedOffersContext.Provider value={{ savedIds, toggleSaved, refresh }}>
      {children}
    </SavedOffersContext.Provider>
  );
}
