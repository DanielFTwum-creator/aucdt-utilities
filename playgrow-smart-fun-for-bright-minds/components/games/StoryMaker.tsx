/**
 * Story Maker — "Write with AI"
 *
 * Kids mix characters, actions, and places from a deep world-literature pool
 * (Anansi, King Arthur, Florence Nightingale, Sherlock Holmes, David Copperfield,
 * Cleopatra, Mansa Musa, Odysseus, and 20+ more) to build silly sentences.
 * Airi reacts to each pick and explains how AI models construct language.
 */

import React, { useState, useMemo } from 'react';
import { Airi, AiriMood } from '../Airi';

interface StoryMakerProps { onClose: () => void; }

// ── Deep story library ─────────────────────────────────────────────────────────

interface Card { id: string; emoji: string; label: string; }

const WHO: Card[] = [
  { id: 'anansi',      emoji: '🕷️', label: 'Anansi the Spider' },
  { id: 'arthur',      emoji: '⚔️', label: 'King Arthur' },
  { id: 'nightingale', emoji: '🏥', label: 'Florence Nightingale' },
  { id: 'crusoe',      emoji: '🏝️', label: 'Robinson Crusoe' },
  { id: 'copperfield', emoji: '📖', label: 'David Copperfield' },
  { id: 'holmes',      emoji: '🔍', label: 'Sherlock Holmes' },
  { id: 'alice',       emoji: '🍄', label: 'Alice' },
  { id: 'peter_pan',   emoji: '🧚', label: 'Peter Pan' },
  { id: 'cinderella',  emoji: '👠', label: 'Cinderella' },
  { id: 'dorothy',     emoji: '🌪️', label: 'Dorothy' },
  { id: 'sinbad',      emoji: '⛵', label: 'Sinbad the Sailor' },
  { id: 'robin',       emoji: '🏹', label: 'Robin Hood' },
  { id: 'cleopatra',   emoji: '👑', label: 'Cleopatra' },
  { id: 'marco_polo',  emoji: '🗺️', label: 'Marco Polo' },
  { id: 'mansa_musa',  emoji: '💰', label: 'Mansa Musa' },
  { id: 'pinocchio',   emoji: '🤥', label: 'Pinocchio' },
  { id: 'aladdin',     emoji: '🪔', label: 'Aladdin' },
  { id: 'hercules',    emoji: '💪', label: 'Hercules' },
  { id: 'odysseus',    emoji: '⚓', label: 'Odysseus' },
  { id: 'tarzan',      emoji: '🐒', label: 'Tarzan' },
  { id: 'little_prince',emoji:'🌹', label: 'The Little Prince' },
  { id: 'merlin',      emoji: '🧙', label: 'Merlin the Wizard' },
  { id: 'oliver',      emoji: '🥣', label: 'Oliver Twist' },
  { id: 'ahab',        emoji: '🐋', label: 'Captain Ahab' },
  { id: 'tom_sawyer',  emoji: '🎣', label: 'Tom Sawyer' },
  { id: 'dracula',     emoji: '🦇', label: 'Count Dracula' },
  { id: 'ljs',         emoji: '☠️', label: 'Long John Silver' },
  { id: 'hansel',      emoji: '🍬', label: 'Hansel & Gretel' },
  { id: 'mulan',       emoji: '🏯', label: 'Hua Mulan' },
  { id: 'scheherazade',emoji: '📜', label: 'Scheherazade' },
];

