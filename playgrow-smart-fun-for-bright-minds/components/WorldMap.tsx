import React, { useState } from 'react';
import { Zone, ZoneID } from '../types';
import { Theme } from '../App';
import ThemeSwitcher from './ThemeSwitcher';
import { LockIcon } from './icons';
import { MagicReveal } from './MagicReveal';

interface WorldMapProps {
  zones: Zone[];
  onSelectZone: (zoneId: ZoneID) => void;
  onAdminClick: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// ── Zone layout: hub + 6 satellites ────────────────────────────────────────
// Cognitive (Brainy Town) sits at top-centre as the hero zone.
// The remaining 6 are arranged in two arcing rows below it.
const ZONE_POSITIONS: Record<ZoneID, { top: string; left: string }> = {
  [ZoneID.Cognitive]:  { top: '12%',  left: '50%' },
  [ZoneID.Creativity]: { top: '38%',  left: '16%' },
  [ZoneID.Language]:   { top: '38%',  left: '84%' },
  [ZoneID.Rest]:       { top: '48%',  left: '50%' },
  [ZoneID.Movement]:   { top: '70%',  left: '20%' },
  [ZoneID.Exploration]:{ top: '70%',  left: '80%' },
  [ZoneID.Social]:     { top: '82%',  left: '50%' },
};

// Bright colour ring per zone — overrides dark mode so the map stays colourful
const ZONE_RING: Record<ZoneID, string> = {
  [ZoneID.Cognitive]:   'ring-4 ring-blue-400   bg-blue-100',
  [ZoneID.Creativity]:  'ring-4 ring-pink-400   bg-pink-100',
  [ZoneID.Language]:    'ring-4 ring-violet-400 bg-violet-100',
  [ZoneID.Movement]:    'ring-4 ring-orange-400 bg-orange-100',
  [ZoneID.Social]:      'ring-4 ring-rose-400   bg-rose-100',
  [ZoneID.Exploration]: 'ring-4 ring-teal-400   bg-teal-100',
  [ZoneID.Rest]:        'ring-4 ring-indigo-400 bg-indigo-100',
};

// Glow shadow colour per zone
const ZONE_GLOW: Record<ZoneID, string> = {
  [ZoneID.Cognitive]:   'hover:shadow-blue-400/60',
  [ZoneID.Creativity]:  'hover:shadow-pink-400/60',
  [ZoneID.Language]:    'hover:shadow-violet-400/60',
  [ZoneID.Movement]:    'hover:shadow-orange-400/60',
  [ZoneID.Social]:      'hover:shadow-rose-400/60',
  [ZoneID.Exploration]: 'hover:shadow-teal-400/60',
  [ZoneID.Rest]:        'hover:shadow-indigo-400/60',
};

// ── Decorative cloud ────────────────────────────────────────────────────────
const Cloud: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 120 60" className={`opacity-60 ${className}`} aria-hidden="true">
    <ellipse cx="60" cy="45" rx="55" ry="18" fill="white" />
    <ellipse cx="35" cy="38" rx="28" ry="20" fill="white" />
    <ellipse cx="80" cy="35" rx="32" ry="22" fill="white" />
    <ellipse cx="55" cy="28" rx="22" ry="18" fill="white" />
  </svg>
);

// ── Stars for night-sky mode ─────────────────────────────────────────────────
const Stars: React.FC = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {[
      { t: '8%',  l: '10%', s: 'w-1.5 h-1.5' },
      { t: '5%',  l: '30%', s: 'w-1 h-1' },
      { t: '12%', l: '60%', s: 'w-2 h-2' },
      { t: '6%',  l: '80%', s: 'w-1.5 h-1.5' },
      { t: '20%', l: '5%',  s: 'w-1 h-1' },
      { t: '15%', l: '92%', s: 'w-1 h-1' },
      { t: '30%', l: '88%', s: 'w-1.5 h-1.5' },
      { t: '25%', l: '3%',  s: 'w-2 h-2' },
    ].map((s, i) => (
      <div
        key={i}
        className={`absolute ${s.s} bg-white rounded-full animate-pulse`}
        style={{ top: s.t, left: s.l, animationDelay: `${i * 0.4}s` }}
      />
    ))}
  </div>
);

