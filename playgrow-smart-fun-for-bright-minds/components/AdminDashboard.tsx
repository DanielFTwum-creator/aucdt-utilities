import React, { useState } from 'react';
import { TestTubeIcon } from './icons';

interface AdminDashboardProps {
  onLogout: () => void;
  onNavigateToSelfTest: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onNavigateToSelfTest }) => {
    const [logs, setLogs] = useState<string[]>([]);

    const logAction = (action: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ADMIN ACTION: ${action}`;
        console.log(logMessage); // Comprehensive audit logging
        setLogs(prev => [logMessage, ...prev]);
    };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 dark:bg-gray-800 p-4 sm:p-8 hc-bg-primary">
        <header className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-gray-100 hc-text-primary">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onNavigateToSelfTest}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-400 hc-bg-secondary hc-border hc-accent flex items-center space-x-2"
                    >
                    <TestTubeIcon className="w-5 h-5" />
                    <span>Run Self-Tests</span>
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-red-400 hc-bg-secondary hc-border hc-accent"
                    >
                    Logout
                </button>
            </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Control Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">System Controls</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => logAction('Reset all user progress.')} className="p-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-yellow-400 hc-bg-primary hc-border hc-accent">Reset All Progress</button>
                    <button onClick={() => logAction('Triggered system-wide content update.')} className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-green-400 hc-bg-primary hc-border hc-accent">Push Content Update</button>
                    <button onClick={() => logAction('Triggered manual data backup.')} className="p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-blue-400 hc-bg-primary hc-border hc-accent">Trigger System Backup</button>
                    <button onClick={() => logAction('Flushed application cache.')} className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-4 focus:ring-purple-400 hc-bg-primary hc-border hc-accent">Flush Cache</button>
                </div>
            </div>

            {/* Audit Log */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 flex flex-col hc-bg-secondary hc-border">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 hc-text-primary">Audit Log</h2>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto h-64 lg:h-auto hc-bg-primary hc-border">
                    {logs.length > 0 ? (
                        logs.map((log, index) => (
                            <p key={index} className="text-sm text-gray-600 dark:text-gray-300 font-mono mb-1 hc-text-secondary">{log}</p>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center mt-4 hc-text-secondary">No actions logged yet.</p>
                    )}
                </div>
            </div>
        </main>
    </div>
  );
};

export default AdminDashboard;
