import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AutoRepairType } from "@/types";
import CardInfoItem from "@/components/common/CardInfoItem";

export default function AutoRepairCard({
  title,
  address,
  services,
  image,
  onShowModal,
}: AutoRepairType) {
  function handleOrder() {
    if (onShowModal) onShowModal(true);
  }

  return (
    <>
      <Card className="rounded shadow-lg p-4">
        <CardContent className="grid grid-cols-[80px_1fr_1fr] sm:grid-cols-[180px_1fr_1fr] gap-4 items-start text-right">
          <img
            alt={`${title} تصویر`}
            src={`${import.meta.env.VITE_API_URL}/${image}`}
            className="w-[80px] h-[80px] sm:w-[180px] sm:h-[180px] object-cover row-span-2 pl-4"
          />
          <CardInfoItem value={<h1 className="text-[1.75rem]">{title}</h1>} />
          <CardInfoItem label="آدرس" value={address} />
          <CardInfoItem
            label="خدمات"
            value={
              <ul className="text-sm list-disc pr-5 col-span-2">
                {services?.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            }
          />

          <div className="text-left mt-4">
            <Button onClick={handleOrder}>گرفتن نوبت</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
