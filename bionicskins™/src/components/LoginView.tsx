import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let oauthHandled = false;

    const handleOAuthToken = async (accessToken: string) => {
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        login({
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
        });
        localStorage.removeItem('oauth_token_temp');
      } catch {
        setError('Google login failed. Please try again.');
      }
    };

    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        handleOAuthToken(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed.');
      }
    };

    window.addEventListener('message', handleOAuthMessage);

    const fallback = window.setInterval(() => {
      const token = localStorage.getItem('oauth_token_temp');
      if (token) {
        handleOAuthToken(token);
        window.clearInterval(fallback);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleOAuthMessage);
      window.clearInterval(fallback);
    };
  }, [login]);

  const handleOAuthClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account',
    });

    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) login(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
      <div className="w-full max-w-md mx-4 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[#164975]">
          Welcome
        </h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleOAuthClick}
          className="w-full mb-6 px-4 py-3 bg-[#164975] text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#164975]"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Continue with Email
          </button>
        </form>
      </div>
    </div>
  );
};
