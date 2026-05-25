import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { TUC_LOGO } from '../logo_b64'
import { useState, useEffect, useRef, ReactNode } from 'react'
import axios from 'axios'
import { API } from '../context/AuthContext'
import toast from 'react-hot-toast'
import ThemeToggle from './ThemeToggle'

interface Notification {
  id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Students: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Courses: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Results: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Approve: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Transcript: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  Reports: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Audit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 11l3 3L22 4"/>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
    </svg>
  ),
  Password: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Logout: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
}

export default function Layout() {
  const { user, logout, showTimeoutWarning, dismissTimeoutWarning } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  const loadNotifications = async () => {
    try {
      const r = await axios.get(`${API}/results/notifications`)
      setNotifications(r.data)
    } catch {
      // Silently ignore notification errors
    }
  }

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  // Close notification panel when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isAdmin = ['registrar', 'qa_officer'].includes(user?.role)
  const isRegistrar = user?.role === 'registrar'
  const unread = notifications.filter(n => !n.is_read).length

  const markRead = async (id: number) => {
    try {
      await axios.put(`${API}/results/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch {
      // Silently ignore
    }
  }

  const markAllRead = async () => {
    try {
      await axios.put(`${API}/results/notifications/read-all`)
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch {
      // Silently ignore
    }
  }

  const roleLabel: Record<string, string> = { registrar: 'Registrar', qa_officer: 'QA Officer', lecturer: 'Lecturer', hod: 'HOD' }

  return (
    <div className="layout">
      <aside className="sidebar" role="navigation" aria-label="Main navigation">
        <div className="sidebar-header">
          <img src={TUC_LOGO} alt="TUC Logo" className="sidebar-logo" />
          <div>
            <div className="sidebar-title">Techbridge University College</div>
            <div className="sidebar-subtitle">Results Management System</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main</div>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icons.Dashboard /> Dashboard
          </NavLink>

          {isAdmin && (
            <NavLink to="/students" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icons.Students /> Students
            </NavLink>
          )}

          <NavLink to="/courses" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icons.Courses /> {isAdmin ? 'All Courses' : 'My Courses'}
          </NavLink>

          {isAdmin && (
            <>
              <div className="nav-section-label">Results</div>
              <NavLink to="/approve-results" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Icons.Approve /> Approve Results
              </NavLink>
              <NavLink to="/transcripts" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Icons.Transcript /> Transcripts
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Icons.Reports /> Class Reports
              </NavLink>
            </>
          )}

          {isRegistrar && (
            <>
              <div className="nav-section-label">Administration</div>
              <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Icons.Users /> User Management
              </NavLink>
              <NavLink to="/audit-log" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                <Icons.Audit /> Audit Log
              </NavLink>
            </>
          )}

          <div className="nav-section-label">Account</div>
          <NavLink to="/change-password" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Icons.Password /> Change Password
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role ? roleLabel[user.role] : 'User'}</div>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar" role="banner">
          <div className="topbar-title">TUC Results Management System</div>
          <div className="topbar-right">
            <ThemeToggle />
            <div style={{ position: 'relative' }} ref={notifRef}>
              <button
                className="notification-btn"
                onClick={() => setShowNotifs(!showNotifs)}
                aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
                aria-expanded={showNotifs}
              >
                <Icons.Bell />
                {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
              </button>

              {showNotifs && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: 340,
                  background: 'white', borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  border: '1px solid var(--tuc-border)', zIndex: 200
                }}>
                  <div style={{
                    padding: '12px 16px', borderBottom: '1px solid var(--tuc-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--tuc-maroon)' }}>
                      Notifications {unread > 0 && `(${unread})`}
                    </span>
                    {unread > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{ fontSize: 11, color: 'var(--tuc-maroon)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--tuc-muted)', fontSize: 13 }}>
                      No notifications
                    </div>
                  ) : (
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {notifications.slice(0, 8).map(n => (
                        <div
                          key={n.id}
                          onClick={() => markRead(n.id)}
                          style={{
                            padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
                            cursor: 'pointer', background: n.is_read ? 'transparent' : '#fff8f0',
                            transition: 'background 0.15s'
                          }}
                        >
                          <div style={{ fontWeight: n.is_read ? 400 : 600, fontSize: 12.5, color: 'var(--tuc-text)' }}>
                            {n.title}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--tuc-muted)', marginTop: 2, lineHeight: 1.4 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: 11, color: '#bbb', marginTop: 4 }}>
                            {new Date(n.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="logout-btn" onClick={handleLogout} aria-label="Sign out">
              <Icons.Logout /> Sign Out
            </button>
          </div>
        </header>

        {showTimeoutWarning && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              background: '#fff3cd',
              border: '1px solid #ffc107',
              color: '#856404',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Your session will expire in 5 minutes due to inactivity.</span>
            <button
              onClick={dismissTimeoutWarning}
              style={{
                background: 'none',
                border: 'none',
                color: '#856404',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '18px'
              }}
            >
              &times;
            </button>
          </div>
        )}

        <main className="page-content" role="main" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
