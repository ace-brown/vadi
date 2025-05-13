import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WomenSalonPlansType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";

export default function BeautySalonCard({
  title,
  faceCarePrice,
  hairBotoxPrice,
  hairColorPrice,
  makeupPrice,
  eyelashExtensionPrice,
  eyebrowShapePrice,
  eyebrowLiftPrice,
  nailExtensionPrice,
  manicurePrice,
  waxingPrice,
  image,
}: WomenSalonPlansType) {
  return (
    <Card className="rounded shadow-lg p-2">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 text-right">
        <div className="sm:row-span-1 md:row-span-2 pl-2">
          <img
            alt={`${title} image`}
            src={image}
            className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] mx-auto object-cover"
          />
        </div>
        <div>
          <h2 className="font-extrabold text-2xl text-gray-800 text-right">
            {title}
          </h2>
        </div>

        <div>
          <p className="text-gray-500">اصلاح صورت</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(faceCarePrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">بوتاکس مو</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(hairBotoxPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">رنگ مو</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(hairColorPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">میکاپ</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(makeupPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">کاشت مژه</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(eyelashExtensionPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">اصلاح ابرو</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(eyebrowShapePrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">لیفت ابرو</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(eyebrowLiftPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">کاشت ناخن</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(nailExtensionPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">مانیکور</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(manicurePrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">اپلاسیون</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(waxingPrice)} تومان`}
          </p>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <Button className="w-full">گرفتن نوبت</Button>
        </div>
      </CardContent>
    </Card>
  );
}
