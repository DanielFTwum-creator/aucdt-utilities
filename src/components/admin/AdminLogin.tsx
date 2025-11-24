import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { adminAuth } from '../../utils/adminAuth'

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isConfigured = adminAuth.isConfigured()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!isConfigured) {
        // First time setup
        if (password.length < 8) {
          setError('Password must be at least 8 characters long')
          setIsLoading(false)
          return
        }
        await adminAuth.setPassword(password)
        adminAuth.createSession()
        onLoginSuccess()
      } else {
        // Login
        const isValid = await adminAuth.verifyPassword(password)
        if (isValid) {
          adminAuth.createSession()
          onLoginSuccess()
        } else {
          setError('Invalid password')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-academic-navy to-academic-blue p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="bg-academic-blue/10 p-4 rounded-full">
            <Lock className="w-8 h-8 text-academic-blue" aria-hidden="true" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">
          {isConfigured ? 'Admin Login' : 'Setup Admin Password'}
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          {isConfigured
            ? 'Enter your password to access the admin panel'
            : 'Create a secure password for the admin account'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-academic-blue focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder={isConfigured ? 'Enter password' : 'Create password (min 8 characters)'}
                disabled={isLoading}
                required
                minLength={8}
                aria-describedby={error ? 'password-error' : undefined}
                aria-invalid={error ? 'true' : 'false'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700
                         dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2
                         focus:ring-academic-blue rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div
              id="password-error"
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                       rounded-lg flex items-center gap-2 text-red-700 dark:text-red-400"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-academic-blue hover:bg-academic-navy text-white font-semibold py-3 px-4
                     rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue
                     focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isLoading}
          >
            {isLoading ? 'Processing...' : isConfigured ? 'Login' : 'Create Password'}
          </button>
        </form>

        {!isConfigured && (
          <div
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
            role="note"
          >
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Security Notice:</strong> This password will be required to access the admin panel.
              Make sure to use a strong, unique password.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
