import { useState, useEffect } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface AuditEntry {
  id: number
  created_at: string
  full_name?: string
  role?: string
  action: string
  details?: string
}

export default function AuditLog() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/reports/audit-log`).then(r => setLogs(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))
  }, [])

  const actionColor = (a?: string): string => {
    if (a?.includes('LOGIN')) return 'badge-info'
    if (a?.includes('APPROVE')) return 'badge-success'
    if (a?.includes('REJECT')) return 'badge-danger'
    if (a?.includes('CREATE')) return 'badge-gold'
    if (a?.includes('TRANSCRIPT') || a?.includes('VIEW')) return 'badge-warning'
    return 'badge-draft'
  }

  return (
    <div>
      <div className="page-header">
        <h1>Audit Log</h1>
        <p>Complete record of all system activities — registrar access only</p>
      </div>
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper" style={{ borderRadius: 12 }}>
            <table role="table" aria-label="Audit log">
              <thead>
                <tr><th scope="col">#</th><th scope="col">Date & Time</th><th scope="col">User</th><th scope="col">Role</th><th scope="col">Action</th><th scope="col">Details</th></tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--tuc-muted)' }}>No logs found</td></tr>
                ) : logs.map((l, i) => (
                  <tr key={l.id}>
                    <td style={{ color: 'var(--tuc-muted)', fontSize: 12 }}>{i + 1}</td>
                    <td style={{ fontSize: 12, whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleString()}</td>
                    <td style={{ fontWeight: 500 }}>{l.full_name || 'System'}</td>
                    <td>{l.role ? <span className="badge badge-draft" style={{ fontSize: 11 }}>{l.role}</span> : '—'}</td>
                    <td><span className={`badge ${actionColor(l.action)}`} style={{ fontSize: 11 }}>{l.action?.replace(/_/g, ' ')}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--tuc-muted)', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
