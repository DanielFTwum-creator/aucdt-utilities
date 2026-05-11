import React from 'react';
import { MODULES, STAGES, RIGHTS_STATUS_COLORS } from '../constants';
import type { ModuleId } from '../types';
import { getTracks } from '../services/trackService';

interface DashboardProps {
  setActiveModuleId: (id: ModuleId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveModuleId }) => {
  const tracks = getTracks();
  const commercialCount = tracks.filter(t => t.rightsStatus === 'COMMERCIAL').length;
  const nonCommercialCount = tracks.filter(t => t.rightsStatus === 'NON_COMMERCIAL').length;
  const readyForDist = tracks.filter(t => t.currentStage === 'S5').length;

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] font-playfair">Rights Dashboard</h2>
        <p className="text-[var(--color-foreground-muted)] mt-2 max-w-2xl">
          Manage your catalogue, enforce rights gates, and track production pipeline status.
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Tracks', value: tracks.length, color: 'text-[var(--color-primary)]' },
          { label: 'Commercial', value: commercialCount, color: 'text-green-400' },
          { label: 'Non-Commercial', value: nonCommercialCount, color: 'text-red-400' },
          { label: 'Distribution Ready', value: readyForDist, color: 'text-blue-400' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-[var(--color-background-card)] rounded-lg p-4 border border-[var(--color-border-card)]">
            <p className="text-xs text-[var(--color-foreground-muted)] mb-1">{kpi.label}</p>
            <p className={`text-3xl font-bold font-bebas ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Stage pipeline summary */}
      <div className="bg-[var(--color-background-card)] rounded-lg p-6 border border-[var(--color-border-card)]">
        <h3 className="font-semibold text-[var(--color-foreground)] mb-4 font-playfair">Stage Pipeline</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {STAGES.map((stage, i) => {
            const count = tracks.filter(t => t.currentStage === stage.id).length;
            return (
              <React.Fragment key={stage.id}>
                <div className="text-center">
                  <div className="text-[var(--color-primary)] font-bold font-bebas text-xl">{stage.label}</div>
                  <div className="text-xs text-[var(--color-foreground-muted)]">{stage.id}</div>
                  <div className="mt-1 text-lg font-bold text-[var(--color-foreground)]">{count}</div>
                </div>
                {i < STAGES.length - 1 && (
                  <svg aria-hidden="true" className="w-4 h-4 text-[var(--color-foreground-muted)] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Modules grid */}
      <div>
        <h3 className="font-semibold text-[var(--color-foreground)] mb-4 font-playfair">Modules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(module => (
            <button
              key={module.id}
              onClick={() => setActiveModuleId(module.id)}
              aria-label={`Open module: ${module.title}`}
              className="bg-[var(--color-background-card)] rounded-lg p-6 flex flex-col text-left hover:bg-[var(--color-background-card-hover)] hover:scale-105 transform transition-all border border-[var(--color-border-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
              <div aria-hidden="true" className={`mb-3 p-2 inline-block rounded-lg bg-[var(--color-background-card-hover)] ${module.color}`}>
                {module.icon}
              </div>
              <h4 className="font-bold text-[var(--color-foreground)] mb-1 font-playfair">{module.title}</h4>
              <p className="text-sm text-[var(--color-foreground-muted)]">{module.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
