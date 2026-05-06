import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_thumbnail_generator';
const ACCENT   = '#db2777';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div role="main" aria-label="Thumbnail Generator login" style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div role="dialog" aria-modal="true" aria-labelledby="auth-title" style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div aria-hidden="true" style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 id="auth-title" style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Thumbnail Generator</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit} aria-label="Sign in form">
          <div style={{marginBottom:'14px'}}>
            <label htmlFor="tg-username" style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              id="tg-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              aria-required="true"
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label htmlFor="tg-password" style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              id="tg-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              aria-required="true"
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p role="alert" aria-live="assertive" style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            aria-label="Sign in to Thumbnail Generator"
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
