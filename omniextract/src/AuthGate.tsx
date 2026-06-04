import React, { useEffect, useState, createContext, useContext } from 'react';

const AUTH_KEY = 'tuc_auth_omniextract';
const USER_KEY = 'omniextract_user';

const AuthContext = createContext<{ handleLogout: () => void } | null>(null);

export function useLogout() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useLogout must be used inside AuthGate');
  return ctx.handleLogout;
}

interface User {
  id?: string;
  name?: string;
  email: string;
}

// ── Floating document SVG ──────────────────────────────────────
const DocIcon = ({ style }: { style: React.CSSProperties }) => (
  <svg viewBox="0 0 56 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
    <rect width="56" height="72" rx="6" fill="#1e293b" />
    <path d="M36 0H6C2.69 0 0 2.69 0 6v60c0 3.31 2.69 6 6 6h44c3.31 0 6-2.69 6-6V20L36 0z" fill="#1e3a5f" />
    <path d="M36 0v14a6 6 0 0 0 6 6h14L36 0z" fill="#2563eb" opacity="0.6" />
    <rect x="10" y="28" width="28" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.5" />
    <rect x="10" y="34" width="22" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.35" />
    <rect x="10" y="40" width="26" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.35" />
    <rect x="10" y="46" width="18" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.25" />
    <rect x="10" y="52" width="24" height="2.5" rx="1.25" fill="#60a5fa" opacity="0.25" />
  </svg>
);

// ── Data particle label ────────────────────────────────────────
const DataLabel = ({
  text, delay, color, style,
}: { text: string; delay: number; color: string; style?: React.CSSProperties }) => (
  <span style={{
    position: 'absolute',
    fontSize: '11px',
    fontWeight: 700,
    fontFamily: 'monospace',
    color,
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
    animation: `dataEmanate 3.5s ease-out infinite ${delay}s`,
    opacity: 0,
    ...style,
  }}>{text}</span>
);

