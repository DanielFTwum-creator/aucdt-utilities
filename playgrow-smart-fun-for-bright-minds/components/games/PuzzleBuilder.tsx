/**
 * PuzzleBuilder — "Help AI see the world"
 *
 * Airi can't recognise objects yet. Kids assemble 4-piece picture puzzles so
 * she can "learn" what things look like — mirroring how labelled training data
 * teaches a real computer vision model.
 *
 * Game flow:
 *   pick piece from pile → place in correct grid slot → all 4 correct →
 *   Airi celebrates → next puzzle   (3 puzzles total)
 *
 * Piece placement: piece N belongs in slot N (0=TL,1=TR,2=BL,3=BR).
 * Each piece is rendered by clipping the full SVG to its quadrant via viewBox.
 */

import React, { useState, useCallback } from 'react';
import { Airi, AiriMood } from '../Airi';

interface PuzzleBuilderProps {
  onClose: () => void;
}

// ── Quadrant viewBoxes ────────────────────────────────────────────────────────
// Full image: 200 × 200 px.  Each quadrant: 100 × 100 px.
const QUAD_VB = [
  '0 0 100 100',    // 0 = TL
  '100 0 100 100',  // 1 = TR
  '0 100 100 100',  // 2 = BL
  '100 100 100 100' // 3 = BR
] as const;

const QUAD_ARROWS = ['↖', '↗', '↙', '↘'];

// ── Picture definitions ───────────────────────────────────────────────────────

function SunnyDay() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      {/* Sky */}
      <rect x="0" y="0" width="200" height="115" fill="#7dd3fc" />
      {/* Cloud — TL */}
      <ellipse cx="52" cy="36" rx="32" ry="19" fill="white" opacity="0.95" />
      <ellipse cx="30" cy="44" rx="22" ry="14" fill="white" opacity="0.95" />
      <ellipse cx="76" cy="44" rx="20" ry="13" fill="white" opacity="0.95" />
      {/* Sun — TR */}
      {rays.map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line
            key={deg}
            x1={155 + 25 * Math.cos(r)} y1={48 + 25 * Math.sin(r)}
            x2={155 + 37 * Math.cos(r)} y2={48 + 37 * Math.sin(r)}
            stroke="#fbbf24" strokeWidth="5" strokeLinecap="round"
          />
        );
      })}
      <circle cx="155" cy="48" r="23" fill="#fde047" />
      <circle cx="155" cy="48" r="17" fill="#fbbf24" />
      {/* Grass */}
      <rect x="0" y="115" width="200" height="85" fill="#4ade80" />
      <rect x="0" y="115" width="200" height="12" fill="#22c55e" />
      {/* Pond — BL */}
      <ellipse cx="54" cy="165" rx="38" ry="22" fill="#93c5fd" />
      <ellipse cx="54" cy="163" rx="28" ry="16" fill="#60a5fa" />
      {/* Flower — BR */}
      <rect x="148" y="150" width="6" height="38" rx="3" fill="#16a34a" />
      {[0, 72, 144, 216, 288].map((deg) => {
        const r = (deg * Math.PI) / 180;
        const cx = 151 + 14 * Math.cos(r);
        const cy = 148 + 14 * Math.sin(r);
        return (
          <ellipse
            key={deg} cx={cx} cy={cy} rx="9" ry="12" fill="#f9a8d4"
            transform={`rotate(${deg + 90} ${cx} ${cy})`}
          />
        );
      })}
      <circle cx="151" cy="148" r="10" fill="#fde047" />
    </g>
  );
}