const DID: Card[] = [
  { id: 'outwit',   emoji: '🕷️', label: 'outwitted a lion' },
  { id: 'sword',    emoji: '⚔️', label: 'pulled a sword from a stone' },
  { id: 'healed',   emoji: '💉', label: 'healed a thousand soldiers' },
  { id: 'raft',     emoji: '🪵', label: 'built a raft to survive' },
  { id: 'walked',   emoji: '👣', label: 'walked through a blizzard' },
  { id: 'solved',   emoji: '🔦', label: 'solved the impossible mystery' },
  { id: 'fell',     emoji: '🐇', label: 'fell down a rabbit hole' },
  { id: 'flew',     emoji: '✈️', label: 'flew over the rooftops' },
  { id: 'glass',    emoji: '👠', label: 'left a glass slipper behind' },
  { id: 'tornado',  emoji: '🌪️', label: 'rode inside a tornado' },
  { id: 'sailed',   emoji: '⛵', label: 'sailed through a giant storm' },
  { id: 'stole',    emoji: '🏹', label: 'stole from the rich' },
  { id: 'ruled',    emoji: '🐍', label: 'ruled an ancient empire' },
  { id: 'mapped',   emoji: '🗺️', label: 'mapped the Silk Road' },
  { id: 'gold',     emoji: '💰', label: 'shared gold across the kingdom' },
  { id: 'nose',     emoji: '👃', label: 'grew a very long nose' },
  { id: 'lamp',     emoji: '🪔', label: 'rubbed a magic lamp' },
  { id: 'lion',     emoji: '🦁', label: 'wrestled the Nemean Lion' },
  { id: 'cyclops',  emoji: '👁️', label: 'outwitted a one-eyed giant' },
  { id: 'vine',     emoji: '🌿', label: 'swung through the treetops' },
  { id: 'rose2',    emoji: '🌹', label: 'tended a single precious rose' },
  { id: 'spell',    emoji: '✨', label: 'cast a powerful spell' },
  { id: 'porridge', emoji: '🥣', label: 'asked for more porridge' },
  { id: 'whale',    emoji: '🐋', label: 'hunted a great white whale' },
  { id: 'fence',    emoji: '🎨', label: 'painted a fence for fun' },
  { id: 'bite',     emoji: '🦇', label: 'vanished into the night' },
  { id: 'treasure', emoji: '☠️', label: 'found a pirate treasure map' },
  { id: 'candy',    emoji: '🍬', label: 'found a house made of sweets' },
  { id: 'armour',   emoji: '🏯', label: 'put on armour to save the realm' },
  { id: 'tales',    emoji: '📜', label: 'told a thousand and one tales' },
];

const WHERE: Card[] = [
  { id: 'camelot',    emoji: '🏰', label: "in Camelot's great hall" },
  { id: 'island',     emoji: '🏝️', label: 'on a deserted island' },
  { id: 'london',     emoji: '🏙️', label: 'in the streets of London' },
  { id: 'wonderland', emoji: '🍄', label: 'in Wonderland' },
  { id: 'neverland',  emoji: '🧚', label: 'in Neverland' },
  { id: 'oz',         emoji: '🌈', label: 'over the rainbow in Oz' },
  { id: 'high_seas',  emoji: '🌊', label: 'on the high seas' },
  { id: 'sherwood',   emoji: '🌲', label: 'in Sherwood Forest' },
  { id: 'egypt',      emoji: '🏺', label: 'along the great Nile' },
  { id: 'silk_road',  emoji: '🗺️', label: 'along the Silk Road' },
  { id: 'golden_city',emoji: '🕌', label: 'in a city of golden domes' },
  { id: 'olympus',    emoji: '⛰️', label: 'on Mount Olympus' },
  { id: 'jungle',     emoji: '🐒', label: 'deep in the jungle' },
  { id: 'asteroid',   emoji: '🌹', label: 'on a tiny asteroid' },
  { id: 'tower',      emoji: '🧙', label: 'inside an enchanted tower' },
  { id: 'workhouse',  emoji: '🥣', label: 'in a cold Victorian workhouse' },
  { id: 'deep_ocean', emoji: '🐋', label: 'in the dark deep ocean' },
  { id: 'mali',       emoji: '💰', label: 'across the Mali Empire' },
  { id: 'mississippi',emoji: '🎣', label: 'along the Mississippi River' },
  { id: 'hospital',   emoji: '🏥', label: 'in a Crimean War hospital' },
  { id: 'moon',       emoji: '🌙', label: 'on the moon' },
  { id: 'cloud',      emoji: '☁️', label: 'on a floating cloud' },
  { id: 'computer',   emoji: '💻', label: 'inside a computer' },
  { id: 'volcano',    emoji: '🌋', label: 'near an erupting volcano' },
  { id: 'candy_house',emoji: '🍬', label: 'at the candy-covered house' },
  { id: 'titanic',    emoji: '🚢', label: 'on the deck of a great ship' },
  { id: 'bazaar',     emoji: '📜', label: 'in a magical bazaar' },
  { id: 'china_wall', emoji: '🏯', label: 'along the Great Wall of China' },
  { id: 'transylvania',emoji:'🦇', label: 'in a dark Transylvanian castle' },
  { id: 'treasure_island',emoji:'☠️', label: 'on Treasure Island' },
];

function pickRandom<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}
function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const OPENERS = [
  "Once upon a time,",
  "Long ago in a distant land,",
  "Nobody expected it when",
  "The legend tells of how",
  "History was changed forever when",
  "Everyone was astonished the day",
  "A great tale is told of how",
  "On an otherwise ordinary day,",
  "In the age of wonders,",
  "The bards still sing of how",
];

