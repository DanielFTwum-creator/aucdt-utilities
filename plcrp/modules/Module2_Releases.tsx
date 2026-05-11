import React, { useState } from 'react';
import { getTracks } from '../services/trackService';
import { addLog } from '../services/auditLogService';
import type { Release } from '../types';

const RELEASES_KEY = 'plcrp-releases';

const getReleases = (): Release[] => {
  try { return JSON.parse(localStorage.getItem(RELEASES_KEY) || '[]'); } catch { return []; }
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
  ready: 'text-[#C8A84B] border-[#C8A84B]/30 bg-[#C8A84B]/10',
  submitted: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  live: 'text-green-400 border-green-400/30 bg-green-400/10',
};

const Module2Releases: React.FC = () => {
  const [releases, setReleases] = useState(getReleases);
  const tracks = getTracks();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', distributor: '', trackIds: [] as string[] });
  const [error, setError] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (form.trackIds.length === 0) { setError('Select at least one track.'); return; }
    const nonCommercial = form.trackIds.some(id => {
      const t = tracks.find(t => t.id === id);
      return t?.rightsStatus === 'NON_COMMERCIAL';
    });
    if (nonCommercial) {
      setError('Cannot include NON_COMMERCIAL tracks in a release.');
      addLog(`Release creation blocked — NON_COMMERCIAL track included.`, { entityType: 'release', result: 'denied' });
      return;
    }
    const release: Release = {
      id: `rel-${Date.now()}`,
      title: form.title,
      trackIds: form.trackIds,
      distributor: form.distributor || 'TBD',
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    const updated = [...releases, release];
    localStorage.setItem(RELEASES_KEY, JSON.stringify(updated));
    setReleases(updated);
    addLog(`Release created: "${release.title}" with ${release.trackIds.length} track(s)`, { entityType: 'release', entityId: release.id, result: 'allowed' });
    setShowAdd(false);
    setForm({ title: '', distributor: '', trackIds: [] });
    setError('');
  };

  const toggleTrack = (id: string) => {
    setForm(f => ({ ...f, trackIds: f.trackIds.includes(id) ? f.trackIds.filter(t => t !== id) : [...f.trackIds, id] }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] font-playfair">Release Manager</h2>
          <p className="text-[var(--color-foreground-muted)] text-sm mt-1">{releases.length} releases</p>
        </div>
        <button onClick={() => setShowAdd(s => !s)} aria-expanded={showAdd} aria-label={showAdd ? 'Cancel' : 'Create new release'}
          className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
          {showAdd ? 'Cancel' : '+ New Release'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} aria-label="Create release form" className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rel-title" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Release Title *</label>
              <input id="rel-title" type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} aria-required="true"
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
            <div>
              <label htmlFor="rel-dist" className="block text-sm text-[var(--color-foreground-muted)] mb-1">Distributor</label>
              <input id="rel-dist" type="text" value={form.distributor} onChange={e => setForm(f => ({ ...f, distributor: e.target.value }))}
                className="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-sm text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          <fieldset>
            <legend className="text-sm text-[var(--color-foreground-muted)] mb-2">Select Tracks</legend>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {tracks.map(t => (
                <label key={t.id} className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-[var(--color-background-card-hover)] ${t.rightsStatus === 'NON_COMMERCIAL' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input type="checkbox" checked={form.trackIds.includes(t.id)} onChange={() => t.rightsStatus !== 'NON_COMMERCIAL' && toggleTrack(t.id)}
                    disabled={t.rightsStatus === 'NON_COMMERCIAL'} aria-label={`Include track: ${t.title}`}
                    className="accent-[var(--color-primary)]" />
                  <span className="text-sm text-[var(--color-foreground)]">{t.title}</span>
                  {t.rightsStatus === 'NON_COMMERCIAL' && <span className="text-[10px] text-red-400 ml-auto">NON_COMMERCIAL — blocked</span>}
                </label>
              ))}
            </div>
          </fieldset>
          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
          <button type="submit" aria-label="Create release" className="px-4 py-2 rounded-md text-sm font-semibold bg-[var(--color-primary)] text-[var(--color-foreground-on-primary)] hover:bg-[var(--color-primary-hover)] transition">
            Create Release
          </button>
        </form>
      )}

      {releases.length === 0 ? (
        <div className="text-center text-[var(--color-foreground-muted)] py-16 text-sm">No releases yet. Create your first release above.</div>
      ) : (
        <div className="grid gap-4">
          {releases.map(rel => (
            <div key={rel.id} className="bg-[var(--color-background-card)] rounded-lg border border-[var(--color-border-card)] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--color-foreground)] font-playfair">{rel.title}</h3>
                  <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">{rel.distributor} · {rel.trackIds.length} track(s)</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[rel.status]}`}>{rel.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Module2Releases;
