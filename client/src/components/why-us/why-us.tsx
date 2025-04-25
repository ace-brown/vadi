import React from "react";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import SectionTitle from "../common/section-title";
import Section from "../common/section";

export default function WhyUs() {
  const cardData = [
    {
      id: 1,
      title: "اعتبارسنجی هدایت‌ شده",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
    {
      id: 2,
      title: "عنوان اولین پست وبلاگ",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
    {
      id: 3,
      title: "عنوان دومین پست وبلاگ",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
    {
      id: 4,
      title: "عنوان سومین پست وبلاگ",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
    {
      id: 5,
      title: "عنوان چهارمین پست وبلاگ",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
    {
      id: 6,
      title: "عنوان چهارمین پست وبلاگ",
      bulletPoints: [
        "ابزارهای تخصصی برای تحقیق درباره بازار و مشتریان",
        "جمع‌آوری بازخوردهای واقعی از کاربران برای آزمایش ایده‌های شما",
        "ارائه تحلیل‌ها و گزارش‌هایی که به شما کمک می‌کند تصمیمات بهتری بگیرید",
      ],
      link: "#",
    },
  ];

  return (
    <Section>
      <SectionTitle>چرا خیام سانا؟</SectionTitle>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {cardData.map((item) => {
          return (
            <Card
              key={item.id}
              className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  {item.bulletPoints.map((bulletPoint, index) => (
                    <li key={index}>{bulletPoint}</li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="mt-4 justify-center">
                <Link
                  href={item.link}
                  className="text-blue-500 font-medium hover:underline"
                >
                  بیشتر بخوانید
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
