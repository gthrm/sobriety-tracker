"use client";

import { useState, useEffect } from "react";
import { startOfDay, differenceInDays, isToday } from "date-fns";

interface SobrietyData {
  startDate: string;
  lastConfirmation: string;
  streak: number;
  history: string[];
}

const STORAGE_KEY = "sobriety-data";

export const useSobrietyData = () => {
  const [data, setData] = useState<SobrietyData>({
    startDate: new Date().toISOString(),
    lastConfirmation: new Date(0).toISOString(), // Set to epoch to ensure first confirmation works
    streak: 0,
    history: [],
  });

  // Check and update streak on load and daily
  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkAndUpdateStreak = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const storedData = JSON.parse(stored);
        const today = startOfDay(new Date());
        const lastConfirmation = startOfDay(
          new Date(storedData.lastConfirmation)
        );

        // If more than one day has passed since last confirmation, reset streak
        if (differenceInDays(today, lastConfirmation) > 1) {
          const newData = {
            ...storedData,
            streak: 0,
            lastConfirmation: new Date(0).toISOString(), // Reset to allow new confirmation
          };
          saveData(newData);
        } else {
          setData(storedData);
        }
      }
    };

    // Check on load
    checkAndUpdateStreak();

    // Check at midnight
    const now = new Date();
    const tomorrow = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const midnightTimeout = setTimeout(checkAndUpdateStreak, timeUntilMidnight);
    return () => clearTimeout(midnightTimeout);
  }, []);

  const saveData = (newData: SobrietyData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    }
  };

  const isConfirmedToday = () => {
    const lastConfirmation = startOfDay(new Date(data.lastConfirmation));
    return isToday(lastConfirmation);
  };

  const confirmDay = () => {
    if (isConfirmedToday()) return; // Already confirmed today

    const today = startOfDay(new Date());
    const lastConfirmation = startOfDay(new Date(data.lastConfirmation));

    // If this is the first confirmation or if the last confirmation was yesterday
    const isFirstOrConsecutive =
      lastConfirmation.getTime() === new Date(0).getTime() || // First time
      differenceInDays(today, lastConfirmation) === 1; // Yesterday

    const newData = {
      ...data,
      lastConfirmation: today.toISOString(),
      streak: isFirstOrConsecutive ? data.streak + 1 : 1,
      history: [...data.history, today.toISOString()],
    };

    saveData(newData);
  };

  const resetStreak = () => {
    const newData = {
      startDate: new Date().toISOString(),
      lastConfirmation: new Date(0).toISOString(),
      streak: 0,
      history: [],
    };
    saveData(newData);
  };

  const exportData = () => {
    return JSON.stringify({
      version: 1,
      data: data,
    });
  };

  const importData = (jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString);
      if (imported.version === 1 && imported.data) {
        saveData(imported.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    data,
    confirmDay,
    resetStreak,
    exportData,
    importData,
    isConfirmedToday: isConfirmedToday(),
  };
};
