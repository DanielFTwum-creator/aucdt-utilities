import { motion } from 'motion/react';
import { MathQuestion } from '../types';

interface LevelBridgeShooterProps {
  question: MathQuestion;
  typedValue: string;
}

export default function LevelBridgeShooter({
  question,
  typedValue,
}: LevelBridgeShooterProps) {
  const { visualType, visualData } = question;

  // Render Subtraction bubble busters
  if (visualType === 'balloon-pop') {
    const { total, remove, color } = visualData;
    const remaining = total - remove;

    return (
      <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner">
        <div className="text-center font-sans">
          <span className="text-xs font-mono tracking-wider text-rose-400 uppercase">
            🫧 SUBTRACTION SUBMARINE
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1 mt-0.5">
            Pop the bubbles on the sonar scanner!
          </h3>
        </div>

        {/* Sonar visual interface */}
        <div className="flex flex-wrap justify-center gap-3.5 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-sm w-full relative overflow-hidden">
          {/* Radial radar sweeps */}
          <div className="absolute inset-0 border border-emerald-500/10 rounded-full animate-ping pointer-events-none" />

          {Array.from({ length: total }).map((_, idx) => {
            const isRemoved = idx >= remaining;

            return (
              <motion.div
                key={idx}
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border-2 select-none relative ${
                  isRemoved
                    ? 'bg-slate-900 border-slate-800 text-slate-600 opacity-30 shadow-none'
                    : `${color} border-white/20 text-white shadow-md shadow-black/30`
                }`}
                animate={{
                  y: isRemoved ? 0 : [0, -3, 3, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + (idx % 3),
                  delay: idx * 0.1,
                }}
              >
                <span>{isRemoved ? '💥' : '🫧'}</span>
                
                {/* Pop overlays */}
                {isRemoved && (
                  <span className="absolute text-rose-500 text-base font-extrabold select-none">
                    X
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Interactive numerical cues */}
        <div className="flex gap-6 text-xs text-slate-400 font-sans">
          <span>Starting bubble count: <strong className="text-slate-200">{total}</strong></span>
          <span>Popped / Removed: <strong className="text-rose-400">{remove}</strong></span>
          <span>Active remaining: <strong className="text-emerald-400">{remaining}</strong></span>
        </div>
      </div>
    );
  }

  // Render Multiplication star meadows matrix
  if (visualType === 'star-grid') {
    const { rows, cols, color } = visualData;

    return (
      <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner">
        <div className="text-center font-sans">
          <span className="text-xs font-mono tracking-wider text-amber-400 uppercase">
            🍀 MULTIPLICATION MEADOWS
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Solve this pattern: {rows} rows with {cols} fields
          </h3>
        </div>

        {/* Array visual model representing coordinates rows/columns */}
        <div className="flex flex-col gap-2.5 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl max-w-xs items-center">
          {Array.from({ length: rows }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-2.5">
              {Array.from({ length: cols }).map((_, cIdx) => (
                <motion.div
                  key={cIdx}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shadow border border-white/5 ${color}`}
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ delay: (rIdx * cols + cIdx) * 0.03, type: 'spring' }}
                >
                  <span className="drop-shadow select-none">⭐</span>
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Visual arithmetic grouping breakdown */}
        <div className="flex flex-col items-center gap-1.5 text-xs text-slate-400">
          <div>
            Think of it as: {Array.from({ length: rows }).map((_, i) => cols).join(' + ')} ={' '}
            <strong className="text-amber-400">{rows * cols}</strong>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Or simply: <strong>{rows} times {cols}</strong>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
