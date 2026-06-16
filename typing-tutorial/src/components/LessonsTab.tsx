import { useState } from "react";
import { Lesson, UserProgress } from "../types";
import { LESSONS } from "../data";
import { CheckCircle2, Lock, Play, ChevronDown } from "lucide-react";

interface LessonsTabProps {
  progress: UserProgress;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function LessonsTab({ progress, onSelectLesson }: LessonsTabProps) {
  const pct = Math.round((progress.lessonsCompleted / LESSONS.length) * 100);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Lessons</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Complete each lesson at 80%+ accuracy to unlock the next.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">Progress</p>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              {progress.lessonsCompleted} / {LESSONS.length} lessons
            </p>
          </div>
          <div className="w-28 h-2.5 bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tips strip */}
      <div className="flex flex-col sm:flex-row gap-2">
        {[
          { icon: "🏠", label: "Home Row", tip: "Anchor on A S D F · J K L ; always." },
          { icon: "🙈", label: "Don't look down", tip: "Use the F and J tactile bumps." },
          { icon: "🐢", label: "Accuracy first", tip: "Speed naturally follows clean form." },
        ].map(({ icon, label, tip }) => (
          <div key={label} className="flex-1 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500 px-3 py-2 rounded-r-lg">
            <span className="text-sm shrink-0">{icon}</span>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">{label} — </span>
              <span className="text-xs text-amber-700/70 dark:text-amber-400/60 hidden sm:inline">{tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Lessons Roadmap</h3>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{progress.lessonsCompleted} / {LESSONS.length} Unlocked</span>
      </div>

      {/* Lesson cards — 3 columns on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {LESSONS.map((lesson, idx) => {
          const isCompleted = progress.lessonsCompleted > idx;
          const isUnlocked = progress.lessonsCompleted >= idx;
          const isExpanded = expandedIdx === idx;
          const keyChars = Array.from(lesson.keys);

          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => isUnlocked && setExpandedIdx(isExpanded ? null : idx)}
              className={`group flex flex-col p-4 rounded-2xl border transition-all duration-200 select-none ${
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 cursor-pointer hover:shadow-md hover:-translate-y-0.5"
                  : isUnlocked
                  ? "bg-[#FCFBF8] dark:bg-neutral-900/60 border-[#E5DED4] dark:border-white/6 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700/50 hover:shadow-md hover:-translate-y-0.5"
                  : "bg-[#F5F3EE] dark:bg-neutral-900/30 border-[#EDE8DF] dark:border-white/4 opacity-40 pointer-events-none cursor-default"
              }`}
            >
              {/* Header row: icon + badge + title + chevron */}
              <div className="flex items-center gap-3">
                <div className={`relative w-11 h-11 flex items-center justify-center rounded-xl text-xl shrink-0 ${
                  isCompleted ? "bg-emerald-100 dark:bg-emerald-900/40" : "bg-stone-100 dark:bg-neutral-800"
                }`}>
                  {lesson.icon}
                  {isCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                      <CheckCircle2 size={11} className="text-white" />
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-stone-400 dark:bg-neutral-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                      <Lock size={9} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest font-mono leading-none mb-1">
                    Lesson {idx + 1}
                  </p>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug truncate">
                    {lesson.title}
                  </h4>
                </div>

                {isUnlocked && (
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-amber-500" : "group-hover:text-neutral-600"
                    }`}
                  />
                )}
              </div>

              {/* Expandable description — shown on click */}
              {isExpanded && (
                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-[#E5DED4] dark:border-white/6 pt-3">
                  {lesson.description}
                </p>
              )}

              {/* Keys + action button */}
              <div className="mt-3.5 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1 min-w-0">
                  {keyChars.slice(0, 6).map((k, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-1.5 py-1 text-[10px] font-mono font-bold bg-stone-100 dark:bg-neutral-800 text-stone-600 dark:text-neutral-300 rounded-md border border-stone-200 dark:border-white/6 uppercase"
                    >
                      {k === " " ? "⎵" : k}
                    </span>
                  ))}
                  {keyChars.length > 6 && (
                    <span className="px-1.5 py-1 text-[10px] text-neutral-400 font-mono">
                      +{keyChars.length - 6}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    id={`start-lesson-btn-${lesson.id}`}
                    onClick={(e) => { e.stopPropagation(); onSelectLesson(lesson); }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      isCompleted
                        ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/50 dark:text-emerald-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow"
                    }`}
                  >
                    <Play size={10} fill="currentColor" />
                    {isCompleted ? "Retry" : "Start"}
                  </button>
                ) : (
                  <span className="shrink-0 text-[10px] font-semibold text-neutral-300 dark:text-neutral-600 flex items-center gap-1">
                    <Lock size={9} /> Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
