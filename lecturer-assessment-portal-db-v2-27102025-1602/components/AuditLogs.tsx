import React from 'react';
import { CheckCircle, XCircle, Info, History } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditLogsProps {
    logs: AuditLog[];
}

const statusConfig = {
    Success: { icon: CheckCircle, color: 'text-emerald-500 [.high-contrast_&]:text-green-400' },
    Failure: { icon: XCircle, color: 'text-red-500' },
    Info: { icon: Info, color: 'text-sky-500 [.high-contrast_&]:text-cyan-400' },
};

const AuditLogs: React.FC<AuditLogsProps> = ({ logs }) => {
    return (
        <div className="bg-[#F8F6F0] dark:bg-slate-900/50 [.high-contrast_&]:bg-black border border-slate-200 dark:border-slate-700 [.high-contrast_&]:border-yellow-300 rounded-md h-96 overflow-y-auto">
            {logs.length > 0 ? (
                <ul className="divide-y divide-slate-200 dark:divide-slate-700 [.high-contrast_&]:divide-yellow-300/50">
                    {logs.map(log => {
                        const { icon: Icon, color } = statusConfig[log.status];
                        return (
                            <li key={log.id} className="p-4 flex items-start gap-3">
                                <div className={`mt-1 ${color}`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 [.high-contrast_&]:text-white">
                                        {log.event} <span className="font-normal text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300">- {log.status}</span>
                                    </p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 [.high-contrast_&]:text-slate-300 mt-1">
                                        {log.details}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-400 mt-2">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 [.high-contrast_&]:text-slate-300 p-4">
                    <History size={32} />
                    <p className="mt-3 font-medium">No activity recorded yet.</p>
                    <p className="text-sm mt-1">System events will appear here as they happen.</p>
                </div>
            )}
        </div>
    );
};

export default AuditLogs;