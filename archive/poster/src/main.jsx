import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Poster from "../poster.jsx";

// ── Admin ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'admin123';
const AUTH_SESSION_KEY = 'tuc_auth_poster';
const USER_KEY = 'poster_user';
const AUDIT_LOG_KEY = 'poster-audit';
function getAuditLogs() { try { return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]'); } catch { return []; } }
function appendAuditLog(action, details) {
  const logs = getAuditLogs();
  logs.unshift({ id: Date.now().toString(), timestamp: new Date().toISOString(), action, details });
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs.slice(0, 200)));
}

function AdminLoginModal({ onClose, onSuccess }) {
  const [pwd, setPwd] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  const completeOAuthLogin = async (accessToken) => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error('Failed to fetch user info');
      const userInfo = await res.json();
      const userData = { id: userInfo.id, name: userInfo.name, email: userInfo.email };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.removeItem('oauth_token_temp');
      sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      appendAuditLog('OAUTH_LOGIN_SUCCESS', userInfo.email);
      onSuccess();
    } catch (err) {
      setError('Google login failed. Please try again or use password.');
      appendAuditLog('OAUTH_LOGIN_FAIL', err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        completeOAuthLogin(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setLoading(false);
        appendAuditLog('OAUTH_ERROR', event.data.error);
      }
    };
    window.addEventListener('message', handleMessage);
    const fallback = window.setInterval(() => {
      const token = localStorage.getItem('oauth_token_temp');
      if (token) { completeOAuthLogin(token); window.clearInterval(fallback); }
    }, 100);
    return () => { window.removeEventListener('message', handleMessage); window.clearInterval(fallback); };
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) { setError('Google login not configured. Use password instead.'); return; }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId, redirect_uri: redirectUri, response_type: 'token',
      scope: 'openid email profile', prompt: 'select_account',
    });
    const authWindow = window.open(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 'oauth_popup', 'width=600,height=700');
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
    setLoading(true);
  };

  const handlePasswordSubmit = (e) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) { sessionStorage.setItem(AUTH_SESSION_KEY, '1'); localStorage.setItem(USER_KEY, JSON.stringify({ name: 'Staff', email: 'staff@techbridge.edu.gh' })); appendAuditLog('PASSWORD_LOGIN_SUCCESS'); onSuccess(); } else { appendAuditLog('PASSWORD_LOGIN_FAIL'); setError('Invalid password.'); setPwd(''); } };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="admin-login-title" style={{position:'fixed',inset:0,zIndex:50,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem'}}>
      <div style={{background:'#fff',borderRadius:'8px',padding:'2rem',width:'100%',maxWidth:'380px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
        <h2 id="admin-login-title" style={{fontSize:'1.1rem',fontWeight:700,marginBottom:'1.5rem',color:'#0A0A0A'}}>Admin Access</h2>
        <button onClick={handleGoogleLogin} disabled={loading} style={{width:'100%',padding:'0.7rem',background:'#fff',color:'#0A0A0A',border:'1px solid #d1d5db',borderRadius:'6px',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',marginBottom:'1rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'0.5rem'}}>
          <svg style={{width:'18px',height:'18px'}} viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'1rem'}}><div style={{height:'1px',background:'#e5e7eb',flex:1}} /><span style={{fontSize:'0.8rem',color:'#9ca3af',fontWeight:600}}>or</span><div style={{height:'1px',background:'#e5e7eb',flex:1}} /></div>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="admin-pwd" style={{display:'block',fontSize:'0.8rem',fontWeight:600,marginBottom:'0.4rem',color:'#374151'}}>Password (Staff)</label>
          <input id="admin-pwd" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(''); }} autoFocus required aria-describedby={error ? 'admin-err' : undefined} disabled={loading} style={{width:'100%',border:'1px solid #d1d5db',borderRadius:'6px',padding:'0.5rem 0.75rem',fontSize:'0.875rem',marginBottom:'0.5rem',boxSizing:'border-box'}} />
          {error && <p id="admin-err" role="alert" style={{color:'#ef4444',fontSize:'0.75rem',marginBottom:'0.5rem'}}>{error}</p>}
          <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem'}}>
            <button type="submit" disabled={loading} style={{flex:1,background:'#D0111B',color:'#fff',border:'none',borderRadius:'6px',padding:'0.6rem',fontSize:'0.875rem',fontWeight:600,cursor:'pointer',opacity:loading?0.7:1}}>Sign In</button>
            <button type="button" onClick={onClose} disabled={loading} style={{padding:'0.6rem 1rem',border:'1px solid #d1d5db',borderRadius:'6px',background:'#fff',fontSize:'0.875rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard({ onClose }) {
  const [logs, setLogs] = useState([]); const [tab, setTab] = useState('logs'); const [storageTest, setStorageTest] = useState('idle'); const [user, setUser] = useState(null);
  useEffect(() => { setLogs(getAuditLogs()); const stored = localStorage.getItem(USER_KEY); if (stored) { try { setUser(JSON.parse(stored)); } catch {} } }, []);
  const handleLogout = () => { appendAuditLog('ADMIN_LOGOUT'); sessionStorage.removeItem(AUTH_SESSION_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem('oauth_token_temp'); onClose(); };
  const runStorageTest = () => { try { localStorage.setItem('__diag__','1'); localStorage.removeItem('__diag__'); setStorageTest('pass'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: PASS'); } catch { setStorageTest('fail'); appendAuditLog('DIAGNOSTIC_RUN','localStorage: FAIL'); } };
  const s = {base:{position:'fixed',inset:0,zIndex:50,background:'#f9fafb',overflowY:'auto'},inner:{maxWidth:'900px',margin:'0 auto',padding:'2rem'},head:{display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #e5e7eb',paddingBottom:'1.5rem',marginBottom:'1.5rem'},h1:{fontSize:'1.1rem',fontWeight:700,color:'#0A0A0A'},logoutBtn:{padding:'0.5rem 1rem',background:'#fee2e2',color:'#b91c1c',border:'none',borderRadius:'6px',fontSize:'0.8rem',fontWeight:600,cursor:'pointer'},tabBtn:(active)=>({padding:'0.5rem 1rem',borderRadius:'6px',border:'none',fontSize:'0.85rem',fontWeight:500,cursor:'pointer',background:active?'#D0111B':'#e5e7eb',color:active?'#fff':'#374151'})};
  return (
    <div role="main" aria-label="Admin Dashboard" style={s.base}>
      <div style={s.inner}>
        <div style={s.head}>
          <div><h1 style={s.h1}>Admin Dashboard — Poster</h1>{user && <p style={{fontSize:'0.8rem',color:'#6b7280',marginTop:'0.5rem'}}>{user.name} ({user.email})</p>}</div>
          <button onClick={handleLogout} aria-label="Logout from admin" style={s.logoutBtn}>Logout</button>
        </div>
        <div role="tablist" aria-label="Admin sections" style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem'}}>
          {['logs','diagnostics'].map(t=><button key={t} role="tab" aria-selected={tab===t} onClick={()=>setTab(t)} style={s.tabBtn(tab===t)}>{t==='logs'?'Audit Log':'Diagnostics'}</button>)}
        </div>
        {tab==='logs' && <section aria-label="Audit log"><table style={{width:'100%',fontSize:'0.8rem',borderCollapse:'collapse'}} aria-label="Admin activity log"><thead><tr style={{background:'#f3f4f6'}}><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Timestamp</th><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Action</th><th scope="col" style={{padding:'0.5rem 1rem',textAlign:'left',fontSize:'0.7rem',color:'#6b7280'}}>Details</th></tr></thead><tbody>{logs.length===0?<tr><td colSpan={3} style={{padding:'2rem',textAlign:'center',color:'#9ca3af'}}>No entries yet.</td></tr>:logs.map(l=><tr key={l.id} style={{borderBottom:'1px solid #f3f4f6'}}><td style={{padding:'0.5rem 1rem',color:'#6b7280'}}>{new Date(l.timestamp).toLocaleString()}</td><td style={{padding:'0.5rem 1rem',color:'#D0111B',fontFamily:'monospace'}}>{l.action}</td><td style={{padding:'0.5rem 1rem',color:'#9ca3af'}}>{l.details||'—'}</td></tr>)}</tbody></table></section>}
        {tab==='diagnostics' && <section aria-label="System diagnostics"><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem',background:'#fff',border:'1px solid #e5e7eb',borderRadius:'6px'}}><div><p style={{fontWeight:600,fontSize:'0.875rem',marginBottom:'0.25rem'}}>LocalStorage Access</p><p style={{fontSize:'0.75rem',color:'#6b7280'}}>Verifies browser storage</p></div><div style={{display:'flex',gap:'0.75rem',alignItems:'center'}}>{storageTest!=='idle'&&<span role="status" style={{fontSize:'0.7rem',fontWeight:700,padding:'0.2rem 0.5rem',borderRadius:'4px',background:storageTest==='pass'?'#d1fae5':'#fee2e2',color:storageTest==='pass'?'#065f46':'#b91c1c'}}>{storageTest.toUpperCase()}</span>}<button onClick={runStorageTest} style={{padding:'0.4rem 0.75rem',background:'#fff',border:'1px solid #D0111B',color:'#D0111B',borderRadius:'4px',fontSize:'0.75rem',cursor:'pointer'}}>Run Test</button></div></div></section>}
      </div>
    </div>
  );
}

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    const check = () => { if (window.location.hash === '#/admin') { sessionStorage.getItem(AUTH_SESSION_KEY) === '1' ? setShowAdmin(true) : setShowAdminLogin(true); } };
    check(); window.addEventListener('hashchange', check); return () => window.removeEventListener('hashchange', check);
  }, []);
  const handleAdminClose = useCallback(() => { setShowAdmin(false); window.location.hash = ''; }, []);

  return (
    <>
    {showAdmin && <AdminDashboard onClose={handleAdminClose} />}
    {showAdminLogin && <AdminLoginModal onClose={() => { setShowAdminLogin(false); window.location.hash = ''; }} onSuccess={() => { setShowAdminLogin(false); setShowAdmin(true); }} />}
    <a href="#main-content" style={{position:'absolute',width:'1px',height:'1px',padding:0,margin:'-1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap',border:0}} onFocus={e=>{e.currentTarget.style.cssText='position:fixed;top:1rem;left:1rem;z-index:100;padding:0.5rem 1rem;background:#D0111B;color:#fff;border-radius:6px;text-decoration:none;'}}>Skip to main content</a>
    <div id="main-content" style={{display:'flex',flexDirection:'column',alignItems:'center',minHeight:'100vh',background:'#f5f5f5',padding:'2rem'}}>
      <Poster />
      <footer style={{marginTop:'1rem',fontSize:'0.7rem',color:'#9ca3af',textAlign:'center'}}>
        <button type="button" onClick={() => { window.location.hash = '#/admin'; }} aria-label="Open admin dashboard" style={{background:'none',border:'none',color:'inherit',cursor:'pointer',fontSize:'inherit'}}>Admin</button>
      </footer>
    </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
