import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User as UserIcon, Lock, Phone } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    let oauthHandled = false;

    const handleOAuthToken = async (access_token: string) => {
      if (oauthHandled) return;
      oauthHandled = true;

      try {
        setIsSubmitting(true);
        setError('');
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
        localStorage.removeItem('oauth_token_temp');
      } catch {
        setError('Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        handleOAuthToken(event.data.access_token);
      }
      if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        setError(event.data.error_description || event.data.error || 'Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };

    window.addEventListener('message', handleMessage);

    const checkLocalStorage = setInterval(() => {
      const token = localStorage.getItem('oauth_token_temp');
      if (token) {
        handleOAuthToken(token);
        clearInterval(checkLocalStorage);
      }
    }, 100);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkLocalStorage);
    };
  }, [login]);

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use username/password instead.');
      return;
    }
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/auth/google/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account'
    });
    const authWindow = window.open(
      `https://accounts.google.com/o/oauth2/v2/auth?${params}`,
      'oauth_popup',
      'width=600,height=700'
    );
    if (!authWindow) setError('Popup blocked. Please allow popups for this site.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(identifier, password);
      } else {
        if (password !== confirmPassword) throw new Error('Passwords do not match.');
        if (!username) throw new Error('Username is required.');
        if (!email) throw new Error('Email is required.');
        result = await register(username, email, password);
      }
      if (!result.success) {
        setError(result.message || 'An error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setIdentifier('');
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-slate-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-100 mb-1 font-playfair">Prestige Edition</h1>
          <p className="text-amber-700/80 text-sm font-bebas tracking-widest">THE AI REVOLUTION</p>
        </div>

        <div className="bg-slate-900/50 rounded-2xl shadow-2xl border border-amber-700/30 overflow-hidden p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-amber-100 mb-2 font-playfair">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-amber-700/70 mb-6 text-sm">
            {mode === 'login' ? 'Access the AI application portal' : 'Create an account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                <div>
                  <label htmlFor="identifier" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                    Username or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                      required
                      aria-describedby={error ? 'error-message' : undefined}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="username" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                      required
                      aria-describedby={error ? 'error-message' : undefined}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                      required
                      aria-describedby={error ? 'error-message' : undefined}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                      className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                      aria-describedby={error ? 'error-message' : undefined}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                  required
                  aria-describedby={error ? 'error-message' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-400 hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-1"
                  disabled={isSubmitting}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-amber-300 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-amber-400/70" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="w-full border border-amber-700/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none focus:ring-4 focus:ring-amber-400 focus:border-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800 text-amber-50 placeholder:text-amber-200"
                    required
                    aria-describedby={error ? 'error-message' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-400 hover:text-amber-300 transition focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800 rounded px-1"
                    disabled={isSubmitting}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div
                id="error-message"
                className="text-amber-100 bg-red-600/20 border border-red-500 rounded-lg px-4 py-3 text-sm font-medium flex items-start gap-2"
                role="alert"
                aria-live="polite"
                aria-atomic="true"
              >
                <span className="text-red-400 font-bold text-lg flex-shrink-0">!</span>
                <span className="text-red-200">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 text-slate-900 px-8 py-3.5 rounded-xl font-medium hover:bg-amber-400 transition-colors shadow-md focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed font-playfair"
            >
              {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-amber-700/20"></div>
              <span className="text-xs text-amber-300 uppercase font-semibold">Or</span>
              <div className="flex-1 h-px bg-amber-700/20"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full bg-white border-2 border-amber-300 text-slate-900 px-8 py-3.5 rounded-xl font-medium hover:bg-amber-50 transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              aria-label="Continue authentication with Google account"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-amber-200 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="text-amber-300 font-medium hover:text-amber-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900 rounded px-1"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
