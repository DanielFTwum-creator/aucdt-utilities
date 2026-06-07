import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, put } from '../api';
import { WmsNotification } from '../types';
import KanbanLoader from '../components/KanbanLoader';

/** Full inbox (FR-NOTIF-002/003): own notifications, reverse-chronological, mark read. */
export default function InboxPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<WmsNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    api<{ items: WmsNotification[]; unreadCount: number }>('/api/notifications?limit=100')
      .then(r => { setItems(r.items); setUnread(r.unreadCount); })
      .finally(() => setLoading(false));
  }, []);
  useEffect(load, [load]);

  const open = async (n: WmsNotification) => {
    if (!n.read) { try { await put(`/api/notifications/${n.id}/read`); } catch { /* ignore */ } }
    if (n.projectId) navigate(`/projects/${n.projectId}${n.taskId ? `?task=${n.taskId}` : ''}`);
    else load();
  };

  const markAll = async () => {
    try { await put('/api/notifications/read-all'); } catch { /* ignore */ }
    load();
  };

  if (loading) return <KanbanLoader label="Loading notifications…" />;

  return (
    <div>
      <div style={headerRow}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', margin: 0 }}>
          Inbox {unread > 0 && <span style={countPill}>{unread} unread</span>}
        </h1>
        {unread > 0 && <button onClick={markAll} style={ghostBtn}>Mark all read</button>}
      </div>

      {items.length === 0 ? (
        <div style={emptyBox}>
          <p style={{ margin: 0, fontWeight: 600 }}>You’re all caught up.</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Notifications about tasks assigned to you appear here.</p>
        </div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(n => (
            <li key={n.id}>
              <button onClick={() => open(n)}
                style={{ ...row, background: n.read ? 'var(--card)' : 'rgba(245,168,0,0.06)' }}>
                {!n.read && <span aria-hidden="true" style={dot} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{n.title}</div>
                  {n.body && <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{n.body}</div>}
                </div>
                <span style={{ fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{relTime(n.createdAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function relTime(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

const headerRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 };
const countPill: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--tuc-maroon)', background: 'rgba(107,0,32,0.08)', borderRadius: 999, padding: '2px 10px', marginLeft: 10, verticalAlign: 'middle' };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', font: 'inherit' };
const dot: React.CSSProperties = { width: 8, height: 8, borderRadius: 999, background: 'var(--tuc-gold)', flexShrink: 0 };
const emptyBox: React.CSSProperties = { border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' };
