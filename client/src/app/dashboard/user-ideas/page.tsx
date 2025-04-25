"use client";

import React, { useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";

import { useHttpClient } from "@/hooks/http-hook";
import { RegisterIdeaType, UserIdeaType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import RegisterIdeaForm from "@/components/ideas/RegisterIdeaForm";
import { AuthContext } from "@/context/auth-context";
import ProtectedRoute from "../ProtectedRoute";
import { Card, CardContent } from "@/components/ui/card";

export default function UserIdeas() {
  const [ideaData, setIdeaData] = useState<UserIdeaType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [ideaToEdit, setIdeaToEdit] = useState<UserIdeaType | null>(null);
  const [ideaToDelete, setIdeaToDelete] = useState<number | null>(null);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const userId = auth.userId;

  // Update idea handler
  async function handleUpdateIdea(updatedIdea: RegisterIdeaType) {
    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/${ideaToEdit?.id}`,
        "PATCH",
        JSON.stringify(updatedIdea),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "ایده با موفقیت ویرایش شد"
      );

      setIdeaData((prev) =>
        prev.map((idea) =>
          idea.id === ideaToEdit?.id ? { ...idea, ...updatedIdea } : idea
        )
      );
      fetchIdeas();
      setIsEditDialogOpen(false);
      setIdeaToEdit(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  // Delete Idea Handler
  async function handleDeleteIdea() {
    if (ideaToDelete !== null) {
      const idea = ideaData[ideaToDelete];

      try {
        await sendRequest(
          `${process.env.NEXT_PUBLIC_API_URL}/ideas/${idea.id}`,
          "DELETE",
          null,
          { Authorization: "Bearer " + auth.token },
          "ایده با موفقیت حذف شد"
        );

        // Update the state to remove the deleted idea
        setIdeaData((prev) =>
          prev.filter((_, index) => index !== ideaToDelete)
        );

        // Reset dialog state
        setIdeaToDelete(null);
        setIsDeleteDialogOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {}
    }
  }

  async function fetchIdeas() {
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas/user/${userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setIdeaData(responseData.ideasForUser);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchIdeas();
    // eslint-disable-next-line
  }, [sendRequest, userId]);

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      {" "}
      <Toaster position="top-center" richColors />
      {isLoading && (
        <div className="center">
          <div>
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
          </div>
        </div>
      )}
      {!isLoading && ideaData?.length == 0 && (
        <p className="text-red-400">
          در حال حاضر هیچ ایده‌ای وجود ندارد. لطفاً اگر هنوز ایده‌ای ثبت
          نکرده‌اید، از بخش ثبت ایده جدید یک ایده جدید ایجاد کنید.
        </p>
      )}
      {/*********************************************************************
       *Refactor 1: Idea card is used here and on the dashboard/user/[id]/deail
       **********************************************************************/}
      {/* Check if there are ideas */}
      {!isLoading && ideaData?.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          {ideaData.map((idea, index) => (
            <Card key={index} className="p-6 shadow-md">
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* First Row */}
                <div>
                  <h2 className="font-bold text-lg">عنوان ایده</h2>
                  <p>{idea.ideaTitle}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">تاریخ ایجاد</h2>
                  <p>{formatDate(idea.createdAt)}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">نام و نام خانوادگی</h2>
                  <p>{auth.fullName}</p>
                </div>
                {/* Second Row */}
                <div>
                  <h2 className="font-bold text-lg">نام پدر</h2>
                  <p>{idea.fatherName}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">شرکا</h2>
                  <p>{idea.associate}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">کشور</h2>
                  <p>{idea.country}</p>
                </div>
                {/* Third Row */}
                <div>
                  <h2 className="font-bold text-lg">استان</h2>
                  <p>{idea.state}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">شهر</h2>
                  <p>{idea.city}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">شغل</h2>
                  <p>{idea.career}</p>
                </div>
                {/* ّFourth Row */}
                <div>
                  <h2 className="font-bold text-lg">وضعیت تاهل</h2>
                  <p>{idea.maritalStatus}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">جنسیت</h2>
                  <p>{idea.gender}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">سن</h2>
                  <p>{idea.age}</p>
                </div>
                {/* Fifth Row */}
                <div>
                  <h2 className="font-bold text-lg">شماره تماس</h2>
                  <p>{idea.mobileNumber}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">رشته تحصیلی</h2>
                  <p>{idea.branchOfStudy}</p>
                </div>
                <div>
                  <h2 className="font-bold text-lg">زمینه تخصصی</h2>
                  <p>{idea.branchDetail}</p>
                </div>
                {/* Description Row */}
                <div className="md:col-span-3">
                  <h2 className="font-bold text-lg">توضیحات</h2>
                  <p>{idea.ideaDescription}</p>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 justify-end md:col-span-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIdeaToEdit(idea);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    ویرایش
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIdeaToDelete(index);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    حذف
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              آیا مطمئن هستید که می‌خواهید حذف کنید؟
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            اگر این ایده را حذف کنید، گزارش‌های مربوط به آن نیز حذف خواهند شد.
          </DialogDescription>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              لغو
            </Button>
            <Button variant="destructive" onClick={handleDeleteIdea}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Edit Idea Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[80%] max-w-[90%] mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto rtl-scroll">
          <DialogHeader>
            <DialogTitle>ویرایش ایده</DialogTitle>
          </DialogHeader>
          {ideaToEdit && (
            <RegisterIdeaForm
              onSubmit={(data) => handleUpdateIdea(data)}
              defaultValues={{
                fatherName: ideaToEdit.fatherName,
                associate: ideaToEdit.associate,
                country: ideaToEdit.country,
                state: ideaToEdit.state,
                city: ideaToEdit.city,
                career: ideaToEdit.career,
                maritalStatus: ideaToEdit.maritalStatus,
                gender: ideaToEdit.gender,
                mobileNumber: ideaToEdit.mobileNumber,
                age: ideaToEdit.age,
                branchOfStudy: ideaToEdit.branchOfStudy,
                branchDetail: ideaToEdit.branchDetail,
                ideaTitle: ideaToEdit.ideaTitle,
                ideaDescription: ideaToEdit.ideaDescription,
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
