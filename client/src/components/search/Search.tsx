import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { SearchType } from "@/types";

export const tariffs: SearchType[] = [
  { id: 1, name: "ایرانسل" },
  { id: 2, name: "همراه اول" },
  { id: 3, name: "رایتل" },
  { id: 4, name: "اسیاتک" },
];

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSubmit() {
    const results = tariffs.filter((tariff) =>
      tariff.name.toLowerCase().includes(query.toLowerCase())
    );

    const searchParams = new URLSearchParams();
    searchParams.set("results", JSON.stringify(results));
    navigate(`/compare?${searchParams.toString()}`);
  }

  return (
    <div
      dir="rtl"
      className="flex flex-col items-center justify-start p-6 space-y-6 mt-4"
    >
      <div className="w-[80%] flex items-center gap-2">
        <Input
          placeholder="جستجو..."
          className="flex-1 text-right text-lg font-semibold border-2 border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-white rounded-xl px-5 py-4 shadow-lg transition-all duration-300"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-4 text-white text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg"
        >
          <SearchIcon className="ml-2" size={20} />
          جستجو
        </Button>
      </div>

      <p className="w-[70%] text-right leading-7 text-gray-800">
        این یک متن نمونه به زبان فارسی است که برای تست رابط کاربری استفاده
        می‌شود. این متن می‌تواند به صورت دلخواه تغییر کند و فقط برای نمایش
        ساختار کلی استفاده شده است.
      </p>
      <p>ایرانسل</p>
    </div>
  );
}
