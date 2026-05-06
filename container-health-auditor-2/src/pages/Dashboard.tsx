import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { Activity, Server, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { containers, fetchContainers } = useAppStore();

  useEffect(() => {
    fetchContainers();
    const interval = setInterval(fetchContainers, 5000);
    return () => clearInterval(interval);
  }, [fetchContainers]);

  const healthyCount = containers.filter(c => c.health_score >= 80).length;
  const warningCount = containers.filter(c => c.health_score >= 50 && c.health_score < 80).length;
  const criticalCount = containers.filter(c => c.health_score < 50).length;

  const stats = [
    { label: 'Total Containers', value: containers.length, icon: Server, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Healthy', value: healthyCount, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Warning', value: warningCount, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Critical', value: criticalCount, icon: Activity, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Ecosystem Overview</h2>
        <p className="text-slate-500">Real-time health monitoring of {containers.length} containers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Health Score Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={containers.slice(0, 10).map((c, i) => ({ name: i, score: c.health_score }))}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Critical Issues</h3>
          <div className="space-y-4">
            {containers.filter(c => c.health_score < 60).slice(0, 5).map(container => (
              <div key={container.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <div>
                    <p className="font-medium text-slate-900">{container.container_name}</p>
                    <p className="text-xs text-slate-500">{container.pod_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-700">{container.health_score.toFixed(1)}%</p>
                  <p className="text-xs text-red-600">Health Score</p>
                </div>
              </div>
            ))}
            {containers.filter(c => c.health_score < 60).length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No critical issues detected.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
