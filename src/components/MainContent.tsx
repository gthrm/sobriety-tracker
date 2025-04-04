"use client";

import { StreakCounter } from "./StreakCounter";
import { DataManager } from "./DataManager";
import { useSobrietyData } from "@/hooks/useSobrietyData";

export function MainContent() {
  const { data, confirmDay, cancelConfirmation, toggleDate, exportData, importData, isConfirmedToday } =
    useSobrietyData();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-md mx-auto min-h-screen flex flex-col justify-between">
        <StreakCounter
          streak={data.streak}
          onConfirm={confirmDay}
          onCancel={cancelConfirmation}
          onToggleDate={toggleDate}
          isConfirmedToday={isConfirmedToday}
          confirmedDates={data.history}
        />

        <div className="py-6 px-4">
          <DataManager onExport={exportData} onImport={importData} />
        </div>
      </div>
    </main>
  );
}
