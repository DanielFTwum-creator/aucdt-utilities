/**
 * PuzzleBuilder — "Help AI see the world"
 *
 * Airi can't recognise objects yet. Kids drag 4-piece picture puzzles into
 * the correct slots so she can "learn" what things look like.
 *
 * Interaction: pointer-event drag-and-drop (works on mouse + touch/tablet).
 * Piece N belongs in slot N (0=TL, 1=TR, 2=BL, 3=BR).
 * Each piece clips the full 200×200 SVG to its 100×100 quadrant via viewBox.
 */

import React, { useState, useRef, useCallback } from 'react';
import { Airi, AiriMood } from '../Airi';

interface PuzzleBuilderProps {
  onClose: () => void;
}

// ── Quadrant viewBoxes (full image: 200 × 200) ───────────────────────────────
const QUAD_VB = [
  '0 0 100 100',      // 0 = TL
  '100 0 100 100',    // 1 = TR
  '0 100 100 100',    // 2 = BL
  '100 100 100 100',  // 3 = BR
] as const;

const QUAD_ARROWS = ['↖', '↗', '↙', '↘'];

// ── Jigsaw piece clip paths (piece space 0-100, tabs/notches r=15 at edge midpoints) ─────────
// Arc rule: TAB (bulge outward) — sweep matches travel direction (S→1, W→0, N→0, E→1)
//           NOTCH (cave inward) — opposite sweep
const PIECE_PATHS = [
  // 0 TL: right TAB (→), bottom TAB (↓)
  'M 0 0 L 100 0 L 100 35 A 15 15 0 0 1 100 65 L 100 100 L 65 100 A 15 15 0 0 0 35 100 L 0 100 Z',
  // 1 TR: left NOTCH (←), bottom TAB (↓)
  'M 0 0 L 100 0 L 100 100 L 65 100 A 15 15 0 0 0 35 100 L 0 100 L 0 65 A 15 15 0 0 0 0 35 L 0 0 Z',
  // 2 BL: top NOTCH (↑), right TAB (→)
  'M 0 0 L 35 0 A 15 15 0 0 1 65 0 L 100 0 L 100 35 A 15 15 0 0 1 100 65 L 100 100 L 0 100 Z',
  // 3 BR: top NOTCH (↑), left NOTCH (←)
  'M 0 0 L 35 0 A 15 15 0 0 1 65 0 L 100 0 L 100 100 L 0 100 L 0 65 A 15 15 0 0 0 0 35 L 0 0 Z',
] as const;

// Image translation so the correct quadrant appears in 0-100 piece space
const IMG_OFFSETS: [number, number][] = [[0, 0], [-100, 0], [0, -100], [-100, -100]];

