import React, { useEffect, useState, createContext, useContext } from 'react';

const AUTH_KEY = 'tuc_auth_willpro';
const USER_KEY = 'willpro_user';
const ACCENT   = '#B58A3D';

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

export function AuthGate({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY)
  );
  const [, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Hydrate from server-set cookie after OAuth callback (one-shot)
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('willpro_user='))
      ?.split('=')[1];
    if (cookieValue) {
      try {
        const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as User & { username?: string };
        const normalized: User = {
          id: userData.id,
          name: userData.name || userData.username,
          email: userData.email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(normalized));
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(normalized);
        setAuthed(true);
        document.cookie = 'willpro_user=; max-age=0; path=/willpro/';
      } catch (e) {
        console.error('Failed to parse user cookie:', e);
      }
    }

    // Surface OAuth error from query string
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) {
      setError(`Google login failed: ${oauthError}`);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('oauth_token_temp');
    setAuthed(false);
    // Stay on WillPro — navigate to root so the login screen shows
    const redirectPath = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? '/'
      : '/willpro/';
    window.location.replace(redirectPath);
  };

  if (authed) {
    return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use staff credentials instead.');
      return;
    }

    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/willpro/callback`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'radial-gradient(circle at 10% 20%, #FAF9F6 0%, #EFEFEA 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'"Plus Jakarta Sans",system-ui,sans-serif'}}>
      <div style={{background:'rgba(255, 255, 255, 0.85)',padding:'40px',borderRadius:'20px',border:'1px solid rgba(181, 138, 61, 0.22)',boxShadow:'0 20px 50px rgba(181, 138, 61, 0.1)',backdropFilter:'blur(16px)',WebkitBackdropFilter:'blur(16px)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:'linear-gradient(135deg, #B58A3D, #9F762E)',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>🖋️</div>
          <h1 style={{fontSize:'22px',fontWeight:'700',color:'#1F2937',fontFamily:'"Space Grotesk",sans-serif',margin:0}}>Willpro</h1>
        </div>
        <p style={{fontSize:'13px',color:'var(--text-secondary)',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{width:'100%',padding:'11px',background:'#fff',color:'#1F2937',border:'1.5px solid rgba(181, 138, 61, 0.25)',borderRadius:'8px',fontSize:'14px',fontWeight:'700',cursor:'pointer',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',transition:'all 0.2s'}}
          onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(181, 138, 61, 0.05)';
              e.currentTarget.style.borderColor = '#B58A3D';
          }}
          onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.borderColor = 'rgba(181, 138, 61, 0.25)';
          }}
        >
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'16px'}}>
          <div style={{height:'1px',background:'rgba(181, 138, 61, 0.15)',flex:1}} />
          <span style={{fontSize:'11px',color:'var(--text-secondary)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.05em'}}>Or</span>
          <div style={{height:'1px',background:'rgba(181, 138, 61, 0.15)',flex:1}} />
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'16px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#1F2937',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #CBD5E1',borderRadius:'8px',fontSize:'14px',outline:'none',background:'rgba(255, 255, 255, 0.9)',color:'#1F2937',boxSizing:'border-box',transition:'all 0.2s'}}
              onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#B58A3D';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(181, 138, 61, 0.2)';
              }}
              onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{marginBottom:'18px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'600',color:'#1F2937',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'10px 14px',border:'1px solid #CBD5E1',borderRadius:'8px',fontSize:'14px',outline:'none',background:'rgba(255, 255, 255, 0.9)',color:'#1F2937',boxSizing:'border-box',transition:'all 0.2s'}}
              onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#B58A3D';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(181, 138, 61, 0.2)';
              }}
              onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 14px 0',fontWeight:500}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'11px',background:'linear-gradient(135deg, #B58A3D, #9F762E)',color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'700',cursor:'pointer',boxShadow:'0 4px 14px rgba(181, 138, 61, 0.25)',transition:'all 0.2s'}}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(181, 138, 61, 0.35)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(181, 138, 61, 0.25)';
            }}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'var(--text-secondary)',textAlign:'center',marginTop:'18px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}
