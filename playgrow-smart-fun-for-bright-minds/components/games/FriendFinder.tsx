/**
 * Friend Finder — "Teach Airi to Be Kind"
 *
 * AI-for-Good framing: AI is being trained to recognise acts of kindness and
 * prosocial behaviour — this helps build kinder social media platforms and
 * companion robots that encourage empathy.
 *
 * Game flow:
 *  - 8 rounds. Each round: social scenario + 3 response options (KIND / NEUTRAL / UNKIND)
 *  - Child picks the kindest response
 *  - Correct: Airi celebrates + AI fact | Wrong: Airi explains (no penalty)
 *  - Kindness Score shown as growing heart bar
 *  - 8 rounds → full heart → celebration
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

// ── Types ────────────────────────────────────────────────────────────────────

type OptionType = 'kind' | 'neutral' | 'unkind';
type Phase = 'playing' | 'correct' | 'wrong' | 'gameOver';

interface Option {
  text: string;
  type: OptionType;
}

interface Scenario {
  situation: string;
  emoji: string;
  options: Option[];
  kindExplanation: string;
  aiFact: string;
}

// ── AI facts ─────────────────────────────────────────────────────────────────

const AI_FACTS = [
  'AI is being trained on millions of kind acts to help social media platforms automatically promote positive content! 🌟',
  'Companion robots use AI kindness models to notice when someone needs encouragement and respond warmly! 🤖💗',
  'AI helps detect online bullying by recognising unkind language patterns — protecting millions of children! 🛡️',
  'Scientists teach AI the difference between kindness and cruelty so it can help make the internet safer! 🌐',
  'AI kindness models are used in schools to encourage positive messages between students online! 📚',
];

// ── Scenario pool (10 scenarios) ─────────────────────────────────────────────

const SCENARIO_POOL: Scenario[] = [
  {
    situation: 'Your classmate drops all their books in the hallway and papers go everywhere.',
    emoji: '📚',
    options: [
      { text: 'Help pick them up and ask if they\'re okay', type: 'kind' },
      { text: 'Walk past and keep going', type: 'neutral' },
      { text: 'Laugh and point them out to friends', type: 'unkind' },
    ],
    kindExplanation: 'Helping someone when they\'re struggling shows you care — and it only takes a moment! 💛',
    aiFact: AI_FACTS[0],
  },
  {
    situation: 'A new child joins your class and sits alone at lunch with no one to talk to.',
    emoji: '🍱',
    options: [
      { text: 'Invite them to sit with your group', type: 'kind' },
      { text: 'Ignore them and carry on eating', type: 'neutral' },
      { text: 'Whisper to your friends about them', type: 'unkind' },
    ],
    kindExplanation: 'Everyone feels nervous being new. One invitation can change someone\'s whole day! 🌟',
    aiFact: AI_FACTS[1],
  },
  {
    situation: 'Your friend is sad because they didn\'t win a prize at the school competition.',
    emoji: '🏆',
    options: [
      { text: 'Tell them they did great and you\'re proud of them', type: 'kind' },
      { text: 'Say nothing and talk about something else', type: 'neutral' },
      { text: 'Say "I would have won if I entered"', type: 'unkind' },
    ],
    kindExplanation: 'Celebrating effort — not just winning — helps friends feel valued no matter what! 💪',
    aiFact: AI_FACTS[2],
  },
  {
    situation: 'An older lady in your neighbourhood is struggling to carry her shopping bags.',
    emoji: '🛍️',
    options: [
      { text: 'Ask if you can help carry some of the bags', type: 'kind' },
      { text: 'Keep walking and mind your own business', type: 'neutral' },
      { text: 'Stare at her and walk away', type: 'unkind' },
    ],
    kindExplanation: 'Small acts of help can mean everything to someone who is struggling — especially elders! 🙏',
    aiFact: AI_FACTS[3],
  },
  {
    situation: 'You notice a classmate being teased about the food in their lunchbox.',
    emoji: '😔',
    options: [
      { text: 'Stand up for them and say the teasing isn\'t cool', type: 'kind' },
      { text: 'Say nothing and look away', type: 'neutral' },
      { text: 'Join in with the teasing', type: 'unkind' },
    ],
    kindExplanation: 'Speaking up for someone who is being teased takes courage — and it shows real kindness! 🦁',
    aiFact: AI_FACTS[4],
  },
  {
    situation: 'Your younger sibling is trying to learn a new game but keeps making mistakes.',
    emoji: '🎮',
    options: [
      { text: 'Patiently show them how to do it step by step', type: 'kind' },
      { text: 'Play by yourself instead', type: 'neutral' },
      { text: 'Grab the controller and say they\'re too slow', type: 'unkind' },
    ],
    kindExplanation: 'Being patient with someone learning is one of the kindest things you can do! 😊',
    aiFact: AI_FACTS[0],
  },
  {
    situation: 'Your teacher looks tired and sad when they come into class this morning.',
    emoji: '👩‍🏫',
    options: [
      { text: 'Say "Good morning" with a big smile and ask how they are', type: 'kind' },
      { text: 'Sit down and wait for the lesson to begin', type: 'neutral' },
      { text: 'Take advantage of their mood to be disruptive', type: 'unkind' },
    ],
    kindExplanation: 'A kind word can lift someone\'s spirits — even teachers need encouragement! 🌸',
    aiFact: AI_FACTS[1],
  },
  {
    situation: 'Your friend worked hard on a drawing but says they think it looks bad.',
    emoji: '🎨',
    options: [
      { text: 'Find something you genuinely like about it and tell them', type: 'kind' },
      { text: 'Say "It\'s okay I suppose"', type: 'neutral' },
      { text: 'Agree that it doesn\'t look good', type: 'unkind' },
    ],
    kindExplanation: 'Honest encouragement helps people keep trying. Looking for the good in others\' work is a gift! 🎁',
    aiFact: AI_FACTS[2],
  },
  {
    situation: 'During a group project, one child is being left out of the decisions.',
    emoji: '🤝',
    options: [
      { text: 'Ask for their ideas and make sure everyone has a voice', type: 'kind' },
      { text: 'Focus on your own part and say nothing', type: 'neutral' },
      { text: 'Tell them their ideas probably won\'t be good anyway', type: 'unkind' },
    ],
    kindExplanation: 'Including everyone makes the whole group stronger — and AI learns this lesson too! 🤖',
    aiFact: AI_FACTS[3],
  },
  {
    situation: 'A child at the park falls off their bike and starts to cry.',
    emoji: '🚲',
    options: [
      { text: 'Run over and ask if they\'re hurt, help them up', type: 'kind' },
      { text: 'Glance over and then carry on playing', type: 'neutral' },
      { text: 'Laugh and call them clumsy', type: 'unkind' },
    ],
    kindExplanation: 'Responding to someone in pain with care — not laughter — shows true kindness! 💙',
    aiFact: AI_FACTS[4],
  },
];

const TOTAL_ROUNDS = 8;

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function shuffleOptions(options: Option[]): Option[] {
  return [...options].sort(() => Math.random() - 0.5);
}

// ── Component ────────────────────────────────────────────────────────────────

export const FriendFinder: React.FC<Props> = ({ onClose }) => {
  const [scenarios, setScenarios]       = useState<Scenario[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<Option[][]>([]);
  const [round, setRound]               = useState(0);
  const [phase, setPhase]               = useState<Phase>('playing');
  const [kindScore, setKindScore]       = useState(0);
  const [picked, setPicked]             = useState<OptionType | null>(null);
  const [airiMsg, setAiriMsg]           = useState("Let's find the kindest choice! Read the situation and pick what you would do. 🤖💗");
  const [airiMood, setAiriMood]         = useState<AiriMood>('idle');

  const initGame = useCallback(() => {
    const chosen = shuffle(SCENARIO_POOL).slice(0, TOTAL_ROUNDS);
    const opts   = chosen.map(s => shuffleOptions(s.options));
    setScenarios(chosen);
    setShuffledOptions(opts);
    setRound(0);
    setPhase('playing');
    setKindScore(0);
    setPicked(null);
    setAiriMsg("Let's find the kindest choice! Read the situation and pick what you would do. 🤖💗");
    setAiriMood('idle');
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  const scenario = scenarios[round];
  const options  = shuffledOptions[round];
  if (!scenario || !options) return null;

  const handlePick = (opt: Option) => {
    if (phase !== 'playing') return;
    setPicked(opt.type);

    if (opt.type === 'kind') {
      setKindScore(s => s + 1);
      setAiriMsg(`${scenario.aiFact}`);
      setAiriMood('celebrating');
      setPhase('correct');
    } else {
      const kindOption = scenario.options.find(o => o.type === 'kind')!;
      setAiriMsg(`The kindest choice was: "${kindOption.text}" — ${scenario.kindExplanation}`);
      setAiriMood('encouraging');
      setPhase('wrong');
    }
  };

  const handleNext = () => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setPhase('gameOver');
      setAiriMsg("You have a heart full of kindness! Let's see your score! 🤖💗🎉");
      setAiriMood('celebrating');
    } else {
      setRound(nextRound);
      setPhase('playing');
      setPicked(null);
      setAiriMsg(`Round ${nextRound + 1}! What's the kindest thing to do here? 💛`);
      setAiriMood('watching');
    }
  };

  const heartFill = Math.round((kindScore / TOTAL_ROUNDS) * 100);

  // ── Heart bar segment renderer ───────────────────────────────────────────────
  const HeartBar = () => (
    <div className="px-5 pt-3 shrink-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">💗 Kindness Score: {kindScore} / {TOTAL_ROUNDS}</span>
        <span className="text-xs text-rose-400 dark:text-rose-500">{heartFill}%</span>
      </div>
      <div className="relative w-full bg-rose-100 dark:bg-rose-900/40 rounded-full h-4 border border-rose-200 dark:border-rose-800 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${heartFill}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-extrabold text-white drop-shadow leading-none">{'💗'.repeat(kindScore)}</span>
        </div>
      </div>
    </div>
  );

  // ── Game Over screen ─────────────────────────────────────────────────────────
  if (phase === 'gameOver') {
    const perfect = kindScore === TOTAL_ROUNDS;
    return (
      <div className="flex flex-col h-full w-full bg-gradient-to-b from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-950 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-rose-200 dark:border-rose-800 shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-rose-600 dark:text-rose-300 hover:underline transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-rose-700 dark:text-rose-300 tracking-wide">💗 Friend Finder</h1>
          <span />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center pb-24">
          <div className="text-7xl animate-bounce">{perfect ? '🏆' : '💗'}</div>
          <h2 className="text-2xl font-extrabold text-rose-700 dark:text-rose-300">
            {perfect ? 'Perfect Kindness!' : kindScore >= 6 ? 'Kind Heart!' : 'Keep Spreading Kindness!'}
          </h2>
          <p className="text-rose-600 dark:text-rose-400 font-bold text-lg">{kindScore} / {TOTAL_ROUNDS} kind choices</p>

          <div className="w-full max-w-xs bg-rose-100 dark:bg-rose-900/30 rounded-full h-5 border border-rose-200 dark:border-rose-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000"
              style={{ width: `${(kindScore / TOTAL_ROUNDS) * 100}%` }}
            />
          </div>

          <p className="text-rose-700/80 dark:text-rose-300/80 text-sm max-w-sm bg-white/60 dark:bg-white/10 rounded-2xl p-4 border border-rose-200 dark:border-rose-700 italic leading-relaxed">
            🤖 AI learns kindness from real examples — just like you practised today. These models help build kinder social media platforms and companion robots that spread warmth wherever they go! 💗
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

  const optionStyle: Record<OptionType, { base: string; selected: string }> = {
    kind:    { base: 'border-rose-200  bg-rose-50   dark:bg-rose-900/20  dark:border-rose-700  hover:border-rose-400  hover:bg-rose-100',  selected: 'border-green-400 bg-green-50  dark:bg-green-900/20 ring-2 ring-green-300' },
    neutral: { base: 'border-gray-200  bg-gray-50   dark:bg-gray-700/30  dark:border-gray-600  hover:border-gray-400  hover:bg-gray-100',  selected: 'border-gray-400  bg-gray-100 dark:bg-gray-700/40' },
    unkind:  { base: 'border-rose-200  bg-rose-50   dark:bg-rose-900/20  dark:border-rose-700  hover:border-rose-400  hover:bg-rose-100',  selected: 'border-red-400   bg-red-50   dark:bg-red-900/20   ring-2 ring-red-300' },
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-rose-50 to-pink-100 dark:from-gray-900 dark:to-rose-950 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm border-b border-rose-200 dark:border-rose-800 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-rose-600 dark:text-rose-300 hover:underline transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-rose-700 dark:text-rose-300 tracking-wide">💗 Friend Finder</h1>
        <span className="text-xs text-rose-500 dark:text-rose-400 font-semibold">
          {round + 1} / {TOTAL_ROUNDS}
        </span>
      </div>

      {/* Heart bar */}
      <HeartBar />

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32 space-y-4">

        {/* Situation card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-rose-200 dark:border-rose-700 p-5 text-center space-y-3">
          <div className="text-5xl">{scenario.emoji}</div>
          <p className="text-base font-bold text-gray-700 dark:text-gray-200 leading-snug">{scenario.situation}</p>
          <p className="text-xs text-rose-500 dark:text-rose-400 font-semibold italic">What is the kindest thing to do?</p>
        </div>

        {/* Response options */}
        <div className="space-y-3">
          {options.map((opt, i) => {
            const revealed  = phase === 'correct' || phase === 'wrong';
            const isKind    = opt.type === 'kind';
            const isPicked  = picked === opt.type && options.findIndex(o => o.type === opt.type) === i;

            let cls = `w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] font-semibold text-sm leading-snug `;

            if (!revealed) {
              cls += `${optionStyle[opt.type].base} cursor-pointer dark:text-gray-100 text-gray-700`;
            } else if (isKind) {
              cls += 'border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-600 dark:text-green-200 text-green-800 scale-[1.02] shadow-md';
            } else if (isPicked) {
              cls += 'border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 dark:text-red-200 text-red-700 opacity-70';
            } else {
              cls += 'border-gray-200 bg-gray-50 dark:bg-gray-700/20 dark:border-gray-600 dark:text-gray-400 text-gray-500 opacity-40 cursor-default';
            }

            return (
              <button
                key={i}
                type="button"
                disabled={phase !== 'playing'}
                onClick={() => handlePick(opt)}
                className={cls}
              >
                <span className="flex items-start gap-2">
                  {revealed && isKind && <span className="shrink-0 text-green-500">✓</span>}
                  {revealed && isPicked && !isKind && <span className="shrink-0 text-red-400">✗</span>}
                  {!revealed && <span className="shrink-0 text-rose-400">{['A', 'B', 'C'][i]}.</span>}
                  <span>{opt.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback + Next */}
        {(phase === 'correct' || phase === 'wrong') && (
          <div className={`rounded-2xl border p-4 text-center space-y-3 ${
            phase === 'correct'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
              : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
          }`}>
            {phase === 'correct' && (
              <>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">🤖 AI Fact</p>
                <p className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">{scenario.aiFact}</p>
              </>
            )}
            {phase === 'wrong' && (
              <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">{scenario.kindExplanation}</p>
            )}
            <button
              type="button"
              onClick={handleNext}
              className="px-8 py-2.5 rounded-full bg-rose-500 text-white font-extrabold text-sm hover:bg-rose-600 active:scale-95 transition-all shadow-sm"
            >
              {round + 1 >= TOTAL_ROUNDS ? '💗 See Results' : 'Next Round →'}
            </button>
          </div>
        )}
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
