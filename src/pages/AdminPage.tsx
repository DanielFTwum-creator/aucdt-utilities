import { useState, useEffect } from 'react'
import { AdminLogin } from '../components/admin/AdminLogin'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { adminAuth } from '../utils/adminAuth'

export function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if there's a valid session
    const sessionValid = adminAuth.isSessionValid()
    setIsAuthenticated(sessionValid)
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-academic-blue mx-auto mb-4" role="status" aria-label="Loading"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
