import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, User as UserIcon, Lock } from 'lucide-react';

interface FormLoginViewProps {
  appName: string;
  appSubtitle: string;
  primaryColorHex: string;
  onGoogleLogin: () => void;
  onLocalLogin: (identifier: string, password: string) => Promise<void>;
  onRegister?: (username: string, email: string, password: string) => Promise<void>;
  isLoading?: boolean;
  supportRegister?: boolean;
}

export const FormLoginView: React.FC<FormLoginViewProps> = ({
  appName,
  appSubtitle,
  primaryColorHex,
  onGoogleLogin,
  onLocalLogin,
  onRegister,
  isLoading = false,
  supportRegister = true,
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
  const [burstKey, setBurstKey] = useState(0);
  const [showBurst, setShowBurst] = useState(false);

  // Canvas refs
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<Array<{ x: number; y: number; vx: number; vy: number; r: number }>>([]);
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);
  const worldXRef = useRef(0);

  // Simplified continent outlines — logical coords 0–1000 x, 0–500 y (Mercator-ish)
  const CONTINENT_PATHS = [
    'M 120,100 L 135,60 L 162,50 L 198,52 L 228,68 L 255,90 L 275,112 L 282,140 L 268,172 L 252,204 L 235,230 L 220,254 L 205,264 L 200,250 L 213,232 L 218,214 L 200,200 L 175,210 L 158,190 L 152,166 L 132,156 L 115,140 Z',
    'M 220,270 L 240,255 L 264,262 L 280,288 L 290,322 L 293,358 L 286,396 L 270,432 L 252,446 L 236,440 L 218,422 L 208,392 L 208,356 L 214,316 L 220,290 Z',
    'M 208,35 L 236,22 L 262,18 L 288,24 L 298,38 L 292,52 L 276,62 L 252,64 L 228,58 L 214,48 Z',
    'M 452,90 L 468,72 L 490,68 L 512,76 L 522,92 L 516,110 L 498,120 L 478,116 L 462,106 Z',
    'M 446,80 L 458,68 L 470,72 L 467,84 L 455,88 Z',
    'M 452,148 L 472,134 L 500,130 L 524,138 L 540,155 L 550,180 L 552,218 L 550,258 L 541,298 L 526,332 L 511,368 L 493,390 L 478,394 L 462,384 L 448,362 L 438,330 L 432,292 L 430,254 L 432,212 L 440,176 L 448,156 Z',
    'M 530,95 L 560,76 L 600,62 L 650,56 L 710,60 L 770,64 L 822,74 L 864,86 L 890,104 L 902,120 L 900,134 L 874,150 L 842,160 L 802,164 L 762,162 L 722,160 L 692,170 L 666,180 L 640,184 L 612,180 L 582,170 L 560,160 L 545,144 L 535,127 L 531,110 Z',
    'M 614,164 L 634,160 L 652,170 L 662,190 L 660,214 L 644,230 L 626,226 L 610,212 L 608,190 Z',
    'M 720,162 L 750,168 L 764,180 L 760,197 L 744,204 L 726,200 L 718,184 Z',
    'M 724,336 L 754,320 L 794,320 L 832,327 L 854,342 L 862,362 L 860,388 L 844,406 L 817,414 L 786,414 L 758,408 L 737,393 L 727,373 L 723,352 Z',
    'M 862,110 L 873,102 L 883,108 L 881,120 L 870,125 L 862,118 Z',
  ];

  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pre-compile continent paths once
    const paths = CONTINENT_PATHS.map(d => new Path2D(d));

    // Equalizer bar config — randomised once, stable across frames
    const BAR_COUNT = 72;
    const bars = Array.from({ length: BAR_COUNT }, () => ({
      phase: Math.random() * Math.PI * 2,
      freq:  0.5 + Math.random() * 2.8,
      amp:   0.35 + Math.random() * 0.65,
      baseH: 0.05 + Math.random() * 0.12,
    }));

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
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes(canvas.width, canvas.height);
      worldXRef.current = canvas.width * 0.5;
    };
    resize();
    window.addEventListener('resize', resize);

    const MAP_TILE_W = 1000; // logical width of one world-map tile

    const draw = () => {
      tRef.current += 0.018;
      const t = tRef.current;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // ── Layer 1: scrolling world map silhouette ──────────────────
      const mapScale     = height / 500;
      const tileScreenW  = MAP_TILE_W * mapScale;
      worldXRef.current -= 0.45;
      if (worldXRef.current < -tileScreenW) worldXRef.current += tileScreenW;
      const wx = worldXRef.current;

      ctx.fillStyle = 'rgba(219,39,119,0.05)';
      for (let copy = 0; copy < 3; copy++) {
        const ox = wx + copy * tileScreenW;
        if (ox > width + tileScreenW) continue;
        ctx.save();
        ctx.translate(ox, 0);
        ctx.scale(mapScale, mapScale);
        paths.forEach(p => ctx.fill(p));
        ctx.restore();
      }

      // ── Layer 2: vibrant equalizer bars ─────────────────────────
      const barW   = width / BAR_COUNT;
      const maxBarH = height * 0.30;

      for (let i = 0; i < BAR_COUNT; i++) {
        const bar = bars[i];
        const pos      = i / BAR_COUNT;
        const envelope = 0.55 + 0.45 * Math.sin(pos * Math.PI); // taller in centre
        const raw      = Math.abs(Math.sin(t * bar.freq + bar.phase));
        const barH     = maxBarH * envelope * bar.amp * (bar.baseH + (1 - bar.baseH) * Math.pow(raw, 0.6));
        const x        = i * barW;
        const y        = height - barH;
        const hue      = 310 + pos * 55; // deep pink → rose → coral
        const sat      = 78 + 14 * Math.sin(t * 0.4 + i * 0.08);

        const grad = ctx.createLinearGradient(x, y, x, height);
        grad.addColorStop(0,   `hsla(${hue}, ${sat}%, 62%, 0.88)`);
        grad.addColorStop(0.5, `hsla(${hue}, ${sat}%, 52%, 0.55)`);
        grad.addColorStop(1,   `hsla(${hue}, ${sat}%, 42%, 0.0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(x + 0.5, y, barW - 1.5, barH);

        if (barH > 18) {
          ctx.beginPath();
          ctx.arc(x + barW * 0.5, y - 2, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${hue}, 90%, 72%, 0.9)`;
          ctx.fill();
        }
      }

      // ── Layer 3: cursor-reactive particle network ────────────────
      const mouse = mouseRef.current;
      const nodes = nodesRef.current;
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width)  n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = ((140 - dist) / 140) * 1.4;
          n.vx += (dx / dist) * force * 0.04;
          n.vy += (dy / dist) * force * 0.04;
        }
        n.vx *= 0.97; n.vy *= 0.97;
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (spd < 0.08) { n.vx += (Math.random() - 0.5) * 0.06; n.vy += (Math.random() - 0.5) * 0.06; }
        if (spd > 2.8)  { n.vx *= 2.8 / spd; n.vy *= 2.8 / spd; }
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 200) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(219,39,119,${(0.09 * (1 - d / 200)).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(219,39,119,0.15)';
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

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
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

  const clearForm = () => { setIdentifier(''); setUsername(''); setEmail(''); setPassword(''); setConfirmPassword(''); setError(''); };
  const handleModeChange = (newMode: 'login' | 'register') => { setMode(newMode); clearForm(); };

  const inputClass = 'w-full border border-[#db2777]/20 bg-[#fdf2f8]/40 rounded-xl px-4 py-3.5 pl-12 text-sm font-medium outline-none text-[#1a0a10] placeholder:text-[#6B7280]/40 focus:border-[#db2777] focus:ring-2 focus:ring-[#db2777]/15 transition-all duration-200 disabled:opacity-50';

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative overflow-hidden transition-opacity duration-500"
      style={{ opacity: isRedirecting ? 0 : 1, backgroundColor: '#fdf2f8' }}
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(700px 500px ellipse at 50% 38%, rgba(219,39,119,0.07) 0%, transparent 70%)' }} />

      {/* Canvas */}
      <canvas ref={bgCanvasRef} className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />

      {/* Floating SVG objects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
        {/* Large play button — top left */}
        <svg className="svg-float-a absolute" style={{ top: '8%', left: '6%', width: 90, height: 90 }} viewBox="0 0 90 90" fill="none">
          <rect x="4" y="4" width="82" height="82" rx="20" stroke="#db2777" strokeWidth="2.5" fill="none" />
          <polygon points="34,28 66,45 34,62" fill="#db2777" opacity="0.7" />
        </svg>

        {/* Small play button — bottom right */}
        <svg className="svg-float-b absolute" style={{ bottom: '12%', right: '7%', width: 56, height: 56 }} viewBox="0 0 56 56" fill="none">
          <rect x="3" y="3" width="50" height="50" rx="13" stroke="#f9a8d4" strokeWidth="2" fill="none" />
          <polygon points="21,17 40,28 21,39" fill="#f9a8d4" opacity="0.8" />
        </svg>

        {/* Ring — top right */}
        <svg className="svg-spin absolute" style={{ top: '5%', right: '9%', width: 70, height: 70, opacity: 0.10 }} viewBox="0 0 70 70" fill="none">
          <circle cx="35" cy="35" r="30" stroke="#db2777" strokeWidth="3" strokeDasharray="12 8" />
          <circle cx="35" cy="35" r="18" stroke="#f9a8d4" strokeWidth="2" strokeDasharray="6 6" />
        </svg>

        {/* Like thumb — bottom left */}
        <svg className="svg-float-c absolute" style={{ bottom: '18%', left: '5%', width: 64, height: 64 }} viewBox="0 0 64 64" fill="none">
          <path d="M20 28 L28 10 C30 6 36 8 36 14 L36 24 L50 24 C53 24 55 27 54 30 L50 50 C49 53 46 54 44 54 L20 54 Z" stroke="#db2777" strokeWidth="2.2" fill="none" />
          <rect x="8" y="28" width="10" height="26" rx="3" stroke="#db2777" strokeWidth="2.2" fill="none" />
        </svg>

        {/* Bell / subscribe — center right edge */}
        <svg className="svg-float-d absolute" style={{ top: '42%', right: '3%', width: 52, height: 52 }} viewBox="0 0 52 52" fill="none">
          <path d="M26 8 C18 8 14 14 14 22 L14 34 L10 38 L42 38 L38 34 L38 22 C38 14 34 8 26 8 Z" stroke="#f9a8d4" strokeWidth="2" fill="none" />
          <path d="M22 38 C22 40.2 23.8 42 26 42 C28.2 42 30 40.2 30 38" stroke="#f9a8d4" strokeWidth="2" fill="none" />
          <circle cx="38" cy="14" r="6" fill="#db2777" opacity="0.7" />
          <text x="38" y="18" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">!</text>
        </svg>

        {/* Dots cluster — top center-left */}
        <svg className="svg-pulse absolute" style={{ top: '22%', left: '18%', width: 48, height: 24 }} viewBox="0 0 48 24" fill="none">
          <circle cx="8"  cy="12" r="5" fill="#db2777" />
          <circle cx="24" cy="12" r="5" fill="#f9a8d4" />
          <circle cx="40" cy="12" r="5" fill="#db2777" />
        </svg>

        {/* Film strip — bottom center */}
        <svg className="svg-float-b absolute" style={{ bottom: '6%', left: '38%', width: 80, height: 40 }} viewBox="0 0 80 40" fill="none">
          <rect x="2" y="2" width="76" height="36" rx="4" stroke="#db2777" strokeWidth="2" fill="none" />
          <rect x="2"  y="8"  width="8" height="6" rx="1" fill="#db2777" opacity="0.5" />
          <rect x="2"  y="26" width="8" height="6" rx="1" fill="#db2777" opacity="0.5" />
          <rect x="70" y="8"  width="8" height="6" rx="1" fill="#db2777" opacity="0.5" />
          <rect x="70" y="26" width="8" height="6" rx="1" fill="#db2777" opacity="0.5" />
          <line x1="16" y1="2" x2="16" y2="38" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.5" />
          <line x1="32" y1="2" x2="32" y2="38" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.5" />
          <line x1="48" y1="2" x2="48" y2="38" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.5" />
          <line x1="64" y1="2" x2="64" y2="38" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.5" />
        </svg>
      </div>

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center">
        <div
          className="w-full bg-white rounded-[20px] p-10 shadow-[0_4px_6px_rgba(219,39,119,0.06),_0_20px_60px_rgba(219,39,119,0.10)] border border-[#db2777]/15 flex flex-col items-center animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          {/* Brand */}
          <div className="flex flex-col items-center text-center pb-6 mb-8 border-b border-[#db2777]/15 w-full animate-fade-in-down">
            <div className="flex items-center justify-center mb-3">
              {/* YouTube play-button icon */}
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="5" width="22" height="14" rx="4" fill="#db2777" />
                <polygon points="10,8.5 10,15.5 16,12" fill="white" />
              </svg>
              <h1 className="font-space-grotesk font-bold text-[38px] shimmer-gradient tracking-tight leading-none ml-3">
                {appName}
              </h1>
            </div>
            <p className="font-sans text-[14px] text-[#6B7280] font-medium tracking-wide">{appSubtitle}</p>
          </div>

          <h2 className="font-space-grotesk text-[26px] font-bold text-center text-[#1a0a10] mb-2.5 w-full">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-sans text-[14px] text-[#6B7280] text-center mb-8 w-full">
            {mode === 'login' ? 'Sign in to continue' : 'Create an account to get started'}
          </p>

          {/* Google */}
          <button
            type="button"
            onClick={() => { setIsRedirecting(true); setTimeout(() => onGoogleLogin(), 300); }}
            disabled={isSubmitting || isLoading || isRedirecting}
            className="w-full max-w-xs mx-auto bg-white border border-[#db2777]/20 text-[#1a0a10] font-sans text-[14px] px-8 py-3.5 rounded-xl font-medium hover:bg-[#fdf2f8] hover:border-[#db2777]/40 hover:shadow-sm transition-colors duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-8 whitespace-nowrap"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-8 w-full max-w-xs">
            <div className="flex-1 h-px bg-[#db2777]/15"></div>
            <span className="text-xs text-[#f9a8d4] uppercase font-bold tracking-widest font-space-grotesk">Or</span>
            <div className="flex-1 h-px bg-[#db2777]/15"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full" autoComplete="off">
            {mode === 'login' || !supportRegister ? (
              <div className="w-full max-w-xs">
                <label htmlFor="identifier" className="block font-space-grotesk text-[11px] font-bold text-[#db2777] mb-2.5 uppercase tracking-[0.08em]">
                  {supportRegister ? 'Username or Email' : 'Username'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#f9a8d4]" />
                  <input id="identifier" autoFocus type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                    placeholder={supportRegister ? 'Enter username or email' : 'Enter your username'}
                    disabled={isSubmitting || isLoading} aria-describedby={error ? 'error-msg' : undefined}
                    className={inputClass} style={{ paddingLeft: '48px' }} autoComplete="off" required />
                </div>
              </div>
            ) : supportRegister ? (
              <>
                <div className="w-full max-w-xs">
                  <label htmlFor="username" className="block font-space-grotesk text-[11px] font-bold text-[#db2777] mb-2.5 uppercase tracking-[0.08em]">Username</label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#f9a8d4]" />
                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder="Choose a username" disabled={isSubmitting || isLoading}
                      className={inputClass} style={{ paddingLeft: '48px' }} required />
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <label htmlFor="email" className="block font-space-grotesk text-[11px] font-bold text-[#db2777] mb-2.5 uppercase tracking-[0.08em]">Email</label>
                  <div className="relative">
                    <UserIcon className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#f9a8d4]" />
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="Enter your email" disabled={isSubmitting || isLoading}
                      className={inputClass} style={{ paddingLeft: '48px' }} required />
                  </div>
                </div>
              </>
            ) : null}

            <div className="w-full max-w-xs">
              <label htmlFor="password" className="block font-space-grotesk text-[11px] font-bold text-[#db2777] mb-2.5 uppercase tracking-[0.08em]">Password</label>
              <div className="relative">
                <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#f9a8d4]" />
                <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password" disabled={isSubmitting || isLoading} aria-describedby={error ? 'error-msg' : undefined}
                  className={inputClass} style={{ paddingLeft: '48px' }} autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f9a8d4] hover:text-[#db2777] transition-colors" disabled={isSubmitting || isLoading}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {supportRegister && mode === 'register' && (
              <div className="w-full max-w-xs">
                <label htmlFor="confirmPassword" className="block font-space-grotesk text-[11px] font-bold text-[#db2777] mb-2.5 uppercase tracking-[0.08em]">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-4 -translate-y-1/2 w-5 h-5 text-[#f9a8d4]" />
                  <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password" disabled={isSubmitting || isLoading}
                    className={inputClass} style={{ paddingLeft: '48px' }} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-4 -translate-y-1/2 text-[#f9a8d4] hover:text-[#db2777] transition-colors" disabled={isSubmitting || isLoading}>
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {error && <div id="error-msg" role="alert" aria-live="polite" className="w-full max-w-[50%] text-red-400 text-sm font-medium text-center">{error}</div>}

            <div className="relative w-full max-w-[50%] mt-3">
              {showBurst && (
                <div key={burstKey} className="absolute inset-0 pointer-events-none overflow-visible z-20" aria-hidden>
                  {Array.from({ length: 16 }).map((_, i) => {
                    const angle = (i / 16) * 360;
                    return (
                      <span key={i} style={{
                        position: 'absolute', top: '50%', left: '50%',
                        width: 6 + Math.random() * 5, height: 6 + Math.random() * 5,
                        borderRadius: '50%',
                        background: i % 3 === 0 ? '#db2777' : i % 3 === 1 ? '#f9a8d4' : '#be185d',
                        animation: 'loginBurst 0.65s ease-out forwards',
                        '--burst-dx': `${Math.cos((angle * Math.PI) / 180) * (60 + Math.random() * 60)}px`,
                        '--burst-dy': `${Math.sin((angle * Math.PI) / 180) * (60 + Math.random() * 60)}px`,
                        animationDelay: `${Math.random() * 0.08}s`,
                      } as React.CSSProperties} />
                    );
                  })}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                onClick={() => { setBurstKey(k => k + 1); setShowBurst(true); setTimeout(() => setShowBurst(false), 700); }}
                style={{ background: 'linear-gradient(135deg, #db2777 0%, #be185d 100%)' }}
                className="w-full text-white px-8 py-3.5 rounded-[10px] font-semibold transition-all duration-200 shadow-md outline-none hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(219,39,119,0.4)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </div>
          </form>

          {supportRegister && (
            <p className="text-center text-[#6B7280] text-sm mt-8 w-full">
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button type="button" onClick={() => handleModeChange(mode === 'login' ? 'register' : 'login')}
                className="font-semibold text-[#db2777] hover:text-[#be185d] transition-colors">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
