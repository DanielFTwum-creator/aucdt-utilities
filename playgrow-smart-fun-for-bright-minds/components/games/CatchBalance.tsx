/**
 * CatchBalance — "Tap the Falling Fruit"
 *
 * AI-for-Good framing: AI analyses reaction times and hand-eye coordination
 * to coach elite athletes, assist stroke-patient motor recovery, and calibrate
 * difficulty for adaptive sports equipment. Kids experience this by tapping
 * falling fruit before it hits the ground — mirroring exactly what sports AI
 * measures during training and rehabilitation sessions.
 *
 * Game flow:
 *  ready → round (fruit falls, tap to catch) → roundOver (stats + AI fact) →
 *  next round | finalScore after round 3
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CatchBalanceProps {
  onClose: () => void;
}

type Phase = 'ready' | 'playing' | 'roundOver' | 'finalScore';

interface FruitItem {
  id: number;
  emoji: string;
  x: number;   // % of container width
  y: number;   // % of container height
  speed: number; // % per tick (50ms)
}

interface PopAnim {
  id: number;
  x: number;
  y: number;
}

interface RoundStats {
  caught: number;
  missed: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOTAL_ROUNDS = 3;
const ROUND_DURATION_MS = 20_000;
const TICK_MS = 50;

const FRUIT_EMOJIS = ['🍎','🍊','🍋','🍇','🍓','🫐','🍑','🍒','🥝','🍍','🥭','🍌'];

// spawn interval per round (ms)
const SPAWN_INTERVAL: Record<number, number> = { 1: 800, 2: 650, 3: 500 };

// speed range per round (% of container height per tick)
const SPEED_RANGE: Record<number, [number, number]> = {
  1: [1.5, 2.5],
  2: [2.0, 3.5],
  3: [3.0, 5.0],
};

const AIRI_PLAY_MESSAGES = [
  'Tap the fruit before it hits the ground! 🎯',
  'AI measures reaction times 1000× faster than a human referee! ⚡🤖',
  'Sports AI coaches track exactly this — how fast your hands respond to what your eyes see! 🏆',
  'Your reaction time is being recorded — just like AI does for Olympic athletes! 🥇',
];

const AI_FACTS = [
  'AI reaction-time analysis helped swimmers shave 0.03 seconds off their starts — enough to win Olympic gold! 🏊🥇',
  'Stroke rehabilitation AI uses tap games exactly like this to measure and retrain hand-eye coordination! 🏥🤖',
  'Sports AI monitors reaction time in real time during matches to detect fatigue before the player even feels it! ⚽',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function randBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function reactionRating(caught: number, total: number): { stars: number; label: string } {
  if (total === 0) return { stars: 1, label: 'Keep Practising!' };
  const pct = caught / total;
  if (pct >= 0.75) return { stars: 3, label: 'Lightning Reflexes!' };
  if (pct >= 0.5)  return { stars: 2, label: 'Quick Hands!' };
  return { stars: 1, label: 'Keep Practising!' };
}

// ── Component ─────────────────────────────────────────────────────────────────

export const CatchBalance: React.FC<CatchBalanceProps> = ({ onClose }) => {
  const [phase, setPhase]               = useState<Phase>('ready');
  const [currentRound, setCurrentRound] = useState(1);
  const [fruits, setFruits]             = useState<FruitItem[]>([]);
  const [pops, setPops]                 = useState<PopAnim[]>([]);
  const [roundStats, setRoundStats]     = useState<RoundStats[]>([]);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [timeLeft, setTimeLeft]         = useState(ROUND_DURATION_MS / 1000);
  const [airiMsg, setAiriMsg]           = useState(AIRI_PLAY_MESSAGES[0]);
  const [airiMood, setAiriMood]         = useState<AiriMood>('watching');
  const [airiMsgIdx, setAiriMsgIdx]     = useState(0);
  const [currentFact, setCurrentFact]   = useState('');

  // accumulated totals across all rounds
  const totalCaughtRef  = useRef(0);
  const totalSpawnedRef = useRef(0);

  // per-round mutable counters (avoid stale closure in rAF loop)
  const caughtThisRoundRef = useRef(0);
  const missedThisRoundRef = useRef(0);
  const spawnedThisRoundRef = useRef(0);

  const containerRef  = useRef<HTMLDivElement>(null);
  const nextIdRef     = useRef(0);
  const phaseRef      = useRef<Phase>('ready');
  const roundRef      = useRef(1);

  // keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { roundRef.current = currentRound; }, [currentRound]);

  // ── Fruit physics loop ──────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return;

    const intervalId = setInterval(() => {
      setFruits(prev => {
        const next: FruitItem[] = [];
        let newMisses = 0;

        for (const f of prev) {
          const newY = f.y + f.speed;
          if (newY > 102) {
            // fell off screen
            newMisses++;
          } else {
            next.push({ ...f, y: newY });
          }
        }

        if (newMisses > 0) {
          missedThisRoundRef.current += newMisses;
        }

        return next;
      });
    }, TICK_MS);

    return () => clearInterval(intervalId);
  }, [phase]);

  // ── Spawn loop ──────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return;

    const spawnInterval = SPAWN_INTERVAL[currentRound] ?? 800;
    const [sMin, sMax]  = SPEED_RANGE[currentRound] ?? [1.5, 2.5];

    const spawnId = setInterval(() => {
      if (phaseRef.current !== 'playing') return;

      const newFruit: FruitItem = {
        id:    nextIdRef.current++,
        emoji: pickRandom(FRUIT_EMOJIS),
        x:     randBetween(5, 82),
        y:     -8,
        speed: randBetween(sMin, sMax),
      };

      spawnedThisRoundRef.current++;
      setTotalSpawned(n => n + 1);
      setFruits(prev => [...prev, newFruit]);
    }, spawnInterval);

    return () => clearInterval(spawnId);
  }, [phase, currentRound]);

  // ── Round countdown ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return;

    setTimeLeft(ROUND_DURATION_MS / 1000);
    const start = Date.now();

    const timerId = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, Math.ceil((ROUND_DURATION_MS - elapsed) / 1000));
      setTimeLeft(remaining);

      if (elapsed >= ROUND_DURATION_MS) {
        clearInterval(timerId);
        endRound();
      }
    }, 250);

    return () => clearInterval(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentRound]);

  // ── Airi rotating messages during play ─────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return;

    const rotateId = setInterval(() => {
      setAiriMsgIdx(idx => {
        const next = (idx + 1) % AIRI_PLAY_MESSAGES.length;
        setAiriMsg(AIRI_PLAY_MESSAGES[next]);
        return next;
      });
    }, 8_000);

    return () => clearInterval(rotateId);
  }, [phase]);

  // ── Pop animation cleanup ───────────────────────────────────────────────────

  useEffect(() => {
    if (pops.length === 0) return;
    const t = setTimeout(() => setPops([]), 600);
    return () => clearTimeout(t);
  }, [pops]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const startRound = useCallback(() => {
    caughtThisRoundRef.current  = 0;
    missedThisRoundRef.current  = 0;
    spawnedThisRoundRef.current = 0;
    setFruits([]);
    setPops([]);
    setAiriMsg(AIRI_PLAY_MESSAGES[0]);
    setAiriMood('watching');
    setPhase('playing');
  }, []);

  const endRound = useCallback(() => {
    setFruits([]);
    setPhase('roundOver');

    const stats: RoundStats = {
      caught: caughtThisRoundRef.current,
      missed: missedThisRoundRef.current,
    };

    setRoundStats(prev => [...prev, stats]);
    totalCaughtRef.current  += caughtThisRoundRef.current;
    totalSpawnedRef.current += spawnedThisRoundRef.current;

    const fact = AI_FACTS[(roundRef.current - 1) % AI_FACTS.length];
    setCurrentFact(fact);
    setAiriMsg(fact);
    setAiriMood('thinking');
  }, []);

  const handleCatch = useCallback((id: number, x: number, y: number) => {
    setFruits(prev => {
      const fruit = prev.find(f => f.id === id);
      if (!fruit) return prev;
      caughtThisRoundRef.current++;
      setPops(p => [...p, { id, x: fruit.x, y: fruit.y }]);
      setAiriMood('happy');
      return prev.filter(f => f.id !== id);
    });
  }, []);

  const handleNextRound = useCallback(() => {
    const next = currentRound + 1;
    if (next > TOTAL_ROUNDS) {
      setAiriMsg('Amazing work! Look at your results! 🎉');
      setAiriMood('celebrating');
      setPhase('finalScore');
    } else {
      setCurrentRound(next);
      startRound();
    }
  }, [currentRound, startRound]);

  const handlePlayAgain = useCallback(() => {
    totalCaughtRef.current  = 0;
    totalSpawnedRef.current = 0;
    setRoundStats([]);
    setTotalSpawned(0);
    setCurrentRound(1);
    setPhase('ready');
    setAiriMsg(AIRI_PLAY_MESSAGES[0]);
    setAiriMood('idle');
  }, []);

  // ── Render helpers ───────────────────────────────────────────────────────────

  const totalCaught = totalCaughtRef.current;
  const grandTotal  = totalSpawnedRef.current || totalSpawned;
  const rating      = reactionRating(totalCaught, grandTotal);

  const lastRoundStats = roundStats[roundStats.length - 1] ?? { caught: 0, missed: 0 };

  // ── Ready screen ─────────────────────────────────────────────────────────────

  if (phase === 'ready') {
    return (
      <div className="flex flex-col h-full bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 p-4 select-none">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-green-700 dark:text-green-300">Catch &amp; Balance 🎯</h1>
          <button onClick={onClose} className="text-green-500 hover:text-green-700 dark:hover:text-green-300 text-2xl leading-none">&times;</button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div className="text-7xl animate-bounce">🍎</div>
          <h2 className="text-2xl font-bold">Tap the Falling Fruit!</h2>
          <p className="text-green-700 dark:text-green-300 max-w-xs">
            Fruit falls from the sky. Tap each one before it hits the ground!
            3 rounds · 20 seconds each · Get ready!
          </p>
          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 max-w-xs text-sm text-green-800 dark:text-green-200">
            🤖 <strong>AI for Good:</strong> Sports AI measures reaction times exactly like this to coach athletes and help patients recover motor skills!
          </div>
          <button
            onClick={() => { setCurrentRound(1); startRound(); }}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-lg rounded-full shadow-lg transition-colors touch-manipulation"
          >
            Start Game 🚀
          </button>
        </div>

        <Airi message="Tap the fruit before it hits the ground! 🎯" mood="idle" />
      </div>
    );
  }

  // ── Round-over screen ────────────────────────────────────────────────────────

  if (phase === 'roundOver') {
    const isLastRound = currentRound >= TOTAL_ROUNDS;
    return (
      <div className="flex flex-col h-full bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 p-4 select-none">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-green-700 dark:text-green-300">Catch &amp; Balance 🎯</h1>
          <button onClick={onClose} className="text-green-500 hover:text-green-700 dark:hover:text-green-300 text-2xl leading-none">&times;</button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <h2 className="text-2xl font-bold">Round {currentRound} Complete! 🎉</h2>

          <div className="flex gap-6">
            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 min-w-[100px]">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{lastRoundStats.caught}</div>
              <div className="text-sm mt-1">Caught 🎯</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 min-w-[100px]">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{lastRoundStats.missed}</div>
              <div className="text-sm mt-1">Missed 💨</div>
            </div>
          </div>

          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 max-w-xs text-sm text-green-800 dark:text-green-200">
            🤖 <strong>AI Fact:</strong> {currentFact}
          </div>

          <button
            onClick={handleNextRound}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-lg rounded-full shadow-lg transition-colors touch-manipulation"
          >
            {isLastRound ? 'See Results 🏆' : `Start Round ${currentRound + 1} ▶`}
          </button>
        </div>

        <Airi message={currentFact} mood="thinking" />
      </div>
    );
  }

  // ── Final score screen ───────────────────────────────────────────────────────

  if (phase === 'finalScore') {
    const stars = rating.stars;
    return (
      <div className="flex flex-col h-full bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 p-4 select-none">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-green-700 dark:text-green-300">Catch &amp; Balance 🎯</h1>
          <button onClick={onClose} className="text-green-500 hover:text-green-700 dark:hover:text-green-300 text-2xl leading-none">&times;</button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <div className="text-6xl animate-bounce">🏆</div>
          <h2 className="text-2xl font-bold">{rating.label}</h2>

          <div className="flex gap-1 text-4xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < stars ? 'opacity-100' : 'opacity-20'}>⭐</span>
            ))}
          </div>

          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{totalCaught}</div>
            <div className="text-sm mt-1">fruit caught out of {grandTotal} 🍎</div>
          </div>

          <div className="bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 max-w-xs text-sm text-green-800 dark:text-green-200">
            🤖 <strong>AI Summary:</strong> AI coaches use reaction-time data just like this to build personalised training plans for athletes worldwide!
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold rounded-full shadow-lg transition-colors touch-manipulation"
            >
              Play Again 🔄
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-green-200 dark:bg-green-800 hover:bg-green-300 dark:hover:bg-green-700 text-green-800 dark:text-green-100 font-bold rounded-full shadow-lg transition-colors touch-manipulation"
            >
              Done ✓
            </button>
          </div>
        </div>

        <Airi message="Amazing work! You trained just like an AI sports coach would measure you! 🥇" mood="celebrating" />
      </div>
    );
  }

  // ── Playing screen ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 select-none">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-green-200 dark:border-green-800 shrink-0">
        <span className="font-bold text-green-700 dark:text-green-300">Round {currentRound}/{TOTAL_ROUNDS}</span>
        <span className="text-sm font-medium tabular-nums">⏱ {timeLeft}s</span>
        <button onClick={onClose} className="text-green-500 hover:text-green-700 dark:hover:text-green-300 text-2xl leading-none">&times;</button>
      </header>

      {/* Game area */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden bg-gradient-to-b from-sky-100 to-green-100 dark:from-sky-950 dark:to-green-950"
        style={{ touchAction: 'none' }}
      >
        {/* Ground indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-400 dark:bg-green-600 opacity-60 rounded-t" />

        {/* Fruits */}
        {fruits.map(fruit => (
          <button
            key={fruit.id}
            onPointerDown={e => { e.stopPropagation(); handleCatch(fruit.id, fruit.x, fruit.y); }}
            className="absolute w-12 h-12 rounded-full bg-white/70 dark:bg-white/20 backdrop-blur-sm shadow-md flex items-center justify-center text-4xl transition-none touch-manipulation active:scale-90"
            style={{ left: `${fruit.x}%`, top: `${fruit.y}%`, transform: 'translate(-50%, -50%)' }}
            aria-label={`Catch ${fruit.emoji}`}
          >
            {fruit.emoji}
          </button>
        ))}

        {/* +1 pop animations */}
        {pops.map(pop => (
          <div
            key={`pop-${pop.id}`}
            className="absolute pointer-events-none text-green-600 dark:text-green-300 font-extrabold text-2xl animate-ping"
            style={{ left: `${pop.x}%`, top: `${pop.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            +1
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div className="flex items-center justify-around px-4 py-2 border-t border-green-200 dark:border-green-800 text-sm shrink-0">
        <span>🎯 Caught: <strong>{caughtThisRoundRef.current}</strong></span>
        <span>💨 Missed: <strong>{missedThisRoundRef.current}</strong></span>
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
