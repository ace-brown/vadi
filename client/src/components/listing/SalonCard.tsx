import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlaceType } from "@/types";
import { formatPrice } from "@/utils/helpers";
import { Address, CardImage, Rating } from "./shared";
import { notifyDemo } from "./notify-demo";

export type SalonService = { field: string; label: string };

type Props = {
  salon: PlaceType & Record<string, unknown>;
  services: SalonService[];
  highlight?: string;
};

export default function SalonCard({ salon, services, highlight }: Props) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <CardImage src={salon.image} alt={salon.title} />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold text-gray-800">{salon.title}</h2>
              <Rating value={salon.rating} />
            </div>
            <Address address={salon.address} />
          </div>
          <div className="hidden sm:block self-center">
            <Button onClick={() => notifyDemo("Book an appointment", salon.title)}>
              Book an appointment
            </Button>
          </div>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {services.map(({ field, label }) => (
            <div
              key={field}
              className={`rounded-lg border px-3 py-2 ${
                field === highlight ? "border-blue-300 bg-blue-50" : "bg-gray-50"
              }`}
            >
              <dt className="text-xs text-gray-500">{label}</dt>
              <dd className="font-semibold text-gray-800">
                {formatPrice(Number(salon[field]))}
              </dd>
            </div>
          ))}
        </dl>

        <Button
          className="sm:hidden w-full"
          onClick={() => notifyDemo("Book an appointment", salon.title)}
        >
          Book an appointment
        </Button>
      </div>
    </Card>
  );
}
