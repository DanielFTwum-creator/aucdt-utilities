import React, { useEffect, useState, createContext, useContext } from 'react';

const AUTH_KEY = 'tuc_auth_willpro';
const USER_KEY = 'willpro_user';
const ACCENT   = '#ea580c';

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
    let oauthHandled = false;

    const completeOAuthLogin = async (accessToken: string) => {
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        setLoading(true);
        setError('');
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        const userData: User = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.removeItem('oauth_token_temp');
        sessionStorage.setItem(AUTH_KEY, '1');
        setUser(userData);
        setAuthed(true);
      } catch {
        setError('Google login failed. Please try again.');
        setLoading(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        completeOAuthLogin(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);

    const fallback = window.setInterval(() => {
      const token = localStorage.getItem('oauth_token_temp');
      if (token) {
        completeOAuthLogin(token);
        window.clearInterval(fallback);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.clearInterval(fallback);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('oauth_token_temp');
    onLogout?.();
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
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
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
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Willpro</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{width:'100%',padding:'10px',background:'#fff',color:'#0f172a',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer',marginBottom:'16px',display:'flex',alignItems:'center',justifyContent:'center',gap:'10px'}}
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
          <div style={{height:'1px',background:'#e5e7eb',flex:1}} />
          <span style={{fontSize:'11px',color:'#94a3b8',fontWeight:600,textTransform:'uppercase'}}>Or</span>
          <div style={{height:'1px',background:'#e5e7eb',flex:1}} />
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}
