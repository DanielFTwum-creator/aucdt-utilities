/**
 * TreasureHunt — "Follow the Clues"
 *
 * AI-for-Good framing: AI solves complex puzzles and maps unknown environments —
 * it powers search-and-rescue robots that navigate collapsed buildings, and
 * rovers that explore Mars. Kids solve clue chains to find hidden treasure.
 *
 * Game flow:
 *  ready → clue (chain of 3 riddles) → treasureFound → next hunt | gameOver
 *  Stars: all 3 first-try = 3⭐, one wrong = 2⭐, two wrong = 1⭐
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface TreasureHuntProps {
  onClose: () => void;
}

// ── Data types ────────────────────────────────────────────────────────────────

interface Clue {
  riddle: string;
  options: [string, string, string];   // exactly 3 options
  answer: string;                       // must match one of the options exactly
  hint: string;                         // shown by Airi after a wrong guess
}

interface Hunt {
  title: string;
  emoji: string;
  clues: [Clue, Clue, Clue];
  treasureDescription: string;
}

type Phase = 'playing' | 'treasureFound' | 'gameOver';

// ── Hunt data ─────────────────────────────────────────────────────────────────

const HUNTS: Hunt[] = [
  {
    title: 'The Lost Library Book',
    emoji: '📚',
    treasureDescription: 'You found the lost library book! It was hiding on the nature shelf all along! 📖',
    clues: [
      {
        riddle: 'I keep knowledge safe and quiet. Go to the place where words sleep.',
        options: ['Library', 'Kitchen', 'Playground'],
        answer: 'Library',
        hint: 'Think about where you go to borrow books and read in silence…',
      },
      {
        riddle: 'Look for the section where stories of animals live.',
        options: ['Nature Shelf', 'History Shelf', 'Map Room'],
        answer: 'Nature Shelf',
        hint: 'Animals and plants are part of… nature! Which shelf would that be?',
      },
      {
        riddle: 'Find the book with a yellow cover next to the one about the sea.',
        options: ['The Yellow Book', 'The Blue Book', 'The Red Book'],
        answer: 'The Yellow Book',
        hint: 'Yellow like the sun — look for that cheerful colour next to ocean books!',
      },
    ],
  },
  {
    title: "The Explorer's Map",
    emoji: '🗺️',
    treasureDescription: "You found the explorer's ancient map! It was hidden in the school trophy cabinet all along! 🏆",
    clues: [
      {
        riddle: 'I am a place where young minds grow. Bells ring, and learning fills my halls. Where am I?',
        options: ['School', 'Museum', 'Library'],
        answer: 'School',
        hint: 'You go here every weekday — it has classrooms and a playground!',
      },
      {
        riddle: 'Inside this room, past achievements are proudly displayed behind glass. Enter here.',
        options: ['Trophy Cabinet', 'Science Lab', 'Art Room'],
        answer: 'Trophy Cabinet',
        hint: 'Trophies and medals shine behind glass in this special display…',
      },
      {
        riddle: "Look behind the tallest golden trophy. The map is folded inside a small wooden box.",
        options: ['Wooden Box', 'Red Envelope', 'Blue Folder'],
        answer: 'Wooden Box',
        hint: 'It is made of wood, small, and tucked behind the biggest prize!',
      },
    ],
  },
  {
    title: "The Missing Recipe",
    emoji: '🍲',
    treasureDescription: "You found Grandma's secret recipe! It was tucked inside the old recipe tin in the kitchen! 👵",
    clues: [
      {
        riddle: "Grandma's favourite room smells of warm spices and good food. Pots bubble here. Go find it!",
        options: ['Kitchen', 'Garden', 'Bedroom'],
        answer: 'Kitchen',
        hint: 'This is where food is cooked — follow your nose to the delicious smells!',
      },
      {
        riddle: 'On the highest shelf sits a round tin painted with red flowers. The recipe is near here.',
        options: ['Flower Tin', 'Glass Jar', 'Paper Bag'],
        answer: 'Flower Tin',
        hint: 'Look up high — a round tin with red painted flowers should be visible!',
      },
      {
        riddle: "The recipe is not in the tin but inside a small notebook tucked beneath it.",
        options: ['Small Notebook', 'Loose Paper', 'Old Envelope'],
        answer: 'Small Notebook',
        hint: 'Check underneath the tin — there should be a little notebook hiding there!',
      },
    ],
  },
  {
    title: "The Scientist's Discovery",
    emoji: '🔬',
    treasureDescription: "You found the scientist's breakthrough notes! Hidden under the microscope on Bench 3! 🧪",
    clues: [
      {
        riddle: 'Glass tubes, bubbling liquids, and amazing discoveries — this is a place of science. Where?',
        options: ['Laboratory', 'Greenhouse', 'Observatory'],
        answer: 'Laboratory',
        hint: 'Scientists wear white coats and work with chemicals and equipment here…',
      },
      {
        riddle: 'The scientist always works at the third bench from the door. The clue is on that bench.',
        options: ['Bench 3', 'Bench 1', 'Storage Room'],
        answer: 'Bench 3',
        hint: 'Count the benches from the door — one, two, three! Stop at number three.',
      },
      {
        riddle: 'A heavy instrument with a lens sits on the bench. The notes are folded underneath it.',
        options: ['Microscope', 'Telescope', 'Calculator'],
        answer: 'Microscope',
        hint: 'This instrument makes tiny things look enormous — scientists use it to see cells!',
      },
    ],
  },
  {
    title: 'The Midnight Message',
    emoji: '🌙',
    treasureDescription: 'You decoded the midnight message! It was hidden in the old stone bird-bath in the garden! 🦉',
    clues: [
      {
        riddle: 'Under a sky full of stars, flowers sleep and night creatures stir. This outdoor space holds the secret.',
        options: ['Garden', 'Rooftop', 'Attic'],
        answer: 'Garden',
        hint: 'It is outside, full of plants, and creatures come out at night here!',
      },
      {
        riddle: "Birds drink here during the day — but at midnight it holds something else. Look closely.",
        options: ['Bird-Bath', 'Flower Pot', 'Garden Gate'],
        answer: 'Bird-Bath',
        hint: 'Sparrows splash in it by day — a round stone basin in the garden!',
      },
      {
        riddle: 'At the base of the stone basin, a rolled scroll is sealed with a wax moon. Reach down and take it.',
        options: ['Wax-Sealed Scroll', 'Plastic Bag', 'Tin Box'],
        answer: 'Wax-Sealed Scroll',
        hint: 'Roll of paper sealed in wax — look at the very bottom of the basin!',
      },
    ],
  },
];

// ── AI facts ──────────────────────────────────────────────────────────────────

const AI_FACTS = [
  'AI-powered robots navigate collapsed buildings after earthquakes to find survivors — solving puzzles in real time! 🤖🏗️',
  "NASA's Mars rover uses AI to map unknown terrain and choose the safest path — like solving a treasure hunt on another planet! 🚀",
  'Search-and-rescue AI can analyse clues from satellite images to find missing people in forests! 🛰️',
  'AI can solve complex navigation puzzles in milliseconds — helping ambulances find the fastest route to hospitals! 🚑',
  'Underwater AI robots map ocean floors we have never explored — discovering new creatures along the way! 🌊🤖',
];

// ── Component ─────────────────────────────────────────────────────────────────

export const TreasureHunt: React.FC<TreasureHuntProps> = ({ onClose }) => {
  const [huntIdx, setHuntIdx]       = useState(0);
  const [clueIdx, setClueIdx]       = useState(0);
  const [phase, setPhase]           = useState<Phase>('playing');
  const [mistakes, setMistakes]     = useState(0);   // mistakes in current hunt
  const [huntStars, setHuntStars]   = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [factIdx, setFactIdx]       = useState(0);
  const [selectedWrong, setSelectedWrong] = useState<string | null>(null);
  const [airiMsg, setAiriMsg]       = useState("Welcome to Treasure Hunt! 🗺️ Follow the clues to find hidden treasure. Think like an AI explorer!");
  const [airiMood, setAiriMood]     = useState<AiriMood>('happy');

  const currentHunt = HUNTS[huntIdx];
  const currentClue = currentHunt?.clues[clueIdx];

  const startHunt = useCallback((idx: number) => {
    setHuntIdx(idx);
    setClueIdx(0);
    setMistakes(0);
    setPhase('playing');
    setSelectedWrong(null);
    setAiriMsg(`Hunt ${idx + 1}: "${HUNTS[idx].title}" ${HUNTS[idx].emoji} — Read the first riddle carefully!`);
    setAiriMood('thinking');
  }, []);

  useEffect(() => {
    startHunt(0);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (answer: string) => {
    if (phase !== 'playing') return;
    if (answer === currentClue.answer) {
      setSelectedWrong(null);
      const nextClue = clueIdx + 1;
      if (nextClue >= 3) {
        // Hunt complete
        const stars = mistakes === 0 ? 3 : mistakes === 1 ? 2 : 1;
        setHuntStars(stars);
        setTotalStars((t) => t + stars);
        setPhase('treasureFound');
        setFactIdx((f) => (f + 1) % AI_FACTS.length);
        setAiriMsg(`Treasure found! ${stars === 3 ? '🌟🌟🌟' : stars === 2 ? '⭐⭐' : '⭐'} ${AI_FACTS[factIdx]}`);
        setAiriMood('celebrating');
      } else {
        setClueIdx(nextClue);
        setAiriMsg(`Correct! 🎉 Keep going — clue ${nextClue + 1} of 3!`);
        setAiriMood('happy');
      }
    } else {
      setSelectedWrong(answer);
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setAiriMsg(`Not quite! Hint: ${currentClue.hint}`);
      setAiriMood('encouraging');
    }
  };

  const handleNextHunt = () => {
    const next = huntIdx + 1;
    if (next >= HUNTS.length) {
      setPhase('gameOver');
      setAiriMsg(`You completed all ${HUNTS.length} treasure hunts! Total: ${totalStars} stars! 🏆 You navigate puzzles just like an AI rescue robot!`);
      setAiriMood('celebrating');
    } else {
      startHunt(next);
    }
  };

  const handleRestart = () => {
    setTotalStars(0);
    setFactIdx(0);
    startHunt(0);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  const starsDisplay = (count: number) =>
    '⭐'.repeat(count) + (count < 3 ? '🖤'.repeat(3 - count) : '');

  const progressDots = Array.from({ length: 3 }, (_, i) => i < clueIdx || phase === 'treasureFound');

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-50 to-amber-100 dark:from-gray-900 dark:to-amber-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-yellow-200 dark:border-yellow-900">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-yellow-700 dark:text-yellow-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>

        <div className="text-center">
          <h2 className="text-lg font-extrabold text-yellow-700 dark:text-yellow-300">Treasure Hunt 🗺️</h2>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            {phase === 'gameOver' ? 'All Found!' : `Hunt ${huntIdx + 1} / ${HUNTS.length}`}
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
            All Treasures Found!
          </h3>
          <p className="text-base text-amber-700 dark:text-amber-300 font-semibold text-center">
            You scored {totalStars} star{totalStars !== 1 ? 's' : ''} out of {HUNTS.length * 3} possible
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center max-w-xs">
            Real AI robots solve puzzles like these to navigate disaster zones and explore other planets! 🤖🚀
          </p>
          <button
            onClick={handleRestart}
            className="mt-2 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
          >
            Hunt Again 🔄
          </button>
        </div>
      )}

      {/* Main playing area */}
      {phase !== 'gameOver' && (
        <div className="flex-1 flex flex-col gap-4 px-4 pt-4 pb-28 overflow-y-auto">

          {/* Hunt title */}
          <div className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/60 rounded-2xl px-4 py-3 border border-yellow-200 dark:border-yellow-800">
            <span className="text-3xl">{currentHunt.emoji}</span>
            <div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                Hunt {huntIdx + 1}
              </p>
              <p className="text-base font-extrabold text-gray-800 dark:text-gray-100">
                {currentHunt.title}
              </p>
            </div>
          </div>

          {/* Clue progress dots */}
          {phase === 'playing' && (
            <div className="flex justify-center gap-3">
              {progressDots.map((done, i) => (
                <div key={i} className={`flex items-center gap-1.5 ${i === clueIdx ? 'scale-110' : ''}`}>
                  <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    done
                      ? 'bg-green-400 border-green-400 text-white'
                      : i === clueIdx
                      ? 'bg-yellow-400 border-yellow-500 text-white'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}>
                    {done ? '✓' : i + 1}
                  </div>
                  {i < 2 && <div className={`w-6 h-0.5 ${done ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
                </div>
              ))}
            </div>
          )}

          {/* Riddle card */}
          {phase === 'playing' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 shadow-md px-5 py-4">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
                Clue {clueIdx + 1} of 3 🔍
              </p>
              <p className="text-base font-semibold text-gray-800 dark:text-gray-100 leading-relaxed">
                "{currentClue.riddle}"
              </p>
            </div>
          )}

          {/* Answer buttons */}
          {phase === 'playing' && (
            <div className="flex flex-col gap-3">
              {currentClue.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  className={`px-5 py-4 rounded-2xl border-2 font-bold text-sm text-left transition-all hover:scale-[1.02] active:scale-95 shadow-sm ${
                    selectedWrong === opt
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-700 dark:text-red-300'
                      : 'bg-white dark:bg-gray-800 border-yellow-200 dark:border-yellow-800 text-gray-700 dark:text-gray-200 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                >
                  {selectedWrong === opt ? `❌ ${opt}` : `🔹 ${opt}`}
                </button>
              ))}
            </div>
          )}

          {/* Treasure found! */}
          {phase === 'treasureFound' && (
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl border-2 border-yellow-400 dark:border-yellow-600 shadow-lg px-5 py-6 mt-2">
              <div className="text-6xl animate-bounce">🏆</div>
              <h3 className="text-xl font-extrabold text-yellow-700 dark:text-yellow-200 text-center">
                Treasure Found!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                {currentHunt.treasureDescription}
              </p>
              <div className="text-2xl">{starsDisplay(huntStars)}</div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold text-center max-w-xs">
                {AI_FACTS[factIdx]}
              </p>
              <button
                onClick={handleNextHunt}
                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-extrabold text-base rounded-2xl shadow-lg active:scale-95 transition-transform"
              >
                {huntIdx + 1 >= HUNTS.length ? '🏁 See Final Score' : 'Next Hunt →'}
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
