import React, { useState, useEffect, useCallback } from 'react';
import { api, post, put, del, getAccessToken } from '../api';
import { TaskDto, Priority, PRIORITIES, ProjectMember } from '../types';
import RichTextEditor from './RichTextEditor';

/**
 * Create / edit a task (FR-TASK-001..004, 008).
 * Fields: title, rich-text description, assignees, start/due dates, priority,
 * status (= a project stage), tags, sub-task (parentTaskId), dependencies (blockedByTaskIds).
 * Supports task comments, activity logs, and attachments in edit mode.
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
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'activity' | 'attachments'>('details');

  // Task Details Form State
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

  // Collaboration State
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activitiesList, setActivitiesList] = useState<any[]>([]);
  const [attachmentsList, setAttachmentsList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const toggle = (list: number[], setList: (n: number[]) => void, id: number) =>
    setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);

  const otherTasks = tasks.filter(t => t.id !== initial?.id);

  // Load Collaboration Data
  const loadComments = useCallback(async () => {
    if (!initial) return;
    try {
      const res = await api<any[]>(`/api/projects/${projectId}/tasks/${initial.id}/comments`);
      setCommentsList(res);
    } catch (e: any) { setError(e.message); }
  }, [projectId, initial]);

  const loadActivities = useCallback(async () => {
    if (!initial) return;
    try {
      const res = await api<any[]>(`/api/projects/${projectId}/tasks/${initial.id}/activity`);
      setActivitiesList(res);
    } catch (e: any) { setError(e.message); }
  }, [projectId, initial]);

  const loadAttachments = useCallback(async () => {
    if (!initial) return;
    try {
      const res = await api<any[]>(`/api/projects/${projectId}/tasks/${initial.id}/attachments`);
      setAttachmentsList(res);
    } catch (e: any) { setError(e.message); }
  }, [projectId, initial]);

  // Initial counts load
  useEffect(() => {
    if (editing) {
      loadComments();
      loadAttachments();
    }
  }, [editing, loadComments, loadAttachments]);

  // Load tab details on tab switch
  useEffect(() => {
    if (!editing) return;
    if (activeTab === 'comments') loadComments();
    if (activeTab === 'activity') loadActivities();
    if (activeTab === 'attachments') loadAttachments();
  }, [activeTab, editing, loadComments, loadActivities, loadAttachments]);

  // Details Save
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

  // Actions
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

  // Comments Actions
  const postComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !initial) return;
    setBusy(true); setError(null);
    try {
      await post(`/api/projects/${projectId}/tasks/${initial.id}/comments`, { content: newComment.trim() });
      setNewComment('');
      loadComments();
    } catch (err: any) { setError(err.message); }
    finally { setBusy(false); }
  };

  // Attachments Actions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !initial) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File exceeds 10MB size limit");
      return;
    }

    setUploading(true); setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api(`/api/projects/${projectId}/tasks/${initial.id}/attachments`, {
        method: 'POST',
        body: formData,
      });
      loadAttachments();
    } catch (err: any) { setError(err.message); }
    finally { setUploading(false); }
  };

  const downloadFile = async (attachmentId: number, fileName: string) => {
    setError(null);
    const token = getAccessToken();
    const url = `/api/projects/${projectId}/tasks/${initial!.id}/attachments/${attachmentId}`;
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error("Failed to download file");
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const deleteFile = async (attachmentId: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;
    setError(null);
    try {
      await del(`/api/projects/${projectId}/tasks/${initial!.id}/attachments/${attachmentId}`);
      loadAttachments();
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={modalHead}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{editing ? 'Edit task' : 'New task'}</h2>
          <button type="button" onClick={onClose} style={xBtn}>✕</button>
        </div>

        {/* Tab Headers (Edit mode only) */}
        {editing && (
          <div style={tabBar}>
            <button type="button" onClick={() => setActiveTab('details')} style={activeTab === 'details' ? tabActive : tabIdle}>Details</button>
            <button type="button" onClick={() => setActiveTab('comments')} style={activeTab === 'comments' ? tabActive : tabIdle}>Comments ({commentsList.length})</button>
            <button type="button" onClick={() => setActiveTab('activity')} style={activeTab === 'activity' ? tabActive : tabIdle}>Activity</button>
            <button type="button" onClick={() => setActiveTab('attachments')} style={activeTab === 'attachments' ? tabActive : tabIdle}>Attachments ({attachmentsList.length})</button>
          </div>
        )}

        {/* Details Tab */}
        {activeTab === 'details' && (
          <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
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
        )}

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div style={tabContentPanel}>
            <div style={scrollList}>
              {commentsList.length === 0 ? (
                <div style={emptyHint}>No comments yet. Write a comment below!</div>
              ) : (
                commentsList.map(c => (
                  <div key={c.id} style={commentItem}>
                    <div style={commentMeta}>
                      <span style={commentAuthor}>{c.authorName}</span>
                      <span style={commentTime}>{new Date(c.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={commentBody}>{c.content}</div>
                  </div>
                ))
              )}
            </div>
            {error && <div style={{ ...errBox, margin: '0 20px' }}>{error}</div>}
            <form onSubmit={postComment} style={commentForm}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment… (Use @email or @username to mention a member)"
                style={commentInput}
                rows={2}
                disabled={busy}
              />
              <button type="submit" disabled={busy || !newComment.trim()} style={commentSubmitBtn}>
                {busy ? 'Posting…' : 'Comment'}
              </button>
            </form>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div style={tabContentPanel}>
            <div style={scrollList}>
              {activitiesList.length === 0 ? (
                <div style={emptyHint}>No activity logged yet.</div>
              ) : (
                activitiesList.map(a => (
                  <div key={a.id} style={activityItem}>
                    <div style={activityTime}>{new Date(a.occurredAt).toLocaleString()}</div>
                    <div style={activityBody}>
                      <strong>{a.actorName}</strong>: {a.detail}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div style={tabContentPanel}>
            <div style={scrollList}>
              {attachmentsList.length === 0 ? (
                <div style={emptyHint}>No attachments yet. Choose a file below.</div>
              ) : (
                attachmentsList.map(att => (
                  <div key={att.id} style={attachmentItem}>
                    <div style={attachmentMeta}>
                      <div style={attachmentName}>{att.fileName}</div>
                      <div style={attachmentSize}>
                        {formatSize(att.fileSize)} · By {att.uploadedByName} on {new Date(att.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={attachmentActions}>
                      <button type="button" onClick={() => downloadFile(att.id, att.fileName)} style={downloadBtn}>Download</button>
                      <button type="button" onClick={() => deleteFile(att.id)} style={deleteBtn}>Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {error && <div style={{ ...errBox, margin: '0 20px' }}>{error}</div>}
            <div style={uploadContainer}>
              <label style={uploadLabel}>
                {uploading ? 'Uploading…' : '📎 Choose file to upload (Max 10MB)'}
                <input type="file" onChange={handleFileUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        )}
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
const modal: React.CSSProperties = { background: 'var(--card)', borderRadius: 14, width: 'min(640px, 100%)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 12px 40px rgba(28,22,18,0.25)', overflow: 'hidden' };
const modalHead: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border)' };
const body: React.CSSProperties = { padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 };
const modalFoot: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center', padding: '14px 20px', borderTop: '1px solid var(--border)', background: 'var(--card)' };
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

// Tabbed interface styles
const tabBar: React.CSSProperties = { display: 'flex', gap: 4, borderBottom: '1px solid var(--border)', padding: '0 20px', background: 'var(--bg)' };
const tabIdle: React.CSSProperties = { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '10px 14px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', marginBottom: -1 };
const tabActive: React.CSSProperties = { ...tabIdle, color: 'var(--tuc-maroon)', borderBottom: '2px solid var(--tuc-maroon)', fontWeight: 700 };

const tabContentPanel: React.CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 350 };
const scrollList: React.CSSProperties = { flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 };
const emptyHint: React.CSSProperties = { textAlign: 'center', color: 'var(--muted)', fontSize: 13, padding: '40px 0' };

const commentItem: React.CSSProperties = { background: 'var(--bg)', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid var(--border)' };
const commentMeta: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const commentAuthor: React.CSSProperties = { fontWeight: 600, fontSize: 12, color: 'var(--text)' };
const commentTime: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
const commentBody: React.CSSProperties = { fontSize: 13, color: 'var(--text)', whiteSpace: 'pre-wrap' };

const commentForm: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, borderTop: '1px solid var(--border)', background: 'var(--card)' };
const commentInput: React.CSSProperties = { padding: 10, border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, fontFamily: 'inherit', color: 'var(--text)', resize: 'none' };
const commentSubmitBtn: React.CSSProperties = { ...primaryBtn, alignSelf: 'flex-end' };

const activityItem: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, borderLeft: '2px solid var(--tuc-maroon)', paddingLeft: 12, marginLeft: 6 };
const activityTime: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
const activityBody: React.CSSProperties = { fontSize: 13, color: 'var(--text)' };

const attachmentItem: React.CSSProperties = { background: 'var(--bg)', borderRadius: 8, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, border: '1px solid var(--border)' };
const attachmentMeta: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflow: 'hidden' };
const attachmentName: React.CSSProperties = { fontWeight: 600, fontSize: 13, color: 'var(--text)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' };
const attachmentSize: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
const attachmentActions: React.CSSProperties = { display: 'flex', gap: 6 };
const downloadBtn: React.CSSProperties = { background: 'transparent', color: 'var(--tuc-maroon)', border: '1px solid var(--tuc-maroon)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' };
const deleteBtn: React.CSSProperties = { background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer' };

const uploadContainer: React.CSSProperties = { padding: 16, borderTop: '1px solid var(--border)', background: 'var(--card)', display: 'flex', justifyContent: 'center' };
const uploadLabel: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', background: 'var(--bg)', border: '1px dashed var(--border)', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 600, color: 'var(--tuc-maroon)', cursor: 'pointer', transition: 'background 0.2s' };
