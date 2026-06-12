import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import StudentPortal from './StudentPortal';
import AdminDashboard from './AdminDashboard';
import LoginPage from './LoginPage';
import { exchange, silentSession, setAccessToken, wmsLogout, isAdminRole } from './wmsAuth';

// Served at wms.techbridge.edu.gh/lems/ — the WMS SSO callback lands on
// /lems/auth/callback?code|mfa_ticket|error (SPA fallback), handled on boot.
const APP_PATH = '/lems/';

function App() {
  const [user, setUser] = useState(null);          // {email, name, role}
  const [booting, setBooting] = useState(true);
  const [wmsError, setWmsError] = useState(null);
  const [mfaTicket, setMfaTicket] = useState(null);
  const [theme, setTheme] = useState('light');
  const ran = useRef(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);

    if (ran.current) return;                        // StrictMode double-run guard
    ran.current = true;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const ticket = params.get('mfa_ticket');
      const err = params.get('error');
      if (code || ticket || err) window.history.replaceState(null, '', APP_PATH);

      try {
        if (err) { setWmsError(err); return; }
        if (ticket) { setMfaTicket(ticket); return; }
        if (code) {
          try { adoptSession(await exchange(code)); }
          catch { setWmsError('oauth'); }
          return;
        }
        const session = await silentSession();      // shared fleet cookie
        if (session) adoptSession(session);
      } finally {
        setBooting(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adoptSession = (session) => {
    setAccessToken(session.access_token);
    setUser(session.user);
    setMfaTicket(null);
    setWmsError(null);
    setBooting(false);
  };

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogout = () => {
    wmsLogout();                                    // clears the fleet cookie
    setAccessToken(null);
    setUser(null);
  };

  if (booting) {
    return (
      <div className="app" data-theme={theme}
           style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p>Signing you in…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="app" data-theme={theme}>
        <LoginPage wmsError={wmsError} mfaTicket={mfaTicket}
                   onMfaTicket={setMfaTicket} onSession={adoptSession} />
      </div>
    );
  }

  const admin = isAdminRole(user.role);

  return (
    <Router basename="/lems">
      <div className="app" data-theme={theme}>
        <Routes>
          <Route path="/"
            element={<StudentPortal theme={theme} onThemeChange={handleThemeChange} />} />
          <Route path="/auth/callback" element={<Navigate to="/" replace />} />
          <Route path="/admin/*"
            element={admin
              ? <AdminDashboard theme={theme} onThemeChange={handleThemeChange} onLogout={handleLogout} />
              : <NotAdmin email={user.email} onLogout={handleLogout} />} />
        </Routes>
      </div>
    </Router>
  );
}

function NotAdmin({ email, onLogout }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <h2>Administrators only</h2>
        <p>{email} does not have LEMS admin access.<br />
          The evaluation form is on the <a href="/lems/">home page</a>.</p>
        <button type="button" onClick={onLogout}
          style={{ marginTop: 12, padding: '8px 18px', cursor: 'pointer' }}>Sign out</button>
      </div>
    </div>
  );
}

export default App;