export function AuthGate({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY)
  );
  const [, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try { return JSON.parse(stored) as User; }
    catch { localStorage.removeItem(USER_KEY); return null; }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setCardVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlUser = params.get('user');
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('omniextract_user='))
      ?.split('=')[1];
    const encodedData = urlUser || cookieValue;

    if (encodedData) {
      try {
        const userData = JSON.parse(atob(decodeURIComponent(encodedData))) as User;
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(userData);
        setAuthed(true);
        if (cookieValue) document.cookie = 'omniextract_user=; max-age=0; path=/omniextract/';
        if (urlUser) window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    const oauthError = params.get('error');
    if (oauthError) setError(`Google login failed: ${oauthError}`);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    // Also clear the OAuth cookie so a stale cookie doesn't re-auth on next render.
    document.cookie = 'omniextract_user=; max-age=0; path=/omniextract/';
    // Reset React state so the gate re-renders to the login screen immediately —
    // clearing storage alone left `authed` true, so Sign Out appeared to do nothing.
    setUser(null);
    setAuthed(false);
    onLogout?.();
  };

  if (authed) {
    return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError('Google login is not configured.'); return; }
    setLoading(true);
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/omniextract/callback`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    const p = new URLSearchParams({
      client_id: clientId, redirect_uri: redirectUri,
      response_type: 'code', scope: 'openid email profile',
      prompt: 'select_account', state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(-4deg); }
          50%      { transform: translateY(-28px) rotate(2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(6deg); }
          50%      { transform: translateY(22px) rotate(-3deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          33%      { transform: translateY(-18px) rotate(4deg); }
          66%      { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes dataEmanate {
          0%   { opacity: 0; transform: translate(0,0) scale(0.7); }
          15%  { opacity: 1; transform: translate(6px,-8px) scale(1); }
          75%  { opacity: 0.7; transform: translate(20px,-22px) scale(1.05); }
          100% { opacity: 0; transform: translate(28px,-32px) scale(1.1); }
        }
        @keyframes scanLine {
          0%   { top: 28px; opacity: 0.8; }
          90%  { top: 64px; opacity: 0.8; }
          100% { top: 64px; opacity: 0; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGlow {
          0%,100% { box-shadow: 0 0 0 0 rgba(37,99,235,0.3); }
          50%      { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
        }
        @keyframes driftParticle {
          0%   { transform: translate(0,0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
        }
        @keyframes gridPulse {
          0%,100% { opacity: 0.04; }
          50%      { opacity: 0.07; }
        }
        .omni-doc {
          position: absolute;
          pointer-events: none;
          filter: drop-shadow(0 8px 24px rgba(0,0,0,0.5));
        }
        .omni-btn:hover {
          background: #f0f4ff !important;
          border-color: #2563eb !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(37,99,235,0.2);
        }
        .omni-btn:active { transform: translateY(0); }
        .omni-btn:disabled { opacity: 0.6; cursor: wait; }
      `}</style>

      {/* ── Full-screen background ── */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #06101e 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Inter", system-ui, sans-serif',
        padding: '16px', position: 'relative', overflow: 'hidden',
      }}>

        {/* Dot-grid background */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(96,165,250,0.12) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          animation: 'gridPulse 6s ease-in-out infinite',
        }} />

        {/* Ambient glow blobs */}
        <div style={{ position:'absolute', width:'600px', height:'600px', borderRadius:'50%', background:'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', top:'-100px', left:'-100px', zIndex:0 }} />
        <div style={{ position:'absolute', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)', bottom:'-80px', right:'-80px', zIndex:0 }} />

        {/* ── Floating documents ── */}

        {/* Doc 1 — top-left large */}
        <div style={{ position:'absolute', top:'8%', left:'8%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:72, animation:'floatA 9s ease-in-out infinite' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, #60a5fa, transparent)', animation:'scanLine 2.5s ease-in-out infinite 0.5s' }} />
          </div>
          <div style={{ position:'relative', height:0 }}>
            <DataLabel text="emails: 47" delay={0}   color="#34d399" style={{ top:'-90px', left:'70px' }} />
            <DataLabel text="@gmail.com" delay={1.1} color="#60a5fa" style={{ top:'-70px', left:'78px' }} />
            <DataLabel text="CSV ✓" delay={2.2}       color="#a78bfa" style={{ top:'-50px', left:'65px' }} />
          </div>
        </div>

        {/* Doc 2 — mid-left */}
        <div style={{ position:'absolute', top:'58%', left:'12%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:52, animation:'floatB 12s ease-in-out infinite 1s' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ position:'relative', height:0 }}>
            <DataLabel text="Invoice #" delay={0.3} color="#fbbf24" style={{ top:'-80px', left:'55px' }} />
            <DataLabel text="$4,200.00" delay={1.4} color="#34d399" style={{ top:'-60px', left:'60px' }} />
          </div>
        </div>

        {/* Doc 3 — top-right large */}
        <div style={{ position:'absolute', top:'12%', right:'10%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:80, animation:'floatC 11s ease-in-out infinite 2s' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg, transparent, #a78bfa, transparent)', animation:'scanLine 3s ease-in-out infinite 1s' }} />
          </div>
          <div style={{ position:'relative', height:0 }}>
            <DataLabel text="JSON ✓"    delay={0.6} color="#a78bfa" style={{ top:'-95px', right:'75px' }} />
            <DataLabel text="parse: ok"  delay={1.7} color="#60a5fa" style={{ top:'-75px', right:'80px' }} />
            <DataLabel text="rows: 128"  delay={2.8} color="#34d399" style={{ top:'-55px', right:'70px' }} />
          </div>
        </div>

        {/* Doc 4 — bottom-right */}
        <div style={{ position:'absolute', bottom:'12%', right:'8%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:60, animation:'floatA 10s ease-in-out infinite 3s' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
          </div>
          <div style={{ position:'relative', height:0 }}>
            <DataLabel text="vendor:"    delay={0.2} color="#fbbf24" style={{ top:'-85px', right:'62px' }} />
            <DataLabel text="TUC Ltd"    delay={1.3} color="#60a5fa" style={{ top:'-65px', right:'68px' }} />
          </div>
        </div>

        {/* Doc 5 — center-left subtle */}
        <div style={{ position:'absolute', top:'35%', left:'4%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:40, opacity:0.5, animation:'floatB 14s ease-in-out infinite 4s' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
          </div>
        </div>

        {/* Doc 6 — bottom-left subtle */}
        <div style={{ position:'absolute', bottom:'8%', left:'20%', zIndex:1 }}>
          <div className="omni-doc" style={{ width:36, opacity:0.4, animation:'floatC 13s ease-in-out infinite 2.5s' }}>
            <DocIcon style={{ width:'100%', height:'auto' }} />
          </div>
        </div>

        {/* ── Login card ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          background: '#ffffff',
          padding: '40px 36px',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
          width: '100%', maxWidth: '400px',
          animation: cardVisible ? 'cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>

          {/* Logo */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', marginBottom:'32px' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #8b1a1a 0%, #b91c1c 100%)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px',
              boxShadow: '0 4px 16px rgba(139,26,26,0.4)',
              animation: 'pulseGlow 3s ease-in-out infinite',
            }}>📄</div>
            <div style={{ textAlign:'center' }}>
              <h1 style={{ fontSize:'22px', fontWeight:700, color:'#0f172a', margin:'0 0 4px 0', letterSpacing:'-0.3px' }}>OmniExtract</h1>
              <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>AI-powered PDF data extraction</p>
            </div>
          </div>

          {/* Divider with label */}
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
            <span style={{ fontSize:'11px', color:'#94a3b8', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase' }}>Sign in to continue</span>
            <div style={{ flex:1, height:'1px', background:'#e2e8f0' }} />
          </div>

          {/* Google button */}
          <button
            className="omni-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '13px 16px',
              background: '#fff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              fontSize: '14px', fontWeight: 600, color: '#0f172a',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              transition: 'all 0.18s ease',
              outline: 'none',
            }}
          >
            {loading ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                </path>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {loading ? 'Redirecting to Google…' : 'Continue with Google'}
          </button>

          {error && (
            <div style={{
              marginTop: '16px', padding: '12px 14px',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '8px', color: '#991b1b',
              fontSize: '13px', textAlign: 'center', lineHeight: 1.5,
            }}>{error}</div>
          )}

          <p style={{ fontSize:'12px', color:'#94a3b8', textAlign:'center', margin:'20px 0 0 0', lineHeight:1.6 }}>
            🔒 Protected by Google OAuth 2.0 — your credentials are never stored.
          </p>
        </div>
      </div>
    </>
  );
}
