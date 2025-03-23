'use client';

import { StreakCounter } from './StreakCounter';
import { DataManager } from './DataManager';
import { useSobrietyData } from '@/hooks/useSobrietyData';

export function MainContent() {
  const { data, confirmDay, exportData, importData, isConfirmedToday } = useSobrietyData();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto h-screen">
        <StreakCounter 
          streak={data.streak} 
          onConfirm={confirmDay}
          isConfirmedToday={isConfirmedToday}
          confirmedDates={data.history}
        />
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <DataManager
            onExport={exportData}
            onImport={importData}
          />
        </div>
      </div>
    </main>
  );
} 