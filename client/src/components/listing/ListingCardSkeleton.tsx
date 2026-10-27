import { Card } from "@/components/ui/card";

export default function ListingCardSkeleton() {
  return (
    <Card className="p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="bg-gray-200 w-20 h-20 sm:w-28 sm:h-28 rounded-lg shrink-0" />
        <div className="flex-1 space-y-3 py-1">
          <div className="bg-gray-200 h-5 w-1/2 rounded" />
          <div className="bg-gray-200 h-4 w-1/3 rounded" />
          <div className="flex gap-2">
            <div className="bg-gray-200 h-6 w-20 rounded" />
            <div className="bg-gray-200 h-6 w-24 rounded" />
            <div className="bg-gray-200 h-6 w-16 rounded" />
          </div>
        </div>
        <div className="hidden sm:block bg-gray-200 w-28 h-10 rounded self-center" />
      </div>
    </Card>
  );
}
