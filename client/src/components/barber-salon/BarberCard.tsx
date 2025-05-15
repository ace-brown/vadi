import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenSalonPlansType } from "@/types";
import { englishToPersianDigits } from "@/utils/helpers";

export default function BarberCard({
  title,
  haircutPrice,
  menLiftPrice,
  groomMakeupPrice,
  curlyHairDoPrice,
  image,
}: MenSalonPlansType) {
  function handleOrder() {
    toast.success("سفارش شما با موفقیت ثبت شد.", {
      description: "به زودی با شما تماس خواهیم گرفت.",
    });
  }
  return (
    <Card className="rounded shadow-lg p-4">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-right">
        <div className="sm:row-span-1 md:row-span-2">
          <img
            alt={`${title} image`}
            src={`${import.meta.env.VITE_API_URL}/${image}`}
            className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] mx-auto object-cover"
          />
        </div>
        <div>
          <h2 className="font-extrabold text-2xl text-gray-800 text-right">
            {title}
          </h2>
        </div>
        <div>
          <p className="text-gray-500">اصلاح مو و ریش</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(haircutPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">جوان سازی پوست</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(menLiftPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">گریم حرفه ای داماد</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(groomMakeupPrice)} تومان`}
          </p>
        </div>
        <div>
          <p className="text-gray-500">فر کردن مو</p>
          <p className="font-semibold mt-1">
            {`${englishToPersianDigits(curlyHairDoPrice)} تومان`}
          </p>
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <Button onClick={handleOrder} className="w-full">
            گرفتن نوبت
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
