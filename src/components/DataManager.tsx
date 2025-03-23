import { useState } from 'react';

interface DataManagerProps {
  onExport: () => string;
  onImport: (data: string) => boolean;
}

export const DataManager = ({ onExport, onImport }: DataManagerProps) => {
  const [importError, setImportError] = useState(false);

  const handleExport = () => {
    const data = onExport();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sobriety-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const success = onImport(content);
      setImportError(!success);
      if (success) {
        event.target.value = '';
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-3">
        <button
          onClick={handleExport}
          className="flex-1 border-2 border-[#4CB5F9] text-[#4CB5F9] py-3 rounded-2xl text-sm font-medium
            hover:bg-[#4CB5F9]/5 transition-colors"
        >
          EXPORT DATA
        </button>
        <label className="flex-1">
          <div className="border-2 border-[#4CB5F9] text-[#4CB5F9] py-3 rounded-2xl text-sm font-medium
            hover:bg-[#4CB5F9]/5 transition-colors text-center cursor-pointer">
            IMPORT DATA
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      {importError && (
        <p className="text-red-500 text-sm text-center">
          Invalid data format. Please try again.
        </p>
      )}
    </div>
  );
}; 