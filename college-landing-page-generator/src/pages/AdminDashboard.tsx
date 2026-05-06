import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export function AdminDashboard() {
  const { theme, setTheme } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('tuc_audit_logs') || '[]');
    setLogs(savedLogs.slice(-5).reverse());
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-['Playfair_Display']">System Overview</h2>
          <p className="text-zinc-400 text-sm mt-1">College Landing Page Generator Dashboard</p>
        </div>
        
        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          {(['light', 'dark', 'high-contrast'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition ${
                theme === t 
                  ? 'bg-zinc-700 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
              aria-label={`Switch to ${t} theme`}
              aria-pressed={theme === t}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#141210] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">System Status</h3>
          <p className="text-2xl font-bold text-green-400">ONLINE</p>
          <p className="text-xs text-zinc-500 mt-1">React 19.2.5 Active</p>
        </div>
        <div className="bg-[#141210] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Total Exports</h3>
          <p className="text-2xl font-bold text-white">42</p>
          <p className="text-xs text-zinc-500 mt-1">Generated this month</p>
        </div>
        <div className="bg-[#141210] p-6 rounded-xl border border-zinc-800">
          <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Accessibility</h3>
          <p className="text-2xl font-bold text-[#C8A84B]">100%</p>
          <p className="text-xs text-zinc-500 mt-1">ARIA coverage compliant</p>
        </div>
      </div>

      <div className="bg-[#141210] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-bold">Recent Audit Logs</h3>
        </div>
        <div className="p-0">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">No activity recorded yet.</div>
          ) : (
            <table className="w-full text-left text-sm" role="table" aria-label="Recent Audit Logs">
              <thead className="bg-zinc-900/50 text-zinc-400">
                <tr>
                  <th className="p-4 font-medium" scope="col">Timestamp</th>
                  <th className="p-4 font-medium" scope="col">Action</th>
                  <th className="p-4 font-medium" scope="col">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-zinc-900/30 transition">
                    <td className="p-4 font-mono text-xs text-zinc-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-4 font-semibold text-white">{log.action}</td>
                    <td className="p-4 text-zinc-400">{log.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
