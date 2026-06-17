/**
 * Gratitude Moments — "Teach Airi to Feel"
 *
 * AI-for-Good framing: AI learns to understand human emotions from labelled
 * examples — this is called "sentiment analysis". It powers mental health
 * chatbots, detects bullying online, and helps doctors monitor patient wellbeing.
 *
 * Game flow:
 *  - Airi presents a scenario (a thing that happened to a child)
 *  - Kid picks the emotion it would cause from 4 illustrated options
 *  - Kid picks how STRONG the feeling is (1-3 scale)
 *  - Each correct label fills Airi's "Emotional Vocabulary" progress bar
 *  - 8 rounds → celebration + AI fact + journal prompt
 *  - Persistent gratitude jar (localStorage) remains for free journalling
 */

import React, { useState, useEffect, useRef } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

// ── Emotion definitions ──────────────────────────────────────────────────────

interface Emotion {
  id: string;
  label: string;
  emoji: string;
  color: string;          // Tailwind bg class
  border: string;         // Tailwind border class
  textColor: string;
}

const EMOTIONS: Emotion[] = [
  { id: 'happy',    label: 'Happy',    emoji: '😊', color: 'bg-yellow-100', border: 'border-yellow-400', textColor: 'text-yellow-700' },
  { id: 'sad',      label: 'Sad',      emoji: '😢', color: 'bg-blue-100',   border: 'border-blue-400',   textColor: 'text-blue-700'   },
  { id: 'excited',  label: 'Excited',  emoji: '🤩', color: 'bg-orange-100', border: 'border-orange-400', textColor: 'text-orange-700' },
  { id: 'worried',  label: 'Worried',  emoji: '😟', color: 'bg-purple-100', border: 'border-purple-400', textColor: 'text-purple-700' },
  { id: 'proud',    label: 'Proud',    emoji: '🦁', color: 'bg-green-100',  border: 'border-green-400',  textColor: 'text-green-700'  },
  { id: 'scared',   label: 'Scared',   emoji: '😨', color: 'bg-gray-100',   border: 'border-gray-400',   textColor: 'text-gray-700'   },
  { id: 'loved',    label: 'Loved',    emoji: '🥰', color: 'bg-pink-100',   border: 'border-pink-400',   textColor: 'text-pink-700'   },
  { id: 'angry',    label: 'Angry',    emoji: '😠', color: 'bg-red-100',    border: 'border-red-400',    textColor: 'text-red-700'    },
];

// ── Scenario cards ───────────────────────────────────────────────────────────

interface Scenario {
  text: string;
  emoji: string;
  correctEmotion: string;  // id from EMOTIONS
  options: string[];       // ids of the 4 choices (includes correctEmotion)
  aiFact: string;
}

const SCENARIOS: Scenario[] = [
  {
    text: 'You scored the winning goal in a football match and everyone cheered!',
    emoji: '⚽',
    correctEmotion: 'excited',
    options: ['excited', 'sad', 'worried', 'scared'],
    aiFact: 'AI learned to recognise excitement from millions of fan messages after sports games! ⚽🤖',
  },
  {
    text: 'Your best friend moved to a different city and you won\'t see them every day.',
    emoji: '👋',
    correctEmotion: 'sad',
    options: ['happy', 'sad', 'excited', 'proud'],
    aiFact: 'AI can detect sadness in text messages to help people find support when they need it most. 💙',
  },
  {
    text: 'You drew a picture and your teacher hung it on the classroom wall!',
    emoji: '🖼️',
    correctEmotion: 'proud',
    options: ['proud', 'worried', 'angry', 'scared'],
    aiFact: 'AI learns "proud" feelings from success stories — it helps write encouraging messages for students! 🎨',
  },
  {
    text: 'It is the night before your birthday and you can\'t wait to open your presents!',
    emoji: '🎁',
    correctEmotion: 'excited',
    options: ['sad', 'excited', 'angry', 'loved'],
    aiFact: 'AI detects excitement to help event companies know when people are truly looking forward to something! 🎉',
  },
  {
    text: 'You got lost in a big shopping centre and couldn\'t find your mum.',
    emoji: '🏬',
    correctEmotion: 'scared',
    options: ['happy', 'proud', 'scared', 'excited'],
    aiFact: 'AI recognises fear in emergency text messages so help can arrive faster in a crisis! 🚨',
  },
  {
    text: 'Your grandma gave you a big hug and said she was so glad to see you.',
    emoji: '🤗',
    correctEmotion: 'loved',
    options: ['loved', 'sad', 'worried', 'angry'],
    aiFact: 'AI learns what "loved" looks like in stories — it helps design chatbots that make lonely people feel less alone. 💗',
  },
  {
    text: 'You studied really hard for a test but you got a low mark anyway.',
    emoji: '📝',
    correctEmotion: 'sad',
    options: ['excited', 'happy', 'sad', 'proud'],
    aiFact: 'AI detects disappointment in student feedback to help teachers improve their lessons! 📚',
  },
  {
    text: 'Your little sister broke your favourite toy by accident.',
    emoji: '🧸',
    correctEmotion: 'angry',
    options: ['happy', 'loved', 'angry', 'excited'],
    aiFact: 'AI learns to spot anger in social media posts to detect bullying and keep children safe online! 🛡️',
  },
];

