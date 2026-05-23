import { motion } from 'motion/react';
import { MathQuestion } from '../types';

interface LevelBlockCounterProps {
  question: MathQuestion;
  typedValue: string;
}

export default function LevelBlockCounter({
  question,
  typedValue,
}: LevelBlockCounterProps) {
  const { visualType, visualData } = question;

  // Render Zone 1: Castle counting blocks/gems
  if (visualType === 'blocks') {
    const { count, color } = visualData;
    const items = Array.from({ length: count });

    // Custom child emojis representing royal castle gems
    let gemEmoji = '💎';
    if (color.includes('emerald')) gemEmoji = '💚';
    if (color.includes('indigo')) gemEmoji = '💜';
    if (color.includes('yellow')) gemEmoji = '🪙';

    return (
      <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner">
        <div className="text-center font-sans">
          <span className="text-xs font-mono tracking-wider text-teal-400 uppercase">
            👑 THE COUNTING CASTLE
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            How many gems do you see? Count them!
          </h3>
        </div>

        {/* Dynamic visual grid of bouncing sparkling gems */}
        <div className="flex flex-wrap justify-center gap-4 bg-slate-950/40 p-6 rounded-2xl border border-slate-800 shadow-md min-h-[110px] items-center">
          {items.map((_, idx) => (
            <motion.div
              key={idx}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10 ${color}`}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                delay: idx * 0.1,
              }}
            >
              <span className="drop-shadow-md select-none">{gemEmoji}</span>
            </motion.div>
          ))}
        </div>

        {/* Counter indicator */}
        <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-1.5 rounded-full border border-slate-700 text-xs text-slate-300">
          <span>Gems counted:</span>
          <strong className="text-emerald-400 font-mono text-sm">
            {typedValue || '?'}
          </strong>
        </div>
      </div>
    );
  }

  // Render Zone 2: Ten-frames addition
  if (visualType === 'ten-frame') {
    const { partA, partB, colorA, colorB } = visualData;

    // Fill a 10-slot grid: indices 0..9 represent slots
    const totalSlots = 10;
    const slots = Array.from({ length: totalSlots }).map((_, slotIdx) => {
      if (slotIdx < partA) {
        return { filled: true, group: 'A', color: colorA, emoji: '🟣' };
      } else if (slotIdx < partA + partB) {
        return { filled: true, group: 'B', color: colorB, emoji: '🟡' };
      }
      return { filled: false, color: '', emoji: '' };
    });

    return (
      <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner">
        <div className="text-center font-sans">
          <span className="text-xs font-mono tracking-wider text-purple-400 uppercase">
            ➕ ADDITION ARCADE
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            Group equation: {partA} Purple + {partB} Gold = {partA + partB} Chips
          </h3>
        </div>

        {/* Standard tactile Ten-Frame Grid (5 columns, 2 rows) */}
        <div className="grid grid-cols-5 gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-md">
          {slots.map((slot, idx) => (
            <motion.div
              key={idx}
              className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all select-none ${
                slot.filled
                  ? `${slot.color} border-white/20 shadow-md shadow-black/40`
                  : 'bg-slate-900 border-dashed border-slate-700'
              }`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.04 }}
            >
              {slot.filled && (
                <motion.span
                  className="text-lg drop-shadow"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 4, delay: idx * 0.2 }}
                >
                  {slot.emoji}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        {/* Visual helper breakdown */}
        <div className="flex gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full ${colorA}`} />
            <span>Group A: <strong>{partA}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-3.5 h-3.5 rounded-full ${colorB}`} />
            <span>Group B: <strong>{partB}</strong></span>
          </div>
          <div className="text-emerald-400 font-mono">
            Sum: <strong>{partA + partB}</strong>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
