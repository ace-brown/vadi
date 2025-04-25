"use client";

import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHttpClient } from "@/hooks/http-hook";
import { AuthContext } from "@/context/auth-context";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { ServiceType } from "@/types";

const predefinedServices = [
  { serviceName: "جلسه ایده پردازی" },
  { serviceName: "تحقیق بازار" },
  { serviceName: "تحلیل رقبا" },
  { serviceName: "مطالعه امکان‌سنجی" },
  { serviceName: "طراحی اولیه" },
  { serviceName: "ساخت نمونه اولیه" },
  { serviceName: "آزمایش نمونه اولیه" },
  { serviceName: "آزمایش واحد" },
  { serviceName: "آزمایش یکپارچه‌سازی" },
  { serviceName: "بازخورد کاربران" },
  { serviceName: "راه اندازی وبسایت و هاست" },
  { serviceName: "پیکربندی تولید" },
  { serviceName: "عرضه محصول" },
];

type EstimateCostFormEditProps = {
  selectedService: ServiceType;
  costId: string | undefined;
  fetchCosts: () => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
};

export default function EstimateCostFormEdit({
  selectedService,
  costId,
  fetchCosts,
  setIsEditDialogOpen,
}: EstimateCostFormEditProps) {
  const [price, setPrice] = useState("");
  const [expert, setExpert] = useState("");
  const [paid, setPaid] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const { error, isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  // Initialize state with selectedService values
  useEffect(() => {
    setPrice(String(selectedService.price));
    setExpert(selectedService.expert || "");
    setPaid(selectedService.paid || false);
    setServiceName(selectedService.serviceName || "");
  }, [selectedService]);

  // Submit the estimate cost form
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceName) {
      alert("لطفاً یک نام خدمات را انتخاب کنید");
      return;
    }

    if (isNaN(Number(price))) {
      alert("لطفاً یک قیمت معتبر وارد کنید");
      return;
    }

    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/costs/${costId}`,
        "PATCH",
        JSON.stringify({
          selectedServices: [
            {
              serviceName,
              price: Number(price),
              paid,
              expert,
            },
          ],
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "تخمین هزینه با موفقیت ویرایش شد"
      );
      fetchCosts();
      setIsEditDialogOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  return (
    <>
      <Toaster position="top-center" richColors />

      <form onSubmit={handleSubmit} className="space-y-4">
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-2">
            قیمت
          </label>
          <Input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="قیمت را وارد کنید"
            required
          />
        </div>

        <div>
          <label htmlFor="expert" className="block text-sm font-medium mb-2">
            متخصص
          </label>
          <Input
            id="expert"
            value={expert}
            onChange={(e) => setExpert(e.target.value)}
            placeholder="نام متخصص را وارد کنید"
            required
          />
        </div>

        <div>
          <label
            htmlFor="serviceName"
            className="block text-sm font-medium mb-2"
          >
            نام خدمات
          </label>
          <Select
            onValueChange={(value) => setServiceName(value)}
            value={serviceName}
            required
          >
            <SelectTrigger style={{ direction: "rtl" }}>
              <SelectValue placeholder="انتخاب نام خدمات" />
            </SelectTrigger>
            <SelectContent style={{ direction: "rtl" }}>
              {predefinedServices.map((service, index) => (
                <SelectItem key={index} value={service.serviceName}>
                  {service.serviceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="paid"
            type="checkbox"
            checked={paid}
            onChange={(e) => setPaid(e.target.checked)}
          />
          <label htmlFor="paid" className="text-sm font-medium">
            پرداخت شده است.
          </label>
        </div>

        <Button type="submit" className="mt-4">
          ارسال
        </Button>
        {error && <p className="text-center text-red-500 mb-8">{error}</p>}
      </form>
    </>
  );
}
