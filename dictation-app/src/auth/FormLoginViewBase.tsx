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
  videoWebm?: string;
  posterImage?: string;
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
  videoWebm,
  posterImage,
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
  // P2-2: respect reduced-motion — pause/hide the video; the still fallback remains.
  const [reduceMotion, setReduceMotion] = useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-500 bg-cover bg-center"
      style={{ opacity: isRedirecting ? 0 : 1, backgroundImage: posterImage ? `url(${posterImage})` : undefined }}
    >
      {/* P0-3: still fallback (backgroundImage above) renders instantly; the video
          overlays it once it can play. P2-2: skip video entirely on reduced-motion. */}
      {videoBackground && !reduceMotion && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterImage}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          <source src={videoBackground} type="video/mp4" />
        </video>
      )}

      {/* Scrim between video and card */}
      <div
        className="absolute inset-0"
        style={{ zIndex: 1, background: 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.35) 100%)' }}
      ></div>

      {watermarkSvg && <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 2 }}>{watermarkSvg}</div>}

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Login Card — owns all brand identity (P1-2) so contrast is guaranteed */}
        <div
          className="w-full rounded-[16px] p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border animate-fade-in-up"
          style={{
            background: 'rgba(15,20,30,0.55)',
            backdropFilter: 'blur(18px) saturate(1.3)',
            WebkitBackdropFilter: 'blur(18px) saturate(1.3)',
            borderColor: 'rgba(255,255,255,0.18)',
            animationDelay: '0.2s'
          }}
        >
          {/* Brand block — moved inside the card (P1-2) */}
          <div className="flex flex-col items-center text-center mb-6">
            <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TUC Logo" className="w-12 h-auto mb-3" />
            <h1 className="font-dmsans text-[18px] font-medium text-white">{appName}</h1>
            <p className="font-dmsans text-[12px] text-white/60">Powered by Techbridge AI</p>
          </div>

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
            className="w-full bg-white border border-[#dadce0] text-[#3c4043] font-dmsans text-[14px] px-4 py-2.5 rounded-[4px] font-medium hover:bg-[#f8f9fa] hover:shadow-sm transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
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
                <label htmlFor="identifier" className="block font-dmsans text-[12px] font-medium text-white/75 mb-2 tracking-[0.03em]">
                  {supportRegister ? 'Username or Email' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    id="identifier"
                    autoFocus
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
                  <label htmlFor="username" className="block font-dmsans text-[12px] font-medium text-white/75 mb-2 tracking-[0.03em]">
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
                  <label htmlFor="email" className="block font-dmsans text-[12px] font-medium text-white/75 mb-2 tracking-[0.03em]">
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
              <label htmlFor="password" className="block font-dmsans text-[12px] font-medium text-white/75 mb-2 tracking-[0.03em]">
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

            {mode === 'login' && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="font-dmsans text-[13px] text-white/65 hover:text-white hover:underline transition duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {supportRegister && mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block font-dmsans text-[12px] font-medium text-white/75 mb-2 tracking-[0.03em]">
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

      {/* Forgot-password modal (P0-1 — contact-IT flow; no self-service reset endpoint) */}
      {showForgot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setShowForgot(false)}
        >
          <div
            className="w-full max-w-sm rounded-[16px] p-8 text-center"
            style={{ background: 'rgba(15,20,30,0.92)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.18)' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-playfair text-[22px] font-bold text-white mb-3">Reset your password</h3>
            <p className="text-white/70 font-dmsans text-[14px] mb-6 leading-relaxed">
              Password resets are handled by TUC ICT. Email{' '}
              <a href="mailto:daniel.twum@techbridge.edu.gh?subject=Dictation%20App%20password%20reset" className="text-[#C9A84C] hover:underline">daniel.twum@techbridge.edu.gh</a>{' '}
              and we will restore your access.
            </p>
            <button
              type="button"
              onClick={() => setShowForgot(false)}
              className="w-full bg-[#8B1A1A] text-white font-dmsans font-[600] h-[46px] rounded-[10px] hover:bg-[#6B1212] transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
