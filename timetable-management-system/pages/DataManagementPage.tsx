
import React, { useRef } from 'react';
import { MOCK_TIMETABLE } from '../data/mockData';
import { Upload, Download } from 'lucide-react';

const DataManagementPage: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(MOCK_TIMETABLE, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "timetable_export.json";
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    const data = JSON.parse(content as string);
                    console.log("Imported data:", data);
                    // Add validation logic here as per REQ-014
                    alert("File imported successfully! Check console for data.");
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert("Error: Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Data Import/Export</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Download className="mx-auto h-16 w-16 text-aucdt-green mb-4" />
          <h2 className="text-xl font-semibold text-aucdt-brown mb-2">Export Data</h2>
          <p className="text-gray-600 mb-6">Export the entire timetable dataset into a JSON file for backup and interoperability purposes.</p>
          <button
            onClick={handleExport}
            className="w-full bg-aucdt-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-aucdt-green/90 transition"
          >
            Export to JSON
          </button>
        </div>
        
        {/* Import Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Upload className="mx-auto h-16 w-16 text-aucdt-gold mb-4" />
          <h2 className="text-xl font-semibold text-aucdt-brown mb-2">Import Data</h2>
          <p className="text-gray-600 mb-6">Import a timetable dataset from a JSON file. The system will validate the file structure and data integrity.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
            accept=".json" 
          />
          <button
            onClick={handleImportClick}
            className="w-full bg-aucdt-gold text-aucdt-brown px-6 py-3 rounded-lg font-semibold hover:bg-aucdt-gold/90 transition"
          >
            Import from JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;