const CLOSERS = [
  "And the world was never quite the same again.",
  "Even the stars paused to watch.",
  "This story is still told to this day.",
  "AI remembers it — it read every book!",
  "The end... or was it just the beginning?",
  "Children still whisper about it at bedtime.",
  "And that is why we love stories!",
  "No one could believe it had really happened.",
  "Every storyteller since has borrowed a little of this tale.",
  "Airi says: AI learned this story from ten million books! 📚",
];

const AI_FACTS = [
  "AI builds stories like this — learning which words go together from millions of books! 📚🤖",
  "Large language models mix story ingredients exactly the way you just did! 🧠",
  "Every AI story starts with billions of human-written sentences as training data! 📖",
  "AI doesn't really 'imagine' — it finds patterns in human stories. Pretty cool, right? 🤔",
  "Your silly sentence is a tiny version of how AI learns to write! ✨",
  "Anansi, Odysseus, Cleopatra — AI has read ALL their stories to learn language! 📜",
];

// ── Story card component ───────────────────────────────────────────────────────

interface StoryCardProps {
  emoji: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ emoji, label, selected, onSelect }) => (
  <button
    type="button"
    aria-label={`${label}${selected ? ' — selected' : ''}`}
    onClick={onSelect}
    className={[
      'relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-[3px] text-center w-full',
      'transition-all duration-200 active:scale-95',
      selected
        ? 'border-[var(--pg-border-select)] bg-[var(--pg-card-select)] scale-105 shadow-lg'
        : 'border-[var(--pg-border)] bg-[var(--pg-card)] hover:-translate-y-1 hover:shadow-md hover:border-[var(--pg-accent-2)]',
    ].join(' ')}
  >
    {selected && (
      <span className="pg-pop absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[var(--pg-accent)] text-white text-[11px] font-extrabold flex items-center justify-center leading-none shadow-md">
        ✓
      </span>
    )}
    <span className="text-2xl sm:text-3xl leading-none">{emoji}</span>
    <span className="text-[11px] sm:text-xs font-bold text-[var(--pg-text)] leading-tight">{label}</span>
  </button>
);

// ── Component ─────────────────────────────────────────────────────────────────

// Seed a fresh deck: 4 cards per column + auto-pick one from each
function freshDeal() {
  const wc = pickRandom(WHO,   4);
  const dc = pickRandom(DID,   4);
  const pc = pickRandom(WHERE, 4);
  return {
    whoCards: wc, didCards: dc, whereCards: pc,
    who:   rand(wc).id,
    did:   rand(dc).id,
    where: rand(pc).id,
    opener: rand(OPENERS),
    closer: rand(CLOSERS),
  };
}

