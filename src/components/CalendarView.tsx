'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { FireIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  confirmedDates: string[];
  onClose: () => void;
  isOpen: boolean;
}

export const CalendarView = ({ confirmedDates, onClose, isOpen }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const isConfirmed = confirmedDates.some(confirmedDate => 
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
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-medium mb-4 text-center">Your Sobriety Journey</h2>
        
        <Calendar
          onChange={setCurrentDate as any}
          value={currentDate}
          tileContent={tileContent}
          className="border-0 w-full"
          tileClassName={({ date }) => {
            const isConfirmed = confirmedDates.some(confirmedDate => 
              isSameDay(new Date(confirmedDate), date)
            );
            return isConfirmed ? 'bg-orange-50' : '';
          }}
        />
      </div>
    </div>
  );
}; 