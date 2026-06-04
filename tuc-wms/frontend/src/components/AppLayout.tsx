import React from 'react';
import { useAuth } from '../auth/AuthContext';

/** Authenticated shell: TUC header, user badge, sign-out. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div>
      <header style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--tuc-gold)', fontWeight: 800, fontSize: 11, letterSpacing: 2 }}>TUC</span>
          <strong style={{ color: 'var(--tuc-maroon)' }}>Work Management System</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {user && (
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>
              {user.name} · <span style={roleBadge}>{user.role}</span>
            </span>
          )}
          <button onClick={() => logout()} style={signOut}>Sign Out</button>
        </div>
      </header>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>{children}</main>
    </div>
  );
}

const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'var(--card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 };
const roleBadge: React.CSSProperties = { background: 'rgba(107,0,32,0.08)', color: 'var(--tuc-maroon)', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
const signOut: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
