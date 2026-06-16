/**
 * MagicReveal — "Behind the Magic" overlay
 *
 * Two-layer reveal:
 *   1. Kid-friendly story: how Airi & PlayGrow came to life
 *   2. Tech-stack cards: for parents, teachers & developers
 *
 * Triggered by the ✨ sparkle button on WorldMap.
 */

import React, { useState } from 'react';

interface MagicRevealProps {
  onClose: () => void;
}

// ── Tech stack data ──────────────────────────────────────────────────────────

const STACK = [
  {
    name: 'Claude',
    by: 'Anthropic',
    emoji: '🧠',
    color: 'bg-orange-50 border-orange-300',
    tagColor: 'bg-orange-100 text-orange-700',
    tag: 'AI Architect',
    desc: 'Designed Airi, wrote every line of code, built all the games, and crafted the learning logic — all through conversation.',
  },
  {
    name: 'React 19',
    by: 'Meta',
    emoji: '⚛️',
    color: 'bg-cyan-50 border-cyan-300',
    tagColor: 'bg-cyan-100 text-cyan-700',
    tag: 'UI Framework',
    desc: 'Powers every screen, animation, and interaction kids see and touch.',
  },
  {
    name: 'TypeScript',
    by: 'Microsoft',
    emoji: '🔷',
    color: 'bg-blue-50 border-blue-300',
    tagColor: 'bg-blue-100 text-blue-700',
    tag: 'Language',
    desc: 'Keeps the codebase rock-solid so the app never breaks mid-game.',
  },
  {
    name: 'Tailwind CSS v4',
    by: 'Tailwind Labs',
    emoji: '🎨',
    color: 'bg-teal-50 border-teal-300',
    tagColor: 'bg-teal-100 text-teal-700',
    tag: 'Styling',
    desc: 'Every colour, shadow, and rounded corner you see — all Tailwind.',
  },
  {
    name: 'Gemini 2.5 Flash',
    by: 'Google',
    emoji: '✨',
    color: 'bg-purple-50 border-purple-300',
    tagColor: 'bg-purple-100 text-purple-700',
    tag: 'AI Activities',
    desc: 'Generates fresh, personalised learning activities for each game zone on the fly.',
  },
  {
    name: 'Vite 7',
    by: 'Evan You',
    emoji: '⚡',
    color: 'bg-yellow-50 border-yellow-300',
    tagColor: 'bg-yellow-100 text-yellow-700',
    tag: 'Build Tool',
    desc: 'Bundles and ships the app in milliseconds.',
  },
  {
    name: 'Node.js + Express',
    by: 'OpenJS Foundation',
    emoji: '🟢',
    color: 'bg-green-50 border-green-300',
    tagColor: 'bg-green-100 text-green-700',
    tag: 'Backend',
    desc: 'The lightweight server that bridges the app to the Gemini AI API.',
  },
  {
    name: 'Techbridge University',
    by: 'TUC ICT, Oyibi, Ghana 🇬🇭',
    emoji: '🏫',
    color: 'bg-rose-50 border-rose-300',
    tagColor: 'bg-rose-100 text-rose-700',
    tag: 'Creator',
    desc: 'Conceived, directed, and deployed by TUC\'s ICT department to inspire the next generation of AI builders.',
  },
];

// ── Story beats ───────────────────────────────────────────────────────────────

const STORY_BEATS = [
  { emoji: '🤖', text: 'Airi started as an idea — a friendly robot who could teach AI to kids.' },
  { emoji: '🧠', text: 'A human named Daniel told Claude (an AI) about this dream, and together they built it.' },
  { emoji: '🎨', text: 'Claude designed Airi\'s face, wrote her personality, and coded every game from scratch.' },
  { emoji: '🌍', text: 'The whole app — every button, every colour, every animation — was built right here in Ghana.' },
  { emoji: '🚀', text: 'Now it\'s yours to explore. Maybe one day YOU\'ll build something like this too!' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const MagicReveal: React.FC<MagicRevealProps> = ({ onClose }) => {
  const [showTech, setShowTech] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 rounded-t-3xl px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            ✕
          </button>
          <p className="text-3xl mb-1">✨</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">Behind the Magic</h2>
          <p className="text-white/80 text-sm mt-1">How PlayGrow came to life</p>
        </div>

        <div className="px-5 sm:px-8 py-6 space-y-6">

          {/* ── Kid story layer ── */}
          <section>
            <h3 className="text-lg font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span>🌟</span> The Story
            </h3>
            <div className="space-y-3">
              {STORY_BEATS.map((beat, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{beat.emoji}</span>
                  <p className="text-sm sm:text-base text-gray-700 font-medium leading-snug">{beat.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Toggle for tech layer ── */}
          <button
            onClick={() => setShowTech(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm sm:text-base hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            <span className="flex items-center gap-2">
              <span>🔬</span>
              {showTech ? 'Hide the tech stack' : 'Show me the tech stack →'}
            </span>
            <span className={`transition-transform duration-300 ${showTech ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {/* ── Tech stack cards ── */}
          {showTech && (
            <section className="space-y-3 animate-[fadeIn_0.25s_ease]">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest px-1">
                Built with world-class tools
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STACK.map((item) => (
                  <div
                    key={item.name}
                    className={`rounded-2xl border-2 p-4 ${item.color} flex flex-col gap-2`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl leading-none">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-gray-900 text-sm leading-tight">{item.name}</p>
                        <p className="text-gray-500 text-xs truncate">{item.by}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Claude call-out */}
              <div className="mt-2 p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-center">
                <p className="font-extrabold text-lg">🧠 Built by a Human + AI team</p>
                <p className="text-sm mt-1 text-white/90">
                  Daniel Frempong Twum (TUC) directed the vision.<br />
                  Claude (Anthropic) wrote every line of code.
                </p>
                <p className="text-xs mt-2 text-white/70 font-semibold">
                  This is what AI-for-good looks like. 🇬🇭
                </p>
              </div>
            </section>
          )}

          {/* ── Footer CTA ── */}
          <p className="text-center text-xs text-gray-400 pb-1">
            Tap anywhere outside to close · Made with ❤️ in Oyibi, Ghana
          </p>
        </div>
      </div>
    </div>
  );
};
