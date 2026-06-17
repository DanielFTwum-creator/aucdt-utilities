/**
 * Calm Corner — "Breathe with Airi"
 *
 * AI-for-Good framing: AI monitors breathing patterns and heart rate to detect
 * stress and guide people through calming exercises — used in mental health apps,
 * smartwatches, and hospital care.
 *
 * Game flow:
 *  intro → exercise 1→2→3→4 → (each: pacer animation → mood check → AI fact) → summary
 *  Each exercise: animated breath pacer (scale/colour) + phase countdown timer
 *  After each exercise: mood check (😌 Calm / 😐 Same / 😟 Still worried)
 *  "Skip" available on each exercise — no penalty
 *  Final: mood journey summary + celebration
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

// ── Types ────────────────────────────────────────────────────────────────────

type MoodChoice = 'calm' | 'same' | 'worried';
type ExercisePhase = 'idle' | 'running' | 'done';
type ScreenPhase = 'intro' | 'exercise' | 'moodCheck' | 'summary';

interface BreathStep {
  label: string;
  seconds: number;
  color: string;          // tailwind bg for pacer ring
  scale: number;          // CSS scale target for the circle
}

interface Exercise {
  id: number;
  name: string;
  emoji: string;
  description: string;
  steps: BreathStep[];    // repeated N times
  repeats: number;
  aiFact: string;
}

interface MoodEntry {
  exerciseName: string;
  emoji: string;
  choice: MoodChoice;
}

// ── Breath exercises ─────────────────────────────────────────────────────────

const EXERCISES: Exercise[] = [
  {
    id: 1,
    name: 'Box Breathing',
    emoji: '⬜',
    description: 'Breathe in, hold, breathe out, hold — like tracing the sides of a box.',
    steps: [
      { label: 'Breathe in…',  seconds: 4, color: 'bg-blue-400',   scale: 1.9 },
      { label: 'Hold…',        seconds: 4, color: 'bg-purple-400', scale: 1.9 },
      { label: 'Breathe out…', seconds: 4, color: 'bg-green-400',  scale: 1.0 },
      { label: 'Hold…',        seconds: 4, color: 'bg-purple-400', scale: 1.0 },
    ],
    repeats: 3,
    aiFact: 'AI in smartwatches detects your breathing pattern to know when you\'re stressed — even before you do! ⌚🤖',
  },
  {
    id: 2,
    name: '4-7-8 Breathing',
    emoji: '🌬️',
    description: 'A powerful pattern used in meditation — 4 seconds in, hold for 7, out for 8.',
    steps: [
      { label: 'Breathe in…',  seconds: 4, color: 'bg-blue-400',   scale: 1.9 },
      { label: 'Hold…',        seconds: 7, color: 'bg-purple-400', scale: 1.9 },
      { label: 'Breathe out…', seconds: 8, color: 'bg-green-400',  scale: 1.0 },
    ],
    repeats: 3,
    aiFact: 'Hospitals use AI breathing guides to help patients stay calm before surgery! 🏥',
  },
  {
    id: 3,
    name: 'Belly Breathing',
    emoji: '🫁',
    description: 'Let your belly rise on the way in, and fall on the way out — slow and deep.',
    steps: [
      { label: 'Belly out — breathe in…', seconds: 4, color: 'bg-sky-400',   scale: 1.9 },
      { label: 'Belly in — breathe out…', seconds: 6, color: 'bg-teal-400',  scale: 1.0 },
    ],
    repeats: 4,
    aiFact: 'AI-powered apps help millions of people manage anxiety by guiding breathing exercises like this one! 🧘',
  },
  {
    id: 4,
    name: 'Star Breathing',
    emoji: '⭐',
    description: 'Imagine tracing a 5-point star — breathe in along one side, out along the next.',
    steps: [
      { label: 'Breathe in… (point 1)',   seconds: 4, color: 'bg-yellow-400', scale: 1.9 },
      { label: 'Breathe out… (point 2)',  seconds: 4, color: 'bg-amber-400',  scale: 1.0 },
      { label: 'Breathe in… (point 3)',   seconds: 4, color: 'bg-yellow-400', scale: 1.9 },
      { label: 'Breathe out… (point 4)',  seconds: 4, color: 'bg-amber-400',  scale: 1.0 },
      { label: 'Breathe in… (point 5)',   seconds: 4, color: 'bg-yellow-400', scale: 1.9 },
    ],
    repeats: 5,
    aiFact: 'Scientists are training AI to detect panic attacks from wristband sensors so help arrives automatically! 🚨',
  },
];

const MOOD_OPTIONS: { id: MoodChoice; emoji: string; label: string }[] = [
  { id: 'calm',    emoji: '😌', label: 'Calm' },
  { id: 'same',    emoji: '😐', label: 'Same' },
  { id: 'worried', emoji: '😟', label: 'Still worried' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function totalExerciseSeconds(ex: Exercise): number {
  return ex.steps.reduce((s, step) => s + step.seconds, 0) * ex.repeats;
}

// ── Component ────────────────────────────────────────────────────────────────

export const CalmCorner: React.FC<Props> = ({ onClose }) => {
  const [screen, setScreen]             = useState<ScreenPhase>('intro');
  const [exIndex, setExIndex]           = useState(0);
  const [exPhase, setExPhase]           = useState<ExercisePhase>('idle');

  // Pacer state
  const [stepIndex, setStepIndex]       = useState(0);
  const [repeatIndex, setRepeatIndex]   = useState(0);
  const [countdown, setCountdown]       = useState(0);
  const [pacerScale, setPacerScale]     = useState(1.0);
  const [pacerColor, setPacerColor]     = useState('bg-blue-400');
  const [stepLabel, setStepLabel]       = useState('');

  // Mood tracking
  const [moodLog, setMoodLog]           = useState<MoodEntry[]>([]);

  // Airi
  const [airiMsg, setAiriMsg]           = useState("Welcome to the Calm Corner! 🌿 Let's breathe together and give your mind a rest.");
  const [airiMood, setAiriMood]         = useState<AiriMood>('idle');

  // Timer ref to cancel on unmount / skip
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const exercise = EXERCISES[exIndex];

  // ── Stop any running timer ───────────────────────────────────────────────────
  const stopTimer = useCallback(() => {
    runningRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => stopTimer(), [stopTimer]);

  // ── Run one step of a breathing cycle ───────────────────────────────────────
  const runStep = useCallback((
    ex: Exercise,
    sIdx: number,
    rIdx: number,
    secondsLeft: number,
  ) => {
    if (!runningRef.current) return;

    const step = ex.steps[sIdx];
    setPacerColor(step.color);
    setPacerScale(step.scale);
    setStepLabel(step.label);
    setCountdown(secondsLeft);

    if (secondsLeft > 1) {
      timerRef.current = setTimeout(() => runStep(ex, sIdx, rIdx, secondsLeft - 1), 1000);
      return;
    }

    // Step complete — move to next
    const nextSIdx = sIdx + 1;
    if (nextSIdx < ex.steps.length) {
      timerRef.current = setTimeout(() => runStep(ex, nextSIdx, rIdx, ex.steps[nextSIdx].seconds), 400);
      return;
    }

    // All steps in this repeat done
    const nextRIdx = rIdx + 1;
    if (nextRIdx < ex.repeats) {
      setRepeatIndex(nextRIdx);
      timerRef.current = setTimeout(() => runStep(ex, 0, nextRIdx, ex.steps[0].seconds), 600);
      return;
    }

    // All repeats done — exercise complete
    runningRef.current = false;
    setPacerScale(1.0);
    setPacerColor('bg-purple-400');
    setStepLabel('');
    setExPhase('done');
    setAiriMsg(`Well done! How do you feel after that? 🌿`);
    setAiriMood('happy');
    setScreen('moodCheck');
  }, []);

  const startExercise = useCallback(() => {
    stopTimer();
    runningRef.current = true;
    setExPhase('running');
    setStepIndex(0);
    setRepeatIndex(0);
    setPacerScale(1.0);
    setStepLabel('Get ready…');
    setCountdown(0);
    setAiriMsg(`Let's do ${exercise.name} together. Follow the circle and breathe with me. 🌬️`);
    setAiriMood('watching');

    timerRef.current = setTimeout(() => {
      runStep(exercise, 0, 0, exercise.steps[0].seconds);
    }, 1200);
  }, [exercise, runStep, stopTimer]);

  const handleSkip = () => {
    stopTimer();
    setExPhase('done');
    setAiriMsg(`No problem! How do you feel right now? 🌿`);
    setAiriMood('encouraging');
    setScreen('moodCheck');
  };

  const handleMoodPick = (choice: MoodChoice) => {
    const moodDef = MOOD_OPTIONS.find(m => m.id === choice)!;
    const entry: MoodEntry = {
      exerciseName: exercise.name,
      emoji: moodDef.emoji,
      choice,
    };
    const newLog = [...moodLog, entry];
    setMoodLog(newLog);

    const nextIdx = exIndex + 1;
    if (nextIdx >= EXERCISES.length) {
      setScreen('summary');
      setAiriMsg('You completed the Calm Corner! I\'m so proud of you! 🤖🌟');
      setAiriMood('celebrating');
    } else {
      setExIndex(nextIdx);
      setExPhase('idle');
      setScreen('exercise');
      setAiriMsg(`${exercise.aiFact}`);
      setAiriMood('happy');
    }
  };

  const handleRestart = () => {
    stopTimer();
    setScreen('intro');
    setExIndex(0);
    setExPhase('idle');
    setMoodLog([]);
    setPacerScale(1.0);
    setPacerColor('bg-blue-400');
    setStepLabel('');
    setCountdown(0);
    setAiriMsg("Let's go again! 🌿 I'll be right here with you.");
    setAiriMood('idle');
  };

  // ── Derived ──────────────────────────────────────────────────────────────────

  const totalSecs = totalExerciseSeconds(exercise);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const durationLabel = mins > 0 ? `~${mins}m ${secs}s` : `~${secs}s`;

  // ── Intro screen ─────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-purple-600 dark:text-purple-300 hover:underline">← Back</button>
          <h1 className="text-base font-extrabold text-purple-700 dark:text-purple-300">🌿 Calm Corner</h1>
          <span />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
          <div className="text-7xl">🧘</div>
          <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300">Ready to Breathe?</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400 max-w-sm leading-relaxed">
            Airi will guide you through 4 breathing exercises. Follow the animated circle and breathe along.
            After each one, tell Airi how you feel!
          </p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {EXERCISES.map(ex => (
              <div key={ex.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-purple-200 dark:border-purple-700 p-3 text-center shadow-sm">
                <div className="text-2xl mb-1">{ex.emoji}</div>
                <p className="text-xs font-extrabold text-purple-700 dark:text-purple-300">{ex.name}</p>
              </div>
            ))}
          </div>
          <button type="button"
            onClick={() => { setScreen('exercise'); setAiriMsg(`Let's start with ${EXERCISES[0].name}! ${EXERCISES[0].description} 🌬️`); setAiriMood('encouraging'); }}
            className="px-8 py-3 rounded-full bg-purple-500 text-white font-extrabold text-sm hover:bg-purple-600 active:scale-95 transition-all shadow-lg">
            🌿 Let's Begin
          </button>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Summary screen ───────────────────────────────────────────────────────────
  if (screen === 'summary') {
    const calmCount   = moodLog.filter(m => m.choice === 'calm').length;
    const worryCount  = moodLog.filter(m => m.choice === 'worried').length;

    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-purple-600 dark:text-purple-300 hover:underline">← Back</button>
          <h1 className="text-base font-extrabold text-purple-700 dark:text-purple-300">🌿 Calm Corner</h1>
          <span />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-32 space-y-5">
          <div className="text-center space-y-2">
            <div className="text-6xl animate-bounce">🌟</div>
            <h2 className="text-2xl font-extrabold text-purple-700 dark:text-purple-300">All Done!</h2>
            <p className="text-sm text-purple-600 dark:text-purple-400">Here's your mood journey today:</p>
          </div>

          <div className="space-y-2">
            {moodLog.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-purple-200 dark:border-purple-700 px-4 py-3 shadow-sm">
                <span className="text-2xl">{entry.emoji}</span>
                <div>
                  <p className="text-sm font-extrabold text-purple-700 dark:text-purple-300">{entry.exerciseName}</p>
                  <p className="text-xs text-purple-500 dark:text-purple-400 capitalize">{entry.choice === 'calm' ? '😌 Felt calmer' : entry.choice === 'same' ? '😐 Felt the same' : '😟 Still worried'}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl border border-purple-200 dark:border-purple-700 p-5 text-center shadow-md space-y-2">
            <p className="text-xl font-extrabold text-purple-700 dark:text-purple-300">
              {calmCount >= 3 ? '🌟 Feeling much calmer!' : calmCount >= 1 ? '🌿 A little calmer!' : '💜 You showed up — that counts!'}
            </p>
            <p className="text-xs text-purple-500 dark:text-purple-400 leading-relaxed">
              {worryCount > 0
                ? "If you're still worried, that's okay. Talk to someone you trust. 💙"
                : 'Breathing exercises work better each time you practise. You\'re doing great! 🌱'}
            </p>
          </div>

          <p className="text-xs text-center text-purple-500 dark:text-purple-400 italic leading-relaxed bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-700">
            🤖 AI monitors breathing patterns in smartwatches and apps to detect stress — and guide people back to calm, just like Airi did with you today!
          </p>

          <button type="button" onClick={handleRestart}
            className="w-full py-3 rounded-full bg-purple-500 text-white font-extrabold text-sm hover:bg-purple-600 active:scale-95 transition-all shadow-lg">
            🔄 Breathe Again
          </button>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Mood check screen ────────────────────────────────────────────────────────
  if (screen === 'moodCheck') {
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-purple-600 dark:text-purple-300 hover:underline">← Back</button>
          <h1 className="text-base font-extrabold text-purple-700 dark:text-purple-300">🌿 Calm Corner</h1>
          <span className="text-xs text-purple-500 dark:text-purple-400">{exIndex + 1} / {EXERCISES.length}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center pb-24">
          <div className="text-5xl">{exercise.emoji}</div>
          <h2 className="text-xl font-extrabold text-purple-700 dark:text-purple-300">{exercise.name} — complete! ✓</h2>
          <p className="text-sm text-purple-600 dark:text-purple-400 max-w-xs leading-relaxed">{exercise.aiFact}</p>

          <div className="w-full max-w-xs space-y-3">
            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">How do you feel right now?</p>
            {MOOD_OPTIONS.map(opt => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMoodPick(opt.id)}
                className="w-full flex items-center gap-3 px-5 py-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 active:scale-[0.98] transition-all shadow-sm"
              >
                <span className="text-3xl">{opt.emoji}</span>
                <span className="text-sm font-extrabold text-purple-700 dark:text-purple-300">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Exercise screen ──────────────────────────────────────────────────────────

  const isRunning = exPhase === 'running';

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-purple-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-purple-200 dark:border-purple-800 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-purple-600 dark:text-purple-300 hover:underline">← Back</button>
        <h1 className="text-base font-extrabold text-purple-700 dark:text-purple-300">🌿 Calm Corner</h1>
        <span className="text-xs text-purple-500 dark:text-purple-400 font-semibold">{exIndex + 1} / {EXERCISES.length}</span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-3 shrink-0">
        {EXERCISES.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            i < exIndex ? 'bg-purple-400' : i === exIndex ? 'bg-purple-600 scale-125' : 'bg-purple-200 dark:bg-purple-800'
          }`} />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 pb-28">

        {/* Exercise title */}
        <div className="text-center space-y-1">
          <div className="text-4xl">{exercise.emoji}</div>
          <h2 className="text-xl font-extrabold text-purple-700 dark:text-purple-300">{exercise.name}</h2>
          {!isRunning && (
            <p className="text-xs text-purple-500 dark:text-purple-400 max-w-xs leading-relaxed">{exercise.description}</p>
          )}
          {!isRunning && (
            <p className="text-xs text-purple-400 dark:text-purple-500">{durationLabel} · {exercise.repeats} rounds</p>
          )}
        </div>

        {/* Breath pacer circle */}
        <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
          {/* Outer glow ring */}
          <div
            className={`absolute rounded-full opacity-20 transition-all ${pacerColor}`}
            style={{
              width: 200,
              height: 200,
              transform: `scale(${isRunning ? pacerScale : 1.0})`,
              transitionDuration: isRunning ? `${exercise.steps[stepIndex]?.seconds ?? 4}s` : '0.5s',
              transitionTimingFunction: 'ease-in-out',
            }}
          />
          {/* Main circle */}
          <div
            className={`rounded-full flex flex-col items-center justify-center transition-all ${pacerColor}`}
            style={{
              width: 140,
              height: 140,
              transform: `scale(${isRunning ? pacerScale : 1.0})`,
              transitionDuration: isRunning ? `${exercise.steps[stepIndex]?.seconds ?? 4}s` : '0.5s',
              transitionTimingFunction: 'ease-in-out',
              opacity: isRunning ? 0.85 : 0.4,
            }}
          >
            {isRunning && countdown > 0 && (
              <span className="text-3xl font-extrabold text-white drop-shadow">{countdown}</span>
            )}
            {!isRunning && (
              <span className="text-4xl">🌬️</span>
            )}
          </div>
        </div>

        {/* Step label */}
        {isRunning && stepLabel && (
          <p className="text-base font-extrabold text-purple-700 dark:text-purple-300 animate-pulse text-center">
            {stepLabel}
          </p>
        )}

        {/* Repeat indicator */}
        {isRunning && (
          <p className="text-xs text-purple-500 dark:text-purple-400">
            Round {repeatIndex + 1} of {exercise.repeats}
          </p>
        )}

        {/* Action buttons */}
        {exPhase === 'idle' && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={startExercise}
              className="px-8 py-3 rounded-full bg-purple-500 text-white font-extrabold text-sm hover:bg-purple-600 active:scale-95 transition-all shadow-lg"
            >
              🌬️ Start Breathing
            </button>
            <button
              type="button"
              onClick={handleSkip}
              className="px-5 py-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 font-bold text-sm hover:bg-purple-200 dark:hover:bg-purple-800/40 active:scale-95 transition-all"
            >
              Skip →
            </button>
          </div>
        )}

        {exPhase === 'running' && (
          <button
            type="button"
            onClick={handleSkip}
            className="px-5 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 font-bold text-xs hover:bg-purple-200 active:scale-95 transition-all"
          >
            Skip this exercise
          </button>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
