"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaPen } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { useHttpClient } from "@/hooks/http-hook";
import { AuthContext } from "@/context/auth-context";
import EstimateCostForm from "@/components/costs/EstimateCostForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CostType, ServiceType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import EstimateCostFormEdit from "@/components/costs/EstimateCostFormEdit";
import ProtectedRoute from "@/app/dashboard/ProtectedRoute";

export default function EstimateCostPage() {
  const [estimatedCosts, setEstimatedCosts] = useState<CostType[]>([]);
  const { error, isLoading, sendRequest } = useHttpClient();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType>();
  const [costId, setCostId] = useState<string | undefined>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useContext(AuthContext);
  const userId = searchParams.get("userId");
  const reportId = searchParams.get("reportId");

  function handleEditCost(service: ServiceType, item: CostType) {
    handleEditService(service);
    setCostId(item.id);
  }
  // Get the costs when component mounted
  async function fetchCosts() {
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/costs/user/${userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );
      setEstimatedCosts(responseData.costsForUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchCosts();
    // eslint-disable-next-line
  }, []);

  // Open modal for editing the selected service
  const handleEditService = (service: ServiceType) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };

  // console.log("Estimated", JSON.stringify(estimatedCosts, null, 2));
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">تخمین هزینه</h1>

        {/*********************************************************************
         *Refactor 2: This card is used here and on the [id]/estimate cost page
         **********************************************************************/}
        {/* Form Component */}
        <EstimateCostForm
          reportId={reportId}
          userId={userId}
          fetchCosts={fetchCosts}
        />

        {/* Display cost estimate result */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>خدمات پیشنهادی</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              {/* Table header always displayed */}
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">خدمت</TableHead>
                  <TableHead className="text-right">قیمت (تومان)</TableHead>
                  <TableHead className="text-right">کارشناس مربوطه</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">ویرایش</TableHead>
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
                  estimatedCosts.map(
                    (item, index) =>
                      item.selectedServices &&
                      item.selectedServices.length > 0 &&
                      item.selectedServices.map((service, serviceIndex) => (
                        <TableRow key={`${index}-${serviceIndex}`}>
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

                          <TableCell>
                            <FaPen
                              className="cursor-pointer"
                              onClick={() => handleEditCost(service, item)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                  )
                )}
              </TableBody>
            </Table>
            {error && <p className="text-center text-red-500 mb-8">{error}</p>}
          </CardContent>
        </Card>

        {/* Return button */}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push(`/dashboard/users/${userId}`)}
        >
          بازگشت به صفحه کاربر
        </Button>

        {/*********************************************************************
         *Refactor 3: This dialog is used here and on the Estimate cost
         **********************************************************************/}
        {/* Modal for editing service */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>ویرایش خدمت</DialogHeader>
            {selectedService && (
              <EstimateCostFormEdit
                selectedService={selectedService}
                costId={costId}
                fetchCosts={fetchCosts}
                setIsEditDialogOpen={setIsEditDialogOpen}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
