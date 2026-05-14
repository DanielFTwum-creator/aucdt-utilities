import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Lock } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'admin'>('login');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== 'OAUTH_TOKEN_SUCCESS') return;
      const { access_token } = event.data;
      try {
        setGoogleLoading(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
      } catch (err) {
        setError('Google login failed. Please try again.');
        setGoogleLoading(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use admin password instead.');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid profile email',
      prompt: 'select_account'
    });
    window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      'oauth-popup',
      'width=500,height=600'
    );
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login('admin', password);
    } catch (err) {
      setError('Incorrect password');
    } finally {
      setIsSubmitting(false);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-ink text-brand-cream font-cormorant relative overflow-hidden">
      <div className="grain-overlay"></div>

      <div className="w-full max-w-md px-6 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-playfair font-bold text-5xl text-brand-gold mb-2">Prestige</h1>
          <p className="font-bebas text-brand-gold tracking-widest text-sm">ADMIN ACCESS</p>
        </div>

        <div className="bg-brand-card-bg border border-brand-gold/30 rounded-lg p-8 space-y-6">
          {mode === 'login' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full py-3 px-4 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-brand-ink font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {googleLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-brand-card-bg text-brand-gold/60">OR</span>
                </div>
              </div>

              <button
                onClick={() => setMode('admin')}
                className="w-full text-center text-brand-gold hover:text-brand-cream transition font-semibold text-sm"
              >
                Admin Password
              </button>
            </>
          )}

          {mode === 'admin' && (
            <>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-gold/80 mb-2">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 bg-brand-ink border border-brand-gold/30 rounded-lg text-brand-cream placeholder:text-brand-cream/50 focus:outline-none focus:border-brand-gold transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gold/60 hover:text-brand-gold"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 px-4 bg-brand-gold hover:bg-yellow-500 disabled:bg-gray-600 text-brand-ink font-semibold rounded-lg transition"
                >
                  {isSubmitting ? 'Verifying...' : 'Login'}
                </button>
              </form>

              <button
                onClick={() => {
                  setMode('login');
                  setError('');
                  setPassword('');
                }}
                className="w-full text-center text-brand-gold hover:text-brand-cream transition font-semibold text-sm"
              >
                Back to Google Sign-In
              </button>
            </>
          )}
        </div>

        <p className="text-center text-brand-cream/50 text-sm mt-8">
          Techbridge University College • AI Revolution Portal
        </p>
      </div>
    </div>
  );
};
