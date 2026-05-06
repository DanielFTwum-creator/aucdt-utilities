import React, { useState } from 'react';
import { AuditLog } from '../types';

interface AdminPanelProps {
  logs: AuditLog[];
  onLogin: (success: boolean) => void;
  isAuthenticated: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ logs, onLogin, isAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would check against a secure backend
    if (password === 'admin123') {
      onLogin(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          🔒 Admin Access
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">System Audit Logs</h2>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            Live Monitoring
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4 font-semibold">Timestamp</th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400">No logs recorded yet.</td>
                </tr>
              ) : (
                logs.slice().reverse().map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-4 text-slate-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-4 font-medium text-slate-900">{log.user}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                        log.action.includes('ERROR') ? 'bg-red-100 text-red-700' :
                        log.action.includes('LOGIN') ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
