
import React, { useState } from 'react';
import { ShieldAlert, Key, ClipboardList, UserCheck, ShieldOff } from 'lucide-react';
import { AuditEntry } from '../types';

interface AdminPageProps {
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;
  logs: AuditEntry[];
}

const AdminPage: React.FC<AdminPageProps> = ({ isAuthenticated, setAuthenticated, logs }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Invalid security credential');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border shadow-xl text-center space-y-6">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="text-rose-600 w-10 h-10" />
        </div>
        <div>
          <h2 className="text-2xl font-black">Restricted Access</h2>
          <p className="text-gray-500 text-sm">Please provide the administrative key to continue.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Admin Security Key" 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-rose-600 text-xs font-bold">{error}</p>}
          <button type="submit" className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">Authorize Access</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-2xl">
            <UserCheck className="text-emerald-600 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black">Admin Control Centre</h2>
            <p className="text-gray-500">System health and security audit logs.</p>
          </div>
        </div>
        <button onClick={() => setAuthenticated(false)} className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50"><ShieldOff size={16}/> Terminate Session</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center gap-2">
            <ClipboardList className="text-indigo-600 w-5 h-5" />
            <h3 className="font-bold">Audit Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 font-bold">{log.action}</td>
                    <td className="px-6 py-4">{log.user}</td>
                    <td className="px-6 py-4 text-gray-500 italic">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-indigo-600 text-white p-6 rounded-3xl shadow-lg">
            <h3 className="font-bold mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Uptime</span>
                <span className="font-mono">99.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Active Users</span>
                <span className="font-mono">1</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Security Level</span>
                <span className="font-mono">Standard</span>
              </div>
            </div>
          </div>
          <div className="bg-white border rounded-3xl p-6">
             <h3 className="font-bold text-gray-900 mb-4">Database Health</h3>
             <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
               <div className="w-1/4 h-full bg-emerald-500"></div>
             </div>
             <p className="mt-2 text-xs text-gray-500 font-bold">Storage: 2.1MB / 50MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
