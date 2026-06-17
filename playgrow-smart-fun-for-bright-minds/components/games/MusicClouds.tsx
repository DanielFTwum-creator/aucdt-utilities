import React, { useState, useRef, useCallback } from 'react';

interface Props { onClose: () => void; }

// Musical notes mapped to clouds — C major pentatonic for a gentle lullaby feel
const CLOUDS = [
  { label: 'Do',  freq: 261.63, color: 'from-violet-300 to-violet-400',  glow: 'shadow-violet-300',  emoji: '🌸' },
  { label: 'Re',  freq: 293.66, color: 'from-blue-300   to-blue-400',    glow: 'shadow-blue-300',    emoji: '💧' },
  { label: 'Mi',  freq: 329.63, color: 'from-cyan-300   to-cyan-400',    glow: 'shadow-cyan-300',    emoji: '⭐' },
  { label: 'Sol', freq: 392.00, color: 'from-emerald-300 to-emerald-400', glow: 'shadow-emerald-300', emoji: '🌿' },
  { label: 'La',  freq: 440.00, color: 'from-amber-300  to-amber-400',   glow: 'shadow-amber-300',   emoji: '🌙' },
  { label: 'Do²', freq: 523.25, color: 'from-pink-300   to-pink-400',    glow: 'shadow-pink-300',    emoji: '🌈' },
  { label: 'Mi²', freq: 659.26, color: 'from-rose-300   to-rose-400',    glow: 'shadow-rose-300',    emoji: '✨' },
];

// Twinkle Twinkle — indices into CLOUDS array (C maj pentatonic mapping)
const LULLABY: Array<{ note: number; dur: number }> = [
  {note:0,dur:0.4},{note:0,dur:0.4},{note:3,dur:0.4},{note:3,dur:0.4},
  {note:4,dur:0.4},{note:4,dur:0.4},{note:3,dur:0.7},
  {note:2,dur:0.4},{note:2,dur:0.4},{note:1,dur:0.4},{note:1,dur:0.4},
  {note:0,dur:0.4},{note:0,dur:0.4},{note:0,dur:0.8},
  {note:3,dur:0.4},{note:3,dur:0.4},{note:2,dur:0.4},{note:2,dur:0.4},
  {note:1,dur:0.4},{note:1,dur:0.4},{note:1,dur:0.7},
  {note:3,dur:0.4},{note:3,dur:0.4},{note:2,dur:0.4},{note:2,dur:0.4},
  {note:1,dur:0.4},{note:1,dur:0.4},{note:1,dur:0.8},
];

function playTone(ctx: AudioContext, freq: number, duration = 0.5, startTime = 0) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.25, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

export const MusicClouds: React.FC<Props> = ({ onClose }) => {
  const [active, setActive]   = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [lit, setLit]         = useState<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  };

  const tapCloud = useCallback((i: number) => {
    if (playing) return;
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    playTone(ctx, CLOUDS[i].freq, 0.8);
    setActive(i);
    setTimeout(() => setActive(null), 600);
  }, [playing]);

  const playLullaby = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    const ctx = getCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    let t = ctx.currentTime + 0.1;
    LULLABY.forEach(({ note, dur }) => {
      playTone(ctx, CLOUDS[note].freq, dur, t);
      t += dur + 0.05;
    });
    // Light up clouds in sequence
    let delay = 100;
    LULLABY.forEach(({ note, dur }) => {
      setTimeout(() => setLit(note), delay);
      setTimeout(() => setLit(null), delay + dur * 900);
      delay += (dur + 0.05) * 1000;
    });
    setTimeout(() => { setPlaying(false); setLit(null); }, delay + 200);
  }, [playing]);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-[#0d1b2a] via-[#112240] to-[#0d1b2a] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-indigo-300 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-indigo-200 tracking-wide">☁️ Music Clouds</h1>
        <span className="text-xs text-indigo-400/70">Tap to play</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 pb-8">
        {/* Instruction */}
        <p className="text-indigo-300/80 text-sm text-center">
          Tap any cloud to hear its note.<br/>
          <span className="text-indigo-400/60 text-xs">Each cloud plays a different lullaby sound 🎵</span>
        </p>

        {/* Cloud grid */}
        <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
          {CLOUDS.map((c, i) => {
            const isLit = lit === i || active === i;
            return (
              <button key={i} type="button"
                onClick={() => tapCloud(i)}
                disabled={playing}
                className={[
                  'relative flex flex-col items-center gap-1 rounded-2xl p-3 transition-all duration-150 select-none',
                  `bg-gradient-to-b ${c.color}`,
                  isLit ? `scale-115 shadow-lg ${c.glow}` : 'scale-100 opacity-80 hover:opacity-100 hover:scale-105',
                  playing && lit !== i ? 'opacity-40' : '',
                  'active:scale-95',
                ].join(' ')}
                style={{ boxShadow: isLit ? `0 0 24px 6px` : undefined }}>
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-[10px] font-extrabold text-white/90 tracking-wide">{c.label}</span>
              </button>
            );
          })}

          {/* Lullaby button spans 4 cols */}
          <button type="button" onClick={playLullaby} disabled={playing}
            className={[
              'col-span-4 py-3 rounded-2xl font-extrabold text-sm tracking-wide transition-all',
              playing
                ? 'bg-indigo-800/50 text-indigo-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-indigo-900/40',
            ].join(' ')}>
            {playing ? '🎵 Playing Twinkle Twinkle…' : '▶ Play Lullaby'}
          </button>
        </div>

        {/* Ambient star dots */}
        <div className="flex gap-3 mt-2">
          {CLOUDS.map((_, i) => (
            <span key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${lit === i ? 'bg-white scale-150' : 'bg-white/20'}`} />
          ))}
        </div>

        <p className="text-indigo-400/50 text-[11px] text-center max-w-xs">
          🎵 Sounds are generated in your browser — no downloads needed.
        </p>
      </div>
    </div>
  );
};
