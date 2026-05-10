import React from 'react';

export function calculateWeightedRank(gScore: number, mScore: number, roi: number): number {
  return gScore * 0.4 + mScore * 0.4 + (roi * 10) * 0.2;
}

export function getStageColor(stage: string): string {
  switch (stage) {
    case 'Pre-Seed': return 'border-purple-500/40 text-purple-400';
    case 'Seed': return 'border-brand-cyan/40 text-brand-cyan';
    case 'Series A': return 'border-brand-amber/40 text-brand-amber';
    case 'Series B': return 'border-brand-green/40 text-brand-green';
    default: return 'border-white/40 text-white';
  }
}
