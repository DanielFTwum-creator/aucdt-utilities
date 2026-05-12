import React, { useState, useEffect } from 'react';
import { getAuditLog as getLogsFromDB } from '../../lib/db';
import { AuditLogEntry } from '../../types';

export const AuditLog: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const loadedLogs = await getLogsFromDB();
                setLogs(loadedLogs);
            } catch (error) {
                console.error('Failed to load audit logs:', error);
            }
        };
        loadLogs();
    }, []);

    const formatTimestamp = (isoString: string) => {
        try {
            return new Date(isoString).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
            });
        } catch (e) {
            return isoString;
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] p-6 sm:p-8 rounded-2xl shadow-lg border border-[var(--color-border-primary)]">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Audit Log</h2>
            <p className="text-[var(--color-text-secondary)] mb-6">Displays the last 100 administrative actions.</p>
            
            <div className="border border-[var(--color-border-primary)] rounded-lg max-h-96 overflow-y-auto custom-scrollbar">
                {logs.length > 0 ? (
                    <table className="w-full text-sm text-left text-[var(--color-text-secondary)]">
                        <thead className="text-xs text-[var(--color-text-tertiary)] uppercase bg-[var(--color-bg-tertiary)] sticky top-0">
                            <tr>
                                <th scope="col" className="px-6 py-3">Timestamp</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                                <th scope="col" className="px-6 py-3">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id} className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] last:border-b-0">
                                    <td className="px-6 py-4 whitespace-nowrap">{formatTimestamp(log.timestamp)}</td>
                                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{log.action}</td>
                                    <td className="px-6 py-4">{log.details || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="p-6 text-center text-[var(--color-text-secondary)]">No log entries found.</p>
                )}
            </div>
        </div>
    );
};