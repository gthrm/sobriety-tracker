"use client";

import { useState } from "react";
import { FireIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { isSameDay, startOfWeek, addDays, isBefore } from "date-fns";
import { CalendarView } from "./CalendarView";

interface StreakCounterProps {
  streak: number;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirmedToday: boolean;
  confirmedDates: string[];
  onToggleDate: (date: Date) => void;
}

export const StreakCounter = ({
  streak,
  onConfirm,
  onCancel,
  isConfirmedToday,
  confirmedDates,
  onToggleDate,
}: StreakCounterProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });

  const shouldHighlightDay = (dayIndex: number) => {
    const dayDate = addDays(weekStart, dayIndex);

    if (isSameDay(dayDate, today)) {
      return isConfirmedToday;
    }

    if (isBefore(dayDate, today)) {
      return confirmedDates.some(date => isSameDay(new Date(date), dayDate));
    }

    return false;
  };

  const getStreakText = (days: number) => {
    if (days === 0) return "Start your journey today";
    if (days === 1) return "1 day sober";
    return `${days} days sober`;
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Top progress card */}
        <div className="mx-4 mt-4 p-3 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FireIcon className="w-5 h-5 text-orange-500" />
              <div className="flex flex-col">
                <span className="text-sm">{getStreakText(streak)}</span>
                <span className="text-xs text-gray-400">Keep going!</span>
              </div>
            </div>
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100 
                rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 
                focus:ring-[#4CB5F9] focus:ring-opacity-50"
              aria-label="Open calendar"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center px-6">
          {/* Large flame icon */}
          <div className="mb-6">
            <FireIcon className="w-48 h-48 text-orange-500" />
          </div>

          <h2 className="text-xl font-medium mb-2">{getStreakText(streak)}</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            {streak === 0
              ? "Every journey begins with a single step. You can do this!"
              : "Stay strong - every day sober is a victory!"}
          </p>

          {/* Week streak */}
          <div className="flex gap-3 mb-12">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    shouldHighlightDay(index) ? "bg-orange-500" : "bg-gray-100"
                  }`}
                >
                  <FireIcon
                    className={`w-4 h-4 ${
                      shouldHighlightDay(index) ? "text-white" : "text-gray-400"
                    }`}
                  />
                </div>
                <span className="text-xs text-gray-400">{day}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="w-full flex flex-col gap-3">
            {isConfirmedToday ? (
              <button
                onClick={onCancel}
                className="w-full bg-red-500 text-white py-3.5 rounded-2xl text-sm font-medium
                  hover:bg-red-600 transition-colors"
              >
                CANCEL CONFIRMATION
              </button>
            ) : (
              <button
                onClick={onConfirm}
                className="w-full bg-[#4CB5F9] text-white py-3.5 rounded-2xl text-sm font-medium
                  hover:bg-[#4CB5F9]/90 transition-colors"
              >
                I AM SOBER TODAY
              </button>
            )}
          </div>
        </div>
      </div>

      <CalendarView
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        confirmedDates={confirmedDates}
        onToggleDate={onToggleDate}
      />
    </>
  );
};
