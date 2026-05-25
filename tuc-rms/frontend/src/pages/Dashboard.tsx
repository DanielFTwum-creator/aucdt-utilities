import { useState, useEffect, ReactNode } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

interface StatCardProps {
  label: string
  value?: number | string
  sub?: string
  accent?: boolean
}

const StatCard = ({ label, value, sub, accent }: StatCardProps) => (
  <div className="stat-card">
    <div className="stat-value" style={accent ? { color: 'var(--tuc-maroon)' } : {}}>{value ?? '—'}</div>
    <div className="stat-label">{label}</div>
    {sub && <div style={{ fontSize: 11, color: 'var(--tuc-muted)', marginTop: 2 }}>{sub}</div>}
  </div>
)

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState<any>(null)
  const [pending, setPending] = useState<any[]>([])
  const [myCourses, setMyCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        if (['registrar', 'qa_officer'].includes(user?.role)) {
          const [d, p] = await Promise.all([
            axios.get(`${API}/dashboard/stats`),
            axios.get(`${API}/results/pending`)
          ])
          setStats(d.data)
          setPending(p.data.filter((r: any) => r.status === 'submitted').slice(0, 5))
        } else {
          const r = await axios.get(`${API}/users/${user?.id}/courses`)
          setMyCourses(r.data)
        }
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const isAdmin = ['registrar', 'qa_officer'].includes(user?.role)
  const roleLabel: Record<string, string> = { registrar: 'Registrar', qa_officer: 'QA Officer', lecturer: 'Lecturer', hod: 'HOD' }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user?.name?.split(' ')[0]}</h1>
        <p>{user?.role ? roleLabel[user.role] : 'User'} &mdash; Academic Year 2025/2026</p>
      </div>

      {isAdmin && stats && (
        <>
          <div className="stats-grid">
            <StatCard label="Total Students" value={stats.total_students?.toLocaleString()} accent />
            <StatCard label="Active Students" value={stats.active_students?.toLocaleString()} sub="Currently enrolled" />
            <StatCard label="Courses" value={stats.total_courses?.toLocaleString()} sub="Across all programmes" />
            <StatCard label="Programmes" value={stats.total_programmes?.toLocaleString()} sub="Degree, diploma, cert" />
            <StatCard label="Results Submitted" value={stats.results_submitted?.toLocaleString()} sub="Awaiting approval" />
            <StatCard label="Results Approved" value={stats.results_approved?.toLocaleString()} sub="This academic year" />
            <StatCard label="Results Rejected" value={stats.results_rejected?.toLocaleString()} sub="Returned to lecturers" />
            <StatCard label="Staff" value={stats.total_staff?.toLocaleString()} sub="Active users" />
          </div>

          {pending.length > 0 && (
            <div className="card" style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--tuc-maroon)' }}>Pending Approvals</div>
                  <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2 }}>
                    Scores awaiting your review
                  </div>
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => navigate('/approve-results')}>
                  View All
                </button>
              </div>
              <div className="table-wrapper">
                <table role="table" aria-label="Pending approvals">
                  <thead>
                    <tr>
                      <th scope="col">Course</th>
                      <th scope="col">Lecturer</th>
                      <th scope="col">Department</th>
                      <th scope="col">Students</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pending.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <span style={{ fontWeight: 600 }}>{row.course_code}</span>
                          <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--tuc-muted)' }}>{row.course_name}</span>
                        </td>
                        <td style={{ fontSize: 13 }}>{row.lecturer_name}</td>
                        <td style={{ fontSize: 13 }}>{row.department}</td>
                        <td style={{ textAlign: 'center', fontWeight: 600 }}>{row.result_count}</td>
                        <td style={{ fontSize: 12, color: 'var(--tuc-muted)' }}>
                          {row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '-'}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate('/approve-results')}
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!isAdmin && (
        <>
          <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <StatCard label="Assigned Courses" value={myCourses.length} accent />
            <StatCard
              label="Scores Submitted"
              value={myCourses.filter((c: any) => c.status === 'submitted').length}
              sub="Awaiting approval"
            />
            <StatCard
              label="Scores Approved"
              value={myCourses.filter((c: any) => c.status === 'approved').length}
              sub="This semester"
            />
          </div>

          {myCourses.length > 0 && (
            <div className="card" style={{ marginTop: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--tuc-maroon)', marginBottom: 14 }}>
                My Courses This Semester
              </div>
              <div className="table-wrapper">
                <table role="table" aria-label="My courses">
                  <thead>
                    <tr>
                      <th scope="col">Code</th>
                      <th scope="col">Course Name</th>
                      <th scope="col">Level</th>
                      <th scope="col">Semester</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myCourses.map((c: any) => (
                      <tr key={c.course_id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--tuc-maroon)', fontSize: 12 }}>
                            {c.course_code}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500 }}>{c.course_name}</td>
                        <td>L{c.level}</td>
                        <td>S{c.semester}</td>
                        <td>
                          {c.status === 'approved' && <span className="badge badge-success">Approved</span>}
                          {c.status === 'submitted' && <span className="badge badge-warning">Submitted</span>}
                          {c.status === 'draft' && <span className="badge badge-draft">Draft</span>}
                          {!c.status && <span className="badge badge-draft">Not Started</span>}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/courses/${c.course_id}/enter-scores`)}
                            disabled={c.status === 'approved' || c.status === 'submitted'}
                          >
                            {c.status === 'approved' ? 'Locked' : c.status === 'submitted' ? 'Pending' : 'Enter Scores'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
