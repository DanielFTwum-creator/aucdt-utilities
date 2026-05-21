import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FormLoginView } from './FormLoginViewBase';

export const BiochemAILoginView: React.FC = () => {
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== 'OAUTH_TOKEN_SUCCESS') return;
      const { access_token } = event.data;
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
      } catch (err) {
        setError('Google login failed. Please try again.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
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

  const MolecularWatermark = () => (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.07, zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Benzene ring - center */}
      <g stroke="#a78bfa" strokeWidth="1.5" fill="none">
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 500 + 80 * Math.cos(rad);
          const y = 500 + 80 * Math.sin(rad);
          return <circle key={`vertex-${angle}`} cx={x} cy={y} r="8" />;
        })}
        <polygon points="580,420 660,450 660,530 580,580 500,550 500,470" />
        <circle cx="500" cy="500" r="20" strokeDasharray="4 3" />
        <circle cx="500" cy="500" r="5" fill="#a78bfa" />
      </g>
      {/* Orbital rings */}
      <g stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.6">
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(-30 500 500)" />
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(30 500 500)" />
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(90 500 500)" />
      </g>
    </svg>
  );

  return (
    <FormLoginView
      appName="BiochemAI"
      appSubtitle="Molecular Intelligence Lab"
      primaryColor="text-[#a78bfa]"
      primaryColorHex="#a78bfa"
      borderColorClass="border border-[rgba(167,139,250,0.2)]"
      inputBorderClass="border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.06)]"
      inputFocusRingClass="focus:ring-4 focus:ring-[rgba(167,139,250,0.3)]"
      inputFocusBorderClass="focus:border-[#a78bfa]"
      buttonHoverClass="hover:opacity-90"
      backgroundClass="bg-slate-900"
      cardBgClass="bg-[rgba(255,255,255,0.05)] backdrop-blur-lg"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      onRegister={handleRegister}
      textColorClass="text-white"
      labelColorClass="text-[rgba(255,255,255,0.8)]"
      subtitleColorClass="text-[rgba(255,255,255,0.6)]"
      watermarkSvg={<MolecularWatermark />}
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
    />
  );
};
