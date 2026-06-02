import React, { useEffect, useState, createContext, useContext } from 'react';
const AUTH_KEY = 'tuc_auth_groove_streamer';
const USER_KEY = 'groove_streamer_user';
const AuthContext = createContext<{ handleLogout: () => void } | null>(null);
export function useLogout() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useLogout must be used inside AuthGate'); return ctx.handleLogout; }
interface User { id?: string; name?: string; email: string; }
export function AuthGate({ children, onLogout }: { children: React.ReactNode; onLogout?: () => void }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1' || !!localStorage.getItem(USER_KEY));
  const [, setUser] = useState<User | null>(() => { const stored = localStorage.getItem(USER_KEY); if (!stored) return null; try { return JSON.parse(stored) as User; } catch { localStorage.removeItem(USER_KEY); return null; } });
  const [error, setError] = useState('');
  useEffect(() => {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith('groove_streamer_user='))?.split('=')[1];
    if (cookieValue) { try { const userData = JSON.parse(atob(decodeURIComponent(cookieValue))) as User; localStorage.setItem(USER_KEY, JSON.stringify(userData)); sessionStorage.setItem(AUTH_KEY, '1'); setUser(userData); setAuthed(true); document.cookie = 'groove_streamer_user=; max-age=0; path=/groove-streamer/'; } catch (e) { console.error('Failed to parse user cookie:', e); } }
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get('error');
    if (oauthError) setError(`Google login failed: ${oauthError}`);
  }, []);
  const handleLogout = () => { sessionStorage.removeItem(AUTH_KEY); localStorage.removeItem(USER_KEY); onLogout?.(); };
  if (authed) return <AuthContext.Provider value={{ handleLogout }}>{children}</AuthContext.Provider>;
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError('Google login is not configured.'); return; }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/groove-streamer/callback`;
    const state = Math.random().toString(36).substring(7);
    sessionStorage.setItem('oauth_state', state);
    const p = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: 'code', scope: 'openid email profile', prompt: 'select_account', state });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${p}`;
  };
  return (
    <div style={{minHeight:'100vh',background:'#f7f5f0',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif',padding:'16px'}}>
      <div style={{background:'#fff',padding:'40px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'12px',marginBottom:'28px'}}>
          <div style={{width:'48px',height:'48px',background:'#1a1f3c',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'24px'}}>🔒</div>
          <h1 style={{fontSize:'22px',fontWeight:'700',color:'#1a1f3c',margin:0}}>Techbridge AI Tools</h1>
          <p style={{fontSize:'14px',color:'#6b7280',margin:0,textAlign:'center'}}>Sign in to continue</p>
        </div>
        <button onClick={handleGoogleLogin} style={{width:'100%',padding:'12px 16px',marginBottom:'16px',background:'#fff',border:'1.5px solid #d1d5e0',borderRadius:'8px',fontSize:'14px',fontWeight:'600',color:'#1a1f3c',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'}}>
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        {error && <div style={{padding:'12px',background:'#fee2e2',border:'1px solid #fecaca',borderRadius:'8px',color:'#991b1b',fontSize:'13px',marginTop:'16px',textAlign:'center'}}>{error}</div>}
        <p style={{fontSize:'12px',color:'#8b90b8',textAlign:'center',margin:'16px 0 0 0',lineHeight:'1.5'}}>We use Google authentication to protect our tools.</p>
      </div>
    </div>
  );
}
