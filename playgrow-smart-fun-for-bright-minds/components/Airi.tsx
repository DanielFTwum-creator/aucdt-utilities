/**
 * Airi — PlayGrow's AI companion character.
 *
 * A friendly robot tutor that reacts to game events in real time.
 * Rendered as a floating panel in the bottom-left corner of any game screen.
 * The speech bubble fades in/out whenever `message` changes so kids notice new guidance.
 */

import React, { useEffect, useState } from 'react';

export type AiriMood = 'idle' | 'watching' | 'happy' | 'encouraging' | 'celebrating' | 'thinking';

interface AiriProps {
  message: string;
  mood?: AiriMood;
}

// Tailwind animation class per mood
const MOOD_ANIM: Record<AiriMood, string> = {
  idle:        '',
  watching:    '',
  happy:       'animate-bounce',
  encouraging: '',
  celebrating: 'animate-bounce',
  thinking:    'animate-pulse',
};

// Eye glow colour per mood
const EYE_GLOW: Record<AiriMood, string> = {
  idle:        '#60a5fa', // blue-400
  watching:    '#f59e0b', // amber-400 — paying attention
  happy:       '#34d399', // emerald-400
  encouraging: '#a78bfa', // violet-400
  celebrating: '#fbbf24', // yellow-400
  thinking:    '#818cf8', // indigo-400
};

const AiriRobot: React.FC<{ mood: AiriMood }> = ({ mood }) => (
  <svg viewBox="0 0 80 96" className="w-16 h-16 drop-shadow-lg" aria-hidden="true">
    {/* Antenna */}
    <line x1="40" y1="2" x2="40" y2="16" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
    <circle cx="40" cy="2" r="4" fill={EYE_GLOW[mood]} />

    {/* Head */}
    <rect x="10" y="16" width="60" height="46" rx="14" fill="#1e293b" />
    {/* Head shine */}
    <rect x="14" y="19" width="52" height="6" rx="4" fill="white" opacity="0.08" />

    {/* Eyes */}
    <rect x="17" y="26" width="18" height="14" rx="5" fill={EYE_GLOW[mood]}
      style={{ filter: `drop-shadow(0 0 4px ${EYE_GLOW[mood]})` }} />
    <rect x="45" y="26" width="18" height="14" rx="5" fill={EYE_GLOW[mood]}
      style={{ filter: `drop-shadow(0 0 4px ${EYE_GLOW[mood]})` }} />
    {/* Eye pupils */}
    <circle cx="26" cy="33" r="4" fill="white" opacity="0.9" />
    <circle cx="54" cy="33" r="4" fill="white" opacity="0.9" />

    {/* Mouth — smile when happy/celebrating, flat otherwise */}
    {(mood === 'happy' || mood === 'celebrating') ? (
      <path d="M 24 52 Q 40 62 56 52" stroke={EYE_GLOW[mood]} strokeWidth="3.5" fill="none" strokeLinecap="round" />
    ) : mood === 'thinking' ? (
      <path d="M 24 54 Q 40 50 56 54" stroke="#94a3b8" strokeWidth="3" fill="none" strokeLinecap="round" />
    ) : (
      <rect x="24" y="50" width="32" height="5" rx="2.5" fill="#475569" />
    )}

    {/* Neck */}
    <rect x="34" y="62" width="12" height="8" rx="3" fill="#1e293b" />

    {/* Body */}
    <rect x="12" y="70" width="56" height="22" rx="10" fill="#1e293b" />
    {/* Chest panel */}
    <rect x="28" y="75" width="24" height="12" rx="5" fill={EYE_GLOW[mood]} opacity="0.25" />
    <circle cx="40" cy="81" r="4" fill={EYE_GLOW[mood]} opacity="0.7" />

    {/* Arms */}
    <rect x="0"  y="72" width="14" height="9" rx="4.5" fill="#334155" />
    <rect x="66" y="72" width="14" height="9" rx="4.5" fill="#334155" />
  </svg>
);

export const Airi: React.FC<AiriProps> = ({ message, mood = 'idle' }) => {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState(message);

  // Fade out → swap message → fade in on each message change
  useEffect(() => {
    setVisible(false);
    const swap = setTimeout(() => {
      setDisplayed(message);
      setVisible(true);
    }, 200);
    return () => clearTimeout(swap);
  }, [message]);

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-end gap-3 pointer-events-none select-none">
      {/* Speech bubble */}
      <div
        className={`
          relative bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3 shadow-2xl
          max-w-[220px] border-2 border-blue-300 dark:border-blue-600
          transition-all duration-300
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
        `}
      >
        <p className="text-sm font-bold text-gray-700 dark:text-gray-100 leading-snug">{displayed}</p>
        {/* Tail */}
        <div className="absolute -bottom-3 left-5 w-0 h-0"
          style={{ borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid #93c5fd' }} />
        <div className="absolute -bottom-[9px] left-[22px] w-0 h-0"
          style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '10px solid white' }} />
      </div>

      {/* Robot */}
      <div className={`${MOOD_ANIM[mood]} transition-transform duration-300`}>
        <AiriRobot mood={mood} />
      </div>
    </div>
  );
};
