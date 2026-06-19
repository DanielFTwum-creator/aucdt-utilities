import React, { useEffect, useState, useCallback } from 'react';
import { api, post, put, del } from '../api';
import { ProjectMember, Priority, PRIORITIES } from '../types';

interface AutomationRule {
  id: number;
  name: string;
  active: boolean;
  triggerType: string;
  triggerConfig: string | null;
  conditionType: string;
  conditionConfig: string | null;
  actionType: string;
  actionConfig: string | null;
  createdAt: string;
}

interface AutomationHistory {
  id: number;
  ruleName: string;
  taskId: number;
  taskTitle: string;
  status: string; // SUCCESS, FAILED, SKIPPED
  message: string;
  runAt: string;
}

export default function AutomationsTab({ projectId, archived }: { projectId: number; archived: boolean }) {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [history, setHistory] = useState<AutomationHistory[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [stages, setStages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('TASK_CREATED');
  const [triggerConfig, setTriggerConfig] = useState('ANY');
  const [conditionType, setConditionType] = useState('NONE');
  const [conditionConfig, setConditionConfig] = useState('');
  const [actionType, setActionType] = useState('ASSIGN_TO_USER');
  const [actionConfig, setActionConfig] = useState('');
  const [creating, setCreating] = useState(false);
  const [subTab, setSubTab] = useState<'rules' | 'history'>('rules');

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api<AutomationRule[]>(`/api/projects/${projectId}/automations/rules`),
      api<AutomationHistory[]>(`/api/projects/${projectId}/automations/history`),
      api<ProjectMember[]>(`/api/projects/${projectId}/members`),
      api<{ stages: string[] }>(`/api/projects/${projectId}`)
    ])
      .then(([r, h, m, p]) => {
        setRules(r);
        setHistory(h);
        setMembers(m);
        setStages(p.stages || []);
        // Set default action config user if users exist
        if (m.length > 0) {
          setActionConfig(String(m[0].userId));
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(loadData, [loadData]);

  // Adjust defaults when form options change
  useEffect(() => {
    if (actionType === 'ASSIGN_TO_USER' && members.length > 0) {
      setActionConfig(String(members[0].userId));
    } else if (actionType === 'SET_PRIORITY') {
      setActionConfig('MEDIUM');
    } else if (actionType === 'MOVE_TO_STATUS' && stages.length > 0) {
      setActionConfig(stages[0]);
    } else if (actionType === 'SEND_NOTIFICATION_TO_OWNER') {
      setActionConfig('');
    }
  }, [actionType, members, stages]);

  useEffect(() => {
    if (triggerType === 'STATUS_CHANGED' && stages.length > 0) {
      setTriggerConfig('ANY');
    } else {
      setTriggerConfig('');
    }
  }, [triggerType, stages]);

  useEffect(() => {
    if (conditionType === 'PRIORITY_IS') {
      setConditionConfig('MEDIUM');
    } else if (conditionType === 'HAS_TAG') {
      setConditionConfig('');
    } else {
      setConditionConfig('');
    }
  }, [conditionType]);

  const handleToggle = async (ruleId: number, currentActive: boolean) => {
    try {
      await put(`/api/projects/${projectId}/automations/rules/${ruleId}/toggle?active=${!currentActive}`);
      setRules(rules.map(r => r.id === ruleId ? { ...r, active: !currentActive } : r));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (ruleId: number) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      await del(`/api/projects/${projectId}/automations/rules/${ruleId}`);
      setRules(rules.filter(r => r.id !== ruleId));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    setError(null);
    try {
      await post(`/api/projects/${projectId}/automations/rules`, {
        name: name.trim(),
        triggerType,
        triggerConfig,
        conditionType,
        conditionConfig,
        actionType,
        actionConfig
      });
      setName('');
      setTriggerType('TASK_CREATED');
      setConditionType('NONE');
      setActionType('ASSIGN_TO_USER');
      loadData();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  };

  const getTriggerLabel = (r: AutomationRule) => {
    if (r.triggerType === 'TASK_CREATED') return 'A task is created';
    if (r.triggerType === 'STATUS_CHANGED') {
      return r.triggerConfig === 'ANY' || !r.triggerConfig
        ? 'Task stage changes'
        : `Task moves to "${r.triggerConfig}"`;
    }
    return r.triggerType;
  };

  const getConditionLabel = (r: AutomationRule) => {
    if (r.conditionType === 'NONE') return 'Always (no condition)';
    if (r.conditionType === 'PRIORITY_IS') return `Priority is "${r.conditionConfig}"`;
    if (r.conditionType === 'IS_MILESTONE') return 'Task is a milestone';
    if (r.conditionType === 'HAS_TAG') return `Task has tag "${r.conditionConfig}"`;
    return r.conditionType;
  };

  const getActionLabel = (r: AutomationRule) => {
    if (r.actionType === 'ASSIGN_TO_USER') {
      const u = members.find(m => String(m.userId) === r.actionConfig);
      return `Assign to ${u?.name || u?.email || `User ${r.actionConfig}`}`;
    }
    if (r.actionType === 'SET_PRIORITY') return `Set priority to ${r.actionConfig}`;
    if (r.actionType === 'MOVE_TO_STATUS') return `Move task to stage "${r.actionConfig}"`;
    if (r.actionType === 'SEND_NOTIFICATION_TO_OWNER') return 'Notify project owner';
    return r.actionType;
  };

  if (loading && rules.length === 0) return <p style={{ color: 'var(--muted)' }}>Loading automations…</p>;

  return (
    <div>
      <div style={tabHeader}>
        <button onClick={() => setSubTab('rules')} style={subTab === 'rules' ? activeSubTab : idleSubTab}>Rules</button>
        <button onClick={() => setSubTab('history')} style={subTab === 'history' ? activeSubTab : idleSubTab}>Run History</button>
      </div>

      {error && <div style={errBox}>{error}</div>}

      {subTab === 'rules' && (
        <div style={grid}>
          {/* Rules List */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h3 style={sectionTitle}>Active Rules ({rules.length})</h3>
            {rules.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>No automation rules configured for this project yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {rules.map(r => (
                  <div key={r.id} style={r.active ? ruleCardActive : ruleCardInactive}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={ruleName}>{r.name}</h4>
                      {!archived && (
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                          <label style={switchLabel}>
                            <input type="checkbox" checked={r.active} onChange={() => handleToggle(r.id, r.active)} style={{ display: 'none' }} />
                            <span style={r.active ? switchOn : switchOff}></span>
                          </label>
                          <button onClick={() => handleDelete(r.id)} style={deleteBtn} title="Delete rule">✕</button>
                        </div>
                      )}
                    </div>
                    <div style={ruleFlow}>
                      <div><span style={flowLabel}>WHEN:</span> {getTriggerLabel(r)}</div>
                      <div><span style={flowLabel}>AND:</span> {getConditionLabel(r)}</div>
                      <div><span style={flowLabel}>THEN:</span> {getActionLabel(r)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rule Builder */}
          {!archived && (
            <div style={builderCard}>
              <h3 style={{ ...sectionTitle, marginTop: 0 }}>Create Automation Rule</h3>
              <form onSubmit={handleCreate} style={form}>
                <div style={formGroup}>
                  <label style={label}>Rule Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Assign critical tasks to HOD" style={input} required />
                </div>

                <div style={formGroup}>
                  <label style={label}>WHEN (Trigger)</label>
                  <select value={triggerType} onChange={e => setTriggerType(e.target.value)} style={select}>
                    <option value="TASK_CREATED">A task is created</option>
                    <option value="STATUS_CHANGED">Task stage changes</option>
                  </select>
                  {triggerType === 'STATUS_CHANGED' && stages.length > 0 && (
                    <select value={triggerConfig} onChange={e => setTriggerConfig(e.target.value)} style={{ ...select, marginTop: 6 }}>
                      <option value="ANY">Any stage</option>
                      {stages.map(s => <option key={s} value={s}>Moves to "{s}"</option>)}
                    </select>
                  )}
                </div>

                <div style={formGroup}>
                  <label style={label}>AND (Condition)</label>
                  <select value={conditionType} onChange={e => setConditionType(e.target.value)} style={select}>
                    <option value="NONE">Always (no condition)</option>
                    <option value="PRIORITY_IS">Task priority matches…</option>
                    <option value="IS_MILESTONE">Task is a milestone</option>
                    <option value="HAS_TAG">Task has tag…</option>
                  </select>
                  {conditionType === 'PRIORITY_IS' && (
                    <select value={conditionConfig} onChange={e => setConditionConfig(e.target.value)} style={{ ...select, marginTop: 6 }}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  )}
                  {conditionType === 'HAS_TAG' && (
                    <input value={conditionConfig} onChange={e => setConditionConfig(e.target.value)} placeholder="tag name" style={{ ...input, marginTop: 6 }} required />
                  )}
                </div>

                <div style={formGroup}>
                  <label style={label}>THEN (Action)</label>
                  <select value={actionType} onChange={e => setActionType(e.target.value)} style={select}>
                    <option value="ASSIGN_TO_USER">Assign task to member</option>
                    <option value="SET_PRIORITY">Set task priority</option>
                    <option value="MOVE_TO_STATUS">Move task to stage</option>
                    <option value="SEND_NOTIFICATION_TO_OWNER">Notify project owner</option>
                  </select>

                  {actionType === 'ASSIGN_TO_USER' && members.length > 0 && (
                    <select value={actionConfig} onChange={e => setActionConfig(e.target.value)} style={{ ...select, marginTop: 6 }}>
                      {members.map(m => (
                        <option key={m.userId} value={m.userId}>{m.name || m.email}</option>
                      ))}
                    </select>
                  )}

                  {actionType === 'SET_PRIORITY' && (
                    <select value={actionConfig} onChange={e => setActionConfig(e.target.value)} style={{ ...select, marginTop: 6 }}>
                      {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  )}

                  {actionType === 'MOVE_TO_STATUS' && stages.length > 0 && (
                    <select value={actionConfig} onChange={e => setActionConfig(e.target.value)} style={{ ...select, marginTop: 6 }}>
                      {stages.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>

                <button type="submit" disabled={creating || !name.trim()} style={primaryBtn}>
                  {creating ? 'Creating…' : 'Create Automation'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {subTab === 'history' && (
        <div>
          <h3 style={sectionTitle}>Execution History logs</h3>
          {history.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No rule executions recorded yet.</p>
          ) : (
            <div style={historyList}>
              {history.map(h => (
                <div key={h.id} style={historyRow}>
                  <div style={historyStatus}>
                    <span style={h.status === 'SUCCESS' ? badgeSuccess : h.status === 'FAILED' ? badgeDanger : badgeSkipped}>
                      {h.status}
                    </span>
                    <span style={historyTime}>{new Date(h.runAt).toLocaleString()}</span>
                  </div>
                  <div style={historyDesc}>
                    <span style={{ fontWeight: 600 }}>Rule "{h.ruleName}": </span>
                    {h.message} 
                    <span style={historyTask}> (Task: {h.taskTitle})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const grid: React.CSSProperties = { display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' };
const tabHeader: React.CSSProperties = { display: 'flex', gap: 16, borderBottom: '1px solid var(--border)', marginBottom: 18 };
const idleSubTab: React.CSSProperties = { background: 'none', border: 'none', borderBottom: '2px solid transparent', padding: '6px 12px', fontSize: 13, color: 'var(--muted)', cursor: 'pointer', marginBottom: -1 };
const activeSubTab: React.CSSProperties = { ...idleSubTab, color: 'var(--tuc-maroon)', borderBottom: '2px solid var(--tuc-maroon)', fontWeight: 600 };
const sectionTitle: React.CSSProperties = { margin: '0 0 14px', fontSize: 15, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text)' };

const ruleCardActive: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, borderLeft: '4px solid var(--tuc-maroon)' };
const ruleCardInactive: React.CSSProperties = { ...ruleCardActive, borderLeft: '4px solid var(--muted)', opacity: 0.6 };
const ruleName: React.CSSProperties = { margin: '0 0 10px', fontSize: 14, fontWeight: 700 };
const ruleFlow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--text)' };
const flowLabel: React.CSSProperties = { fontWeight: 700, color: 'var(--muted)', fontSize: 11, width: 50, display: 'inline-block' };

const builderCard: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, width: '100%', maxWidth: 360 };
const form: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };
const formGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 5 };
const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--muted)' };
const input: React.CSSProperties = { padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, background: 'var(--bg)', color: 'var(--text)' };
const select: React.CSSProperties = { ...input, cursor: 'pointer' };
const primaryBtn: React.CSSProperties = { background: 'var(--tuc-maroon)', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 6 };

const deleteBtn: React.CSSProperties = { background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 14, padding: 0 };
const switchLabel: React.CSSProperties = { cursor: 'pointer', display: 'flex', alignItems: 'center' };
const switchOff: React.CSSProperties = { display: 'inline-block', width: 28, height: 16, background: 'var(--border)', borderRadius: 8, position: 'relative' };
const switchOn: React.CSSProperties = { ...switchOff, background: 'var(--tuc-maroon)' };

const historyList: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' };
const historyRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, padding: '12px 16px', borderTop: '1px solid var(--border)' };
const historyStatus: React.CSSProperties = { display: 'flex', gap: 10, alignItems: 'center' };
const historyTime: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
const historyDesc: React.CSSProperties = { fontSize: 13, color: 'var(--text)' };
const historyTask: React.CSSProperties = { color: 'var(--muted)', fontStyle: 'italic' };

const badgeSuccess: React.CSSProperties = { fontSize: 10, fontWeight: 700, color: '#27ae60', background: 'rgba(39,174,96,0.08)', borderRadius: 4, padding: '2px 6px' };
const badgeDanger: React.CSSProperties = { ...badgeSuccess, color: '#c0392b', background: 'rgba(192,57,43,0.08)' };
const badgeSkipped: React.CSSProperties = { ...badgeSuccess, color: '#7f8c8d', background: 'rgba(127,140,141,0.08)' };

const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: '10px 12px', fontSize: 13, marginBottom: 16 };
