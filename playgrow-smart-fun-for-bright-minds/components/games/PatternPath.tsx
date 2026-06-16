/**
 * Pattern Path — "Train the Robot"
 *
 * AI-for-Good framing: Airi the robot is learning to recognise patterns so she
 * can help farmers spot sick crops, doctors read scans, and scientists forecast
 * weather. Kids teach Airi by copying colour sequences — mirroring how training
 * data teaches a real neural network.
 *
 * Game flow:
 *  ready → showing (Airi plays sequence) → player (child copies) →
 *  levelComplete → next level  |  wrong → replay  |  gameOver
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Zone } from '../../types';
import { Airi, AiriMood } from '../Airi';

interface PatternPathProps {
  zone: Zone;
  onClose: () => void;
}

// ── Colour palette ───────────────────────────────────────────────────────────

const COLORS = [
  { id: 'red',    bg: 'bg-red-400',    ring: 'ring-red-300',    glow: 'shadow-red-400/70',    label: 'Red',    hex: '#f87171' },
  { id: 'blue',   bg: 'bg-blue-400',   ring: 'ring-blue-300',   glow: 'shadow-blue-400/70',   label: 'Blue',   hex: '#60a5fa' },
  { id: 'green',  bg: 'bg-green-400',  ring: 'ring-green-300',  glow: 'shadow-green-400/70',  label: 'Green',  hex: '#4ade80' },
  { id: 'yellow', bg: 'bg-yellow-400', ring: 'ring-yellow-300', glow: 'shadow-yellow-400/70', label: 'Yellow', hex: '#facc15' },
  { id: 'purple', bg: 'bg-purple-400', ring: 'ring-purple-300', glow: 'shadow-purple-400/70', label: 'Purple', hex: '#c084fc' },
] as const;

type ColorId = (typeof COLORS)[number]['id'];
type Phase = 'ready' | 'showing' | 'player' | 'wrong' | 'levelComplete' | 'gameOver';

// ── AI-for-good facts shown on level completion ─────────────────────────────

const AI_FACTS = [
  'AI uses patterns like these to help farmers spot sick plants before they spread! 🌱',
  'Weather AI recognises cloud patterns to warn people about storms before they happen! ⛈️',
  'Doctors use AI pattern-matching to find diseases in X-rays and scans! 🏥',
  'AI watches patterns in ocean waves to track pollution and protect sea life! 🌊',
  'Traffic AI spots patterns in car flow so ambulances always have a clear path! 🚑',
  'AI learns from star patterns to help scientists discover new planets! 🚀',
];

// ── Helpers ─────────────────────────────────────────────────────────────────

const rand = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const generateSequence = (level: number): ColorId[] => {
  const colorIds = COLORS.map((c) => c.id) as ColorId[];
  const length = 2 + level; // level 1 = 3, level 2 = 4 …
  return Array.from({ length }, () => rand(colorIds) as ColorId);
};

// ── Component ────────────────────────────────────────────────────────────────

const MAX_LEVEL = 5;
const MAX_LIVES = 3;

export const PatternPath: React.FC<PatternPathProps> = ({ onClose }) => {
  const [level, setLevel]       = useState(1);
  const [sequence, setSequence] = useState<ColorId[]>([]);
  const [phase, setPhase]       = useState<Phase>('ready');
  const [playerPos, setPlayerPos]   = useState(0);
  const [activeColor, setActiveColor] = useState<ColorId | null>(null);
  const [flashColor, setFlashColor]   = useState<ColorId | null>(null); // player tap feedback
  const [lives, setLives]     = useState(MAX_LIVES);
  const [mistakes, setMistakes] = useState(0); // per level (for star rating)
  const [earnedStars, setEarnedStars] = useState(0);
  const [totalStars, setTotalStars]   = useState(0);
  const [airiMsg,  setAiriMsg]  = useState("Hi! I'm Airi 🤖 Watch my colour pattern, then copy it to help me learn!");
  const [airiMood, setAiriMood] = useState<AiriMood>('idle');
  const [factIdx,  setFactIdx]  = useState(0);

  const showingRef = useRef(false); // guard against double-fire in strict mode

  // ── Sequence playback ──────────────────────────────────────────────────────

  const playSequence = useCallback((seq: ColorId[]) => {
    if (showingRef.current) return;
    showingRef.current = true;
    setPhase('showing');
    setActiveColor(null);
    setAiriMsg('Watch carefully! 👀');
    setAiriMood('watching');

    let i = 0;
    const step = () => {
      if (i < seq.length) {
        setActiveColor(seq[i]);
        i++;
        setTimeout(() => {
          setActiveColor(null);
          setTimeout(step, 250);
        }, 700);
      } else {
        showingRef.current = false;
        setPhase('player');
        setPlayerPos(0);
        setAiriMsg("Your turn! Tap the same colours in order! 🎯");
        setAiriMood('encouraging');
      }
    };
    setTimeout(step, 600);
  }, []);

  // ── Start / next level ─────────────────────────────────────────────────────

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSequence(lvl);
    setSequence(seq);
    setMistakes(0);
    setPlayerPos(0);
    setPhase('ready');
    setTimeout(() => playSequence(seq), 400);
  }, [playSequence]);

  // ── Player taps a colour ───────────────────────────────────────────────────

  const handleTap = (colorId: ColorId) => {
    if (phase !== 'player') return;

    setFlashColor(colorId);
    setTimeout(() => setFlashColor(null), 300);

    if (colorId === sequence[playerPos]) {
      // Correct tap
      const next = playerPos + 1;
      if (next === sequence.length) {
        // Completed the sequence
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        setEarnedStars(stars);
        setTotalStars((t) => t + stars);
        setPhase('levelComplete');
        setAiriMsg(`Amazing! You taught me a new pattern! ${stars === 3 ? '🌟🌟🌟' : stars === 2 ? '⭐⭐' : '⭐'}`);
        setAiriMood('celebrating');
        setFactIdx((f) => (f + 1) % AI_FACTS.length);
      } else {
        setPlayerPos(next);
      }
    } else {
      // Wrong tap
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setPhase('gameOver');
        setAiriMsg("Good try! Every mistake helps me learn too! 🤖💙");
        setAiriMood('encouraging');
      } else {
        setPhase('wrong');
        setAiriMsg(`Oops! Let me show you again! ${newLives} ${newLives === 1 ? 'heart' : 'hearts'} left! 💪`);
        setAiriMood('encouraging');
        setTimeout(() => playSequence(sequence), 1600);
      }
    }
  };

  const handleNextLevel = () => {
    if (level >= MAX_LEVEL) {
      setPhase('gameOver');
      setAiriMsg(`You completed all ${MAX_LEVEL} levels! You're an AI trainer now! 🎉🤖`);
      setAiriMood('celebrating');
    } else {
      const next = level + 1;
      setLevel(next);
      startLevel(next);
      setAiriMsg(`Level ${next}! The pattern gets longer — I believe in you! 🚀`);
      setAiriMood('happy');
    }
  };

  const handleRestart = () => {
    setLevel(1);
    setLives(MAX_LIVES);
    setTotalStars(0);
    setMistakes(0);
    setAiriMsg("Let's try again! You can do it! 💪");
    setAiriMood('encouraging');
    startLevel(1);
  };

  // Start on mount
  useEffect(() => { startLevel(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────

  const isActive = (id: ColorId) => activeColor === id || flashColor === id;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">

      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-blue-100 dark:border-blue-900">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-blue-700 dark:text-blue-300">Train the Robot 🤖</h2>
          <p className="text-xs text-blue-500 dark:text-blue-400 font-semibold">Level {level} / {MAX_LEVEL}</p>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="text-sm font-bold text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🔄 New
        </button>
      </div>

      {/* Sequence indicator — dots matching sequence length */}
      <div className="flex justify-center gap-2 pt-3 pb-1">
        {sequence.map((colorId, i) => {
          const col = COLORS.find((c) => c.id === colorId)!;
          return (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-200 border-2 border-white/60 ${
                i < playerPos && phase === 'player'
                  ? col.bg + ' opacity-100'
                  : col.bg + ' opacity-30'
              }`}
            />
          );
        })}
      </div>

      {/* Main game area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-24">

        {/* Phase messages */}
        {phase === 'levelComplete' && (
          <div className="text-center animate-bounce">
            <div className="text-5xl mb-2">
              {'⭐'.repeat(earnedStars)}{'🖤'.repeat(3 - earnedStars)}
            </div>
            <p className="text-lg font-extrabold text-blue-700 dark:text-blue-200">Pattern learned!</p>
            <p className="text-sm text-blue-500 dark:text-blue-400 mt-1 max-w-xs mx-auto">{AI_FACTS[factIdx]}</p>
            <button
              onClick={handleNextLevel}
              className="mt-4 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {level >= MAX_LEVEL ? '🎉 Finish!' : 'Next Level →'}
            </button>
          </div>
        )}

        {phase === 'gameOver' && (
          <div className="text-center">
            <div className="text-6xl mb-3">{lives > 0 ? '🏆' : '🤖'}</div>
            <p className="text-xl font-extrabold text-blue-700 dark:text-blue-200">
              {lives > 0 ? `You trained me on all ${MAX_LEVEL} levels!` : 'Game Over'}
            </p>
            <p className="text-base text-blue-500 dark:text-blue-400 mt-1">Total stars: {'⭐'.repeat(Math.min(totalStars, 15))}</p>
            <button
              onClick={handleRestart}
              className="mt-5 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}

        {/* Status label during showing / player phases */}
        {(phase === 'showing' || phase === 'player' || phase === 'wrong') && (
          <p className="text-base font-extrabold text-blue-700 dark:text-blue-200 tracking-wide">
            {phase === 'showing' ? '👀 Watch the pattern…'
              : phase === 'wrong' ? '😬 Replaying…'
              : '🎯 Your turn! Tap the colours!'}
          </p>
        )}

        {phase === 'ready' && (
          <p className="text-base font-extrabold text-blue-600 dark:text-blue-300 animate-pulse">Get ready…</p>
        )}

        {/* Colour buttons */}
        <div className="grid grid-cols-5 gap-3 sm:gap-5">
          {COLORS.map((col) => (
            <button
              key={col.id}
              onClick={() => handleTap(col.id)}
              disabled={phase !== 'player'}
              aria-label={col.label}
              className={`
                w-14 h-14 sm:w-20 sm:h-20 rounded-full font-bold text-white text-sm
                border-4 border-white/40
                transition-all duration-150 active:scale-90
                ${col.bg}
                ${isActive(col.id)
                  ? `ring-4 ${col.ring} shadow-[0_0_24px_6px] ${col.glow} scale-125 brightness-125`
                  : phase === 'player' ? 'hover:scale-110 hover:brightness-110 cursor-pointer opacity-90' : 'opacity-60 cursor-default'}
              `}
            />
          ))}
        </div>

        {/* Colour name labels */}
        <div className="grid grid-cols-5 gap-3 sm:gap-5 -mt-3">
          {COLORS.map((col) => (
            <span key={col.id} className="text-[10px] sm:text-xs text-center font-bold text-blue-600 dark:text-blue-400 w-14 sm:w-20">
              {col.label}
            </span>
          ))}
        </div>

      </div>

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
