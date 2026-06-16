/**
 * Build-It Blocks — "Teach AI to Build"
 *
 * Kids drag coloured geometric shapes onto a canvas to build scenes.
 * Airi gives a creative challenge (build a house, a robot, a rocket…) and
 * celebrates what the child makes, connecting the activity to how AI learns
 * spatial relationships from examples.
 */

import React, { useRef, useState, useCallback } from 'react';
import { Airi, AiriMood } from '../Airi';

interface BuildItBlocksProps { onClose: () => void; }

// ── Stamp shapes ─────────────────────────────────────────────────────────────

interface Stamp {
  id: string;
  emoji: string;
  label: string;
  svg: (color: string) => React.ReactNode;
}

const STAMPS: Stamp[] = [
  {
    id: 'square', emoji: '🟥', label: 'Square',
    svg: (c) => <rect x="4" y="4" width="56" height="56" rx="4" fill={c} />,
  },
  {
    id: 'circle', emoji: '🔵', label: 'Circle',
    svg: (c) => <circle cx="32" cy="32" r="28" fill={c} />,
  },
  {
    id: 'triangle', emoji: '🔺', label: 'Triangle',
    svg: (c) => <polygon points="32,4 60,60 4,60" fill={c} />,
  },
  {
    id: 'rect', emoji: '🟧', label: 'Wide Rect',
    svg: (c) => <rect x="4" y="18" width="56" height="28" rx="4" fill={c} />,
  },
  {
    id: 'star', emoji: '⭐', label: 'Star',
    svg: (c) => (
      <polygon points="32,4 38,22 58,22 42,34 48,54 32,42 16,54 22,34 6,22 26,22" fill={c} />
    ),
  },
  {
    id: 'diamond', emoji: '💎', label: 'Diamond',
    svg: (c) => <polygon points="32,4 60,32 32,60 4,32" fill={c} />,
  },
];

const COLORS = [
  '#ef4444', '#f97316', '#facc15', '#22c55e',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
];

const CHALLENGES = [
  { title: 'Build a House 🏠', hint: 'Try a big square for walls, a triangle for the roof!' },
  { title: 'Build a Robot 🤖', hint: 'Squares for the body, circles for eyes!' },
  { title: 'Build a Rocket 🚀', hint: 'Rectangle for the body, triangle on top!' },
  { title: 'Build a Flower 🌸', hint: 'Circles for petals, a square for the stem!' },
  { title: 'Build a Castle 🏰', hint: 'Lots of rectangles and triangles!' },
  { title: 'Build anything! ✨', hint: 'Let your imagination go wild!' },
];

interface Placed {
  id: number;
  stampId: string;
  color: string;
  x: number;
  y: number;
  scale: number;
}

export const BuildItBlocks: React.FC<BuildItBlocksProps> = ({ onClose }) => {
  const [placed, setPlaced]           = useState<Placed[]>([]);
  const [selectedStamp, setSelectedStamp] = useState<string>('square');
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]);
  const [challenge]                   = useState(() => CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)]);
  const [airiMsg, setAiriMsg]         = useState(`${challenge.hint} 💡`);
  const [airiMood, setAiriMood]       = useState<AiriMood>('encouraging');
  const [isDone, setIsDone]           = useState(false);
  const nextId                        = useRef(0);
  const canvasRef                     = useRef<HTMLDivElement>(null);

  const COLORMAP: Record<string, string> = {
    '#ef4444': 'bg-red-500', '#f97316': 'bg-orange-500',
    '#facc15': 'bg-yellow-400', '#22c55e': 'bg-green-500',
    '#3b82f6': 'bg-blue-500', '#8b5cf6': 'bg-violet-500',
    '#ec4899': 'bg-pink-500', '#14b8a6': 'bg-teal-500',
  };

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDone) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = nextId.current++;
    setPlaced(prev => [...prev, { id, stampId: selectedStamp, color: selectedColor, x, y, scale: 1 }]);
    setAiriMsg(getPlaceMessage(placed.length + 1));
    setAiriMood('happy');
  }, [selectedStamp, selectedColor, placed.length, isDone]);

  const getPlaceMessage = (count: number): string => {
    if (count === 1) return "Great start! Keep adding shapes! 🧱";
    if (count === 3) return "It's taking shape! AI sees patterns in shapes like you do! 🤖";
    if (count === 6) return "Amazing! AI uses shapes to understand the world! 🌍";
    if (count >= 10) return "So many shapes! You're building like a pro! 🏗️";
    return "Nice! What shape comes next? 🎨";
  };

  const handleUndo = () => setPlaced(prev => prev.slice(0, -1));
  const handleClear = () => { setPlaced([]); setAiriMsg(`${challenge.hint} 💡`); setAiriMood('encouraging'); setIsDone(false); };
  const handleDone = () => { setIsDone(true); setAiriMsg("Wow! You built something wonderful! AI learns spatial reasoning just like this! 🤖🏆"); setAiriMood('celebrating'); };

  const stamp = STAMPS.find(s => s.id === selectedStamp)!;

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
      <div className="flex-1 flex flex-col items-center gap-2 px-2 pt-2 pb-24 overflow-hidden">

        {/* Build canvas */}
        <div
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-orange-200 dark:border-orange-800 bg-sky-50 dark:bg-gray-800 shrink-0 cursor-crosshair w-full max-w-md h-[50vh] min-h-[220px]"
          role="button"
          aria-label="Build canvas — tap to place a shape"
        >
          {/* All placed shapes in one overlay SVG — positions via SVG transform, no inline CSS */}
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
          {placed.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-center text-orange-300 dark:text-orange-700 select-none pointer-events-none">
              <div>
                <p className="text-4xl mb-2">👇</p>
                <p className="text-sm font-bold">Tap here to place shapes!</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-full max-w-md">

          {/* Shape picker */}
          <div className="flex gap-2 flex-wrap justify-center">
            {STAMPS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedStamp(s.id)}
                className={[
                  'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all',
                  selectedStamp === s.id
                    ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/40 scale-110 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:scale-105 opacity-70',
                ].join(' ')}
                aria-label={s.label}
              >
                <svg viewBox="0 0 64 64" width={28} height={28}>
                  {s.svg(selectedColor)}
                </svg>
              </button>
            ))}
          </div>

          {/* Colour picker */}
          <div className="flex gap-1.5 flex-wrap justify-center">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={[
                  'w-7 h-7 rounded-full border-4 transition-all',
                  COLORMAP[c] ?? 'bg-gray-500',
                  selectedColor === c
                    ? 'border-gray-900 dark:border-white scale-110 shadow-lg'
                    : 'border-white/80 dark:border-gray-700 opacity-70 hover:opacity-100 hover:scale-105',
                ].join(' ')}
                aria-label={`Colour ${c}`}
              />
            ))}
          </div>

          {!isDone && placed.length >= 3 && (
            <button type="button" onClick={handleDone}
              className="px-8 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold rounded-2xl shadow-lg active:scale-95 transition-transform text-sm">
              ✅ I'm Done!
            </button>
          )}
        </div>
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
