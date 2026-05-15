import React, { useState, useEffect } from 'react';
import { LibraryEntry, AnalysisType } from '../types';
import { getLibrary, deleteFromLibrary, appendAuditLog } from '../utils/storage';
import { TrashIcon, CopyIcon } from './icons';
import JsonDisplay from './JsonDisplay';

const TYPE_LABELS: Record<AnalysisType, { label: string; colour: string; bg: string }> = {
  full_analysis: { label: 'Full Analysis', colour: 'text-amber-300', bg: 'bg-amber-900/30 border-amber-700/40' },
  generation_brief: { label: 'Creative Brief', colour: 'text-teal-300', bg: 'bg-teal-900/30 border-teal-700/40' },
  comparison: { label: 'Comparison', colour: 'text-purple-300', bg: 'bg-purple-900/30 border-purple-700/40' },
  quick_analysis: { label: 'Quick Analysis', colour: 'text-cyan-300', bg: 'bg-cyan-900/30 border-cyan-700/40' },
};

const LibraryTab: React.FC = () => {
  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [filter, setFilter] = useState<AnalysisType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => setEntries(getLibrary());

  useEffect(() => { load(); }, []);

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    deleteFromLibrary(id);
    appendAuditLog('DELETE_ENTRY', title);
    load();
    if (expanded === id) setExpanded(null);
  };

  const filtered = entries.filter(e => {
    if (filter !== 'all' && e.type !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        (e.cultural_origin || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-amber-300 mb-2">Library</h2>
        <p className="text-purple-300 text-sm">All saved analyses and briefs — searchable Afrofuturism archive</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or cultural origin..."
          className="flex-1 bg-black/40 border border-purple-700/50 rounded-xl px-4 py-2.5 text-sm text-purple-100 placeholder-purple-600 focus:outline-none focus:border-amber-500/70 transition-colors"
        />
        <div className="flex gap-2 flex-wrap">
          {(['all', 'full_analysis', 'generation_brief', 'comparison', 'quick_analysis'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${
                filter === f
                  ? 'bg-amber-600 text-black border-amber-500'
                  : 'border-purple-700/40 text-purple-400 hover:text-purple-200 hover:border-purple-500'
              }`}
            >
              {f === 'all' ? 'All' : TYPE_LABELS[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-purple-500">{filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}</p>

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-purple-800/30 bg-purple-950/10 p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-purple-300 font-medium">No entries yet</p>
          <p className="text-purple-500 text-sm mt-1">Run an analysis or generate a brief to build your library</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(entry => {
            const typeInfo = TYPE_LABELS[entry.type];
            const isOpen = expanded === entry.id;
            return (
              <div key={entry.id} className="rounded-xl border border-purple-800/30 bg-black/30 overflow-hidden">
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-purple-900/10 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                >
                  <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 font-medium ${typeInfo.bg} ${typeInfo.colour}`}>
                    {typeInfo.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-purple-100 truncate">{entry.title}</p>
                    {entry.cultural_origin && (
                      <p className="text-xs text-purple-400 mt-0.5">{entry.cultural_origin}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-xs text-purple-500">{new Date(entry.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    <button
                      onClick={ev => { ev.stopPropagation(); handleDelete(entry.id, entry.title); }}
                      aria-label={`Delete ${entry.title}`}
                      className="p-1.5 text-purple-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/20"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <span className={`text-purple-500 transition-transform text-xs ${isOpen ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </div>
                {isOpen && (
                  <div className="px-5 pb-5 border-t border-purple-800/20">
                    <div className="mt-4">
                      <JsonDisplay data={entry.data} title={`${typeInfo.label} — ${entry.title}`} defaultCollapsed={false} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LibraryTab;
