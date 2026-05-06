import React, { useState } from 'react';
import { getTracks, saveTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Track } from '../types';

const MODULE5_ELEMENTS = [
  'Lyrics written by human',
  'Melody composed by human',
  'Arrangement created by human',
  'Vocals performed by human',
  'Instruments played by human',
  'Production decisions by human',
  'Mixing done by human',
];

const Module5AuthorshipRegistry: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks().filter(t => t.rightsStatus === 'COMMERCIAL'));
  const [selected, setSelected] = useState<Track | null>(null);
  const [count, setCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const handleSelect = (track: Track) => {
    setSelected(track);
    setCount(track.humanAuthorshipElements);
    setSaved(false);
  };

  const handleSave = () => {
    if (!selected) return;
    const updated = saveTrack({ ...selected, humanAuthorshipElements: count });
    setTracks(getTracks().filter(t => t.rightsStatus === 'COMMERCIAL'));
    setSelected(updated);
    setSaved(true);
    addLog(`Authorship registry updated for "${updated.title}": ${count} element(s) recorded.`, { entityType: 'track', entityId: updated.id, result: count >= 2 ? 'allowed' : 'info' });
  };

  const meetsGate = count >= 2;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Authorship Registry</h2>
        <p className="text-[var(--color-foreground-muted)] text-sm mt-1">
          Document human authorship elements. At least 2 are required before a track can leave S4.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {tracks.length === 0 ? (
            <p className="text-[var(--color-foreground-muted)] text-sm py-8 text-center">No COMMERCIAL tracks available.</p>
          ) : tracks.map(track => (
            <button
              key={track.id}
              onClick={() => handleSelect(track)}
              aria-pressed={selected?.id === track.id}
              aria-label={`Select track: ${track.title} (${track.humanAuthorshipElements} authorship elements)`}
              className={`w-full text-left p-4 rounded-lg border transition ${
                selected?.id === track.id
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                  : 'border-[var(--color-border-card)] bg-[var(--color-background-card)] hover:bg-[var(--color-background-card-hover)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                <span className={`text-xs font-bold ${track.humanAuthorshipElements >= 2 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {track.humanAuthorshipElements}/2
                </span>
              </div>
              <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{track.artist} · {track.currentStage}</p>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
              <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{selected.title}</h3>
              <p className="text-sm text-[var(--color-foreground-muted)]">
                Select the human authorship elements that apply to this track.
              </p>
              <fieldset>
                <legend className="text-sm text-[var(--color-foreground-muted)] mb-3">Authorship Elements</legend>
                <div className="space-y-2">
                  {MODULE5_ELEMENTS.map((el, i) => (
                    <label key={el} className="flex items-center gap-2 cursor-pointer hover:text-[var(--color-foreground)] text-[var(--color-foreground-muted)] text-sm">
                      <input
                        type="checkbox"
                        checked={i < count}
                        onChange={e => setCount(c => e.target.checked ? Math.min(c + 1, MODULE5_ELEMENTS.length) : Math.max(c - 1, 0))}
                        aria-label={el}
                        className="accent-[var(--color-primary)]"
                      />
                      {el}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className={`text-sm p-3 rounded-md border ${meetsGate ? 'text-green-400 border-green-400/20 bg-green-400/5' : 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5'}`} role="status" aria-live="polite">
                {meetsGate ? `✓ Gate S4→S5 satisfied (${count} element${count !== 1 ? 's' : ''})` : `⚠ Need ${2 - count} more element(s) to pass S4 gate`}
              </div>

              <button
                onClick={handleSave}
                aria-label="Save authorship registry for this track"
                className="w-full px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
              >
                Save Registry
              </button>
              {saved && <p role="status" className="text-green-400 text-xs text-center">Saved successfully.</p>}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--color-foreground-muted)] text-sm p-8">
              Select a track to edit its authorship registry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Module5AuthorshipRegistry;
