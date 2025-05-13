import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SimCardInfoType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";

export default function SimCardInfo({
  type,
  simPrice,
  validity,
  packagePrice,
  minutes,
  image,
}: SimCardInfoType) {
  return (
    <Card className="rounded shadow-lg p-4">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
        <div className="sm:row-span-1 md:row-span-2">
          <img
            src={`${import.meta.env.VITE_API_URL}/${image}`}
            className="w-[80px] sm:w-[180px] mx-auto"
          />
        </div>
        <div>
          <p className="text-gray-500">نوع سیمکارت</p>
          <p className="font-semibold mt-1">{type}</p>
        </div>
        <div>
          <p className="text-gray-500">قیمت سیم کارت</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(simPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">مدت اعتبار بسته</p>
          <p className="font-semibold mt-1">{validity}</p>
        </div>
        <div>
          <p className="text-gray-500">مبلغ بسته</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(packagePrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">دقیقه بسته</p>
          <p className="font-semibold mt-1">{minutes}</p>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <Button className="w-full">سفارش</Button>
        </div>
      </CardContent>
    </Card>
  );
}
