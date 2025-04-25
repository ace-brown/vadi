import React from "react";

import { Input } from "./ui/input";

const Hero = () => {
  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-start p-6 space-y-6"
    >
      <Input placeholder="جستجو..." className="w-[70%] text-right" />
      <p className="w-[70%] text-right leading-7 text-gray-800">
        این یک متن نمونه به زبان فارسی است که برای تست رابط کاربری استفاده
        می‌شود. این متن می‌تواند به صورت دلخواه تغییر کند و فقط برای نمایش
        ساختار کلی استفاده شده است.
      </p>
    </div>
  );
};

export default Hero;
