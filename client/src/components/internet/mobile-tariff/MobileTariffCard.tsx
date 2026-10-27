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
      className="grid grid-cols-3 md:grid-cols-9 rounded-2xl overflow-hidden border mb-4"
    >
      <div className="col-span-3 bg-orange-500 text-white p-4 flex flex-col justify-center rounded-r-none md:rounded-r-2xl">
        <span className="text-sm">From</span>
        <div className="text-2xl font-bold">
          {tariff.volume} <small className="text-base">GB</small>
        </div>
        <span className="text-sm">data</span>
      </div>
      <div className="col-span-6 p-4">
        <div className="text-lg font-semibold">
          From ${tariff.price} per month
        </div>
        <div className="text-sm text-gray-600">
          Compare {tariff.tariffs} plans
        </div>
      </div>
    </Card>
  );
}
