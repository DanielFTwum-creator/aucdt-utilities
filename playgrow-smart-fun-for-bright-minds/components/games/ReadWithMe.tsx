/**
 * ReadWithMe — "Reading Buddy"
 *
 * AI-for-Good framing: AI Text-to-Speech reads books aloud for blind people,
 * people with dyslexia, and anyone who struggles to read — in over 70 languages.
 * Kids experience this by tapping highlighted words to "read along" with Airi,
 * mirroring how TTS AI highlights words as it speaks them.
 *
 * Game flow:
 *  ready → reading (word-by-word highlight every 600ms, child must tap) →
 *  question (1 comprehension question, 3 choices) → passageComplete →
 *  next passage | gameOver after all 5 passages
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface ReadWithMeProps {
  onClose: () => void;
}

type Phase = 'ready' | 'reading' | 'question' | 'passageComplete' | 'gameOver';

// ── Passages ─────────────────────────────────────────────────────────────────

interface Question {
  text: string;
  choices: string[];
  correct: number; // index into choices
}

interface Passage {
  title: string;
  emoji: string;
  text: string;
  question: Question;
}

const PASSAGES: Passage[] = [
  {
    title: 'The Busy Bee',
    emoji: '🐝',
    text: 'Bees visit flowers every day to collect sweet nectar. They carry pollen on their fuzzy legs from flower to flower. This helps plants grow new seeds. Without bees, many fruits and vegetables would not exist. Bees are tiny but incredibly important!',
    question: {
      text: 'What do bees carry on their legs?',
      choices: ['Honey', 'Pollen', 'Nectar'],
      correct: 1,
    },
  },
  {
    title: 'Rain and Rivers',
    emoji: '🌧️',
    text: 'When rain falls from the sky, it flows down hills and into streams. Streams join together to form rivers. Rivers carry fresh water to towns and cities. Animals drink from rivers and fish live inside them. Rivers are like the veins of the Earth.',
    question: {
      text: 'Where does rain water go after it falls on hills?',
      choices: ['Into the ocean directly', 'Into streams and rivers', 'Into clouds again'],
      correct: 1,
    },
  },
  {
    title: 'The Clever Crow',
    emoji: '🐦‍⬛',
    text: 'Crows are one of the smartest birds in the world. They can remember human faces for years. Crows use sticks as tools to reach food in narrow holes. They even drop nuts on roads for cars to crack open. A crow never forgets a friend or an enemy!',
    question: {
      text: 'How do crows crack open nuts on the road?',
      choices: ['They use their beaks', 'They drop them for cars to crush', 'They use rocks'],
      correct: 1,
    },
  },
  {
    title: 'Sleeping Bears',
    emoji: '🐻',
    text: 'Bears eat a huge amount of food in autumn to prepare for winter. Then they find a cosy cave or hollow tree to sleep in. This long winter sleep is called hibernation. Their heartbeat slows down to save energy. They wake up in spring feeling hungry and refreshed!',
    question: {
      text: 'What is a bear\'s long winter sleep called?',
      choices: ['Hibernation', 'Migration', 'Napping'],
      correct: 0,
    },
  },
  {
    title: 'Seeds on the Wind',
    emoji: '🌱',
    text: 'Some plants spread their seeds in amazing ways. Dandelion seeds float on the breeze like tiny parachutes. Maple seeds spin like helicopters as they fall. Coconuts can travel across the ocean to grow on distant beaches. Nature is a brilliant seed-spreading machine!',
    question: {
      text: 'How do dandelion seeds travel?',
      choices: ['They sink into the ground', 'They float on the breeze', 'Animals carry them'],
      correct: 1,
    },
  },
];

// ── AI facts ─────────────────────────────────────────────────────────────────

const AI_FACTS = [
  'AI Text-to-Speech reads books aloud for blind people in over 70 languages! 📚🤖',
  'AI helps children with dyslexia by reading text aloud and highlighting each word — just like we did! 🧠',
  'Screen readers powered by AI give blind people access to the entire internet! 🌐',
  'AI can now read text from photos — like signs and menus — aloud in real time! 📸',
  'AI voices sound so natural today that many people cannot tell them apart from humans! 🎙️',
];

// ── Component ─────────────────────────────────────────────────────────────────

export const ReadWithMe: React.FC<ReadWithMeProps> = ({ onClose }) => {
  const [passageIdx, setPassageIdx] = useState(0);
  const [phase, setPhase]           = useState<Phase>('ready');
  const [wordIdx, setWordIdx]        = useState(-1);
  const [awaitingTap, setAwaitingTap] = useState(false);
  const [wrongTap, setWrongTap]      = useState(false);
  const [answerTries, setAnswerTries] = useState(0);
  const [chosenAnswer, setChosenAnswer] = useState<number | null>(null);
  const [answerCorrect, setAnswerCorrect] = useState<boolean | null>(null);
  const [earnedStars, setEarnedStars]   = useState(0);
  const [totalStars, setTotalStars]     = useState(0);
  const [airiMsg,  setAiriMsg]   = useState("Hi! I'm Airi 🤖 Let's read together! I'll highlight each word — tap it to keep up!");
  const [airiMood, setAiriMood]  = useState<AiriMood>('idle');

  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wordsRef  = useRef<string[]>([]);

  const passage = PASSAGES[passageIdx];

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  // ── Start reading a passage ───────────────────────────────────────────────

  const startReading = useCallback(() => {
    const words = passage.text.split(' ');
    wordsRef.current = words;
    setWordIdx(0);
    setAwaitingTap(true);
    setWrongTap(false);
    setPhase('reading');
    setAiriMsg('Tap each glowing word as I read! 👆✨');
    setAiriMood('watching');
  }, [passage]);

  // Auto-advance word after 600ms IF child has tapped (awaitingTap becomes false)
  // We use a separate effect that watches wordIdx + awaitingTap
  useEffect(() => {
    if (phase !== 'reading') return;
    if (awaitingTap) return; // wait for tap

    clearTimer();
    timerRef.current = setTimeout(() => {
      const next = wordIdx + 1;
      if (next >= wordsRef.current.length) {
        // Passage done — go to question
        setWordIdx(-1);
        setPhase('question');
        setAnswerTries(0);
        setChosenAnswer(null);
        setAnswerCorrect(null);
        setAiriMsg('Great reading! Now answer a quick question! 🤔');
        setAiriMood('thinking');
      } else {
        setWordIdx(next);
        setAwaitingTap(true);
      }
    }, 600);

    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, awaitingTap, wordIdx]);

  // ── Word tap ─────────────────────────────────────────────────────────────

  const handleWordTap = (idx: number) => {
    if (phase !== 'reading' || !awaitingTap) return;

    if (idx === wordIdx) {
      setAwaitingTap(false);
      setWrongTap(false);
      setAiriMsg('Nice! Keep going! 👏');
      setAiriMood('happy');
    } else {
      setWrongTap(true);
      setAiriMsg('Tap the glowing word — the highlighted one! ✨');
      setAiriMood('encouraging');
    }
  };

  // ── Answer comprehension question ────────────────────────────────────────

  const handleAnswer = (choiceIdx: number) => {
    if (phase !== 'question' || chosenAnswer !== null) return;

    const correct = passage.question.correct;
    const isCorrect = choiceIdx === correct;
    const tries = answerTries + 1;

    setChosenAnswer(choiceIdx);
    setAnswerCorrect(isCorrect);
    setAnswerTries(tries);

    let stars = 0;
    if (isCorrect) {
      stars = tries === 1 ? 3 : tries === 2 ? 2 : 1;
      const newTotal = totalStars + stars;
      setTotalStars(newTotal);
      setEarnedStars(stars);
      setPhase('passageComplete');
      const fact = AI_FACTS[passageIdx % AI_FACTS.length];
      setAiriMsg(`${stars === 3 ? '🌟 Perfect!' : stars === 2 ? '⭐ Well done!' : '✅ Good try!'} ${fact}`);
      setAiriMood('celebrating');
    } else {
      if (tries >= 3) {
        // Give up — show answer
        setEarnedStars(0);
        setPhase('passageComplete');
        setAiriMsg(`The answer was "${passage.question.choices[correct]}"! You\'ll get the next one! 💪`);
        setAiriMood('encouraging');
      } else {
        setAiriMsg(tries === 1 ? 'Not quite — try again! 🤔' : 'One more try! Read the passage clues! 📖');
        setAiriMood('encouraging');
        // Allow retry
        setTimeout(() => {
          setChosenAnswer(null);
          setAnswerCorrect(null);
        }, 900);
      }
    }
  };

  // ── Next passage ─────────────────────────────────────────────────────────

  const handleNextPassage = () => {
    const next = passageIdx + 1;
    if (next >= PASSAGES.length) {
      setPhase('gameOver');
      setAiriMsg(`Amazing reader! You finished all 5 stories! Total stars: ${'⭐'.repeat(Math.min(totalStars, 15))} 🎉`);
      setAiriMood('celebrating');
    } else {
      setPassageIdx(next);
      setPhase('ready');
      setWordIdx(-1);
      setAiriMsg(`Story ${next + 1} of ${PASSAGES.length}! Let\'s keep reading! 📖`);
      setAiriMood('happy');
    }
  };

  const handleRestart = () => {
    clearTimer();
    setPassageIdx(0);
    setPhase('ready');
    setWordIdx(-1);
    setTotalStars(0);
    setAiriMsg("Let's read all over again! 📚");
    setAiriMood('encouraging');
  };

  // Start first passage on mount
  useEffect(() => {
    const t = setTimeout(() => startReading(), 800);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passageIdx]);

  // ── Render words with highlight ───────────────────────────────────────────

  const words = passage.text.split(' ');

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
          <h2 className="text-lg font-extrabold text-orange-700 dark:text-orange-300">Reading Buddy 📖</h2>
          <p className="text-xs text-orange-500 dark:text-orange-400 font-semibold">Story {passageIdx + 1} of {PASSAGES.length}</p>
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
        {PASSAGES.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < passageIdx ? 'bg-orange-500' : i === passageIdx ? 'bg-orange-400 ring-2 ring-orange-300' : 'bg-orange-200 dark:bg-orange-800'}`} />
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-2 flex flex-col gap-4">

        {/* Passage card */}
        {(phase === 'reading' || phase === 'ready') && (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 shadow-md border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{passage.emoji}</span>
              <h3 className="text-lg font-extrabold text-orange-700 dark:text-orange-300">{passage.title}</h3>
            </div>
            <p className="leading-8 text-base text-gray-700 dark:text-gray-200 select-none">
              {words.map((word, i) => {
                const isHighlighted = i === wordIdx;
                const isPast = i < wordIdx;
                return (
                  <span
                    key={i}
                    onPointerDown={() => handleWordTap(i)}
                    className={`
                      inline-block mx-0.5 px-1 py-0.5 rounded-md cursor-pointer transition-all duration-150
                      ${isHighlighted
                        ? 'bg-orange-400 text-white font-extrabold scale-110 shadow-lg ring-2 ring-orange-300'
                        : isPast
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-900/30'}
                    `}
                  >
                    {word}
                  </span>
                );
              })}
            </p>
            {wrongTap && (
              <p className="mt-2 text-sm font-bold text-red-500 animate-pulse">Tap the glowing word! ✨</p>
            )}
          </div>
        )}

        {/* Question phase */}
        {phase === 'question' && (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-5 shadow-md border border-orange-200 dark:border-orange-800">
            <p className="text-base font-extrabold text-orange-700 dark:text-orange-200 mb-4">❓ {passage.question.text}</p>
            <div className="flex flex-col gap-3">
              {passage.question.choices.map((choice, i) => {
                let style = 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700 text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-orange-800/40';
                if (chosenAnswer === i) {
                  style = answerCorrect
                    ? 'bg-green-100 dark:bg-green-900/40 border-green-400 text-green-700 dark:text-green-300 font-extrabold'
                    : 'bg-red-100 dark:bg-red-900/40 border-red-400 text-red-600 dark:text-red-300';
                }
                return (
                  <button
                    key={i}
                    onPointerDown={() => handleAnswer(i)}
                    disabled={chosenAnswer !== null}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold transition-all active:scale-95 ${style}`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Passage complete */}
        {phase === 'passageComplete' && (
          <div className="text-center py-6 animate-bounce">
            <div className="text-5xl mb-2">
              {'⭐'.repeat(earnedStars)}{'🖤'.repeat(Math.max(0, 3 - earnedStars))}
            </div>
            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-200 mb-1">
              {passageIdx < PASSAGES.length - 1 ? 'Story complete!' : 'All stories done!'}
            </p>
            <p className="text-sm text-orange-500 dark:text-orange-400 mb-5">
              Total stars so far: {'⭐'.repeat(Math.min(totalStars, 15))}
            </p>
            <button
              onPointerDown={handleNextPassage}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              {passageIdx < PASSAGES.length - 1 ? 'Next Story →' : '🎉 See Results!'}
            </button>
          </div>
        )}

        {/* Game over */}
        {phase === 'gameOver' && (
          <div className="text-center py-6">
            <div className="text-6xl mb-3">🏆</div>
            <p className="text-xl font-extrabold text-orange-700 dark:text-orange-200 mb-1">You are a Reading Star!</p>
            <p className="text-base text-orange-500 dark:text-orange-400 mb-2">Total stars earned: {'⭐'.repeat(Math.min(totalStars, 15))}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs mx-auto">
              AI Text-to-Speech reads like this for millions of people who cannot read on their own. You just experienced what AI can do! 🤖📖
            </p>
            <button
              onPointerDown={handleRestart}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Play Again 🔄
            </button>
          </div>
        )}
      </div>

      {/* Airi companion */}
      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
