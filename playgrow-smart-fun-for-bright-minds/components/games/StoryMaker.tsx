/**
 * Story Maker — "Write with AI"
 *
 * Kids pick one card from each of three story columns (Who, Did What, Where)
 * to build a silly sentence. Airi narrates the resulting story and explains
 * how AI language models construct sentences from learned patterns.
 */

import React, { useState, useMemo } from 'react';
import { Airi, AiriMood } from '../Airi';

interface StoryMakerProps { onClose: () => void; }

// ── Story cards ────────────────────────────────────────────────────────────────

const WHO = [
  { id: 'robot',    emoji: '🤖', label: 'A robot' },
  { id: 'cat',      emoji: '🐱', label: 'A cat' },
  { id: 'scientist',emoji: '🧑‍🔬', label: 'A scientist' },
  { id: 'dragon',   emoji: '🐉', label: 'A dragon' },
  { id: 'astronaut',emoji: '👨‍🚀', label: 'An astronaut' },
  { id: 'child',    emoji: '🧒', label: 'A child' },
];

const DID = [
  { id: 'painted',  emoji: '🎨', label: 'painted a rainbow' },
  { id: 'danced',   emoji: '💃', label: 'danced in the rain' },
  { id: 'built',    emoji: '🔧', label: 'built a rocket' },
  { id: 'sang',     emoji: '🎵', label: 'sang to the stars' },
  { id: 'taught',   emoji: '📚', label: 'taught an AI' },
  { id: 'baked',    emoji: '🍰', label: 'baked a huge cake' },
];

const WHERE = [
  { id: 'moon',    emoji: '🌙', label: 'on the moon' },
  { id: 'ocean',   emoji: '🌊', label: 'under the ocean' },
  { id: 'forest',  emoji: '🌲', label: 'in a magic forest' },
  { id: 'city',    emoji: '🏙️', label: 'in a flying city' },
  { id: 'cloud',   emoji: '☁️', label: 'on a cloud' },
  { id: 'computer',emoji: '💻', label: 'inside a computer' },
];

// Pick N random items from an array
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const AI_FACTS = [
  "AI builds stories like this — learning which words go together from millions of books! 📚🤖",
  "Large language models (like the ones that power chatbots) mix words exactly this way! 🧠",
  "Every AI story starts with billions of human-written sentences as training data! 📖",
  "AI doesn't 'understand' stories yet — it just finds patterns. Pretty cool, right? 🤔",
  "Your story + Airi's fact = a tiny taste of how AI language works! ✨",
];

export const StoryMaker: React.FC<StoryMakerProps> = ({ onClose }) => {
  // Randomly pick 4 options per column each session
  const whoCards   = useMemo(() => pickRandom(WHO,   4), []);
  const didCards   = useMemo(() => pickRandom(DID,   4), []);
  const whereCards = useMemo(() => pickRandom(WHERE, 4), []);

  const [who,   setWho]   = useState<string | null>(null);
  const [did,   setDid]   = useState<string | null>(null);
  const [where, setWhere] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [factIdx, setFactIdx]   = useState(() => Math.floor(Math.random() * AI_FACTS.length));

  const whoCard   = whoCards.find(c => c.id === who);
  const didCard   = didCards.find(c => c.id === did);
  const whereCard = whereCards.find(c => c.id === where);

  const allPicked = !!who && !!did && !!where;
  const pickedCount = [who, did, where].filter(Boolean).length;

  const airiMsg = revealed
    ? AI_FACTS[factIdx]
    : pickedCount === 0
      ? "Pick one card from each column to build your story! 📖"
      : pickedCount === 1
        ? "Nice! Now pick what happened! 💃"
        : pickedCount === 2
          ? "Almost there! Where did it happen? 🌍"
          : "You picked them all! Tap 'Tell My Story!' to hear it! 🎉";

  const airiMood: import('../Airi').AiriMood = revealed ? 'celebrating' : pickedCount === 3 ? 'happy' : 'encouraging';

  const handleReveal = () => {
    setRevealed(true);
    setFactIdx(Math.floor(Math.random() * AI_FACTS.length));
  };

  const handleReset = () => {
    setWho(null); setDid(null); setWhere(null); setRevealed(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-900 dark:to-blue-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-blue-100 dark:border-blue-900 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-blue-600 dark:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1">
          ← Back
        </button>
        <h2 className="text-base sm:text-lg font-extrabold text-blue-700 dark:text-blue-300">Story Maker 📖</h2>
        <button type="button" onClick={handleReset}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 rounded-lg px-2 py-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:outline-none">
          🔄 New
        </button>
      </div>

      {/* Story sentence (revealed) */}
      {revealed && whoCard && didCard && whereCard && (
        <div className="mx-4 sm:mx-auto sm:w-full sm:max-w-2xl mt-3 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-200 dark:border-blue-700 text-center shrink-0 animate-[fadeIn_0.4s_ease]">
          <p className="text-2xl mb-1">
            {whoCard.emoji} {didCard.emoji} {whereCard.emoji}
          </p>
          <p className="text-base font-extrabold text-blue-700 dark:text-blue-200 leading-snug">
            {whoCard.label} {didCard.label} {whereCard.label}!
          </p>
        </div>
      )}

      {/* Card columns */}
      <div className="flex-1 overflow-y-auto w-full px-4 sm:px-8 py-4 pb-28">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto">

          {/* Column headers */}
          {(['Who?', 'Did what?', 'Where?'] as const).map(h => (
            <div key={h} className="text-center text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider pb-1">
              {h}
            </div>
          ))}

          {/* Who column */}
          <div className="flex flex-col gap-2">
            {whoCards.map(c => (
              <button key={c.id} type="button" onClick={() => { setWho(c.id); setRevealed(false); }}
                className={[
                  'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-center transition-all active:scale-95',
                  who === c.id
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 shadow-md scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:border-blue-300 hover:scale-102',
                ].join(' ')}>
                <span className="text-2xl sm:text-3xl leading-none">{c.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{c.label}</span>
              </button>
            ))}
          </div>

          {/* Did column */}
          <div className="flex flex-col gap-2">
            {didCards.map(c => (
              <button key={c.id} type="button" onClick={() => { setDid(c.id); setRevealed(false); }}
                className={[
                  'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-center transition-all active:scale-95',
                  did === c.id
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 shadow-md scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:border-blue-300',
                ].join(' ')}>
                <span className="text-2xl sm:text-3xl leading-none">{c.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{c.label}</span>
              </button>
            ))}
          </div>

          {/* Where column */}
          <div className="flex flex-col gap-2">
            {whereCards.map(c => (
              <button key={c.id} type="button" onClick={() => { setWhere(c.id); setRevealed(false); }}
                className={[
                  'flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-center transition-all active:scale-95',
                  where === c.id
                    ? 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 shadow-md scale-105'
                    : 'border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:border-blue-300',
                ].join(' ')}>
                <span className="text-2xl sm:text-3xl leading-none">{c.emoji}</span>
                <span className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 leading-tight">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reveal button */}
        {allPicked && !revealed && (
          <div className="flex justify-center mt-4">
            <button type="button" onClick={handleReveal}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-base rounded-2xl shadow-lg active:scale-95 transition-transform animate-bounce">
              📖 Tell My Story!
            </button>
          </div>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
