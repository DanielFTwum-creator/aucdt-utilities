import React, { useState } from 'react';

interface Props { onClose: () => void; }

const STORIES = [
  {
    title: 'The Sleepy Cloud',
    emoji: '☁️',
    paragraphs: [
      'High above the mountains, a little cloud named Fluffy drifted through the afternoon sky, painting rainbows after every gentle shower.',
      'As the golden sun dipped below the hills, Fluffy let out the biggest yawn and settled softly over the treetops.',
      'The wind whispered "goodnight", the stars winked hello one by one, and Fluffy closed her eyes with a warm, happy sigh.',
      'And soon, the whole sky was peaceful, quiet, and still.',
    ],
  },
  {
    title: 'The Tortoise Who Counted Stars',
    emoji: '🐢',
    paragraphs: [
      'Old Tortoise had a special job every night — to count all the stars before falling asleep under his favourite baobab tree.',
      'One by one he counted: one star for kindness, one for courage, one for every friend who made him smile that day.',
      'He never finished counting, because there were always more stars than there were good memories — and that made him very happy indeed.',
      'He tucked his head inside his shell, smiled, and drifted off to the softest dreams.',
    ],
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
  },
  {
    title: 'The Little Star Who Was Scared of the Dark',
    emoji: '⭐',
    paragraphs: [
      'Far up in the sky lived a tiny star named Pip, who was afraid to shine because the dark seemed so very big.',
      '"What if no one notices me?" Pip whispered.',
      'But then a child on Earth looked up, pointed, and said, "Look — that one is my favourite star!"',
      'Pip glowed brighter than ever, and from that night on, shining felt like the easiest thing in the world.',
    ],
  },
  {
    title: 'The Fisherman\'s Lullaby',
    emoji: '🎣',
    paragraphs: [
      'Every evening, old fisherman Kofi would sit on the riverbank and hum a quiet song that made the fish stop swimming and listen.',
      'The river slowed to a gentle murmur. The reeds stopped swaying. Even the fireflies blinked more softly.',
      'His grandchildren would creep up behind him and fall asleep against his back, one by one.',
      'The river carried his song out to sea, where it rocked every creature in the ocean gently to sleep.',
    ],
  },
];

export const GoodNightStorytime: React.FC<Props> = ({ onClose }) => {
  const [idx, setIdx] = useState(0);
  const story = STORIES[idx];

  return (
    <div className="flex flex-col h-full w-full bg-[#0d1b2a] text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#111f33]/80 backdrop-blur-sm shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-purple-300 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-purple-200 tracking-wide">🌙 Goodnight Storytime</h1>
        <span className="text-xs text-purple-400">{idx + 1} / {STORIES.length}</span>
      </div>

      {/* Stars background decoration */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 pb-8 overflow-y-auto">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {['top-4 left-8','top-12 right-16','top-24 left-1/3','top-8 right-1/4','top-36 left-12',
            'top-48 right-8','top-20 left-1/2','top-64 left-1/4'].map((pos, i) => (
            <span key={i} className={`absolute text-yellow-200/30 text-xs animate-pulse`}
              style={{ top: `${(i * 47) % 80}%`, left: `${(i * 61) % 90}%`, animationDelay: `${i * 0.4}s` }}>
              ✦
            </span>
          ))}
        </div>

        {/* Story card */}
        <div className="relative w-full max-w-lg bg-[#1a2e45]/80 border border-purple-800/40 rounded-3xl p-8 shadow-2xl space-y-5 my-6">
          <div className="text-center space-y-1">
            <p className="text-6xl">{story.emoji}</p>
            <h2 className="text-xl font-extrabold text-purple-200">{story.title}</h2>
          </div>
          <div className="space-y-3">
            {story.paragraphs.map((p, i) => (
              <p key={i} className="text-purple-100/90 leading-relaxed text-sm text-center italic">
                {p}
              </p>
            ))}
          </div>
          <p className="text-center text-purple-400/60 text-xs pt-2">🌙 Sweet dreams…</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 shrink-0">
          <button type="button"
            onClick={() => setIdx(i => Math.max(0, i - 1))}
            disabled={idx === 0}
            className="px-5 py-2.5 rounded-full bg-purple-800/50 text-purple-200 font-bold text-sm hover:bg-purple-700/60 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <button type="button"
            onClick={() => setIdx(i => Math.min(STORIES.length - 1, i + 1))}
            disabled={idx === STORIES.length - 1}
            className="px-5 py-2.5 rounded-full bg-purple-600/70 text-white font-bold text-sm hover:bg-purple-500/80 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            Next Story →
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {STORIES.map((_, i) => (
            <button key={i} type="button" onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === idx ? 'bg-purple-400 scale-125' : 'bg-purple-800'}`} />
          ))}
        </div>
      </div>
    </div>
  );
};
