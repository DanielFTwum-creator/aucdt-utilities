import { useState, useCallback } from 'react'
import { auth, setAccessToken } from '@/services/api'

interface Props {
  onAuthenticated: (token: string, quotaRemaining: number) => void
}

export function LoginScreen({ onAuthenticated }: Props) {
  const [mode,     setMode]     = useState<'login' | 'register'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [name,     setName]     = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'register') {
        await auth.register(email, password, name || undefined)
        // Auto-login after register
      }
      const { data } = await auth.login(email, password)
      setAccessToken(data.accessToken)
      onAuthenticated(data.accessToken, data.quotaRemaining)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      setError(msg ?? (mode === 'register' ? 'Registration failed' : 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }, [mode, email, password, name, onAuthenticated])

  return (
    <div className="ls-login-shell">
      <div className="ls-login-card">
        {/* Logo */}
        <div className="ls-login-logo">
          <div className="ls-logo-icon">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
              <path d="M3 8a5 5 0 0 1 10 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5.5 10.5a3 3 0 0 1 5 0" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="12.5" r="1" fill="white"/>
            </svg>
          </div>
          <div>
            <div className="ls-logo-name">LyriaStream</div>
            <div className="ls-logo-sub">Self-Hosted AI Music · TUC</div>
          </div>
        </div>

        <h2 className="ls-login-title">
          {mode === 'login' ? 'Sign in to continue' : 'Create an account'}
        </h2>

        <form onSubmit={(e) => void handleSubmit(e)} className="ls-login-form">
          {mode === 'register' && (
            <div className="ls-field">
              <label className="ls-section-label" htmlFor="ls-name">Display name</label>
              <input
                id="ls-name"
                type="text"
                className="ls-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          )}

          <div className="ls-field">
            <label className="ls-section-label" htmlFor="ls-email">Email</label>
            <input
              id="ls-email"
              type="email"
              className="ls-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="ls-field">
            <label className="ls-section-label" htmlFor="ls-password">Password</label>
            <input
              id="ls-password"
              type="password"
              className="ls-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="ls-error">{error}</div>}

          <button
            type="submit"
            className="ls-btn-primary ls-btn-full"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <><span className="animate-spin" aria-hidden>⟳</span> {mode === 'login' ? 'Signing in…' : 'Creating account…'}</>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <p className="ls-login-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="ls-link"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
