import { motion } from 'motion/react';
import { MathQuestion } from '../types';

interface LevelCosmicBlitzProps {
  question: MathQuestion;
  typedValue: string;
}

export default function LevelCosmicBlitz({
  question,
  typedValue,
}: LevelCosmicBlitzProps) {
  const { questionText, fullText } = question.visualData;

  return (
    <div className="flex flex-col items-center gap-6 p-6 rounded-3xl bg-slate-900/60 border border-slate-700/40 shadow-inner relative overflow-hidden min-h-[300px]">
      {/* Background Starry Sky layout */}
      <div className="absolute inset-0 bg-slate-950 opacity-40 pointer-events-none">
        <div className="absolute top-10 left-12 w-1.5 h-1.5 bg-sky-300 rounded-full animate-pulse" />
        <div className="absolute top-28 right-16 w-1 h-1 bg-amber-200 rounded-full animate-pulse delay-500" />
        <div className="absolute bottom-16 left-32 w-1.5 h-1.5 bg-teal-300 rounded-full animate-pulse delay-1000" />
      </div>

      <div className="text-center font-sans z-10">
        <span className="text-xs font-mono tracking-wider text-rose-400 uppercase">
          🛸 COSMIC SPEED BLITZ
        </span>
        <h3 className="text-lg font-bold text-slate-100 mt-1">
          Blast the Asteroid Anomaly!
        </h3>
      </div>

      {/* Floating high-velocity Asteroid element */}
      <div className="flex flex-col items-center justify-center flex-1 h-full z-10 w-full py-4">
        <motion.div
          className="relative px-8 py-7 rounded-full bg-slate-800 border-4 border-slate-700 shadow-xl flex flex-col items-center justify-center cursor-pointer overflow-hidden max-w-xs"
          animate={{
            y: [5, -12, 5],
            rotate: [0, 4, -4, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3.5,
            ease: 'easeInOut',
          }}
          whileHover={{ scale: 1.08 }}
        >
          {/* Back glows */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-rose-950/20" />

          {/* Asteroid Surface Crater lines */}
          <div className="absolute top-3 left-4 w-4 h-4 rounded-full bg-slate-900/50" />
          <div className="absolute bottom-2 right-8 w-6 h-6 rounded-full bg-slate-900/40" />

          {/* Math Question Text Overlay */}
          <span className="text-slate-500 text-[10px] font-mono select-none uppercase tracking-widest">
            ☄️ METEOR SHIELD
          </span>
          <h4 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-1 font-sans">
            {questionText}
          </h4>
        </motion.div>
      </div>

      {/* Space Laser bridge status */}
      <div className="flex items-center gap-2 bg-slate-950/60 px-5 py-2 rounded-full border border-slate-800 text-xs font-mono text-slate-400 z-10">
        <span>Plasma Target Vector:</span>
        <strong className="text-rose-400 select-all font-bold text-sm bg-rose-950/20 px-2 py-0.5 rounded ml-1 border border-rose-900/30">
          {fullText}
        </strong>
      </div>
    </div>
  );
}
