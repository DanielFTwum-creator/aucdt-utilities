import React, { useState } from 'react';
import { getTracks } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Track } from '../types';

const DSPS = ['Spotify', 'Apple Music', 'Tidal', 'Amazon Music', 'Deezer', 'YouTube Music'];

const Module6Distribution: React.FC = () => {
  const allTracks = getTracks();
  const eligibleTracks = allTracks.filter(t => t.rightsStatus === 'COMMERCIAL' && t.currentStage === 'S5');
  const blockedTracks = allTracks.filter(t => t.rightsStatus === 'NON_COMMERCIAL');
  const [submitted, setSubmitted] = useState<Record<string, string>>({});
  const [selectedDsp, setSelectedDsp] = useState('Spotify');

  const handleSubmit = (track: Track) => {
    setSubmitted(s => ({ ...s, [track.id]: selectedDsp }));
    addLog(`Distribution submitted: "${track.title}" → ${selectedDsp}`, { entityType: 'track', entityId: track.id, result: 'allowed' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Distribution</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Submit cleared tracks to DSPs. Only COMMERCIAL tracks at Stage S5 are eligible.
        </p>
      </div>

      {/* DSP selector */}
      <div className="flex items-center gap-3">
        <label htmlFor="dsp-select" className="text-sm text-[var(--color-foreground-muted)]">Target DSP:</label>
        <select
          id="dsp-select"
          value={selectedDsp}
          onChange={e => setSelectedDsp(e.target.value)}
          aria-label="Select target DSP"
          className="bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md px-3 py-1.5 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]"
        >
          {DSPS.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Eligible tracks */}
      <div>
        <h3 className="font-semibold text-[var(--color-foreground)] mb-3 font-playfair text-sm">
          Eligible for Distribution ({eligibleTracks.length})
        </h3>
        {eligibleTracks.length === 0 ? (
          <div className="text-center text-[var(--color-foreground-muted)] py-12 text-sm border border-[var(--color-border-card)] rounded-lg bg-[var(--color-background-card)]">
            No tracks are currently cleared for distribution. Tracks must be COMMERCIAL and at Stage S5.
          </div>
        ) : (
          <div className="space-y-3">
            {eligibleTracks.map(track => (
              <div key={track.id} className="bg-[var(--color-background-card)] rounded-lg border border-green-400/20 p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist} · {track.humanAuthorshipElements} authorship elements</p>
                </div>
                {submitted[track.id] ? (
                  <span className="text-xs text-green-400 font-semibold border border-green-400/30 bg-green-400/10 px-3 py-1 rounded-full">
                    Submitted → {submitted[track.id]}
                  </span>
                ) : (
                  <button
                    onClick={() => handleSubmit(track)}
                    aria-label={`Submit "${track.title}" to ${selectedDsp}`}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
                  >
                    Submit to {selectedDsp}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked tracks */}
      {blockedTracks.length > 0 && (
        <div>
          <h3 className="font-semibold text-[var(--color-foreground)] mb-3 font-playfair text-sm">
            Blocked — NON_COMMERCIAL ({blockedTracks.length})
          </h3>
          <div className="space-y-2">
            {blockedTracks.map(track => (
              <div key={track.id} className="bg-[var(--color-background-card)] rounded-lg border border-red-400/20 p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist} · {track.sourcePlatform} ({track.sourceAccountTier})</p>
                </div>
                <span className="text-xs text-red-400 font-medium">Distribution blocked</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Module6Distribution;
