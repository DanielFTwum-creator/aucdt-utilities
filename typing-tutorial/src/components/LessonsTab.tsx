import { useState } from "react";
import { Lesson, UserProgress, Difficulty } from "../types";
import { LESSONS } from "../data";
import { CheckCircle2, Lock, Play, ChevronDown } from "lucide-react";

interface LessonsTabProps {
  progress: UserProgress;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

// Matches FINGER_ACCENTS in ExerciseTab — same colours everywhere.
const KEY_FINGER: Record<string, string> = {
  // Left Pinky
  q: "Pinky", a: "Pinky", z: "Pinky", "1": "Pinky",
  // Left Ring
  w: "Ring",  s: "Ring",  x: "Ring",  "2": "Ring",
  // Left Middle
  e: "Middle", d: "Middle", c: "Middle", "3": "Middle",
  // Left Index (reaches T G B and 4 5)
  r: "Index", f: "Index", v: "Index",
  t: "Index", g: "Index", b: "Index", "4": "Index", "5": "Index",
  // Right Index (reaches Y H N and 6 7)
  y: "Index", h: "Index", n: "Index",
  u: "Index", j: "Index", m: "Index", "6": "Index", "7": "Index",
  // Right Middle
  i: "Middle", k: "Middle", ",": "Middle", "8": "Middle",
  // Right Ring
  o: "Ring", l: "Ring", ".": "Ring", "9": "Ring",
  // Right Pinky
  p: "Pinky", ";": "Pinky", "/": "Pinky",
  "0": "Pinky", "-": "Pinky", "[": "Pinky", "]": "Pinky",
  // Thumbs
  " ": "Thumbs",
};

// Border-bottom colour per finger — use Tailwind's border-b-{colour} token.
const FINGER_UNDERLINE: Record<string, string> = {
  Pinky:  "border-b-amber-400",
  Ring:   "border-b-emerald-400",
  Middle: "border-b-violet-400",
  Index:  "border-b-blue-400",
  Thumbs: "border-b-cyan-400",
};

function keyUnderline(key: string): string {
  const finger = KEY_FINGER[key.toLowerCase()];
  return finger ? FINGER_UNDERLINE[finger] : "border-b-stone-300";
}

const DIFFICULTY_LEVELS: Array<{ id: Difficulty; label: string; hint: string }> = [
  { id: "beginner", label: "Beginner", hint: "Short drills, gentle pace" },
  { id: "intermediate", label: "Intermediate", hint: "Longer lines, new vocabulary" },
  { id: "advanced", label: "Advanced", hint: "Long, dense lines at full difficulty" },
];

export default function LessonsTab({ progress, difficulty, onDifficultyChange, onSelectLesson }: LessonsTabProps) {
  const pct = Math.round((progress.lessonsCompleted / LESSONS.length) * 100);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Lessons</h2>
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
          <div className="w-28 h-3 bg-stone-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Difficulty selector — switches every lesson's drill pool */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2" role="radiogroup" aria-label="Difficulty level">
        <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 shrink-0">Difficulty:</span>
        <div className="flex gap-2">
          {DIFFICULTY_LEVELS.map(({ id, label, hint }) => (
            <button
              key={id}
              type="button"
              id={`difficulty-${id}`}
              role="radio"
              aria-checked={difficulty === id}
              title={hint}
              onClick={() => onDifficultyChange(id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                difficulty === id
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-emerald-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 sm:ml-2">
          {DIFFICULTY_LEVELS.find((d) => d.id === difficulty)?.hint}
        </span>
      </div>

      {/* Tips strip */}
      <div className="flex flex-col sm:flex-row gap-2">
        {[
          { icon: "🏠", label: "Home Row", tip: "Anchor on A S D F · J K L ; always." },
          { icon: "🙈", label: "Don't look down", tip: "Use the F and J tactile bumps." },
          { icon: "🐢", label: "Accuracy first", tip: "Speed naturally follows clean form." },
        ].map(({ icon, label, tip }) => (
          <div key={label} className="flex-1 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border-l-2 border-amber-500 px-4 py-3 rounded-r-lg">
            <span className="text-lg shrink-0">{icon}</span>
            <div className="min-w-0">
              <span className="text-sm font-semibold text-amber-800 dark:text-amber-300">{label} — </span>
              <span className="text-sm text-amber-700/70 dark:text-amber-400/60 hidden sm:inline">{tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Roadmap header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Lessons Roadmap</h3>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">{progress.lessonsCompleted} / {LESSONS.length} Unlocked</span>
      </div>

      {/* Lesson cards — 4 columns on large screens (3 rows for 12 lessons,
          instead of 4) so the whole roadmap fits in one screen with no scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              className={`group flex flex-col p-4 rounded-2xl border-2 transition-all duration-200 select-none ${
                isCompleted
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/50 cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
                  : isUnlocked
                  ? "bg-[#FCFBF8] dark:bg-neutral-900/60 border-[#E5DED4] dark:border-white/6 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700/50 hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-[#F5F3EE] dark:bg-neutral-900/30 border-[#EDE8DF] dark:border-white/4 opacity-40 pointer-events-none cursor-default"
              }`}
            >
              {/* Header row: icon + lesson number + title + chevron */}
              <div className="flex items-center gap-3">
                <div className={`relative w-12 h-12 flex items-center justify-center rounded-2xl text-xl shrink-0 ${
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
                      <Lock size={10} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest font-mono leading-none mb-1">
                    Lesson {idx + 1}
                  </p>
                  <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                    {lesson.title}
                  </h4>
                </div>

                {isUnlocked && (
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-neutral-400 dark:text-neutral-500 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 text-amber-500" : "group-hover:text-neutral-600"
                    }`}
                  />
                )}
              </div>

              {/* Expandable description */}
              {isExpanded && (
                <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-[#E5DED4] dark:border-white/6 pt-2.5">
                  {lesson.description}
                </p>
              )}

              {/* Keys + action button */}
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5 min-w-0">
                  {keyChars.slice(0, 5).map((k, kIdx) => (
                    <span
                      key={kIdx}
                      className={`px-2 py-1.5 text-xs font-mono font-bold bg-stone-100 dark:bg-neutral-800 text-stone-700 dark:text-neutral-200 rounded-md border border-stone-200 dark:border-white/6 border-b-2 uppercase ${keyUnderline(k)}`}
                    >
                      {k === " " ? "⎵" : k}
                    </span>
                  ))}
                  {keyChars.length > 5 && (
                    <span className="px-1.5 py-1.5 text-xs text-neutral-400 font-mono">
                      +{keyChars.length - 5}
                    </span>
                  )}
                </div>

                {isUnlocked ? (
                  <button
                    id={`start-lesson-btn-${lesson.id}`}
                    onClick={(e) => { e.stopPropagation(); onSelectLesson(lesson); }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      isCompleted
                        ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-800/50 dark:text-emerald-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md"
                    }`}
                  >
                    <Play size={11} fill="currentColor" />
                    {isCompleted ? "Retry" : "Start"}
                  </button>
                ) : (
                  <span className="shrink-0 text-xs font-semibold text-neutral-300 dark:text-neutral-600 flex items-center gap-1">
                    <Lock size={10} /> Locked
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