function AirisFace() {
  return (
    <g>
      <rect x="0" y="0" width="200" height="200" fill="#dbeafe" />
      {/* Antenna */}
      <rect x="97" y="5" width="6" height="25" rx="3" fill="#94a3b8" />
      <circle cx="100" cy="4" r="9" fill="#60a5fa" />
      {/* Head */}
      <rect x="28" y="28" width="144" height="100" rx="22" fill="#1e293b" />
      <rect x="36" y="33" width="128" height="12" rx="6" fill="white" opacity="0.08" />
      {/* Left eye */}
      <rect x="40" y="52" width="48" height="32" rx="10" fill="#60a5fa" />
      <circle cx="64" cy="68" r="10" fill="white" opacity="0.9" />
      <circle cx="64" cy="68" r="5" fill="#1e40af" />
      {/* Right eye */}
      <rect x="112" y="52" width="48" height="32" rx="10" fill="#60a5fa" />
      <circle cx="136" cy="68" r="10" fill="white" opacity="0.9" />
      <circle cx="136" cy="68" r="5" fill="#1e40af" />
      {/* Smile */}
      <path d="M 60 103 Q 100 118 140 103" stroke="#60a5fa" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* Neck */}
      <rect x="88" y="128" width="24" height="18" rx="5" fill="#1e293b" />
      {/* Body */}
      <rect x="22" y="146" width="156" height="52" rx="18" fill="#1e293b" />
      <rect x="68" y="156" width="64" height="28" rx="8" fill="#60a5fa" opacity="0.3" />
      <circle cx="100" cy="170" r="10" fill="#60a5fa" opacity="0.7" />
      {/* Arms */}
      <rect x="0"   y="148" width="24" height="22" rx="8" fill="#334155" />
      <rect x="176" y="148" width="24" height="22" rx="8" fill="#334155" />
    </g>
  );
}

const STARS: [number, number, number][] = [
  [22,15,2.5],[68,30,1.5],[12,60,1.5],[48,52,2],[88,10,2],[128,25,1.5],
  [172,12,2],[158,52,1.5],[108,42,1.5],[188,75,2],[148,88,1.5],[168,138,2],
  [58,128,1.5],[28,152,2],[82,168,1.5],[118,162,1.5],[172,172,1.5],
  [142,184,2],[52,188,1.5],[98,108,1.5],[18,98,1.5],[84,92,1.5],[158,102,2],
];

function NightSky() {
  return (
    <g>
      <rect x="0" y="0" width="200" height="200" fill="#0f172a" />
      {STARS.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="white" opacity={i % 2 === 0 ? 0.9 : 0.5} />
      ))}
      {/* Moon — TR */}
      <circle cx="155" cy="42" r="32" fill="#fef08a" />
      <circle cx="170" cy="35" r="28" fill="#0f172a" />
      {/* Rocket — BL */}
      <path d="M 38 130 Q 49 105 60 130 Z" fill="#ef4444" />
      <rect x="37" y="130" width="24" height="44" rx="8" fill="#f1f5f9" />
      <circle cx="49" cy="148" r="8" fill="#93c5fd" stroke="#64748b" strokeWidth="2" />
      <path d="M 37 162 L 23 178 L 37 175 Z" fill="#ef4444" />
      <path d="M 61 162 L 75 178 L 61 175 Z" fill="#ef4444" />
      <ellipse cx="49" cy="178" rx="10" ry="15" fill="#fb923c" opacity="0.8" />
      <ellipse cx="49" cy="175" rx="6" ry="9" fill="#fde047" />
      {/* Planet — BR */}
      <ellipse cx="150" cy="155" rx="48" ry="14" fill="none" stroke="#c4b5fd" strokeWidth="7" opacity="0.6" />
      <circle cx="150" cy="155" r="30" fill="#a78bfa" />
      <circle cx="140" cy="147" r="8" fill="#7c3aed" opacity="0.5" />
      <circle cx="160" cy="163" r="5" fill="#7c3aed" opacity="0.4" />
    </g>
  );
}

// ── Puzzle metadata ───────────────────────────────────────────────────────────

