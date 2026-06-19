import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { TUC_LOGO } from '../brand';
import NotificationBell from './NotificationBell';
import { api } from '../api';

/** Authenticated shell: TUC header, nav, user badge, sign-out, and global search (FR-TASK-009). */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search query fetching
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const handler = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api<any[]>(`/api/tasks/search?q=${encodeURIComponent(query)}`);
        setResults(res);
      } catch (e) {
        console.error(e);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <style>{`
        .search-item { transition: background 0.15s; padding: 8px 12px; borderRadius: 8px; cursor: pointer; display: flex; flex-direction: column; gap: 2px; }
        .search-item:hover { background: var(--bg); }
      `}</style>
      <header style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 8 }}>
            <img src={TUC_LOGO} alt="Techbridge University College" width={34} height={34}
              style={{ borderRadius: '50%', display: 'block' }} />
            <strong style={{ color: 'var(--tuc-maroon)', whiteSpace: 'nowrap' }}>WMS</strong>
          </Link>
          <nav style={{ display: 'flex', gap: 14, marginRight: 20 }}>
            <Link to="/" style={navLink}>Projects</Link>
            {user?.role === 'SYSTEM_ADMIN' && <Link to="/admin/users" style={navLink}>Users</Link>}
          </nav>

          {/* Global Search Bar (FR-TASK-009) */}
          <div ref={dropdownRef} style={searchContainer}>
            <input
              type="text"
              placeholder="Search tasks everywhere…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              style={searchInput}
            />
            {showDropdown && query.trim().length >= 2 && (
              <div style={dropdown}>
                {searching ? (
                  <div style={dropdownInfo}>Searching…</div>
                ) : results.length === 0 ? (
                  <div style={dropdownInfo}>No tasks found</div>
                ) : (
                  results.map(r => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setShowDropdown(false);
                        setQuery('');
                        navigate(`/projects/${r.projectId}?task=${r.id}`);
                        // Force refresh parameters if already on the destination project details page
                        if (window.location.pathname.startsWith(`/projects/${r.projectId}`)) {
                          window.location.search = `?task=${r.id}`;
                        }
                      }}
                      className="search-item"
                    >
                      <div style={itemTitle}>{r.title}</div>
                      <div style={itemMeta}>
                        {r.projectName} · {r.status} · <span style={{ textTransform: 'lowercase' }}>{r.priority}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <NotificationBell />
          {user && (
            <span style={{ fontSize: 13, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
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

const navLink: React.CSSProperties = { fontSize: 13, color: 'var(--muted)', textDecoration: 'none', fontWeight: 600 };

const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'var(--card)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 10 };
const roleBadge: React.CSSProperties = { background: 'rgba(107,0,32,0.08)', color: 'var(--tuc-maroon)', borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 600 };
const signOut: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };

// Search layout styling
const searchContainer: React.CSSProperties = { position: 'relative', width: 'min(320px, 100%)', display: 'flex', flexDirection: 'column' };
const searchInput: React.CSSProperties = { padding: '8px 12px 8px 30px', border: '1px solid var(--border)', borderRadius: 20, fontSize: 13, background: 'var(--bg) url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'14\' height=\'14\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b6358\' stroke-width=\'2.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'%3E%3C/circle%3E%3Cline x1=\'21\' y1=\'21\' x2=\'16.65\' y2=\'16.65\'%3E%3C/line%3E%3C/svg%3E") no-repeat 10px center', color: 'var(--text)', outline: 'none', width: '100%', transition: 'border-color 0.2s' };
const dropdown: React.CSSProperties = { position: 'absolute', top: '105%', left: 0, right: 0, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, maxHeight: 280, overflowY: 'auto', boxShadow: '0 8px 24px rgba(28,22,18,0.12)', zIndex: 1000, display: 'flex', flexDirection: 'column', padding: 6 };
const dropdownInfo: React.CSSProperties = { padding: '12px 16px', fontSize: 13, color: 'var(--muted)', textAlign: 'center' };
const itemTitle: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const itemMeta: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
