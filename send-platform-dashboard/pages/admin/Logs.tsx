import React, { useEffect, useState } from 'react';
import { auditService } from '../../services/auditService';
import { AuditLog } from '../../types';
import { RefreshCw } from 'lucide-react';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const fetchLogs = () => {
    setLogs([...auditService.getLogs()]);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        <button 
          onClick={fetchLogs}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          aria-label="Refresh system logs"
        >
           <RefreshCw size={14} className="mr-1" aria-hidden="true" /> Refresh
        </button>
      </div>
      
      <div 
        className="bg-gray-900 text-gray-300 rounded-xl shadow-lg p-6 font-mono text-sm h-[600px] overflow-y-auto border border-gray-800"
        role="log"
        aria-live="polite"
        aria-label="Audit Log Output"
      >
        {logs.map((log) => (
          <div key={log.id} className="mb-2 hover:bg-gray-800 p-1 rounded">
            <span className="text-gray-500 mr-2">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
            <span className={`font-bold mr-2 ${
              log.status === 'SUCCESS' ? 'text-green-400' : 'text-red-500'
            }`}>{log.status}</span>
            <span className="text-purple-400 mr-2">[{log.user}@{log.target}]</span>
            <span className="text-gray-300">{log.action}: {log.details || 'No details'}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 italic">No logs available.</div>
        )}
        <div className="animate-pulse mt-2 text-gray-500">_</div>
      </div>
    </div>
  );
};

export default Logs;