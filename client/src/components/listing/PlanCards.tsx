import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HomePlanType, MobilePlanType } from "@/types";
import { formatNumber, formatPrice, formatTerm } from "@/utils/helpers";
import { CardImage, Stat } from "./shared";
import { notifyDemo } from "./notify-demo";

function PlanCard({
  provider,
  name,
  image,
  badges,
  stats,
  monthlyPrice,
  setupFee,
}: {
  provider: string;
  name: string;
  image?: string;
  badges: string[];
  stats: { label: string; value: string }[];
  monthlyPrice: number;
  setupFee: number;
}) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="flex gap-4 flex-1 min-w-0">
          <CardImage src={image} alt={`${provider} logo`} contain />
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-sm text-gray-500">{provider}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                {badges.map((badge) => (
                  <Badge key={badge} variant="outline" className="border-gray-300">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <Stat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:min-w-[150px] border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-4">
          <div className="md:text-right">
            <p className="text-2xl font-extrabold text-gray-900">
              {formatPrice(monthlyPrice)}
              <span className="text-sm font-normal text-gray-500"> / month</span>
            </p>
            <p className="text-xs text-gray-500">
              {setupFee > 0 ? `+ ${formatPrice(setupFee)} one-off` : "No setup fee"}
            </p>
          </div>
          <Button onClick={() => notifyDemo("Order", `${provider} ${name}`)}>
            Order
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function MobilePlanCard(plan: MobilePlanType) {
  return (
    <PlanCard
      provider={plan.provider}
      name={plan.name}
      image={plan.image}
      badges={[plan.network, plan.contractType === "prepaid" ? "Prepaid" : "Contract"]}
      stats={[
        { label: "Data", value: plan.dataGB === null ? "Unlimited" : `${formatNumber(plan.dataGB)} GB` },
        { label: "Calls & SMS", value: plan.minutes === null ? "Unlimited" : `${formatNumber(plan.minutes)} min` },
        { label: "Term", value: formatTerm(plan.termMonths) },
        { label: "Network", value: plan.network },
      ]}
      monthlyPrice={plan.monthlyPrice}
      setupFee={plan.setupFee}
    />
  );
}

export function HomePlanCard(plan: HomePlanType) {
  return (
    <PlanCard
      provider={plan.provider}
      name={plan.name}
      image={plan.image}
      badges={[plan.connectionType]}
      stats={[
        { label: "Download", value: `${formatNumber(plan.downloadMbps)} Mbps` },
        { label: "Upload", value: `${formatNumber(plan.uploadMbps)} Mbps` },
        { label: "Term", value: formatTerm(plan.termMonths) },
        { label: "Connection", value: plan.connectionType },
      ]}
      monthlyPrice={plan.monthlyPrice}
      setupFee={plan.setupFee}
    />
  );
}