// Renders a piece with jigsaw clip shape; idPrefix avoids duplicate SVG IDs on the page
function JigsawSVG({
  pieceId, Pic, size = 120, idPrefix = 'jig',
}: { pieceId: number; Pic: () => JSX.Element; size?: number; idPrefix?: string }) {
  const [tx, ty] = IMG_OFFSETS[pieceId];
  const clipId = `${idPrefix}-${pieceId}`;
  return (
    <svg width={size} height={size} viewBox="-15 -15 130 130">
      <defs>
        <clipPath id={clipId}>
          <path d={PIECE_PATHS[pieceId]} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`} transform={`translate(${tx} ${ty})`}>
        <Pic />
      </g>
      <path d={PIECE_PATHS[pieceId]} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
    </svg>
  );
}

// ── SVG Pictures ─────────────────────────────────────────────────────────────

function SunnyDay() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <g>
      <rect x="0" y="0" width="200" height="115" fill="#7dd3fc" />
      {/* Cloud — TL */}
      <ellipse cx="50" cy="36" rx="32" ry="19" fill="white" opacity="0.95" />
      <ellipse cx="28" cy="44" rx="22" ry="14" fill="white" opacity="0.95" />
      <ellipse cx="74" cy="44" rx="20" ry="13" fill="white" opacity="0.95" />
      {/* Sun rays — TR */}
      {rays.map((deg) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={deg}
            x1={155 + 25 * Math.cos(r)} y1={48 + 25 * Math.sin(r)}
            x2={155 + 38 * Math.cos(r)} y2={48 + 38 * Math.sin(r)}
            stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
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
          <ellipse key={deg} cx={cx} cy={cy} rx="9" ry="12" fill="#f9a8d4"
            transform={`rotate(${deg + 90} ${cx} ${cy})`} />
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
      <rect x="97" y="5" width="6" height="25" rx="3" fill="#94a3b8" />
      <circle cx="100" cy="4" r="9" fill="#60a5fa" />
      <rect x="28" y="28" width="144" height="100" rx="22" fill="#1e293b" />
      <rect x="36" y="33" width="128" height="12" rx="6" fill="white" opacity="0.08" />
      <rect x="40" y="52" width="48" height="32" rx="10" fill="#60a5fa" />
      <circle cx="64" cy="68" r="10" fill="white" opacity="0.9" />
      <circle cx="64" cy="68" r="5" fill="#1e40af" />
      <rect x="112" y="52" width="48" height="32" rx="10" fill="#60a5fa" />
      <circle cx="136" cy="68" r="10" fill="white" opacity="0.9" />
      <circle cx="136" cy="68" r="5" fill="#1e40af" />
      <path d="M 60 103 Q 100 118 140 103" stroke="#60a5fa" strokeWidth="6" fill="none" strokeLinecap="round" />
      <rect x="88" y="128" width="24" height="18" rx="5" fill="#1e293b" />
      <rect x="22" y="146" width="156" height="52" rx="18" fill="#1e293b" />
      <rect x="68" y="156" width="64" height="28" rx="8" fill="#60a5fa" opacity="0.3" />
      <circle cx="100" cy="170" r="10" fill="#60a5fa" opacity="0.7" />
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
      <path d="M 37 130 Q 49 105 61 130 Z" fill="#ef4444" />
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
    intro: "I've never seen a sunny day! Drag the pieces to teach me! 🌞",
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

const makeShuffled = (n: number): number[] => {
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
  const [pile, setPile]           = useState<number[]>(() => makeShuffled(4));
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [phase, setPhase]         = useState<'playing' | 'complete' | 'done'>('playing');
  const [airiMsg, setAiriMsg]     = useState(PUZZLES[0].intro);
  const [airiMood, setAiriMood]   = useState<AiriMood>('thinking');
  const [stars, setStars]         = useState(0);

  // Drag state — piece ID drives React re-render; position is DOM-only (no re-render per move)
  const [draggingPiece, setDraggingPiece] = useState<number | null>(null);
  const [hoverSlot, setHoverSlot]         = useState<number | null>(null);
  const ghostRef                          = useRef<HTMLDivElement>(null);
  const slotRefs                          = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const puzzle = PUZZLES[puzzleIdx];
  const Pic    = puzzle.Pic;

  // ── Puzzle reset ─────────────────────────────────────────────────────────────

  const resetPuzzle = useCallback((idx: number) => {
    setPuzzleIdx(idx);
    setSlots([null, null, null, null]);
    setPile(makeShuffled(4));
    setPhase('playing');
    setAiriMsg(PUZZLES[idx].intro);
    setAiriMood('thinking');
    setDraggingPiece(null);
    setHoverSlot(null);
  }, []);

  // ── Drop logic ───────────────────────────────────────────────────────────────

  const tryDrop = useCallback((slotIdx: number, pieceId: number, currentSlots: (number|null)[], currentPile: number[], currentPuzzleIdx: number) => {
    if (currentSlots[slotIdx] !== null) return;

    if (pieceId === slotIdx) {
      const newSlots = [...currentSlots];
      newSlots[slotIdx] = pieceId;
      const newPile  = currentPile.filter(p => p !== pieceId);
      setSlots(newSlots);
      setPile(newPile);
      setStars(s => s + 1);

      if (newPile.length === 0) {
        setPhase('complete');
        setAiriMsg(PUZZLES[currentPuzzleIdx].learned);
        setAiriMood('celebrating');
      } else {
        setAiriMsg('Perfect fit! 🌟 Keep going!');
        setAiriMood('happy');
        setTimeout(() => {
          setAiriMsg('Drag another piece into place! 🎯');
          setAiriMood('encouraging');
        }, 1400);
      }
    } else {
      setWrongSlot(slotIdx);
      setAiriMsg('Hmm, not quite — try a different spot! 🤔');
      setAiriMood('encouraging');
      setTimeout(() => setWrongSlot(null), 500);
    }
  }, []);

  // ── Pointer event handlers (attached to each piece button) ───────────────────

  const findHoveredSlot = (clientX: number, clientY: number): number => {
    return slotRefs.current.findIndex(ref => {
      if (!ref) return false;
      const r = ref.getBoundingClientRect();
      return clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
    });
  };

  const moveGhost = (x: number, y: number) => {
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate(${x - 58}px, ${y - 58}px) rotate(4deg) scale(1.1)`;
    }
  };

  const handlePiecePointerDown = (e: React.PointerEvent<HTMLButtonElement>, pieceId: number) => {
    if (phase !== 'playing') return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingPiece(pieceId);
    moveGhost(e.clientX, e.clientY);
    setAiriMsg('Drop it on the right spot! 🎯');
    setAiriMood('watching');
  };

  const handlePiecePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingPiece === null) return;
    moveGhost(e.clientX, e.clientY);
    const slot = findHoveredSlot(e.clientX, e.clientY);
    setHoverSlot(slot >= 0 ? slot : null);
  };

  const handlePiecePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingPiece === null) return;
    const slot = findHoveredSlot(e.clientX, e.clientY);
    if (slot >= 0) {
      tryDrop(slot, draggingPiece, slots, pile, puzzleIdx);
    }
    setDraggingPiece(null);
    setHoverSlot(null);
  };

  // ── Navigation ───────────────────────────────────────────────────────────────

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

  const handleNew = () => {
    const next = (puzzleIdx + 1 + Math.floor(Math.random() * (PUZZLES.length - 1))) % PUZZLES.length;
    resetPuzzle(next);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-violet-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-violet-100 dark:border-violet-900 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-bold text-violet-600 dark:text-violet-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-base sm:text-lg font-extrabold text-violet-700 dark:text-violet-300">Puzzle Builder 🧩</h2>
          <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold">
            {puzzle.name} · {puzzleIdx + 1} / {PUZZLES.length}
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="text-sm font-bold text-violet-600 dark:text-violet-400 border border-violet-300 dark:border-violet-700 rounded-lg px-3 py-1.5 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🔄 New
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 pb-24 overflow-hidden">

        {/* 2 × 2 puzzle frame */}
        <div className="grid grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-2xl border-2 border-violet-300 dark:border-violet-700 shrink-0 w-[260px] h-[260px]">
          {([0, 1, 2, 3] as const).map(slotIdx => {
            const placed   = slots[slotIdx];
            const isWrong  = wrongSlot === slotIdx;
            const isHover  = hoverSlot === slotIdx && draggingPiece !== null && slots[slotIdx] === null;
            const isEmpty  = placed === null;

            return (
              <div
                key={slotIdx}
                ref={el => { slotRefs.current[slotIdx] = el; }}
                className={[
                  'relative w-[130px] h-[130px] flex items-center justify-center transition-all duration-200',
                  placed !== null
                    ? 'bg-white dark:bg-gray-900'
                    : isHover
                      ? 'bg-violet-100 dark:bg-violet-900/40'
                      : isWrong
                        ? 'bg-red-50 dark:bg-red-900/30'
                        : 'bg-white/30 dark:bg-gray-800/20',
                ].join(' ')}
                aria-label={isEmpty ? `Drop zone ${slotIdx + 1}` : `Slot ${slotIdx + 1} filled`}
              >
                {placed !== null ? (
                  <>
                    <svg width={130} height={130} viewBox={QUAD_VB[placed]}>
                      <Pic />
                    </svg>
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[9px] font-extrabold leading-none pointer-events-none">
                      ✓
                    </span>
                  </>
                ) : (
                  /* Empty slot — jigsaw-shaped guide outline */
                  <svg width={130} height={130} viewBox="-16 -16 132 132">
                    <path
                      d={PIECE_PATHS[slotIdx]}
                      fill={isHover ? 'rgba(139,92,246,0.12)' : 'rgba(148,163,184,0.07)'}
                      stroke={isWrong ? '#f87171' : isHover ? '#7c3aed' : '#94a3b8'}
                      strokeWidth="2.5"
                      strokeDasharray={isHover ? 'none' : '7 4'}
                      strokeLinejoin="round"
                    />
                    <text x="50" y="52" textAnchor="middle" dominantBaseline="middle"
                      fontSize="22" fill={isWrong ? '#f87171' : isHover ? '#7c3aed' : '#94a3b8'}>
                      {QUAD_ARROWS[slotIdx]}
                    </text>
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* Complete banner */}
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

        {/* Done banner */}
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

        {/* Piece pile */}
        {phase === 'playing' && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm font-bold text-violet-600 dark:text-violet-300 text-center select-none">
              {draggingPiece !== null
                ? 'Drop it on the right spot! 🎯'
                : 'Drag a piece into the frame above! 👆'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {pile.map(pieceId => (
                <button
                  key={pieceId}
                  type="button"
                  onPointerDown={e => handlePiecePointerDown(e, pieceId)}
                  onPointerMove={handlePiecePointerMove}
                  onPointerUp={handlePiecePointerUp}
                  className={[
                    'relative bg-transparent transition-all duration-150',
                    'touch-none select-none focus:outline-none',
                    draggingPiece === pieceId
                      ? 'opacity-30 scale-90 cursor-grabbing'
                      : 'hover:scale-105 cursor-grab active:cursor-grabbing drop-shadow-lg hover:drop-shadow-xl',
                  ].join(' ')}
                  aria-label={`Puzzle piece ${pieceId + 1}`}
                >
                  <JigsawSVG pieceId={pieceId} Pic={Pic} size={112} idPrefix="pile" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating drag ghost — position updated imperatively via ref (no inline style in JSX) */}
      {draggingPiece !== null && (
        <div ref={ghostRef} className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform opacity-90">
          <JigsawSVG pieceId={draggingPiece} Pic={Pic} size={112} idPrefix="ghost" />
        </div>
      )}

      {/* Airi */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
