import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FormLoginView } from './FormLoginView';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
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
      console.error('Google login is not configured');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/blueprint/callback`;
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

  const handleLocalLogin = async (identifier: string, password: string) => {
    const result = await login(identifier, password);
    if (!result.success) {
      throw new Error(result.message || 'Login failed');
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    const result = await register(username, email, password);
    if (!result.success) {
      throw new Error(result.message || 'Registration failed');
    }
  };

  if (isOAuthCallback) {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:'56px',height:'56px',border:'4px solid rgba(255,255,255,0.2)',borderTop:'4px solid #fff',borderRadius:'50%',margin:'0 auto 24px',animation:'spin 1s linear infinite'}} />
          <h2 style={{fontSize:'20px',fontWeight:'600',color:'#fff',margin:'0 0 8px 0'}}>Signing you in...</h2>
          <p style={{fontSize:'14px',color:'rgba(255,255,255,0.8)',margin:0}}>Processing your Google credentials</p>
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
    <FormLoginView
      appName="TUC Blueprint"
      appSubtitle="Techbridge University College Innovation Hub"
      primaryColor="text-blue-700"
      primaryColorHex="#2563eb"
      borderColorClass="border border-blue-200"
      inputBorderClass="border border-slate-300"
      inputFocusRingClass="focus:ring-4 focus:ring-blue-100"
      inputFocusBorderClass="focus:border-blue-600"
      buttonHoverClass="hover:bg-blue-700"
      backgroundClass="bg-slate-900"
      cardBgClass="bg-white"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      onRegister={handleRegister}
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
      textColorClass="text-white"
      labelColorClass="text-white"
      subtitleColorClass="text-gray-300"
    />
  );
};
