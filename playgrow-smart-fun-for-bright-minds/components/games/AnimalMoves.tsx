/**
 * AnimalMoves — "Move Like the Animals"
 *
 * AI-for-Good framing: AI studies animal biomechanics — how creatures move — to
 * design better prosthetic limbs, build robots that navigate any terrain, and
 * help conservation scientists track animal health remotely. Kids experience this
 * by matching animals to their characteristic movements.
 *
 * Game flow:
 *  playing → correct/wrong → (next round | gameOver)
 *  Stars: correct first try = 2 pts, wrong = 0 pts — total out of 20
 *  End screen: 3⭐ = 18–20, 2⭐ = 12–17, 1⭐ = below 12
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface AnimalMovesProps {
  onClose: () => void;
}

// ── Data types ────────────────────────────────────────────────────────────────

interface MoveCard {
  label: string;
  emoji: string;
}

interface Animal {
  name: string;
  emoji: string;
  description: string;
  correctMove: MoveCard;
  distractors: [MoveCard, MoveCard, MoveCard];
}

type Phase = 'playing' | 'correct' | 'wrong' | 'gameOver';

// ── Move card definitions ─────────────────────────────────────────────────────

const MOVES: Record<string, MoveCard> = {
  sprint:  { label: 'Sprint',  emoji: '🏃' },
  waddle:  { label: 'Waddle',  emoji: '🐧' },
  slither: { label: 'Slither', emoji: '🐍' },
  bounce:  { label: 'Bounce',  emoji: '🦘' },
  soar:    { label: 'Soar',    emoji: '🦅' },
  plod:    { label: 'Plod',    emoji: '🐢' },
  swim:    { label: 'Swim',    emoji: '🐬' },
  gallop:  { label: 'Gallop',  emoji: '🐎' },
  hover:   { label: 'Hover',   emoji: '🚁' },
  crawl:   { label: 'Crawl',   emoji: '🦀' },
  burrow:  { label: 'Burrow',  emoji: '🐹' },
  leap:    { label: 'Leap',    emoji: '🐸' },
  jet:     { label: 'Jet',     emoji: '💨' },
  fly:     { label: 'Fly',     emoji: '🦇' },
};

// ── Animal pool (14 animals) ──────────────────────────────────────────────────

const ANIMAL_POOL: Animal[] = [
  {
    name: 'Cheetah',
    emoji: '🐆',
    description: 'The world\'s fastest land animal — it sprints in huge bounding leaps, reaching 120 km/h in seconds!',
    correctMove: MOVES.sprint,
    distractors: [MOVES.slither, MOVES.waddle, MOVES.hover],
  },
  {
    name: 'Penguin',
    emoji: '🐧',
    description: 'On land it rocks side to side with short shuffling steps. In water it torpedo-dives with its wings!',
    correctMove: MOVES.waddle,
    distractors: [MOVES.gallop, MOVES.soar, MOVES.burrow],
  },
  {
    name: 'Snake',
    emoji: '🐍',
    description: 'It has no legs — it pushes its scales against the ground in S-shaped curves to glide forward!',
    correctMove: MOVES.slither,
    distractors: [MOVES.bounce, MOVES.plod, MOVES.sprint],
  },
  {
    name: 'Kangaroo',
    emoji: '🦘',
    description: 'Its huge back legs work like springs — it bounces on two feet and can cover 9 metres in one leap!',
    correctMove: MOVES.bounce,
    distractors: [MOVES.swim, MOVES.crawl, MOVES.hover],
  },
  {
    name: 'Eagle',
    emoji: '🦅',
    description: 'It spreads its wide wings and rides warm air currents upward, barely flapping — just gliding!',
    correctMove: MOVES.soar,
    distractors: [MOVES.waddle, MOVES.slither, MOVES.gallop],
  },
  {
    name: 'Tortoise',
    emoji: '🐢',
    description: 'Its heavy shell means it moves very slowly, lifting one foot at a time with steady, careful steps.',
    correctMove: MOVES.plod,
    distractors: [MOVES.sprint, MOVES.bounce, MOVES.soar],
  },
  {
    name: 'Dolphin',
    emoji: '🐬',
    description: 'It powers through water by pumping its tail up and down — not side to side like a fish!',
    correctMove: MOVES.swim,
    distractors: [MOVES.slither, MOVES.plod, MOVES.waddle],
  },
  {
    name: 'Horse',
    emoji: '🐎',
    description: 'At full speed it lifts all four hooves off the ground at once in a powerful, rhythmic gallop!',
    correctMove: MOVES.gallop,
    distractors: [MOVES.hover, MOVES.bounce, MOVES.swim],
  },
  {
    name: 'Hummingbird',
    emoji: '🐦',
    description: 'Its wings beat 80 times per second, letting it hover perfectly still in mid-air!',
    correctMove: MOVES.hover,
    distractors: [MOVES.plod, MOVES.sprint, MOVES.waddle],
  },
  {
    name: 'Crab',
    emoji: '🦀',
    description: 'It has 10 legs and walks sideways — it can scuttle forwards, backwards, or sideways equally well!',
    correctMove: MOVES.crawl,
    distractors: [MOVES.soar, MOVES.gallop, MOVES.bounce],
  },
  {
    name: 'Mole',
    emoji: '🐹',
    description: 'It uses its wide, spade-like front paws to dig tunnels underground, pushing soil aside.',
    correctMove: MOVES.burrow,
    distractors: [MOVES.swim, MOVES.sprint, MOVES.hover],
  },
  {
    name: 'Frog',
    emoji: '🐸',
    description: 'Its powerful back legs coil and then explode — launching it 20× its own body length in one leap!',
    correctMove: MOVES.leap,
    distractors: [MOVES.plod, MOVES.slither, MOVES.gallop],
  },
  {
    name: 'Octopus',
    emoji: '🐙',
    description: 'It jets backward by squirting water, and can also walk on the seabed using its eight flexible arms!',
    correctMove: MOVES.jet,
    distractors: [MOVES.sprint, MOVES.hover, MOVES.waddle],
  },
  {
    name: 'Bat',
    emoji: '🦇',
    description: 'The only mammal that truly flies — its arms are wings made of stretched skin between long finger bones.',
    correctMove: MOVES.fly,
    distractors: [MOVES.crawl, MOVES.bounce, MOVES.swim],
  },
];

// ── AI facts (cycle through on correct answers) ───────────────────────────────

const AI_FACTS = [
  'Engineers studied how cheetahs run to design faster, more efficient rescue robots! 🤖🐆',
  'AI analysed penguin waddles to improve the balance systems of bipedal robots! 🐧🦾',
  'Snake-inspired robots can now slither through earthquake rubble to find survivors! 🐍🏗️',
  'Kangaroo-leg biomechanics inspired prosthetic feet that let amputees run marathons! 🦘🏃',
  'AI studies eagle soaring to design drones that fly for hours without using battery power! 🦅🚁',
  'Scientists used AI to analyse tortoise shells for ultra-strong, lightweight armour designs! 🐢🛡️',
  'Dolphin tail mechanics inspired the most efficient underwater propellers ever built! 🐬⚙️',
  'AI motion analysis of horse gallops helped create faster and safer equine prosthetics! 🐎',
  'Hummingbird wings inspired micro-drones that can hover and spy through tiny spaces! 🐦🤖',
  'Crab-walking robots can now navigate rocky ocean floors to repair underwater pipelines! 🦀🔧',
];

const TOTAL_ROUNDS = 10;

// ── Helpers ───────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRounds(pool: Animal[], count: number): Animal[] {
  return shuffle(pool).slice(0, count);
}

function starRating(score: number): number {
  if (score >= 18) return 3;
  if (score >= 12) return 2;
  return 1;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const AnimalMoves: React.FC<AnimalMovesProps> = ({ onClose }) => {
  const [rounds]                    = useState<Animal[]>(() => pickRounds(ANIMAL_POOL, TOTAL_ROUNDS));
  const [roundIdx, setRoundIdx]     = useState(0);
  const [phase, setPhase]           = useState<Phase>('playing');
  const [selectedMove, setSelectedMove] = useState<string | null>(null);
  const [wrongIdx, setWrongIdx]     = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [factIdx, setFactIdx]       = useState(0);
  const [shuffledCards, setShuffledCards] = useState<MoveCard[]>([]);
  const [airiMsg, setAiriMsg]       = useState("Welcome to Animal Moves! 🐾 Match each animal to the way it moves. Good luck!");
  const [airiMood, setAiriMood]     = useState<AiriMood>('happy');
  const shakeTimeoutRef             = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentAnimal = rounds[roundIdx];

  // Build shuffled options when animal changes
  useEffect(() => {
    if (currentAnimal) {
      setShuffledCards(
        shuffle([currentAnimal.correctMove, ...currentAnimal.distractors])
      );
    }
  }, [roundIdx, currentAnimal]);

  // Clean up shake timeout on unmount
  useEffect(() => () => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
  }, []);

  const startRound = useCallback((idx: number) => {
    setRoundIdx(idx);
    setPhase('playing');
    setSelectedMove(null);
    setWrongIdx(null);
    setAiriMsg('How does this animal move? Pick the right move card! 🔍');
    setAiriMood('watching');
  }, []);

  useEffect(() => {
    startRound(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handlePick = (card: MoveCard, cardIndex: number) => {
    if (phase !== 'playing') return;

    const correct = card.label === currentAnimal.correctMove.label;
    setSelectedMove(card.label);

    if (correct) {
      setTotalScore((s) => s + 2);
      setPhase('correct');
      const fact = AI_FACTS[factIdx % AI_FACTS.length];
      setFactIdx((f) => f + 1);
      setAiriMsg(`Amazing! ${currentAnimal.emoji} ${currentAnimal.name}s ${card.label.toLowerCase()}! ${fact}`);
      setAiriMood('celebrating');
    } else {
      setWrongIdx(cardIndex);
      setPhase('wrong');
      setAiriMsg(`Not quite! Look at the correct answer below, then tap Next to keep going. You can do it! 💪`);
      setAiriMood('encouraging');
      // Clear shake class after animation completes
      shakeTimeoutRef.current = setTimeout(() => setWrongIdx(null), 600);
    }
  };

  const handleNext = () => {
    const next = roundIdx + 1;
    if (next >= TOTAL_ROUNDS) {
      const stars = starRating(totalScore);
      const starsText = '⭐'.repeat(stars);
      setPhase('gameOver');
      setAiriMsg(`Wow, you finished! Score: ${totalScore}/20 — ${starsText} You think just like an AI biomechanics researcher! 🤖🦾`);
      setAiriMood('celebrating');
    } else {
      startRound(next);
    }
  };

  const handleRestart = () => {
    setTotalScore(0);
    setFactIdx(0);
    startRound(0);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const starsDisplay = (score: number) => {
    const count = starRating(score);
    return '⭐'.repeat(count) + (count < 3 ? '🖤'.repeat(3 - count) : '');
  };

  const cardBg = (card: MoveCard, index: number): string => {
    if (phase === 'playing') {
      return 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-105 active:scale-95';
    }
    const isCorrect = card.label === currentAnimal.correctMove.label;
    const isSelected = card.label === selectedMove;
    if (isCorrect) {
      return 'bg-green-100 dark:bg-green-900/40 border-green-400 dark:border-green-500 scale-105';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-100 dark:bg-red-900/40 border-red-400 dark:border-red-500';
    }
    return 'bg-white dark:bg-gray-800 border-green-100 dark:border-gray-700 opacity-50';
  };

  // ── JSX ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-emerald-100 dark:from-gray-900 dark:to-green-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-green-200 dark:border-green-900">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-green-700 dark:text-green-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-green-700 dark:text-green-300">Animal Moves 🐾</h2>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            {phase === 'gameOver' ? 'Complete!' : `Round ${roundIdx + 1} / ${TOTAL_ROUNDS}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-green-600 dark:text-green-400">⭐ {totalScore}</span>
          <button
            onClick={handleRestart}
            className="text-sm font-bold text-green-600 dark:text-green-400 border border-green-300 dark:border-green-700 rounded-lg px-3 py-1.5 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
            aria-label="Restart game"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Game Over screen */}
      {phase === 'gameOver' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 pb-28">
          <div className="text-7xl animate-bounce">🏆</div>
          <h3 className="text-2xl font-extrabold text-green-700 dark:text-green-200 text-center">
            All Done!
          </h3>
          <p className="text-base text-emerald-700 dark:text-emerald-300 font-semibold text-center">
            You scored {totalScore} out of {TOTAL_ROUNDS * 2} points
          </p>
          <div className="text-3xl tracking-wide">{starsDisplay(totalScore)}</div>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
            AI researchers study animal movement to build better robots, prosthetics, and drones — and now you know why! 🤖🦾
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Play Again 🔄
          </button>
        </div>
      )}

      {/* Main playing area */}
      {phase !== 'gameOver' && (
        <div className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-28 overflow-y-auto">

          {/* Animal card */}
          <div className="rounded-3xl bg-white dark:bg-gray-800 border-2 border-green-200 dark:border-green-800 shadow-md px-5 py-5 flex flex-col items-center gap-3">
            <div className="text-7xl leading-none select-none" role="img" aria-label={currentAnimal.name}>
              {currentAnimal.emoji}
            </div>
            <h3 className="text-xl font-extrabold text-green-700 dark:text-green-300">
              {currentAnimal.name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium text-center leading-snug max-w-xs">
              {currentAnimal.description}
            </p>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              How does it move?
            </p>
          </div>

          {/* Move cards */}
          <div className="grid grid-cols-2 gap-3">
            {shuffledCards.map((card, i) => (
              <button
                key={card.label}
                onClick={() => handlePick(card, i)}
                disabled={phase !== 'playing'}
                className={[
                  'flex flex-col items-center justify-center gap-1.5 px-3 py-5 rounded-2xl border-2 font-bold text-gray-700 dark:text-gray-200 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400',
                  cardBg(card, i),
                  wrongIdx === i ? 'pg-shake' : '',
                ].join(' ')}
                aria-label={`${card.label} ${card.emoji}`}
              >
                <span className="text-3xl leading-none select-none">{card.emoji}</span>
                <span className="text-sm font-extrabold">{card.label}</span>
              </button>
            ))}
          </div>

          {/* Result feedback */}
          {(phase === 'correct' || phase === 'wrong') && (
            <div className={[
              'rounded-2xl border-2 p-4 text-center',
              phase === 'correct'
                ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700'
                : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700',
            ].join(' ')}>
              {phase === 'correct' ? (
                <>
                  <p className="text-lg font-extrabold text-green-700 dark:text-green-300">
                    Correct! +2 ⭐
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-semibold">
                    {currentAnimal.name}s {currentAnimal.correctMove.label.toLowerCase()}!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-lg font-extrabold text-red-600 dark:text-red-400">
                    Not this time!
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-semibold">
                    The correct move is&nbsp;
                    <span className="text-green-700 dark:text-green-300">
                      {currentAnimal.correctMove.emoji} {currentAnimal.correctMove.label}
                    </span>
                  </p>
                </>
              )}
              <button
                onClick={handleNext}
                className={[
                  'mt-3 px-6 py-2.5 font-extrabold text-sm rounded-xl shadow active:scale-95 transition-transform text-white',
                  phase === 'correct'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-yellow-500 hover:bg-yellow-600',
                ].join(' ')}
              >
                {roundIdx + 1 >= TOTAL_ROUNDS ? '🏁 See Results' : 'Next Animal →'}
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
