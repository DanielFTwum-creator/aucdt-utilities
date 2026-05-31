import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FormLoginView } from './FormLoginViewBase';

export const BiochemAILoginView: React.FC = () => {
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/biochemai/callback`;
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

  return (
    <FormLoginView
      appName="BiochemAI"
      appSubtitle="Molecular Intelligence Lab"
      primaryColor="text-[#7C3AED]"
      primaryColorHex="#7C3AED"
      borderColorClass="border border-[rgba(124,58,237,0.15)]"
      inputBorderClass="border border-[rgba(124,58,237,0.2)] bg-[#F5F3FF]/30"
      inputFocusRingClass="focus:ring-3 focus:ring-[rgba(124,58,237,0.15)]"
      inputFocusBorderClass="focus:border-[#7C3AED]"
      buttonHoverClass="hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)]"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      onRegister={handleRegister}
    />
  );
};
