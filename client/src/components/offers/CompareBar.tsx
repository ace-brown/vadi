import { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompareContext } from "@/context/compare-context";
import { OfferKind } from "@/types";

// Sticky bar that appears once offers are picked for comparison
export default function CompareBar({ kind }: { kind: OfferKind }) {
  const { t } = useTranslation();
  const { selected, clear } = useContext(CompareContext);
  const count = selected[kind].length;
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-white border shadow-lg px-4 py-2">
        <Button asChild size="sm">
          <Link to={`/compare/${kind}`}>
            <Columns3 className="w-4 h-4" />
            {t("compare.bar", { count })}
          </Link>
        </Button>
        <button type="button" className="text-sm text-gray-600 hover:underline" onClick={() => clear(kind)}>
          {t("compare.clear")}
        </button>
      </div>
    </div>
  );
}
