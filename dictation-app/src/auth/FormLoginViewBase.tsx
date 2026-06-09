import React, { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Lock, Shield } from 'lucide-react';
import { FloatingInput } from './FloatingInput';
import { WaveformBackground } from './WaveformBackground';

interface FormLoginViewProps {
  appName: string;
  appSubtitle: string;
  primaryColor?: string;
  primaryColorHex?: string;
  borderColorClass?: string;
  inputBorderClass?: string;
  inputFocusRingClass?: string;
  inputFocusBorderClass?: string;
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
  videoWebm?: string;
  posterImage?: string;
}

export const FormLoginView: React.FC<FormLoginViewProps> = ({
  appName,
  appSubtitle,
  buttonHoverClass,
  onGoogleLogin,
  onLocalLogin,
  onRegister,
  isLoading = false,
  googleIcon,
  supportRegister = true,
  watermarkSvg,
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
  const [showForgot, setShowForgot] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-500 auth-layout"
      style={{
        opacity: isRedirecting ? 0 : 1,
        background: 'var(--studio-black, #080C14)',
        backgroundImage: [
          'radial-gradient(ellipse 60% 40% at 10% 60%, rgba(var(--accent-rgb),0.04), transparent)',
          'radial-gradient(ellipse 50% 35% at 90% 20%, rgba(var(--primary-rgb),0.03), transparent)',
        ].join(', '),
      }}
    >
      {/* Waveform Background */}
      <WaveformBackground />

      {/* Studio grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(var(--accent-rgb),0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.015) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          zIndex: 0,
        }}
      />

      {watermarkSvg && <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>{watermarkSvg}</div>}

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Login Card */}
        <div
          className="w-full rounded-[16px] p-10 sm:p-12 flex flex-col items-center auth-card-mount"
          style={{
            background: 'var(--ds-surface, rgba(17,24,39,0.92))',
            border: '1px solid var(--ds-border, rgba(184,134,11,0.25))',
            boxShadow: '0 0 0 1px rgba(var(--accent-rgb),0.06), 0 24px 64px rgba(0,0,0,0.6), 0 0 40px rgba(var(--accent-rgb),0.04)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animationDelay: '0.15s',
          }}
        >
          {/* Brand block */}
          <div
            className="flex flex-col items-center text-center pb-6 mb-8 w-full"
            style={{ borderBottom: '1px solid rgba(var(--accent-rgb),0.1)' }}
          >
            {/* Signal indicator + wordmark */}
            <div className="flex items-center gap-2 mb-1">
              <span className="signal-dot" />
              <h1
                className="font-mono text-[13px] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'var(--ds-accent)', textShadow: '0 0 12px rgba(var(--accent-rgb),0.3)' }}
              >
                {appName}
              </h1>
              <span
                className="text-[9px] font-mono font-bold tracking-widest uppercase px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(var(--accent-rgb),0.08)', border: '1px solid rgba(var(--accent-rgb),0.15)', color: 'var(--ds-text-muted)' }}
              >
                AI-02
              </span>
            </div>
            <p className="font-mono text-[10px]" style={{ color: 'var(--ds-text-muted)' }}>{appSubtitle}</p>
          </div>

          <h2 className="font-display text-[26px] font-bold text-center text-white mb-2 w-full">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-white/70 font-sans text-[14px] mb-8 w-full">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => {
              setIsRedirecting(true);
              setTimeout(() => onGoogleLogin(), 300);
            }}
            disabled={isSubmitting || isLoading || isRedirecting}
            className="w-full mx-auto bg-white border border-[#dadce0] text-[#3c4043] font-sans text-[14px] px-4 py-2.5 rounded-[4px] font-medium hover:bg-[#f8f9fa] hover:shadow-sm transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-8 cursor-pointer"
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

          {/* OR Divider */}
          <div className="relative flex items-center gap-3 mb-8 w-full">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-[12px] text-white/55 font-sans uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center w-full" autoComplete="off">
            {mode === 'login' || !supportRegister ? (
              <div className="w-full">
                <FloatingInput
                  id="identifier"
                  label={supportRegister ? 'Username or Email' : 'Username'}
                  type="text"
                  icon={<UserIcon className="w-5 h-5" />}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  isError={!!error}
                  required
                />
              </div>
            ) : supportRegister ? (
              <>
                <div className="w-full">
                  <FloatingInput
                    id="username"
                    label="Username"
                    type="text"
                    icon={<UserIcon className="w-5 h-5" />}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    isError={!!error}
                    required
                  />
                </div>
                <div className="w-full">
                  <FloatingInput
                    id="email"
                    label="Email"
                    type="email"
                    icon={<UserIcon className="w-5 h-5" />}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isSubmitting || isLoading}
                    isError={!!error}
                    required
                  />
                </div>
              </>
            ) : null}

            <div className="w-full">
              <FloatingInput
                id="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                icon={<Lock className="w-5 h-5" />}
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={isSubmitting || isLoading}
                isError={!!error}
                required
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition duration-200 cursor-pointer"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </FloatingInput>

              {error && (
                <div id="error-message" role="alert" aria-live="polite" className="text-[var(--ds-error)] text-[11px] font-semibold text-left mt-1.5 pl-1 animate-fade-in-up">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {mode === 'login' && (
              <div className="flex justify-end -mt-2.5 w-full">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-sans text-[13px] text-white/65 hover:text-white hover:underline transition duration-200 cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {supportRegister && mode === 'register' && (
              <div className="w-full">
                <FloatingInput
                  id="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={<Lock className="w-5 h-5" />}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting || isLoading}
                  isError={!!error}
                  required
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition duration-200 cursor-pointer"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </FloatingInput>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`w-full text-white font-sans font-[600] tracking-[0.03em] text-[15px] h-[50px] rounded-[10px] shadow-md outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-3 auth-btn-press flex items-center justify-center gap-2 cursor-pointer ${buttonHoverClass}`}
              style={{ background: 'var(--ds-primary)' }}
            >
              {isSubmitting || isLoading ? (
                <>
                  <span className="spinner" />
                  <span>Signing in…</span>
                </>
              ) : (
                <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {supportRegister && (
            <p className="text-center text-white/60 font-sans text-sm mt-8 w-full">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                style={{ color: 'var(--ds-accent)' }}
                className="font-medium hover:underline transition-all cursor-pointer"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Forgot-password modal */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowForgot(false)}
        >
          <div
            className="w-full max-w-sm rounded-[16px] p-8 text-center"
            style={{ background: 'var(--ds-surface)', backdropFilter: 'blur(18px)', border: '1px solid var(--ds-border)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-display text-[22px] font-bold text-white mb-3">Reset your password</h3>
            <p className="text-white/70 font-sans text-[14px] mb-6 leading-relaxed">
              Password resets are handled by TUC ICT. Email{' '}
              <a href="mailto:daniel.twum@techbridge.edu.gh?subject=Dictation%20App%20password%20reset" style={{ color: 'var(--ds-accent)' }} className="hover:underline">daniel.twum@techbridge.edu.gh</a>{' '}
              and we will restore your access.
            </p>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              style={{ backgroundColor: 'var(--ds-primary)' }}
              className={`w-full text-white font-sans font-[600] h-[46px] rounded-[10px] transition duration-200 auth-btn-press cursor-pointer`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
