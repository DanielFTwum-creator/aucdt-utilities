import React, { useEffect, useState } from 'react';
import { api, post } from '../api';
import { useAuth } from '../auth/AuthContext';

interface ProjectSummary {
  id: number; name: string; ownerId: number; dueDate: string | null;
  memberCount: number; visibility: string; archived: boolean;
}

const CAN_CREATE = ['LECTURER', 'ADMIN_STAFF', 'HOD', 'SYSTEM_ADMIN'];

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');

  const load = () => {
    setLoading(true);
    api<ProjectSummary[]>('/api/projects')
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await post('/api/projects', { name: newName.trim() });
      setNewName(''); setCreating(false); load();
    } catch (err: any) { setError(err.message); }
  };

  const canCreate = user && CAN_CREATE.includes(user.role);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>Projects</h1>
        {canCreate && (
          <button onClick={() => setCreating(v => !v)} style={primaryBtn}>+ New Project</button>
        )}
      </div>

      {creating && (
        <form onSubmit={create} style={createRow}>
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Project name" autoFocus style={input} />
          <button type="submit" style={primaryBtn}>Create</button>
          <button type="button" onClick={() => setCreating(false)} style={ghostBtn}>Cancel</button>
        </form>
      )}

      {error && <div style={errBox}>{error}</div>}
      {loading ? <p style={{ color: 'var(--muted)' }}>Loading projects…</p>
        : projects.length === 0 ? <EmptyState canCreate={!!canCreate} />
        : (
          <div style={grid}>
            {projects.map(p => (
              <div key={p.id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <strong style={{ fontSize: 15 }}>{p.name}</strong>
                  <span style={visBadge}>{p.visibility}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  {p.memberCount} member{p.memberCount === 1 ? '' : 's'}
                  {p.dueDate ? ` · due ${p.dueDate}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function EmptyState({ canCreate }: { canCreate: boolean }) {
  return (
    <div style={{ border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
      <p style={{ margin: 0 }}>No projects yet.</p>
      {canCreate && <p style={{ fontSize: 13, marginTop: 6 }}>Create your first project to get started.</p>}
    </div>
  );
}

const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 };
const cardStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, boxShadow: '0 1px 3px rgba(28,22,18,0.05)' };
const visBadge: React.CSSProperties = { fontSize: 10, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '2px 8px', alignSelf: 'flex-start' };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' };
const createRow: React.CSSProperties = { display: 'flex', gap: 10, marginBottom: 20 };
const input: React.CSSProperties = { flex: 1, maxWidth: 360, padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14 };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
