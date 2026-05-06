import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function Health() {
  const { containers, fetchContainers } = useAppStore();

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const healthyCount = containers.filter(c => c.health_score >= 80).length;
  const warningCount = containers.filter(c => c.health_score >= 50 && c.health_score < 80).length;
  const criticalCount = containers.filter(c => c.health_score < 50).length;

  const data = [
    { name: 'Healthy', value: healthyCount, color: '#10b981' },
    { name: 'Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Critical', value: criticalCount, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">System Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
            <CheckCircle size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Healthy Containers</p>
            <p className="text-3xl font-bold text-slate-900">{healthyCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 rounded-full text-yellow-600">
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Warning State</p>
            <p className="text-3xl font-bold text-slate-900">{warningCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-red-50 rounded-full text-red-600">
            <XCircle size={32} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Critical State</p>
            <p className="text-3xl font-bold text-slate-900">{criticalCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Health Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Health Recommendations</h3>
          <div className="space-y-4">
            {criticalCount > 0 ? (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <h4 className="font-bold text-red-800 flex items-center gap-2">
                  <AlertTriangle size={18} />
                  Immediate Action Required
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {criticalCount} containers are in critical state. Check logs for OOM kills or restart loops.
                  Consider scaling up resources for affected pods.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle size={18} />
                  System Healthy
                </h4>
                <p className="text-sm text-emerald-700 mt-1">
                  All systems operating within normal parameters. No immediate action required.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <h4 className="font-bold text-blue-800 flex items-center gap-2">
                <Activity size={18} />
                Optimization Opportunity
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                3 containers have low CPU utilization ({'<'} 5%). Consider scaling down to save resources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
