"use client";

import { useContext, useState } from "react";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

import RegisterIdeaForm from "@/components/ideas/RegisterIdeaForm";
import { RegisterIdeaType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHttpClient } from "@/hooks/http-hook";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AuthContext } from "@/context/auth-context";
import ProtectedRoute from "../ProtectedRoute";

export default function IdeasPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isLoading, error, sendRequest } = useHttpClient();
  const router = useRouter();
  const auth = useContext(AuthContext);

  // Handle form submission
  async function handleIdeaSubmission(formData: RegisterIdeaType) {
    const ownerId = auth.userId;
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/ideas`,
        "POST",
        JSON.stringify({ ...formData, ownerId }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "ایده با موفقیت ایجاد شد"
      );

      setIsDialogOpen(false);
      auth.getReportId(responseData.idea.reportId);
      router.push("/dashboard/user-ideas");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <div className="p-6">
        <Toaster position="top-center" richColors />
        {isLoading && (
          <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        )}

        {error && <p className="text-center text-red-500 mb-8">{error}</p>}

        {/* Register Idea Button */}
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="w-full bg-blue-500 text-white mt-4"
        >
          ثبت ایده جدید
        </Button>

        {/* Modal for registering new Idea */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="w-[80%] max-w-[90%] mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto rtl-scroll">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-left">
                ثبت ایده جدید
              </DialogTitle>
            </DialogHeader>
            <RegisterIdeaForm onSubmit={handleIdeaSubmission} />
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
