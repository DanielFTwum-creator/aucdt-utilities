/**
 * Goodnight Storytime — "Story Detective"
 *
 * AI-for-Good framing: AI reads millions of stories to learn language, then
 * helps people — translating books, writing captions for deaf readers, and
 * summarising news so everyone can stay informed.
 *
 * Game flow:
 *  - 5 stories, each with 4 paragraphs and 3 hidden comprehension questions
 *  - Airi reads the story aloud (visually), then asks one question
 *  - Kid taps the correct paragraph that answers the question
 *  - Stars: 3 correct = 3 ⭐ | 2 = 2 ⭐ | 1 = 1 ⭐
 *  - After all 5 stories: total star tally + AI fact celebration
 */

import React, { useState } from 'react';
import { Airi, AiriMood } from '../Airi';

interface Props { onClose: () => void; }

interface Question {
  question: string;
  answerIdx: number; // index of the correct paragraph (0-3)
  hint: string;
}

interface Story {
  title: string;
  emoji: string;
  paragraphs: string[];
  questions: Question[];
  aiFact: string;
}

const STORIES: Story[] = [
  {
    title: 'The Sleepy Cloud',
    emoji: '☁️',
    paragraphs: [
      'High above the mountains, a little cloud named Fluffy drifted through the afternoon sky, painting rainbows after every gentle shower.',
      'As the golden sun dipped below the hills, Fluffy let out the biggest yawn and settled softly over the treetops.',
      'The wind whispered "goodnight", the stars winked hello one by one, and Fluffy closed her eyes with a warm, happy sigh.',
      'And soon, the whole sky was peaceful, quiet, and still — all because Fluffy finally rested.',
    ],
    questions: [
      { question: 'Which part tells us what Fluffy did in the afternoon sky?', answerIdx: 0, hint: 'Look for where Fluffy was drifting.' },
      { question: 'Which part shows us Fluffy getting sleepy?', answerIdx: 1, hint: 'Find where Fluffy yawned.' },
      { question: 'Which part describes the sky after Fluffy fell asleep?', answerIdx: 3, hint: 'Look for what happened at the very end.' },
    ],
    aiFact: 'AI reads millions of stories like this to learn how sentences work — that is how it writes captions and summaries to help people! 📚🤖',
  },
  {
    title: 'The Tortoise Who Counted Stars',
    emoji: '🐢',
    paragraphs: [
      'Old Tortoise had a special job every night — to count all the stars before falling asleep under his favourite baobab tree.',
      'One by one he counted: one star for kindness, one for courage, one for every friend who made him smile that day.',
      'He never finished counting, because there were always more stars than there were good memories — and that made him very happy indeed.',
      'He tucked his head inside his shell, smiled, and drifted off to the softest dreams under the wide African sky.',
    ],
    questions: [
      { question: 'Which part explains WHY Tortoise counted stars?', answerIdx: 1, hint: 'Find where he says what each star means.' },
      { question: 'Which part tells us where Tortoise slept?', answerIdx: 0, hint: 'Look for a tree.' },
      { question: 'Which part shows Tortoise falling asleep?', answerIdx: 3, hint: 'Find the very last thing he did.' },
    ],
    aiFact: 'AI learns to understand feelings in stories — this helps it write kind messages and detect when people need support online. 🤖💙',
  },
  {
    title: 'Anansi Spins a Dream',
    emoji: '🕷️',
    paragraphs: [
      'Anansi the spider decided that tonight, instead of telling stories, he would spin the most beautiful web in all the world.',
      'Thread by thread he worked, catching moonbeams, dewdrops, and the last notes of a lullaby floating on the breeze.',
      'When it was done, the web glittered like a net of tiny lanterns, lighting the forest with a gentle glow.',
      'He curled up at the centre, rocked by the night wind, and slept better than he ever had before.',
    ],
    questions: [
      { question: 'Which part tells us what Anansi decided to do differently tonight?', answerIdx: 0, hint: 'Look for what Anansi chose instead of stories.' },
      { question: 'Which part describes what the finished web looked like?', answerIdx: 2, hint: 'Find where it glittered.' },
      { question: 'Which part shows Anansi going to sleep?', answerIdx: 3, hint: 'Look for where he curled up.' },
    ],
    aiFact: 'AI studies African folk tales and stories from every culture to learn how different people tell stories — then it helps translate them for the whole world! 🌍📖',
  },
  {
    title: 'The Little Star Who Was Scared of the Dark',
    emoji: '⭐',
    paragraphs: [
      'Far up in the sky lived a tiny star named Pip, who was afraid to shine because the dark seemed so very big.',
      '"What if no one notices me?" Pip whispered, dimming her light and hiding behind a passing cloud.',
      'But then a child on Earth looked up, pointed, and said, "Look — that one is my favourite star!"',
      'Pip glowed brighter than ever, and from that night on, shining felt like the easiest thing in the world.',
    ],
    questions: [
      { question: 'Which part shows us why Pip was afraid?', answerIdx: 1, hint: 'Find where Pip whispered and hid.' },
      { question: 'Which part tells us what changed Pip\'s mind?', answerIdx: 2, hint: 'Look for the child on Earth.' },
      { question: 'Which part shows what happened to Pip after that night?', answerIdx: 3, hint: 'Find where Pip glowed brighter.' },
    ],
    aiFact: 'AI learns from millions of children\'s books to understand emotions like fear and bravery — this helps it create stories for young readers in over 100 languages! 🌟',
  },
  {
    title: 'The Fisherman\'s Lullaby',
    emoji: '🎣',
    paragraphs: [
      'Every evening, old fisherman Kofi would sit on the riverbank and hum a quiet song that made the fish stop swimming and listen.',
      'The river slowed to a gentle murmur, the reeds stopped swaying, and even the fireflies blinked more softly.',
      'His grandchildren would creep up behind him and fall asleep against his back, one by one, without him noticing.',
      'The river carried his song out to sea, where it rocked every creature in the ocean gently to sleep.',
    ],
    questions: [
      { question: 'Which part tells us what Kofi\'s song did to the river and reeds?', answerIdx: 1, hint: 'Find where things went quiet.' },
      { question: 'Which part shows the grandchildren falling asleep?', answerIdx: 2, hint: 'Look for the children creeping up.' },
      { question: 'Which part describes what happened far away at sea?', answerIdx: 3, hint: 'Find where the song travelled.' },
    ],
    aiFact: 'AI can now read a story aloud with a natural voice — helping children who find reading difficult and blind people enjoy books independently! 🎵🤖',
  },
];

