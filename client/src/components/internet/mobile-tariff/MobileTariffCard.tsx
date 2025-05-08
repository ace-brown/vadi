import { Card } from "@/components/ui/card";

type DummyTariffInfo = {
  volume: number;
  price: number;
  tariffs: number;
};

type Props = {
  tariff: DummyTariffInfo;
};

export default function MobileTariffCard({ tariff }: Props) {
  return (
    <Card
      className="grid grid-cols-3 md:grid-cols-9 rounded-2xl overflow-hidden border mb-4 text-right"
      dir="rtl"
    >
      <div className="col-span-3 bg-orange-500 text-white p-4 flex flex-col justify-center rounded-l-none md:rounded-l-2xl">
        <span className="text-sm">از</span>
        <div className="text-2xl font-bold">
          {tariff.volume} <small className="text-base">گیگ</small>
        </div>
        <span className="text-sm">حجم اینترنت</span>
      </div>
      <div className="col-span-6 p-4">
        <div className="text-lg font-semibold">
          از {tariff.price} دلار در ماه
        </div>
        <div className="text-sm text-gray-600">
          {tariff.tariffs} تعرفه را مقایسه کنید
        </div>
      </div>
    </Card>
  );
}
