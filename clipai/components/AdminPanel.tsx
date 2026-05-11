import React from 'react';
import { AuditLogEntry } from '../types';

interface AdminPanelProps {
    auditLog: AuditLogEntry[];
    onLogout: () => void;
    logAdminAction: (action: string) => void;
    onNavigateToTests: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ auditLog, onLogout, logAdminAction, onNavigateToTests }) => {
    
    const handleActionClick = (action: string) => {
        logAdminAction(action);
    };

    const handleNavigateToTests = () => {
        logAdminAction('Navigated to self-test panel.');
        onNavigateToTests();
    };

    return (
        <div className="hc-bg hc-border hc-text max-w-4xl mx-auto mt-10 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white hc-text">Admin Panel</h2>
                <button onClick={onLogout} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors">
                    Logout
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Actions Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">Actions</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Perform administrative tasks.</p>
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleActionClick('Cache cleared')} className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                            Clear Cache
                        </button>
                        <button onClick={() => handleActionClick('User settings reset')} className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                           Reset All User Settings
                        </button>
                         <button onClick={() => handleActionClick('System diagnostics ran')} className="w-full text-left px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-600 transition-colors">
                           Run System Diagnostics
                        </button>
                         <button onClick={handleNavigateToTests} className="w-full text-left px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                           Go to Testing
                        </button>
                    </div>
                </div>

                {/* Audit Log Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-gray-300 dark:border-gray-600 pb-2">Audit Log</h3>
                    <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-3 rounded-md border border-gray-200 dark:border-gray-700">
                        {auditLog.length > 0 ? (
                            <ul className="space-y-2">
                                {auditLog.slice().reverse().map((entry, index) => (
                                    <li key={index} className="text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-1">
                                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 block">{new Date(entry.timestamp).toLocaleString()}</span>
                                        <span>{entry.action}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No actions logged yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;