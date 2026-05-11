import React from 'react';
import type { Module } from '../types';

interface ComingSoonProps {
  module: Module;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({ module }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-[var(--color-background-card)]/30 rounded-lg border border-dashed border-[var(--color-border-card)] p-8">
      <div className={`mb-6 text-5xl ${module.color}`}>
        {module.icon}
      </div>
      <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">{module.title}</h2>
      <p className="text-lg text-[var(--color-foreground-muted)] mb-4">This module is under construction.</p>
      <p className="max-w-md text-gray-500">
        Check back soon for an interactive experience designed to explore {module.description.toLowerCase()}
      </p>
    </div>
  );
};
