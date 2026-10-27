import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Bookmark } from "lucide-react";
import { SavedOffersContext } from "@/context/saved-offers-context";
import { OfferKind } from "@/types";

// Bookmark toggle that adds an offer to the user's watchlist
export default function SaveButton({ kind, offerId, withLabel = false }: { kind: OfferKind; offerId: string; withLabel?: boolean }) {
  const { t } = useTranslation();
  const { savedIds, toggleSaved } = useContext(SavedOffersContext);
  const isSaved = savedIds.has(offerId);
  const label = isSaved ? t("save.remove") : t("save.add");

  return (
    <button
      type="button"
      aria-pressed={isSaved}
      aria-label={withLabel ? undefined : label}
      title={label}
      className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#023e8a]"
      onClick={async () => {
        if (!(await toggleSaved(kind, offerId))) toast.info(t("save.loginFirst"));
      }}
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#023e8a] text-[#023e8a]" : ""}`} />
      {withLabel && label}
    </button>
  );
}