export const StoryMaker: React.FC<StoryMakerProps> = ({ onClose }) => {
  const initial = useMemo(freshDeal, []);

  const [whoCards,   setWhoCards]   = useState(initial.whoCards);
  const [didCards,   setDidCards]   = useState(initial.didCards);
  const [whereCards, setWhereCards] = useState(initial.whereCards);
  const [who,        setWho]        = useState<string | null>(initial.who);
  const [did,        setDid]        = useState<string | null>(initial.did);
  const [where,      setWhere]      = useState<string | null>(initial.where);
  const [opener,     setOpener]     = useState(initial.opener);
  const [closer,     setCloser]     = useState(initial.closer);
  const [revealed,   setRevealed]   = useState(true);   // auto-reveal first story
  const [factIdx,    setFactIdx]    = useState(() => Math.floor(Math.random() * AI_FACTS.length));

  const whoCard   = whoCards.find(c => c.id === who);
  const didCard   = didCards.find(c => c.id === did);
  const whereCard = whereCards.find(c => c.id === where);

  const allPicked = !!who && !!did && !!where;

  // Stage-reactive Airi messages
  type Stage = 'idle' | 'who' | 'did' | 'where' | 'ready' | 'revealed';
  const stage: Stage = revealed ? 'revealed'
    : allPicked ? 'ready'
    : where ? 'where'
    : did   ? 'did'
    : who   ? 'who'
    : 'idle';

  const airiMsg = (() => {
    switch (stage) {
      case 'idle':     return "Pick one card from each column to build your story! 📖";
      case 'who':      return `Ooh, ${whoCard?.label}! What did they do next? 🎭`;
      case 'did':      return `Ha! They ${didCard?.label}. Where did this happen? 🌍`;
      case 'where':    return `${whereCard?.label}? Almost! Tap "Make my story" 🎉`;
      case 'ready':    return "All set! Tap the button to reveal your story! ✨";
      case 'revealed': return AI_FACTS[factIdx];
    }
  })();

  const airiMood: AiriMood = stage === 'revealed' ? 'celebrating'
    : stage === 'ready' ? 'happy'
    : stage !== 'idle'  ? 'encouraging'
    : 'idle';

  // "New" — deal fresh cards, auto-pick, auto-reveal a brand new story
  const handleNew = () => {
    const deal = freshDeal();
    setWhoCards(deal.whoCards);
    setDidCards(deal.didCards);
    setWhereCards(deal.whereCards);
    setWho(deal.who);
    setDid(deal.did);
    setWhere(deal.where);
    setOpener(deal.opener);
    setCloser(deal.closer);
    setRevealed(true);
    setFactIdx(Math.floor(Math.random() * AI_FACTS.length));
  };

  const handleReveal = () => { setRevealed(true); setFactIdx(Math.floor(Math.random() * AI_FACTS.length)); };
  const pickWho      = (id: string) => { setWho(id);   setRevealed(false); };
  const pickDid      = (id: string) => { setDid(id);   setRevealed(false); };
  const pickWhere    = (id: string) => { setWhere(id); setRevealed(false); };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--pg-bg)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-white/80 backdrop-blur-sm border-b border-[var(--pg-border)] shrink-0 shadow-sm">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-[var(--pg-accent)] hover:underline hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--pg-accent)] rounded-lg px-2 py-1">
          ← Back
        </button>
        <h2 className="text-base sm:text-lg font-extrabold text-[var(--pg-text)]">Story Maker 📖</h2>
        <button type="button" onClick={handleNew}
          className="text-sm font-bold text-[var(--pg-accent-2)] border-2 border-[var(--pg-accent-2)] rounded-lg px-3 py-1.5 hover:bg-[var(--pg-accent-2)] hover:text-white hover:scale-105 active:scale-95 transition-all focus:outline-none">
          🔄 New
        </button>
      </div>

      {/* Revealed story */}
      {revealed && whoCard && didCard && whereCard && (
        <div className="pg-bubble-in mx-auto w-full max-w-2xl mt-3 px-4 shrink-0">
          <div className="p-4 bg-white rounded-2xl shadow-lg border-[3px] border-[var(--pg-accent-3)] text-center space-y-1">
            <p className="text-3xl">{whoCard.emoji} {didCard.emoji} {whereCard.emoji}</p>
            <p className="text-xs font-semibold text-[var(--pg-text-muted)] italic">{opener}</p>
            <p className="text-base font-extrabold text-[var(--pg-text)] leading-snug">
              {whoCard.label} {didCard.label} {whereCard.label}!
            </p>
            <p className="text-xs font-semibold text-[var(--pg-text-muted)] italic">{closer}</p>
          </div>
        </div>
      )}

      {/* Card columns */}
      <div className="flex-1 overflow-y-auto w-full px-4 sm:px-8 py-4 pb-32">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto">

          {(['Who?', 'Did what?', 'Where?'] as const).map(h => (
            <div key={h} className="text-center text-xs sm:text-sm font-extrabold text-[var(--pg-accent)] uppercase tracking-wider pb-1">
              {h}
            </div>
          ))}

          <div className="flex flex-col gap-2">
            {whoCards.map(c => (
              <StoryCard key={c.id} emoji={c.emoji} label={c.label} selected={who === c.id} onSelect={() => pickWho(c.id)} />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {didCards.map(c => (
              <StoryCard key={c.id} emoji={c.emoji} label={c.label} selected={did === c.id} onSelect={() => pickDid(c.id)} />
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {whereCards.map(c => (
              <StoryCard key={c.id} emoji={c.emoji} label={c.label} selected={where === c.id} onSelect={() => pickWhere(c.id)} />
            ))}
          </div>
        </div>
      </div>

      {/* Fixed "Make My Story" CTA — slides up when all 3 columns are picked */}
      <div className={[
        'fixed bottom-24 left-1/2 -translate-x-1/2 z-30 transition-all duration-300',
        allPicked && !revealed
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-5 pointer-events-none',
      ].join(' ')}>
        <button type="button" onClick={handleReveal}
          className="px-8 py-4 rounded-full bg-[var(--pg-accent)] text-white font-extrabold text-lg shadow-[0_8px_20px_rgba(255,111,89,0.4)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap">
          ✨ Make my story!
        </button>
      </div>

      <Airi message={airiMsg} mood={airiMood} />
    </div>
  );
};
