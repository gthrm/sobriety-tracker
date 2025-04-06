"use client";

import { useState, useEffect } from "react";
import { startOfDay, isSameDay, parseISO, addDays, format } from "date-fns";

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
    lastConfirmation: new Date(0).toISOString(),
    streak: 0,
    history: [],
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const storedData = JSON.parse(stored);
      console.log('Loaded data from storage:', storedData);
      
      // Recalculate streak when loading from storage
      const recalculatedStreak = calculateStreak(storedData.history);
      const updatedData = {
        ...storedData,
        streak: recalculatedStreak
      };
      
      console.log('Recalculated streak:', recalculatedStreak);
      setData(updatedData);
    }
  }, []);

  const saveData = (newData: SobrietyData) => {
    if (typeof window !== "undefined") {
      console.log('Saving data:', newData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    }
  };

  const calculateStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;

    // Convert all dates to startOfDay and sort in descending order (newest first)
    const sortedDates = [...dates]
      .map(date => startOfDay(new Date(date)))
      .sort((a, b) => b.getTime() - a.getTime());

    console.log('Sorted dates (newest first):', sortedDates.map(d => format(d, 'yyyy-MM-dd')));

    // Remove duplicates
    const uniqueDates = sortedDates.filter((date, index, self) =>
      index === self.findIndex(d => isSameDay(d, date))
    );

    console.log('Unique dates:', uniqueDates.map(d => format(d, 'yyyy-MM-dd')));

    const today = startOfDay(new Date());
    const lastDate = uniqueDates[0];
    
    // If the last date is not today, streak is 0
    if (!isSameDay(lastDate, today)) {
      console.log('Last date is not today, streak is 0');
      return 0;
    }

    let streak = 1;
    let currentDate = today;

    // Go backwards from today until we find a gap
    while (true) {
      const prevDate = addDays(currentDate, -1);
      const isPrevDateConfirmed = uniqueDates.some(date => isSameDay(date, prevDate));
      
      if (!isPrevDateConfirmed) {
        console.log(`Found gap at ${format(prevDate, 'yyyy-MM-dd')}, streak is ${streak}`);
        return streak;
      }

      streak++;
      currentDate = prevDate;
      console.log(`Current streak: ${streak}, checking date: ${format(prevDate, 'yyyy-MM-dd')}`);
    }
  };

  const isConfirmedToday = () => {
    const today = startOfDay(new Date());
    return data.history.some(date => isSameDay(parseISO(date), today));
  };

  const toggleDate = (date: Date) => {
    const dateStr = startOfDay(date).toISOString();
    const isConfirmed = data.history.some(d => isSameDay(parseISO(d), date));

    let newHistory: string[];
    if (isConfirmed) {
      newHistory = data.history.filter(d => !isSameDay(parseISO(d), date));
    } else {
      newHistory = [...data.history, dateStr];
    }

    const newStreak = calculateStreak(newHistory);
    const newData = {
      ...data,
      history: newHistory,
      streak: newStreak,
      lastConfirmation: newStreak > 0 ? newHistory[0] : new Date(0).toISOString(),
    };

    saveData(newData);
  };

  const confirmDay = () => {
    const today = startOfDay(new Date());
    const todayStr = today.toISOString();

    if (data.history.some(date => isSameDay(parseISO(date), today))) {
      return;
    }

    const newHistory = [...data.history, todayStr];
    const newStreak = calculateStreak(newHistory);
    const newData = {
      ...data,
      history: newHistory,
      streak: newStreak,
      lastConfirmation: todayStr,
    };

    console.log('Confirming day:', {
      today: format(today, 'yyyy-MM-dd'),
      newStreak,
      newHistory: newHistory.map(d => format(new Date(d), 'yyyy-MM-dd'))
    });

    saveData(newData);
  };

  const cancelConfirmation = () => {
    const today = startOfDay(new Date());
    const newHistory = data.history.filter(date => !isSameDay(parseISO(date), today));
    const newStreak = calculateStreak(newHistory);
    const newData = {
      ...data,
      history: newHistory,
      streak: newStreak,
      lastConfirmation: newStreak > 0 ? newHistory[0] : new Date(0).toISOString(),
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
    cancelConfirmation,
    toggleDate,
    exportData,
    importData,
    isConfirmedToday: isConfirmedToday(),
  };
};
