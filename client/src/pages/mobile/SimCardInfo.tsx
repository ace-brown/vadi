import { Card, CardContent } from "@/components/ui/card";

interface SimCardInfoProps {
  type: string;
  simPrice: string;
  validity: string;
  packagePrice: string;
  minutes: string;
  image: string;
}

export default function SimCardInfo({
  type,
  simPrice,
  validity,
  packagePrice,
  minutes,
  image,
}: SimCardInfoProps) {
  return (
    <Card className="rounded shadow-lg p-6">
      <CardContent className="grid grid-cols-4 gap-4 text-right">
        <div className="row-span-2">
          <img src={image} />
        </div>
        <div>
          <p className="text-gray-500">نوع سیمکارت</p>
          <p className="font-semibold mt-1">{type}</p>
        </div>
        <div>
          <p className="text-gray-500">قیمت سیم کارت</p>
          <p className="font-semibold mt-1">{simPrice}</p>
        </div>
        <div>
          <p className="text-gray-500">مدت اعتبار بسته</p>
          <p className="font-semibold mt-1">{validity}</p>
        </div>
        <div>
          <p className="text-gray-500">مبلغ بسته (تومان)</p>
          <p className="font-semibold mt-1">{packagePrice}</p>
        </div>
        <div>
          <p className="text-gray-500">دقیقه بسته</p>
          <p className="font-semibold mt-1">{minutes}</p>
        </div>
      </CardContent>
    </Card>
  );
}
