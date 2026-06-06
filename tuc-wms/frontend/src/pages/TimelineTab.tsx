import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { api } from '../api';
import { Timeline, TimelineBar, ProjectMember, TaskDto } from '../types';
import TaskModal from '../components/TaskModal';

type Zoom = 'day' | 'week' | 'month';
const DAY_PX: Record<Zoom, number> = { day: 36, week: 14, month: 5 };

/**
 * Timeline / Gantt (FR-TL-001..007): bars by startDate→dueDate, milestone diamonds,
 * dependency conflict flags, zoom (Day/Week/Month), groupBy assignee|stage.
 * Reschedule = open the task (TaskModal) and edit dates -> PUT /tasks/{id}.
 */
export default function TimelineTab({ projectId, stages, archived }: {
  projectId: number; stages: string[]; archived: boolean;
}) {
  const [tl, setTl] = useState<Timeline | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState<Zoom>('week');
  const [groupBy, setGroupBy] = useState<'' | 'assignee' | 'stage'>('');
  const [modal, setModal] = useState<{ open: boolean; task?: TaskDto | null }>({ open: false });

  const load = useCallback(() => {
    const q = groupBy ? `?groupBy=${groupBy}` : '';
    Promise.all([
      api<Timeline>(`/api/projects/${projectId}/timeline${q}`),
      api<ProjectMember[]>(`/api/projects/${projectId}/members`).catch(() => [] as ProjectMember[]),
      api<TaskDto[]>(`/api/projects/${projectId}/tasks`).catch(() => [] as TaskDto[]),
    ]).then(([t, m, tk]) => { setTl(t); setMembers(m); setTasks(tk); })
      .catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [projectId, groupBy]);
  useEffect(() => { setLoading(true); load(); }, [load]);

  // Compute the date window across all bars.
  const { minDate, dayCount } = useMemo(() => computeWindow(tl?.bars ?? []), [tl]);

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading timeline…</p>;
  if (!tl) return <div style={errBox}>{error || 'Could not load timeline.'}</div>;

  const datedBars = tl.bars.filter(b => b.startDate || b.dueDate);
  const conflictIds = new Set(tl.dependencyConflicts.map(c => c.taskId));
  const dayPx = DAY_PX[zoom];

  return (
    <div>
      <div style={toolbar}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['day', 'week', 'month'] as Zoom[]).map(z => (
            <button key={z} onClick={() => setZoom(z)} style={z === zoom ? segActive : seg}>{cap(z)}</button>
          ))}
        </div>
        <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)} style={sel}>
          <option value="">No grouping</option>
          <option value="assignee">Group by assignee</option>
          <option value="stage">Group by stage</option>
        </select>
      </div>

      {error && <div style={errBox}>{error}</div>}

      {tl.dependencyConflicts.length > 0 && (
        <div style={conflictBox}>
          <strong>⚠ {tl.dependencyConflicts.length} dependency conflict{tl.dependencyConflicts.length === 1 ? '' : 's'}:</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
            {tl.dependencyConflicts.map((c, i) => <li key={i} style={{ fontSize: 12 }}>{c.message}</li>)}
          </ul>
        </div>
      )}

      {datedBars.length === 0 ? (
        <div style={emptyBox}><p style={{ margin: 0 }}>No tasks with dates yet.</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Add a start or due date to a task to see it on the timeline.</p></div>
      ) : (
        <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)' }}>
          <div style={{ minWidth: dayCount * dayPx + 220 }}>
            <ScaleHeader minDate={minDate} dayCount={dayCount} dayPx={dayPx} zoom={zoom} />
            {datedBars.map(bar => (
              <BarRow key={bar.id} bar={bar} minDate={minDate} dayPx={dayPx}
                conflict={conflictIds.has(bar.id)}
                onClick={() => setModal({ open: true, task: tasks.find(t => t.id === bar.id) ?? null })} />
            ))}
          </div>
        </div>
      )}

      {modal.open && (
        <TaskModal projectId={projectId} stages={stages} members={members} tasks={tasks}
          initial={modal.task}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); load(); }} />
      )}
      {!archived && <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>Tip: click a bar to edit its dates (reschedule).</p>}
    </div>
  );
}

