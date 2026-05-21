import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FormLoginViewBase } from '../components/FormLoginViewBase';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.error('Google login is not configured');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/willpro/callback`;
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
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      throw new Error(result.message || 'Invalid credentials');
    }
  };

  return (
    <FormLoginViewBase
      appName="Staff Portal"
      appSubtitle="Sign in with your TUC credentials"
      primaryColor="text-[#630f12]"
      primaryColorHex="#630f12"
      borderColorClass="border border-gray-200"
      inputBorderClass="border border-gray-300"
      inputFocusRingClass="focus:ring-2 focus:ring-[#630f12]"
      inputFocusBorderClass="focus:border-[#630f12]"
      buttonHoverClass="hover:bg-[#7a1317]"
      backgroundClass="bg-slate-900"
      cardBgClass="bg-white"
      onGoogleLogin={handleGoogleLogin}
      onLocalLogin={handleLocalLogin}
      supportRegister={false}
      textColorClass="text-white"
      labelColorClass="text-white"
      subtitleColorClass="text-gray-300"
      videoBackground="https://techbridge.edu.gh/static/campus_tour.mp4"
    />
  );
}
