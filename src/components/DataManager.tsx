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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const success = onImport(content);
      setImportError(!success);
      if (success) {
        event.target.value = '';
      }
    } catch {
      setImportError(true);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex gap-8 text-xs">
        <button
          onClick={handleExport}
          className="text-[#4CB5F9] underline underline-offset-2 hover:text-[#4CB5F9]/80 
            transition-colors font-medium"
        >
          Export Data
        </button>
        <label>
          <div className="text-[#4CB5F9] underline underline-offset-2 hover:text-[#4CB5F9]/80 
            transition-colors font-medium cursor-pointer">
            Import Data
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
        <p className="text-red-500 text-xs">
          Invalid data format. Please try again.
        </p>
      )}
    </div>
  );
}; 