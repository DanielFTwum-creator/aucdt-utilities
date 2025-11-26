import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAdmin } from '../contexts/AdminContext'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAdmin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    const success = login(password)
    if (!success) {
      setError('Invalid password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-academic-navy to-academic-blue p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-academic-blue high-contrast:bg-yellow-400 p-4 rounded-full">
              <Lock
                className="w-8 h-8 text-white high-contrast:text-black"
                aria-hidden="true"
              />
            </div>
          </div>

          <h1
            className="text-3xl font-serif font-bold text-center text-gray-900 dark:text-white high-contrast:text-yellow-400 mb-2"
            id="admin-login-title"
          >
            Admin Login
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 high-contrast:text-white mb-8">
            Enter your password to access the admin panel
          </p>

          <form onSubmit={handleSubmit} aria-labelledby="admin-login-title">
            <div className="mb-6">
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 high-contrast:text-white mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 high-contrast:border-yellow-400 high-contrast:border-2 rounded-lg focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400 focus:border-transparent bg-white dark:bg-gray-700 high-contrast:bg-black text-gray-900 dark:text-white high-contrast:text-yellow-400"
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  aria-required="true"
                  aria-invalid={!!error}
                  aria-describedby={error ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 high-contrast:text-yellow-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && (
                <p
                  id="password-error"
                  className="mt-2 text-sm text-red-600 dark:text-red-400 high-contrast:text-red-300"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-academic-blue hover:bg-academic-navy high-contrast:bg-yellow-400 high-contrast:hover:bg-yellow-300 high-contrast:text-black text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue focus:ring-offset-2 dark:focus:ring-offset-gray-800 high-contrast:focus:ring-yellow-400"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 high-contrast:text-white">
              Default password: <code className="bg-gray-100 dark:bg-gray-700 high-contrast:bg-gray-900 px-2 py-1 rounded font-mono">admin123</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
