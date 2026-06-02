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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // 1. Try URL parameter first (Safari/iframe fallback)
    const urlUser = params.get('user');
    
    // 2. Fallback to cookie
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
        
        // Clean up
        if (cookieValue) {
          document.cookie = 'omniextract_user=; max-age=0; path=/omniextract/';
        }
        if (urlUser) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    // Surface OAuth error from query string
    const oauthError = params.get('error');
    if (oauthError) {
      setError(`Google login failed: ${oauthError}`);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_KEY);
    onLogout?.();
  };

  if (authed) {
    return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
  }

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured.');
      return;
    }

    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/omniextract/callback`;
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

  return (
    <div style={{minHeight:'100vh',background:'#f7f5f0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif',padding:'16px'}}>
      <div style={{background:'#fff',padding:'40px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',marginBottom:'28px'}}>
          <div style={{width:'48px',height:'48px',background:'#8b1a1a',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'24px',flexShrink:0}}>📄</div>
          <h1 style={{fontSize:'22px',fontWeight:'700',color:'#1a1f3c',margin:0}}>OmniExtract</h1>
          <p style={{fontSize:'14px',color:'#6b7280',margin:0,textAlign:'center'}}>AI-powered PDF data extraction</p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width:'100%',
            padding:'12px 16px',
            marginBottom:'16px',
            background:'#fff',
            border:'1.5px solid #d1d5e0',
            borderRadius:'8px',
            fontSize:'14px',
            fontWeight:'600',
            color:'#1a1f3c',
            cursor:'pointer',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'8px',
            transition:'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f9fafb';
            e.currentTarget.style.borderColor = '#b0b5c5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#fff';
            e.currentTarget.style.borderColor = '#d1d5e0';
          }}
        >
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
          </svg>
          Continue with Google
        </button>

        {error && (
          <div style={{padding:'12px',background:'#fee2e2',border:'1px solid #fecaca',borderRadius:'8px',color:'#991b1b',fontSize:'13px',marginTop:'16px',textAlign:'center'}}>
            {error}
          </div>
        )}

        <p style={{fontSize:'12px',color:'#8b90b8',textAlign:'center',margin:'16px 0 0 0',lineHeight:'1.5'}}>
          We use Google authentication to protect our tools from automated attacks.
        </p>
      </div>
    </div>
  );
}
