import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  lastChecked: string;
}

export function Diagnostics() {
  const [health, setHealth] = useState<HealthCheck[]>([
    { service: 'Gemini AI API', status: 'healthy', latency: 120, lastChecked: new Date().toISOString() },
    { service: 'Hubtel Gateway', status: 'healthy', latency: 45, lastChecked: new Date().toISOString() },
    { service: 'Database (Postgres)', status: 'healthy', latency: 12, lastChecked: new Date().toISOString() },
    { service: 'Redis Cache', status: 'healthy', latency: 5, lastChecked: new Date().toISOString() },
  ]);

  const refreshDiagnostics = () => {
    // Simulate refresh
    setHealth(prev => prev.map(h => ({
      ...h,
      latency: Math.floor(Math.random() * 100) + 10,
      lastChecked: new Date().toISOString()
    })));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-stone-900 dark:text-white">System Diagnostics</h1>
        <button 
          onClick={refreshDiagnostics}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A5340] text-white rounded-xl hover:bg-[#3A4232] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Status
        </button>
      </div>

      <div className="grid gap-4">
        {health.map((item) => (
          <div key={item.service} className="bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.status === 'healthy' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {item.status === 'degraded' && <AlertTriangle className="w-6 h-6 text-yellow-500" />}
              {item.status === 'down' && <XCircle className="w-6 h-6 text-red-500" />}
              
              <div>
                <h3 className="font-bold text-stone-900 dark:text-white">{item.service}</h3>
                <p className="text-xs text-stone-500">Last checked: {new Date(item.lastChecked).toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`text-sm font-bold ${
                item.latency < 100 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {item.latency}ms
              </span>
              <p className="text-xs text-stone-500">Latency</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
