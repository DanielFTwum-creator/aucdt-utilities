import React, { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Lock } from 'lucide-react';

interface FormLoginViewProps {
  appName: string;
  appSubtitle: string;
  primaryColor: string;
  primaryColorHex: string;
  borderColorClass: string;
  inputBorderClass: string;
  inputFocusRingClass: string;
  inputFocusBorderClass: string;
  buttonHoverClass: string;
  backgroundClass: string;
  cardBgClass: string;
  onGoogleLogin: () => void;
  onLocalLogin: (identifier: string, password: string) => Promise<void>;
  onRegister?: (username: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  googleIcon?: React.ReactNode;
  supportRegister?: boolean;
  watermarkSvg?: React.ReactNode;
  textColorClass?: string;
  labelColorClass?: string;
  subtitleColorClass?: string;
  videoBackground?: string;
}

export const FormLoginView: React.FC<FormLoginViewProps> = ({
  appName,
  appSubtitle,
  primaryColor,
  primaryColorHex,
  borderColorClass,
  inputBorderClass,
  inputFocusRingClass,
  inputFocusBorderClass,
  buttonHoverClass,
  backgroundClass,
  cardBgClass,
  onGoogleLogin,
  onLocalLogin,
  onRegister,
  isLoading = false,
  googleIcon,
  supportRegister = true,
  watermarkSvg,
  textColorClass = 'text-slate-900',
  labelColorClass = 'text-slate-700',
  subtitleColorClass = 'text-slate-600',
  videoBackground,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // Login-screen privacy (PATTERNS.md #6): never let the browser pre-fill the
  // login fields on load (leaks the last user on shared machines). Fields render
  // read-only — which suppresses Chrome/Safari autofill — and unlock on first focus.
  const [fieldsUnlocked, setFieldsUnlocked] = useState(false);
  const unlockFields = () => setFieldsUnlocked(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        if (!identifier || !password) throw new Error('Please enter username/email and password');
        await onLocalLogin(identifier, password);
        setIsRedirecting(true);
      } else if (supportRegister && onRegister) {
        if (!username || !email || !password) throw new Error('All fields are required');
        if (password !== confirmPassword) throw new Error('Passwords do not match');
        await onRegister(username, email, password);
        setIsRedirecting(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setIdentifier('');
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode);
    clearForm();
  };

  return (
    <div
      className={`h-screen ${backgroundClass} flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-500`}
      style={{ opacity: isRedirecting ? 0 : 1 }}
    >
      {videoBackground && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={videoBackground} type="video/mp4" />
        </video>
      )}
      {videoBackground && (
        <div className="absolute inset-0 bg-black/40" style={{ zIndex: 1 }}></div>
      )}
      {watermarkSvg && <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>{watermarkSvg}</div>}
      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${primaryColor} mb-1`}>{appName}</h1>
          <p className="text-slate-600 text-sm">{appSubtitle}</p>
        </div>

        <div className={`${cardBgClass} rounded-2xl shadow-xl ${borderColorClass} overflow-hidden p-8`}>
          <h2 className={`text-2xl font-bold text-center ${textColorClass} mb-2`}>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={`text-center ${subtitleColorClass} mb-6 text-sm`}>
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRedirecting(true);
              setTimeout(() => onGoogleLogin(), 300);
            }}
            disabled={isSubmitting || isLoading || isRedirecting}
            className="w-full bg-white border-2 border-slate-300 text-slate-700 px-8 py-3.5 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {googleIcon || (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {mode === 'login' || !supportRegister ? (
              <div>
                <label htmlFor="identifier" className={`block text-xs font-bold ${labelColorClass} mb-2 uppercase tracking-wider`}>
                  {supportRegister ? 'Username or Email' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={supportRegister ? 'Enter username or email' : 'Enter your username'}
                    disabled={isSubmitting || isLoading}
                    readOnly={!fieldsUnlocked}
                    onFocus={unlockFields}
                    autoComplete="off"
                    className={`w-full ${inputBorderClass} rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none ${inputFocusRingClass} ${inputFocusBorderClass} shadow-sm disabled:opacity-50`}
                    required
                  />
                </div>
              </div>
            ) : supportRegister ? (
              <>
                <div>
                  <label htmlFor="username" className={`block text-xs font-bold ${labelColorClass} mb-2 uppercase tracking-wider`}>
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting || isLoading}
                      className={`w-full ${inputBorderClass} rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none ${inputFocusRingClass} ${inputFocusBorderClass} shadow-sm disabled:opacity-50`}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className={`block text-xs font-bold ${labelColorClass} mb-2 uppercase tracking-wider`}>
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting || isLoading}
                      className={`w-full ${inputBorderClass} rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none ${inputFocusRingClass} ${inputFocusBorderClass} shadow-sm disabled:opacity-50`}
                      required
                    />
                  </div>
                </div>
              </>
            ) : null}

            <div>
              <label htmlFor="password" className={`block text-xs font-bold ${labelColorClass} mb-2 uppercase tracking-wider`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting || isLoading}
                  readOnly={!fieldsUnlocked}
                  onFocus={unlockFields}
                  autoComplete="new-password"
                  className={`w-full ${inputBorderClass} rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none ${inputFocusRingClass} ${inputFocusBorderClass} shadow-sm disabled:opacity-50`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {supportRegister && mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className={`block text-xs font-bold ${labelColorClass} mb-2 uppercase tracking-wider`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting || isLoading}
                    className={`w-full ${inputBorderClass} rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none ${inputFocusRingClass} ${inputFocusBorderClass} shadow-sm disabled:opacity-50`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{ backgroundColor: primaryColorHex }}
              className={`w-full text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-md outline-none disabled:opacity-50 disabled:cursor-not-allowed ${buttonHoverClass}`}
            >
              {isSubmitting || isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {supportRegister && (
            <p className={`text-center ${subtitleColorClass} text-sm mt-6`}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                style={{ color: primaryColorHex }}
                className="font-medium hover:opacity-80 transition-opacity"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
