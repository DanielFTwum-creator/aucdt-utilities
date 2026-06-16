/**
 * Find & Match — "Sort It Out"
 *
 * AI-for-Good framing: AI sorts things at superhuman speed to help the world —
 * recycling plants, medical labs, food safety inspectors. Kids flip cards to
 * find matching pairs, and each matched pair reveals a real AI-for-good fact.
 *
 * Game mechanics:
 *  - 12 cards (6 AI-themed pairs) in a 4 × 3 grid
 *  - Flip two cards — match stays face-up; no match flips back after 1 s
 *  - Stars: 3 = ≤ 8 moves, 2 = ≤ 14, 1 = completed
 *  - Airi celebrates each match with an AI fact
 */

import React, { useCallback, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface FindMatchProps {
  onClose: () => void;
}

// ── Card data ─────────────────────────────────────────────────────────────────

interface CardData {
  pairId: string;
  emoji: string;
  label: string;
  fact: string;
}

// Large pool — 6 are randomly selected each game for endless variety
const PAIR_POOL: CardData[] = [
  { pairId: 'plant',    emoji: '🌱', label: 'AI Farming',    fact: 'AI helps farmers spot sick plants before they spread! 🌱' },
  { pairId: 'recycle',  emoji: '♻️', label: 'AI Sorting',    fact: 'AI sorts recycling 100× faster than humans! ♻️' },
  { pairId: 'health',   emoji: '🏥', label: 'AI Health',     fact: 'AI helps doctors find diseases earlier than ever! 🏥' },
  { pairId: 'weather',  emoji: '🌤️', label: 'AI Weather',    fact: 'AI predicts storms days ahead to keep people safe! ⛈️' },
  { pairId: 'ocean',    emoji: '🌊', label: 'AI Oceans',     fact: 'AI tracks ocean plastic to protect dolphins and whales! 🐬' },
  { pairId: 'space',    emoji: '🚀', label: 'AI Space',      fact: 'AI helps scientists discover new planets light-years away! 🔭' },
  { pairId: 'robot',    emoji: '🤖', label: 'AI Robots',     fact: 'Robots with AI help build cars and deliver medicines! 🤖' },
  { pairId: 'eye',      emoji: '👁️', label: 'AI Vision',     fact: 'AI can spot a single sick cell in thousands of photos! 👁️' },
  { pairId: 'brain',    emoji: '🧠', label: 'AI Learning',   fact: 'AI learns from millions of examples, just like you do! 🧠' },
  { pairId: 'fire',     emoji: '🔥', label: 'AI Wildfires',  fact: 'AI watches satellites to spot forest fires within minutes! 🔥' },
  { pairId: 'fish',     emoji: '🐟', label: 'AI Fishing',    fact: 'AI helps stop illegal fishing to protect ocean life! 🐟' },
  { pairId: 'water',    emoji: '💧', label: 'AI Water',      fact: 'AI detects dirty water so villages get safe drinking water! 💧' },
  { pairId: 'music',    emoji: '🎵', label: 'AI Music',      fact: 'AI can compose music and help deaf people feel sound! 🎵' },
  { pairId: 'road',     emoji: '🚗', label: 'AI Driving',    fact: 'Self-driving AI reduces road accidents that hurt millions! 🚗' },
  { pairId: 'school',   emoji: '📚', label: 'AI Teaching',   fact: 'AI tutors adapt lessons so every child can learn at their pace! 📚' },
  { pairId: 'bee',      emoji: '🐝', label: 'AI Bees',       fact: 'AI tracks bee health to protect the pollinators that feed us! 🐝' },
  { pairId: 'sun',      emoji: '☀️', label: 'AI Energy',     fact: 'AI optimises solar panels to produce more clean energy! ☀️' },
  { pairId: 'heart',    emoji: '❤️', label: 'AI Heart',      fact: 'AI listens to your heartbeat and can spot problems early! ❤️' },
  { pairId: 'trash',    emoji: '🗑️', label: 'AI Waste',      fact: 'AI sorts rubbish to extract recyclable materials for reuse! 🗑️' },
  { pairId: 'satellite',emoji: '🛰️', label: 'AI Satellites', fact: 'AI analyses satellite images to track floods and help rescue teams! 🛰️' },
  { pairId: 'tree',     emoji: '🌳', label: 'AI Forests',    fact: 'AI counts trees from the sky to monitor deforestation! 🌳' },
  { pairId: 'dna',      emoji: '🧬', label: 'AI Medicine',   fact: 'AI decodes DNA to create medicines for rare diseases! 🧬' },
  { pairId: 'translate',emoji: '🌐', label: 'AI Language',   fact: 'AI translates 100+ languages so everyone can communicate! 🌐' },
  { pairId: 'food',     emoji: '🍎', label: 'AI Food',       fact: 'AI inspects fruit and vegetables to cut food waste in half! 🍎' },
];

const PAIRS_PER_GAME = 6;

interface CardState {
  id: number;         // unique instance id (0–11)
  pairId: string;
  emoji: string;
  label: string;
  fact: string;
  flipped: boolean;
  matched: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): CardState[] {
  const chosen = shuffle(PAIR_POOL).slice(0, PAIRS_PER_GAME);
  return shuffle([...chosen, ...chosen]).map((p, i) => ({
    id: i,
    ...p,
    flipped: false,
    matched: false,
  }));
}

// ── Component ─────────────────────────────────────────────────────────────────

export const FindMatch: React.FC<FindMatchProps> = ({ onClose }) => {
  const [cards, setCards]           = useState<CardState[]>(buildDeck);
  const [selected, setSelected]     = useState<number[]>([]); // up to 2 card ids
  const [locked, setLocked]         = useState(false);        // freeze during mismatch delay
  const [moves, setMoves]           = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [airiMsg,  setAiriMsg]  = useState("Let's sort it out! Flip two cards that look the same! 🤖");
  const [airiMood, setAiriMood] = useState<AiriMood>('idle');
  const [lastFact, setLastFact] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const totalPairs = PAIRS_PER_GAME;

  // ── Star rating ──────────────────────────────────────────────────────────────
  const calcStars = (m: number) => m <= 8 ? 3 : m <= 14 ? 2 : 1;

  // ── Card flip ────────────────────────────────────────────────────────────────
  const handleFlip = useCallback((cardId: number) => {
    if (locked) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;
    if (selected.length === 1 && selected[0] === cardId) return; // same card

    const newSelected = [...selected, cardId];

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
    );

    if (newSelected.length < 2) {
      setSelected(newSelected);
      return;
    }

    // Two cards selected — evaluate
    setMoves((m) => m + 1);
    const [aId, bId] = newSelected;
    const a = cards.find((c) => c.id === aId)!;
    const b = card; // the just-flipped card

    if (a.pairId === b.pairId) {
      // Match!
      setCards((prev) =>
        prev.map((c) =>
          c.id === aId || c.id === bId ? { ...c, flipped: true, matched: true } : c
        )
      );
      setSelected([]);
      const newCount = matchedCount + 1;
      setMatchedCount(newCount);
      setLastFact(a.fact);
      setAiriMsg(`Match! 🎉 ${a.fact}`);
      setAiriMood('celebrating');

      if (newCount === totalPairs) {
        setTimeout(() => {
          setGameOver(true);
          setAiriMsg("You sorted everything! You're an AI expert! 🤖🏆");
          setAiriMood('celebrating');
        }, 800);
      }
    } else {
      // No match — flip back after delay
      setLocked(true);
      setAiriMsg("Not quite! Keep looking — you'll find it! 💪");
      setAiriMood('encouraging');
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === aId || c.id === bId ? { ...c, flipped: false } : c
          )
        );
        setSelected([]);
        setLocked(false);
        setAiriMsg("Flip two more! Find the matching pair! 🎯");
        setAiriMood('idle');
      }, 1000);
      return;
    }

    setSelected([]);
  }, [cards, selected, locked, matchedCount, totalPairs]);

  const handleRestart = () => {
    setCards(buildDeck());
    setSelected([]);
    setLocked(false);
    setMoves(0);
    setMatchedCount(0);
    setGameOver(false);
    setLastFact(null);
    setAiriMsg("Let's go again! Can you beat your score? 🤖");
    setAiriMood('happy');
  };

  const stars = calcStars(moves);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-emerald-50 to-teal-100 dark:from-gray-900 dark:to-teal-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-emerald-100 dark:border-teal-900">
        <button
          onClick={onClose}
          className="text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-emerald-700 dark:text-emerald-300">Sort It Out ♻️</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {matchedCount} / {totalPairs} pairs · {moves} moves
          </p>
        </div>
        <div className="text-xl">
          {matchedCount === totalPairs
            ? `${'⭐'.repeat(stars)}${'🖤'.repeat(3 - stars)}`
            : `🃏 ${cards.filter((c) => !c.matched).length / 2} left`}
        </div>
      </div>

      {/* Game area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-3 py-4 pb-28">

        {gameOver ? (
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-200">You sorted the world!</p>
            <p className="text-base text-emerald-600 dark:text-emerald-400 mt-1">
              {moves} moves · {'⭐'.repeat(stars)}{'🖤'.repeat(3 - stars)}
            </p>
            <p className="text-sm text-emerald-500 dark:text-emerald-400 mt-3 max-w-xs mx-auto font-semibold">
              Just like you, AI sorts millions of items every second to make the world cleaner and healthier! 🌍
            </p>
            <button
              onClick={handleRestart}
              className="mt-5 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 hover:scale-105 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              Play Again 🔄
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-lg w-full mx-auto">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleFlip(card.id)}
                disabled={card.matched || card.flipped || locked}
                aria-label={card.flipped || card.matched ? `${card.label} card` : 'Face-down card'}
                className={`
                  aspect-square rounded-2xl border-4 font-bold text-center
                  transition-all duration-300 active:scale-95
                  flex flex-col items-center justify-center gap-0.5
                  ${card.matched
                    ? 'bg-emerald-200 dark:bg-emerald-900/50 border-emerald-400 dark:border-emerald-600 cursor-default scale-95'
                    : card.flipped
                    ? 'bg-white dark:bg-gray-700 border-teal-400 dark:border-teal-500 shadow-lg scale-105'
                    : 'bg-teal-400 dark:bg-teal-700 border-teal-500 dark:border-teal-600 hover:bg-teal-300 dark:hover:bg-teal-600 hover:scale-105 cursor-pointer shadow-md'
                  }
                `}
              >
                {card.flipped || card.matched ? (
                  <>
                    <span className="text-2xl sm:text-3xl leading-none">{card.emoji}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-600 dark:text-gray-300 leading-tight px-1 text-center">
                      {card.label}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl">❓</span>
                )}
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
