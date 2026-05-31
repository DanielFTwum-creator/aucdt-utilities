import React, { useState, useEffect, useRef } from 'react';
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  // WOW — canvas background refs
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number }>>([]);
  const rafRef = useRef<number>(0);
  // WOW — particle burst on submit
  const [burstKey, setBurstKey] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  // WOW — cursor-reactive molecular network + DNA helix canvas
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      nodesRef.current = Array.from({ length: 14 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 3 + Math.random() * 2.2,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    let helixOffset = 0;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // ── DNA double-helix ───────────────────────��───────────────
      helixOffset += 0.007;
      const cx = height / 2;
      const amp = height * 0.44;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(124,58,237,0.055)';
      for (let x = 0; x <= width; x += 3) {
        const y = cx + Math.sin((x / width) * Math.PI * 5 + helixOffset) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(167,139,250,0.04)';
      for (let x = 0; x <= width; x += 3) {
        const y = cx + Math.sin((x / width) * Math.PI * 5 + helixOffset + Math.PI) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // rungs
      ctx.lineWidth = 1;
      for (let i = 0; i <= 14; i++) {
        const t = i / 14;
        const x = t * width;
        const y1 = cx + Math.sin(t * Math.PI * 5 + helixOffset) * amp;
        const y2 = cx + Math.sin(t * Math.PI * 5 + helixOffset + Math.PI) * amp;
        ctx.beginPath();
        ctx.moveTo(x, y1);
        ctx.lineTo(x, y2);
        ctx.strokeStyle = 'rgba(124,58,237,0.04)';
        ctx.stroke();
        // rung end-dots
        ctx.beginPath();
        ctx.arc(x, y1, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.12)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y2, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Cursor-reactive nodes ──────────────────────────────────
      const mouse = mouseRef.current;
      const nodes = nodesRef.current;

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140 * 1.4;
          n.vx += (dx / dist) * force * 0.04;
          n.vy += (dy / dist) * force * 0.04;
        }
        n.vx *= 0.97;
        n.vy *= 0.97;
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd < 0.08) { n.vx += (Math.random() - 0.5) * 0.06; n.vy += (Math.random() - 0.5) * 0.06; }
        if (spd > 2.8) { n.vx *= 2.8 / spd; n.vy *= 2.8 / spd; }
      });

      // connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${(0.09 * (1 - d / 200)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.16)';
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // WOW — mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Check for reduced motion settings
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
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
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-500"
      style={{ opacity: isRedirecting ? 0 : 1, backgroundColor: '#F5F3FF' }}
    >
      {/* Radial purple glow behind card */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'radial-gradient(700px 500px ellipse at 50% 38%, rgba(124,58,237,0.09) 0%, transparent 70%)'
        }}
      />

      {/* WOW — Live canvas: cursor-reactive molecular network + DNA helix */}
      <canvas
        ref={bgCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />
      
      <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
        {/* Card Container */}
        <div 
          className="w-full bg-white rounded-[20px] p-10 shadow-[0_4px_6px_rgba(124,58,237,0.06),_0_20px_60px_rgba(124,58,237,0.10)] border border-[#7C3AED]/15 flex flex-col items-center animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          {/* Brand Wordmark & Tagline */}
          <div className="flex flex-col items-center text-center pb-6 mb-8 border-b border-[#7C3AED]/15 w-full animate-fade-in-down">
            <div className="flex items-center justify-center mb-3">
              {/* Molecular Icon */}
              <svg className="w-10 h-10 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="16" y1="8" x2="20" y2="14" />
                <line x1="16" y1="8" x2="12" y2="14" />
                <line x1="8" y1="8" x2="4" y2="14" />
                <line x1="8" y1="8" x2="12" y2="14" />
                <circle cx="8" cy="8" r="3" fill="#7C3AED" stroke="#7C3AED" strokeWidth="1" />
                <circle cx="16" cy="8" r="3" fill="#7C3AED" stroke="#7C3AED" strokeWidth="1" />
                <circle cx="12" cy="14" r="4" fill="#6D28D9" stroke="#7C3AED" strokeWidth="1" />
                <circle cx="4" cy="14" r="2.5" fill="#A78BFA" stroke="#A78BFA" strokeWidth="1" />
                <circle cx="20" cy="14" r="2.5" fill="#A78BFA" stroke="#A78BFA" strokeWidth="1" />
              </svg>
              {/* Shimmering Wordmark */}
              <h1 className="font-space-grotesk font-bold text-[38px] shimmer-gradient tracking-tight leading-none ml-2">
                {appName}
              </h1>
            </div>
            <p className="font-sans text-[14px] text-[#6B7280] font-medium tracking-wide">
              {appSubtitle}
            </p>
          </div>

          <h2 className="font-space-grotesk text-[26px] font-bold text-center text-[#1E1B4B] mb-2.5 w-full">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-sans text-[14px] text-[#6B7280] text-center mb-8 w-full">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRedirecting(true);
              setTimeout(() => onGoogleLogin(), 300);
            }}
            disabled={isSubmitting || isLoading || isRedirecting}
            className="w-full max-w-[50%] mx-auto bg-white border border-[#7C3AED]/20 text-[#1E1B4B] font-sans text-[14px] px-8 py-3.5 rounded-xl font-medium hover:bg-[#F5F3FF] hover:border-[#7C3AED]/40 hover:shadow-sm transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
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

          <div className="relative flex items-center gap-3 mb-8 w-full max-w-[50%]">
            <div className="flex-1 h-px bg-[#7C3AED]/15"></div>
            <span className="text-xs text-[#A78BFA] uppercase font-bold tracking-widest font-space-grotesk">Or</span>
            <div className="flex-1 h-px bg-[#7C3AED]/15"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full" autoComplete="off">
            {mode === 'login' || !supportRegister ? (
              <div className="w-full max-w-[50%]">
                <label htmlFor="identifier" className="block font-space-grotesk text-[11px] font-bold text-[#7C3AED] mb-2.5 uppercase tracking-[0.08em]">
                  {supportRegister ? 'Username or Email' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#A78BFA]" />
                  <input
                    id="identifier"
                    autoFocus
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={supportRegister ? 'Enter username or email' : 'Enter your username'}
                    disabled={isSubmitting || isLoading}
                    aria-describedby={error ? "error-message" : undefined}
                    className="w-full border border-[#7C3AED]/20 bg-[#F5F3FF]/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none text-[#1E1B4B] placeholder:text-[#6B7280]/40 focus:border-[#7C3AED] focus:ring-3 focus:ring-[#7C3AED]/15 transition-all duration-200 disabled:opacity-50"
                    style={{ paddingLeft: '48px' }}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
            ) : supportRegister ? (
              <>
                <div className="w-full max-w-[50%]">
                  <label htmlFor="username" className="block font-space-grotesk text-[11px] font-bold text-[#7C3AED] mb-2.5 uppercase tracking-[0.08em]">
                    Username
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#A78BFA]" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      disabled={isSubmitting || isLoading}
                      aria-describedby={error ? "error-message" : undefined}
                      className="w-full border border-[#7C3AED]/20 bg-[#F5F3FF]/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none text-[#1E1B4B] placeholder:text-[#6B7280]/40 focus:border-[#7C3AED] focus:ring-3 focus:ring-[#7C3AED]/15 transition-all duration-200 disabled:opacity-50"
                      style={{ paddingLeft: '48px' }}
                      required
                    />
                  </div>
                </div>
                <div className="w-full max-w-[50%]">
                  <label htmlFor="email" className="block font-space-grotesk text-[11px] font-bold text-[#7C3AED] mb-2.5 uppercase tracking-[0.08em]">
                    Email
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#A78BFA]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isSubmitting || isLoading}
                      aria-describedby={error ? "error-message" : undefined}
                      className="w-full border border-[#7C3AED]/20 bg-[#F5F3FF]/30 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none text-[#1E1B4B] placeholder:text-[#6B7280]/40 focus:border-[#7C3AED] focus:ring-3 focus:ring-[#7C3AED]/15 transition-all duration-200 disabled:opacity-50"
                      style={{ paddingLeft: '48px' }}
                      required
                    />
                  </div>
                </div>
              </>
            ) : null}

            <div className="w-full max-w-[50%]">
              <label htmlFor="password" className="block font-space-grotesk text-[11px] font-bold text-[#7C3AED] mb-2.5 uppercase tracking-[0.08em]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#A78BFA]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isSubmitting || isLoading}
                  aria-describedby={error ? "error-message" : undefined}
                  className="w-full border border-[#7C3AED]/20 bg-[#F5F3FF]/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none text-[#1E1B4B] placeholder:text-[#6B7280]/40 focus:border-[#7C3AED] focus:ring-3 focus:ring-[#7C3AED]/15 transition-all duration-200 disabled:opacity-50"
                  style={{ paddingLeft: '48px' }}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#A78BFA] hover:text-[#7C3AED] transition-colors"
                  disabled={isSubmitting || isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {supportRegister && mode === 'register' && (
              <div className="w-full max-w-[50%]">
                <label htmlFor="confirmPassword" className="block font-space-grotesk text-[11px] font-bold text-[#7C3AED] mb-2.5 uppercase tracking-[0.08em]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#A78BFA]" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={isSubmitting || isLoading}
                    aria-describedby={error ? "error-message" : undefined}
                    className="w-full border border-[#7C3AED]/20 bg-[#F5F3FF]/30 rounded-xl px-4 py-3.5 pl-12 pr-12 text-sm font-medium outline-none text-[#1E1B4B] placeholder:text-[#6B7280]/40 focus:border-[#7C3AED] focus:ring-3 focus:ring-[#7C3AED]/15 transition-all duration-200 disabled:opacity-50"
                    style={{ paddingLeft: '48px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#A78BFA] hover:text-[#7C3AED] transition-colors"
                    disabled={isSubmitting || isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div id="error-message" role="alert" aria-live="polite" className="w-full max-w-[50%] text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* WOW — Submit button with particle burst */}
            <div className="relative w-full max-w-[50%] mt-3">
              {showBurst && (
                <div key={burstKey} className="absolute inset-0 pointer-events-none overflow-visible z-20" aria-hidden>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i / 16) * 360;
                    return (
                      <span
                        key={i}
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: 6 + Math.random() * 5,
                          height: 6 + Math.random() * 5,
                          borderRadius: '50%',
                          background: i % 3 === 0 ? '#7C3AED' : i % 3 === 1 ? '#A78BFA' : '#6D28D9',
                          animation: 'loginBurst 0.65s ease-out forwards',
                          '--burst-dx': `${Math.cos((angle * Math.PI) / 180) * (60 + Math.random() * 60)}px`,
                          '--burst-dy': `${Math.sin((angle * Math.PI) / 180) * (60 + Math.random() * 60)}px`,
                          animationDelay: `${Math.random() * 0.08}s`,
                        } as React.CSSProperties}
                      />
                    );
                  })}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                onClick={() => { setBurstKey(k => k + 1); setShowBurst(true); setTimeout(() => setShowBurst(false), 700); }}
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
                className="w-full text-white px-8 py-3.5 rounded-[10px] font-semibold transition-all duration-200 shadow-md outline-none hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(124,58,237,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>

          {supportRegister && (
            <p className="text-center text-[#6B7280] text-sm mt-8 w-full">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                className="font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition-colors"
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