// ── Zone button ─────────────────────────────────────────────────────────────
const ZoneButton: React.FC<{ zone: Zone; onClick: () => void }> = ({ zone, onClick }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') onClick();
  };

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer group focus:outline-none"
      style={{ ...ZONE_POSITIONS[zone.id], transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Go to ${zone.title}`}
    >
      {/* Circle */}
      <div
        className={`
          ${ZONE_RING[zone.id]} ${ZONE_GLOW[zone.id]}
          w-20 h-20 sm:w-28 sm:h-28
          rounded-full flex items-center justify-center
          shadow-xl hover:shadow-2xl
          transition-all duration-300
          group-hover:scale-110 group-hover:-translate-y-1
          group-focus:outline-none group-focus:ring-offset-2
        `}
      >
        <zone.Icon className={`${zone.color} w-10 h-10 sm:w-14 sm:h-14`} />
      </div>

      {/* Label pill */}
      <span
        className="
          mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold
          bg-white/90 dark:bg-gray-900/80 text-gray-800 dark:text-gray-100
          shadow-md whitespace-nowrap
          group-hover:bg-white dark:group-hover:bg-gray-800
          transition-colors duration-200
        "
      >
        {zone.title}
      </span>
    </div>
  );
};

// ── World Map ───────────────────────────────────────────────────────────────
const WorldMap: React.FC<WorldMapProps> = ({ zones, onSelectZone, onAdminClick, theme, setTheme }) => {
  const isDark = theme === 'dark';
  const [showMagic, setShowMagic] = useState(false);

  return (
    <main
      className={`
        relative w-full h-full flex flex-col items-center overflow-hidden
        ${isDark
          ? 'bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950'
          : 'bg-gradient-to-b from-sky-300 via-blue-200 to-emerald-200'}
        hc-bg-primary
      `}
      aria-label="PlayGrow World Map"
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeSwitcher theme={theme} setTheme={setTheme} />
      </div>
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={onAdminClick}
          className="p-2 bg-white/30 dark:bg-white/10 rounded-full shadow-md hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-sm transition-colors focus:outline-none focus:ring-4 focus:ring-blue-400"
          aria-label="Open Admin Panel"
        >
          <LockIcon className="w-5 h-5 text-white dark:text-gray-300" />
        </button>
        <button
          onClick={() => setShowMagic(true)}
          className="p-2 bg-white/30 dark:bg-white/10 rounded-full shadow-md hover:bg-white/60 dark:hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          aria-label="Behind the magic"
          title="How was this made?"
        >
          <span className="text-lg leading-none select-none">✨</span>
        </button>
      </div>

      {showMagic && <MagicReveal onClose={() => setShowMagic(false)} />}

      {/* Background decorations */}
      {isDark ? (
        <Stars />
      ) : (
        <>
          <Cloud className="absolute top-6 left-4 w-36" />
          <Cloud className="absolute top-14 right-8 w-28" />
          <Cloud className="absolute top-2  left-1/2 w-24 -translate-x-1/2" />
        </>
      )}

      {/* Ground hill */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className="w-full h-24 sm:h-32">
          <ellipse cx="720" cy="200" rx="900" ry="140"
            fill={isDark ? '#064e3b' : '#4ade80'} />
        </svg>
      </div>

      {/* Title */}
      <header className="relative z-10 text-center pt-6 sm:pt-10 mb-2">
        <h1
          className="text-5xl sm:text-7xl font-extrabold tracking-tight"
          style={{
            color: 'white',
            textShadow: isDark
              ? '0 0 24px rgba(99,102,241,0.9), 2px 2px 4px rgba(0,0,0,0.8)'
              : '2px 3px 8px rgba(0,0,80,0.25)',
          }}
        >
          PlayGrow
        </h1>
        <p
          className="text-base sm:text-xl font-bold mt-1"
          style={{
            color: isDark ? '#a5b4fc' : 'white',
            textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
          }}
        >
          Smart Fun for Bright Minds
        </p>
      </header>

      {/* Zone map */}
      <div className="relative w-full flex-1 max-w-3xl z-10">
        {zones.map((zone) => (
          <ZoneButton
            key={zone.id}
            zone={zone}
            onClick={() => onSelectZone(zone.id)}
          />
        ))}
      </div>
    </main>
  );
};

export default WorldMap;
