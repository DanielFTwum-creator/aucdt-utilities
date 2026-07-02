import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FormLoginView } from './FormLoginView';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google login is not configured');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/youtube-genie/auth/google/callback`;
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
    try {
      await login(identifier, password);
    } catch (err: any) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      if (register) {
        await register(username, email, password);
      } else {
        await login({ name: username, email } as any, password);
      }
    } catch (err: any) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  return (
    <FormLoginView
      appName="Youtube Genie"
      appSubtitle="AI-Powered YouTube SEO Optimisation"
      primaryColorHex="#db2777"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      onRegister={handleRegister}
    />
  );
};
