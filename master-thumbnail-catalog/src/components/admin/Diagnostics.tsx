import React from 'react';
import { CATALOG_DATA } from '../../data/catalog';

export const Diagnostics: React.FC = () => {
  const totalThumbnails = CATALOG_DATA.reduce((acc, section) => acc + section.variations.length, 0);
  const sectionsCount = CATALOG_DATA.length;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6">System Diagnostics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Catalogue Stats</h3>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
              <span>Total Sections</span>
              <span className="text-[var(--text-primary)] font-mono font-bold">{sectionsCount}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Total Thumbnails</span>
              <span className="text-[var(--text-primary)] font-mono font-bold">{totalThumbnails}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">System Info</h3>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <div className="flex justify-between items-center border-b border-[var(--border-color)] pb-2">
              <span>React Version</span>
              <span className="text-[var(--text-primary)] font-mono font-bold">{React.version}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span>Environment</span>
              <span className="text-[var(--text-primary)] font-mono font-bold">{import.meta.env.MODE}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
