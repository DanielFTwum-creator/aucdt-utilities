import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Users, Zap, Clock, ArrowRight } from 'lucide-react';
import { AppView, Theme } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Background } from './Background';
import { Constellation } from './Constellation';

interface HomeViewProps {
  onNavigate: (view: AppView) => void;
  onStartDemo: () => void;
}

const STATS = [
  { value: '10K+',    label: 'Active Users',    icon: Users, trend: '+24% MoM' },
  { value: '50K+',    label: 'Tasks Automated', icon: Zap,   trend: 'Last 30 days' },
  { value: '1M+ hrs', label: 'Time Saved',      icon: Clock, trend: 'All-time' },
];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
});

const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onStartDemo }) => {
  const { theme } = useTheme();
  const isHC = theme === Theme.HighContrast;

  return (
    <div id="main-content" className="relative min-h-[calc(100vh-4rem)]">
      <Background />

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12">

        {/* ── Hero ── */}
        <section
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-4rem)] py-16"
          aria-labelledby="hero-heading"
        >
          {/* Left — content */}
          <div className="flex flex-col gap-7">

            {/* Eyebrow */}
            <motion.div {...up(0)}>
              <div
                className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border backdrop-blur-md"
                style={{
                  background: 'hsl(var(--brand-500) / 0.12)',
                  borderColor: 'hsl(var(--brand-500) / 0.35)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse shrink-0"
                  style={{ background: 'hsl(var(--accent-500))' }}
                />
                <span
                  className="text-xs font-semibold tracking-[0.22em] uppercase"
                  style={{ color: 'hsl(var(--brand-300))' }}
                >
                  AI-Powered Marketing
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div {...up(0.1)}>
              <h1
                id="hero-heading"
                className="font-display font-bold leading-[1.0] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--text-primary)' }}
              >
                Simplifying
                <span
                  className="block gradient-text mt-1"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                >
                  MarkAI Tasks.
                </span>
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              {...up(0.2)}
              className="text-lg md:text-xl leading-relaxed max-w-[520px]"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your go-to cloud-based marketing platform designed for non-marketers —
              using AI to simplify, automate, and amplify every campaign.
            </motion.p>

            {/* Feature chips */}
            <motion.div {...up(0.28)} className="flex flex-wrap gap-2">
              {['Content Generation', 'Campaign Scheduling', 'AI Image Tools', 'Live Analytics'].map(f => (
                <span
                  key={f}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: 'hsl(var(--brand-500) / 0.25)',
                    color: 'hsl(var(--brand-300))',
                    background: 'hsl(var(--brand-500) / 0.08)',
                  }}
                >
                  {f}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div {...up(0.36)} className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate(AppView.GENERATOR)}
                className="group flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-base text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--brand-500)), hsl(var(--brand-700)))',
                  boxShadow: '0 8px 32px -6px hsl(var(--brand-500) / 0.6)',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 14px 40px -6px hsl(var(--brand-500) / 0.8)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 8px 32px -6px hsl(var(--brand-500) / 0.6)')}
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onStartDemo}
                className="group flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-base border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  borderColor: 'hsl(var(--brand-500) / 0.4)',
                  color: isHC ? '#fff' : 'var(--text-primary)',
                  background: 'hsl(var(--brand-500) / 0.06)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <PlayCircle className="w-5 h-5" style={{ color: 'hsl(var(--brand-300))' }} />
                Watch Demo
              </button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              {...up(0.44)}
              className="flex items-center gap-3 pt-2"
            >
              <div className="flex -space-x-2">
                {['#7c3aed','#4f46e5','#10b981','#f59e0b'].map((c, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[var(--bg-page)] flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: c, zIndex: 4 - i }}
                  >
                    {['T','A','M','K'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Trusted by <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>10,000+</span> marketers across Africa
              </p>
            </motion.div>
          </div>

          {/* Right — Constellation */}
          <motion.div
            className="hidden lg:flex items-center justify-center h-[480px]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Constellation />
          </motion.div>
        </section>

        {/* ── Stats row ── */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Platform statistics"
          className="border-t py-12 mb-8"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x"
            style={{ '--tw-divide-color': 'var(--border-subtle)' } as React.CSSProperties}
          >
            {STATS.map(({ value, label, icon: Icon, trend }) => (
              <div key={label} className="px-8 py-6 md:py-0 flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'hsl(var(--brand-500) / 0.12)' }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'hsl(var(--brand-300))' }} />
                </div>
                <div>
                  <div
                    className="font-display font-bold tracking-tight tabular-nums leading-none"
                    style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--text-primary)' }}
                  >
                    {value}
                  </div>
                  <div className="text-sm mt-1.5" style={{ color: 'var(--text-secondary)' }}>
                    {label}
                  </div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: 'hsl(var(--accent-500))' }}>
                    {trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

      </div>
    </div>
  );
};

export default HomeView;
