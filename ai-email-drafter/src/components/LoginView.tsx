import React, { useState, useEffect } from 'react';
import { setOAuthAppContext, APP_NAME, APP_PATH } from '../utils/appContext';

export const LoginView: React.FC = () => {
  const [error, setError] = useState('');
  const [isOAuthCallback, setIsOAuthCallback] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('code')) {
      setIsOAuthCallback(true);
    }
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google sign-in is not configured. Contact the administrator.');
      return;
    }

    const redirectUri = `${window.location.origin}${APP_PATH}callback`;
    const state = Math.random().toString(36).substring(7);

    setOAuthAppContext(APP_NAME);
    sessionStorage.setItem('oauth_state', state);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      prompt: 'select_account',
      access_type: 'offline',
      state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  if (isOAuthCallback) {
    return (
      <div style={{minHeight:'100vh',background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',border:'4px solid rgba(59,130,246,0.2)',borderTop:'4px solid #3b82f6',borderRadius:'50%',margin:'0 auto 24px',animation:'spin 1s linear infinite'}} />
          <h2 style={{fontSize:'20px',fontWeight:'600',color:'#fff',margin:'0 0 8px 0'}}>Signing you in...</h2>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.7)',margin:0}}>Processing your Google credentials</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: 0 }}
      >
        <source src="https://techbridge.edu.gh/static/campus_tour.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }}></div>
      <div className="relative z-10 w-full">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">AI Email Drafter</h1>
          <p className="text-slate-300 text-sm">Compose better emails with Gemini</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Sign in to continue</h2>
          <p className="text-center text-slate-500 mb-6 text-sm">
            Use your Google account to access the email drafter
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {error && <p role="alert" className="mt-4 text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
      </div>
    </div>
  );
};