const PUZZLES = [
  {
    name: 'Sunny Day ☀️',
    intro: "I've never seen a sunny day! Assemble the picture to teach me! 🌞",
    learned: 'Now I know what a sunny day looks like! ☀️ Thank you!',
    Pic: SunnyDay,
  },
  {
    name: "Airi's Face 🤖",
    intro: 'Wait — is that ME? Help me see my own face! 🤖',
    learned: "I recognise my own face now! That's me! 🤖✨",
    Pic: AirisFace,
  },
  {
    name: 'Night Sky 🌙',
    intro: 'Space is so mysterious! Show me the night sky! 🚀',
    learned: 'Stars, moon, rockets, planets — I love space now! 🌙🚀',
    Pic: NightSky,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const shuffled = (n: number) => {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const PuzzleBuilder: React.FC<PuzzleBuilderProps> = ({ onClose }) => {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [slots, setSlots]         = useState<(number | null)[]>([null, null, null, null]);
  const [pile, setPile]           = useState<number[]>(() => shuffled(4));
  const [selected, setSelected]   = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [phase, setPhase]         = useState<'playing' | 'complete' | 'done'>('playing');
  const [airiMsg, setAiriMsg]     = useState(PUZZLES[0].intro);
  const [airiMood, setAiriMood]   = useState<AiriMood>('thinking');
  const [stars, setStars]         = useState(0);

  const puzzle = PUZZLES[puzzleIdx];
  const Pic    = puzzle.Pic;

  const resetPuzzle = useCallback((idx: number) => {
    setPuzzleIdx(idx);
    setSlots([null, null, null, null]);
    setPile(shuffled(4));
    setSelected(null);
    setPhase('playing');
    setAiriMsg(PUZZLES[idx].intro);
    setAiriMood('thinking');
  }, []);

  const handlePickPiece = (pieceId: number) => {
    if (phase !== 'playing') return;
    setSelected(prev => (prev === pieceId ? null : pieceId));
    setAiriMsg(selected === pieceId
      ? 'No problem — pick another piece!'
      : 'Good pick! Now tap the matching slot in the frame above! 👆');
    setAiriMood('watching');
  };

  const handleSlotClick = (slotIdx: number) => {
    if (phase !== 'playing' || selected === null || slots[slotIdx] !== null) return;

    if (selected === slotIdx) {
      // ── Correct placement ──
      const newSlots = [...slots];
      newSlots[slotIdx] = selected;
      const newPile = pile.filter(p => p !== selected);
      setSlots(newSlots);
      setPile(newPile);
      setSelected(null);
      setStars(s => s + 1);

      if (newPile.length === 0) {
        setPhase('complete');
        setAiriMsg(puzzle.learned);
        setAiriMood('celebrating');
      } else {
        setAiriMsg('Perfect fit! 🌟 Keep going!');
        setAiriMood('happy');
        setTimeout(() => {
          setAiriMsg('Pick another piece! 🎯');
          setAiriMood('encouraging');
        }, 1400);
      }
    } else {
      // ── Wrong slot ──
      setWrongSlot(slotIdx);
      setAiriMsg('Hmm, not quite — try a different spot! 🤔');
      setAiriMood('encouraging');
      setTimeout(() => setWrongSlot(null), 500);
    }
  };

  const handleNext = () => {
    if (puzzleIdx + 1 >= PUZZLES.length) {
      setPhase('done');
      setAiriMsg(`WOW! You taught me ${PUZZLES.length} whole pictures! I can see the world! 🌍🤖`);
      setAiriMood('celebrating');
    } else {
      resetPuzzle(puzzleIdx + 1);
    }
  };

  const handleRestart = () => {
    setStars(0);
    resetPuzzle(0);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-violet-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-violet-100 dark:border-violet-900 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-bold text-violet-600 dark:text-violet-300 hover:underline focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-extrabold text-violet-700 dark:text-violet-300">Puzzle Builder 🧩</h2>
          <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold">
            {puzzle.name} · {puzzleIdx + 1} / {PUZZLES.length}
          </p>
        </div>
        <div className="text-sm font-bold text-yellow-500 min-w-[40px] text-right">
          {'⭐'.repeat(Math.min(stars, 12))}
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col items-center justify-start gap-4 px-4 pt-4 pb-28 overflow-y-auto">

        {/* Puzzle frame — 2 × 2 grid */}
        <div
          className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden shadow-2xl border-4 border-violet-300 dark:border-violet-700 shrink-0 w-[268px] h-[268px]"
        >
          {[0, 1, 2, 3].map(slotIdx => {
            const placed  = slots[slotIdx];
            const isWrong = wrongSlot === slotIdx;
            const isEmpty = placed === null;
            const canPlace = isEmpty && selected !== null && phase === 'playing';

            return (
              <div
                key={slotIdx}
                onClick={() => handleSlotClick(slotIdx)}
                className={[
                  'relative w-[130px] h-[130px] flex items-center justify-center transition-all duration-200',
                  'border-2',
                  placed !== null
                    ? 'border-emerald-400 bg-white dark:bg-gray-900 cursor-default'
                    : canPlace
                      ? 'border-violet-400 border-dashed bg-violet-50 dark:bg-violet-900/30 cursor-pointer hover:bg-violet-100 dark:hover:bg-violet-900/50'
                      : 'border-dashed border-gray-300 dark:border-gray-600 bg-white/40 dark:bg-gray-800/30 cursor-default',
                  isWrong ? 'bg-red-100 dark:bg-red-900/40 border-red-400 border-solid' : '',
                ].join(' ')}
                role="button"
                aria-label={placed !== null ? `Slot ${slotIdx + 1}: filled` : `Slot ${slotIdx + 1}: empty`}
              >
                {placed !== null ? (
                  <>
                    <svg width={130} height={130} viewBox={QUAD_VB[placed]}>
                      <Pic />
                    </svg>
                    <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-extrabold leading-none">
                      ✓
                    </span>
                  </>
                ) : (
                  <span className="text-3xl text-gray-300 dark:text-gray-600 select-none pointer-events-none">
                    {QUAD_ARROWS[slotIdx]}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Complete overlay ── */}
        {phase === 'complete' && (
          <div className="text-center animate-bounce">
            <p className="text-4xl">🎉🤖🎉</p>
            <p className="text-xl font-extrabold text-violet-700 dark:text-violet-200 mt-2">Airi learned it!</p>
            <button
              type="button"
              onClick={handleNext}
              className="mt-4 px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {puzzleIdx + 1 >= PUZZLES.length ? '🏆 Finish!' : 'Next Picture →'}
            </button>
          </div>
        )}

        {/* ── Done overlay ── */}
        {phase === 'done' && (
          <div className="text-center">
            <div className="text-6xl mb-3">🌍🤖🌟</div>
            <p className="text-xl font-extrabold text-violet-700 dark:text-violet-200">Airi can see the world!</p>
            <p className="text-sm text-violet-500 dark:text-violet-400 mt-2 max-w-xs mx-auto">
              You taught her {PUZZLES.length} pictures. Real AI also learns from labelled examples — just like this!
            </p>
            <button
              type="button"
              onClick={handleRestart}
              className="mt-5 px-8 py-3 bg-violet-500 hover:bg-violet-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}

        {/* ── Piece pile ── */}
        {phase === 'playing' && (
          <div className="flex flex-col items-center gap-3 w-full">
            <p className="text-sm font-bold text-violet-600 dark:text-violet-300 text-center">
              {selected !== null
                ? 'Now tap the matching slot in the frame above! 👆'
                : 'Tap a piece to pick it up, then tap where it goes! 🎯'}
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {pile.map(pieceId => (
                <button
                  key={pieceId}
                  type="button"
                  onClick={() => handlePickPiece(pieceId)}
                  className={[
                    'relative rounded-xl overflow-hidden transition-all duration-200 active:scale-95 focus:outline-none',
                    selected === pieceId
                      ? 'ring-4 ring-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.55)] scale-105'
                      : 'ring-2 ring-violet-200 dark:ring-violet-700 hover:ring-violet-400 hover:scale-105',
                  ].join(' ')}
                  aria-label={`Puzzle piece ${pieceId + 1}${selected === pieceId ? ' (selected)' : ''}`}
                >
                  <svg width={108} height={108} viewBox={QUAD_VB[pieceId]}>
                    <Pic />
                  </svg>
                  {selected === pieceId && (
                    <div className="absolute inset-0 bg-violet-500/20 flex items-center justify-center pointer-events-none">
                      <span className="text-violet-700 dark:text-violet-200 text-2xl font-extrabold drop-shadow">✔</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Airi companion ── */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
