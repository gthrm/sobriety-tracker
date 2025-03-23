'use client';

import { StreakCounter } from './StreakCounter';
import { DataManager } from './DataManager';
import { useSobrietyData } from '@/hooks/useSobrietyData';

export function MainContent() {
  const { data, confirmDay, exportData, importData, isConfirmedToday } = useSobrietyData();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <div className="flex-1">
          <StreakCounter 
            streak={data.streak} 
            onConfirm={confirmDay}
            isConfirmedToday={isConfirmedToday}
            confirmedDates={data.history}
          />
        </div>
        <div className="py-6 px-4">
          <DataManager
            onExport={exportData}
            onImport={importData}
          />
        </div>
      </div>
    </main>
  );
} 