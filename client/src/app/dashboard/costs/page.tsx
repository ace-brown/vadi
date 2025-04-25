"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/context/auth-context";
import { CostType } from "@/types";
import { useHttpClient } from "@/hooks/http-hook";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "../ProtectedRoute";

export default function CostsPage() {
  const [estimatedCosts, setEstimatedCosts] = useState<CostType[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  // const [reportId, setReportId] = useState<string | undefined>();
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const handleCheckboxChange = (service: {
    serviceName: string;
    price: number;
  }) => {
    setSelectedServices((prev) => {
      const updatedSelected = prev.includes(service.serviceName)
        ? prev.filter((name) => name !== service.serviceName)
        : [...prev, service.serviceName];

      // Calculate total price based on selected services
      const selected = estimatedCosts
        .flatMap((item) => item.selectedServices || [])
        .filter((s) => updatedSelected.includes(s.serviceName));

      setTotalPrice(selected.reduce((sum, s) => sum + s.price, 0));

      return updatedSelected;
    });
  };

  // Get the costs when component mounted
  const fetchCosts = useCallback(async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/costs/user/${auth.userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setEstimatedCosts(responseData.costsForUser);
      // if (responseData.costsForUser.length > 0) {
      //   setReportId(responseData.costsForUser[0].reportId);
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
    // eslint-disable-next-line
  }, [auth.userId, auth.token]);

  useEffect(() => {
    fetchCosts();
  }, [fetchCosts]);

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <div className="p-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">
            ما ایده شما را بررسی کرده و این خدمات را برای کمک به دستیابی به
            اهداف شما تنظیم کرده‌ایم.
          </p>
        </div>

        {/*********************************************************************
         *Refactor 2: This card is used here and on the [id]/estimate cost page
         **********************************************************************/}
        {/* Costs Table */}
        <Card>
          <CardHeader>
            <CardTitle>خدمات پیشنهادی</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">انتخاب</TableHead>
                  <TableHead className="text-right">خدمت</TableHead>
                  <TableHead className="text-right">قیمت (تومان)</TableHead>
                  <TableHead className="text-right">کارشناس مربوطه</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <div className="center">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </div>
                ) : (
                  estimatedCosts.length > 0 &&
                  estimatedCosts.map((item, index) =>
                    item.selectedServices && item.selectedServices.length > 0
                      ? item.selectedServices.map((service, serviceIndex) => (
                          <TableRow key={`${index}-${serviceIndex}`}>
                            <TableCell>
                              <input
                                type="checkbox"
                                className={`${
                                  service.paid ? "" : "cursor-pointer"
                                } transform scale-125`}
                                disabled={service.paid}
                                onChange={() => handleCheckboxChange(service)}
                                checked={selectedServices.includes(
                                  service.serviceName
                                )}
                              />
                            </TableCell>
                            <TableCell>{service.serviceName}</TableCell>
                            <TableCell>
                              {service.price.toLocaleString("fa-IR")}
                            </TableCell>
                            <TableCell>{service.expert || "N/A"}</TableCell>
                            <TableCell
                              className={`font-medium ${
                                service.paid
                                  ? "text-green-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {service.paid ? "پرداخت شده" : "پرداخت نشده"}
                            </TableCell>
                          </TableRow>
                        ))
                      : null
                  )
                )}
              </TableBody>
            </Table>
            <div className="mt-4 text-right text-lg font-bold">
              جمع کل: {totalPrice.toLocaleString("fa-IR")} تومان
            </div>
          </CardContent>
        </Card>

        {/* New Feature Section */}
        <div className="text-center mt-8">
          {/* <p className="text-lg text-gray-600 mb-4">
            لطفاً مبلغ کل را به حساب بانکی زیر واریز کرده و سپس رسید پرداخت خود
            را از طریق کانال ارتباطی زیر ارسال کنید.
          </p> */}

          {/* Grid for Bank Info and Upload Component */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col flex-1 h-full">
              <label className="text-right font-semibold mb-2">
                اطلاعات بانکی:
              </label>
              <div className="border p-4 text-right">
                {/* <p>بانک: ملی ایران</p>
                <p>شماره حساب: 123-456-7890</p>
                <p>کد شبا: IR123456789012345678901234</p> */}
              </div>
            </div>

            {/* <div className="flex flex-col flex-1 h-full">
            <label className="text-right font-semibold mb-2">
              بارگذاری رسید پرداخت
            </label>
            <div className="border p-4">
              <p className="mb-2 text-center">
                لطفاً رسید پرداخت خود را بارگذاری کنید
              </p>
              <FileUpload />
            </div>
          </div> */}
            <div className="flex flex-col flex-1 h-full">
              <label className="text-right font-semibold mb-2">
                لطفاً رسید پرداخت خود را به شناسه تلگرام زیر ارسال کنید.
              </label>
              <div className="border p-4">
                <p className="mb-2 text-center">
                  <a
                    href="https://t.me/kad9312"
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    https://t.me/kad9312
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600 mb-4">
            پس از دریافت رسید پرداخت شما، شناسه گزارش برایتان ارسال خواهد شد.
          </p>
          {/* <p>
          شناسه گزارش:{" "}
          {estimatedCosts[0]?.selectedServices[0]?.paid && reportId}
        </p> */}
          <Link href="/dashboard/reports">
            <Button className="px-8 py-4 text-lg">برو به گزارش ها</Button>
          </Link>
        </div>

        {/* Additional Information */}
        <div className="space-y-8">
          {/* How It Works */}
          <div>
            <h2 className="text-2xl font-bold">
              چگونه برنامه شما را محاسبه می‌کنیم
            </h2>
            <p className="text-gray-600 mt-2">
              تیم ما ایده شما، اهداف تجاری و نیازهای شما را به دقت بررسی می‌کند.
              بر اساس این ارزیابی، ما یک برنامه شخصی‌سازی‌شده با خدمات ضروری
              برای موفقیت ایده شما ایجاد می‌کنیم.
            </p>
          </div>

          {/* Contact/Support */}
          <div>
            <h2 className="text-2xl font-bold">نیاز به کمک دارید؟</h2>
            <p className="text-gray-600 mt-2">
              سوالی درباره برنامه خود دارید یا به اطلاعات بیشتری نیاز دارید؟
              لطفاً{" "}
              <Link href="/contact" className="text-blue-500 underline">
                با ما تماس بگیرید
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
