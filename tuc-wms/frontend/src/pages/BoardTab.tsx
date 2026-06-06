import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  useDraggable, useDroppable, DragStartEvent, DragEndEvent,
} from '@dnd-kit/core';
import { api, put, post } from '../api';
import { Board, BoardCard, BoardColumn, Priority, ProjectMember, TaskDto } from '../types';
import TaskModal from '../components/TaskModal';
import KanbanLoader from '../components/KanbanLoader';
import { getAccessToken } from '../api';

/**
 * Kanban board (FR-KB-001..008): columns by stage, drag-drop to change status,
 * per-column WIP limits (owner-editable), quick-add, filters, and SSE live updates.
 */
export default function BoardTab({ projectId, stages, archived, canEditWip, focusTaskId }: {
  projectId: number; stages: string[]; archived: boolean; canEditWip: boolean; focusTaskId?: number | null;
}) {
  const [board, setBoard] = useState<Board | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragCard, setDragCard] = useState<BoardCard | null>(null);
  const [modal, setModal] = useState<{ open: boolean; task?: TaskDto | null; status?: string }>({ open: false });
  const [filters, setFilters] = useState<{ assignee?: string; priority?: string; label?: string }>({});

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const qs = useCallback(() => {
    const p = new URLSearchParams();
    if (filters.assignee) p.set('assignee', filters.assignee);
    if (filters.priority) p.set('priority', filters.priority);
    if (filters.label) p.set('label', filters.label);
    const s = p.toString();
    return s ? `?${s}` : '';
  }, [filters]);

  const loadBoard = useCallback(() => {
    api<Board>(`/api/projects/${projectId}/board${qs()}`)
      .then(setBoard).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [projectId, qs]);

  // Full reference data (members + tasks) for the task modal.
  const loadRefs = useCallback(() => {
    Promise.all([
      api<ProjectMember[]>(`/api/projects/${projectId}/members`).catch(() => [] as ProjectMember[]),
      api<TaskDto[]>(`/api/projects/${projectId}/tasks`).catch(() => [] as TaskDto[]),
    ]).then(([m, t]) => { setMembers(m); setTasks(t); });
  }, [projectId]);

  useEffect(() => { setLoading(true); loadBoard(); loadRefs(); }, [loadBoard, loadRefs]);

  // Email deep-link: once tasks are loaded, open the focused task (?task=) once.
  const focusedRef = useRef(false);
  useEffect(() => {
    if (focusedRef.current || !focusTaskId || tasks.length === 0) return;
    const t = tasks.find(x => x.id === focusTaskId);
    if (t) { focusedRef.current = true; setModal({ open: true, task: t }); }
  }, [focusTaskId, tasks]);

  // SSE live updates (FR-KB-007). EventSource can't set Authorization headers, so the
  // token rides as a query param; the backend stream endpoint accepts it.
  useEffect(() => {
    const token = getAccessToken();
    const url = `/api/projects/${projectId}/stream${token ? `?access_token=${encodeURIComponent(token)}` : ''}`;
    const es = new EventSource(url, { withCredentials: true });
    const refresh = () => { loadBoard(); loadRefs(); };
    es.addEventListener('task.created', refresh);
    es.addEventListener('task.updated', refresh);
    es.addEventListener('task.deleted', refresh);
    es.onerror = () => { /* browser auto-reconnects; ignore transient errors */ };
    return () => es.close();
  }, [projectId, loadBoard, loadRefs]);

  const onDragStart = (e: DragStartEvent) => {
    const card = board?.columns.flatMap(c => c.cards).find(c => c.id === Number(e.active.id));
    setDragCard(card ?? null);
  };

  const onDragEnd = async (e: DragEndEvent) => {
    setDragCard(null);
    const cardId = Number(e.active.id);
    const toStage = e.over?.id ? String(e.over.id) : null;
    if (!toStage || !board) return;
    const card = board.columns.flatMap(c => c.cards).find(c => c.id === cardId);
    if (!card || card.status === toStage) return;

    // Optimistic move.
    setBoard(prev => prev && moveCardLocal(prev, cardId, toStage));
    try {
      await put(`/api/projects/${projectId}/tasks/${cardId}`, { status: toStage });
      loadBoard(); // reconcile counts/WIP
    } catch (err: any) { setError(err.message); loadBoard(); }
  };

  const memberName = (id: number) => members.find(m => m.userId === id)?.name
    || members.find(m => m.userId === id)?.email || `#${id}`;

  if (loading) return <KanbanLoader label="Loading board…" />;
  if (!board) return <div style={errBox}>{error || 'Could not load board.'}</div>;

  return (
    <div>
      <FilterBar members={members} filters={filters} setFilters={setFilters} />
      {error && <div style={errBox}>{error}</div>}

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div style={boardRow}>
          {board.columns.map(col => (
            <Column key={col.stage} col={col} archived={archived} canEditWip={canEditWip}
              projectId={projectId} memberName={memberName}
              onAdd={() => setModal({ open: true, task: null, status: col.stage })}
              onOpenCard={(id) => {
                const t = tasks.find(x => x.id === id) ?? null;
                setModal({ open: true, task: t });
              }}
              onWipSaved={loadBoard} />
          ))}
        </div>
        <DragOverlay>{dragCard && <Card card={dragCard} memberName={memberName} overlay />}</DragOverlay>
      </DndContext>

      {modal.open && (
        <TaskModal
          projectId={projectId} stages={stages} members={members} tasks={tasks}
          initial={modal.task} defaultStatus={modal.status}
          onClose={() => setModal({ open: false })}
          onSaved={() => { setModal({ open: false }); loadBoard(); loadRefs(); }}
        />
      )}
    </div>
  );
}

