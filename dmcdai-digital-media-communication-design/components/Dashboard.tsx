import React from 'react';
import { MODULES } from '../constants';
import type { ModuleId } from '../types';

interface DashboardProps {
  setActiveModuleId: (id: ModuleId) => void;
}

const ModuleCard: React.FC<{ module: typeof MODULES[0], onClick: () => void }> = ({ module, onClick }) => (
  <button 
    className="bg-[var(--color-background-card)] rounded-lg p-6 flex flex-col justify-between text-left hover:bg-[var(--color-background-card-hover)] hover:scale-105 transform transition-all duration-300 cursor-pointer border border-[var(--color-border-card)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background-main)] focus:ring-[var(--color-primary)]"
    onClick={onClick}
    aria-label={`Open module: ${module.title}`}
    title={`Enter ${module.title} Module`}
  >
    <div>
      <div className={`mb-4 inline-block p-2 rounded-lg bg-[var(--color-background-card-hover)] ${module.color}`} aria-hidden="true">
        {module.icon}
      </div>
      <h3 className="font-bold text-lg text-[var(--color-foreground)] mb-2 font-playfair">{module.title}</h3>
      <p className="text-sm text-[var(--color-foreground-muted)] font-inter">{module.description}</p>
    </div>
  </button>
);


export const Dashboard: React.FC<DashboardProps> = ({ setActiveModuleId }) => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-[var(--color-foreground)] font-playfair">Explore AI in DMCD</h2>
        <p className="text-[var(--color-foreground-muted)] mt-2 font-inter max-w-2xl">Select a module to begin your exploration into the transformative impact of AI on design and communication.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MODULES.map((module) => (
          <ModuleCard key={module.id} module={module} onClick={() => setActiveModuleId(module.id)} />
        ))}
      </div>
    </div>
  );
};
