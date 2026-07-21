import React, { useState } from 'react';
import { Eye, EyeOff, User as UserIcon, Lock, Shield } from 'lucide-react';

interface FormLoginViewProps {
  appName: string;
  appSubtitle: string;
  // Vestigial theme props — the component hardcodes its glassmorphic crimson/gold
  // palette, so these are accepted for backward compatibility but ignored. Optional.
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
      className="fixed inset-0 flex flex-col items-center justify-center p-6 overflow-hidden transition-opacity duration-500"
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
      
      {/* Scrim between video and card */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 100%)' }}
      ></div>

      {watermarkSvg && <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>{watermarkSvg}</div>}
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-down flex flex-col items-center">
          <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TUC Logo" className="w-14 h-auto mb-4" />
          <h1 className="font-playfair text-[28px] font-bold text-white mb-1 tracking-wide">{appName}</h1>
          <p className="font-dmsans text-[13px] text-white/65">Powered by Techbridge AI</p>
        </div>

        {/* Login Card */}
        <div 
          className="w-full rounded-[20px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/25 animate-fade-in-up"
          style={{ 
            background: 'rgba(255,255,255,0.12)', 
            backdropFilter: 'blur(18px) saturate(160%)',
            WebkitBackdropFilter: 'blur(18px) saturate(160%)',
            animationDelay: '0.2s' 
          }}
        >
          <h2 className="font-playfair text-[26px] font-bold text-center text-white mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-center text-white/70 font-dmsans text-[14px] mb-6">
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
            className="w-full bg-white/15 border border-white/35 text-white font-dmsans text-[14px] px-8 py-3.5 rounded-[10px] font-medium hover:bg-white/25 transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
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
          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-[12px] text-white/50 font-dmsans uppercase tracking-wider">Or</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            {mode === 'login' || !supportRegister ? (
              <div>
                <label htmlFor="identifier" className="block font-dmsans text-[11px] text-white/60 mb-2 uppercase tracking-[0.08em]">
                  {supportRegister ? 'Username or Email' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={supportRegister ? 'Enter username or email' : 'Enter your username'}
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/45 rounded-[10px] h-[48px] pl-12 pr-4 text-sm outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/25 transition duration-200 disabled:opacity-50"
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            ) : supportRegister ? (
              <>
                <div>
                  <label htmlFor="username" className="block font-dmsans text-[11px] text-white/60 mb-2 uppercase tracking-[0.08em]">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting || isLoading}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/45 rounded-[10px] h-[48px] pl-12 pr-4 text-sm outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/25 transition duration-200 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block font-dmsans text-[11px] text-white/60 mb-2 uppercase tracking-[0.08em]">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting || isLoading}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/45 rounded-[10px] h-[48px] pl-12 pr-4 text-sm outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/25 transition duration-200 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
              </>
            ) : null}

            <div>
              <label htmlFor="password" className="block font-dmsans text-[11px] text-white/60 mb-2 uppercase tracking-[0.08em]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/45 rounded-[10px] h-[48px] pl-12 pr-12 text-sm outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/25 transition duration-200 disabled:opacity-50"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {supportRegister && mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block font-dmsans text-[11px] text-white/60 mb-2 uppercase tracking-[0.08em]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting || isLoading}
                    className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/45 rounded-[10px] h-[48px] pl-12 pr-12 text-sm outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/25 transition duration-200 disabled:opacity-50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-white/50 hover:text-white transition duration-200"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full bg-[#8B1A1A] border-t-2 border-[#C9A84C]/60 text-white font-dmsans font-[600] tracking-[0.03em] text-[15px] h-[50px] rounded-[10px] hover:-translate-y-[1px] hover:bg-[#6B1212] active:scale-[0.98] transition-all duration-200 shadow-md outline-none disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting || isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          {supportRegister && (
            <p className="text-center text-white/60 font-dmsans text-sm mt-6">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                className="text-[#C9A84C] font-medium hover:underline transition-all"
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
