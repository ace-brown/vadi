import React from "react";

import StartUpCard from "./startup-card";
import validateImg from "@/images/vallidate-idea.jpg";
import growthImg from "@/images/growth.jpg";
import launchImg from "@/images/launch.jpg";
import planingImg from "@/images/planning.jpg";
import SectionTitle from "@/components/common/section-title";
import Section from "../common/section";

export default function StartupPath() {
  const rightSide = true;
  const cardData = [
    {
      id: 1,
      title: "اعتبارسنجی ایده",
      description:
        "مفهوم خود را با کاربران واقعی و بینش‌های ارزشمند آزمایش کنید",
      imgSrc: validateImg,
      link: "#",
    },
    {
      id: 2,
      title: "برنامه‌ریزی و نمونه‌سازی اولیه",
      description: "یک نقشه راه طراحی کنید و نسخه اولیه محصول خود را بسازید",
      imgSrc: planingImg,
      link: "#",
    },
    {
      id: 3,
      title: "راه‌اندازی و اجرا",
      description:
        "با اطمینان و استفاده از ابزارهای حرفه‌ای کسب‌وکار خود را راه‌اندازی کنید",
      imgSrc: launchImg,
      link: "#",
    },
    {
      id: 4,
      title: "رشد و توسعه",
      description: "جذب کاربران را افزایش دهید و استارتاپ خود را گسترش دهید",
      imgSrc: growthImg,
      link: "#",
    },
  ];
  return (
    <Section>
      <div style={{ direction: "ltr" }}>
        <SectionTitle>مسیر استارتاپ شما، ساده شده</SectionTitle>
        {cardData.map((item) => {
          return (
            <>
              {/* This is visible on large screens (1024px and above) */}
              <div className="hidden xl:block">
                <div key={item.id} className="grid">
                  <div className="sm:mb-4 grid gap-4 grid-cols-[2fr_5px_2fr] lg:m-0 md:m-0">
                    {/* The left side of the axis */}
                    <div className="grid justify-items-end mx-0">
                      {item.id % 2 === 0 && <StartUpCard item={item} />}
                    </div>
                    {/* The axis itself */}
                    <div className="bg-gray-500 grid content-center items-center">
                      <div className="bg-red-500 transform translate-x-[-35%] h-4 w-4 rounded-full"></div>
                    </div>
                    {/* The right side of the axis */}
                    <div className="grid justify-items-start mx-0">
                      {item.id % 2 !== 0 && (
                        <StartUpCard rightSide={rightSide} item={item} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* This is visible below 1024px */}
              <div className="block xl:hidden">
                <div
                  key={item.id}
                  className="flex items-center justify-center mx-0 mb-4"
                >
                  <StartUpCard item={item} />
                </div>
              </div>
            </>
          );
        })}
      </div>
    </Section>
  );
}
