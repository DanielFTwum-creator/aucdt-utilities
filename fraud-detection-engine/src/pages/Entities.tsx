import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { useThemeStore } from '../themeStore';
import { Database, Activity, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export function Entities() {
  const { entities, fetchEntities, isLoading } = useAppStore();
  const { isDark, isHighContrast } = useThemeStore();

  useEffect(() => {
    fetchEntities();
  }, [fetchEntities]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className={clsx("animate-spin", isDark ? "text-slate-400" : "text-slate-500")} size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6" role="region" aria-label="Entity List">
      <div>
        <h2 className={clsx("text-2xl font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>Entities</h2>
        <p className={clsx("text-sm mt-1", isHighContrast ? "text-yellow-300" : isDark ? "text-slate-400" : "text-slate-500")}>
          Manage all {entities.length} entities in the system
        </p>
      </div>

      <div className="grid gap-4">
        {entities.map(entity => (
          <div
            key={entity.id}
            className={clsx(
              "p-6 rounded-xl border flex items-center justify-between transition-colors",
              isHighContrast
                ? "bg-black border-yellow-400"
                : isDark
                ? "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            )}
            role="listitem"
            aria-label={`Entity ${entity.name}`}
          >
            <div className="flex items-center gap-4">
              <Database className={isHighContrast ? "text-yellow-400" : "text-blue-500"} size={24} aria-hidden="true" />
              <div>
                <h3 className={clsx("font-bold", isHighContrast ? "text-yellow-400" : isDark ? "text-white" : "text-slate-900")}>{entity.name}</h3>
                <p className={clsx("text-sm", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-500")}>ID: {entity.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={clsx(
                "px-3 py-1 rounded-full text-sm font-medium",
                entity.status === 'active'
                  ? (isHighContrast ? "bg-yellow-400 text-black" : isDark ? "bg-green-500/10 text-green-400" : "bg-green-50 text-green-700")
                  : (isHighContrast ? "bg-yellow-400/20 text-yellow-300" : isDark ? "bg-gray-500/10 text-gray-400" : "bg-gray-50 text-gray-700")
              )}>
                {entity.status}
              </span>
              <div className="text-right">
                <p className={clsx(
                  "text-sm font-bold tabular-nums",
                  isHighContrast ? "text-yellow-400" 
                    : entity.health_score >= 80 ? "text-emerald-500"
                    : entity.health_score >= 50 ? "text-yellow-500"
                    : "text-red-500"
                )}>
                  {entity.health_score.toFixed(1)}%
                </p>
                <p className={clsx("text-xs", isHighContrast ? "text-yellow-500" : isDark ? "text-slate-500" : "text-slate-500")}>Health Score</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
