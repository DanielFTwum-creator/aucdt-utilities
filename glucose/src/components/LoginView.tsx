import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Lock, Phone, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { FormInput } from './FormInput';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordMatch,
  validateUsername,
  getPasswordStrength,
} from '../utils/validation';

const OAUTH_TIMEOUT_MS = 5000;
const STORAGE_FALLBACK_POLL_MS = 100;
const STORAGE_KEY_TEMP = 'oauth_token_temp';
const STATE_EXPIRY_MS = 60000; // 60 seconds

type OAuthState = 'idle' | 'pending' | 'complete';
type NetworkStatus = 'online' | 'offline';

export const LoginView: React.FC = () => {
  const { login, register, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oauthState, setOAuthState] = useState<OAuthState>('idle');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [lastSubmitError, setLastSubmitError] = useState<{ message: string; timestamp: number } | null>(null);
  const [userName, setUserName] = useState<string>(''); // R1: For personalized greeting
  const oauthAbortRef = useRef<AbortController | null>(null);
  const submitAttemptRef = useRef<number>(0);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus('online');
    const handleOffline = () => setNetworkStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (oauthState !== 'pending') return;

    const processOAuthToken = async (access_token: string): Promise<void> => {
      try {
        setError('');
        setIsSubmitting(true);

        oauthAbortRef.current = new AbortController();
        const timeoutId = setTimeout(() => oauthAbortRef.current?.abort(), OAUTH_TIMEOUT_MS);

        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` },
          signal: oauthAbortRef.current.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();

        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email, fullName: userInfo.name });
        setOAuthState('complete');
        localStorage.removeItem(STORAGE_KEY_TEMP);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Google login took too long. Please try again.');
        } else {
          setError('Google login failed. Please try again.');
        }
        setOAuthState('idle');
        setIsSubmitting(false);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'OAUTH_TOKEN_SUCCESS') {
        processOAuthToken(event.data.access_token);
      } else if (event.data?.type === 'OAUTH_TOKEN_ERROR') {
        const errorMsg = event.data.error_description || event.data.error || 'Google login failed.';
        setLastSubmitError({ message: errorMsg, timestamp: Date.now() });
        setError(errorMsg);
        setOAuthState('idle');
        setIsSubmitting(false);
      }
    };

    const checkLocalStorageFallback = setInterval(() => {
      const token = localStorage.getItem(STORAGE_KEY_TEMP);
      if (token) {
        clearInterval(checkLocalStorageFallback);
        processOAuthToken(token);
      }
    }, STORAGE_FALLBACK_POLL_MS);

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkLocalStorageFallback);
      oauthAbortRef.current?.abort();
    };
  }, [oauthState, login]);

  const handleGoogleLogin = (): void => {
    if (oauthState !== 'idle') return;
    if (networkStatus === 'offline') {
      setError('No internet connection. Please check your connection and try again.');
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Please contact support.');
      return;
    }

    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
      || `${window.location.origin}/glucose/callback`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'token',
      scope: 'openid email profile',
      prompt: 'select_account'
    });

    setOAuthState('pending');
    // Full-page redirect (no popup). Google returns to redirect_uri with the
    // access_token in the URL hash, which AuthContext processes on load.
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'login') {
      if (!identifier.trim()) newErrors.identifier = 'Username or email is required';
      if (!password) newErrors.password = 'Password is required';
    } else {
      const usernameVal = validateUsername(username);
      if (!usernameVal.isValid) newErrors.username = usernameVal.error || '';

      const emailVal = validateEmail(email);
      if (!emailVal.isValid) newErrors.email = emailVal.error || '';

      const phoneVal = validatePhone(phone);
      if (!phoneVal.isValid) newErrors.phone = phoneVal.error || '';

      const passwordVal = validatePassword(password);
      if (!passwordVal.isValid) newErrors.password = passwordVal.error || '';

      const matchVal = validatePasswordMatch(password, confirmPassword);
      if (!matchVal.isValid) newErrors.confirmPassword = matchVal.error || '';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    submitAttemptRef.current += 1;

    if (!validateForm()) return;

    if (networkStatus === 'offline') {
      setError('No internet connection. Please check your connection and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login(identifier, password);
      } else {
        result = await register(username, email, password, fullName);
      }
      if (!result.success) {
        const errorMsg = result.message || 'An error occurred. Please try again.';
        setError(errorMsg);
        setLastSubmitError({ message: errorMsg, timestamp: Date.now() });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      setLastSubmitError({ message: errorMsg, timestamp: Date.now() });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setLastSubmitError(null);
    if (mode === 'login') {
      setIdentifier('');
      setPassword('');
    }
  };

  const clearForm = () => {
    setIdentifier('');
    setFullName('');
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-rose-100 to-orange-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* R3: Enhanced warm ivory-to-soft-blush gradient for health context */}
      {/* R1: Biometric glucose curve backdrop pattern */}
      <div className="absolute inset-0 opacity-6 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Glucose monitoring waveform curves */}
          <path d="M 0,200 Q 50,150 100,180 T 200,160 T 300,190 T 400,170" stroke="#FF6B35" strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M 0,220 Q 50,170 100,200 T 200,180 T 300,210 T 400,190" stroke="#FF6B35" strokeWidth="1" fill="none" opacity="0.3" />
          <path d="M 0,240 Q 50,190 100,220 T 200,200 T 300,230 T 400,210" stroke="#FF6B35" strokeWidth="1" fill="none" opacity="0.2" />
        </svg>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* R4 + R5: Logo block with faster fade-up + scale entrance */}
        <div className="text-center mb-16 animate-fadeUpLogo">
          {/* R1 + R6: Dial measurement logo — arc needle + gauge (increased size for prominence) */}
          <div className="flex justify-center mb-8">
            <svg width="72" height="72" viewBox="0 0 72 72" className="w-16 h-16" role="img" aria-label="Glucose monitoring dial">
              <circle cx="36" cy="36" r="26" fill="none" stroke="#E8E0D8" strokeWidth="5"/>
              <path d="M14 36 A22 22 0 0 1 58 36" fill="none" stroke="#E04F1A" strokeWidth="5" strokeLinecap="round"/>
              <line x1="36" y1="36" x2="36" y2="16" stroke="#1E1A17" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="36" cy="36" r="3.5" fill="#1E1A17"/>
              <circle cx="36" cy="16" r="2" fill="#E04F1A"/>
            </svg>
          </div>
          {/* R6: Fraunces wordmark — humanist serif for approachability + precision */}
          <h1 className="text-4xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'Fraunces, serif', color: '#1E1E1E', fontWeight: 600 }}>
            Glucose
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">Clinical monitoring made personal</p>

          {networkStatus === 'offline' && (
            <div className="mt-4 flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-lg py-2.5 px-3 animate-pulse">
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-medium text-amber-700">Offline mode</span>
            </div>
          )}
        </div>

        {/* R2 + R3 + R5: Card with softened orange accent + natural stagger timing */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 border-t-2 border-t-orange-400 overflow-hidden p-8 sm:p-10 space-y-6 animate-fadeUp-delay-150">
          {/* R1 + R3 + R4 + R6: Fraunces heading with generic greeting */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight" style={{ fontFamily: 'Fraunces, serif', color: '#1E1E1E', fontWeight: 600 }}>
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {mode === 'login' ? 'Sign in to track your levels' : 'Join the community'}
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl animate-slideInDown">
              <p className="text-red-700 text-sm font-medium mb-3">{error}</p>
              {lastSubmitError && submitAttemptRef.current > 1 && (
                <button
                  type="button"
                  onClick={handleRetry}
                  className="text-red-600 font-semibold text-sm hover:text-red-700 hover:underline transition"
                >
                  Clear and try again →
                </button>
              )}
            </div>
          )}

          {/* R4: Improved form spacing and rhythm */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* R4: OAuth button as primary path, before password */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting || oauthState !== 'idle' || networkStatus === 'offline'}
              className="w-full bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-semibold hover:bg-orange-50 hover:border-orange-400 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              {oauthState === 'pending' && (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-orange-600 rounded-full animate-spin" />
              )}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {oauthState === 'pending' ? 'Opening Google...' : 'Continue with Google'}
            </button>

            {/* R4: Improved divider spacing */}
            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-xs text-slate-500 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {mode === 'login' ? (
              <FormInput
                id="identifier"
                label="Username or Email"
                type="text"
                placeholder="Enter your username or email"
                value={identifier}
                onChange={setIdentifier}
                disabled={isSubmitting}
                icon={UserIcon}
                required
                error={fieldErrors.identifier}
              />
            ) : (
              <>
                <FormInput
                  id="username"
                  label="Username"
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={setUsername}
                  disabled={isSubmitting}
                  icon={UserIcon}
                  required
                  minLength={3}
                  error={fieldErrors.username}
                  helpText="3+ characters: letters, numbers, underscores, hyphens"
                />
                <FormInput
                  id="fullName"
                  label="Full Name"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={setFullName}
                  disabled={isSubmitting}
                  icon={UserIcon}
                  required
                  error={fieldErrors.fullName}
                />
                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={setEmail}
                  disabled={isSubmitting}
                  icon={UserIcon}
                  required
                  error={fieldErrors.email}
                />
                <FormInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={setPhone}
                  disabled={isSubmitting}
                  icon={Phone}
                  optional
                  error={fieldErrors.phone}
                  helpText="At least 10 digits"
                />
              </>
            )}

            <FormInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter a secure password"
              value={password}
              onChange={setPassword}
              disabled={isSubmitting}
              icon={Lock}
              required
              isPassword
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              minLength={mode === 'register' ? 8 : undefined}
              error={fieldErrors.password}
              helpText={mode === 'register' ? 'At least 8 characters for security' : undefined}
            />

            {mode === 'register' && (
              <FormInput
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                disabled={isSubmitting}
                icon={Lock}
                required
                isPassword
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                error={fieldErrors.confirmPassword}
              />
            )}

            {/* R5: Button with scale animation and shadow feedback */}
            <button
              type="submit"
              disabled={isSubmitting || networkStatus === 'offline'}
              className="w-full bg-orange-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-orange-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg focus:ring-4 focus:ring-orange-200 outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-orange-600 flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isSubmitting
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>

          {/* R3 + R5: Mode toggle with muted terracotta + underline */}
          <p className="text-center text-slate-600 text-sm pt-2">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="font-semibold hover:opacity-80 transition-all duration-150"
              style={{ color: '#A0522D', textDecoration: 'underline', textDecorationColor: '#A0522D', textUnderlineOffset: '2px' }}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
