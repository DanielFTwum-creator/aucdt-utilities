import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LogOut,
  Shield,
  FileText,
  Settings as SettingsIcon,
  Activity,
  AlertTriangle,
  Info,
  AlertCircle
} from 'lucide-react'
import { adminAuth } from '../../utils/adminAuth'
import { auditLogger, AuditLog } from '../../utils/auditLogger'
import { ThemeSelector } from '../ThemeSelector'

interface AdminDashboardProps {
  onLogout: () => void
}

type Tab = 'overview' | 'audit-logs' | 'settings'

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [logs, setLogs] = useState<AuditLog[]>(auditLogger.getLogs({ limit: 100 }))

  const handleLogout = () => {
    adminAuth.logout()
    onLogout()
  }

  const refreshLogs = () => {
    setLogs(auditLogger.getLogs({ limit: 100 }))
    auditLogger.log('logs_refreshed', 'Admin refreshed audit logs', 'system', 'info')
  }

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all audit logs? This action cannot be undone.')) {
      auditLogger.clearLogs()
      refreshLogs()
    }
  }

  const handleExportLogs = () => {
    const data = auditLogger.exportLogs()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
    auditLogger.log('logs_exported', 'Admin exported audit logs', 'system', 'info')
  }

  const getSeverityIcon = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" aria-label="Critical" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" aria-label="Warning" />
      default:
        return <Info className="w-4 h-4 text-blue-500" aria-label="Info" />
    }
  }

  const stats = {
    totalLogs: logs.length,
    criticalLogs: logs.filter(l => l.severity === 'critical').length,
    warningLogs: logs.filter(l => l.severity === 'warning').length,
    authEvents: logs.filter(l => l.category === 'auth').length
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-academic-blue/10 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-academic-blue" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">ThesisAI Administration</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSelector />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20
                         dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg transition-colors
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Logout from admin panel"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <nav className="flex gap-4 mt-6" role="tablist" aria-label="Admin sections">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: Activity },
              { id: 'audit-logs' as Tab, label: 'Audit Logs', icon: FileText },
              { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                role="tab"
                aria-selected={activeTab === id}
                aria-controls={`${id}-panel`}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                  focus:outline-none focus:ring-2 focus:ring-academic-blue focus:ring-offset-2
                  ${activeTab === id
                    ? 'bg-academic-blue text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="tabpanel"
            id="overview-panel"
            aria-labelledby="overview-tab"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Overview</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                label="Total Audit Logs"
                value={stats.totalLogs}
                icon={<FileText className="w-5 h-5" />}
                color="blue"
              />
              <StatCard
                label="Critical Events"
                value={stats.criticalLogs}
                icon={<AlertTriangle className="w-5 h-5" />}
                color="red"
              />
              <StatCard
                label="Warnings"
                value={stats.warningLogs}
                icon={<AlertCircle className="w-5 h-5" />}
                color="yellow"
              />
              <StatCard
                label="Auth Events"
                value={stats.authEvents}
                icon={<Shield className="w-5 h-5" />}
                color="green"
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {logs.slice(0, 5).map(log => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    {getSeverityIcon(log.severity)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.action.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{log.details}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'audit-logs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="tabpanel"
            id="audit-logs-panel"
            aria-labelledby="audit-logs-tab"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Audit Logs</h2>
              <div className="flex gap-3">
                <button
                  onClick={refreshLogs}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20
                           dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg
                           transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Refresh audit logs"
                >
                  Refresh
                </button>
                <button
                  onClick={handleExportLogs}
                  className="px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20
                           dark:hover:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg
                           transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Export audit logs"
                >
                  Export
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20
                           dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg
                           transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Clear all audit logs"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Severity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {logs.map(log => (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getSeverityIcon(log.severity)}
                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                              {log.severity}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white capitalize">
                          {log.category}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {log.action.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="tabpanel"
            id="settings-panel"
            aria-labelledby="settings-tab"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>

            <div className="space-y-6">
              <SettingSection
                title="Password Management"
                description="Change your admin password"
              >
                <ChangePasswordForm />
              </SettingSection>

              <SettingSection
                title="Theme Preferences"
                description="Customize the appearance of the admin panel"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Select theme:</span>
                  <ThemeSelector />
                </div>
              </SettingSection>

              <SettingSection
                title="Accessibility"
                description="Accessibility features are always enabled for all users"
              >
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-label="Enabled"></span>
                    <span>Screen reader support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-label="Enabled"></span>
                    <span>Keyboard navigation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-label="Enabled"></span>
                    <span>High contrast mode available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full" aria-label="Enabled"></span>
                    <span>ARIA labels and roles</span>
                  </div>
                </div>
              </SettingSection>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  color
}: {
  label: string
  value: number
  icon: React.ReactElement
  color: 'blue' | 'red' | 'yellow' | 'green'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{label}</p>
    </div>
  )
}

function SettingSection({
  title,
  description,
  children
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div>{children}</div>
    </div>
  )
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' })
      return
    }

    try {
      const isValid = await adminAuth.verifyPassword(currentPassword)
      if (!isValid) {
        setMessage({ type: 'error', text: 'Current password is incorrect' })
        return
      }

      await adminAuth.setPassword(newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to change password'
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Current Password
        </label>
        <input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-academic-blue"
          required
        />
      </div>

      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          New Password
        </label>
        <input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-academic-blue"
          required
          minLength={8}
        />
      </div>

      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                   focus:outline-none focus:ring-2 focus:ring-academic-blue"
          required
          minLength={8}
        />
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <button
        type="submit"
        className="px-4 py-2 bg-academic-blue hover:bg-academic-navy text-white rounded-lg
                 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue
                 focus:ring-offset-2"
      >
        Change Password
      </button>
    </form>
  )
}
