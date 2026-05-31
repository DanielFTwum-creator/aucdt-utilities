import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, User as UserIcon, Lock, Phone } from 'lucide-react';
import { AnimatedMolecularBackground } from './AnimatedMolecularBackground';

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

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setError('Google login is not configured. Use username/password instead.');
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
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes shimmer {
        0%, 100% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
      }

      .biochem-wordmark {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 38px;
        font-weight: 700;
        background: linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%);
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s ease-in-out infinite, fadeInDown 0.5s ease-out;
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }

      .biochem-tagline {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #6B7280;
      }

      .biochem-card {
        animation: fadeInUp 0.5s ease-out 0.15s both;
      }

      .biochem-heading {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 26px;
        font-weight: 700;
        color: #1E1B4B;
      }

      .biochem-subheading {
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 400;
        color: #6B7280;
      }

      .biochem-label {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 11px;
        font-weight: 700;
        color: #7C3AED;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .biochem-input {
        font-family: 'Inter', sans-serif;
        border: 1px solid rgba(124, 58, 237, 0.15);
        transition: all 0.2s ease-out;
      }

      .biochem-input:focus {
        border-color: #7C3AED;
        box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        outline: none;
      }

      .biochem-input::placeholder {
        color: #9CA3AF;
      }

      .biochem-button-primary {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%);
        border-radius: 10px;
        font-weight: 500;
        transition: all 0.3s ease-out;
      }

      .biochem-button-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
      }

      .biochem-button-primary:active:not(:disabled) {
        transform: scale(0.98);
      }

      .biochem-button-sso {
        border: 1px solid rgba(124, 58, 237, 0.2);
        transition: all 0.2s ease-out;
      }

      .biochem-button-sso:hover:not(:disabled) {
        background-color: #F5F3FF;
        border-color: rgba(124, 58, 237, 0.4);
      }

      .biochem-divider-text {
        color: #A78BFA;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
      }

      .biochem-divider-line {
        background-color: rgba(124, 58, 237, 0.15);
      }

      .biochem-icon {
        color: #A78BFA;
      }

      .biochem-link {
        color: #7C3AED;
        transition: color 0.2s ease-out;
      }

      .biochem-link:hover {
        color: #5B21B6;
      }

      .radial-glow {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(ellipse 700px 500px at 50% 38%, rgba(124, 58, 237, 0.09) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1;
      }
    `}</style>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: '#F5F3FF' }}>
      <div className="radial-glow" />
      <AnimatedMolecularBackground />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <div className="biochem-wordmark">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="10" r="3" fill="#7C3AED" />
              <circle cx="22" cy="18" r="3" fill="#7C3AED" />
              <circle cx="10" cy="18" r="3" fill="#7C3AED" />
              <circle cx="16" cy="26" r="3" fill="#7C3AED" />
              <line x1="16" y1="13" x2="16" y2="23" stroke="#7C3AED" strokeWidth="1.5" />
              <line x1="18.5" y1="11.5" x2="20.5" y2="16.5" stroke="#7C3AED" strokeWidth="1.5" />
              <line x1="13.5" y1="11.5" x2="11.5" y2="16.5" stroke="#7C3AED" strokeWidth="1.5" />
            </svg>
            BioChemAI
          </div>
          <p className="biochem-tagline">Your 24/7 Biochemistry Expert</p>
        </div>

        <div className="biochem-card" style={{
          borderRadius: '20px',
          border: '1px solid rgba(124, 58, 237, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 6px rgba(124, 58, 237, 0.06), 0 20px 60px rgba(124, 58, 237, 0.10)',
          padding: '2.5rem'
        }}>
          <h2 className="biochem-heading text-center mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="biochem-subheading text-center mb-6">
            {mode === 'login' ? 'Sign in to access biochemistry learning' : 'Create an account to get started'}
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="biochem-button-sso w-full bg-white text-slate-700 px-8 py-3.5 rounded-xl font-medium flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="biochem-divider-line flex-1 h-px"></div>
            <span className="biochem-divider-text uppercase font-semibold">Or</span>
            <div className="biochem-divider-line flex-1 h-px"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <>
                <div>
                  <label htmlFor="identifier" className="biochem-label block mb-2">
                    Username or Email
                  </label>
                  <div className="relative">
                    <UserIcon className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                    <input
                      id="identifier"
                      type="text"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder="Enter username or email"
                      disabled={isSubmitting}
                      className="biochem-input w-full px-4 py-3.5 pl-12 text-sm font-medium rounded-xl disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="username" className="biochem-label block mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting}
                      className="biochem-input w-full px-4 py-3.5 pl-12 text-sm font-medium rounded-xl disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="biochem-label block mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="biochem-input w-full px-4 py-3.5 pl-12 text-sm font-medium rounded-xl disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="biochem-label block mb-2">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                      className="biochem-input w-full px-4 py-3.5 pl-12 text-sm font-medium rounded-xl disabled:opacity-50"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="biochem-label block mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="biochem-input w-full px-4 py-3.5 pl-12 pr-12 text-sm font-medium rounded-xl disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="biochem-icon absolute top-1/2 right-4 -translate-y-1/2 hover:text-purple-700 transition disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="biochem-label block mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="biochem-icon absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="biochem-input w-full px-4 py-3.5 pl-12 pr-12 text-sm font-medium rounded-xl disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="biochem-icon absolute top-1/2 right-4 -translate-y-1/2 hover:text-purple-700 transition disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="biochem-button-primary w-full text-white px-8 py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="biochem-link font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
