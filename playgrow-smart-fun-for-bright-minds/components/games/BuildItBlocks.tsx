/**
 * Build-It Blocks — "Teach AI to Build"
 *
 * Kids drag coloured geometric shapes from the toolbar onto the canvas to
 * build scenes. Airi gives a creative challenge each session and explains
 * how AI learns spatial relationships from examples.
 *
 * Interaction: pointer-event drag from toolbar to canvas (mouse + touch).
 * Ghost position updated via DOM ref — no React re-render per frame.
 */

import React, { useRef, useState, useCallback } from 'react';
import { Airi, AiriMood } from '../Airi';

interface BuildItBlocksProps { onClose: () => void; }

// ── Shapes ────────────────────────────────────────────────────────────────────

interface Stamp {
  id: string;
  label: string;
  // SVG content in a 64 × 64 viewBox
  svg: (color: string) => React.ReactNode;
}

const STAMPS: Stamp[] = [
  {
    id: 'square',
    label: 'Square',
    svg: (c) => <rect x="4" y="4" width="56" height="56" rx="5" fill={c} />,
  },
  {
    id: 'circle',
    label: 'Circle',
    svg: (c) => <circle cx="32" cy="32" r="28" fill={c} />,
  },
  {
    id: 'triangle',
    label: 'Triangle',
    svg: (c) => <polygon points="32,5 61,59 3,59" fill={c} />,
  },
  {
    id: 'rect',
    label: 'Wide Rect',
    svg: (c) => <rect x="3" y="18" width="58" height="28" rx="5" fill={c} />,
  },
  {
    id: 'star',
    label: 'Star',
    svg: (c) => <polygon points="32,4 38,22 58,22 42,34 48,54 32,42 16,54 22,34 6,22 26,22" fill={c} />,
  },
  {
    id: 'diamond',
    label: 'Diamond',
    svg: (c) => <polygon points="32,4 60,32 32,60 4,32" fill={c} />,
  },
  {
    id: 'tallrect',
    label: 'Tall Rect',
    svg: (c) => <rect x="18" y="3" width="28" height="58" rx="5" fill={c} />,
  },
  {
    id: 'semicircle',
    label: 'Arch',
    svg: (c) => <path d="M 4 52 A 28 28 0 0 1 60 52 Z" fill={c} />,
  },
];

// Tailwind bg class → hex map for colour swatches
const COLORS: { bg: string; hex: string }[] = [
  { bg: 'bg-red-500',    hex: '#ef4444' },
  { bg: 'bg-orange-500', hex: '#f97316' },
  { bg: 'bg-yellow-400', hex: '#facc15' },
  { bg: 'bg-green-500',  hex: '#22c55e' },
  { bg: 'bg-blue-500',   hex: '#3b82f6' },
  { bg: 'bg-violet-500', hex: '#8b5cf6' },
  { bg: 'bg-pink-500',   hex: '#ec4899' },
  { bg: 'bg-teal-500',   hex: '#14b8a6' },
];

const CHALLENGES = [
  { title: 'Build a House 🏠',   hint: 'Try a big square for walls, a triangle for the roof!' },
  { title: 'Build a Robot 🤖',   hint: 'Squares for the body, circles for eyes!' },
  { title: 'Build a Rocket 🚀',  hint: 'Tall rect for the body, triangle on top, semicircle at the base!' },
  { title: 'Build a Flower 🌸',  hint: 'Circles for petals, a tall rect for the stem!' },
  { title: 'Build a Castle 🏰',  hint: 'Lots of rectangles and triangles on top!' },
  { title: 'Build anything! ✨', hint: 'Let your imagination go wild — no rules!' },
];

