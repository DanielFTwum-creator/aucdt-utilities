import React, { useEffect, useState } from 'react';
import { useAuth } from './src/auth/AuthContext';
import { FormLoginView } from './src/auth/FormLoginViewBase';
import { APP_NAME, setOAuthAppContext, APP_PATH } from './src/auth/appContext';

// Set this app's context for OAuth redirects (must match appContext APP_NAME)
setOAuthAppContext('dictation');

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, login, register } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if we're in Cypress test mode
  const isTestMode = typeof window !== 'undefined' && (window as any).__CYPRESS_TEST_MODE__ === true;

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
        appName="Dictation App"
        appSubtitle="AI-powered voice transcription & polish"
        primaryColor="text-amber-500"
        primaryColorHex="#d97706"
        borderColorClass="border border-white/20"
        inputBorderClass="border border-white/10"
        inputFocusRingClass="focus:ring-4 focus:ring-white/20"
        inputFocusBorderClass="focus:border-white/30"
        buttonHoverClass="hover:bg-red-700"
        backgroundClass="bg-cover bg-center bg-no-repeat relative"
        cardBgClass="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl"
        videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
        onGoogleLogin={handleGoogleLogin}
        onLocalLogin={async (id, pwd) => {
          const res = await login(id, pwd);
          if (!res.success) throw new Error(res.message);
        }}
        onRegister={async (user, email, pwd) => {
          const res = await register(user, email, pwd);
          if (!res.success) throw new Error(res.message);
        }}
        textColorClass="text-white"
        labelColorClass="text-white/90"
        subtitleColorClass="text-white/70"
        supportRegister={true}
      />
    );
  }

  return <>{children}</>;
};
