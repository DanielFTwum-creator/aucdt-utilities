import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, post } from '../api';
import { useAuth } from '../auth/AuthContext';
import {
  ProjectSummary, CreateProjectBody, Visibility, VISIBILITIES, CAN_CREATE_PROJECT,
} from '../types';

export default function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const load = () => {
    setLoading(true);
    api<ProjectSummary[]>('/api/projects')
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const canCreate = !!user && CAN_CREATE_PROJECT.includes(user.role);

  return (
    <div>
      <div style={headerRow}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Projects</h1>
        {canCreate && (
          <button onClick={() => setCreating(v => !v)} style={primaryBtn}>
            {creating ? 'Close' : '+ New Project'}
          </button>
        )}
      </div>

      {creating && (
        <NewProjectForm
          onCancel={() => setCreating(false)}
          onCreated={() => { setCreating(false); load(); }}
          onError={setError}
        />
      )}

      {error && <div style={errBox}>{error}</div>}

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading projects…</p>
        : projects.length === 0 ? <EmptyState canCreate={canCreate} />
        : (
          <div style={grid}>
            {projects.map(p => (
              <button key={p.id} onClick={() => navigate(`/projects/${p.id}`)} style={cardBtn}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: 15, color: 'var(--text)' }}>{p.name}</strong>
                  <span style={visBadge}>{p.visibility}{p.archived ? ' · archived' : ''}</span>
                </div>
                {typeof p.percentComplete === 'number' && (
                  <div style={{ marginTop: 10 }}>
                    <div style={progressTrack}><div style={{ ...progressFill, width: `${p.percentComplete}%` }} /></div>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.percentComplete}% complete</span>
                  </div>
                )}
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  {p.memberCount} member{p.memberCount === 1 ? '' : 's'}
                  {p.dueDate ? ` · due ${p.dueDate}` : ''}
                </div>
              </button>
            ))}
          </div>
        )}
    </div>
  );
}

function NewProjectForm({ onCancel, onCreated, onError }: {
  onCancel: () => void; onCreated: () => void; onError: (m: string) => void;
}) {
  const [body, setBody] = useState<CreateProjectBody>({ name: '', visibility: 'DEPARTMENT' });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: keyof CreateProjectBody) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setBody(b => ({ ...b, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.name.trim()) return;
    setSubmitting(true);
    try {
      // Drop empties so the backend applies its defaults (e.g. default stages).
      const payload: CreateProjectBody = { name: body.name.trim() };
      if (body.description?.trim()) payload.description = body.description.trim();
      if (body.department?.trim()) payload.department = body.department.trim();
      if (body.startDate) payload.startDate = body.startDate;
      if (body.endDate) payload.endDate = body.endDate;
      if (body.visibility) payload.visibility = body.visibility;
      await post('/api/projects', payload);
      onCreated();
    } catch (err: any) { onError(err.message); }
    finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={submit} style={formCard}>
      <label style={lbl}>Name<span style={req}>*</span>
        <input value={body.name} onChange={set('name')} placeholder="e.g. Semester 2 Capstone" autoFocus style={input} />
      </label>
      <label style={lbl}>Description
        <textarea value={body.description ?? ''} onChange={set('description')} rows={3} style={{ ...input, resize: 'vertical' }} />
      </label>
      <div style={formGrid}>
        <label style={lbl}>Department
          <input value={body.department ?? ''} onChange={set('department')} placeholder="e.g. Computer Science" style={input} />
        </label>
        <label style={lbl}>Visibility
          <select value={body.visibility} onChange={set('visibility')} style={input}>
            {VISIBILITIES.map(v => <option key={v} value={v}>{label(v)}</option>)}
          </select>
        </label>
        <label style={lbl}>Start date
          <input type="date" value={body.startDate ?? ''} onChange={set('startDate')} style={input} />
        </label>
        <label style={lbl}>End date
          <input type="date" value={body.endDate ?? ''} onChange={set('endDate')} style={input} />
        </label>
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: -4 }}>
        Default stages (To Do · In Progress · Review · Done) are created automatically; you can customise them in project settings.
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        <button type="submit" disabled={submitting || !body.name.trim()} style={primaryBtn}>
          {submitting ? 'Creating…' : 'Create project'}
        </button>
        <button type="button" onClick={onCancel} style={ghostBtn}>Cancel</button>
      </div>
    </form>
  );
}

function EmptyState({ canCreate }: { canCreate: boolean }) {
  return (
    <div style={emptyBox}>
      <p style={{ margin: 0 }}>No projects yet.</p>
      {canCreate
        ? <p style={{ fontSize: 13, marginTop: 6 }}>Create your first project to get started.</p>
        : <p style={{ fontSize: 13, marginTop: 6 }}>Projects you’re a member of will appear here.</p>}
    </div>
  );
}

const label = (v: Visibility) =>
  v === 'PUBLIC' ? 'Public (all TUC)' : v === 'DEPARTMENT' ? 'Department only' : v === 'MEMBERS' ? 'Members only' : 'Private';

const headerRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 };
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 };
const cardBtn: React.CSSProperties = { textAlign: 'left', cursor: 'pointer', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(28,22,18,0.05)', font: 'inherit', color: 'inherit' };
const visBadge: React.CSSProperties = { fontSize: 10, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '2px 8px', whiteSpace: 'nowrap' };
const progressTrack: React.CSSProperties = { height: 6, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' };
const progressFill: React.CSSProperties = { height: '100%', background: 'var(--tuc-gold)', borderRadius: 999 };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' };
const formCard: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 };
const formGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 };
const lbl: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5, fontSize: 12, fontWeight: 600, color: 'var(--muted)' };
const req: React.CSSProperties = { color: 'var(--danger)', marginLeft: 2 };
const input: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)' };
const emptyBox: React.CSSProperties = { border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
