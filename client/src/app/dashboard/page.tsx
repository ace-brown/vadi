"use client";

import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

import { useHttpClient } from "@/hooks/http-hook";
import { UserType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthContext } from "@/context/auth-context";
import EditUserProfile from "@/components/users/EditUserProfile";
import ProtectedRoute from "./ProtectedRoute";

export default function AccountPage() {
  const [profileData, setProfileData] = useState<UserType>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { isLoading, sendRequest } = useHttpClient();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const auth = useContext(AuthContext);
  const userId = auth.userId;

  // Delete user account
  async function handleDeleteAccount() {
    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token },
        "حساب کاربری شما با موفقیت حذف شد"
      );

      auth.logout();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("حذف حساب کاربری با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  // Fetch user profile
  async function fetchUserProfile() {
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        "GET",
        null,
        { Authorization: "Bearer " + auth.token }
      );

      setProfileData(responseData.user);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line
  }, [userId]);

  // Return the main content
  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
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

      {/* Check if there is profile */}
      {!isLoading && profileData && (
        <div className="mb-6">
          <div className="p-4 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Row */}
              <div>
                <h2 className="font-bold text-lg">نام و نام خانوادگی</h2>
                <p>{profileData?.profile.fullName}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">نام کاربری</h2>
                <p>{profileData?.username}</p>
              </div>

              {/* Second Row */}
              <div>
                <h2 className="font-bold text-lg">رايانامه</h2>
                <p>{profileData?.email}</p>
              </div>
              <div>
                <h2 className="font-bold text-lg">رمز عبور</h2>
                <div className="relative flex items-center">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    value={profileData?.password}
                    readOnly
                    className="px-2 py-1 w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Third Row */}
              <div className="md:col-span-2">
                <h2 className="font-bold text-lg">درباره من</h2>
                <p>{profileData?.profile.bio}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-start mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(true);
                }}
              >
                ویرایش رخ‌ نما
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                }}
              >
                حذف حساب کاربری
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              آیا می‌خواهید حساب کاربری خود را حذف کنید؟
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            اگر دکمه حذف را فشار دهید، حساب کاربری شما همراه با تمامی ایده‌های
            ایجادشده و گزارش‌های مرتبط حذف خواهد شد.
          </DialogDescription>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              لغو
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              حذف حساب کاربری
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[50%] max-w-[60%] mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto rtl-scroll">
          <DialogHeader>
            <DialogTitle className="text-center">ویرایش رخ‌ نما</DialogTitle>
          </DialogHeader>
          <EditUserProfile
            profileData={profileData}
            setProfileData={setProfileData}
            closeDialog={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