function Column({ col, archived, canEditWip, projectId, memberName, onAdd, onOpenCard, onWipSaved }: {
  col: BoardColumn; archived: boolean; canEditWip: boolean; projectId: number;
  memberName: (id: number) => string; onAdd: () => void; onOpenCard: (id: number) => void; onWipSaved: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.stage });
  const [editingWip, setEditingWip] = useState(false);
  const [wipVal, setWipVal] = useState(col.wipLimit?.toString() ?? '');

  const saveWip = async () => {
    const limit = wipVal.trim() === '' ? null : Number(wipVal);
    try {
      await put(`/api/projects/${projectId}/board/wip-limits`, { [col.stage]: limit });
      setEditingWip(false); onWipSaved();
    } catch { setEditingWip(false); }
  };

  return (
    <div ref={setNodeRef} style={{
      ...columnStyle,
      outline: isOver ? '2px dashed var(--tuc-maroon)' : 'none',
      background: col.overWip ? 'rgba(192,57,43,0.05)' : 'var(--bg)',
    }}>
      <div style={colHead}>
        <span style={{ fontWeight: 700, fontSize: 13 }}>{col.stage}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={col.overWip ? countOver : countBadge}>
            {col.count}{col.wipLimit != null ? ` / ${col.wipLimit}` : ''}
          </span>
          {canEditWip && !archived && (
            editingWip
              ? <input value={wipVal} onChange={(e) => setWipVal(e.target.value.replace(/\D/g, ''))}
                  onBlur={saveWip} onKeyDown={(e) => { if (e.key === 'Enter') saveWip(); }}
                  placeholder="∞" autoFocus style={wipInput} />
              : <button onClick={() => setEditingWip(true)} style={wipBtn} title="Set WIP limit">⚙</button>
          )}
        </span>
      </div>

      {col.overWip && <div style={wipWarn}>WIP limit exceeded</div>}

      <div style={cardList}>
        {col.cards.map(c => <DraggableCard key={c.id} card={c} memberName={memberName} onOpen={() => onOpenCard(c.id)} />)}
      </div>

      {!archived && <button onClick={onAdd} style={addCardBtn}>+ Add card</button>}
    </div>
  );
}

function DraggableCard({ card, memberName, onOpen }: { card: BoardCard; memberName: (id: number) => string; onOpen: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: card.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}
      onClick={(e) => { if (!isDragging) { e.stopPropagation(); onOpen(); } }}
      style={{
        transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
        opacity: isDragging ? 0.4 : 1, cursor: 'grab',
      }}>
      <Card card={card} memberName={memberName} />
    </div>
  );
}