interface PlacedShape {
  id: number;
  stampId: string;
  color: string;
  x: number;
  y: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const BuildItBlocks: React.FC<BuildItBlocksProps> = ({ onClose }) => {
  const [placed, setPlaced]             = useState<PlacedShape[]>([]);
  const [colorHex, setColorHex]         = useState<string>(COLORS[0].hex);
  const [dragging, setDragging]         = useState<{ stampId: string; color: string } | null>(null);
  const [overCanvas, setOverCanvas]     = useState(false);
  const [challenge]                     = useState(() => CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
  const [airiMsg, setAiriMsg]           = useState(`${challenge.hint} 💡`);
  const [airiMood, setAiriMood]         = useState<AiriMood>('encouraging');
  const [isDone, setIsDone]             = useState(false);

  const ghostRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const nextId    = useRef(0);

  // ── Ghost position update (DOM-only, no re-render per frame) ─────────────────

  const moveGhost = (x: number, y: number, scale = 1) => {
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate(${x - 30}px, ${y - 30}px) scale(${scale})`;
    }
  };

  const hitCanvas = useCallback((x: number, y: number): boolean => {
    if (!canvasRef.current) return false;
    const r = canvasRef.current.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }, []);

  // ── Stamp toolbar drag handlers ───────────────────────────────────────────────

  const handleStampPointerDown = (e: React.PointerEvent<HTMLButtonElement>, stampId: string) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging({ stampId, color: colorHex });
    moveGhost(e.clientX, e.clientY, 1);
  };

  const handleStampPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;
    const over = hitCanvas(e.clientX, e.clientY);
    moveGhost(e.clientX, e.clientY, over ? 1.12 : 1);
    if (over !== overCanvas) setOverCanvas(over);
  };

  const handleStampPointerUp = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging) return;

    if (hitCanvas(e.clientX, e.clientY) && canvasRef.current) {
      const r = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const id = nextId.current++;
      setPlaced(prev => {
        const next = [...prev, { id, stampId: dragging.stampId, color: dragging.color, x, y }];
        const msg = next.length === 1  ? "Great start! Keep adding shapes! 🧱"
                  : next.length === 3  ? "It's taking shape! AI also uses shapes to understand the world! 🤖"
                  : next.length === 6  ? "Wow! So many shapes — you're building like a pro! 🏗️"
                  : next.length >= 10  ? "Amazing! AI learns spatial patterns just like this! 🌍"
                  : "Nice! What shape comes next? 🎨";
        setAiriMsg(msg);
        setAiriMood('happy');
        return next;
      });
    }

    setDragging(null);
    setOverCanvas(false);
  }, [dragging, hitCanvas]);

  // ── Actions ───────────────────────────────────────────────────────────────────

  const handleUndo  = () => setPlaced(prev => prev.slice(0, -1));
  const handleClear = () => { setPlaced([]); setAiriMsg(`${challenge.hint} 💡`); setAiriMood('encouraging'); setIsDone(false); };
  const handleDone  = () => { setIsDone(true); setAiriMsg("Wonderful creation! AI learns spatial reasoning from examples exactly like yours! 🤖🏆"); setAiriMood('celebrating'); };

  const dragStamp = dragging ? STAMPS.find(s => s.id === dragging.stampId) : null;

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-orange-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-orange-100 dark:border-orange-900 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-orange-600 dark:text-orange-300 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg px-2 py-1">
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-sm sm:text-base font-extrabold text-orange-700 dark:text-orange-300">Build-It Blocks 🧱</h2>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">{challenge.title}</p>
        </div>
        <div className="flex gap-1">
          <button type="button" onClick={handleUndo} disabled={placed.length === 0}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 rounded-lg px-2 py-1 hover:bg-orange-100 dark:hover:bg-orange-900/30 disabled:opacity-30 focus:outline-none">
            ↩
          </button>
          <button type="button" onClick={handleClear}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 rounded-lg px-2 py-1 hover:bg-orange-100 dark:hover:bg-orange-900/30 focus:outline-none">
            🗑️
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center gap-2 px-3 pt-3 pb-24 overflow-hidden w-full">

        {/* Build canvas — drop target */}
        <div
          ref={canvasRef}
          className={[
            'relative rounded-2xl overflow-hidden shadow-xl border-4 shrink-0 w-full max-w-3xl h-[55vh] min-h-[240px]',
            overCanvas
              ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
              : 'border-orange-200 dark:border-orange-800 bg-sky-50 dark:bg-gray-800',
          ].join(' ')}
          aria-label="Build canvas — drag shapes here"
        >
          {/* All placed shapes in one overlay SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none select-none">
            {placed.map(p => {
              const s = STAMPS.find(st => st.id === p.stampId)!;
              return (
                <g key={p.id} transform={`translate(${p.x - 30} ${p.y - 30})`}>
                  <svg viewBox="0 0 64 64" width={60} height={60}>
                    {s.svg(p.color)}
                  </svg>
                </g>
              );
            })}
          </svg>

          {/* Empty state hint */}
          {placed.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-center select-none pointer-events-none">
              <div>
                <p className="text-5xl mb-2">👇</p>
                <p className="text-sm font-bold text-orange-300 dark:text-orange-600">
                  Drag a shape here!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-full max-w-3xl">

          {/* Shape picker — each is draggable */}
          <p className="text-xs font-bold text-orange-500 dark:text-orange-400">
            {dragging ? '📦 Drop it on the canvas!' : '↕️ Drag a shape onto the canvas'}
          </p>
          <div className="flex gap-2 flex-wrap justify-center">
            {STAMPS.map(s => (
              <button
                key={s.id}
                type="button"
                onPointerDown={e => handleStampPointerDown(e, s.id)}
                onPointerMove={handleStampPointerMove}
                onPointerUp={handleStampPointerUp}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform touch-none select-none focus:outline-none cursor-grab active:cursor-grabbing"
                aria-label={s.label}
              >
                <svg viewBox="0 0 64 64" width={30} height={30}>
                  {s.svg(colorHex)}
                </svg>
              </button>
            ))}
          </div>

          {/* Colour picker */}
          <div className="flex gap-1.5 flex-wrap justify-center">
            {COLORS.map(c => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColorHex(c.hex)}
                className={[
                  'w-7 h-7 rounded-full border-4 transition-all',
                  c.bg,
                  colorHex === c.hex
                    ? 'border-gray-900 dark:border-white scale-110 shadow-lg'
                    : 'border-white/80 dark:border-gray-700 opacity-70 hover:opacity-100 hover:scale-105',
                ].join(' ')}
                aria-label={`Colour ${c.hex}`}
              />
            ))}
          </div>

          {/* Done button */}
          {!isDone && placed.length >= 3 && (
            <button type="button" onClick={handleDone}
              className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform text-sm">
              ✅ I'm Done!
            </button>
          )}
        </div>
      </div>

      {/* Drag ghost — position updated imperatively via ref (no re-render per frame) */}
      {dragging && dragStamp && (
        <div ref={ghostRef}
          className="fixed top-0 left-0 pointer-events-none z-50 will-change-transform opacity-80 drop-shadow-lg">
          <svg viewBox="0 0 64 64" width={60} height={60}>
            {dragStamp.svg(dragging.color)}
          </svg>
        </div>
      )}

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
