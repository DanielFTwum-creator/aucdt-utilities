import React, { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { api, put, post } from '../api';
import { useAuth } from '../auth/AuthContext';
import { toTucEmail } from '../brand';
import UsernameInput from '../components/UsernameInput';

/**
 * SystemAdmin user management (FR-AUTH-004). Backend AdminUserController is gated to
 * ROLE_SYSTEM_ADMIN. List users, change role, activate/deactivate. Guards against the
 * signed-in admin demoting or deactivating their own account (lockout protection).
 */
interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

const ROLES = ['STUDENT', 'LECTURER', 'ADMIN_STAFF', 'HOD', 'SYSTEM_ADMIN'];
const MFA_ROLES = ['HOD', 'SYSTEM_ADMIN'];

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  // Pre-provision (create user before first login) — username only; domain auto-appended.
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('STUDENT');
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api<AdminUser[]>('/api/admin/users')
      .then(setUsers).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { if (user?.role === 'SYSTEM_ADMIN') load(); }, [load, user]);

  // Defence in depth — the API is the real gate, but don't render admin UI to non-admins.
  if (user && user.role !== 'SYSTEM_ADMIN') return <Navigate to="/" replace />;

  const isSelf = (u: AdminUser) => u.email.toLowerCase() === user?.email.toLowerCase();

  const changeRole = async (u: AdminUser, role: string) => {
    if (role === u.role) return;
    if (isSelf(u) && u.role === 'SYSTEM_ADMIN' && role !== 'SYSTEM_ADMIN') {
      setError('You cannot remove your own SystemAdmin role.'); return;
    }
    setBusyId(u.id); setError(null);
    try { await put(`/api/admin/users/${u.id}/role`, { role }); await load(); }
    catch (e: any) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const toggleActive = async (u: AdminUser) => {
    if (isSelf(u)) { setError('You cannot deactivate your own account.'); return; }
    setBusyId(u.id); setError(null);
    try { await put(`/api/admin/users/${u.id}/active`, { active: !u.active }); await load(); }
    catch (e: any) { setError(e.message); }
    finally { setBusyId(null); }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = toTucEmail(newUsername);
    if (!email) return;
    setCreating(true); setError(null); setNotice(null);
    try {
      const created = await post<AdminUser>('/api/admin/users', {
        email, name: newName.trim(), role: newRole,
      });
      setNewUsername(''); setNewName(''); setNewRole('STUDENT');
      const mfaNote = MFA_ROLES.includes(created.role) ? ' They will enrol MFA on first login.' : '';
      setNotice(`Created ${created.email} as ${labelRole(created.role)}. They can be added to projects now; the account activates fully when they first sign in with Google.${mfaNote}`);
      await load();
    } catch (e: any) { setError(e.message); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: '0 0 6px' }}>User Management</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0 }}>
        Assign roles and control access (FR-AUTH-004). HOD and SystemAdmin require MFA enrolment at next login.
      </p>

      <form onSubmit={createUser} style={createCard}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Add a person</div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: -4 }}>
          Pre-provision a colleague before they log in, so you can assign them to projects right away.
          Their account completes when they first sign in with Google.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <UsernameInput value={newUsername} onChange={setNewUsername}
            placeholder="username" style={{ flex: 2, minWidth: 220 }} />
          <input value={newName} onChange={(e) => setNewName(e.target.value)}
            placeholder="Full name (optional)" style={{ ...inp, flex: 1, minWidth: 140 }} />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)} style={inp}>
            {ROLES.map(r => <option key={r} value={r}>{labelRole(r)}{MFA_ROLES.includes(r) ? ' (MFA)' : ''}</option>)}
          </select>
          <button type="submit" disabled={creating || !newUsername.trim()} style={addBtn}>
            {creating ? 'Adding…' : 'Add user'}
          </button>
        </div>
      </form>

      {notice && <div style={noticeBox}>{notice}</div>}
      {error && <div style={errBox}>{error}</div>}

      {loading ? <p style={{ color: 'var(--muted)' }}>Loading users…</p> : (
        <table style={table}>
          <thead>
            <tr><th style={th}>User</th><th style={th}>Role</th><th style={th}>Status</th><th style={th}></th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)', opacity: u.active ? 1 : 0.55 }}>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{u.name || u.email}{isSelf(u) && <span style={youBadge}>you</span>}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{u.email}</div>
                </td>
                <td style={td}>
                  <select value={u.role} disabled={busyId === u.id} onChange={(e) => changeRole(u, e.target.value)} style={sel}>
                    {ROLES.map(r => <option key={r} value={r}>{labelRole(r)}{MFA_ROLES.includes(r) ? ' (MFA)' : ''}</option>)}
                  </select>
                </td>
                <td style={td}>
                  <span style={u.active ? activeBadge : inactiveBadge}>{u.active ? 'Active' : 'Deactivated'}</span>
                </td>
                <td style={{ ...td, textAlign: 'right' }}>
                  <button onClick={() => toggleActive(u)} disabled={busyId === u.id || isSelf(u)}
                    title={isSelf(u) ? 'You cannot deactivate yourself' : ''}
                    style={u.active ? deactivateBtn : reactivateBtn}>
                    {u.active ? 'Deactivate' : 'Reactivate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const labelRole = (r: string) => r.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' };
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 14px', fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 };
const td: React.CSSProperties = { padding: '12px 14px', fontSize: 14, verticalAlign: 'middle' };
const sel: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--card)', color: 'var(--text)' };
const youBadge: React.CSSProperties = { marginLeft: 8, fontSize: 10, fontWeight: 700, color: 'var(--tuc-maroon)', background: 'rgba(107,0,32,0.08)', borderRadius: 999, padding: '1px 7px' };
const activeBadge: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: '#1c7c3f', background: 'rgba(28,124,63,0.1)', borderRadius: 999, padding: '2px 10px' };
const inactiveBadge: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: 'var(--danger)', background: 'rgba(192,57,43,0.1)', borderRadius: 999, padding: '2px 10px' };
const deactivateBtn: React.CSSProperties = { background: 'none', border: '1px solid var(--border)', color: 'var(--danger)', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' };
const reactivateBtn: React.CSSProperties = { background: 'none', border: '1px solid var(--border)', color: '#1c7c3f', borderRadius: 8, padding: '6px 12px', fontSize: 12, cursor: 'pointer' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
const noticeBox: React.CSSProperties = { background: 'rgba(28,124,63,0.08)', color: '#1c7c3f', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
const createCard: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 };
const inp: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)' };
const addBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
