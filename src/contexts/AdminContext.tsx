import React, { createContext, useContext, useState, useEffect } from 'react'

export interface AuditLog {
  id: string
  timestamp: string
  action: string
  details: string
  user: string
}

interface AdminContextType {
  isAuthenticated: boolean
  login: (password: string) => boolean
  logout: () => void
  auditLogs: AuditLog[]
  addAuditLog: (action: string, details: string) => void
  clearAuditLogs: () => void
  getAdminPassword: () => string
  setAdminPassword: (newPassword: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Default admin password - can be changed by admin
const DEFAULT_ADMIN_PASSWORD = 'admin123'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const stored = localStorage.getItem('admin_audit_logs')
    return stored ? JSON.parse(stored) : []
  })
  const [adminPassword, setAdminPasswordState] = useState(() => {
    return localStorage.getItem('admin_password') || DEFAULT_ADMIN_PASSWORD
  })

  // Save audit logs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin_audit_logs', JSON.stringify(auditLogs))
  }, [auditLogs])

  const login = (password: string): boolean => {
    if (password === adminPassword) {
      setIsAuthenticated(true)
      addAuditLog('LOGIN', 'Admin user logged in')
      return true
    }
    addAuditLog('LOGIN_FAILED', 'Failed login attempt')
    return false
  }

  const logout = () => {
    addAuditLog('LOGOUT', 'Admin user logged out')
    setIsAuthenticated(false)
  }

  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      user: isAuthenticated ? 'admin' : 'system'
    }
    setAuditLogs(prev => [newLog, ...prev])
  }

  const clearAuditLogs = () => {
    addAuditLog('AUDIT_CLEAR', 'All audit logs cleared')
    setTimeout(() => {
      setAuditLogs(prev => prev.filter(log => log.action === 'AUDIT_CLEAR'))
    }, 100)
  }

  const getAdminPassword = () => adminPassword

  const setAdminPassword = (newPassword: string) => {
    if (!isAuthenticated) {
      throw new Error('Must be authenticated to change password')
    }
    localStorage.setItem('admin_password', newPassword)
    setAdminPasswordState(newPassword)
    addAuditLog('PASSWORD_CHANGE', 'Admin password was changed')
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        auditLogs,
        addAuditLog,
        clearAuditLogs,
        getAdminPassword,
        setAdminPassword
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
