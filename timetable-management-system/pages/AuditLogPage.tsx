
import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

const AuditLogPage: React.FC = () => {
    const [userFilter, setUserFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
        const userMatch = log.userName.toLowerCase().includes(userFilter.toLowerCase());
        const dateMatch = dateFilter ? new Date(log.timestamp).toISOString().startsWith(dateFilter) : true;
        return userMatch && dateMatch;
    });

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Audit Log</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
        <input
            type="text"
            placeholder="Filter by user..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="p-2 border rounded-md w-1/3"
        />
        <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th className="p-4 font-semibold text-aucdt-brown">User</th>
                    <th className="p-4 font-semibold text-aucdt-brown">Action</th>
                    <th className="p-4 font-semibold text-aucdt-brown">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{log.userName}</td>
                        <td className="p-4">{log.action}</td>
                        <td className="p-4 text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;
