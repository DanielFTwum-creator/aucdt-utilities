/**
 * Emotion Faces — "Help Airi Read Feelings"
 *
 * AI-for-Good framing: AI learns to recognise emotions in faces — this helps build
 * tools for children with autism to better understand social cues, and powers
 * empathy AI for companion robots that notice when someone is lonely or upset.
 *
 * Game flow:
 *  playing → (10 rounds, pick emotion from 4 buttons) →
 *  correct: celebrate + AI fact | wrong: hint + reveal →
 *  gameOver → star rating → celebration
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

// ── Types ────────────────────────────────────────────────────────────────────

type EmotionId = 'happy' | 'sad' | 'angry' | 'scared' | 'surprised' | 'proud' | 'excited' | 'worried';
type Phase = 'playing' | 'correct' | 'wrong' | 'gameOver';

interface EmotionDef {
  id: EmotionId;
  label: string;
  emoji: string;
  bg: string;
  border: string;
  text: string;
}

interface Scenario {
  face: string;
  situation: string;
  answer: EmotionId;
  options: EmotionId[];
  aiFact: string;
}

// ── Emotion palette ──────────────────────────────────────────────────────────

const EMOTIONS: Record<EmotionId, EmotionDef> = {
  happy:     { id: 'happy',     label: 'Happy',     emoji: '😊', bg: 'bg-yellow-100',  border: 'border-yellow-400',  text: 'text-yellow-700'  },
  sad:       { id: 'sad',       label: 'Sad',        emoji: '😢', bg: 'bg-blue-100',    border: 'border-blue-400',    text: 'text-blue-700'    },
  angry:     { id: 'angry',     label: 'Angry',      emoji: '😠', bg: 'bg-red-100',     border: 'border-red-400',     text: 'text-red-700'     },
  scared:    { id: 'scared',    label: 'Scared',     emoji: '😨', bg: 'bg-gray-100',    border: 'border-gray-400',    text: 'text-gray-700'    },
  surprised: { id: 'surprised', label: 'Surprised',  emoji: '😲', bg: 'bg-orange-100',  border: 'border-orange-400',  text: 'text-orange-700'  },
  proud:     { id: 'proud',     label: 'Proud',      emoji: '🦁', bg: 'bg-green-100',   border: 'border-green-400',   text: 'text-green-700'   },
  excited:   { id: 'excited',   label: 'Excited',    emoji: '🤩', bg: 'bg-pink-100',    border: 'border-pink-400',    text: 'text-pink-700'    },
  worried:   { id: 'worried',   label: 'Worried',    emoji: '😟', bg: 'bg-purple-100',  border: 'border-purple-400',  text: 'text-purple-700'  },
};

// ── AI facts pool ────────────────────────────────────────────────────────────

const AI_FACTS = [
  'AI learns to read emotions from millions of facial expressions to help children with autism understand feelings! 🤖💙',
  'Emotion-recognition AI helps companion robots notice when someone is lonely or upset! 🤖',
  'AI-powered glasses can describe facial expressions to blind people in real time! 👓',
  'Hospitals use emotion AI to check if patients are in pain — even when they can\'t speak! 🏥',
  'AI can detect sadness in a person\'s voice to connect them with mental health support! 🎙️',
];

// ── Scenario pool (12 scenarios — shuffled each game) ───────────────────────

const SCENARIO_POOL: Scenario[] = [
  {
    face: '😊', situation: 'Sam got the highest score in the class test!',
    answer: 'happy', options: ['happy', 'sad', 'worried', 'scared'],
    aiFact: AI_FACTS[0],
  },
  {
    face: '😢', situation: "Kofi's favourite toy broke and can't be fixed.",
    answer: 'sad', options: ['sad', 'happy', 'excited', 'proud'],
    aiFact: AI_FACTS[1],
  },
  {
    face: '😠', situation: "Someone took Maya's lunch without asking.",
    answer: 'angry', options: ['angry', 'surprised', 'happy', 'worried'],
    aiFact: AI_FACTS[2],
  },
  {
    face: '😨', situation: 'There was a very loud thunderstorm in the middle of the night.',
    answer: 'scared', options: ['scared', 'angry', 'sad', 'surprised'],
    aiFact: AI_FACTS[3],
  },
  {
    face: '😲', situation: 'Ama opened her birthday present and found exactly what she wanted!',
    answer: 'surprised', options: ['surprised', 'happy', 'excited', 'proud'],
    aiFact: AI_FACTS[4],
  },
  {
    face: '🦁', situation: 'David finished reading his first chapter book all by himself.',
    answer: 'proud', options: ['proud', 'happy', 'excited', 'worried'],
    aiFact: AI_FACTS[0],
  },
  {
    face: '🤩', situation: "It's the last day of school before the long holiday begins!",
    answer: 'excited', options: ['excited', 'proud', 'happy', 'scared'],
    aiFact: AI_FACTS[1],
  },
  {
    face: '😟', situation: 'Kwame has a big presentation tomorrow and hasn\'t practised enough.',
    answer: 'worried', options: ['worried', 'sad', 'scared', 'angry'],
    aiFact: AI_FACTS[2],
  },
  {
    face: '😢', situation: "Nana's best friend moved to a different town far away.",
    answer: 'sad', options: ['sad', 'worried', 'angry', 'scared'],
    aiFact: AI_FACTS[3],
  },
  {
    face: '😠', situation: 'Someone keeps interrupting Yaa every time she tries to speak.',
    answer: 'angry', options: ['angry', 'worried', 'sad', 'surprised'],
    aiFact: AI_FACTS[4],
  },
  {
    face: '🦁', situation: 'Abena won first place in the school science fair with her project!',
    answer: 'proud', options: ['proud', 'excited', 'happy', 'surprised'],
    aiFact: AI_FACTS[0],
  },
  {
    face: '😲', situation: 'The teacher announced a surprise pizza party for the whole class today!',
    answer: 'surprised', options: ['surprised', 'excited', 'happy', 'worried'],
    aiFact: AI_FACTS[1],
  },
];

const TOTAL_ROUNDS = 10;

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function starRating(score: number): number {
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  return 1;
}

// ── Component ────────────────────────────────────────────────────────────────

export const EmotionFaces: React.FC<Props> = ({ onClose }) => {
  const [scenarios, setScenarios]     = useState<Scenario[]>([]);
  const [round, setRound]             = useState(0);
  const [phase, setPhase]             = useState<Phase>('playing');
  const [score, setScore]             = useState(0);
  const [streak, setStreak]           = useState(0);
  const [bonusStars, setBonusStars]   = useState(0);
  const [picked, setPicked]           = useState<EmotionId | null>(null);
  const [airiMsg, setAiriMsg]         = useState("Let's help Airi learn feelings! Look at the face and choose the right emotion! 🤖💛");
  const [airiMood, setAiriMood]       = useState<AiriMood>('idle');
  const [factText, setFactText]       = useState('');
  const [streakFlash, setStreakFlash] = useState(false);

  const initGame = useCallback(() => {
    const picked12 = shuffle(SCENARIO_POOL).slice(0, TOTAL_ROUNDS);
    setScenarios(picked12);
    setRound(0);
    setPhase('playing');
    setScore(0);
    setStreak(0);
    setBonusStars(0);
    setPicked(null);
    setFactText('');
    setStreakFlash(false);
    setAiriMsg("Let's help Airi learn feelings! Look at the face and choose the right emotion! 🤖💛");
    setAiriMood('idle');
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const scenario = scenarios[round];
  if (!scenario) return null;

  const handlePick = (id: EmotionId) => {
    if (phase !== 'playing') return;
    setPicked(id);

    const isCorrect = id === scenario.answer;

    if (isCorrect) {
      const newStreak = streak + 1;
      const newScore  = score + 1;
      setScore(newScore);
      setStreak(newStreak);

      let msg = `That's right! ${EMOTIONS[id].emoji} Great job! `;
      let bonus = bonusStars;
      if (newStreak % 3 === 0) {
        bonus += 1;
        setBonusStars(bonus);
        setStreakFlash(true);
        msg += '3 in a row — bonus ⭐! ';
        setTimeout(() => setStreakFlash(false), 1200);
      }
      msg += scenario.aiFact;
      setFactText(scenario.aiFact);
      setAiriMsg(msg);
      setAiriMood('celebrating');
      setPhase('correct');
    } else {
      const correct = EMOTIONS[scenario.answer];
      setStreak(0);
      setFactText('');
      setAiriMsg(`Not quite! The answer was ${correct.label} ${correct.emoji}. AI learns from every example — so do you! 💪`);
      setAiriMood('encouraging');
      setPhase('wrong');
    }
  };

  const handleNext = () => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setPhase('gameOver');
      setAiriMsg("You finished! You've trained my emotion sensors! 🤖🎉");
      setAiriMood('celebrating');
    } else {
      setRound(nextRound);
      setPhase('playing');
      setPicked(null);
      setFactText('');
      setAiriMsg(`Round ${nextRound + 1}! What emotion do you see? 🔍`);
      setAiriMood('watching');
    }
  };

  // ── Game Over screen ─────────────────────────────────────────────────────────
  if (phase === 'gameOver') {
    const stars = starRating(score);
    const totalBonus = bonusStars;
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-rose-200 dark:border-rose-800 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-rose-600 dark:text-rose-300 hover:underline transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-rose-700 dark:text-rose-300 tracking-wide">😊 Emotion Faces</h1>
          <span />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
          <div className="text-7xl animate-bounce">🤖</div>
          <h2 className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
            {score >= 9 ? 'Emotion Expert!' : score >= 6 ? 'Great Reader!' : 'Keep Practising!'}
          </h2>
          <p className="text-rose-600 dark:text-rose-400 font-bold text-lg">{score} / {TOTAL_ROUNDS} correct</p>

          <div className="flex gap-1 text-3xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < stars ? '' : 'opacity-20'}>⭐</span>
            ))}
          </div>

          {totalBonus > 0 && (
            <p className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-2xl px-4 py-2 border border-amber-200 dark:border-amber-700">
              +{totalBonus} bonus ⭐ for streaks!
            </p>
          )}

          <p className="text-rose-700/80 dark:text-rose-300/80 text-sm max-w-sm bg-white/60 dark:bg-white/10 rounded-2xl p-4 border border-rose-200 dark:border-rose-700 italic leading-relaxed">
            🤖 Real AI learns to read emotions the same way — from thousands of labelled examples just like yours. This helps build tools for children with autism and companion robots that truly care! 💙
          </p>

          <button type="button" onClick={initGame}
            className="px-8 py-3 rounded-full bg-rose-500 text-white font-extrabold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-lg">
            🔄 Play Again
          </button>
        </div>

        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Main game screen ─────────────────────────────────────────────────────────
  const options = scenario.options.map(id => EMOTIONS[id]);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-rose-200 dark:border-rose-800 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-rose-600 dark:text-rose-300 hover:underline transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-rose-700 dark:text-rose-300 tracking-wide">😊 Emotion Faces</h1>
        <span className="text-xs text-rose-500 dark:text-rose-400 font-semibold">
          {round + 1} / {TOTAL_ROUNDS}
        </span>
      </div>

      {/* Score bar */}
      <div className="px-5 pt-3 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-rose-600 dark:text-rose-400">⭐ Score: {score}</span>
          {streak >= 2 && (
            <span className={`text-xs font-extrabold text-amber-600 dark:text-amber-400 transition-all ${streakFlash ? 'scale-125 animate-bounce' : ''}`}>
              🔥 {streak} streak!
            </span>
          )}
        </div>
        <div className="w-full bg-rose-100 dark:bg-rose-900/40 rounded-full h-2.5 overflow-hidden border border-rose-200 dark:border-rose-800">
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-500"
            style={{ width: `${(score / TOTAL_ROUNDS) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-5">

        {/* Face + situation card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-rose-200 dark:border-rose-700 p-6 text-center space-y-3">
          <div className="text-8xl leading-none">{scenario.face}</div>
          <p className="text-base font-bold text-gray-700 dark:text-gray-200 leading-snug">{scenario.situation}</p>
          <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold italic">How does this person feel?</p>
        </div>

        {/* Emotion buttons */}
        <div className="grid grid-cols-2 gap-3">
          {options.map(em => {
            const isSelected  = picked === em.id;
            const isCorrectEm = em.id === scenario.answer;
            const revealed    = phase === 'correct' || phase === 'wrong';

            let cardClass = `flex flex-col items-center gap-2 py-5 rounded-2xl border-[3px] transition-all duration-200 active:scale-95 `;
            if (!revealed) {
              cardClass += `${em.bg} border-transparent hover:${em.border} hover:scale-105 cursor-pointer dark:bg-opacity-30`;
            } else if (isCorrectEm) {
              cardClass += `${em.bg} ${em.border} scale-105 shadow-md dark:bg-opacity-30`;
            } else if (isSelected && !isCorrectEm) {
              cardClass += 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-600 opacity-60';
            } else {
              cardClass += `${em.bg} border-transparent opacity-40 cursor-default dark:bg-opacity-20`;
            }

            return (
              <button
                key={em.id}
                type="button"
                disabled={phase !== 'playing'}
                onClick={() => handlePick(em.id)}
                className={cardClass}
              >
                <span className="text-4xl">{em.emoji}</span>
                <span className={`text-sm font-extrabold ${em.text} dark:opacity-90`}>{em.label}</span>
                {revealed && isCorrectEm && (
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400">✓ Correct!</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Fact + Next button */}
        {(phase === 'correct' || phase === 'wrong') && (
          <div className={`rounded-2xl border p-4 text-center space-y-3 ${
            phase === 'correct'
              ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700'
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
          }`}>
            {factText && (
              <>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">🤖 AI Fact</p>
                <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">{factText}</p>
              </>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 rounded-full bg-rose-500 text-white font-extrabold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
            >
              {round + 1 >= TOTAL_ROUNDS ? '🎉 See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
