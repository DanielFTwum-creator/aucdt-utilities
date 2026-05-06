import React, { useState, useRef } from 'react';
import type { AuditLogEntry } from '../types';

interface AuditLogProps {
  logEntries: AuditLogEntry[];
  setLogEntries: React.Dispatch<React.SetStateAction<AuditLogEntry[]>>;
}

const AuditLog: React.FC<AuditLogProps> = ({ logEntries, setLogEntries }) => {
  const [isVisible, setIsVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (logEntries.length === 0) {
      alert("No log entries to export.");
      return;
    }
    const headers = "Email,Timestamp,Status\n";
    const csvContent = logEntries
      .map(e => `"${e.email}","${e.timestamp}","${e.status}"`)
      .join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `aucdt_submission_log_${new Date().toISOString()}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const rows = text.split('\n').slice(1); // Skip header
        const newEntries = rows.filter(row => row.trim()).map(row => {
          const [email, timestamp, status] = row.split(',').map(field => field.trim().replace(/"/g, ''));
          if (!email || !timestamp || !['Success', 'Failed'].includes(status)) {
            throw new Error(`Invalid row format: ${row}`);
          }
          return { email, timestamp, status } as AuditLogEntry;
        });
        
        // Simple merge: add new entries and remove duplicates
        const combined = [...newEntries, ...logEntries];
        const unique = Array.from(new Map(combined.map(item => [`${item.timestamp}-${item.email}`, item])).values());
        unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        setLogEntries(unique);
        alert(`${newEntries.length} entries imported successfully.`);
      } catch (error) {
        console.error("Failed to import CSV", error);
        alert("Failed to import CSV. Please ensure it is correctly formatted with columns: Email,Timestamp,Status");
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };
  
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the entire audit log? This action cannot be undone.")) {
      setLogEntries([]);
    }
  };

  return (
    <div className="bg-gray-100/80 backdrop-blur-sm p-4 rounded-xl shadow-inner">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-700">Admin Tools</h3>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
          aria-expanded={isVisible}
        >
          {isVisible ? 'Hide' : 'Show'} Audit Log
        </button>
      </div>

      {isVisible && (
        <div className="mt-4 animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={handleExport} className="bg-green-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-green-700 disabled:opacity-50" disabled={logEntries.length === 0}>Export CSV</button>
            <button onClick={triggerImport} className="bg-blue-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-700">Import CSV</button>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
            <button onClick={handleClear} className="bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-700 disabled:opacity-50" disabled={logEntries.length === 0}>Clear Log</button>
          </div>
          <div className="bg-white rounded-lg shadow-md max-h-80 overflow-y-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-4 py-3">Email</th>
                  <th scope="col" className="px-4 py-3">Timestamp</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {logEntries.length > 0 ? logEntries.map((entry, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{entry.email}</td>
                    <td className="px-4 py-2">{new Date(entry.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">No log entries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuditLog;