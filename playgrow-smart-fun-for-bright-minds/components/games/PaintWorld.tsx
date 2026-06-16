/**
 * Paint World — "Teach AI to See Colour"
 *
 * Free-canvas drawing with a colour palette and brush sizes.
 * Airi frames it: AI learns about colour the same way kids do — by looking
 * at millions of painted examples.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Airi, AiriMood } from '../Airi';

interface PaintWorldProps { onClose: () => void; }

// Tailwind class + hex value — avoids inline style for colour swatches
const PALETTE = [
  { bg: 'bg-red-500',     hex: '#ef4444' },
  { bg: 'bg-orange-500',  hex: '#f97316' },
  { bg: 'bg-yellow-400',  hex: '#facc15' },
  { bg: 'bg-green-500',   hex: '#22c55e' },
  { bg: 'bg-cyan-500',    hex: '#06b6d4' },
  { bg: 'bg-blue-500',    hex: '#3b82f6' },
  { bg: 'bg-violet-500',  hex: '#8b5cf6' },
  { bg: 'bg-pink-500',    hex: '#ec4899' },
  { bg: 'bg-teal-500',    hex: '#14b8a6' },
  { bg: 'bg-lime-500',    hex: '#84cc16' },
  { bg: 'bg-amber-400',   hex: '#fbbf24' },
  { bg: 'bg-gray-500',    hex: '#6b7280' },
  { bg: 'bg-gray-900',    hex: '#111827' },
  { bg: 'bg-white border border-gray-200 dark:border-gray-600', hex: '#ffffff' },
] as const;

type PaletteEntry = typeof PALETTE[number];

// brush dot indicators: className + canvas lineWidth
const BRUSHES = [
  { dot: 'w-2 h-2',  size: 4  },
  { dot: 'w-4 h-4',  size: 10 },
  { dot: 'w-7 h-7',  size: 22 },
] as const;

const CANVAS_PX = 600;

const AIRI_MESSAGES: [string, AiriMood][] = [
  ["Pick a colour and start painting! I'm learning by watching! 🎨", 'happy'],
  ["AI studies millions of paintings to learn colours — just like you're doing now! 🤖", 'thinking'],
  ["Every stroke is data! That's exactly how AI learns to create art! 🧠", 'encouraging'],
  ["I love how you mix colours! AI calls this 'colour theory' too! 🌈", 'happy'],
  ["Did you know AI can now paint award-winning pictures? You're basically training one! 🏆", 'celebrating'],
  ["Keep going! The more you explore, the better your painting gets! 🎨✨", 'happy'],
];

export const PaintWorld: React.FC<PaintWorldProps> = ({ onClose }) => {
  const canvasRef        = useRef<HTMLCanvasElement>(null);
  const isPainting       = useRef(false);
  const lastPt           = useRef<[number, number] | null>(null);

  const [paletteIdx, setPaletteIdx] = useState(5);   // blue
  const [brushIdx, setBrushIdx]     = useState(1);   // medium
  const [eraser, setEraser]         = useState(false);
  const [msgIdx, setMsgIdx]         = useState(0);
  const [hasPainted, setHasPainted] = useState(false);

  // Fill canvas white on mount
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_PX, CANVAS_PX);
  }, []);

  // Rotate Airi messages every 9 s once the user starts painting
  useEffect(() => {
    if (!hasPainted) return;
    const t = setInterval(() => setMsgIdx(i => (i + 1) % AIRI_MESSAGES.length), 9000);
    return () => clearInterval(t);
  }, [hasPainted]);

  const toCanvasXY = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const sx = CANVAS_PX / rect.width;
    const sy = CANVAS_PX / rect.height;
    return [(e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy];
  };

  const paint = useCallback((x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const brushColor = eraser ? '#ffffff' : PALETTE[paletteIdx].hex;
    const size = BRUSHES[brushIdx].size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = brushColor;
    ctx.fillStyle = brushColor;

    if (lastPt.current) {
      ctx.beginPath();
      ctx.moveTo(lastPt.current[0], lastPt.current[1]);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    // Always fill a circle at the point for smooth starts / dots
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    lastPt.current = [x, y];
  }, [paletteIdx, brushIdx, eraser]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    isPainting.current = true;
    lastPt.current = null;
    const [x, y] = toCanvasXY(e);
    paint(x, y);
    if (!hasPainted) setHasPainted(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPainting.current) return;
    const [x, y] = toCanvasXY(e);
    paint(x, y);
  };

  const handlePointerUp = () => {
    isPainting.current = false;
    lastPt.current = null;
  };

  const handleClear = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_PX, CANVAS_PX);
    setMsgIdx(0);
    setHasPainted(false);
  };

  const selectPalette = (i: number) => { setPaletteIdx(i); setEraser(false); };
  const selectBrush   = (i: number) => { setBrushIdx(i);   setEraser(false); };

  const [airiMsg, airiMood] = AIRI_MESSAGES[msgIdx];

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-pink-50 to-rose-100 dark:from-gray-900 dark:to-pink-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-pink-100 dark:border-pink-900 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-sm font-bold text-pink-600 dark:text-pink-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <h2 className="text-base sm:text-lg font-extrabold text-pink-700 dark:text-pink-300">Paint World 🎨</h2>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-bold text-pink-600 dark:text-pink-400 border border-pink-300 dark:border-pink-700 rounded-lg px-3 py-1.5 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🗑️ Clear
        </button>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-2 pb-24 overflow-hidden">

        {/* Canvas */}
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-pink-200 dark:border-pink-800 bg-white shrink-0">
          <canvas
            ref={canvasRef}
            width={CANVAS_PX}
            height={CANVAS_PX}
            className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px] touch-none select-none block"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            aria-label="Paint canvas"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-2 shrink-0">

          {/* Colour palette */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
            {(PALETTE as readonly PaletteEntry[]).map((p, i) => (
              <button
                key={p.hex}
                type="button"
                onClick={() => selectPalette(i)}
                className={[
                  'w-7 h-7 rounded-full border-4 transition-all duration-150 active:scale-90',
                  p.bg,
                  !eraser && paletteIdx === i
                    ? 'border-gray-900 dark:border-white scale-110 shadow-lg'
                    : 'border-white/80 dark:border-gray-700 hover:scale-105 opacity-80 hover:opacity-100',
                ].join(' ')}
                aria-label={`Colour ${i + 1}`}
              />
            ))}
          </div>

          {/* Brush sizes + eraser */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-pink-500 dark:text-pink-400">Brush:</span>
            {BRUSHES.map((b, i) => (
              <button
                key={b.size}
                type="button"
                onClick={() => selectBrush(i)}
                className={[
                  'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all',
                  !eraser && brushIdx === i
                    ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 shadow-md'
                    : 'border-gray-300 dark:border-gray-600 opacity-50 hover:opacity-90 hover:scale-110 active:scale-95',
                ].join(' ')}
                aria-label={`Brush size ${i + 1}`}
              >
                <span className={`${b.dot} rounded-full bg-gray-800 dark:bg-gray-200`} />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setEraser(e => !e)}
              className={[
                'px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all',
                eraser
                  ? 'bg-pink-100 dark:bg-pink-900/40 border-pink-500 text-pink-700 dark:text-pink-300 shadow-md'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 opacity-60 hover:opacity-100 hover:scale-105 active:scale-95',
              ].join(' ')}
            >
              ✏️ Eraser
            </button>
          </div>
        </div>
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
