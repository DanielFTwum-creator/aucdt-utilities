import React, { useState } from 'react';
import { post, put, del } from '../api';
import { TaskDto, Priority, PRIORITIES, ProjectMember } from '../types';
import RichTextEditor from './RichTextEditor';

/**
 * Create / edit a task (FR-TASK-001..004, 008).
 * Fields: title, rich-text description, assignees, start/due dates, priority,
 * status (= a project stage), tags, sub-task (parentTaskId), dependencies (blockedByTaskIds).
 */
export default function TaskModal({
  projectId, stages, members, tasks, initial, defaultStatus, onClose, onSaved,
}: {
  projectId: number;
  stages: string[];
  members: ProjectMember[];
  tasks: TaskDto[];                 // for parent + dependency pickers
  initial?: TaskDto | null;         // edit mode when present
  defaultStatus?: string;           // quick-add into a column
  onClose: () => void;
  onSaved: () => void;
}) {
  const editing = !!initial;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [assigneeIds, setAssigneeIds] = useState<number[]>(initial?.assigneeIds ?? []);
  const [startDate, setStartDate] = useState(initial?.startDate ?? '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM');
  const [status, setStatus] = useState(initial?.status ?? defaultStatus ?? stages[0] ?? '');
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '));
  const [parentTaskId, setParentTaskId] = useState<number | ''>(initial?.parentTaskId ?? '');
  const [blockedBy, setBlockedBy] = useState<number[]>(initial?.blockedByTaskIds ?? []);
  const [milestone, setMilestone] = useState(initial?.milestone ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (list: number[], setList: (n: number[]) => void, id: number) =>
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  // Candidate parents/blockers: any task except this one and its own sub-tasks.
  const otherTasks = tasks.filter(t => t.id !== initial?.id);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true); setError(null);
    const body: Partial<TaskDto> = {
      title: title.trim(),
      description: description || null,
      assigneeIds,
      startDate: startDate || null,
      dueDate: dueDate || null,
      priority,
      status,
      tags: tagsText.split(',').map(s => s.trim()).filter(Boolean),
      parentTaskId: parentTaskId === '' ? null : Number(parentTaskId),
      blockedByTaskIds: blockedBy,
      milestone,
    };
    try {
      if (editing) await put(`/api/projects/${projectId}/tasks/${initial!.id}`, body);
      else await post(`/api/projects/${projectId}/tasks`, body);
      onSaved();
    } catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  const duplicate = async () => {
    if (!initial) return;
    setBusy(true); setError(null);
    try { await post(`/api/projects/${projectId}/tasks/${initial.id}/duplicate`); onSaved(); }
    catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  const remove = async () => {
    if (!initial || !confirm('Delete this task and its sub-tasks?')) return;
    setBusy(true); setError(null);
    try { await del(`/api/projects/${projectId}/tasks/${initial.id}`); onSaved(); }
    catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <form onSubmit={save}>
          <div style={modalHead}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{editing ? 'Edit task' : 'New task'}</h2>
            <button type="button" onClick={onClose} style={xBtn}>✕</button>
          </div>

          <div style={body}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" autoFocus style={titleInput} />

            <Field label="Description">
              <RichTextEditor value={description} onChange={setDescription} />
            </Field>

            <div style={grid2}>
              <Field label="Status (stage)">
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={input}>
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Priority">
                <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} style={input}>
                  {PRIORITIES.map(p => <option key={p} value={p}>{cap(p)}</option>)}
                </select>
              </Field>
              <Field label="Start date">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={input} />
              </Field>
              <Field label="Due date">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={input} />
              </Field>
            </div>

            <Field label="Assignees">
              {members.length === 0
                ? <span style={hint}>No project members yet — add members on the Members tab.</span>
                : <div style={chips}>
                    {members.map(m => (
                      <button type="button" key={m.userId} onClick={() => toggle(assigneeIds, setAssigneeIds, m.userId)}
                        style={chip(assigneeIds.includes(m.userId))}>{m.name || m.email}</button>
                    ))}
                  </div>}
            </Field>

            <Field label="Tags (comma-separated)">
              <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="e.g. backend, urgent" style={input} />
            </Field>

            <div style={grid2}>
              <Field label="Sub-task of (parent)">
                <select value={parentTaskId} onChange={(e) => setParentTaskId(e.target.value === '' ? '' : Number(e.target.value))} style={input}>
                  <option value="">— none (top-level) —</option>
                  {otherTasks.filter(t => t.parentTaskId == null).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </Field>
              <Field label="Milestone">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, padding: '9px 0' }}>
                  <input type="checkbox" checked={milestone} onChange={(e) => setMilestone(e.target.checked)} />
                  Mark as milestone
                </label>
              </Field>
            </div>

            <Field label="Blocked by (dependencies)">
              {otherTasks.length === 0
                ? <span style={hint}>No other tasks to depend on yet.</span>
                : <div style={chips}>
                    {otherTasks.map(t => (
                      <button type="button" key={t.id} onClick={() => toggle(blockedBy, setBlockedBy, t.id)}
                        style={chip(blockedBy.includes(t.id))}>{t.title}</button>
                    ))}
                  </div>}
            </Field>

            {error && <div style={errBox}>{error}</div>}
          </div>

          <div style={modalFoot}>
            {editing && (
              <div style={{ display: 'flex', gap: 8, marginRight: 'auto' }}>
                <button type="button" onClick={duplicate} disabled={busy} style={ghostBtn}>Duplicate</button>
                <button type="button" onClick={remove} disabled={busy} style={dangerBtn}>Delete</button>
              </div>
            )}
            <button type="button" onClick={onClose} style={ghostBtn}>Cancel</button>
            <button type="submit" disabled={busy || !title.trim()} style={primaryBtn}>
              {busy ? 'Saving…' : editing ? 'Save' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)' }}>{label}</span>
      {children}
    </label>
  );
}

const cap = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

const overlay: React.CSSProperties = { position: 'fixed', inset: 0, background: 'rgba(28,22,18,0.45)', display: 'grid', placeItems: 'center', padding: 20, zIndex: 100 };
const modal: React.CSSProperties = { background: 'var(--card)', borderRadius: 14, width: 'min(640px, 100%)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(28,22,18,0.25)' };
const modalHead: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' };
const body: React.CSSProperties = { padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 };
const modalFoot: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--border)' };
const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 };
const titleInput: React.CSSProperties = { padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 16, fontWeight: 600, fontFamily: 'inherit', color: 'var(--text)' };
const input: React.CSSProperties = { padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', color: 'var(--text)', background: 'var(--card)' };
const chips: React.CSSProperties = { display: 'flex', gap: 6, flexWrap: 'wrap' };
const chip = (on: boolean): React.CSSProperties => ({ background: on ? 'var(--tuc-maroon)' : 'var(--bg)', color: on ? '#fff' : 'var(--muted)', border: '1px solid var(--border)', borderRadius: 999, padding: '5px 12px', fontSize: 12, cursor: 'pointer' });
const hint: React.CSSProperties = { fontSize: 12, color: 'var(--muted)' };
const xBtn: React.CSSProperties = { background: 'none', border: 'none', fontSize: 16, color: 'var(--muted)', cursor: 'pointer' };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' };
const dangerBtn: React.CSSProperties = { background: 'transparent', color: 'var(--danger)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 16px', fontSize: 13, cursor: 'pointer' };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13 };
