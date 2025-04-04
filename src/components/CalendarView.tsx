"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import { FireIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { isSameDay } from "date-fns";
import "react-calendar/dist/Calendar.css";

interface CalendarViewProps {
  confirmedDates: string[];
  onClose: () => void;
  isOpen: boolean;
  onToggleDate: (date: Date) => void;
}

export const CalendarView = ({
  confirmedDates,
  onClose,
  isOpen,
  onToggleDate,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  if (!isOpen) return null;

  // Using any here because react-calendar's Value type is complex and our handler properly checks the type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setCurrentDate(value);
    }
  };

  const handleDateClick = (date: Date) => {
    onToggleDate(date);
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;

    const isConfirmed = confirmedDates.some((confirmedDate) =>
      isSameDay(new Date(confirmedDate), date)
    );

    return isConfirmed ? (
      <div className="flex justify-center items-center mt-1">
        <FireIcon className="w-4 h-4 text-orange-500" />
      </div>
    ) : null;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-4 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-medium mb-4 text-center">
          Your Sobriety Journey
        </h2>

        <Calendar
          onChange={handleDateChange}
          value={currentDate}
          tileContent={tileContent}
          className="!border-none !w-full"
          navigationLabel={({ label }) => (
            <span aria-label="calendar navigation">{label}</span>
          )}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";
            const isConfirmed = confirmedDates.some((confirmedDate) =>
              isSameDay(new Date(confirmedDate), date)
            );
            return isConfirmed ? "bg-orange-50" : "";
          }}
          maxDate={new Date()}
          onClickDay={handleDateClick}
        />
      </div>
    </div>
  );
};
