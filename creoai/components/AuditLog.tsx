import React from 'react';
import type { AuditLogEntry } from '../types';

interface AuditLogProps {
  log: AuditLogEntry[];
}

const AuditLog: React.FC<AuditLogProps> = ({ log }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Audit Log</h3>
      <div 
        className="rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700"
      >
        {log.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center pt-4">No log entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {log.map((entry, index) => (
              <li 
                key={index} 
                className="text-sm font-mono p-3 rounded-md bg-white dark:bg-gray-800/60 shadow-sm"
              >
                <span className="text-pink-600 dark:text-pink-400 mr-2">{entry.timestamp.toLocaleTimeString()}</span>
                <span className="text-amber-600 dark:text-amber-400 mr-2">[{entry.user}]</span>
                <span className="text-gray-700 dark:text-gray-300">{entry.action}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AuditLog;