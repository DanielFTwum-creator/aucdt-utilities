import React, { useEffect, useState } from 'react';

interface DiagnosticData {
  status: string;
  database: {
    connected: boolean;
    size_bytes: number;
    counts: {
      users: number;
      candidates: number;
      roles: number;
      applications: number;
    };
  };
  system: {
    uptime: number;
    node_version: string;
  };
}

export default function AdminDiagnostics() {
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/diagnostics')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch diagnostics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading diagnostics...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!data) return <div className="p-8">No data available</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-text-primary mb-8 font-display">System Diagnostics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-display">System Status</h2>
          <div className="space-y-3 font-body">
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className={`font-mono font-medium ${data.status === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
                {data.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Uptime</span>
              <span className="font-mono">{Math.floor(data.system.uptime)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Node Version</span>
              <span className="font-mono">{data.system.node_version}</span>
            </div>
          </div>
        </div>

        {/* Database Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-display">Database Health</h2>
          <div className="space-y-3 font-body">
            <div className="flex justify-between">
              <span className="text-text-muted">Connection</span>
              <span className={`font-mono font-medium ${data.database.connected ? 'text-green-600' : 'text-red-600'}`}>
                {data.database.connected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Size</span>
              <span className="font-mono">{(data.database.size_bytes / 1024).toFixed(2)} KB</span>
            </div>
          </div>
        </div>

        {/* Entity Counts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 md:col-span-2">
          <h2 className="text-lg font-semibold text-text-primary mb-4 font-display">Entity Counts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-text-primary font-display">{data.database.counts.users}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">Users</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-text-primary font-display">{data.database.counts.candidates}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">Candidates</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-text-primary font-display">{data.database.counts.roles}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">Roles</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-text-primary font-display">{data.database.counts.applications}</div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">Applications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
