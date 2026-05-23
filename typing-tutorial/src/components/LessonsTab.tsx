import { Lesson, UserProgress } from "../types";
import { LESSONS } from "../data";
import { CheckCircle2, Lock, Play, Sparkles } from "lucide-react";

interface LessonsTabProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonsTab({ progress, onSelectLesson }: LessonsTabProps) {
  return (
    <div className="space-y-6">
      
      {/* Introduction Banner - Immersive Gradient style */}
      <div className="bg-gradient-to-br from-slate-950 via-[#0a0d14] to-cyan-950 text-white rounded-2xl p-6 sm:p-8 border border-zinc-200 dark:border-white/5 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(6,182,212,0.12),transparent_55%)] pointer-events-none"></div>
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center space-x-2 text-sky-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase mb-2.5">
            <Sparkles size={14} className="animate-pulse" />
            <span>TUC Keyboard Competency Framework / Protocol 0.8</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
            Learn Keyboard Literacy & Fluid Accent Typing
          </h2>
          <p className="mt-3.5 text-zinc-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl">
            This module guides your muscle coordination across standard mechanical rows. Complete each row exercise with a minimum accuracy of 80% to unlock subsequent milestones.
          </p>
        </div>
      </div>

      {/* Educational Tips callout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-50 dark:bg-slate-950/40 p-5 rounded-xl border border-zinc-200 dark:border-white/5">
        <div>
          <h4 className="font-bold text-sm text-zinc-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            🏠 Resting Alignment
          </h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400 mt-2 leading-relaxed">
            Gently anchor your fingers on <span className="font-mono bg-zinc-200 dark:bg-cyan-500/10 dark:text-cyan-400 px-1.5 py-0.5 rounded border dark:border-cyan-500/20">A S D F</span> and <span className="font-mono bg-zinc-200 dark:bg-cyan-500/10 dark:text-cyan-400 px-1.5 py-0.5 rounded border dark:border-cyan-500/20">J K L ;</span>. Let your thumbs hover over the Spacebar.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
            🙈 Blind Anchoring
          </h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400 mt-2 leading-relaxed">
            Feel the physical tactile bumps on the keys <span className="font-semibold text-zinc-800 dark:text-slate-300">F</span> and <span className="font-semibold text-zinc-800 dark:text-slate-300">J</span>. Try to keep your eyes strictly on the screen.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-sm text-zinc-950 dark:text-white flex items-center gap-1.5 uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            🐢 Accuracy First
          </h4>
          <p className="text-xs text-zinc-600 dark:text-slate-400 mt-2 leading-relaxed">
            Go slowly at first to ensure absolute control. Consistent rhythmic keystroke intervals build swift muscle speed over time.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-black uppercase text-zinc-900 dark:text-white tracking-wider flex items-center gap-2">
            <span className="w-2 h-5 bg-sky-600 dark:bg-cyan-400 rounded-sm"></span>
            Lessons Roadmap
          </h3>
          <span className="text-xs font-bold text-zinc-500 dark:text-slate-500 font-mono tracking-widest uppercase">
            {progress.lessonsCompleted} / {LESSONS.length} Tier Unlocked
          </span>
        </div>

        {/* Lessons List Checklist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LESSONS.map((lesson, idx) => {
            const isCompleted = progress.lessonsCompleted > idx;
            const isUnlocked = progress.lessonsCompleted >= idx;

            return (
              <div
                key={lesson.id}
                id={`lesson-card-${lesson.id}`}
                className={`flex flex-col justify-between p-5 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                  isCompleted
                    ? "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)]"
                    : isUnlocked
                    ? "bg-white dark:bg-[#0c0d12]/50 border-zinc-200 dark:border-white/5 hover:border-cyan-500/40 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:bg-[#10121a]/60"
                    : "bg-zinc-100 dark:bg-[#030406]/30 border-zinc-200 dark:border-white/5 opacity-50 pointer-events-none"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-slate-900/60 rounded-lg text-lg border border-transparent dark:border-white/5 shadow-inner">
                        {lesson.icon}
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-sky-600 dark:text-cyan-400 uppercase tracking-widest font-mono">
                          Tier 0{idx + 1} Protocol
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                          {lesson.title}
                        </h4>
                      </div>
                    </div>

                    {isCompleted ? (
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0 shadow-sm" />
                    ) : !isUnlocked ? (
                      <Lock size={16} className="text-zinc-400 dark:text-slate-600 shrink-0" />
                    ) : null}
                  </div>

                  <p className="mt-3.5 text-xs text-zinc-600 dark:text-slate-400 leading-relaxed">
                    {lesson.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {Array.from(lesson.keys).map((k, kIdx) => (
                      <span
                        key={kIdx}
                        className="px-2 py-0.5 text-[10px] font-bold font-mono bg-zinc-100 dark:bg-slate-900/50 text-zinc-800 dark:text-slate-300 rounded border border-zinc-200 dark:border-white/5 uppercase shadow-inner"
                      >
                        {k === " " ? "space" : k}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-white/5">
                  {isUnlocked ? (
                    <button
                      id={`start-lesson-btn-${lesson.id}`}
                      onClick={() => onSelectLesson(lesson)}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/25 dark:text-cyan-400 dark:border dark:border-cyan-500/35 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.05)] hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    >
                      <Play size={12} fill="currentColor" />
                      <span>{isCompleted ? "Re-calibrate Index" : "Initiate Typing Run"}</span>
                    </button>
                  ) : (
                    <div className="py-2 text-center text-[10px] font-bold text-zinc-400 dark:text-slate-600 flex items-center justify-center space-x-1.5 uppercase font-mono tracking-wider">
                      <Lock size={10} />
                      <span>Locked — Pass previous tier</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
}
