import { motion } from 'motion/react';
import { LevelConfig, UserProgress } from '../types';
import { BookOpen, Star, Lock, Award, ShieldAlert, Sparkles } from 'lucide-react';

interface MathIslandMapProps {
  levels: LevelConfig[];
  userProgress: UserProgress;
  onSelectLevel: (level: LevelConfig) => void;
}

export default function MathIslandMap({
  levels,
  userProgress,
  onSelectLevel,
}: MathIslandMapProps) {
  
  const getZoneIcon = (zone: string) => {
    switch (zone) {
      case 'counting':
        return '🏰';
      case 'addition':
        return '➕';
      case 'subtraction':
        return '🫧';
      case 'multiplication':
        return '⭐';
      case 'fractions':
        return '🍕';
      case 'cosmic':
        return '🚀';
      default:
        return '🧭';
    }
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'counting':
        return 'bg-gradient-to-r from-teal-500 to-indigo-500 text-teal-100 hover:shadow-teal-500/10';
      case 'addition':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 text-purple-100 hover:shadow-purple-500/10';
      case 'subtraction':
        return 'bg-gradient-to-r from-rose-500 to-pink-500 text-rose-100 hover:shadow-rose-500/10';
      case 'multiplication':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-amber-100 hover:shadow-orange-500/10';
      case 'fractions':
        return 'bg-gradient-to-r from-orange-500 to-red-500 text-orange-100 hover:shadow-red-500/10';
      case 'cosmic':
        return 'bg-gradient-to-r from-violet-600 to-indigo-900 text-violet-100 hover:shadow-violet-500/10';
      default:
        return 'bg-slate-700 text-slate-100 hover:shadow-slate-500/10';
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Dynamic Header Banner */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 border border-slate-800 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Abstract background decorative patterns */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 relative">
          <div className="space-y-1.5 font-sans">
            <span className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider font-mono">
              <Sparkles size={14} /> ADVENTURER PORTAL
            </span>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">
              Math Island Expedition 🗺️
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Embark on a high-speed quest! Each stepping stone triggers rich sensory typing practices and visual math models. Unlock all 6 levels to claim the legendary golden crown!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 self-start md:self-center">
            <div className="text-center font-mono">
              <span className="block text-[10px] uppercase text-slate-400">Total Stars</span>
              <div className="flex items-center justify-center gap-1 mt-0.5 text-amber-400 font-bold text-lg">
                <Star size={16} fill="currentColor" /> {userProgress.stars}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div className="text-center font-mono">
              <span className="block text-[10px] uppercase text-slate-400">Gold Coins</span>
              <div className="text-yellow-400 font-bold text-lg mt-0.5">
                🪙 {userProgress.coins}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archipelago progression checklist */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 tracking-wide font-sans uppercase pl-2">
          🗺️ Stepping Stones
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {levels.map((level) => {
            // Unlocked if requirement is met
            const isUnlocked = userProgress.stars >= level.starsRequired;
            const isCompleted = userProgress.completedLevels.includes(level.id);

            return (
              <motion.div
                key={level.id}
                whileHover={isUnlocked ? { y: -5 } : {}}
                className={`flex flex-col p-5 rounded-3xl border text-left transition-all backdrop-blur-sm shadow-md cursor-pointer relative ${
                  isUnlocked
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
                onClick={() => {
                  if (isUnlocked) {
                    onSelectLevel(level);
                  }
                }}
              >
                {/* Visual Lock overlay */}
                {!isUnlocked && (
                  <div className="absolute top-4 right-4 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-slate-450 text-[10px] uppercase font-mono tracking-wider font-semibold">
                    <Lock size={10} className="text-rose-400" /> Locked
                  </div>
                )}

                {/* Stars status icon bubble */}
                {isUnlocked && isCompleted && (
                  <div className="absolute top-4 right-4 bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold font-mono">
                    ✓ Completed
                  </div>
                )}

                {!isUnlocked && level.starsRequired > 0 && (
                  <div className="absolute bottom-4 right-4 bg-amber-950/40 text-amber-400 border border-amber-900/30 px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold font-mono">
                    <Star size={11} fill="currentColor" /> {level.starsRequired} Stars
                  </div>
                )}

                {/* Level Tag and Icon */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow border border-white/5 ${getZoneColor(level.zone)}`}>
                    {getZoneIcon(level.zone)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
                      Stone #{level.id}
                    </span>
                    <h4 className="text-slate-100 font-bold text-base tracking-tight leading-tight">
                      {level.title}
                    </h4>
                  </div>
                </div>

                <p className="text-slate-400 text-xs font-sans mt-3.5 leading-relaxed flex-1">
                  {level.description}
                </p>

                {/* Keys info bar */}
                {isUnlocked && (
                  <div className="flex items-center justify-between border-t border-slate-800/60 mt-4 pt-3 text-[11px] font-mono text-slate-500">
                    <span className="flex items-center gap-1 text-teal-400 font-medium">
                      <BookOpen size={11} /> Learn Keys:
                    </span>
                    <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-850 text-slate-300 font-bold tracking-wider">
                      {level.practices.map(p => p.answer).join(', ') ? 'Formula rows' : 'Number Row'}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6R Gamified Rules - Training Academy Rulebook */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
            <BookOpen size={16} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-100 tracking-tight font-sans uppercase">
              🎓 Islander Training Academy &amp; Rulebook
            </h4>
            <p className="text-slate-450 text-[11px] font-mono">Governing Rules of the typing math arpeggios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
            <span className="text-teal-400 font-bold block font-mono">1. Home Row Posture</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Rest left fingers on <strong className="text-slate-200">A-S-D-F</strong> and right fingers on <strong className="text-slate-200">J-K-L-;</strong>. Build muscle memory!
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
            <span className="text-amber-400 font-bold block font-mono">2. Glowing Target Keys</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Look at the on-screen keyboard guide to locate the glowing finger trajectory paths directly.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
            <span className="text-rose-400 font-bold block font-mono">3. Flame Streak Combo</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Type multiple figures correctly in a row to rack up massive streaks and secure double gold coin bonuses!
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-2">
            <span className="text-yellow-400 font-bold block font-mono">4. Sticker Shop Exchange</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Trade your earned gold coins inside the <strong className="text-slate-200">Backpack Shop</strong> to collect badges and premium companion avatars!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
