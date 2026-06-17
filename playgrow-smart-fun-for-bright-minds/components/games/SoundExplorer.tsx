/**
 * SoundExplorer — "What Made That Sound?"
 *
 * AI-for-Good framing: AI recognises sounds to monitor wildlife (counting bird
 * species by song), detect illegal logging (chainsaw sounds), and alert doctors
 * to abnormal heartbeats. Kids identify what made a sound from a vivid written
 * description — no audio required.
 *
 * Game flow:
 *  ready → round (10 rounds) → result → next | gameOver
 *  Score: 1 point per correct answer; wrong shows correct then continues
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface SoundExplorerProps {
  onClose: () => void;
}

// ── Data types ────────────────────────────────────────────────────────────────

interface SoundItem {
  description: string;
  options: [string, string, string, string];  // exactly 4
  answer: string;                              // must match one option exactly
}

type Phase = 'playing' | 'correct' | 'wrong' | 'gameOver';

// ── Sound pool (12 items — 10 picked randomly each game) ─────────────────────

const SOUND_POOL: SoundItem[] = [
  {
    description: 'A deep, slow WHOOOMP… WHOOOMP… like a giant\'s heartbeat, getting faster and louder 🫀',
    options: ['🥁 Drum', '🔔 Bell', '🎺 Trumpet', '🎸 Guitar'],
    answer: '🥁 Drum',
  },
  {
    description: 'A high CHEEP CHEEP CHEEP, fast and sharp, coming from a tree above you 🌳',
    options: ['🐦 Bird', '🐸 Frog', '🦗 Cricket', '🐝 Bee'],
    answer: '🐦 Bird',
  },
  {
    description: 'A long SSSSSSS — steady, like air slowly escaping through a tiny gap 🌬️',
    options: ['🐍 Snake', '🚂 Train', '💨 Wind', '🫧 Bubbles'],
    answer: '🐍 Snake',
  },
  {
    description: 'CRASH! BOOM! A huge rumble that shakes the windows and makes the sky flash ⚡',
    options: ['⛈️ Thunder', '🎆 Fireworks', '🏗️ Construction', '🌊 Waves'],
    answer: '⛈️ Thunder',
  },
  {
    description: 'A gentle pitter-patter on the roof, getting faster and louder, tap tap tap tap 🌧️',
    options: ['🌧️ Rain', '👣 Footsteps', '🍃 Leaves', '🖨️ Printer'],
    answer: '🌧️ Rain',
  },
  {
    description: 'A low, rhythmic BUZZ BUZZ BUZZ — small wings beating incredibly fast near a flower 🌸',
    options: ['🐝 Bee', '🦟 Mosquito', '🦋 Butterfly', '🐦 Bird'],
    answer: '🐝 Bee',
  },
  {
    description: 'A high-pitched SCREEEECH like metal scraping metal — then silence 🚆',
    options: ['🚆 Train Brakes', '🦅 Eagle', '🎻 Violin', '⚙️ Machine'],
    answer: '🚆 Train Brakes',
  },
  {
    description: 'A gentle TRICKLE TRICKLE TRICKLE — like a tiny river finding its way over stones 💧',
    options: ['💧 Stream', '☔ Rain', '🚿 Shower', '🍶 Pouring'],
    answer: '💧 Stream',
  },
  {
    description: 'RIBBIT RIBBIT — a deep, wet croak from somewhere near the water at night 🌙',
    options: ['🐸 Frog', '🦎 Lizard', '🐢 Turtle', '🦟 Mosquito'],
    answer: '🐸 Frog',
  },
  {
    description: 'A sudden POP POP POP POP — rapid bursts of light and colour filling the night sky 🌠',
    options: ['🎆 Fireworks', '🔫 Popcorn', '⚡ Lightning', '🎈 Balloons'],
    answer: '🎆 Fireworks',
  },
  {
    description: 'WHOOOOSH — a powerful rush of air that bends the trees and carries loose leaves away 🍂',
    options: ['💨 Wind', '🌊 Ocean', '✈️ Aeroplane', '🚁 Helicopter'],
    answer: '💨 Wind',
  },
  {
    description: 'A soft CRUNCH CRUNCH CRUNCH with each step — like walking on thousands of tiny crispy things 🍂',
    options: ['🍂 Dry Leaves', '🌨️ Snow', '🥜 Gravel', '🍪 Biscuits'],
    answer: '🍂 Dry Leaves',
  },
];

// ── AI facts shown after correct answers ──────────────────────────────────────

const AI_FACTS = [
  'AI listens to rainforest sounds 24/7 to count bird species and detect illegal chainsaws — protecting wildlife! 🌳🤖',
  'Doctors use AI to listen to heartbeats and detect problems that human ears might miss! ❤️',
  'AI recognises whale songs underwater to track migration routes and protect them from ships! 🐋',
  'Scientists used AI to discover that elephants communicate with sounds too low for humans to hear! 🐘',
  'AI microphones in forests can detect a chainsaw from 1 km away and alert rangers instantly! 🔊🚨',
  'AI analysed thousands of hours of ocean recordings and identified 12 new fish species by their calls alone! 🐟',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TOTAL_ROUNDS = 10;

// ── Component ─────────────────────────────────────────────────────────────────

export const SoundExplorer: React.FC<SoundExplorerProps> = ({ onClose }) => {
  const [rounds]           = useState<SoundItem[]>(() => shuffle(SOUND_POOL).slice(0, TOTAL_ROUNDS));
  const [roundIdx, setRoundIdx]     = useState(0);
  const [phase, setPhase]           = useState<Phase>('playing');
  const [score, setScore]           = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [factIdx, setFactIdx]       = useState(0);
  const [airiMsg, setAiriMsg]       = useState("Welcome to Sound Explorer! 🎧 I'll describe a sound — can you guess what made it? Just like AI listens to the world!");
  const [airiMood, setAiriMood]     = useState<AiriMood>('happy');

  const currentSound = rounds[roundIdx];

  const startRound = useCallback((idx: number) => {
    setRoundIdx(idx);
    setPhase('playing');
    setSelectedAnswer(null);
    setAiriMsg('Close your eyes and imagine this sound… 🎧');
    setAiriMood('thinking');
  }, []);

  useEffect(() => {
    startRound(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer: string) => {
    if (phase !== 'playing') return;
    setSelectedAnswer(answer);

    if (answer === currentSound.answer) {
      setScore((s) => s + 1);
      setFactIdx((f) => (f + 1) % AI_FACTS.length);
      setPhase('correct');
      setAiriMsg(`Perfect! 🎉 ${AI_FACTS[factIdx]}`);
      setAiriMood('celebrating');
    } else {
      setPhase('wrong');
      setAiriMsg(`Not quite! The answer was ${currentSound.answer}. AI learns from every sound — so do you! 🤖`);
      setAiriMood('encouraging');
    }
  };

  const handleNext = () => {
    const next = roundIdx + 1;
    if (next >= TOTAL_ROUNDS) {
      const pct = Math.round((score / TOTAL_ROUNDS) * 100);
      setPhase('gameOver');
      if (pct >= 90) {
        setAiriMsg(`Incredible! ${score}/${TOTAL_ROUNDS} — you have ears like an AI sound system! 🏆🎧`);
        setAiriMood('celebrating');
      } else if (pct >= 60) {
        setAiriMsg(`Well done! ${score}/${TOTAL_ROUNDS} — great sound detection! Keep listening! 🎵`);
        setAiriMood('happy');
      } else {
        setAiriMsg(`${score}/${TOTAL_ROUNDS} — every sound is a chance to learn, just like AI training! 💪`);
        setAiriMood('encouraging');
      }
    } else {
      startRound(next);
    }
  };

  const handleRestart = () => {
    setScore(0);
    setFactIdx(0);
    startRound(0);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const scorePercentage = TOTAL_ROUNDS > 0 ? (score / TOTAL_ROUNDS) * 100 : 0;

  const getScoreMedal = () => {
    if (scorePercentage >= 90) return '🏆';
    if (scorePercentage >= 70) return '🥇';
    if (scorePercentage >= 50) return '🥈';
    return '🥉';
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-yellow-200 dark:border-indigo-900">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 dark:text-indigo-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-indigo-700 dark:text-indigo-300">Sound Explorer 🎧</h2>
          <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold">
            {phase === 'gameOver' ? 'Complete!' : `Round ${roundIdx + 1} / ${TOTAL_ROUNDS}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">✅ {score}</span>
          <button
            onClick={handleRestart}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-700 rounded-lg px-3 py-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {phase !== 'gameOver' && (
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 transition-all duration-500"
            style={{ width: `${((roundIdx) / TOTAL_ROUNDS) * 100}%` }}
          />
        </div>
      )}

      {/* Game Over screen */}
      {phase === 'gameOver' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 pb-28">
          <div className="text-7xl animate-bounce">{getScoreMedal()}</div>
          <h3 className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-200 text-center">
            Exploration Complete!
          </h3>

          {/* Score display */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 px-8 py-5 text-center shadow-md">
            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-300">
              {score} <span className="text-2xl text-gray-400 font-normal">/ {TOTAL_ROUNDS}</span>
            </p>
            <p className="text-base font-semibold text-teal-600 dark:text-teal-400 mt-1">
              {scorePercentage >= 90 ? 'Sound Genius! 🎧'
                : scorePercentage >= 70 ? 'Great Listener! 🎵'
                : scorePercentage >= 50 ? 'Good Explorer! 🌟'
                : 'Keep Listening! 💪'}
            </p>
          </div>

          {/* Score dots */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
            {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  i < score
                    ? 'bg-teal-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                }`}
              >
                {i < score ? '✓' : '✗'}
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
            Real AI systems listen to sounds day and night to protect wildlife and save lives — just like you explored sounds today! 🤖🌍
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Play Again 🔄
          </button>
        </div>
      )}

      {/* Main playing area */}
      {phase !== 'gameOver' && (
        <div className="flex-1 flex flex-col gap-5 px-4 pt-5 pb-28 overflow-y-auto">

          {/* Sound description card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-700 shadow-md px-5 py-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                <span className="text-lg">🔊</span>
              </div>
              <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                Listen with your imagination…
              </p>
            </div>
            <p className="text-base font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
              {currentSound.description}
            </p>
          </div>

          {/* Answer options */}
          {phase === 'playing' && (
            <div className="grid grid-cols-2 gap-3">
              {currentSound.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className="px-3 py-4 bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:scale-105 active:scale-95 transition-all shadow-sm text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Correct result */}
          {phase === 'correct' && (
            <div className="bg-teal-50 dark:bg-teal-900/30 rounded-2xl border-2 border-teal-300 dark:border-teal-700 px-5 py-5 flex flex-col items-center gap-3 text-center">
              <div className="text-4xl">✅</div>
              <p className="text-lg font-extrabold text-teal-700 dark:text-teal-200">
                {selectedAnswer}
              </p>
              <p className="text-xs text-teal-600 dark:text-teal-400 font-semibold max-w-xs">
                {AI_FACTS[factIdx]}
              </p>
              <button
                onClick={handleNext}
                className="mt-1 px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-extrabold text-sm rounded-xl shadow active:scale-95 transition-transform"
              >
                {roundIdx + 1 >= TOTAL_ROUNDS ? '🏁 See Score' : 'Next Sound →'}
              </button>
            </div>
          )}

          {/* Wrong result */}
          {phase === 'wrong' && (
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-300 dark:border-amber-700 px-5 py-5 flex flex-col items-center gap-3 text-center">
              <div className="text-4xl">🤔</div>
              <div>
                <p className="text-sm text-red-600 dark:text-red-400 font-semibold">
                  You chose: {selectedAnswer}
                </p>
                <p className="text-base font-extrabold text-gray-800 dark:text-gray-100 mt-1">
                  Answer: {currentSound.answer}
                </p>
              </div>
              <button
                onClick={handleNext}
                className="mt-1 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm rounded-xl shadow active:scale-95 transition-transform"
              >
                {roundIdx + 1 >= TOTAL_ROUNDS ? '🏁 See Score' : 'Next Sound →'}
              </button>
            </div>
          )}

        </div>
      )}

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
