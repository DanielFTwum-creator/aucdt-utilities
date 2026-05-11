import React, { useState } from 'react';
import { getTracks, addTrack } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import { RIGHTS_STATUS_COLORS } from '../constants';
import type { Track, SourcePlatform, SourceAccountTier } from '../types';

const RightsBadge: React.FC<{ status: Track['rightsStatus'] }> = ({ status }) => (
  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${RIGHTS_STATUS_COLORS[status]}`}>
    {status.replace('_', '-')}
  </span>
);

const STAGE_COLORS: Record<string, string> = {
  S1: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  S2: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  S3: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  S4: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  S5: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const Module1Tracks: React.FC = () => {
  const [tracks, setTracks] = useState(() => getTracks());
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', artist: '', sourcePlatform: 'original' as SourcePlatform, sourceAccountTier: 'pro' as SourceAccountTier });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.artist.trim()) { setError('Title and artist are required.'); return; }
    const track = addTrack(form);
    setTracks(getTracks());
    addLog(`Track added: "${track.title}" [${track.rightsStatus}]`, { entityType: 'track', entityId: track.id, result: 'info' });
    setShowAdd(false);
    setForm({ title: '', artist: '', sourcePlatform: 'original', sourceAccountTier: 'pro' });
    setError('');
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Track Library</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mt-1">{tracks.length} tracks in catalogue</p>
        </div>
        <button
          onClick={() => setShowAdd(s => !s)}
          aria-expanded={showAdd}
          aria-label={showAdd ? 'Cancel adding track' : 'Add new track'}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition"
        >
          {showAdd ? 'Cancel' : '+ Add Track'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} aria-label="Add new track form" className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="track-title" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Title <span aria-hidden="true">*</span></label>
              <input id="track-title" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="track-artist" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Artist <span aria-hidden="true">*</span></label>
              <input id="track-artist" type="text" value={form.artist} onChange={e => setForm(f => ({ ...f, artist: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="track-platform" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Source Platform</label>
              <select id="track-platform" value={form.sourcePlatform} onChange={e => setForm(f => ({ ...f, sourcePlatform: e.target.value as SourcePlatform }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)]">
                <option value="original">Original</option>
                <option value="suno">Suno</option>
                <option value="udio">Udio</option>
                <option value="licensed">Licensed</option>
                <option value="sample">Sample</option>
              </select>
            </div>
            <div>
              <label htmlFor="track-tier" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Account Tier</label>
              <select id="track-tier" value={form.sourceAccountTier} onChange={e => setForm(f => ({ ...f, sourceAccountTier: e.target.value as SourceAccountTier }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)]">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
          <button type="submit" aria-label="Save new track" className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
            Save Track
          </button>
        </form>
      )}

      <div className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] overflow-hidden">
        <table className="w-full text-sm" aria-label="Track catalogue">
          <thead>
            <tr className="border-b border-[var(--color-border-card)] bg-[var(--color-background-card-hover)]">
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Title / Artist</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium hidden md:table-cell">Source</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Rights</th>
              <th scope="col" className="text-left px-4 py-3 text-xs text-[var(--color-foreground-muted)] font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(track => (
              <tr key={track.id} className="border-b border-[var(--color-border-card)] last:border-0 hover:bg-[var(--color-background-card-hover)] transition">
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--color-foreground)]">{track.title}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)]">{track.artist}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p className="text-[var(--color-foreground-muted)] capitalize">{track.sourcePlatform}</p>
                  <p className="text-xs text-[var(--color-foreground-muted)] capitalize">{track.sourceAccountTier}</p>
                </td>
                <td className="px-4 py-3"><RightsBadge status={track.rightsStatus} /></td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STAGE_COLORS[track.currentStage] || ''}`}>
                    {track.currentStage}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Module1Tracks;
