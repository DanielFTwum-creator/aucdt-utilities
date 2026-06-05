import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { TaskDto, ProjectMember, Priority } from '../types';
import TaskModal from '../components/TaskModal';

/**
 * Interim task list for a project (slice 2). The full Kanban board (slice 3) will
 * replace this as the default Board view; this proves task create/edit/delete and
 * the Tiptap description editor end-to-end in the meantime.
 */
export default function TasksTab({ projectId, stages, archived }: {
  projectId: number; stages: string[]; archived: boolean;
}) {
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ open: boolean; task?: TaskDto | null }>({ open: false });

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      api<TaskDto[]>(`/api/projects/${projectId}/tasks`),
      api<ProjectMember[]>(`/api/projects/${projectId}/members`).catch(() => [] as ProjectMember[]),
    ])
      .then(([t, m]) => { setTasks(t); setMembers(m); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);
  useEffect(load, [load]);

  const memberName = (id: number) => members.find(m => m.userId === id)?.name
    || members.find(m => m.userId === id)?.email || `#${id}`;

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading tasks…</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>{tasks.length} task{tasks.length === 1 ? '' : 's'}</span>
        {!archived && (
          <button onClick={() => setModal({ open: true, task: null })} style={primaryBtn}>+ New Task</button>
        )}
      </div>

      {error && <div style={errBox}>{error}</div>}

      {tasks.length === 0 ? (
        <div style={emptyBox}><p style={{ margin: 0 }}>No tasks yet.</p></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(t => (
            <button key={t.id} onClick={() => setModal({ open: true, task: t })} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t.milestone && <span title="Milestone" style={{ color: 'var(--tuc-gold)' }}>◆</span>}
                  {t.parentTaskId != null && <span style={subBadge}>sub</span>}
                  {t.title}
                </div>
                {t.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
                    {t.tags.map(tag => <span key={tag} style={tagChip}>{tag}</span>)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={prioBadge(t.priority)}>{cap(t.priority)}</span>
                <span style={statusBadge}>{t.status}</span>
                {t.assigneeIds.length > 0 && (
                  <span style={{ fontSize: 12, color: 'var(--muted)' }}>{memberName(t.assigneeIds[0])}{t.assigneeIds.length > 1 ? ` +${t.assigneeIds.length - 1}` : ''}</span>
                )}
                {t.dueDate && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t.dueDate}</span>}
              </div>
            </button>
          ))}
        </div>
      )}

      {modal.open && (
        <TaskModal
          projectId={projectId}
          stages={stages}
          members={members}
          tasks={tasks}
          initial={modal.task}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); load(); }}
        />
      )}
    </div>
  );
}

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const prioColor: Record<Priority, string> = { LOW: '#6b6358', MEDIUM: '#2f6f9f', HIGH: '#d98324', CRITICAL: '#c0392b' };

const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const row: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', font: 'inherit', color: 'inherit' };
const subBadge: React.CSSProperties = { fontSize: 9, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 4, padding: '1px 5px', textTransform: 'uppercase', fontWeight: 700 };
const tagChip: React.CSSProperties = { fontSize: 10, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '2px 8px' };
const prioBadge = (p: Priority): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, color: '#fff', background: prioColor[p], borderRadius: 999, padding: '2px 9px' });
const statusBadge: React.CSSProperties = { fontSize: 11, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '2px 9px' };
const emptyBox: React.CSSProperties = { border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
