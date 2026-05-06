import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { useThemeStore } from '../themeStore';
import { Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx } from 'clsx';

function getScoreColor(score: number) {
  if (score >= 80) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Healthy';
  if (score >= 50) return 'Warning';
  return 'Critical';
}

export function Health() {
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

  const distribution = [
    { range: 'Healthy (80-100)', count: healthyCount, color: '#10b981' },
    { range: 'Warning (50-79)', count: warningCount, color: '#f59e0b' },
    { range: 'Critical (0-49)', count: criticalCount, color: '#ef4444' },
  ];

  const chartData = entities.map(e => ({
    name: e.name.replace('Entity ', '#'),
    score: parseFloat(e.health_score.toFixed(1)),
  }));

  return (
    <div className="space-y-8" role="region" aria-label="Health Monitor">
      <div>
        <h2 className={clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>System Health</h2>
        <p className={clsx("text-sm mt-1", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
          Real-time health monitoring across all entities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {distribution.map((d) => (
          <div key={d.range} className={clsx("p-5 rounded-xl border", isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm")}>
            <div className="flex items-center justify-between mb-2">
              <span className={clsx("text-sm font-medium", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-400" : "text-slate-500")}>{d.range}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isHighContrast && d.range.startsWith('Healthy') ? '#facc15' : d.color }} aria-hidden="true" />
            </div>
            <p className={clsx("text-3xl font-bold tabular-nums", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>{d.count}</p>
          </div>
        ))}
      </div>

      <div className={clsx("p-6 rounded-xl border", isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm")}>
        <h3 className={clsx("text-lg font-bold mb-6", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Per-Entity Health Scores</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isHighContrast ? '#facc1540' : isDark ? '#334155' : '#f1f5f9'} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: isHighContrast ? '#facc15' : isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={40} tick={{ fill: isHighContrast ? '#facc15' : isDark ? '#94a3b8' : '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: isHighContrast ? '#000' : isDark ? '#1e293b' : '#fff', border: `1px solid ${isHighContrast ? '#facc15' : isDark ? '#334155' : '#e2e8f0'}`, borderRadius: '8px', color: isHighContrast ? '#facc15' : isDark ? '#e2e8f0' : '#1e293b' }}
                formatter={(value: number) => [`${value}%`, 'Health Score']}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className={clsx("text-lg font-bold mb-4", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Entity Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {entities.map(entity => {
            const color = isHighContrast ? '#facc15' : getScoreColor(entity.health_score);
            const label = getScoreLabel(entity.health_score);
            const Icon = entity.health_score >= 80 ? TrendingUp : entity.health_score >= 50 ? Minus : TrendingDown;
            return (
              <div key={entity.id} className={clsx("p-4 rounded-xl border", isHighContrast ? "bg-black border-yellow-400" : isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-100 shadow-sm")}>
                <div className="flex items-center justify-between mb-3">
                  <Heart size={16} style={{ color }} aria-hidden="true" />
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: isHighContrast ? '#facc1530' : `${color}15`, color }}>{label}</span>
                </div>
                <p className={clsx("font-bold text-sm truncate", isHighContrast ? "text-white" : isDark ? "text-white" : "text-slate-900")}>{entity.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xl font-bold tabular-nums" style={{ color }}>{entity.health_score.toFixed(1)}%</span>
                  <Icon size={14} style={{ color }} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
