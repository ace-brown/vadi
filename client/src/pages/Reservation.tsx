import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6 mt-8 w-[95%] mx-auto">
      <Card className="p-4 shadow-2xl border-0">
        <DayPicker
          animate
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
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
                  {time}
                </button>
              ))}
            </div>

            <p className="mt-4">
              انتخاب‌شده: {format(selectedDate, "yyyy-MM-dd")} -{" "}
              {selectedTime || "هیچ ساعتی انتخاب نشده"}
            </p>
          </>
        )}
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
