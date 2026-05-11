import React from 'react';
import { ShieldAlert, CheckCircle, Clock } from 'lucide-react';

export function Alerts() {
  const alerts = [
    { id: 1, severity: 'CRITICAL', title: 'Container Restart Loop', description: 'Container app-45-pod-1 restarted 5 times in 5 minutes', time: '2 mins ago', status: 'NEW' },
    { id: 2, severity: 'WARNING', title: 'High Memory Usage', description: 'Container auth-service-x82 using 85% memory', time: '15 mins ago', status: 'ACKNOWLEDGED' },
    { id: 3, severity: 'WARNING', title: 'Latency Spike', description: 'API Gateway latency > 500ms', time: '1 hour ago', status: 'RESOLVED' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Active Alerts</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {alerts.map((alert) => (
            <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-lg h-fit ${
                    alert.severity === 'CRITICAL' ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900">{alert.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock size={12} />
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm">{alert.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {alert.status === 'NEW' && (
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
                      Acknowledge
                    </button>
                  )}
                  {alert.status === 'ACKNOWLEDGED' && (
                    <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700">
                      Resolve
                    </button>
                  )}
                  {alert.status === 'RESOLVED' && (
                    <span className="flex items-center gap-2 text-emerald-600 font-medium text-sm">
                      <CheckCircle size={16} />
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
