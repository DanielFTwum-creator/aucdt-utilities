import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { Priority } from '../types';

interface CompletionRate {
  totalTasks: number;
  completedTasks: number;
  completionRatePercentage: number;
  totalMilestones: number;
  completedMilestones: number;
}

interface WorkloadUser {
  userId: number;
  userName: string;
  userEmail: string;
  totalTasks: number;
  completedTasks: number;
  uncompletedTasks: number;
  overdueTasks: number;
}

interface OverdueTask {
  id: number;
  title: string;
  dueDate: string;
  status: string;
  priority: Priority;
  assignees: string[];
}

interface ReportData {
  completionRate: CompletionRate;
  statusDistribution: Record<string, number>;
  workloadSummary: WorkloadUser[];
  overdueTasks: OverdueTask[];
}

export default function ReportsTab({ projectId }: { projectId: number }) {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api<ReportData>(`/api/projects/${projectId}/reports`)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(load, [load]);

  if (loading) return <div style={{ color: 'var(--muted)', padding: 20 }}>Loading dashboard analytics…</div>;
  if (error) return <div style={errBox}>{error}</div>;
  if (!data) return null;

  const { completionRate, statusDistribution, workloadSummary, overdueTasks } = data;
  const percentage = completionRate.completionRatePercentage;

  // SVG circular progress details
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Milestone percentage
  const milestonePercentage = completionRate.totalMilestones > 0
    ? Math.round((completionRate.completedMilestones * 100) / completionRate.totalMilestones)
    : 0;

  return (
    <div style={container}>
      {/* KPI Cards Row */}
      <div style={kpiGrid}>
        {/* Completion Rate circular gauge */}
        <div style={kpiCard}>
          <div style={kpiHeader}>Completion Rate</div>
          <div style={gaugeContainer}>
            <div style={circleWrapper}>
              <svg width="110" height="110" viewBox="0 0 110 110" style={svgRotate}>
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  fill="transparent"
                  stroke="var(--border)"
                  strokeWidth={strokeWidth}
                />
                <circle
                  cx="55"
                  cy="55"
                  r={radius}
                  fill="transparent"
                  stroke="url(#tucGaugeGrad)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={animatedCircle}
                />
                <defs>
                  <linearGradient id="tucGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--tuc-maroon)" />
                    <stop offset="100%" stopColor="var(--tuc-gold)" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={gaugeText}>{percentage}%</div>
            </div>
            <div style={gaugeLabel}>
              <div style={kpiValue}>{completionRate.completedTasks} / {completionRate.totalTasks}</div>
              <div style={kpiSub}>Completed Tasks</div>
            </div>
          </div>
        </div>

        {/* Milestones progress */}
        <div style={kpiCard}>
          <div style={kpiHeader}>Milestones</div>
          <div style={milestoneContent}>
            <div style={kpiValue}>{completionRate.completedMilestones} / {completionRate.totalMilestones}</div>
            <div style={kpiSub}>{milestonePercentage}% Completed</div>
            <div style={progressBarBg}>
              <div style={{ ...progressBarFill, width: `${milestonePercentage}%` }} />
            </div>
          </div>
        </div>

        {/* Overdue tasks */}
        <div style={{ ...kpiCard, ...(overdueTasks.length > 0 ? alertCard : {}) }}>
          <div style={kpiHeader}>Overdue Tasks</div>
          <div style={milestoneContent}>
            <div style={{ ...kpiValue, ...(overdueTasks.length > 0 ? alertText : {}) }}>
              {overdueTasks.length}
            </div>
            <div style={kpiSub}>Tasks past deadline</div>
            <div style={overdueIconWrapper}>
              <span style={{ fontSize: 13 }}>⚠️</span> Actions required
            </div>
          </div>
        </div>

        {/* Active tasks */}
        <div style={kpiCard}>
          <div style={kpiHeader}>Active Tasks</div>
          <div style={milestoneContent}>
            <div style={kpiValue}>
              {completionRate.totalTasks - completionRate.completedTasks}
            </div>
            <div style={kpiSub}>Unfinished backlog items</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>
              💡 Work remaining
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row Charts */}
      <div style={chartsRow}>
        {/* Status distribution bar chart */}
        <div style={chartCard}>
          <div style={cardTitle}>Stage Distribution</div>
          <div style={chartContent}>
            {Object.keys(statusDistribution).length === 0 ? (
              <div style={emptyMessage}>No tasks in this project yet.</div>
            ) : (
              Object.entries(statusDistribution).map(([stage, count]) => {
                const total = completionRate.totalTasks || 1;
                const pct = Math.round((count * 100) / total);
                return (
                  <div key={stage} style={barRow}>
                    <div style={barLabel}>{stage}</div>
                    <div style={barWrapper}>
                      <div style={barTrack}>
                        <div style={{ ...barFill, width: `${pct}%` }} />
                      </div>
                      <div style={barBadge}>{count}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Workload Summary stacked progress bars */}
        <div style={chartCard}>
          <div style={cardTitle}>Assignee Workload</div>
          <div style={chartContent}>
            {workloadSummary.length === 0 ? (
              <div style={emptyMessage}>No assignees or members assigned to tasks.</div>
            ) : (
              workloadSummary.map((user) => {
                const total = user.totalTasks;
                const completedPct = total > 0 ? (user.completedTasks * 100) / total : 0;
                const overduePct = total > 0 ? (user.overdueTasks * 100) / total : 0;
                const activePct = total > 0 ? 100 - completedPct - overduePct : 0;

                return (
                  <div key={user.userId} style={workloadRow}>
                    <div style={workloadUserMeta}>
                      <div style={workloadName}>{user.userName}</div>
                      <div style={workloadStats}>
                        {user.completedTasks} completed · {total - user.completedTasks - user.overdueTasks} active
                        {user.overdueTasks > 0 && <span style={{ color: 'var(--danger)', fontWeight: 600 }}> · {user.overdueTasks} overdue</span>}
                      </div>
                    </div>
                    {total > 0 ? (
                      <div style={stackedBar}>
                        <div style={{ ...stackedSegment, width: `${completedPct}%`, background: 'var(--tuc-maroon)', opacity: 0.85 }} title={`${user.completedTasks} completed`} />
                        <div style={{ ...stackedSegment, width: `${activePct}%`, background: 'var(--tuc-gold)', opacity: 0.9 }} title={`${total - user.completedTasks - user.overdueTasks} active`} />
                        <div style={{ ...stackedSegment, width: `${overduePct}%`, background: 'var(--danger)' }} title={`${user.overdueTasks} overdue`} />
                      </div>
                    ) : (
                      <div style={emptyWorkloadBar}>No assigned tasks</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Overdue Tasks List Table */}
      <div style={overdueCard}>
        <div style={cardTitle}>Overdue Task Backlog</div>
        {overdueTasks.length === 0 ? (
          <div style={noOverdueMessage}>🎉 All caught up! There are no overdue tasks in this project.</div>
        ) : (
          <div style={tableContainer}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Task Title</th>
                  <th style={th}>Due Date</th>
                  <th style={th}>Stage</th>
                  <th style={th}>Priority</th>
                  <th style={th}>Assignees</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.map((t) => (
                  <tr key={t.id} style={tr}>
                    <td style={td}>
                      <a href={`?task=${t.id}`} style={taskLink}>{t.title}</a>
                    </td>
                    <td style={{ ...td, color: 'var(--danger)', fontWeight: 500 }}>{t.dueDate}</td>
                    <td style={td}>
                      <span style={stageBadge}>{t.status}</span>
                    </td>
                    <td style={td}>
                      <span style={{ ...priorityBadge, ...priorityStyle(t.priority) }}>{t.priority}</span>
                    </td>
                    <td style={td}>
                      {t.assignees.length > 0 ? t.assignees.join(', ') : <span style={{ color: 'var(--muted)' }}>Unassigned</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const priorityStyle = (p: Priority): React.CSSProperties => {
  switch (p) {
    case 'CRITICAL':
      return { background: 'rgba(192,57,43,0.1)', color: 'var(--danger)', border: '1px solid rgba(192,57,43,0.2)' };
    case 'HIGH':
      return { background: 'rgba(230,126,34,0.1)', color: '#e67e22', border: '1px solid rgba(230,126,34,0.2)' };
    case 'MEDIUM':
      return { background: 'rgba(241,196,15,0.1)', color: '#b7950b', border: '1px solid rgba(241,196,15,0.2)' };
    default:
      return { background: 'rgba(189,195,199,0.2)', color: 'var(--muted)' };
  }
};

// Styling Object definitions
const container: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 };
const errBox: React.CSSProperties = { background: 'rgba(192,57,43,0.08)', color: 'var(--danger)', borderRadius: 8, padding: 12, fontSize: 13 };

const kpiGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 };
const kpiCard: React.CSSProperties = { background: 'var(--card)', borderRadius: 12, padding: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const alertCard: React.CSSProperties = { border: '1px solid rgba(192,57,43,0.25)', background: 'rgba(192,57,43,0.02)' };
const kpiHeader: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' };

const gaugeContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 16 };
const circleWrapper: React.CSSProperties = { position: 'relative', width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' };
const svgRotate: React.CSSProperties = { transform: 'rotate(-90deg)' };
const animatedCircle: React.CSSProperties = { transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' };
const gaugeText: React.CSSProperties = { position: 'absolute', fontSize: 18, fontWeight: 700, color: 'var(--text)' };
const gaugeLabel: React.CSSProperties = { display: 'flex', flexDirection: 'column' };

const milestoneContent: React.CSSProperties = { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 };
const kpiValue: React.CSSProperties = { fontSize: 28, fontWeight: 800, color: 'var(--text)', lineHeight: 1.1 };
const alertText: React.CSSProperties = { color: 'var(--danger)' };
const kpiSub: React.CSSProperties = { fontSize: 12, color: 'var(--muted)', marginTop: 4 };

const progressBarBg: React.CSSProperties = { height: 6, background: 'var(--border)', borderRadius: 3, marginTop: 10, overflow: 'hidden' };
const progressBarFill: React.CSSProperties = { height: '100%', background: 'linear-gradient(90deg, var(--tuc-maroon), var(--tuc-gold))', borderRadius: 3, transition: 'width 0.6s ease' };
const overdueIconWrapper: React.CSSProperties = { fontSize: 12, color: 'var(--muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 };

const chartsRow: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 };
const chartCard: React.CSSProperties = { background: 'var(--card)', borderRadius: 12, padding: 20, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const cardTitle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 10 };
const chartContent: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 14 };

const barRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 4 };
const barLabel: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: 'var(--text)' };
const barWrapper: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 10 };
const barTrack: React.CSSProperties = { flex: 1, height: 16, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' };
const barFill: React.CSSProperties = { height: '100%', background: 'var(--tuc-maroon)', borderRadius: 4, transition: 'width 0.6s ease' };
const barBadge: React.CSSProperties = { fontSize: 11, fontWeight: 700, background: 'var(--bg)', borderRadius: 6, padding: '2px 8px', minWidth: 26, textAlign: 'center' };

const workloadRow: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, borderBottom: '1px solid var(--bg)', paddingBottom: 10 };
const workloadUserMeta: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const workloadName: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: 'var(--text)' };
const workloadStats: React.CSSProperties = { fontSize: 11, color: 'var(--muted)' };
const stackedBar: React.CSSProperties = { height: 10, background: 'var(--border)', borderRadius: 5, display: 'flex', overflow: 'hidden' };
const stackedSegment: React.CSSProperties = { height: '100%', transition: 'width 0.6s ease' };
const emptyWorkloadBar: React.CSSProperties = { fontSize: 11, color: 'var(--muted)', fontStyle: 'italic' };

const overdueCard: React.CSSProperties = { background: 'var(--card)', borderRadius: 12, padding: 20, border: '1px solid var(--border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const noOverdueMessage: React.CSSProperties = { padding: '20px 0', textAlign: 'center', color: '#27ae60', fontWeight: 500, fontSize: 14 };
const emptyMessage: React.CSSProperties = { padding: '20px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 13 };

const tableContainer: React.CSSProperties = { overflowX: 'auto' };
const table: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', color: 'var(--muted)', fontWeight: 600, borderBottom: '2px solid var(--border)' };
const tr: React.CSSProperties = { borderBottom: '1px solid var(--border)' };
const td: React.CSSProperties = { padding: '12px', verticalAlign: 'middle' };
const taskLink: React.CSSProperties = { textDecoration: 'none', color: 'var(--tuc-maroon)', fontWeight: 600, cursor: 'pointer' };
const stageBadge: React.CSSProperties = { background: 'var(--bg)', borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 500 };
const priorityBadge: React.CSSProperties = { borderRadius: 4, padding: '2px 6px', fontSize: 11, fontWeight: 600 };
