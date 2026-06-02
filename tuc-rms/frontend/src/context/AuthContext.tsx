import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export interface User {
  id: number
  email: string
  name: string
  role: 'registrar' | 'qa_officer' | 'lecturer'
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<{token: string; user: User}>
  setSession: (token: string, user: User) => void
  logout: () => void
  loading: boolean
  showTimeoutWarning: boolean
  dismissTimeoutWarning: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false)
  const [inactivityTimer, setInactivityTimer] = useState<number | null>(null)
  const [warningTimer, setWarningTimer] = useState<number | null>(null)

  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)
    setShowTimeoutWarning(false)

    // 25-min warning timer
    const newWarningTimer = window.setTimeout(() => {
      setShowTimeoutWarning(true)
    }, 25 * 60 * 1000)

    // 30-min logout timer
    const newInactivityTimer = window.setTimeout(() => {
      logout()
    }, 30 * 60 * 1000)

    setWarningTimer(newWarningTimer)
    setInactivityTimer(newInactivityTimer)
  }

  useEffect(() => {
    const token = localStorage.getItem('tuc_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get(`${API}/auth/me`)
        .then(res => {
          setUser(res.data.user)
          resetInactivityTimer()
        })
        .catch(() => {
          localStorage.removeItem('tuc_token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // Track user activity
  useEffect(() => {
    if (!user) return

    const handleActivity = () => resetInactivityTimer()

    window.addEventListener('mousedown', handleActivity)
    window.addEventListener('keydown', handleActivity)

    return () => {
      window.removeEventListener('mousedown', handleActivity)
      window.removeEventListener('keydown', handleActivity)
    }
  }, [user, inactivityTimer, warningTimer])

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API}/auth/login`, { email, password })
    localStorage.setItem('tuc_token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    setUser(res.data.user)
    resetInactivityTimer()
    return res.data
  }

  const setSession = (token: string, userData: User) => {
    localStorage.setItem('tuc_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    resetInactivityTimer()
  }

  const logout = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    if (warningTimer) clearTimeout(warningTimer)
    localStorage.removeItem('tuc_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setShowTimeoutWarning(false)
  }

  const dismissTimeoutWarning = () => {
    setShowTimeoutWarning(false)
    resetInactivityTimer()
  }

  return (
    <AuthContext.Provider value={{ user, login, setSession, logout, loading, showTimeoutWarning, dismissTimeoutWarning }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { API }
