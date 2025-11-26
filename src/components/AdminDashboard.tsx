import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Shield, Eye, EyeOff, Key } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'
import { AuditLogViewer } from './AuditLogViewer'

export function AdminDashboard() {
  const { logout, setAdminPassword, addAuditLog } = useAdmin()
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess('')

    if (!newPassword.trim()) {
      setPasswordError('New password is required')
      return
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    try {
      setAdminPassword(newPassword)
      setPasswordSuccess('Password changed successfully')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setShowPasswordChange(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (error) {
      setPasswordError('Failed to change password')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-academic-navy to-academic-blue dark:from-gray-900 dark:to-gray-800 high-contrast:from-black high-contrast:to-black">
      {/* Header */}
      <header
        className="bg-white/10 dark:bg-black/20 high-contrast:bg-black high-contrast:border-b-2 high-contrast:border-yellow-400 backdrop-blur-sm border-b border-white/20"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield
              className="w-8 h-8 text-academic-gold high-contrast:text-yellow-400"
              aria-hidden="true"
            />
            <h1 className="text-2xl font-serif font-bold text-white high-contrast:text-yellow-400">
              Admin Dashboard
            </h1>
          </div>
          <nav className="flex gap-4" role="navigation" aria-label="Admin navigation">
            <button
              onClick={() => {
                setShowPasswordChange(!showPasswordChange)
                addAuditLog('VIEW_PASSWORD_CHANGE', 'Opened password change form')
              }}
              className="flex items-center gap-2 text-white/80 hover:text-white high-contrast:text-yellow-400 high-contrast:hover:text-yellow-300 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded px-3 py-2"
              aria-label="Change password"
            >
              <Key className="w-5 h-5" aria-hidden="true" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 high-contrast:bg-red-500 high-contrast:hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Logout from admin panel"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8" role="main">
        {/* Password Change Section */}
        {showPasswordChange && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-xl shadow-lg p-6 mb-8"
            role="region"
            aria-label="Password change form"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white high-contrast:text-yellow-400 mb-4">
              Change Admin Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 high-contrast:text-white mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400 high-contrast:border-2 rounded-lg focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 high-contrast:bg-black text-gray-900 dark:text-white high-contrast:text-yellow-400"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 high-contrast:text-yellow-400"
                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 high-contrast:text-white mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400 high-contrast:border-2 rounded-lg focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 high-contrast:bg-black text-gray-900 dark:text-white high-contrast:text-yellow-400"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  aria-required="true"
                />
              </div>

              {passwordError && (
                <p className="text-sm text-red-600 dark:text-red-400 high-contrast:text-red-300" role="alert">
                  {passwordError}
                </p>
              )}

              {passwordSuccess && (
                <p className="text-sm text-green-600 dark:text-green-400 high-contrast:text-green-300" role="status">
                  {passwordSuccess}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-academic-blue hover:bg-academic-navy high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 high-contrast:text-black text-white font-semibold px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(false)}
                  className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 high-contrast:bg-gray-800 high-contrast:hover:bg-gray-700 high-contrast:border-2 high-contrast:border-yellow-400 text-gray-900 dark:text-white high-contrast:text-yellow-400 font-semibold px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 high-contrast:focus:ring-yellow-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Audit Log Section */}
        <AuditLogViewer />
      </main>
    </div>
  )
}
