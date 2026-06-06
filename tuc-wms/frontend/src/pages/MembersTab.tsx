import React, { useEffect, useState, useCallback } from 'react';
import { api, post, del } from '../api'; // api: load members; post/del: add/remove
import { ProjectMember, ProjectRole, PROJECT_ROLES } from '../types';

/** FR-PROJ-006 — project members + per-project roles. OWNER may add/remove. */
export default function MembersTab({ projectId, archived }: { projectId: number; archived: boolean }) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectRole>('EDITOR');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api<ProjectMember[]>(`/api/projects/${projectId}/members`)
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);
  useEffect(load, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy(true); setError(null);
    try {
      await post(`/api/projects/${projectId}/members`, { email: email.trim(), projectRole: role });
      setEmail(''); load();
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (/no tuc-wms user|not found/i.test(msg)) {
        setError(`No WMS account for "${email.trim()}". Create them first on the Users page (Add a person), then add them here.`);
      } else if (/session expired|unauthor/i.test(msg)) {
        setError('Your session expired. Please reload the page and sign in again, then retry.');
      } else {
        setError(msg || 'Could not add member.');
      }
    }
    finally { setBusy(false); }
  };

  const remove = async (userId: number) => {
    setError(null);
    try {
      await del(`/api/projects/${projectId}/members/${userId}`);
      load();
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div>
      {!archived && (
        <form onSubmit={add} style={addRow}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
            placeholder="member@techbridge.edu.gh" style={{ ...input, flex: 1 }} />
          <select value={role} onChange={(e) => setRole(e.target.value as ProjectRole)} style={input}>
            {PROJECT_ROLES.map(r => <option key={r} value={r}>{cap(r)}</option>)}
          </select>
          <button type="submit" disabled={busy || !email.trim()} style={primaryBtn}>Add</button>
        </form>
      )}

      {error && <div style={errBox}>{error}</div>}

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading members…</p>
        : members.length === 0 ? <p style={{ color: 'var(--muted)' }}>No members yet.</p>
        : (
          <table style={table}>
            <thead>
              <tr><th style={th}>Member</th><th style={th}>Role</th><th style={th}></th></tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.userId} style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{m.name || m.email}</div>
                    {m.name && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.email}</div>}
                  </td>
                  <td style={td}><span style={roleBadge}>{cap(m.projectRole)}</span></td>
                  <td style={{ ...td, textAlign: 'right' }}>
                    {!archived && m.projectRole !== 'OWNER' && (
                      <button onClick={() => remove(m.userId)} style={removeBtn}>Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
}

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const addRow: React.CSSProperties = { display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' };
const input: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)' };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' };
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const td: React.CSSProperties = { padding: '12px 14px', fontSize: 14 };
const roleBadge: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'var(--tuc-maroon)', background: 'rgba(107,0,32,0.08)', borderRadius: 999, padding: '2px 10px' };
const removeBtn: React.CSSProperties = { background: 'none', border: '1px solid var(--border)', color: 'var(--danger)', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
