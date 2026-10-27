import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ServicePlaceType } from "@/types";
import { Address, CardImage, Rating } from "./shared";
import { notifyDemo } from "./notify-demo";

type Props = ServicePlaceType & { actionLabel: string };

export default function PlaceCard({
  title,
  address,
  rating,
  services,
  image,
  actionLabel,
}: Props) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-4 flex-1 min-w-0">
          <CardImage src={image} alt={title} />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <Rating value={rating} />
            </div>
            <Address address={address} />
            {services.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Services">
                {services.map((service) => (
                  <li key={service}>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 border-blue-100 text-blue-900 font-normal"
                    >
                      {service}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="sm:self-center">
          <Button
            className="w-full sm:w-auto"
            onClick={() => notifyDemo(actionLabel, title)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
