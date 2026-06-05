import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, post } from '../api';
import { ProjectDetail } from '../types';
import MembersTab from './MembersTab';
import ProjectSettingsTab from './ProjectSettingsTab';

type Tab = 'board' | 'timeline' | 'members' | 'settings';
const TABS: { key: Tab; label: string }[] = [
  { key: 'board', label: 'Board' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'members', label: 'Members' },
  { key: 'settings', label: 'Settings' },
];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('board');

  const load = useCallback(() => {
    setLoading(true);
    api<ProjectDetail>(`/api/projects/${projectId}`)
      .then(setProject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);
  useEffect(load, [load]);

  const toggleArchive = async () => {
    if (!project) return;
    try {
      await post(`/api/projects/${projectId}/archive?archived=${!project.archived}`);
      load();
    } catch (e: any) { setError(e.message); }
  };

  if (loading) return <p style={{ color: 'var(--muted)' }}>Loading project…</p>;
  if (error) return <div style={errBox}>{error} <button onClick={() => navigate('/')} style={linkBtn}>← Back</button></div>;
  if (!project) return null;

  return (
    <div>
      <button onClick={() => navigate('/')} style={backLink}>← Projects</button>

      <div style={titleRow}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0, color: 'var(--text)' }}>{project.name}</h1>
            <span style={visBadge}>{visLabel(project.visibility)}</span>
            {project.archived && <span style={archBadge}>Archived (read-only)</span>}
          </div>
          {project.description && <p style={{ color: 'var(--muted)', margin: '6px 0 0', fontSize: 14 }}>{project.description}</p>}
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {project.department && <span>Dept: {project.department}</span>}
            {project.startDate && <span>Start: {project.startDate}</span>}
            {project.dueDate && <span>Due: {project.dueDate}</span>}
          </div>
        </div>
        <button onClick={toggleArchive} style={ghostBtn}>
          {project.archived ? 'Unarchive' : 'Archive'}
        </button>
      </div>

      <nav style={tabBar}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={tab === t.key ? tabActive : tabIdle}>{t.label}</button>
        ))}
      </nav>

      <div style={{ marginTop: 18 }}>
        {tab === 'board' && <Placeholder label="Kanban board" note="Coming in the next slice." />}
        {tab === 'timeline' && <Placeholder label="Timeline / Gantt" note="Coming in a later slice." />}
        {tab === 'members' && <MembersTab projectId={projectId} archived={project.archived} />}
        {tab === 'settings' && <ProjectSettingsTab project={project} onChanged={load} />}
      </div>
    </div>
  );
}

function Placeholder({ label, note }: { label: string; note: string }) {
  return (
    <div style={{ border: '1.5px dashed var(--border)', borderRadius: 12, padding: 40, textAlign: 'center', color: 'var(--muted)' }}>
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 13, marginTop: 6 }}>{note}</p>
    </div>
  );
}

const visLabel = (v: string) =>
  v === 'PUBLIC' ? 'Public' : v === 'DEPARTMENT' ? 'Department' : v === 'MEMBERS' ? 'Members only' : 'Private';

const backLink: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 14 };
const titleRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18 };
const visBadge: React.CSSProperties = { fontSize: 10, color: 'var(--muted)', background: 'var(--bg)', borderRadius: 999, padding: '2px 8px' };
const archBadge: React.CSSProperties = { fontSize: 10, color: 'var(--danger)', background: 'rgba(192,57,43,0.08)', borderRadius: 999, padding: '2px 8px' };
const tabBar: React.CSSProperties = { display: 'flex', gap: 4, borderBottom: '1px solid var(--border)' };
const tabIdle: React.CSSProperties = { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '10px 14px', fontSize: 14, color: 'var(--muted)', cursor: 'pointer', marginBottom: -1 };
const tabActive: React.CSSProperties = { ...tabIdle, color: 'var(--tuc-maroon)', borderBottom: '2px solid var(--tuc-maroon)', fontWeight: 700 };
const ghostBtn: React.CSSProperties = { background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' };
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--tuc-maroon)', cursor: 'pointer', fontSize: 13 };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13 };
