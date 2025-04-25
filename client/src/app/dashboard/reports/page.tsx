"use client";

import React, { useContext, useState } from "react";
import { Toaster } from "sonner";

import { Input } from "@/components/ui/input";
import P from "@/components/common/ptag";
import ProgressBar from "@/components/reports/ProgressBar";
import { Button } from "@/components/ui/button";
import { useHttpClient } from "@/hooks/http-hook";
import { Report } from "@/types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { AuthContext } from "@/context/auth-context";
import ProtectedRoute from "../ProtectedRoute";

export default function ReportPage() {
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [reportId, setReportId] = useState("");
  const { isLoading, error, sendRequest } = useHttpClient();
  const [report, setReport] = useState<Report | undefined>();
  const auth = useContext(AuthContext);

  function handleReportIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReportId(e.target.value);
  }

  async function handleProgressBarClick() {
    try {
      const responseData = await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${reportId}`,
        "GET",
        null,
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "گزارش با موفقیت پیدا شد"
      );
      setReport(responseData.report);
      setShowProgressBar(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "user"]}>
      <Toaster position="top-center" richColors />
      {isLoading && <LoadingSpinner asOverlay />}
      <div>
        <P>
          در این بخش می‌توانید روند پیشرفت ایده خود را که برای ما ارسال
          کرده‌اید، مشاهده کنید. ما تلاش می‌کنیم که در هر مرحله، شما را در جریان
          وضعیت توسعه ایده‌تان قرار دهیم و اطمینان حاصل کنیم که همیشه از وضعیت
          پروژه خود مطلع هستید. کافیست شناسه گزارش خود را وارد کنید تا اطلاعات
          کامل مراحل انجام شده و برنامه‌های آتی نمایش داده شود. هدف ما این است
          که با شفافیت کامل و به‌روزترین اطلاعات، شما را در مسیر تحقق ایده‌تان
          همراهی کنیم
        </P>
        <div className="flex items-center gap-8 mt-8">
          <Input
            type="text"
            placeholder="شناسه گزارش خود را وارد کنید"
            onChange={handleReportIdChange}
            value={reportId}
            className="w-[300px]"
          />
          <Button onClick={handleProgressBarClick}>
            خط زمانی پیشرفت را پیدا کن
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      {showProgressBar && (
        <div>
          <div className="mt-8">
            <ProgressBar foundReport={report} />
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
