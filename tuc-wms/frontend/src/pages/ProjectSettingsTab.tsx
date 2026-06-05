import React, { useState } from 'react';
import { put } from '../api';
import { ProjectDetail, Visibility, VISIBILITIES } from '../types';

/**
 * Project settings — visibility (FR-PROJ-005) and workflow stages (FR-PROJ-002).
 * Stages are editable here; reordering/renaming them drives the Kanban columns.
 */
export default function ProjectSettingsTab({ project, onChanged }: {
  project: ProjectDetail; onChanged: () => void;
}) {
  const [visibility, setVisibility] = useState<Visibility>(project.visibility);
  const [stages, setStages] = useState<string[]>(project.stages?.length ? project.stages : []);
  const [newStage, setNewStage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = visibility !== project.visibility ||
    JSON.stringify(stages) !== JSON.stringify(project.stages);

  const addStage = () => {
    const s = newStage.trim();
    if (s && !stages.includes(s)) { setStages([...stages, s]); setNewStage(''); }
  };
  const removeStage = (s: string) => setStages(stages.filter(x => x !== s));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= stages.length) return;
    const next = [...stages];
    [next[i], next[j]] = [next[j], next[i]];
    setStages(next);
  };

  const save = async () => {
    setSaving(true); setError(null); setSaved(false);
    try {
      await put(`/api/projects/${project.id}`, { visibility, stages });
      setSaved(true); onChanged();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  if (project.archived) {
    return <p style={{ color: 'var(--muted)' }}>This project is archived (read-only). Unarchive it to edit settings.</p>;
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <section style={card}>
        <h3 style={h3}>Visibility</h3>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value as Visibility)} style={input}>
          {VISIBILITIES.map(v => <option key={v} value={v}>{visLabel(v)}</option>)}
        </select>
      </section>

      <section style={card}>
        <h3 style={h3}>Workflow stages</h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 0 }}>
          These become the columns on the Kanban board. Order matters.
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stages.map((s, i) => (
            <li key={s} style={stageRow}>
              <span style={{ flex: 1, fontSize: 14 }}>{s}</span>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={iconBtn} title="Move up">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === stages.length - 1} style={iconBtn} title="Move down">↓</button>
              <button onClick={() => removeStage(s)} style={{ ...iconBtn, color: 'var(--danger)' }} title="Remove">✕</button>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newStage} onChange={(e) => setNewStage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addStage(); } }}
            placeholder="New stage name" style={{ ...input, flex: 1 }} />
          <button onClick={addStage} style={ghostBtn}>Add stage</button>
        </div>
      </section>

      {error && <div style={errBox}>{error}</div>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={save} disabled={!dirty || saving || stages.length === 0} style={primaryBtn}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && !dirty && <span style={{ fontSize: 13, color: 'var(--muted)' }}>Saved ✓</span>}
      </div>
    </div>
  );
}

const visLabel = (v: Visibility) =>
  v === 'PUBLIC' ? 'Public (all TUC)' : v === 'DEPARTMENT' ? 'Department only' : v === 'MEMBERS' ? 'Members only' : 'Private';

const card: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16 };
const h3: React.CSSProperties = { margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--text)' };
const input: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)' };
const stageRow: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', borderRadius: 8, padding: '6px 10px' };
const iconBtn: React.CSSProperties = { background: 'none', border: '1px solid var(--border)', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', color: 'var(--muted)', fontSize: 12 };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
