import React, { useState } from 'react';
import { getTracks, canPromote, saveTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import { RIGHTS_STATUS_COLORS } from '../constants';
import type { Track } from '../types';

const Module3RightsAudit: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks());
  const [selected, setSelected] = useState<Track | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handlePromote = (track: Track) => {
    const { allowed, reason } = canPromote(track);
    const stageOrder: Track['currentStage'][] = ['S1', 'S2', 'S3', 'S4', 'S5'];
    const nextIdx = stageOrder.indexOf(track.currentStage) + 1;

    if (!allowed) {
      setMessage({ text: reason, ok: false });
      addLog(`Promotion denied for "${track.title}": ${reason}`, { entityType: 'track', entityId: track.id, result: 'denied' });
      return;
    }

    const nextStage = stageOrder[nextIdx];
    const updated = saveTrack({ ...track, currentStage: nextStage });
    setTracks(getTracks());
    setSelected(updated);
    setMessage({ text: `Track promoted to ${nextStage}.`, ok: true });
    addLog(`Track "${track.title}" promoted to ${nextStage}.`, { entityType: 'track', entityId: track.id, result: 'allowed' });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Rights Audit</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Review rights statuses and attempt stage promotion. NON_COMMERCIAL tracks are hard-blocked at S2.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Track list */}
        <div className="space-y-2">
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => { setSelected(track); setMessage(null); }}
              aria-pressed={selected?.id === track.id}
              aria-label={`Select track: ${track.title}`}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selected?.id === track.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border-card)] bg-[var(--color-background-card)] hover:bg-[var(--color-background-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[track.rightsStatus]}`}>
                  {track.rightsStatus.replace('_', '-')}
                </span>
              </div>
              <p className="text-xs text-[var(--color-foreground-muted)] mt-1">{track.artist} · Stage: {track.currentStage}</p>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
              <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{selected.title}</h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Artist', selected.artist],
                  ['Platform', `${selected.sourcePlatform} (${selected.sourceAccountTier})`],
                  ['Rights Status', selected.rightsStatus],
                  ['Current Stage', selected.currentStage],
                  ['Human Authorship Elements', String(selected.humanAuthorshipElements)],
                  ['Audit Hash', selected.auditHash],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2">
                    <dt className="text-[var(--color-foreground-muted)]">{k}</dt>
                    <dd className="text-[var(--color-foreground)] text-right font-mono text-xs">{v}</dd>
                  </div>
                ))}
              </dl>

              {/* Promote button */}
              {(() => {
                const { allowed, reason } = canPromote(selected);
                return (
                  <div>
                    <button
                      onClick={() => handlePromote(selected)}
                      data-test="promote-to-s3"
                      disabled={!allowed}
                      title={!allowed ? reason : `Promote "${selected.title}" to next stage`}
                      aria-label={`Promote "${selected.title}" to next stage${!allowed ? ` — disabled: ${reason}` : ''}`}
                      aria-disabled={!allowed}
                      className="w-full px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Promote to Next Stage
                    </button>
                    {!allowed && (
                      <p className="text-xs text-red-400 mt-2" role="status">{reason}</p>
                    )}
                  </div>
                );
              })()}

              {message && (
                <div role="status" aria-live="polite" className={`text-sm p-3 rounded-md border ${message.ok ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-red-400 border-red-400/20 bg-red-400/5'}`}>
                  {message.text}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-foreground-muted)] text-sm p-8">
              Select a track to view its rights audit detail.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module3RightsAudit;
