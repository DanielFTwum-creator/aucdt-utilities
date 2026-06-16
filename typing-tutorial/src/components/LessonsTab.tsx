import { Lesson, UserProgress } from "../types";
import { LESSONS } from "../data";
import { CheckCircle2, Lock, Play, Star, TrendingUp } from "lucide-react";

interface LessonsTabProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonsTab({ progress, onSelectLesson }: LessonsTabProps) {
  const pct = Math.round((progress.lessonsCompleted / LESSONS.length) * 100);

  return (
    <div className="space-y-4">

      {/* Welcome Banner — compact, warm gradient */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-rose-500 p-5 sm:p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,_rgba(255,255,255,0.18),transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Star size={12} className="text-yellow-300 fill-yellow-300" />
              <span className="text-[10px] font-bold text-white/75 uppercase tracking-widest">
                Techbridge University College · Keyboard Competency
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Learn to Type with Confidence
            </h2>
            <p className="mt-1.5 text-white/70 text-xs leading-relaxed max-w-md">
              Build speed and accuracy — from home row basics to full keyboard mastery.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white/15 rounded-xl px-4 py-3 backdrop-blur-sm shrink-0 self-start sm:self-auto">
            <TrendingUp size={18} className="text-yellow-300" />
            <div>
              <p className="text-[10px] text-white/60 uppercase tracking-wide font-mono">Progress</p>
              <p className="text-xl font-black leading-none">{progress.lessonsCompleted}<span className="text-sm font-medium text-white/60"> / {LESSONS.length}</span></p>
            </div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="relative z-10 mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow-300 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Tips strip — horizontal and compact */}
      <div className="flex flex-col sm:flex-row gap-2">
        {[
          { icon: "🏠", label: "Home Row First", tip: "Anchor on A S D F · J K L ; and always return here." },
          { icon: "🙈", label: "Eyes on Screen", tip: "Feel the F and J bumps — don't look at your hands." },
          { icon: "🐢", label: "Slow Builds Fast", tip: "Accuracy first. Speed follows from clean muscle memory." },
        ].map(({ icon, label, tip }) => (
          <div key={label} className="flex-1 flex items-start gap-2.5 bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/40 rounded-xl p-3">
            <span className="text-base shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className="text-[11px] font-bold text-violet-800 dark:text-violet-300">{label}</p>
              <p className="text-[10px] text-violet-600/70 dark:text-violet-400/60 mt-0.5 leading-snug">{tip}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <span className="inline-block w-1.5 h-4 bg-violet-500 rounded-full" />
          Lessons Roadmap
        </h3>
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 font-mono">
          {progress.lessonsCompleted} / {LESSONS.length} Unlocked
        </span>
      </div>

      {/* Lesson cards — compact warm design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {LESSONS.map((lesson, idx) => {
          const isCompleted = progress.lessonsCompleted > idx;
          const isUnlocked = progress.lessonsCompleted >= idx;
          const keyChars = Array.from(lesson.keys);

          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              className={`flex flex-col p-4 rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50"
                  : isUnlocked
                  ? "bg-white dark:bg-slate-900/60 border-violet-100 dark:border-white/5 hover:border-violet-300 dark:hover:border-violet-700/40 shadow-sm hover:shadow-md"
                  : "bg-zinc-50 dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800/40 opacity-45 pointer-events-none"
              }`}
            >
              {/* Top: icon + title + status icon */}
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 flex items-center justify-center rounded-xl text-base shrink-0 ${
                  isCompleted
                    ? "bg-emerald-100 dark:bg-emerald-900/40"
                    : "bg-violet-50 dark:bg-violet-950/40"
                }`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-widest font-mono">
                    Lesson {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white leading-tight truncate">
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                    {lesson.description}
                  </p>
                </div>
                <div className="shrink-0 mt-0.5">
                  {isCompleted
                    ? <CheckCircle2 size={15} className="text-emerald-500" />
                    : !isUnlocked
                    ? <Lock size={13} className="text-zinc-300 dark:text-zinc-600" />
                    : null}
                </div>
              </div>

              {/* Bottom: keys + CTA */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 min-w-0">
                  {keyChars.slice(0, 8).map((k, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-zinc-100 dark:bg-slate-800 text-zinc-600 dark:text-slate-300 rounded border border-zinc-200 dark:border-white/5"
                    >
                      {k === " " ? "⎵" : k}
                    </span>
                  ))}
                  {keyChars.length > 8 && (
                    <span className="px-1 py-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                      +{keyChars.length - 8}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    id={`start-lesson-btn-${lesson.id}`}
                    onClick={() => onSelectLesson(lesson)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 min-h-[32px] rounded-lg text-xs font-bold transition-all ${
                      isCompleted
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                        : "bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
                    }`}
                  >
                    <Play size={10} fill="currentColor" />
                    {isCompleted ? "Retry" : "Start"}
                  </button>
                ) : (
                  <div className="shrink-0 flex items-center gap-1 text-[9px] font-bold text-zinc-300 dark:text-zinc-600 uppercase tracking-wider">
                    <Lock size={9} />
                    <span>Locked</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
