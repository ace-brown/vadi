"use client";

import React, { useContext, useState } from "react";
import { Toaster, toast } from "sonner";

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
import { Card } from "@/components/ui/card";

const predefinedServices = [
  { serviceName: "جلسه ایده پردازی", price: 0, expert: "" },
  { serviceName: "تحقیق بازار", price: 0, expert: "" },
  { serviceName: "تحلیل رقبا", price: 0, expert: "" },
  { serviceName: "مطالعه امکان‌سنجی", price: 0, expert: "" },
  { serviceName: "طراحی اولیه", price: 0, expert: "" },
  { serviceName: "ساخت نمونه اولیه", price: 0, expert: "" },
  { serviceName: "آزمایش نمونه اولیه", price: 0, expert: "" },
  { serviceName: "آزمایش واحد", price: 0, expert: "" },
  { serviceName: "آزمایش یکپارچه‌سازی", price: 0, expert: "" },
  { serviceName: "بازخورد کاربران", price: 0, expert: "" },
  { serviceName: "راه اندازی وبسایت و هاست", price: 0, expert: "" },
  { serviceName: "پیکربندی تولید", price: 0, expert: "" },
  { serviceName: "عرضه محصول", price: 0, expert: "" },
];

export default function EstimateCostForm({
  reportId,
  userId,
  fetchCosts,
}: {
  reportId: string | null;
  userId: string | null;
  fetchCosts: () => void;
}) {
  const [price, setPrice] = useState("");
  const [expert, setExpert] = useState("");
  const [serviceName, setServiceName] = useState("");
  const { error, isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

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
        `${process.env.NEXT_PUBLIC_API_URL}/costs`,
        "POST",
        JSON.stringify({
          userId,
          reportId,
          selectedServices: [
            {
              serviceName,
              price,
              expert,
            },
          ],
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "تخمین هزینه با موفقیت ایجاد شد"
      );
      fetchCosts();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error(error);
    }
  }

  return (
    <Card className="p-8">
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
          <Select onValueChange={(value) => setServiceName(value)} required>
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

        <Button type="submit" className="mt-4">
          ارسال
        </Button>
      </form>
    </Card>
  );
}
