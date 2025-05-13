import { toast } from "sonner";
import CardInfoItem from "@/components/common/CardInfoItem";
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
  function handleOrder() {
    toast.success("سفارش شما با موفقیت ثبت شد.", {
      description: "به زودی با شما تماس خواهیم گرفت.",
    });
  }
  return (
    <Card className="rounded shadow-lg p-4 pr-0">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-right">
        <div className="sm:row-span-1 md:row-span-2">
          <img
            alt={`${title} image`}
            src={`${import.meta.env.VITE_API_URL}/${image}`}
            className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] mx-auto object-cover"
          />
        </div>
        {/* <div>
          <h2 className="font-extrabold text-2xl text-gray-800 text-right">
            {title}
          </h2>
        </div> */}
        <CardInfoItem label="سرعت" value={speed} />
        <CardInfoItem
          label="مبلغ بسته (تومان)"
          value={price.toLocaleString()}
        />
        <CardInfoItem label="مدت اعتبار" value={duration} />
        <CardInfoItem label="نوع اینترنت" value={netType} />
        <CardInfoItem label="حجم بسته" value={volume} />
        <div className="sm:col-span-2 lg:col-span-1">
          <Button onClick={handleOrder} className="w-full">
            سفارش
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