function Card({ card, memberName, overlay }: { card: BoardCard; memberName: (id: number) => string; overlay?: boolean }) {
  return (
    <div style={{ ...cardStyle, boxShadow: overlay ? '0 8px 24px rgba(28,22,18,0.2)' : cardStyle.boxShadow }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{card.title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={prioBadge(card.priority)}>{cap(card.priority)}</span>
        {card.subtaskCount > 0 && <span style={metaChip}>☑ {card.subtaskCount}</span>}
        {card.dueDate && <span style={metaChip}>{card.dueDate}</span>}
        {card.assigneeIds.length > 0 && <span style={metaChip}>{memberName(card.assigneeIds[0])}{card.assigneeIds.length > 1 ? ` +${card.assigneeIds.length - 1}` : ''}</span>}
      </div>
    </div>
  );
}

function FilterBar({ members, filters, setFilters }: {
  members: ProjectMember[];
  filters: { assignee?: string; priority?: string; label?: string };
  setFilters: (f: any) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
      <select value={filters.assignee ?? ''} onChange={(e) => setFilters({ ...filters, assignee: e.target.value || undefined })} style={filterSel}>
        <option value="">All assignees</option>
        {members.map(m => <option key={m.userId} value={m.userId}>{m.name || m.email}</option>)}
      </select>
      <select value={filters.priority ?? ''} onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })} style={filterSel}>
        <option value="">All priorities</option>
        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => <option key={p} value={p}>{cap(p)}</option>)}
      </select>
      <input value={filters.label ?? ''} onChange={(e) => setFilters({ ...filters, label: e.target.value || undefined })}
        placeholder="Filter by tag…" style={{ ...filterSel, width: 160 }} />
    </div>
  );
}

function moveCardLocal(board: Board, cardId: number, toStage: string): Board {
  let moved: BoardCard | undefined;
  const stripped = board.columns.map(c => {
    const keep = c.cards.filter(x => { if (x.id === cardId) { moved = x; return false; } return true; });
    return { ...c, cards: keep, count: keep.length };
  });
  if (!moved) return board;
  const movedCard = { ...moved, status: toStage };
  const columns = stripped.map(c => c.stage === toStage
    ? { ...c, cards: [...c.cards, movedCard], count: c.cards.length + 1 }
    : c);
  return { ...board, columns };
}

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();
const prioColor: Record<Priority, string> = { LOW: '#6b6358', MEDIUM: '#2f6f9f', HIGH: '#d98324', CRITICAL: '#c0392b' };

const boardRow: React.CSSProperties = { display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8, alignItems: 'flex-start' };
const columnStyle: React.CSSProperties = { minWidth: 270, maxWidth: 270, borderRadius: 12, border: '1px solid var(--border)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 };
const colHead: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2px 4px' };
const countBadge: React.CSSProperties = { fontSize: 11, color: 'var(--muted)', background: 'var(--card)', borderRadius: 999, padding: '2px 8px' };
const countOver: React.CSSProperties = { ...countBadge, color: '#fff', background: 'var(--danger)' };
const wipWarn: React.CSSProperties = { fontSize: 10, color: 'var(--danger)', padding: '0 4px' };
const cardList: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, minHeight: 8 };
const cardStyle: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 10, boxShadow: '0 1px 2px rgba(28,22,18,0.05)' };
const prioBadge = (p: Priority): React.CSSProperties => ({ fontSize: 10, fontWeight: 600, color: '#fff', background: prioColor[p], borderRadius: 999, padding: '1px 8px' });
const metaChip: React.CSSProperties = { fontSize: 10, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '1px 7px' };
const addCardBtn: React.CSSProperties = { background: 'none', border: '1px dashed var(--border)', borderRadius: 8, padding: '7px', fontSize: 12, color: 'var(--muted)', cursor: 'pointer' };
const wipBtn: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--muted)' };
const wipInput: React.CSSProperties = { width: 44, padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 };
const filterSel: React.CSSProperties = { padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--card)', color: 'var(--text)' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 12 };
