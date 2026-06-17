/**
 * Dance Time — "Move Like the AI Sees You"
 *
 * AI-for-good framing: AI analyses human movement using motion-capture cameras
 * to help physiotherapists design personalised exercises, train athletes, and
 * teach robots to move naturally. Kids experience this by copying a sequence of
 * dance moves — mirroring how AI learns movement patterns.
 *
 * Game flow:
 *  ready → showing (Airi demonstrates sequence) → player (child copies) →
 *  levelComplete → next level  |  wrong → replay  |  gameOver
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface DanceTimeProps {
  onClose: () => void;
}

// ── Move definitions ─────────────────────────────────────────────────────────

const MOVES = [
  { id: 'up',    emoji: '👆', label: 'Reach Up',    instruction: 'Reach your arms UP!' },
  { id: 'down',  emoji: '👇', label: 'Crouch Down', instruction: 'Crouch DOWN low!' },
  { id: 'left',  emoji: '👈', label: 'Step Left',   instruction: 'Step to the LEFT!' },
  { id: 'right', emoji: '👉', label: 'Step Right',  instruction: 'Step to the RIGHT!' },
  { id: 'spin',  emoji: '🔄', label: 'Spin Around', instruction: 'SPIN around!' },
  { id: 'jump',  emoji: '⬆️', label: 'Jump!',       instruction: 'JUMP up high!' },
  { id: 'clap',  emoji: '👏', label: 'Clap',        instruction: 'CLAP your hands!' },
  { id: 'shake', emoji: '🫨', label: 'Shake',       instruction: 'SHAKE your body!' },
] as const;

type MoveId = (typeof MOVES)[number]['id'];
type Phase  = 'ready' | 'showing' | 'player' | 'wrong' | 'levelComplete' | 'gameOver';

// ── AI-for-good facts shown on level completion ───────────────────────────────

const AI_FACTS = [
  'AI motion-capture systems record 200 body points at once — helping physiotherapists design recovery exercises! 🏃🤖',
  'Sports AI analyses your running style in real time and adjusts training to prevent injuries before they happen! ⚽',
  'AI-trained robots learned to walk and dance by watching millions of hours of human movement! 🦾',
  'AI coaches in the 2024 Olympics used motion analysis to give athletes instant feedback on their technique! 🥇',
  'Hospitals use AI movement analysis to detect early signs of Parkinson\'s disease from the way people walk! 🏥',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const randItem = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

const generateSequence = (level: number): MoveId[] => {
  const ids = MOVES.map((m) => m.id);
  const length = level + 1; // level 1 = 2, level 5 = 6
  return Array.from({ length }, () => randItem(ids));
};

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_LEVEL = 5;
const MAX_LIVES = 3;
const SHOW_ON_MS  = 800;
const SHOW_OFF_MS = 300;

// ── Component ─────────────────────────────────────────────────────────────────

export const DanceTime: React.FC<DanceTimeProps> = ({ onClose }) => {
  const [level,      setLevel]      = useState(1);
  const [sequence,   setSequence]   = useState<MoveId[]>([]);
  const [phase,      setPhase]      = useState<Phase>('ready');
  const [playerPos,  setPlayerPos]  = useState(0);
  const [showMove,   setShowMove]   = useState<MoveId | null>(null); // currently spotlit move during showing phase
  const [flashMove,  setFlashMove]  = useState<MoveId | null>(null); // player tap feedback
  const [wrongMove,  setWrongMove]  = useState<MoveId | null>(null); // red flash on wrong tap
  const [lives,      setLives]      = useState(MAX_LIVES);
  const [mistakes,   setMistakes]   = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [totalStars,  setTotalStars]  = useState(0);
  const [airiMsg,    setAiriMsg]    = useState("Hi! I'm Airi 🤖 Watch my dance moves carefully, then copy them!");
  const [airiMood,   setAiriMood]   = useState<AiriMood>('idle');
  const [factIdx,    setFactIdx]    = useState(0);

  const showingRef = useRef(false); // guard against double-fire in strict mode

  // ── Sequence playback ──────────────────────────────────────────────────────

  const playSequence = useCallback((seq: MoveId[]) => {
    if (showingRef.current) return;
    showingRef.current = true;
    setPhase('showing');
    setShowMove(null);
    setAiriMsg('Watch my dance moves carefully! 🕺');
    setAiriMood('watching');

    let i = 0;
    const step = () => {
      if (i < seq.length) {
        setShowMove(seq[i]);
        i++;
        setTimeout(() => {
          setShowMove(null);
          setTimeout(step, SHOW_OFF_MS);
        }, SHOW_ON_MS);
      } else {
        showingRef.current = false;
        setPhase('player');
        setPlayerPos(0);
        setAiriMsg('Your turn! Do the moves in order! 💃');
        setAiriMood('encouraging');
      }
    };
    setTimeout(step, 600);
  }, []);

  // ── Start / next level ────────────────────────────────────────────────────

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSequence(lvl);
    setSequence(seq);
    setMistakes(0);
    setPlayerPos(0);
    setPhase('ready');
    setTimeout(() => playSequence(seq), 400);
  }, [playSequence]);

  // ── Player taps a move ────────────────────────────────────────────────────

  const handleTap = useCallback((moveId: MoveId) => {
    if (phase !== 'player') return;

    if (moveId === sequence[playerPos]) {
      // Correct tap — green flash
      setFlashMove(moveId);
      setTimeout(() => setFlashMove(null), 300);

      const next = playerPos + 1;
      if (next === sequence.length) {
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        setEarnedStars(stars);
        setTotalStars((t) => t + stars);
        setPhase('levelComplete');
        setAiriMsg(`Amazing dancing! ${stars === 3 ? '🌟🌟🌟' : stars === 2 ? '⭐⭐' : '⭐'}`);
        setAiriMood('celebrating');
        setFactIdx((f) => (f + 1) % AI_FACTS.length);
      } else {
        setPlayerPos(next);
      }
    } else {
      // Wrong tap — red flash
      setWrongMove(moveId);
      setTimeout(() => setWrongMove(null), 400);

      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setPhase('gameOver');
        setAiriMsg('Great moves! Every attempt teaches AI something new! 🤖💙');
        setAiriMood('encouraging');
      } else {
        setPhase('wrong');
        setAiriMsg(`Oops! Let me show you again! Keep dancing! 🎵`);
        setAiriMood('encouraging');
        setTimeout(() => playSequence(sequence), 1600);
      }
    }
  }, [phase, playerPos, sequence, mistakes, lives, playSequence]);

  const handleNextLevel = () => {
    if (level >= MAX_LEVEL) {
      setPhase('gameOver');
      setAiriMsg("You're a dance champion! AI motion-capture systems learned from dancers just like you! 🏆");
      setAiriMood('celebrating');
    } else {
      const next = level + 1;
      setLevel(next);
      startLevel(next);
      setAiriMsg(`Level ${next}! The sequence gets longer — you've got this! 🚀`);
      setAiriMood('happy');
    }
  };

  const handleRestart = () => {
    setLevel(1);
    setLives(MAX_LIVES);
    setTotalStars(0);
    setMistakes(0);
    setAiriMsg("Let's dance again! You can do it! 💪");
    setAiriMood('encouraging');
    startLevel(1);
  };

  // Start on mount
  useEffect(() => { startLevel(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived helpers ───────────────────────────────────────────────────────

  const currentShowMove = showMove ? MOVES.find((m) => m.id === showMove) : null;

  const getMoveButtonClass = (id: MoveId): string => {
    const base = 'flex flex-col items-center justify-center gap-1 rounded-2xl border-2 p-2 sm:p-3 transition-all duration-150 active:scale-90 select-none touch-manipulation';
    if (wrongMove === id) {
      return `${base} bg-red-400 border-red-500 scale-105 brightness-110 shadow-lg shadow-red-400/60`;
    }
    if (flashMove === id) {
      return `${base} bg-green-400 border-green-500 scale-125 brightness-125 shadow-lg shadow-green-400/60`;
    }
    if (phase === 'player') {
      return `${base} bg-white dark:bg-gray-800 border-green-300 dark:border-green-700 hover:scale-110 hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer`;
    }
    return `${base} bg-white/50 dark:bg-gray-800/50 border-green-200 dark:border-green-900 opacity-60 cursor-default`;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-emerald-100 dark:from-gray-900 dark:to-emerald-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-green-100 dark:border-green-900">
        <button
          onPointerUp={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-green-600 dark:text-green-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-green-700 dark:text-green-300">Dance Time 🕺</h2>
          <p className="text-xs text-green-500 dark:text-green-400 font-semibold">Level {level} / {MAX_LEVEL}</p>
        </div>

        <button
          type="button"
          onPointerUp={handleRestart}
          className="text-sm font-bold text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg px-3 py-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🔄 New
        </button>
      </div>

      {/* Lives + stars bar */}
      <div className="flex items-center justify-between px-5 py-2">
        <div className="flex gap-1 text-lg">
          {Array.from({ length: MAX_LIVES }, (_, i) => (
            <span key={i} className={i < lives ? 'opacity-100' : 'opacity-20'}>❤️</span>
          ))}
        </div>
        <div className="text-sm font-bold text-green-600 dark:text-green-400">
          ⭐ {totalStars}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pb-2">
        {sequence.map((_, i) => (
          <div
            key={i}
            className={`w-3.5 h-3.5 rounded-full border-2 border-white/60 transition-all duration-200 ${
              i < playerPos && phase === 'player'
                ? 'bg-green-500 opacity-100'
                : 'bg-green-300 opacity-40'
            }`}
          />
        ))}
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-start gap-4 px-4 pb-28 overflow-y-auto">

        {/* Showing phase — big move display */}
        {phase === 'showing' && (
          <div className="flex flex-col items-center justify-center gap-3 min-h-[180px]">
            {currentShowMove ? (
              <div className="flex flex-col items-center gap-2 animate-pulse">
                <span className="text-8xl leading-none drop-shadow-lg">{currentShowMove.emoji}</span>
                <p className="text-2xl font-extrabold text-green-700 dark:text-green-200 text-center tracking-wide">
                  {currentShowMove.instruction}
                </p>
              </div>
            ) : (
              <div className="min-h-[160px] flex items-center">
                <p className="text-lg font-extrabold text-green-500 dark:text-green-400 animate-pulse">
                  Get ready…
                </p>
              </div>
            )}
          </div>
        )}

        {/* Ready / wrong / player phase status label */}
        {(phase === 'ready' || phase === 'wrong') && (
          <p className="text-base font-extrabold text-green-600 dark:text-green-300 animate-pulse min-h-[40px] flex items-center">
            {phase === 'ready' ? 'Get ready…' : '😬 Watch again…'}
          </p>
        )}

        {phase === 'player' && (
          <p className="text-base font-extrabold text-green-700 dark:text-green-200 tracking-wide min-h-[40px] flex items-center">
            🎯 Your turn! Tap the moves in order!
          </p>
        )}

        {/* Level complete overlay */}
        {phase === 'levelComplete' && (
          <div className="text-center animate-bounce px-2">
            <div className="text-5xl mb-2">
              {'⭐'.repeat(earnedStars)}{'🖤'.repeat(3 - earnedStars)}
            </div>
            <p className="text-lg font-extrabold text-green-700 dark:text-green-200">Great dancing!</p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1 max-w-xs mx-auto leading-snug">
              {AI_FACTS[factIdx]}
            </p>
            <button
              onPointerUp={handleNextLevel}
              className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {level >= MAX_LEVEL ? '🎉 Finish!' : 'Next Level →'}
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {phase === 'gameOver' && (
          <div className="text-center px-2">
            <div className="text-6xl mb-3">{lives > 0 ? '🏆' : '🤖'}</div>
            <p className="text-xl font-extrabold text-green-700 dark:text-green-200">
              {lives > 0 ? "You're a dance champion!" : 'Keep practising!'}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Total stars: {'⭐'.repeat(Math.min(totalStars, 15))}
            </p>
            <button
              onPointerUp={handleRestart}
              className="mt-5 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Dance Again 🔄
            </button>
          </div>
        )}

        {/* Move grid (visible during showing + player phases) */}
        {(phase === 'showing' || phase === 'player' || phase === 'wrong') && (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-sm mt-2">
            {MOVES.map((move) => (
              <button
                key={move.id}
                onPointerDown={() => handleTap(move.id)}
                disabled={phase !== 'player'}
                aria-label={move.label}
                className={getMoveButtonClass(move.id)}
              >
                <span className={`leading-none transition-all duration-150 ${
                  showMove === move.id ? 'text-5xl' : 'text-3xl sm:text-4xl'
                }`}>
                  {move.emoji}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-green-700 dark:text-green-300 text-center leading-tight">
                  {move.label}
                </span>
              </button>
            ))}
          </div>
        )}

      </div>

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
