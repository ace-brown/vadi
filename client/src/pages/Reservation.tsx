import { useState } from "react";
import persian_fa from "react-date-object/locales/persian_fa";
import { Calendar } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import DateObject from "react-date-object";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { englishToPersianDigits } from "@/utils/helpers";

const timeSlots = [
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "17",
  "18",
  "19",
  "20",
  "21",
];

export default function Reservation() {
  // The date picker value is a DateObject, not a JS Date, so use `any` or proper type from react-multi-date-picker
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>();

  // Format the Persian date using the `format` method of DateObject
  const formatPersianDate = (date: any) => {
    if (!date) return "";
    const d = new DateObject({ date, calendar: persian, locale: persian_fa });
    // return `${d.year} ${d.day} ${d.month.name}`;
    // return d.format("YYYY DD MMMM");
    return d.format("DD MMMM YYYY");
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 mt-8 w-[95%] mx-auto">
      <Card className="p-4 shadow-2xl border-0">
        <Calendar
          value={selectedDate}
          onChange={setSelectedDate}
          locale={persian_fa}
          calendar={persian}
          format="YYYY/MM/DD"
          minDate={new Date()}
        />

        {selectedDate && (
          <>
            <div className="flex flex-wrap gap-2 mt-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  className={`border rounded px-4 py-1 ${
                    selectedTime === time
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {englishToPersianDigits(time)}
                </button>
              ))}
            </div>

            <p className="mt-4 text-right font-semibold">
              انتخاب‌شده: {formatPersianDate(selectedDate)}{" "}
              {selectedTime
                ? ` - ساعت ${englishToPersianDigits(selectedTime)}`
                : ""}
            </p>
          </>
        )}
        <Button disabled={!selectedTime}>رزرو</Button>
      </Card>
      <Card className="p-4 shadow-2xl border-0">
        <h1>درباره این محصول</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem
          consectetur assumenda, tempore aliquid atque et explicabo ut, eos
          sequi obcaecati nulla minima optio. Lorem ipsum dolor, sit amet
          consectetur adipisicing elit. Recusandae labore, ullam repudiandae qui
          dolores consequatur laudantium placeat obcaecati et voluptatibus
          reprehenderit voluptates saepe? Quidem cumque cupiditate illum magnam
          deleniti neque maiores aspernatur dolore.
        </p>
      </Card>
    </div>
  );
}