function ScaleHeader({ minDate, dayCount, dayPx, zoom }: { minDate: Date; dayCount: number; dayPx: number; zoom: Zoom }) {
  const ticks: { left: number; label: string }[] = [];
  const step = zoom === 'day' ? 1 : zoom === 'week' ? 7 : 30;
  for (let d = 0; d <= dayCount; d += step) {
    const date = addDays(minDate, d);
    ticks.push({ left: d * dayPx, label: zoom === 'month' ? date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) : `${date.getMonth() + 1}/${date.getDate()}` });
  }
  return (
    <div style={{ position: 'relative', height: 26, borderBottom: '1px solid var(--border)', marginLeft: 200 }}>
      {ticks.map((t, i) => (
        <span key={i} style={{ position: 'absolute', left: t.left, fontSize: 10, color: 'var(--muted)', borderLeft: '1px solid var(--border)', paddingLeft: 3, height: 26, lineHeight: '26px' }}>{t.label}</span>
      ))}
    </div>
  );
}

function BarRow({ bar, minDate, dayPx, conflict, onClick }: {
  bar: TimelineBar; minDate: Date; dayPx: number; conflict: boolean; onClick: () => void;
}) {
  const start = bar.startDate ? parseDate(bar.startDate) : (bar.dueDate ? parseDate(bar.dueDate) : minDate);
  const end = bar.dueDate ? parseDate(bar.dueDate) : start;
  const left = 200 + daysBetween(minDate, start) * dayPx;
  const width = Math.max(dayPx, (daysBetween(start, end) + 1) * dayPx);

  return (
    <div style={{ position: 'relative', height: 34, borderBottom: '1px solid var(--border)' }}>
      <span style={{ position: 'absolute', left: 8, top: 8, width: 184, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bar.title}</span>
      {bar.milestone ? (
        <span onClick={onClick} title={bar.title} style={{ position: 'absolute', left: left - 8, top: 8, color: 'var(--tuc-gold)', fontSize: 18, cursor: 'pointer', lineHeight: '18px' }}>◆</span>
      ) : (
        <div onClick={onClick} title={`${bar.startDate ?? '?'} → ${bar.dueDate ?? '?'}`} style={{
          position: 'absolute', left, top: 9, width, height: 16, borderRadius: 6, cursor: 'pointer',
          background: conflict ? 'var(--danger)' : 'var(--tuc-maroon)', opacity: 0.9,
        }} />
      )}
      {conflict && <span style={{ position: 'absolute', left: left + width + 6, top: 9, fontSize: 11, color: 'var(--danger)' }}>⚠</span>}
    </div>
  );
}

function computeWindow(bars: TimelineBar[]): { minDate: Date; dayCount: number } {
  const dates: Date[] = [];
  bars.forEach(b => { if (b.startDate) dates.push(parseDate(b.startDate)); if (b.dueDate) dates.push(parseDate(b.dueDate)); });
  if (dates.length === 0) { const now = new Date(); return { minDate: now, dayCount: 30 }; }
  const min = new Date(Math.min(...dates.map(d => d.getTime())));
  const max = new Date(Math.max(...dates.map(d => d.getTime())));
  return { minDate: addDays(min, -2), dayCount: Math.max(14, daysBetween(min, max) + 6) };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const parseDate = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d: Date, n: number) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

const toolbar: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' };
const seg: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer', color: 'var(--muted)' };
const segActive: React.CSSProperties = { ...seg, background: 'var(--tuc-maroon)', color: '#fff', borderColor: 'var(--tuc-maroon)' };
const sel: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--card)', color: 'var(--text)' };
const conflictBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.3)', color: 'var(--danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14 };
const emptyBox: React.CSSProperties = { border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 12 };
