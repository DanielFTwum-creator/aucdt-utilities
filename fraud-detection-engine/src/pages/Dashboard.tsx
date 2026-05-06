import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { useThemeStore } from '../themeStore';
import { Activity, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { clsx } from 'clsx';

export function Dashboard() {
  const { entities, fetchEntities } = useAppStore();
  const { isDark, isHighContrast } = useThemeStore();

  useEffect(() => {
    fetchEntities();
    const interval = setInterval(fetchEntities, 5000);
    return () => clearInterval(interval);
  }, [fetchEntities]);

  const healthyCount = entities.filter(e => e.health_score >= 80).length;
  const warningCount = entities.filter(e => e.health_score >= 50 && e.health_score < 80).length;
  const criticalCount = entities.filter(e => e.health_score < 50).length;
  const avgScore = entities.length > 0
    ? (entities.reduce((sum, e) => sum + e.health_score, 0) / entities.length)
    : 0;

  const stats = [
    { label: 'Total Entities', value: entities.length, icon: Database, color: isHighContrast ? 'text-yellow-400' : 'text-blue-500', bg: isHighContrast ? 'bg-yellow-400/20' : isDark ? 'bg-blue-500/10' : 'bg-blue-50' },
    { label: 'Healthy', value: healthyCount, icon: CheckCircle, color: isHighContrast ? 'text-yellow-400' : 'text-emerald-500', bg: isHighContrast ? 'bg-yellow-400/20' : isDark ? 'bg-emerald-500/10' : 'bg-emerald-50' },
    { label: 'Warning', value: warningCount, icon: AlertTriangle, color: isHighContrast ? 'text-yellow-500' : 'text-yellow-500', bg: isHighContrast ? 'bg-yellow-500/20' : isDark ? 'bg-yellow-500/10' : 'bg-yellow-50' },
    { label: 'Critical', value: criticalCount, icon: Activity, color: isHighContrast ? 'text-red-500' : 'text-red-500', bg: isHighContrast ? 'bg-red-500/20' : isDark ? 'bg-red-500/10' : 'bg-red-50' },
  ];

  return (
    <div className="space-y-8" role="region" aria-label="Dashboard Overview">
      <div>
        <h2 className={clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>
          Fraud Detection Engine
        </h2>
        <p className={clsx("text-sm mt-1", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
          Real-time monitoring and management dashboard
        </p>
      </div>

      {/* Avg Health Banner */}
      <div className={clsx(
        "p-4 rounded-xl border flex items-center justify-between",
        isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/60 border-slate-700" : "bg-gradient-to-r from-blue-50 to-emerald-50 border-slate-200"
      )}>
        <div className="flex items-center gap-3">
          <Activity className={isHighContrast ? "text-yellow-400" : "text-blue-500"} size={20} aria-hidden="true" />
          <span className={clsx("font-medium text-sm", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-300" : "text-slate-700")}>
            Average Health Score
          </span>
        </div>
        <span className={clsx(
          "text-2xl font-bold tabular-nums",
          isHighContrast ? "text-yellow-400" : avgScore >= 80 ? "text-emerald-500" : avgScore >= 50 ? "text-yellow-500" : "text-red-500"
        )}>
          {avgScore.toFixed(1)}%
        </span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={clsx(
              "p-6 rounded-xl border transition-colors",
              isHighContrast
                ? "bg-black border-yellow-400"
                : isDark
                ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={clsx("text-sm font-medium", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-400" : "text-slate-500")}>
                  {stat.label}
                </p>
                <p className={clsx("text-3xl font-bold mt-2 tabular-nums", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={stat.color} size={24} aria-hidden="true" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Chart */}
      <div className={clsx(
        "p-6 rounded-xl border transition-colors",
        isHighContrast
          ? "bg-black border-yellow-400"
          : isDark
          ? "bg-slate-800/50 border-slate-700"
          : "bg-white border-slate-100 shadow-sm"
      )}>
        <h3 className={clsx("text-lg font-bold mb-6", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>
          Health Score Trends
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={entities.slice(0, 10).map((e, i) => ({ name: e.name, score: parseFloat(e.health_score.toFixed(1)) }))}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isHighContrast ? "#facc1540" : isDark ? "#334155" : "#f1f5f9"}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: isHighContrast ? '#facc15' : isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isHighContrast ? '#facc15' : isDark ? '#334155' : '#e2e8f0' }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: isHighContrast ? '#facc15' : isDark ? '#94a3b8' : '#64748b', fontSize: 12 }}
                axisLine={{ stroke: isHighContrast ? '#facc15' : isDark ? '#334155' : '#e2e8f0' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: isHighContrast ? '#000' : isDark ? '#1e293b' : '#fff',
                  border: `1px solid ${isHighContrast ? '#facc15' : isDark ? '#334155' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  color: isHighContrast ? '#facc15' : isDark ? '#e2e8f0' : '#1e293b',
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke={isHighContrast ? "#facc15" : "#3b82f6"}
                fill={isHighContrast ? "rgba(250,204,21,0.15)" : isDark ? "rgba(59,130,246,0.15)" : "#eff6ff"}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