type Phase = 'reading' | 'question' | 'correct' | 'wrong' | 'storyDone' | 'allDone';

function getStarCount(correct: number): number {
  if (correct === 3) return 3;
  if (correct === 2) return 2;
  return 1;
}

export const GoodNightStorytime: React.FC<Props> = ({ onClose }) => {
  const [storyIdx, setStoryIdx]     = useState(0);
  const [phase, setPhase]           = useState<Phase>('reading');
  const [qIdx, setQIdx]             = useState(0);           // current question index
  const [correct, setCorrect]       = useState(0);           // correct answers this story
  const [totalStars, setTotalStars] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [highlighted, setHighlighted] = useState<number | null>(null); // tapped paragraph
  const [airiMsg, setAiriMsg]       = useState("Read the story, then I'll ask you a question! 🌙");
  const [airiMood, setAiriMood]     = useState<AiriMood>('idle');

  const story = STORIES[storyIdx];
  const question = story.questions[qIdx];

  const handleStartQuestion = () => {
    setPhase('question');
    setHighlighted(null);
    setAiriMsg(`🔍 ${question.question}`);
    setAiriMood('watching');
  };

  const handleTapParagraph = (idx: number) => {
    if (phase !== 'question') return;
    setHighlighted(idx);

    if (idx === question.answerIdx) {
      const newCorrect = correct + 1;
      setCorrect(newCorrect);
      setAiriMsg("That's right! Great detective work! 🎉");
      setAiriMood('celebrating');
      setPhase('correct');

      setTimeout(() => {
        const nextQ = qIdx + 1;
        if (nextQ < story.questions.length) {
          setQIdx(nextQ);
          setPhase('question');
          setHighlighted(null);
          setAiriMsg(`🔍 ${story.questions[nextQ].question}`);
          setAiriMood('watching');
        } else {
          const stars = getStarCount(newCorrect);
          setEarnedStars(stars);
          setTotalStars(t => t + stars);
          setPhase('storyDone');
          setAiriMsg(story.aiFact);
          setAiriMood('celebrating');
        }
      }, 1400);
    } else {
      setAiriMsg(`Not quite! Hint: ${question.hint} 💡`);
      setAiriMood('encouraging');
      setPhase('wrong');
      setTimeout(() => {
        setPhase('question');
        setHighlighted(null);
        setAiriMsg(`🔍 ${question.question}`);
        setAiriMood('watching');
      }, 2000);
    }
  };

  const handleNextStory = () => {
    const next = storyIdx + 1;
    if (next >= STORIES.length) {
      setPhase('allDone');
      setAiriMsg(`You finished all ${STORIES.length} stories! You're a Story Detective! 🏆`);
      setAiriMood('celebrating');
    } else {
      setStoryIdx(next);
      setQIdx(0);
      setCorrect(0);
      setHighlighted(null);
      setPhase('reading');
      setAiriMsg("Read the new story, then I'll ask you a question! 🌙");
      setAiriMood('idle');
    }
  };

  const handleRestart = () => {
    setStoryIdx(0);
    setQIdx(0);
    setCorrect(0);
    setTotalStars(0);
    setEarnedStars(0);
    setHighlighted(null);
    setPhase('reading');
    setAiriMsg("Read the story, then I'll ask you a question! 🌙");
    setAiriMood('idle');
  };

  // ── All done screen ──────────────────────────────────────────────────────────
  if (phase === 'allDone') {
    return (
      <div className="flex flex-col h-full w-full bg-[#0d1b2a] text-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-[#111f33]/80 backdrop-blur-sm shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-purple-300 hover:text-white transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-purple-200 tracking-wide">🌙 Story Detective</h1>
          <span className="text-xs text-purple-400">{STORIES.length} / {STORIES.length}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="text-7xl animate-bounce">🏆</div>
          <h2 className="text-2xl font-extrabold text-purple-200">Story Detective Complete!</h2>
          <p className="text-purple-300/80 text-sm max-w-xs">
            You read all {STORIES.length} stories and answered every mystery!
          </p>
          <div className="text-3xl tracking-widest">
            {'⭐'.repeat(Math.min(totalStars, 15))}
          </div>
          <p className="text-purple-400/70 text-xs">{totalStars} stars collected</p>
          <p className="text-purple-200/80 text-sm max-w-sm italic bg-purple-900/30 rounded-2xl p-4 border border-purple-700/30">
            🤖 AI reads millions of stories just like these to learn human language — then it helps people read, write, and communicate across the world!
          </p>
          <button type="button" onClick={handleRestart}
            className="px-8 py-3 rounded-full bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-500 active:scale-95 transition-all shadow-lg">
            🔄 Play Again
          </button>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Story done screen ────────────────────────────────────────────────────────
  if (phase === 'storyDone') {
    return (
      <div className="flex flex-col h-full w-full bg-[#0d1b2a] text-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 bg-[#111f33]/80 backdrop-blur-sm shrink-0">
          <button type="button" onClick={onClose}
            className="text-sm font-bold text-purple-300 hover:text-white transition-colors">
            ← Back
          </button>
          <h1 className="text-base font-extrabold text-purple-200 tracking-wide">🌙 Story Detective</h1>
          <span className="text-xs text-purple-400">{storyIdx + 1} / {STORIES.length}</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="text-6xl">{story.emoji}</div>
          <h2 className="text-xl font-extrabold text-purple-200">{story.title}</h2>
          <div className="text-4xl tracking-widest">
            {'⭐'.repeat(earnedStars)}{'🖤'.repeat(3 - earnedStars)}
          </div>
          <p className="text-sm font-bold text-purple-300">
            {correct} / {story.questions.length} questions correct
          </p>
          <div className="bg-purple-900/40 border border-purple-700/40 rounded-2xl p-4 max-w-sm">
            <p className="text-xs text-purple-200/80 italic leading-relaxed">🤖 {story.aiFact}</p>
          </div>
          <button type="button" onClick={handleNextStory}
            className="px-8 py-3 rounded-full bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-500 active:scale-95 transition-all shadow-lg">
            {storyIdx + 1 >= STORIES.length ? '🏆 Finish!' : 'Next Story →'}
          </button>
        </div>
        <Airi message={airiMsg} mood={airiMood} />
      </div>
    );
  }

  // ── Main reading / question screen ───────────────────────────────────────────
  return (
    <div className="flex flex-col h-full w-full bg-[#0d1b2a] text-white overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#111f33]/80 backdrop-blur-sm shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-purple-300 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-purple-200 tracking-wide">🌙 Story Detective</h1>
        <span className="text-xs text-purple-400">{storyIdx + 1} / {STORIES.length}</span>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-3 shrink-0">
        {STORIES.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full transition-all ${
            i < storyIdx ? 'bg-purple-400' : i === storyIdx ? 'bg-purple-300 scale-125' : 'bg-purple-800'
          }`} />
        ))}
      </div>

      {/* Story card */}
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-32">
        <div className="w-full max-w-lg mx-auto space-y-4">

          {/* Title */}
          <div className="text-center space-y-1">
            <p className="text-5xl">{story.emoji}</p>
            <h2 className="text-lg font-extrabold text-purple-200">{story.title}</h2>
          </div>

          {/* Question banner */}
          {phase === 'question' && (
            <div className="bg-purple-800/50 border border-purple-600/50 rounded-2xl px-4 py-3 text-center">
              <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-1">🔍 Detective Question</p>
              <p className="text-sm font-bold text-purple-100">{question.question}</p>
              <p className="text-xs text-purple-400/70 mt-1">Tap the correct paragraph below</p>
            </div>
          )}

          {/* Paragraphs */}
          {story.paragraphs.map((p, i) => {
            const isCorrectAnswer   = phase === 'correct' && highlighted === i;
            const isWrongAnswer     = phase === 'wrong'   && highlighted === i;
            const isRevealedCorrect = phase === 'correct' && i === question.answerIdx;
            const isClickable       = phase === 'question';

            return (
              <button
                key={i}
                type="button"
                disabled={!isClickable}
                onClick={() => handleTapParagraph(i)}
                className={[
                  'w-full text-left rounded-2xl border-2 px-4 py-4 transition-all duration-200',
                  isRevealedCorrect || isCorrectAnswer
                    ? 'border-green-400 bg-green-900/30 scale-[1.02]'
                    : isWrongAnswer
                    ? 'border-red-400 bg-red-900/20'
                    : isClickable
                    ? 'border-purple-700/50 bg-[#1a2e45]/60 hover:border-purple-500 hover:bg-[#1a2e45]/80 cursor-pointer active:scale-[0.98]'
                    : 'border-purple-800/30 bg-[#1a2e45]/40 cursor-default',
                ].join(' ')}
              >
                <div className="flex items-start gap-3">
                  <span className={[
                    'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold mt-0.5',
                    isRevealedCorrect || isCorrectAnswer ? 'bg-green-500 text-white' :
                    isWrongAnswer ? 'bg-red-500 text-white' :
                    'bg-purple-800/60 text-purple-400',
                  ].join(' ')}>
                    {isRevealedCorrect || isCorrectAnswer ? '✓' : isWrongAnswer ? '✗' : i + 1}
                  </span>
                  <p className="text-purple-100/90 leading-relaxed text-sm italic">{p}</p>
                </div>
              </button>
            );
          })}

          {/* Ask me button (reading phase) */}
          {phase === 'reading' && (
            <div className="flex justify-center pt-2">
              <button type="button" onClick={handleStartQuestion}
                className="px-8 py-3 rounded-full bg-purple-600 text-white font-extrabold text-sm hover:bg-purple-500 active:scale-95 transition-all shadow-lg shadow-purple-900/40">
                🔍 Ask me a question!
              </button>
            </div>
          )}

          {/* Question progress dots */}
          {phase !== 'reading' && (
            <div className="flex justify-center gap-2 pt-2">
              {story.questions.map((_, i) => (
                <span key={i} className={`w-2 h-2 rounded-full transition-all ${
                  i < qIdx ? 'bg-green-400' : i === qIdx ? 'bg-purple-300 scale-125' : 'bg-purple-800'
                }`} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
