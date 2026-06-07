import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, put } from '../api';
import { WmsNotification } from '../types';

const POLL_MS = 30000; // FR-NOTIF-007: badge updates within 30s

/**
 * Nav notification bell with unread badge + dropdown panel (FR-NOTIF-002/003/006).
 * Polls the lightweight unread-count every 30s; fetches the list lazily when opened.
 * Accessible: aria-label, aria-live count, keyboard (Esc closes, Enter opens items).
 */
export default function NotificationBell() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<WmsNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refreshCount = useCallback(() => {
    api<{ count: number }>('/api/notifications/unread-count')
      .then(r => setCount(r.count)).catch(() => { /* transient — keep last */ });
  }, []);

  // Poll the badge.
  useEffect(() => {
    refreshCount();
    const t = setInterval(refreshCount, POLL_MS);
    return () => clearInterval(t);
  }, [refreshCount]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const openPanel = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setLoading(true);
      api<{ items: WmsNotification[]; unreadCount: number }>('/api/notifications?limit=8')
        .then(r => { setItems(r.items); setCount(r.unreadCount); })
        .catch(() => { /* ignore */ })
        .finally(() => setLoading(false));
    }
  };

  const openItem = async (n: WmsNotification) => {
    setOpen(false);
    if (!n.read) {
      try { await put(`/api/notifications/${n.id}/read`); } catch { /* ignore */ }
      setCount(c => Math.max(0, c - 1));
    }
    if (n.projectId) navigate(`/projects/${n.projectId}${n.taskId ? `?task=${n.taskId}` : ''}`);
  };

  const markAll = async () => {
    try { await put('/api/notifications/read-all'); } catch { /* ignore */ }
    setCount(0); setItems(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={openPanel} style={bellBtn}
        aria-label={count > 0 ? `Notifications, ${count} unread` : 'Notifications'}
        aria-haspopup="true" aria-expanded={open}>
        <span aria-hidden="true" style={{ fontSize: 18 }}>🔔</span>
        {count > 0 && <span style={badge} aria-hidden="true">{count > 99 ? '99+' : count}</span>}
        <span aria-live="polite" style={srOnly}>{count} unread notifications</span>
      </button>

      {open && (
        <div role="menu" aria-label="Notifications" style={panel}>
          <div style={panelHead}>
            <strong style={{ fontSize: 13 }}>Notifications</strong>
            {count > 0 && <button onClick={markAll} style={markAllBtn}>Mark all read</button>}
          </div>
          {loading ? <div style={emptyRow}>Loading…</div>
            : items.length === 0 ? <div style={emptyRow}>You’re all caught up.</div>
            : items.map(n => (
              <button key={n.id} role="menuitem" onClick={() => openItem(n)}
                style={{ ...itemRow, background: n.read ? 'transparent' : 'rgba(245,168,0,0.08)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  {!n.read && <span aria-hidden="true" style={dot} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{n.title}</div>
                    {n.body && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{n.body}</div>}
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{relTime(n.createdAt)}</div>
                  </div>
                </div>
              </button>
            ))}
          <button onClick={() => { setOpen(false); navigate('/inbox'); }} style={seeAll}>See all notifications →</button>
        </div>
      )}
    </div>
  );
}

function relTime(iso: string): string {
  const d = new Date(iso).getTime();
  const s = Math.floor((Date.now() - d) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const bellBtn: React.CSSProperties = { position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', lineHeight: 1, display: 'flex', alignItems: 'center' };
const badge: React.CSSProperties = { position: 'absolute', top: -2, right: -2, background: 'var(--tuc-maroon)', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 16, height: 16, padding: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const srOnly: React.CSSProperties = { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 };
const panel: React.CSSProperties = { position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 320, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, boxShadow: '0 8px 30px rgba(28,22,18,0.18)', zIndex: 50, overflow: 'hidden' };
const panelHead: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid var(--border)' };
const markAllBtn: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--tuc-maroon)', fontSize: 12, cursor: 'pointer', fontWeight: 600 };
const itemRow: React.CSSProperties = { display: 'block', width: '100%', textAlign: 'left', border: 'none', borderBottom: '1px solid var(--border)', padding: '10px 14px', cursor: 'pointer', font: 'inherit' };
const dot: React.CSSProperties = { width: 7, height: 7, borderRadius: 999, background: 'var(--tuc-gold)', marginTop: 5, flexShrink: 0 };
const emptyRow: React.CSSProperties = { padding: '20px 14px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 };
const seeAll: React.CSSProperties = { display: 'block', width: '100%', textAlign: 'center', background: 'var(--bg)', border: 'none', padding: '10px', fontSize: 12, color: 'var(--tuc-maroon)', cursor: 'pointer', fontWeight: 600 };
