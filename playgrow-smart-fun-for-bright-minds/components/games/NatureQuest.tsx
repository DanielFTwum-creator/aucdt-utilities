/**
 * NatureQuest — "Spot the Species"
 *
 * AI-for-Good framing: AI identifies species from photos — apps like iNaturalist
 * use AI to help scientists track wildlife, spot invasive species, and monitor
 * biodiversity. Kids experience this by identifying animals and plants from clues.
 *
 * Game flow:
 *  ready → clue (reveal 1-3 clues) → guessing → result → next round | gameOver
 *  Stars: correct on clue 1 = 3⭐, clue 2 = 2⭐, clue 3 = 1⭐, all wrong = 0
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface NatureQuestProps {
  onClose: () => void;
}

// ── Data types ────────────────────────────────────────────────────────────────

interface Creature {
  name: string;
  clues: [string, string, string];
  options: string[];    // exactly 4, one matches name
  emoji: string;
}

type Phase = 'ready' | 'playing' | 'correct' | 'wrong' | 'gameOver';

// ── Creature pool ─────────────────────────────────────────────────────────────

const CREATURE_POOL: Creature[] = [
  {
    name: 'African Elephant',
    emoji: '🐘',
    clues: [
      'I am the largest land animal on Earth 🌍',
      'I use my nose like a hand to pick up food 🌿',
      'I never forget — I can remember friends for decades 💧',
    ],
    options: ['Lion', 'African Elephant', 'Hippo', 'Giraffe'],
  },
  {
    name: 'Baobab Tree',
    emoji: '🌳',
    clues: [
      'I can live for over 3,000 years 🌳',
      "People call me the 'upside-down tree' because my branches look like roots 🌿",
      'Animals eat my fruit and shelter in my hollow trunk 🐘',
    ],
    options: ['Baobab Tree', 'Palm Tree', 'Acacia', 'Mango Tree'],
  },
  {
    name: 'Clownfish',
    emoji: '🐠',
    clues: [
      'I live among the stinging tentacles of sea anemones without getting hurt 🌊',
      'My bright orange and white stripes warn other fish to stay away 🎨',
      'I am born male — the largest in my group can change to become female 🔄',
    ],
    options: ['Clownfish', 'Starfish', 'Seahorse', 'Parrotfish'],
  },
  {
    name: 'Snow Leopard',
    emoji: '🐆',
    clues: [
      'I live high in the mountains of Central Asia where few animals survive ❄️',
      'My long, thick tail helps me balance on steep cliffs and keeps me warm 🏔️',
      'I am so rare that fewer than 7,000 of us exist in the wild 🌍',
    ],
    options: ['Snow Leopard', 'Cheetah', 'Lynx', 'Tiger'],
  },
  {
    name: 'Humpback Whale',
    emoji: '🐋',
    clues: [
      'I sing the longest and most complex songs in the animal kingdom 🎵',
      'I leap completely out of the ocean in a behaviour called breaching 🌊',
      'I travel up to 16,000 km every year — the longest migration of any mammal 🗺️',
    ],
    options: ['Humpback Whale', 'Blue Whale', 'Orca', 'Dolphin'],
  },
  {
    name: 'Venus Flytrap',
    emoji: '🌿',
    clues: [
      'I am a plant that eats insects to get nutrients from poor soil 🪲',
      'My leaves snap shut in under half a second — one of the fastest movements in nature ⚡',
      'I grow naturally only in the swamps of North and South Carolina 🌱',
    ],
    options: ['Venus Flytrap', 'Cactus', 'Sundew Plant', 'Pitcher Plant'],
  },
  {
    name: 'Axolotl',
    emoji: '🦎',
    clues: [
      'I am an amphibian that keeps my gills and stays in water my whole life 🌊',
      'I can regrow lost limbs, eyes, and even parts of my heart and brain 🔬',
      'I am found only in one lake near Mexico City and am critically endangered 🇲🇽',
    ],
    options: ['Axolotl', 'Salamander', 'Mudpuppy', 'Newt'],
  },
  {
    name: 'Monarch Butterfly',
    emoji: '🦋',
    clues: [
      'I travel up to 4,800 km every autumn from Canada to Mexico 🗺️',
      'My bright orange and black wings warn predators that I taste terrible 🍊',
      'Scientists use AI to track thousands of us in real time during migration 🤖',
    ],
    options: ['Monarch Butterfly', 'Swallowtail', 'Painted Lady', 'Viceroy'],
  },
  {
    name: 'Mangrove Tree',
    emoji: '🌴',
    clues: [
      'I grow in saltwater along tropical coastlines where other trees cannot survive 🌊',
      'My tangled roots rise above the water like a city on stilts 🏙️',
      'I shelter young fish and protect coastlines from storm waves 🐟',
    ],
    options: ['Mangrove Tree', 'Coconut Palm', 'Banyan Tree', 'Bamboo'],
  },
  {
    name: 'Poison Dart Frog',
    emoji: '🐸',
    clues: [
      'My brilliant colours — red, blue, yellow — are a warning, not a costume 🎨',
      'Indigenous hunters used my skin secretions to tip blowpipe darts 🏹',
      'I am one of the most toxic animals on Earth, yet I am just 5 cm long 🌿',
    ],
    options: ['Poison Dart Frog', 'Tree Frog', 'Bullfrog', 'Salamander'],
  },
  {
    name: 'Giant Panda',
    emoji: '🐼',
    clues: [
      'I eat up to 14 kg of bamboo every day just to get enough energy 🎋',
      'My distinctive black-and-white markings help me hide in snowy forests 🌨️',
      'AI cameras in Chinese forests help rangers find and protect me 24/7 📷',
    ],
    options: ['Giant Panda', 'Red Panda', 'Polar Bear', 'Sun Bear'],
  },
  {
    name: 'Great White Shark',
    emoji: '🦈',
    clues: [
      'I can detect a single drop of blood in 100 litres of water 💧',
      'My teeth fall out constantly — I can grow over 50,000 teeth in a lifetime 🦷',
      'AI-powered beach cameras now recognise me to keep swimmers safe 🤖',
    ],
    options: ['Great White Shark', 'Bull Shark', 'Hammerhead', 'Whale Shark'],
  },
];

// ── AI facts shown after correct answers ──────────────────────────────────────

const AI_FACTS = [
  'AI identified over 50,000 species from photos in one year — helping scientists track animals that humans rarely see! 🔭🤖',
  'AI-powered apps let anyone become a wildlife scientist just by taking a photo of a plant or animal! 📱🌿',
  'AI helped discover 3 new species of frogs in the Amazon by analysing sounds no human had categorised before! 🐸',
  'iNaturalist uses AI to process over 1 million species observations every week from citizen scientists! 🌍',
  'AI drones scan coral reefs and instantly identify bleached areas to guide conservation teams! 🐠',
];

const TOTAL_ROUNDS = 8;

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRounds(pool: Creature[], count: number): Creature[] {
  return shuffle(pool).slice(0, count);
}

// ── Component ─────────────────────────────────────────────────────────────────

export const NatureQuest: React.FC<NatureQuestProps> = ({ onClose }) => {
  const [rounds]         = useState<Creature[]>(() => pickRounds(CREATURE_POOL, TOTAL_ROUNDS));
  const [roundIdx, setRoundIdx]     = useState(0);
  const [cluesRevealed, setCluesRevealed] = useState(1);
  const [phase, setPhase]           = useState<Phase>('playing');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [totalStars, setTotalStars] = useState(0);
  const [roundStars, setRoundStars] = useState(0);
  const [factIdx, setFactIdx]       = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [airiMsg, setAiriMsg]       = useState("Welcome to NatureQuest! 🌿 Read the clues and guess the animal or plant. Fewer clues = more stars!");
  const [airiMood, setAiriMood]     = useState<AiriMood>('happy');

  const currentCreature = rounds[roundIdx];

  // Shuffle options when creature changes
  useEffect(() => {
    if (currentCreature) {
      setShuffledOptions(shuffle(currentCreature.options));
    }
  }, [roundIdx, currentCreature]);

  const startRound = useCallback((idx: number) => {
    setRoundIdx(idx);
    setCluesRevealed(1);
    setPhase('playing');
    setSelectedAnswer(null);
    setAiriMsg('Read the clue carefully… can you guess what I am? 🔍');
    setAiriMood('thinking');
  }, []);

  useEffect(() => {
    startRound(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRevealClue = () => {
    if (cluesRevealed < 3) {
      const next = cluesRevealed + 1;
      setCluesRevealed(next);
      setAiriMsg(next === 2
        ? 'Here is another clue! Still thinking? 🤔'
        : 'One more clue — this is the last one! 💭');
      setAiriMood('encouraging');
    }
  };

  const handleGuess = (answer: string) => {
    if (phase !== 'playing') return;
    setSelectedAnswer(answer);

    const correct = answer === currentCreature.name;
    const stars = correct ? (cluesRevealed === 1 ? 3 : cluesRevealed === 2 ? 2 : 1) : 0;
    setRoundStars(stars);
    setTotalStars((t) => t + stars);
    setFactIdx((f) => (f + 1) % AI_FACTS.length);

    if (correct) {
      setPhase('correct');
      setAiriMsg(
        stars === 3
          ? `Perfect on the first clue! 🌟🌟🌟 ${AI_FACTS[factIdx]}`
          : stars === 2
          ? `Well done! 2 clues was enough! ⭐⭐ ${AI_FACTS[factIdx]}`
          : `You got it! Every clue helped! ⭐ ${AI_FACTS[factIdx]}`,
      );
      setAiriMood('celebrating');
    } else {
      setPhase('wrong');
      setAiriMsg(`Not quite! The answer was ${currentCreature.name} ${currentCreature.emoji}. Keep exploring! 🌿`);
      setAiriMood('encouraging');
    }
  };

  const handleNext = () => {
    const next = roundIdx + 1;
    if (next >= TOTAL_ROUNDS) {
      setPhase('gameOver');
      setAiriMsg(`Amazing explorer! You finished all ${TOTAL_ROUNDS} rounds! Total stars: ${totalStars} 🏆 You think just like an AI species tracker!`);
      setAiriMood('celebrating');
    } else {
      startRound(next);
    }
  };

  const handleRestart = () => {
    setTotalStars(0);
    setFactIdx(0);
    startRound(0);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const starsDisplay = (count: number) =>
    '⭐'.repeat(count) + (count < 3 ? '🖤'.repeat(3 - count) : '');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-50 to-green-100 dark:from-gray-900 dark:to-green-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-yellow-200 dark:border-yellow-900">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-yellow-700 dark:text-yellow-300">NatureQuest 🌿</h2>
          <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
            {phase === 'gameOver' ? 'Complete!' : `Round ${roundIdx + 1} / ${TOTAL_ROUNDS}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">⭐ {totalStars}</span>
          <button
            onClick={handleRestart}
            className="text-sm font-bold text-yellow-600 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700 rounded-lg px-3 py-1.5 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Game Over screen */}
      {phase === 'gameOver' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 pb-28">
          <div className="text-7xl animate-bounce">🏆</div>
          <h3 className="text-2xl font-extrabold text-yellow-700 dark:text-yellow-200 text-center">
            Quest Complete!
          </h3>
          <p className="text-base text-green-700 dark:text-green-300 font-semibold text-center">
            You scored {totalStars} star{totalStars !== 1 ? 's' : ''} out of {TOTAL_ROUNDS * 3} possible
          </p>
          <div className="text-3xl">{starsDisplay(Math.min(totalStars, 3))}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
            AI apps like iNaturalist identify millions of species every year — and now you know how it feels! 🤖🌍
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Play Again 🔄
          </button>
        </div>
      )}

      {/* Main playing area */}
      {phase !== 'gameOver' && (
        <div className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-28 overflow-y-auto">

          {/* Clue cards */}
          <div className="flex flex-col gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`rounded-2xl border-2 px-4 py-3 transition-all duration-300 ${
                  i < cluesRevealed
                    ? 'bg-white dark:bg-gray-800 border-yellow-300 dark:border-yellow-700 shadow-md'
                    : 'bg-yellow-50/50 dark:bg-gray-800/30 border-yellow-100 dark:border-gray-700 opacity-40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg font-black text-yellow-500 dark:text-yellow-400 min-w-[1.5rem]">
                    {i < cluesRevealed ? `${i + 1}.` : '?'}
                  </span>
                  <p className={`text-sm font-semibold leading-snug ${
                    i < cluesRevealed
                      ? 'text-gray-800 dark:text-gray-100'
                      : 'text-transparent select-none'
                  }`}>
                    {i < cluesRevealed ? currentCreature.clues[i] : 'Hidden clue'}
                  </p>
                </div>
                {i < cluesRevealed && (
                  <div className="mt-1 ml-8 text-xs text-yellow-600 dark:text-yellow-400 font-bold">
                    {i === 0 ? '3⭐ if correct now' : i === 1 ? '2⭐ if correct now' : '1⭐ if correct now'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Reveal more clues button */}
          {phase === 'playing' && cluesRevealed < 3 && (
            <button
              onClick={handleRevealClue}
              className="self-center px-6 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700 font-bold text-sm rounded-xl hover:bg-green-200 dark:hover:bg-green-800/50 hover:scale-105 active:scale-95 transition-all"
            >
              🔍 Reveal clue {cluesRevealed + 1} (costs a star)
            </button>
          )}

          {/* Answer options */}
          {phase === 'playing' && (
            <div className="grid grid-cols-2 gap-3 mt-1">
              {shuffledOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleGuess(opt)}
                  className="px-3 py-4 bg-white dark:bg-gray-800 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:scale-105 active:scale-95 transition-all shadow-sm text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Result state */}
          {(phase === 'correct' || phase === 'wrong') && (
            <div className={`rounded-2xl border-2 p-4 text-center ${
              phase === 'correct'
                ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700'
            }`}>
              <div className="text-4xl mb-2">{currentCreature.emoji}</div>
              <p className="text-base font-extrabold text-gray-800 dark:text-gray-100">
                {currentCreature.name}
              </p>
              {phase === 'correct' && (
                <p className="text-xl mt-1">{starsDisplay(roundStars)}</p>
              )}
              {phase === 'wrong' && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">
                  You guessed: {selectedAnswer}
                </p>
              )}
              <button
                onClick={handleNext}
                className={`mt-3 px-6 py-2.5 font-extrabold text-sm rounded-xl shadow active:scale-95 transition-transform text-white ${
                  phase === 'correct'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {roundIdx + 1 >= TOTAL_ROUNDS ? '🏁 See Results' : 'Next Creature →'}
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
