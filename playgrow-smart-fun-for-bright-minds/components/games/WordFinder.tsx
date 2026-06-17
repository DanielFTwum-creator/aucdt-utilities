/**
 * WordFinder — "Spot It!"
 *
 * AI-for-Good framing: AI combines vision and language to understand the world —
 * called Vision-Language AI. It helps describe photos for blind people and powers
 * search engines. Kids experience this by matching words to objects in illustrated
 * emoji scenes, mirroring how AI links labels to visual objects.
 *
 * Game flow:
 *  ready → round (scene + prompt shown, child taps item) →
 *  roundComplete → next round | gameOver after 6 rounds
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface WordFinderProps {
  onClose: () => void;
}

type Phase = 'ready' | 'round' | 'roundComplete' | 'gameOver';

// ── Scene definitions ─────────────────────────────────────────────────────────

interface SceneItem {
  id: string;
  emoji: string;
  label: string;
  isTarget: boolean;
}

interface Scene {
  title: string;
  bgClass: string;
  prompt: string;
  hint: string;
  items: SceneItem[];
  aiFact: string;
}

const SCENES: Scene[] = [
  {
    title: 'Down on the Farm',
    bgClass: 'from-green-100 to-lime-200 dark:from-green-950 dark:to-lime-950',
    prompt: 'Find an ANIMAL 🐾',
    hint: 'Look for something that moos or clucks!',
    aiFact: 'AI Vision-Language models can identify every animal in a photo — even rare ones! 🐄',
    items: [
      { id: 'cow',    emoji: '🐄', label: 'Cow',        isTarget: true  },
      { id: 'wheat',  emoji: '🌾', label: 'Wheat',      isTarget: false },
      { id: 'tractor',emoji: '🚜', label: 'Tractor',    isTarget: false },
      { id: 'sun',    emoji: '🌻', label: 'Sunflower',  isTarget: false },
      { id: 'chicken',emoji: '🐓', label: 'Chicken',    isTarget: true  },
      { id: 'carrot', emoji: '🥕', label: 'Carrot',     isTarget: false },
      { id: 'grass',  emoji: '🌿', label: 'Grass',      isTarget: false },
      { id: 'sheep',  emoji: '🐑', label: 'Sheep',      isTarget: true  },
    ],
  },
  {
    title: 'Deep Blue Ocean',
    bgClass: 'from-blue-100 to-cyan-200 dark:from-blue-950 dark:to-cyan-950',
    prompt: 'Find something BLUE 🔵',
    hint: 'What covers the whole ocean floor?',
    aiFact: 'AI Vision AI helps scientists track ocean pollution by scanning satellite photos! 🌊',
    items: [
      { id: 'whale',  emoji: '🐳', label: 'Whale',      isTarget: false },
      { id: 'crab',   emoji: '🦀', label: 'Crab',       isTarget: false },
      { id: 'fish',   emoji: '🐠', label: 'Fish',       isTarget: false },
      { id: 'wave',   emoji: '🌊', label: 'Waves',      isTarget: true  },
      { id: 'anchor', emoji: '⚓', label: 'Anchor',     isTarget: false },
      { id: 'lobster',emoji: '🦞', label: 'Lobster',    isTarget: false },
      { id: 'coral',  emoji: '🪸', label: 'Coral',      isTarget: false },
      { id: 'octopus',emoji: '🐙', label: 'Octopus',    isTarget: false },
    ],
  },
  {
    title: 'In the Kitchen',
    bgClass: 'from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950',
    prompt: 'Find a FRUIT 🍎',
    hint: 'Look for something sweet that grows on a tree!',
    aiFact: 'AI can recognise hundreds of fruits and vegetables in photos to track freshness! 🍎',
    items: [
      { id: 'pan',    emoji: '🍳', label: 'Frying Pan', isTarget: false },
      { id: 'spoon',  emoji: '🥄', label: 'Spoon',      isTarget: false },
      { id: 'apple',  emoji: '🍎', label: 'Apple',      isTarget: true  },
      { id: 'teapot', emoji: '🫖', label: 'Teapot',     isTarget: false },
      { id: 'salt',   emoji: '🧂', label: 'Salt',       isTarget: false },
      { id: 'milk',   emoji: '🥛', label: 'Milk',       isTarget: false },
      { id: 'lemon',  emoji: '🍋', label: 'Lemon',      isTarget: true  },
      { id: 'carrot2',emoji: '🥕', label: 'Carrot',     isTarget: false },
    ],
  },
  {
    title: 'Outer Space',
    bgClass: 'from-indigo-100 to-purple-200 dark:from-indigo-950 dark:to-purple-950',
    prompt: 'Find the PLANET 🪐',
    hint: 'It is big, round, and has land and oceans!',
    aiFact: 'AI helps NASA identify planets and moons from telescope photos automatically! 🌍',
    items: [
      { id: 'rocket', emoji: '🚀', label: 'Rocket',     isTarget: false },
      { id: 'star',   emoji: '⭐', label: 'Star',       isTarget: false },
      { id: 'earth',  emoji: '🌍', label: 'Earth',      isTarget: true  },
      { id: 'ufo',    emoji: '🛸', label: 'UFO',        isTarget: false },
      { id: 'comet',  emoji: '☄️', label: 'Comet',      isTarget: false },
      { id: 'moon',   emoji: '🌙', label: 'Moon',       isTarget: false },
      { id: 'scope',  emoji: '🔭', label: 'Telescope',  isTarget: false },
      { id: 'astro',  emoji: '👨‍🚀', label: 'Astronaut', isTarget: false },
    ],
  },
  {
    title: 'Deep in the Forest',
    bgClass: 'from-green-100 to-emerald-200 dark:from-green-950 dark:to-emerald-950',
    prompt: 'Find the BIRD 🦅',
    hint: 'It has feathers and can see in the dark!',
    aiFact: 'AI can identify bird species from a photo to help scientists track migration! 🦉',
    items: [
      { id: 'fox',    emoji: '🦊', label: 'Fox',        isTarget: false },
      { id: 'tree2',  emoji: '🌲', label: 'Pine Tree',  isTarget: false },
      { id: 'mushroom',emoji: '🍄', label: 'Mushroom',  isTarget: false },
      { id: 'owl',    emoji: '🦉', label: 'Owl',        isTarget: true  },
      { id: 'squirrel',emoji: '🐿️', label: 'Squirrel', isTarget: false },
      { id: 'leaf',   emoji: '🌿', label: 'Leaf',       isTarget: false },
      { id: 'bee2',   emoji: '🐝', label: 'Bee',        isTarget: false },
      { id: 'butterfly',emoji: '🦋', label: 'Butterfly', isTarget: false },
    ],
  },
  {
    title: 'At the Playground',
    bgClass: 'from-pink-100 to-rose-100 dark:from-pink-950 dark:to-rose-950',
    prompt: 'Find something to SIT ON 🪑',
    hint: 'Look for something with four legs and a flat top!',
    aiFact: 'Vision-Language AI can describe a whole photo scene to someone who is blind! 🤖',
    items: [
      { id: 'slide',   emoji: '🛝', label: 'Slide',     isTarget: false },
      { id: 'ball',    emoji: '⚽', label: 'Ball',      isTarget: false },
      { id: 'chair',   emoji: '🪑', label: 'Chair',     isTarget: true  },
      { id: 'balloon', emoji: '🎈', label: 'Balloon',   isTarget: false },
      { id: 'runner',  emoji: '🏃', label: 'Runner',    isTarget: false },
      { id: 'carousel',emoji: '🎠', label: 'Carousel',  isTarget: false },
      { id: 'tree3',   emoji: '🌳', label: 'Tree',      isTarget: false },
      { id: 'wheel',   emoji: '🎡', label: 'Ferris Wheel', isTarget: false },
    ],
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const WordFinder: React.FC<WordFinderProps> = ({ onClose }) => {
  const [sceneIdx, setSceneIdx]     = useState(0);
  const [phase, setPhase]           = useState<Phase>('ready');
  const [taps, setTaps]             = useState(0);
  const [wrongIds, setWrongIds]     = useState<Set<string>>(new Set());
  const [correctId, setCorrectId]   = useState<string | null>(null);
  const [earnedStars, setEarnedStars] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [shakeId, setShakeId]       = useState<string | null>(null);
  const [airiMsg,  setAiriMsg]   = useState("Hi! I'm Airi 🤖 Tap the right object in the scene — just like AI Vision does! 👀");
  const [airiMood, setAiriMood]  = useState<AiriMood>('idle');

  const scene = SCENES[sceneIdx];

  // ── Start scene ──────────────────────────────────────────────────────────

  const startScene = useCallback((idx: number) => {
    setTaps(0);
    setWrongIds(new Set());
    setCorrectId(null);
    setEarnedStars(0);
    setShakeId(null);
    setPhase('round');
    setAiriMsg(`${SCENES[idx].prompt} — can you spot it? 🔍`);
    setAiriMood('watching');
  }, []);

  useEffect(() => {
    const t = setTimeout(() => startScene(0), 600);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handle item tap ──────────────────────────────────────────────────────

  const handleItemTap = (item: SceneItem) => {
    if (phase !== 'round') return;
    if (correctId !== null) return;
    if (wrongIds.has(item.id)) return;

    const newTaps = taps + 1;
    setTaps(newTaps);

    if (item.isTarget) {
      const stars = newTaps === 1 ? 3 : newTaps === 2 ? 2 : 1;
      setCorrectId(item.id);
      setEarnedStars(stars);
      setTotalStars((t) => t + stars);
      setPhase('roundComplete');
      setAiriMsg(`${stars === 3 ? '🌟 First try!' : stars === 2 ? '⭐ Well done!' : '✅ Got it!'} ${scene.aiFact}`);
      setAiriMood('celebrating');
    } else {
      setWrongIds((prev) => new Set([...prev, item.id]));
      setShakeId(item.id);
      setTimeout(() => setShakeId(null), 500);
      if (newTaps === 1) {
        setAiriMsg(`Not that one! ${scene.hint} 🔍`);
        setAiriMood('encouraging');
      } else {
        setAiriMsg(`Keep looking — ${scene.hint} 💡`);
        setAiriMood('encouraging');
      }
    }
  };

  // ── Next scene ────────────────────────────────────────────────────────────

  const handleNext = () => {
    const next = sceneIdx + 1;
    if (next >= SCENES.length) {
      setPhase('gameOver');
      setAiriMsg(`Amazing! You finished all 6 scenes with ${totalStars} stars! Vision-Language AI does this for every photo on the internet! 🤖🌍`);
      setAiriMood('celebrating');
    } else {
      setSceneIdx(next);
      startScene(next);
    }
  };

  const handleRestart = () => {
    setSceneIdx(0);
    setTotalStars(0);
    setPhase('ready');
    setAiriMsg("Let's find more objects! 🔍");
    setAiriMood('encouraging');
    setTimeout(() => startScene(0), 300);
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className={`flex flex-col h-full bg-gradient-to-b ${scene.bgClass} overflow-hidden`}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-b border-orange-100 dark:border-orange-900">
        <button
          onPointerDown={onClose}
          className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-300 hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg px-2 py-1"
        >
          ← Back
        </button>
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-orange-700 dark:text-orange-300">Spot It! 👀</h2>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">
            {phase !== 'gameOver' ? `Scene ${sceneIdx + 1} of ${SCENES.length}` : 'Game Over'}
          </p>
        </div>
        <button
          onPointerDown={handleRestart}
          className="text-sm font-bold text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700 rounded-lg px-3 py-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/30 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        >
          🔄 New
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-3 pb-1">
        {SCENES.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < sceneIdx ? 'bg-orange-500' : i === sceneIdx ? 'bg-orange-400 ring-2 ring-orange-300' : 'bg-orange-200 dark:bg-orange-800'}`} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center gap-4 px-4 pb-28 pt-2 overflow-y-auto">

        {/* Round phase */}
        {(phase === 'round' || phase === 'roundComplete') && (
          <>
            {/* Scene title + prompt */}
            <div className="w-full max-w-sm">
              <h3 className="text-center text-base font-extrabold text-gray-700 dark:text-gray-200 mb-1">{scene.title}</h3>
              <div className="text-center bg-orange-500 text-white font-extrabold text-lg px-5 py-2 rounded-2xl shadow">
                {scene.prompt}
              </div>
            </div>

            {/* Emoji grid scene */}
            <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
              {scene.items.map((item) => {
                const isCorrect = correctId === item.id;
                const isWrong   = wrongIds.has(item.id);
                const isShaking = shakeId === item.id;

                let cellStyle = 'bg-white/70 dark:bg-gray-800/60 border-2 border-white/60 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 active:scale-90 cursor-pointer';
                if (isCorrect) {
                  cellStyle = 'bg-green-200 dark:bg-green-800/60 border-2 border-green-400 dark:border-green-500 scale-110 shadow-lg';
                } else if (isWrong) {
                  cellStyle = 'bg-red-100 dark:bg-red-900/40 border-2 border-red-300 dark:border-red-600 opacity-50 cursor-default';
                } else if (phase === 'roundComplete') {
                  cellStyle = 'bg-white/40 dark:bg-gray-800/40 border-2 border-white/40 opacity-60 cursor-default';
                }

                return (
                  <button
                    key={item.id}
                    onPointerDown={() => handleItemTap(item)}
                    disabled={phase === 'roundComplete' || isWrong}
                    aria-label={item.label}
                    className={`
                      flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-150 select-none
                      ${cellStyle}
                      ${isShaking ? 'animate-[wiggle_0.4s_ease-in-out]' : ''}
                    `}
                    style={isShaking ? { animation: 'wiggle 0.4s ease-in-out' } : undefined}
                  >
                    <span className={`text-3xl transition-transform duration-150 ${isCorrect ? 'scale-125 animate-bounce' : ''}`}>
                      {item.emoji}
                    </span>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 text-center leading-tight">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Round complete overlay */}
            {phase === 'roundComplete' && (
              <div className="flex flex-col items-center gap-3 mt-2 animate-bounce">
                <div className="text-3xl">{'⭐'.repeat(earnedStars)}{'🖤'.repeat(Math.max(0, 3 - earnedStars))}</div>
                <p className="text-base font-extrabold text-orange-700 dark:text-orange-200">
                  {earnedStars === 3 ? 'Perfect spot!' : earnedStars === 2 ? 'Nice find!' : 'Found it!'}
                </p>
                <button
                  onPointerDown={handleNext}
                  className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                  {sceneIdx < SCENES.length - 1 ? 'Next Scene →' : '🎉 Finish!'}
                </button>
              </div>
            )}
          </>
        )}

        {/* Game over */}
        {phase === 'gameOver' && (
          <div className="text-center py-6">
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-200 mb-1">All Scenes Found!</p>
            <p className="text-base text-orange-500 dark:text-orange-400 mb-2">
              Total stars: {'⭐'.repeat(Math.min(totalStars, 18))}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs mx-auto">
              Vision-Language AI does this for billions of images every day — helping blind people, powering search engines, and even diagnosing diseases! 🤖🌍
            </p>
            <button
              onPointerDown={handleRestart}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}

        {/* Ready state */}
        {phase === 'ready' && (
          <p className="text-lg font-extrabold text-orange-600 dark:text-orange-300 animate-pulse mt-12">Get ready to spot! 👀</p>
        )}
      </div>

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
