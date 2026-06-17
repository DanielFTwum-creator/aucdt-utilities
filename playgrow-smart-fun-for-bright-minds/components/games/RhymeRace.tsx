/**
 * RhymeRace — "Sound Match"
 *
 * AI-for-Good framing: AI learns phonics (how words sound) to help teach children
 * to read in any language — even languages with no writing system. Kids reinforce
 * this by racing to find rhyming pairs, mirroring how AI phonics models map
 * sound patterns to build reading skills.
 *
 * Game flow:
 *  ready → round (target shown, 4 options) → reveal (correct answer shown) →
 *  next round | gameOver after 8 rounds
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface RhymeRaceProps {
  onClose: () => void;
}

type Phase = 'ready' | 'round' | 'reveal' | 'gameOver';

// ── Rhyme pool ───────────────────────────────────────────────────────────────

interface RhymePair {
  target: string;
  targetEmoji: string;
  answer: string;
  answerEmoji: string;
  distractors: { word: string; emoji: string }[];
  explanation: string;
}

const RHYME_POOL: RhymePair[] = [
  { target: 'cat',   targetEmoji: '🐱', answer: 'hat',   answerEmoji: '🎩', distractors: [{ word: 'dog', emoji: '🐶' }, { word: 'fish', emoji: '🐟' }, { word: 'car', emoji: '🚗' }], explanation: '"cat" and "hat" both end in -AT!' },
  { target: 'moon',  targetEmoji: '🌙', answer: 'spoon', answerEmoji: '🥄', distractors: [{ word: 'star', emoji: '⭐' }, { word: 'lamp', emoji: '💡' }, { word: 'book', emoji: '📚' }], explanation: '"moon" and "spoon" both end in -OON!' },
  { target: 'tree',  targetEmoji: '🌳', answer: 'bee',   answerEmoji: '🐝', distractors: [{ word: 'frog', emoji: '🐸' }, { word: 'rock', emoji: '🪨' }, { word: 'cup', emoji: '🥤' }], explanation: '"tree" and "bee" both end in the -EE sound!' },
  { target: 'rain',  targetEmoji: '🌧️', answer: 'train', answerEmoji: '🚂', distractors: [{ word: 'snow', emoji: '❄️' }, { word: 'wind', emoji: '💨' }, { word: 'sun', emoji: '☀️' }], explanation: '"rain" and "train" both end in -AIN!' },
  { target: 'bear',  targetEmoji: '🐻', answer: 'chair', answerEmoji: '🪑', distractors: [{ word: 'wolf', emoji: '🐺' }, { word: 'bird', emoji: '🐦' }, { word: 'fish', emoji: '🐟' }], explanation: '"bear" and "chair" both have the -AIR sound!' },
  { target: 'cake',  targetEmoji: '🎂', answer: 'lake',  answerEmoji: '🏞️', distractors: [{ word: 'pie', emoji: '🥧' }, { word: 'soup', emoji: '🍲' }, { word: 'rice', emoji: '🍚' }], explanation: '"cake" and "lake" both end in -AKE!' },
  { target: 'frog',  targetEmoji: '🐸', answer: 'log',   answerEmoji: '🪵', distractors: [{ word: 'duck', emoji: '🦆' }, { word: 'ant', emoji: '🐜' }, { word: 'star', emoji: '⭐' }], explanation: '"frog" and "log" both end in -OG!' },
  { target: 'light', targetEmoji: '💡', answer: 'night', answerEmoji: '🌙', distractors: [{ word: 'day', emoji: '☀️' }, { word: 'lamp', emoji: '🔦' }, { word: 'fire', emoji: '🔥' }], explanation: '"light" and "night" both end in -IGHT!' },
  { target: 'ring',  targetEmoji: '💍', answer: 'sing',  answerEmoji: '🎵', distractors: [{ word: 'crown', emoji: '👑' }, { word: 'belt', emoji: '👛' }, { word: 'bag', emoji: '👜' }], explanation: '"ring" and "sing" both end in -ING!' },
  { target: 'boat',  targetEmoji: '⛵', answer: 'coat',  answerEmoji: '🧥', distractors: [{ word: 'ship', emoji: '🚢' }, { word: 'plane', emoji: '✈️' }, { word: 'car', emoji: '🚗' }], explanation: '"boat" and "coat" both end in -OAT!' },
  { target: 'mouse', targetEmoji: '🐭', answer: 'house', answerEmoji: '🏠', distractors: [{ word: 'cat', emoji: '🐱' }, { word: 'rat', emoji: '🐀' }, { word: 'dog', emoji: '🐶' }], explanation: '"mouse" and "house" both end in -OUSE!' },
  { target: 'blue',  targetEmoji: '🔵', answer: 'glue',  answerEmoji: '🫧', distractors: [{ word: 'red', emoji: '🔴' }, { word: 'green', emoji: '🟢' }, { word: 'pink', emoji: '🩷' }], explanation: '"blue" and "glue" both end in the -OO sound!' },
  { target: 'plane', targetEmoji: '✈️', answer: 'mane',  answerEmoji: '🦁', distractors: [{ word: 'boat', emoji: '⛵' }, { word: 'bus', emoji: '🚌' }, { word: 'train', emoji: '🚂' }], explanation: '"plane" and "mane" both end in -ANE!' },
  { target: 'bee',   targetEmoji: '🐝', answer: 'key',   answerEmoji: '🔑', distractors: [{ word: 'ant', emoji: '🐜' }, { word: 'fly', emoji: '🪰' }, { word: 'bug', emoji: '🐛' }], explanation: '"bee" and "key" both have the -EE sound!' },
  { target: 'clock', targetEmoji: '🕐', answer: 'sock',  answerEmoji: '🧦', distractors: [{ word: 'time', emoji: '⏰' }, { word: 'bell', emoji: '🔔' }, { word: 'ring', emoji: '💍' }], explanation: '"clock" and "sock" both end in -OCK!' },
  { target: 'whale', targetEmoji: '🐳', answer: 'tail',  answerEmoji: '🦊', distractors: [{ word: 'fish', emoji: '🐟' }, { word: 'crab', emoji: '🦀' }, { word: 'wave', emoji: '🌊' }], explanation: '"whale" and "tail" both have the -AIL sound!' },
];

// ── AI facts ─────────────────────────────────────────────────────────────────

const AI_FACTS = [
  'AI learned phonics from millions of children\'s books to help kids learn to read! 📖',
  'AI can now teach reading in languages that have never been written down before! 🌍',
  'Speech AI helps children with hearing difficulties learn the sounds of words! 👂',
  'AI phonics tools have helped millions of children in remote villages learn to read! 🏡',
  'AI can spot when a child struggles with a sound and give them extra practice automatically! 🤖',
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRounds(pool: RhymePair[], count: number): RhymePair[] {
  return shuffle(pool).slice(0, count);
}

const ROUNDS = 8;
const SPEED_THRESHOLD_MS = 3000;

interface OptionItem { word: string; emoji: string; isAnswer: boolean }

// ── Component ─────────────────────────────────────────────────────────────────

export const RhymeRace: React.FC<RhymeRaceProps> = ({ onClose }) => {
  const [rounds, setRounds]         = useState<RhymePair[]>(() => pickRounds(RHYME_POOL, ROUNDS));
  const [roundIdx, setRoundIdx]     = useState(0);
  const [phase, setPhase]           = useState<Phase>('ready');
  const [options, setOptions]       = useState<OptionItem[]>([]);
  const [chosenIdx, setChosenIdx]   = useState<number | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);
  const [wasFast, setWasFast]       = useState(false);
  const [roundStars, setRoundStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [roundStartMs, setRoundStartMs] = useState(0);
  const [airiMsg,  setAiriMsg]   = useState("Hi! I'm Airi 🤖 Find the word that rhymes — and be fast for a speed star ⚡!");
  const [airiMood, setAiriMood]  = useState<AiriMood>('idle');
  const factIdxRef = useRef(0);

  const currentRound = rounds[roundIdx];

  // ── Build options for the current round ─────────────────────────────────

  const buildOptions = useCallback((round: RhymePair): OptionItem[] => {
    const answer: OptionItem = { word: round.answer, emoji: round.answerEmoji, isAnswer: true };
    const distractors: OptionItem[] = round.distractors.map((d) => ({ ...d, isAnswer: false }));
    return shuffle([answer, ...distractors]);
  }, []);

  // ── Start round ──────────────────────────────────────────────────────────

  const startRound = useCallback((idx: number, rds: RhymePair[]) => {
    const round = rds[idx];
    setOptions(buildOptions(round));
    setChosenIdx(null);
    setWasCorrect(null);
    setWasFast(false);
    setRoundStars(0);
    setPhase('round');
    setRoundStartMs(Date.now());
    setAiriMsg(`Round ${idx + 1} of ${ROUNDS} — what rhymes with "${round.target}"? 🎯`);
    setAiriMood('watching');
  }, [buildOptions]);

  // Start on mount
  useEffect(() => {
    const t = setTimeout(() => startRound(0, rounds), 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle option tap ────────────────────────────────────────────────────

  const handleOptionTap = (idx: number) => {
    if (phase !== 'round' || chosenIdx !== null) return;

    const elapsed = Date.now() - roundStartMs;
    const fast = elapsed < SPEED_THRESHOLD_MS;
    const correct = options[idx].isAnswer;
    const stars = correct ? (fast ? 2 : 1) : 0;
    const fact = AI_FACTS[factIdxRef.current % AI_FACTS.length];

    setChosenIdx(idx);
    setWasCorrect(correct);
    setWasFast(fast && correct);
    setRoundStars(stars);
    setTotalStars((t) => t + stars);
    setPhase('reveal');

    if (correct && fast) {
      setAiriMsg(`⚡ Speed star! "${currentRound.answer}" rhymes with "${currentRound.target}"! ${fact}`);
      setAiriMood('celebrating');
    } else if (correct) {
      setAiriMsg(`Correct! ${currentRound.explanation} ${fact}`);
      setAiriMood('happy');
      factIdxRef.current++;
    } else {
      const correctWord = options.find((o) => o.isAnswer)!.word;
      setAiriMsg(`Almost! "${correctWord}" was the rhyme — ${currentRound.explanation}`);
      setAiriMood('encouraging');
    }
  };

  // ── Next round ────────────────────────────────────────────────────────────

  const handleNext = () => {
    const next = roundIdx + 1;
    if (next >= ROUNDS) {
      setPhase('gameOver');
      setAiriMsg(`Rhyme Race complete! You scored ${totalStars} stars! AI learns phonics exactly like this! 🤖🎉`);
      setAiriMood('celebrating');
    } else {
      setRoundIdx(next);
      startRound(next, rounds);
    }
  };

  const handleRestart = () => {
    const newRounds = pickRounds(RHYME_POOL, ROUNDS);
    setRounds(newRounds);
    setRoundIdx(0);
    setTotalStars(0);
    factIdxRef.current = 0;
    setAiriMsg("New game! Find the rhymes! 🎵");
    setAiriMood('encouraging');
    setTimeout(() => startRound(0, newRounds), 300);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-orange-50 to-amber-100 dark:from-gray-900 dark:to-orange-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-orange-100 dark:border-orange-900">
        <button
          onPointerDown={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-orange-700 dark:text-orange-300">Rhyme Race 🎵</h2>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">
            {phase !== 'gameOver' ? `Round ${roundIdx + 1} / ${ROUNDS}` : 'Game Over'}
          </p>
        </div>
        <button
          onPointerDown={handleRestart}
          className="text-sm font-bold text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 rounded-lg px-3 py-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🔄 New
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-orange-100 dark:bg-orange-900/30">
        <div
          className="h-full bg-orange-400 dark:bg-orange-500 transition-all duration-500"
          style={{ width: `${(phase === 'gameOver' ? ROUNDS : roundIdx) / ROUNDS * 100}%` }}
        />
      </div>

      {/* Stars total */}
      <div className="flex justify-center gap-1 pt-2 pb-1">
        <span className="text-sm font-bold text-orange-600 dark:text-orange-400">Stars: {totalStars}</span>
        {wasFast && phase === 'reveal' && wasCorrect && (
          <span className="text-sm font-bold text-yellow-500 animate-bounce ml-2">⚡ Speed bonus!</span>
        )}
      </div>

      {/* Game content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 pb-28">

        {/* Round phase */}
        {(phase === 'round' || phase === 'reveal') && (
          <>
            {/* Target word */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-7xl drop-shadow-lg animate-pulse">{currentRound.targetEmoji}</div>
              <div className="bg-orange-500 dark:bg-orange-600 text-white font-extrabold text-3xl px-8 py-3 rounded-2xl shadow-lg tracking-wide">
                {currentRound.target}
              </div>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">What rhymes with this word?</p>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {options.map((opt, i) => {
                let style = 'bg-white dark:bg-gray-800 border-orange-200 dark:border-orange-700 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/30 active:scale-95';
                if (phase === 'reveal') {
                  if (opt.isAnswer) {
                    style = 'bg-green-100 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-300 font-extrabold';
                  } else if (i === chosenIdx) {
                    style = 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-600 dark:text-red-300';
                  } else {
                    style = 'bg-white dark:bg-gray-800 border-orange-100 dark:border-orange-900 text-gray-400 dark:text-gray-500 opacity-60';
                  }
                }
                return (
                  <button
                    key={i}
                    onPointerDown={() => handleOptionTap(i)}
                    disabled={phase === 'reveal'}
                    className={`flex flex-col items-center gap-1 px-3 py-4 rounded-2xl border-2 font-bold text-lg transition-all ${style}`}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span>{opt.word}</span>
                  </button>
                );
              })}
            </div>

            {/* Stars earned this round + next button */}
            {phase === 'reveal' && (
              <div className="flex flex-col items-center gap-3">
                {roundStars > 0 ? (
                  <div className="text-3xl animate-bounce">
                    {'⭐'.repeat(roundStars)}
                    {wasFast && <span className="ml-1">⚡</span>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Better luck next round!</p>
                )}
                <button
                  onPointerDown={handleNext}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                  {roundIdx < ROUNDS - 1 ? 'Next Round →' : '🎉 Finish!'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Game over */}
        {phase === 'gameOver' && (
          <div className="text-center">
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-200 mb-1">Rhyme Race Complete!</p>
            <p className="text-base text-orange-500 dark:text-orange-400 mb-1">
              Total stars: {'⭐'.repeat(Math.min(totalStars, 16))}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs mx-auto">
              AI phonics models learn exactly like this — matching sound patterns across millions of words! 🤖🎵
            </p>
            <button
              onPointerDown={handleRestart}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}

        {/* Ready / loading */}
        {phase === 'ready' && (
          <p className="text-lg font-extrabold text-orange-600 dark:text-orange-300 animate-pulse">Get ready to rhyme! 🎵</p>
        )}
      </div>

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