const INTENSITY_LABELS = ['A little', 'Quite a lot', 'Very much!'];
const INTENSITY_EMOJIS = ['🌱', '🌿', '🌳'];

// ── Persistent gratitude jar ─────────────────────────────────────────────────

const JOURNAL_EMOJIS = ['😊','🌸','🌈','⭐','🎉','💛','🌿','🦋','🍀','🫶'];
interface JarEntry { text: string; emoji: string; date: string; }
const STORAGE_KEY = 'pg_gratitude_v1';
function loadEntries(): JarEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}
function saveEntries(es: JarEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(es));
}

// ── Component ────────────────────────────────────────────────────────────────

type Phase = 'emotion' | 'intensity' | 'feedback' | 'journal' | 'allDone';

const TOTAL_ROUNDS = SCENARIOS.length;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export const GratitudeMoments: React.FC<Props> = ({ onClose }) => {
  const [order]           = useState(() => shuffle(SCENARIOS.map((_, i) => i)));
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('emotion');

  const [pickedEmotion, setPickedEmotion]   = useState<string | null>(null);
  const [pickedIntensity, setPickedIntensity] = useState<number | null>(null);
  const [correct, setCorrect]               = useState(0);
  const [vocabFill, setVocabFill]           = useState(0);   // 0-100

  const [airiMsg, setAiriMsg]   = useState("Help me learn emotions! Look at the scene below and pick how it makes the child feel. 🤖💛");
  const [airiMood, setAiriMood] = useState<AiriMood>('idle');

  // Gratitude jar
  const [jarEntries, setJarEntries] = useState<JarEntry[]>(loadEntries);
  const [journalText, setJournalText] = useState('');
  const [journalEmoji, setJournalEmoji] = useState('😊');
  const [journalAdded, setJournalAdded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { saveEntries(jarEntries); }, [jarEntries]);

  const scenario = SCENARIOS[order[round]];
  const optionEmotions = scenario.options.map(id => EMOTIONS.find(e => e.id === id)!);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handlePickEmotion = (id: string) => {
    if (phase !== 'emotion') return;
    setPickedEmotion(id);

    const isCorrect = id === scenario.correctEmotion;
    if (isCorrect) {
      setCorrect(c => c + 1);
      setVocabFill(v => Math.min(100, v + Math.round(100 / TOTAL_ROUNDS)));
      setAiriMsg(`Yes! "${EMOTIONS.find(e => e.id === id)?.label}" is right! Now — how strong is that feeling? 💪`);
      setAiriMood('happy');
    } else {
      const correct = EMOTIONS.find(e => e.id === scenario.correctEmotion)!;
      setAiriMsg(`Almost! I'd actually feel "${correct.label}" ${correct.emoji}. How strong would that feeling be? 🤔`);
      setAiriMood('encouraging');
      setPickedEmotion(scenario.correctEmotion); // reveal correct after wrong pick
    }
    setTimeout(() => setPhase('intensity'), 900);
  };

  const handlePickIntensity = (level: number) => {
    if (phase !== 'intensity') return;
    setPickedIntensity(level);
    setPhase('feedback');
    setAiriMsg(scenario.aiFact);
    setAiriMood('celebrating');
  };

  const handleNext = () => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setPhase('journal');
      setAiriMsg("Wow! You taught me so many emotions! Now write one thing you're grateful for today. 📝🌸");
      setAiriMood('happy');
    } else {
      setRound(nextRound);
      setPhase('emotion');
      setPickedEmotion(null);
      setPickedIntensity(null);
      setAiriMsg("Great job! Here's the next scene — what emotion does this show? 🔍");
      setAiriMood('watching');
    }
  };

  const handleAddJournal = () => {
    const t = journalText.trim();
    if (!t) return;
    const entry: JarEntry = {
      text: t,
      emoji: journalEmoji,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    };
    setJarEntries(es => [entry, ...es].slice(0, 30));
    setJournalText('');
    setJournalAdded(true);
    setTimeout(() => {
      setJournalAdded(false);
      setPhase('allDone');
      setAiriMsg("You're amazing! You've helped me understand feelings AND shared your own! 🌟🤖");
      setAiriMood('celebrating');
    }, 1200);
  };

  const handleSkipJournal = () => {
    setPhase('allDone');
    setAiriMsg("Amazing work today! You helped me understand human emotions! 🌟🤖");
    setAiriMood('celebrating');
  };

  const handleRestart = () => {
    setRound(0);
    setPhase('emotion');
    setPickedEmotion(null);
    setPickedIntensity(null);
    setCorrect(0);
    setVocabFill(0);
    setAiriMsg("Help me learn emotions! Look at the scene below and pick how it makes the child feel. 🤖💛");
    setAiriMood('idle');
  };

  // ── All done screen ──────────────────────────────────────────────────────────
  if (phase === 'allDone') {
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur-sm border-b border-amber-200 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-amber-700 tracking-wide">🫶 Teach Airi to Feel</h1>
          <span />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
          <div className="text-7xl animate-bounce">🤖</div>
          <h2 className="text-2xl font-extrabold text-amber-700">Emotional Vocabulary: Complete!</h2>
          <div className="w-full max-w-xs bg-amber-100 rounded-full h-5 border border-amber-300 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full transition-all duration-1000" style={{ width: '100%' }} />
          </div>
          <p className="text-amber-600 font-bold text-sm">{correct} / {TOTAL_ROUNDS} emotions labelled correctly</p>
          <p className="text-amber-700/80 text-sm max-w-sm bg-white/60 rounded-2xl p-4 border border-amber-200 italic">
            🤖 AI learns to understand human feelings the same way you just taught me — from labelled examples. This helps AI support people's mental health, stop online bullying, and build kinder technology!
          </p>
          <button type="button" onClick={handleRestart}
            className="px-8 py-3 rounded-full bg-amber-400 text-white font-extrabold text-sm hover:bg-amber-500 active:scale-95 transition-all shadow-lg">
            🔄 Play Again
          </button>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Journal screen ───────────────────────────────────────────────────────────
  if (phase === 'journal') {
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur-sm border-b border-amber-200 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-amber-700 tracking-wide">🫶 Gratitude Jar</h1>
          <span className="text-xs text-amber-500">{jarEntries.length} {jarEntries.length === 1 ? 'memory' : 'memories'}</span>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 pb-32">
          <div className="bg-white rounded-3xl shadow-md border border-amber-200 p-5 space-y-3">
            <p className="text-sm font-bold text-amber-700">💭 What is one thing you are grateful for today?</p>

            <div className="flex flex-wrap gap-2">
              {JOURNAL_EMOJIS.map(e => (
                <button key={e} type="button" onClick={() => setJournalEmoji(e)}
                  className={`text-xl w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    journalEmoji === e ? 'bg-amber-200 ring-2 ring-amber-400 scale-110' : 'bg-amber-50 hover:bg-amber-100'
                  }`}>
                  {e}
                </button>
              ))}
            </div>

            <textarea
              ref={inputRef}
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              placeholder="Write something here…"
              rows={3}
              className="w-full resize-none rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-gray-700 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <div className="flex gap-2">
              <button type="button" onClick={handleAddJournal} disabled={!journalText.trim()}
                className="flex-1 py-2.5 rounded-full bg-amber-400 text-white font-extrabold text-sm hover:bg-amber-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
                {journalAdded ? '✅ Added!' : `${journalEmoji} Add to Jar`}
              </button>
              <button type="button" onClick={handleSkipJournal}
                className="px-4 py-2.5 rounded-full bg-amber-100 text-amber-600 font-bold text-sm hover:bg-amber-200 active:scale-95 transition-all">
                Skip →
              </button>
            </div>
          </div>

          {jarEntries.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Your jar ✨</p>
              {jarEntries.slice(0, 5).map((e, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-2xl border border-amber-100 px-4 py-3 shadow-sm">
                  <span className="text-2xl shrink-0">{e.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{e.text}</p>
                    <p className="text-[10px] text-amber-400 mt-0.5">{e.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Main game screen ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur-sm border-b border-amber-200 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-amber-700 tracking-wide">🫶 Teach Airi to Feel</h1>
        <span className="text-xs text-amber-500">Round {round + 1} / {TOTAL_ROUNDS}</span>
      </div>

      {/* Vocabulary progress bar */}
      <div className="px-5 pt-3 shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-amber-600">🧠 Airi's Emotional Vocabulary</span>
          <span className="text-xs text-amber-400">{vocabFill}%</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-3 border border-amber-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full transition-all duration-700"
            style={{ width: `${vocabFill}%` }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-5">

        {/* Scenario card */}
        <div className="bg-white rounded-3xl shadow-md border border-amber-200 p-5 text-center space-y-2">
          <p className="text-5xl">{scenario.emoji}</p>
          <p className="text-base font-bold text-gray-700 leading-snug">{scenario.text}</p>
          <p className="text-xs text-amber-500 font-semibold italic">How would this make you feel?</p>
        </div>

        {/* Emotion picker */}
        {(phase === 'emotion' || phase === 'intensity' || phase === 'feedback') && (
          <div className="grid grid-cols-2 gap-3">
            {optionEmotions.map(em => {
              const isSelected = pickedEmotion === em.id;
              const isCorrectOne = em.id === scenario.correctEmotion;
              const showResult = phase !== 'emotion';

              return (
                <button
                  key={em.id}
                  type="button"
                  disabled={phase !== 'emotion'}
                  onClick={() => handlePickEmotion(em.id)}
                  className={[
                    'flex flex-col items-center gap-1.5 py-4 rounded-2xl border-[3px] transition-all duration-200 active:scale-95',
                    showResult && isCorrectOne
                      ? `${em.color} ${em.border} scale-105 shadow-md`
                      : showResult && isSelected && !isCorrectOne
                      ? 'bg-red-50 border-red-300 opacity-60'
                      : phase === 'emotion'
                      ? `${em.color} border-transparent hover:${em.border} hover:scale-105 cursor-pointer`
                      : `${em.color} border-transparent opacity-50 cursor-default`,
                  ].join(' ')}
                >
                  <span className="text-3xl">{em.emoji}</span>
                  <span className={`text-xs font-extrabold ${em.textColor}`}>{em.label}</span>
                  {showResult && isCorrectOne && (
                    <span className="text-[10px] font-bold text-green-600">✓ Correct!</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Intensity picker */}
        {phase === 'intensity' && (
          <div className="bg-white rounded-3xl shadow-md border border-amber-200 p-5 space-y-3">
            <p className="text-sm font-bold text-amber-700 text-center">How strong is that feeling?</p>
            <div className="flex gap-3 justify-center">
              {INTENSITY_LABELS.map((label, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handlePickIntensity(i + 1)}
                  className={[
                    'flex flex-col items-center gap-1 flex-1 py-3 rounded-2xl border-2 transition-all active:scale-95',
                    pickedIntensity === i + 1
                      ? 'border-amber-500 bg-amber-100 scale-105 shadow-md'
                      : 'border-amber-200 bg-white hover:border-amber-400 hover:bg-amber-50 cursor-pointer',
                  ].join(' ')}
                >
                  <span className="text-2xl">{INTENSITY_EMOJIS[i]}</span>
                  <span className="text-[10px] font-bold text-amber-600 text-center">{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI fact feedback */}
        {phase === 'feedback' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-3">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">🤖 AI Fact</p>
            <p className="text-sm text-amber-800 leading-relaxed">{scenario.aiFact}</p>
            <button type="button" onClick={handleNext}
              className="px-8 py-2.5 rounded-full bg-amber-400 text-white font-extrabold text-sm hover:bg-amber-500 active:scale-95 transition-all shadow-sm">
              {round + 1 >= TOTAL_ROUNDS ? '📝 Gratitude Jar →' : 'Next Scene →'}
            </button>
          </div>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
