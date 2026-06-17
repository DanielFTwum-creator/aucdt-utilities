/**
 * Music Clouds — "Compose for Airi"
 *
 * AI-for-Good framing: AI learns music patterns from millions of songs to
 * help deaf people experience sound through vibration, compose therapy music
 * for hospitals, and create personalised lullabies for babies in neonatal care.
 *
 * Game flow:
 *  - 4-bar sequencer grid: 7 note rows × 8 beat columns
 *  - Kid places note-clouds on the grid to build a melody
 *  - "Play" plays back the sequence using Web Audio API
 *  - Airi rates the composition (density, variety, rhythm) after playback
 *  - 3 rounds to build melodies → star rating → AI fact celebration
 *  - Free-play mode always available after completing rounds
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

// ── Notes (C major pentatonic, two octaves) ───────────────────────────────────

interface Note {
  label: string;
  freq: number;
  color: string;       // Tailwind bg
  textColor: string;
  emoji: string;
}

const NOTES: Note[] = [
  { label: 'Do²', freq: 523.25, color: 'bg-pink-400',    textColor: 'text-white', emoji: '🌈' },
  { label: 'La',  freq: 440.00, color: 'bg-amber-400',   textColor: 'text-white', emoji: '🌙' },
  { label: 'Sol', freq: 392.00, color: 'bg-emerald-400', textColor: 'text-white', emoji: '🌿' },
  { label: 'Mi',  freq: 329.63, color: 'bg-cyan-400',    textColor: 'text-white', emoji: '⭐' },
  { label: 'Re',  freq: 293.66, color: 'bg-blue-400',    textColor: 'text-white', emoji: '💧' },
  { label: 'Do',  freq: 261.63, color: 'bg-violet-400',  textColor: 'text-white', emoji: '🌸' },
];

const BEATS = 8;   // columns
const ROWS  = NOTES.length;

// ── Challenges ────────────────────────────────────────────────────────────────

interface Challenge {
  title: string;
  description: string;
  minNotes: number;
  hint: string;
}

const CHALLENGES: Challenge[] = [
  {
    title: 'Simple Melody',
    description: 'Place at least 4 notes anywhere on the grid.',
    minNotes: 4,
    hint: 'Try placing notes in a row from left to right!',
  },
  {
    title: 'Stepping Melody',
    description: 'Use notes that go up or down step by step.',
    minNotes: 5,
    hint: 'Try going Do → Re → Mi → Sol — it sounds smooth!',
  },
  {
    title: 'Your Best Lullaby',
    description: 'Create the most beautiful melody you can! At least 6 notes.',
    minNotes: 6,
    hint: 'Start high, go low — or start low and build up!',
  },
];

const AI_FACTS = [
  'AI composes lullabies for babies in hospital neonatal wards — keeping them calm without human staff needing to be there constantly! 🍼🎵',
  'AI turns music into vibrations that deaf people can feel through special wristbands — letting everyone experience music! 🦻✨',
  'Hospitals use AI music composition to generate personalised therapy soundtracks that help patients recover faster! 🏥🎶',
  'AI learned to compose music by analysing millions of songs — just like you\'re doing now by experimenting! 🎵🤖',
  'AI can listen to your heartbeat and compose a unique piece of music that matches exactly how you feel! 💓🎼',
];

// ── Audio helpers ─────────────────────────────────────────────────────────────

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration * 0.9);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

// ── Rating helpers ────────────────────────────────────────────────────────────

function rateMelody(grid: boolean[][], minNotes: number): { stars: number; message: string } {
  const total = grid.flat().filter(Boolean).length;
  const usedRows = grid.map(row => row.some(Boolean));
  const varietyCount = usedRows.filter(Boolean).length;

  if (total < minNotes) {
    return { stars: 1, message: 'Good start! Try adding a few more notes next time! 🎵' };
  }
  if (varietyCount >= 4 && total >= minNotes + 2) {
    return { stars: 3, message: 'Beautiful melody! Great variety — Airi loves this tune! 🌟🌟🌟' };
  }
  if (varietyCount >= 2 || total >= minNotes + 1) {
    return { stars: 2, message: 'Nice melody! Try using more different notes for extra stars! ⭐⭐' };
  }
  return { stars: 1, message: 'Well done! Try mixing high and low notes next time! ⭐' };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Phase = 'compose' | 'playing' | 'rated' | 'allDone';

const EMPTY_GRID = (): boolean[][] => Array.from({ length: ROWS }, () => Array(BEATS).fill(false));

export const MusicClouds: React.FC<Props> = ({ onClose }) => {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [grid, setGrid]                 = useState<boolean[][]>(EMPTY_GRID);
  const [phase, setPhase]               = useState<Phase>('compose');
  const [playingBeat, setPlayingBeat]   = useState<number | null>(null);
  const [stars, setStars]               = useState(0);
  const [totalStars, setTotalStars]     = useState(0);
  const [ratingMsg, setRatingMsg]       = useState('');
  const [factIdx, setFactIdx]           = useState(0);
  const [freePlay, setFreePlay]         = useState(false);

  const [airiMsg, setAiriMsg]   = useState("Tap the grid to place note-clouds, then hit Play! I'll learn your melody. 🎵");
  const [airiMood, setAiriMood] = useState<AiriMood>('idle');

  const ctxRef      = useRef<AudioContext | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const challenge = CHALLENGES[challengeIdx];

  const getCtx = () => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    return ctxRef.current;
  };

  useEffect(() => () => { playTimerRef.current && clearTimeout(playTimerRef.current); }, []);

  // ── Toggle a cell ────────────────────────────────────────────────────────────

  const handleCellClick = (row: number, beat: number) => {
    if (phase === 'playing') return;
    setGrid(prev => {
      const next = prev.map(r => [...r]);
      next[row][beat] = !next[row][beat];
      return next;
    });
    if (phase === 'rated') {
      setPhase('compose');
      setAiriMsg("Keep editing — tap Play when you're ready! 🎵");
      setAiriMood('idle');
    }
    // Play preview tone
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    playTone(ctx, NOTES[row].freq, ctx.currentTime, 0.3);
  };

  // ── Playback ─────────────────────────────────────────────────────────────────

  const handlePlay = useCallback(async () => {
    const noteCount = grid.flat().filter(Boolean).length;
    if (noteCount === 0) {
      setAiriMsg("The grid is empty! Tap some clouds to place notes first. 🌥️");
      setAiriMood('encouraging');
      return;
    }

    const ctx = getCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    setPhase('playing');
    setAiriMsg("Playing your melody… I'm learning! 🎶👂");
    setAiriMood('watching');

    const beatDuration = 0.32;
    const t0 = ctx.currentTime + 0.1;

    for (let beat = 0; beat < BEATS; beat++) {
      for (let row = 0; row < ROWS; row++) {
        if (grid[row][beat]) {
          playTone(ctx, NOTES[row].freq, t0 + beat * beatDuration, beatDuration * 0.85);
        }
      }
    }

    // Animate beat cursor
    let beat = 0;
    const tick = () => {
      setPlayingBeat(beat);
      beat++;
      if (beat <= BEATS) {
        playTimerRef.current = setTimeout(tick, beatDuration * 1000);
      } else {
        setPlayingBeat(null);
        // Rate after playback
        if (!freePlay) {
          const { stars: s, message } = rateMelody(grid, challenge.minNotes);
          setStars(s);
          setTotalStars(ts => ts + s);
          setRatingMsg(message);
          setPhase('rated');
          setAiriMsg(message);
          setAiriMood(s === 3 ? 'celebrating' : 'happy');
          setFactIdx(f => (f + 1) % AI_FACTS.length);
        } else {
          setPhase('compose');
          setAiriMsg("Lovely! Tap play again or keep editing. 🎵");
          setAiriMood('happy');
        }
      }
    };
    playTimerRef.current = setTimeout(tick, 0);
  }, [grid, challenge, freePlay]);

  // ── Next challenge ────────────────────────────────────────────────────────────

  const handleNext = () => {
    const next = challengeIdx + 1;
    if (next >= CHALLENGES.length) {
      setFreePlay(true);
      setPhase('allDone');
      setAiriMsg("You've completed all 3 challenges! Free compose mode unlocked! 🎉🎵");
      setAiriMood('celebrating');
    } else {
      setChallengeIdx(next);
      setGrid(EMPTY_GRID());
      setPhase('compose');
      setAiriMsg(`${CHALLENGES[next].hint} 💡`);
      setAiriMood('encouraging');
    }
  };

  const handleRestart = () => {
    setChallengeIdx(0);
    setGrid(EMPTY_GRID());
    setPhase('compose');
    setTotalStars(0);
    setFreePlay(false);
    setAiriMsg("Let's compose again! Tap the grid to place note-clouds. 🎵");
    setAiriMood('idle');
  };

  const handleClear = () => {
    setGrid(EMPTY_GRID());
    if (phase === 'rated') setPhase('compose');
    setAiriMsg(`${challenge.hint} 💡`);
    setAiriMood('encouraging');
  };

  // ── All done / free play screen ───────────────────────────────────────────────
  if (phase === 'allDone' && !freePlay) {
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-[#0d1b2a] via-[#112240] to-[#0d1b2a] text-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 shrink-0">
          <button type="button" onClick={onClose} className="text-sm font-bold text-indigo-300 hover:text-white transition-colors">← Back</button>
          <h1 className="text-base font-extrabold text-indigo-200 tracking-wide">☁️ Compose for Airi</h1>
          <span />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
          <div className="text-7xl animate-bounce">🎵</div>
          <h2 className="text-2xl font-extrabold text-indigo-200">All Challenges Complete!</h2>
          <div className="text-3xl tracking-widest">{'⭐'.repeat(Math.min(totalStars, 9))}</div>
          <p className="text-indigo-300/80 text-sm max-w-xs">{AI_FACTS[factIdx]}</p>
          <div className="flex gap-3">
            <button type="button" onClick={handleRestart}
              className="px-6 py-2.5 rounded-full bg-indigo-700/60 text-indigo-200 font-bold text-sm hover:bg-indigo-600/60 active:scale-95 transition-all">
              🔄 Play Again
            </button>
            <button type="button" onClick={() => { setFreePlay(true); setGrid(EMPTY_GRID()); setPhase('compose'); setAiriMsg("Free compose! Build whatever melody you like! 🎶"); setAiriMood('happy'); }}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg">
              🎼 Free Compose →
            </button>
          </div>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Main sequencer screen ─────────────────────────────────────────────────────
  const noteCount = grid.flat().filter(Boolean).length;
  const canPlay   = noteCount > 0 && phase !== 'playing';

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-[#0d1b2a] via-[#112240] to-[#0d1b2a] text-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/5 backdrop-blur-sm border-b border-white/10 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-indigo-300 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-indigo-200 tracking-wide">
          {freePlay ? '🎼 Free Compose' : `☁️ ${challenge.title}`}
        </h1>
        {!freePlay ? (
          <span className="text-xs text-indigo-400">{challengeIdx + 1} / {CHALLENGES.length}</span>
        ) : (
          <button type="button" onClick={handleClear}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-200 transition-colors">
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Challenge description */}
      {!freePlay && (
        <div className="px-5 pt-3 pb-1 shrink-0">
          <p className="text-xs text-indigo-300/80 text-center">{challenge.description}</p>
          <p className="text-[11px] text-indigo-400/60 text-center italic">{challenge.hint}</p>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-3 pb-28 overflow-hidden">

        {/* Note labels + grid */}
        <div className="w-full max-w-lg flex gap-2">

          {/* Row labels */}
          <div className="flex flex-col gap-1 shrink-0" style={{ paddingTop: '2px' }}>
            {NOTES.map((n, row) => (
              <div key={row}
                className={`h-9 flex items-center justify-center rounded-lg px-2 text-[10px] font-extrabold ${n.color} ${n.textColor} opacity-80`}
                style={{ minWidth: '38px' }}>
                {n.emoji}
              </div>
            ))}
          </div>

          {/* Beat grid */}
          <div className="flex-1 flex flex-col gap-1">
            {/* Beat column indicators */}
            <div className="flex gap-1 mb-0.5">
              {Array.from({ length: BEATS }).map((_, beat) => (
                <div key={beat} className={[
                  'flex-1 h-1.5 rounded-full transition-all duration-100',
                  playingBeat === beat ? 'bg-white scale-y-150' : 'bg-white/15',
                ].join(' ')} />
              ))}
            </div>

            {NOTES.map((note, row) => (
              <div key={row} className="flex gap-1">
                {Array.from({ length: BEATS }).map((_, beat) => {
                  const active = grid[row][beat];
                  const isCurrent = playingBeat === beat;
                  return (
                    <button
                      key={beat}
                      type="button"
                      onClick={() => handleCellClick(row, beat)}
                      disabled={phase === 'playing'}
                      aria-label={`${note.label} beat ${beat + 1}`}
                      className={[
                        'flex-1 h-9 rounded-lg border-2 transition-all duration-100 active:scale-90',
                        active
                          ? `${note.color} border-white/40 shadow-md ${isCurrent ? 'scale-110 brightness-125' : ''}`
                          : `bg-white/5 border-white/10 hover:bg-white/15 hover:border-white/20 ${
                              isCurrent ? 'bg-white/20 border-white/30' : ''
                            }`,
                        phase === 'playing' ? 'cursor-default' : 'cursor-pointer',
                      ].join(' ')}
                    >
                      {active && <span className="text-base leading-none pointer-events-none">{note.emoji}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-3 w-full max-w-lg justify-center">
          <button type="button" onClick={handleClear} disabled={phase === 'playing'}
            className="px-4 py-2 rounded-xl bg-white/10 text-indigo-300 font-bold text-xs hover:bg-white/15 active:scale-95 transition-all disabled:opacity-30">
            🗑️ Clear
          </button>
          <button type="button" onClick={handlePlay} disabled={!canPlay}
            className={[
              'flex-1 py-3 rounded-2xl font-extrabold text-sm tracking-wide transition-all',
              phase === 'playing'
                ? 'bg-indigo-800/50 text-indigo-400 cursor-not-allowed'
                : canPlay
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-indigo-900/40'
                : 'bg-white/10 text-white/30 cursor-not-allowed',
            ].join(' ')}>
            {phase === 'playing' ? '🎵 Playing…' : '▶ Play Melody'}
          </button>
          {noteCount > 0 && (
            <span className="text-xs text-indigo-400/70 min-w-[32px] text-center">
              {noteCount}🎵
            </span>
          )}
        </div>

        {/* Star rating after play */}
        {phase === 'rated' && !freePlay && (
          <div className="w-full max-w-lg bg-indigo-900/40 border border-indigo-700/40 rounded-2xl p-4 text-center space-y-3">
            <div className="text-3xl tracking-widest">
              {'⭐'.repeat(stars)}{'🖤'.repeat(3 - stars)}
            </div>
            <p className="text-sm text-indigo-200 font-semibold">{ratingMsg}</p>
            <p className="text-xs text-indigo-400/80 italic">{AI_FACTS[factIdx]}</p>
            <div className="flex gap-2 justify-center">
              <button type="button" onClick={() => { setPhase('compose'); setGrid(EMPTY_GRID()); setAiriMsg("Try again — go for 3 stars! 🎵"); setAiriMood('encouraging'); }}
                className="px-5 py-2 rounded-full bg-indigo-700/60 text-indigo-200 font-bold text-xs hover:bg-indigo-600/60 active:scale-95 transition-all">
                🔄 Try Again
              </button>
              <button type="button" onClick={handleNext}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md">
                {challengeIdx + 1 >= CHALLENGES.length ? '🏆 Finish!' : 'Next Challenge →'}
              </button>
            </div>
          </div>
        )}

        {/* Challenge progress dots */}
        {!freePlay && (
          <div className="flex gap-2">
            {CHALLENGES.map((_, i) => (
              <span key={i} className={`w-2 h-2 rounded-full transition-all ${
                i < challengeIdx ? 'bg-indigo-400' : i === challengeIdx ? 'bg-white scale-125' : 'bg-white/20'
              }`} />
            ))}
          </div>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
