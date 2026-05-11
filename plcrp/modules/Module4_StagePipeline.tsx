import React from 'react';
import { getTracks } from '../services/trackService';
import { STAGES, RIGHTS_STATUS_COLORS } from '../constants';
import type { Track } from '../types';

const STAGE_BG: Record<string, string> = {
  S1: 'border-gray-600/30 bg-gray-600/5',
  S2: 'border-yellow-600/30 bg-yellow-600/5',
  S3: 'border-blue-600/30 bg-blue-600/5',
  S4: 'border-purple-600/30 bg-purple-600/5',
  S5: 'border-green-600/30 bg-green-600/5',
};

const TrackChip: React.FC<{ track: Track }> = ({ track }) => (
  <div className="p-2 rounded-md bg-[var(--color-background-card)] border border-[var(--color-border-card)] text-xs space-y-1">
    <p className="font-medium text-[var(--color-foreground)] truncate">{track.title}</p>
    <div className="flex gap-1 flex-wrap">
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[track.rightsStatus]}`}>
        {track.rightsStatus === 'NON_COMMERCIAL' ? 'NON-COMM' : track.rightsStatus}
      </span>
      {track.rightsStatus === 'NON_COMMERCIAL' && track.currentStage === 'S2' && (
        <span className="text-[9px] text-red-400">⛔ Gate blocked</span>
      )}
    </div>
  </div>
);

const Module4StagePipeline: React.FC = () => {
  const tracks = getTracks();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Stage Pipeline</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Visual Kanban view of all tracks across the S1→S5 production pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map(stage => {
          const stageTracks = tracks.filter(t => t.currentStage === stage.id);
          return (
            <div key={stage.id} className={`rounded-lg border p-3 ${STAGE_BG[stage.id]}`}>
              <div className="mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--color-primary)] font-bold font-bebas text-lg">{stage.id}</span>
                  <span className="text-xs text-[var(--color-foreground-muted)] bg-[var(--color-background-card)] px-1.5 py-0.5 rounded-full border border-[var(--color-border-card)]">
                    {stageTracks.length}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[var(--color-foreground)]">{stage.label}</p>
                <p className="text-[10px] text-[var(--color-foreground-muted)] mt-0.5">{stage.description}</p>
              </div>
              <div className="space-y-2" aria-label={`${stage.label} tracks`}>
                {stageTracks.length === 0
                  ? <p className="text-[10px] text-[var(--color-foreground-muted)] italic text-center py-4">Empty</p>
                  : stageTracks.map(t => <TrackChip key={t.id} track={t} />)
                }
              </div>
            </div>
          );
        })}
      </div>

      {/* Gate annotations */}
      <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-5 space-y-3">
        <h3 className="font-semibold text-[var(--color-foreground)] font-playfair text-sm">Gate Rules</h3>
        {[
          { gate: 'S2 → S3', rule: 'NON_COMMERCIAL tracks cannot pass S2. Free-tier Suno/Udio sources are auto-blocked.' },
          { gate: 'S4 → S5', rule: 'Track must have ≥2 documented human authorship elements.' },
          { gate: 'S5 → Distribution', rule: 'Only COMMERCIAL tracks in S5 may be submitted to DSPs.' },
        ].map(item => (
          <div key={item.gate} className="flex gap-3 text-sm">
            <span className="text-[var(--color-primary)] font-bold font-mono whitespace-nowrap">{item.gate}</span>
            <span className="text-[var(--color-foreground-muted)]">{item.rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Module4StagePipeline;
