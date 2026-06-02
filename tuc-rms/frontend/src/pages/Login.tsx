import { useState, useEffect, FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { TUC_LOGO } from '../logo_b64'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL || '/api'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('') // resolved full email, set after submit
  const [loading, setLoading] = useState(false)
  const [linkSent, setLinkSent] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [linkError, setLinkError] = useState('')

  // Handle magic link click — ?token=&otp= in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const otp = params.get('otp')
    const redirect = params.get('redirect') || '/dashboard'

    if (token && otp) {
      setVerifying(true)
      window.history.replaceState({}, '', '/login')
      fetch(`${API}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: token, otp }),
      })
        .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
        .then(({ ok, data }) => {
          if (!ok) { setLinkError(data.message || 'This link has expired or already been used.'); setVerifying(false); return }
          login(data.token, data.user)
          toast.success('Welcome back!')
          setTimeout(() => navigate(redirect), 400)
        })
        .catch(() => { toast.error('Network error'); setVerifying(false) })
    }
  }, [])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const resolvedEmail = `${firstName.trim().toLowerCase()}.${lastName.trim().toLowerCase()}@techbridge.edu.gh`
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resolvedEmail }),
      })
      const data = await response.json()
      if (!response.ok) { toast.error(data.message || 'Name not found — check your spelling'); return }
      setEmail(resolvedEmail)
      setLinkSent(true)
    } catch {
      toast.error('Network error')
    } finally {
      setLoading(false)
    }
  }

  // Magic link error — expired or already used
  if (linkError) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="login-logo-container">
            <img src={TUC_LOGO} alt="TUC Logo" className="login-logo" />
            <div className="login-school-name">Techbridge University College</div>
            <div className="login-system-name">Results Management System</div>
          </div>
          <div className="login-divider" />
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔗</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--tuc-maroon)', marginBottom: 8 }}>Link expired</div>
          <div style={{ fontSize: 13, color: 'var(--tuc-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            {linkError}<br />Login links can only be used once and expire after 15 minutes.
          </div>
          <button className="btn btn-primary"
            onClick={() => { setLinkError(''); setFirstName(''); setLastName('') }}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14 }}>
            Request a new link
          </button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#bbb' }}>
            © {new Date().getFullYear()} Techbridge University College · Design and Build a Nation
          </div>
        </div>
      </div>
    )
  }

  // Magic link verification in progress
  if (verifying) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, borderTopColor: 'var(--tuc-maroon)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 15, color: 'var(--tuc-maroon)', fontWeight: 600 }}>Signing you in…</div>
        </div>
      </div>
    )
  }

  // After email submitted — check your email screen
  if (linkSent) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: 'center' }}>
          <div className="login-logo-container">
            <img src={TUC_LOGO} alt="TUC Logo" className="login-logo" />
            <div className="login-school-name">Techbridge University College</div>
            <div className="login-system-name">Results Management System</div>
          </div>
          <div className="login-divider" />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📬</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--tuc-maroon)', marginBottom: 8 }}>Check your email</div>
          <div style={{ fontSize: 13, color: 'var(--tuc-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            A sign-in link has been sent to<br />
            <strong style={{ color: 'var(--tuc-text)' }}>{email}</strong><br />
            Click the link to access your dashboard.
          </div>
          <div style={{ fontSize: 11, color: 'var(--tuc-muted)', padding: '10px 14px', background: 'rgba(107,0,32,0.04)', borderRadius: 8 }}>
            The link expires in <strong>15 minutes</strong> and can only be used once.
          </div>
          <a
            href="https://mail.google.com/a/techbridge.edu.gh"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 20, padding: '10px 20px', background: '#16a34a', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            <span style={{ fontSize: 16 }}>📩</span> Open TUC Inbox
          </a>
          <button
            onClick={() => { setLinkSent(false); setEmail(''); setFirstName(''); setLastName('') }}
            style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none', color: 'var(--tuc-maroon)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
            Use a different name
          </button>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#bbb' }}>
            © {new Date().getFullYear()} Techbridge University College · Design and Build a Nation
          </div>
        </div>
      </div>
    )
  }

  // Email entry form
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo-container">
          <img src={TUC_LOGO} alt="TUC Logo" className="login-logo" />
          <div className="login-school-name">Techbridge University College</div>
          <div className="login-system-name">Results Management System</div>
        </div>
        <div className="login-divider" />

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: 'var(--tuc-maroon)' }}>Sign In</div>
          <div style={{ fontSize: 12.5, color: 'var(--tuc-muted)', marginTop: 3 }}>Enter your name to receive a login link</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="first-name">First Name</label>
              <input id="first-name" className="form-control" type="text" placeholder="Daniel"
                value={firstName} onChange={e => setFirstName(e.target.value)} autoFocus required />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" htmlFor="last-name">Last Name</label>
              <input id="last-name" className="form-control" type="text" placeholder="Twum"
                value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: 14, marginTop: 8 }}>
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, borderTopColor: 'white' }} /> Sending…</>
              : 'Send Login Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#bbb' }}>
          © {new Date().getFullYear()} Techbridge University College · Design and Build a Nation
        </div>
      </div>
    </div>
  )
}
