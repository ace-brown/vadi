import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HomeNetType } from "@/types";

export default function HomeNetCard({
  title,
  speed,
  duration,
  volume,
  netType,
  price,
  image,
}: HomeNetType) {
  return (
    <Card className="rounded shadow-lg p-4 pr-0">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-right">
        <div className="sm:row-span-1 md:row-span-2">
          <img
            alt={`${title} image`}
            src={image}
            className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] mx-auto object-cover"
          />
        </div>
        {/* <div>
          <h2 className="font-extrabold text-2xl text-gray-800 text-right">
            {title}
          </h2>
        </div> */}
        <div>
          <p className="text-gray-500">سرعت</p>
          <p className="font-semibold mt-1">{speed}</p>
        </div>
        <div>
          <p className="text-gray-500">مبلغ بسته (تومان)</p>
          <p className="font-semibold mt-1">{price}</p>
        </div>
        <div>
          <p className="text-gray-500">مدت اعتبار</p>
          <p className="font-semibold mt-1">{duration}</p>
        </div>
        <div>
          <p className="text-gray-500">نوع اینترنت</p>
          <p className="font-semibold mt-1">{netType}</p>
        </div>
        <div>
          <p className="text-gray-500">حجم بسته</p>
          <p className="font-semibold mt-1">{volume}</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <Button className="w-full">سفارش</Button>
        </div>
      </CardContent>
    </Card>
  );
}
