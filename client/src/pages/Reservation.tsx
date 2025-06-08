import { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
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
  const [reserved, setReserved] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get("title");
  const address = queryParams.get("address");

  const formatPersianDate = (date: any) => {
    if (!date) return "";
    const d = new DateObject({ date, calendar: persian, locale: persian_fa });
    return d.format("DD MMMM YYYY");
  };

  function getFormattedReservationText(date?: Date, time?: string) {
    if (!date) return "تاریخی انتخاب نشده";
    const formattedDate = formatPersianDate(date);
    const formattedTime = time ? ` - ساعت ${englishToPersianDigits(time)}` : "";
    return `انتخاب‌شده: ${formattedDate}${formattedTime}`;
  }

  function handleReserve() {
    setReserved(true);
    toast.success("نوبت با موفقیت رزرو شد");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 mt-8 w-[95%] mx-auto">
      <Card className="p-4 shadow-2xl border-0">
        <div className="mb-4">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            locale={persian_fa}
            calendar={persian}
            format="YYYY/MM/DD"
            minDate={new Date()}
          />
        </div>
        {selectedDate && (
          <>
            <h2>انتخاب زمان</h2>
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

            {/* <p className="mt-4 text-right font-semibold">
              انتخاب‌شده: {formatPersianDate(selectedDate)}{" "}
              {selectedTime
                ? ` - ساعت ${englishToPersianDigits(selectedTime)}`
                : ""}
            </p> */}
            <p className="mt-4 text-right font-semibold">
              {getFormattedReservationText(selectedDate, selectedTime)}
            </p>
          </>
        )}
        <Button disabled={!selectedTime} onClick={handleReserve}>
          رزرو
        </Button>
      </Card>
      <Card className="p-4 shadow-2xl border-0">
        <h1>{title}</h1>
        <p>{address}</p>
        {reserved && (
          <h2 className="text-xl font-bold text-right mb-4 text-green-500">
            نوبت شما برای {formatPersianDate(selectedDate)}{" "}
            {selectedTime ? `ساعت ${englishToPersianDigits(selectedTime)}` : ""}{" "}
            رزرو شد
          </h2>
        )}
      </Card>
    </div>
  );
}
