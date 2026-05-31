import React, { useEffect, useState } from 'react';
import { useAuth } from './src/auth/AuthContext';
import { FormLoginView } from './src/auth/FormLoginViewBase';
import { APP_NAME, setOAuthAppContext, APP_PATH } from './src/auth/appContext';

// Set this app's context for OAuth redirects (must match appContext APP_NAME)
setOAuthAppContext('dictation');

const AudioWatermark = () => (
  <svg
    className="fixed inset-0 w-full h-full pointer-events-none"
    style={{ opacity: 0.05, zIndex: 0 }}
    viewBox="0 0 1000 1000"
    preserveAspectRatio="xMidYMid slice"
  >
    {/* Ripple 1: Center circle */}
    <circle cx="500" cy="500" r="60" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
    {/* Ripple 2: Concentric dashed circle */}
    <circle cx="500" cy="500" r="120" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
    {/* Ripple 3: Outer circle */}
    <circle cx="500" cy="500" r="180" stroke="#a78bfa" strokeWidth="1.5" fill="none" />
    
    {/* Concentric soundwaves / vertical bar ripples */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
      const rad = (angle * Math.PI) / 180;
      const x1 = 500 + 200 * Math.cos(rad);
      const y1 = 500 + 200 * Math.sin(rad);
      
      const scale = 1 + Math.sin(angle * 2) * 0.4;
      const rx1 = 500 + (200 + 30 * scale) * Math.cos(rad);
      const ry1 = 500 + (200 + 30 * scale) * Math.sin(rad);
      
      return (
        <line
          key={`wave-${angle}`}
          x1={x1}
          y1={y1}
          x2={rx1}
          y2={ry1}
          stroke="#a78bfa"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
    })}
    
    {/* Micro-waveform curves flowing horizontally through center */}
    <path
      d="M 100,500 Q 250,420 400,500 T 700,500 T 900,500"
      stroke="#a78bfa"
      strokeWidth="1.5"
      fill="none"
      opacity="0.5"
      strokeDasharray="5 5"
    />
    <path
      d="M 100,500 Q 200,560 350,500 T 600,500 T 900,500"
      stroke="#a78bfa"
      strokeWidth="1"
      fill="none"
      opacity="0.3"
    />
  </svg>
);

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login, register } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if we're in Cypress test mode
  const isTestMode = typeof window !== 'undefined' && 
    ((window as any).__CYPRESS_TEST_MODE__ === true || 
     localStorage.getItem('__CYPRESS_TEST_MODE__') === 'true');

  useEffect(() => {
    // Small delay to allow AuthContext to hydrate from storage/cookies
    const timer = setTimeout(() => setIsInitializing(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google login is not configured');
      return;
    }

    const redirectUri = `${window.location.origin}${APP_PATH}callback`;
    const state = Math.random().toString(36).substring(7);

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

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isTestMode) {
    return (
      <FormLoginView
        appName="Dictation Studio"
        appSubtitle="AI-powered voice transcription & polish"
        primaryColor="text-[#00D4FF]"
        primaryColorHex="#00D4FF"
        borderColorClass="border border-[rgba(0,212,255,0.18)]"
        inputBorderClass="border border-[rgba(0,212,255,0.15)] bg-[rgba(13,21,40,0.6)]"
        inputFocusRingClass="focus:ring-4 focus:ring-[rgba(0,212,255,0.2)]"
        inputFocusBorderClass="focus:border-[#00D4FF]"
        buttonHoverClass="hover:shadow-[0_0_24px_rgba(0,212,255,0.35)] hover:-translate-y-0.5"
        backgroundClass="bg-[#080C14]"
        cardBgClass="bg-[rgba(13,21,40,0.82)] backdrop-blur-[20px]"
        onGoogleLogin={handleGoogleLogin}
        onLocalLogin={async (id, pwd) => {
          const res = await login(id, pwd);
          if (!res.success) throw new Error(res.message);
        }}
        onRegister={async (user, email, pwd) => {
          const res = await register(user, email, pwd);
          if (!res.success) throw new Error(res.message);
        }}
        textColorClass="text-[#E8F0FE]"
        labelColorClass="text-[rgba(232,240,254,0.8)]"
        subtitleColorClass="text-[rgba(232,240,254,0.5)]"
        supportRegister={true}
        watermarkSvg={<AudioWatermark />}
      />
    );
  }

  return <>{children}</>;
};
