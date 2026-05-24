import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { setOAuthAppContext, APP_NAME, APP_PATH } from '../utils/appContext';
import { FormLoginView } from './FormLoginView';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google login is not configured');
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

  return (
    <FormLoginView
      appName="TUC AI Lab"
      appSubtitle="Strategic AI solutions for West Africa"
      primaryColor="text-red-700"
      primaryColorHex="#8b1a1a"
      borderColorClass="border border-yellow-400"
      inputBorderClass="border border-yellow-300"
      inputFocusRingClass="focus:ring-4 focus:ring-yellow-200"
      inputFocusBorderClass="focus:border-yellow-400"
      buttonHoverClass="hover:bg-red-800"
      backgroundClass="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900"
      cardBgClass="bg-white"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      onRegister={handleRegister}
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
      textColorClass="text-slate-900"
      labelColorClass="text-slate-700"
      subtitleColorClass="text-slate-600"
      supportRegister={true}
    />
  );
};
