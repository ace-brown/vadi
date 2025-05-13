import { Card, CardContent } from "@/components/ui/card";

export default function SimCardInfoSkeleton() {
  return (
    <Card className="rounded border border-gray-300 p-4 animate-pulse">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
        {/* Image Skeleton */}
        <div className="sm:row-span-1 md:row-span-2">
          <div className="bg-gray-300 w-[80px] sm:w-[180px] h-[80px] sm:h-[180px] mx-auto rounded" />
        </div>

        {/* Text Skeleton */}
        <div>
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="bg-gray-300 h-4 w-1/3 mt-2 rounded" />
        </div>
        <div>
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="bg-gray-300 h-4 w-1/3 mt-2 rounded" />
        </div>
        <div>
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="bg-gray-300 h-4 w-1/3 mt-2 rounded" />
        </div>
        <div>
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="bg-gray-300 h-4 w-1/3 mt-2 rounded" />
        </div>
        <div>
          <div className="bg-gray-300 h-4 w-2/3 rounded" />
          <div className="bg-gray-300 h-4 w-1/3 mt-2 rounded" />
        </div>

        {/* Button Skeleton */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="bg-gray-300 w-full h-10 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
