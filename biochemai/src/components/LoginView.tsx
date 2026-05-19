import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
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
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type !== 'OAUTH_TOKEN_SUCCESS') return;
      const { access_token } = event.data;
      try {
        setIsSubmitting(true);
        const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const userInfo = await res.json();
        await login({ id: userInfo.id, username: userInfo.name, email: userInfo.email });
      } catch (err) {
        setError('Google login failed. Please try again.');
        setIsSubmitting(false);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
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

  const MolecularWatermark = () => (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.07, zIndex: 0 }}
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Benzene ring - center */}
      <g stroke="#a78bfa" strokeWidth="1.5" fill="none">
        {/* Hexagon vertices */}
        {[0, 60, 120, 180, 240, 300].map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const x = 500 + 80 * Math.cos(rad);
          const y = 500 + 80 * Math.sin(rad);
          return (
            <circle key={`vertex-${angle}`} cx={x} cy={y} r="8" />
          );
        })}
        {/* Connect vertices */}
        <polygon points="580,420 660,450 660,530 580,580 500,550 500,470" />
        {/* Aromaticity circle */}
        <circle cx="500" cy="500" r="20" strokeDasharray="4 3" />
        {/* Central nucleus */}
        <circle cx="500" cy="500" r="5" fill="#a78bfa" />
      </g>

      {/* Orbital rings */}
      <g stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity="0.6">
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(-30 500 500)" />
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(30 500 500)" />
        <ellipse cx="500" cy="500" rx="55" ry="20" transform="rotate(90 500 500)" />
      </g>

      {/* Molecule clusters */}
      <g stroke="#a78bfa" strokeWidth="1.5" fill="none">
        {/* Top-left cluster */}
        {[{ x: 120, y: 120, r: 12 }, { x: 160, y: 100, r: 10 }, { x: 180, y: 150, r: 14 }, { x: 140, y: 180, r: 11 }, { x: 100, y: 160, r: 13 }].map((c, i) => (
          <circle key={`tl-${i}`} cx={c.x} cy={c.y} r={c.r} />
        ))}
        {/* Top-right cluster */}
        {[{ x: 880, y: 100, r: 11 }, { x: 920, y: 140, r: 13 }, { x: 900, y: 180, r: 12 }, { x: 850, y: 170, r: 10 }, { x: 830, y: 120, r: 14 }, { x: 870, y: 60, r: 11 }].map((c, i) => (
          <circle key={`tr-${i}`} cx={c.x} cy={c.y} r={c.r} />
        ))}
        {/* Bottom-left cluster */}
        {[{ x: 100, y: 850, r: 13 }, { x: 150, y: 880, r: 11 }, { x: 200, y: 860, r: 12 }, { x: 180, y: 800, r: 10 }, { x: 120, y: 820, r: 14 }, { x: 70, y: 900, r: 11 }].map((c, i) => (
          <circle key={`bl-${i}`} cx={c.x} cy={c.y} r={c.r} />
        ))}
        {/* Bottom-right cluster */}
        {[{ x: 880, y: 880, r: 12 }, { x: 930, y: 860, r: 10 }, { x: 900, y: 820, r: 13 }, { x: 850, y: 840, r: 11 }].map((c, i) => (
          <circle key={`br-${i}`} cx={c.x} cy={c.y} r={c.r} />
        ))}
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-hidden flex flex-col items-center justify-center p-6">
      <MolecularWatermark />

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-[#a78bfa] mb-1">BioChemAI</h1>
          <p className="text-[#6b7280] text-xs font-semibold uppercase tracking-[0.1em]">Your 24/7 Biochemistry Expert</p>
        </div>

        <div
          className="rounded-2xl overflow-hidden p-8 relative"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2 className="text-2xl font-bold text-center text-white mb-1">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-[#d1d5db] text-xs mb-6 font-medium">
            {mode === 'login' ? 'Sign in to continue' : 'Get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'login' ? (
              <div>
                <label htmlFor="identifier" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Username or Email</label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter username or email"
                    disabled={isSubmitting}
                    className="w-full rounded-[10px] px-4 py-3.5 pl-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f9fafb',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="username" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting}
                      className="w-full rounded-[10px] px-4 py-3.5 pl-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f9fafb',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Email</label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting}
                      className="w-full rounded-[10px] px-4 py-3.5 pl-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f9fafb',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                      disabled={isSubmitting}
                      className="w-full rounded-[10px] px-4 py-3.5 pl-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                      style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f9fafb',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting}
                  className="w-full rounded-[10px] px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#f9fafb',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#9ca3af] hover:text-[#d1d5db] transition"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-[0.7rem] font-semibold text-[#6b7280] mb-2 uppercase tracking-[0.06em]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting}
                    className="w-full rounded-[10px] px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f9fafb',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#9ca3af] hover:text-[#d1d5db] transition"
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
              className="w-full text-white px-8 py-3.5 rounded-[10px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: '#7c3aed',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 28px rgba(124, 58, 237, 0.5)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSubmitting ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>

            <div className="relative flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
              <span className="text-xs text-[#6b7280] uppercase font-semibold">Or</span>
              <div className="flex-1 h-px bg-[rgba(255,255,255,0.1)]"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full px-8 py-3.5 rounded-[10px] font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#d1d5db',
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-[#d1d5db] text-xs mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
              className="transition-colors"
              style={{ color: '#a78bfa' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c4b5fd')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a78bfa')}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
