import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ArrowLeft, Server, Activity, Cpu, HardDrive, Clock, AlertTriangle, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export function ContainerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedContainer, containerMetrics, fetchContainerDetails, fetchContainerMetrics } = useAppStore();

  useEffect(() => {
    if (id) {
      fetchContainerDetails(id);
      fetchContainerMetrics(id);
      const interval = setInterval(() => fetchContainerMetrics(id), 5000);
      return () => clearInterval(interval);
    }
  }, [id, fetchContainerDetails, fetchContainerMetrics]);

  if (!selectedContainer) {
    return <div className="p-8 text-center text-slate-500">Loading container details...</div>;
  }

  // Format metrics for charts
  const chartData = [...containerMetrics].reverse().map(m => ({
    time: format(new Date(m.timestamp), 'HH:mm:ss'),
    cpu: m.cpu_usage_percent,
    memory: m.memory_usage_percent,
    restarts: m.restart_count
  }));

  return (
    <div className="space-y-6">
      <button 
        onClick={() => navigate('/containers')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Containers
      </button>

      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Server size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{selectedContainer.container_name}</h1>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">{selectedContainer.id}</span>
              <span>•</span>
              <span>{selectedContainer.namespace}</span>
              <span>•</span>
              <span>{selectedContainer.node_name}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-slate-500">Status</p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {selectedContainer.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Health Score</p>
            <p className={clsx(
              "text-3xl font-bold",
              selectedContainer.health_score >= 80 ? "text-emerald-600" :
              selectedContainer.health_score >= 50 ? "text-yellow-600" : "text-red-600"
            )}>
              {selectedContainer.health_score}
            </p>
          </div>
        </div>
      </div>

      {/* Prediction Panel */}
      {selectedContainer.prediction && selectedContainer.prediction.probability > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
                <Zap className="text-yellow-400" size={20} />
                Predictive Analysis
              </h3>
              <p className="text-slate-300 max-w-xl">
                AI models indicate a <strong>{selectedContainer.prediction.probability}% probability</strong> of failure 
                within the next <strong>{selectedContainer.prediction.time_to_failure} minutes</strong>.
                Recommended action: Check memory leaks or scale resources.
              </p>
            </div>
            <div className="text-center bg-white/10 p-4 rounded-lg backdrop-blur-sm border border-white/10">
              <p className="text-xs text-slate-300 uppercase tracking-wider">Time to Failure</p>
              <p className="text-3xl font-bold font-mono text-yellow-400">
                {selectedContainer.prediction.time_to_failure} <span className="text-sm text-slate-400">min</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Cpu size={20} className="text-blue-500" />
            CPU Usage History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#eff6ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity size={20} className="text-purple-500" />
            Memory Usage History
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{fontSize: 12}} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="memory" stroke="#a855f7" fill="#f3e8ff" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Anomalies (Simulated) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle size={20} className="text-orange-500" />
          Recent Anomalies
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-600">Timestamp</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Type</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Severity</th>
                <th className="px-6 py-3 font-semibold text-slate-600">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Mock Data for now */}
              <tr>
                <td className="px-6 py-3 text-slate-500">{format(new Date(), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="px-6 py-3">CPU Spike</td>
                <td className="px-6 py-3"><span className="text-yellow-600 font-medium">WARNING</span></td>
                <td className="px-6 py-3 text-slate-600">CPU usage exceeded 90% for 2 minutes</td>
              </tr>
              <tr>
                <td className="px-6 py-3 text-slate-500">{format(new Date(Date.now() - 3600000), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="px-6 py-3">Memory Leak</td>
                <td className="px-6 py-3"><span className="text-red-600 font-medium">CRITICAL</span></td>
                <td className="px-6 py-3 text-slate-600">Memory usage increasing linearly (slope: 0.5MB/min)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
