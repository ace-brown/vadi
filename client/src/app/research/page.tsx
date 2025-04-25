"use client";

import React from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import SubSectionTitle from "@/components/common/subsection-title";
import SubSection from "@/components/common/subsection";
import FileDownload from "@/components/common/FileDownload";

export default function ResearchPage() {
  return (
    <>
      {/* <ReadContainer>
        <PageTitle>ثبت ایده‌های </PageTitle>
        <P>
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. لورم ایپسوم
          متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ. این متن فقط برای پر
          کردن فضا قرار داده شده است و ارزش معنایی ندارد
        </P>
      </ReadContainer> */}
      <SubSection>
        <SubSectionTitle textAlign="center">
          تمام فرم‌های مورد نیاز
        </SubSectionTitle>
        <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] pl-16 pr-16">
          {/* <Card>
            <CardHeader>
              <CardTitle>مسابقات علمی</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Link
                href="/research/competitions"
                className="text-blue-500 font-medium hover:underline"
              >
                بیشتر بخوانید
              </Link>
            </CardFooter>
          </Card> */}
          <Card>
            <CardHeader>
              <CardTitle>فرم آشنایی با مالیات</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <FileDownload
                fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/download/tax_introduction.pdf`}
                fileName="آشنایی با مالیات در ایران"
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>فرم راهنمای ثبت اختراع</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <FileDownload
                fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/download/invention_register.pdf`}
                fileName="راهنمای ثبت اختراع"
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>فرم درخواست پذیرش واحد های فناور</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <FileDownload
                fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/download/Incubator_start_form.pdf`}
                fileName="درخواست پذیرش واحد های فناور"
              />
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>فرم شیوه نامه ی اجرایی جشنواره جوان خوارزمی</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <FileDownload
                fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/download/kharazmi_approach.pdf`}
                fileName=" شیوه نامه ی اجرایی جشنواره جوان خوارزمی"
              />
            </CardFooter>
          </Card>
        </div>
      </SubSection>
    </>
  );
}
