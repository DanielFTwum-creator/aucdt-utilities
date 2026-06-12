import React, { useContext, useState, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import type { AppContextType, AuditLog } from '../../types';

type SortConfig = {
  key: keyof AuditLog | null;
  direction: 'ascending' | 'descending';
};

export const AuditLogViewer: React.FC = () => {
    const { auditLogs } = useContext(AppContext) as AppContextType;
    const [filter, setFilter] = useState('');
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'timestamp', direction: 'descending' });

    const filteredLogs = useMemo(() => {
        if (!filter) {
            return auditLogs;
        }
        return auditLogs.filter(log =>
            log.action.toLowerCase().includes(filter.toLowerCase()) ||
            log.details.toLowerCase().includes(filter.toLowerCase())
        );
    }, [auditLogs, filter]);

    const sortedLogs = useMemo(() => {
        let sortableLogs = [...filteredLogs];
        if (sortConfig.key !== null) {
            sortableLogs.sort((a, b) => {
                const valA = a[sortConfig.key!];
                const valB = b[sortConfig.key!];

                if (valA < valB) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableLogs;
    }, [filteredLogs, sortConfig]);

    const requestSort = (key: keyof AuditLog) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const SortableHeader: React.FC<{ sortKey: keyof AuditLog, children: React.ReactNode }> = ({ sortKey, children }) => {
        const indicator = sortConfig.key === sortKey
            ? (sortConfig.direction === 'ascending' ? '▲' : '▼')
            : '';
        return (
            <button
                onClick={() => requestSort(sortKey)}
                className="flex items-center font-medium uppercase focus:outline-none"
                aria-label={`Sort by ${String(children)}`}
            >
                {children}
                {indicator && <span className="ml-2">{indicator}</span>}
            </button>
        );
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">System Audit Log</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Filter logs by action or details..."
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>
            <div className="overflow-x-auto">
                <div className="align-middle inline-block min-w-full">
                    <div className="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <SortableHeader sortKey="timestamp">Timestamp</SortableHeader>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <SortableHeader sortKey="action">Action</SortableHeader>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        <SortableHeader sortKey="details">Details</SortableHeader>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {sortedLogs.length > 0 ? sortedLogs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.timestamp.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{log.details}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                            {filter ? 'No logs match your filter.' : 'No audit logs yet.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
