import React, { useState, useEffect, useRef } from 'react';

interface Props { onClose: () => void; }

const PROMPTS = [
  'Something that made me smile today…',
  'A person who was kind to me…',
  'Something I learned today…',
  'A place that felt safe and happy…',
  'Something I am proud of today…',
  'A colour, sound, or smell I loved today…',
  'Something I am looking forward to tomorrow…',
];

const EMOJIS = ['😊','🌸','🌈','⭐','🎉','💛','🌿','🦋','🍀','🫶'];

interface Entry { text: string; emoji: string; date: string; }

const STORAGE_KEY = 'pg_gratitude_v1';

function loadEntries(): Entry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); } catch { return []; }
}
function saveEntries(es: Entry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(es));
}

export const GratitudeMoments: React.FC<Props> = ({ onClose }) => {
  const [entries, setEntries]     = useState<Entry[]>(loadEntries);
  const [text, setText]           = useState('');
  const [emoji, setEmoji]         = useState('😊');
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const [added, setAdded]         = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { saveEntries(entries); }, [entries]);

  const handleAdd = () => {
    const t = text.trim();
    if (!t) return;
    const newEntry: Entry = {
      text: t,
      emoji,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    };
    setEntries(es => [newEntry, ...es].slice(0, 30)); // keep last 30
    setText('');
    setEmoji('😊');
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleDelete = (i: number) => {
    setEntries(es => es.filter((_, j) => j !== i));
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-amber-50 to-orange-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur-sm border-b border-amber-200 shrink-0">
        <button type="button" onClick={onClose}
          className="text-sm font-bold text-amber-600 hover:text-amber-800 transition-colors">
          ← Back
        </button>
        <h1 className="text-base font-extrabold text-amber-700 tracking-wide">🫶 Gratitude Moments</h1>
        <span className="text-xs text-amber-500">{entries.length} {entries.length === 1 ? 'memory' : 'memories'}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {/* Input area */}
        <div className="bg-white rounded-3xl shadow-md border border-amber-200 p-5 space-y-3">
          <p className="text-sm font-semibold text-amber-600 italic">💭 {PROMPTS[promptIdx]}</p>

          {/* Emoji picker */}
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map(e => (
              <button key={e} type="button" onClick={() => setEmoji(e)}
                className={`text-xl w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                  emoji === e ? 'bg-amber-200 ring-2 ring-amber-400 scale-110' : 'bg-amber-50 hover:bg-amber-100'
                }`}>
                {e}
              </button>
            ))}
          </div>

          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Write something here…"
            rows={3}
            className="w-full resize-none rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-gray-700 placeholder-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />

          <div className="flex items-center gap-3">
            <button type="button" onClick={handleAdd} disabled={!text.trim()}
              className="flex-1 py-2.5 rounded-full bg-amber-400 text-white font-extrabold text-sm hover:bg-amber-500 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
              {added ? '✅ Added to your jar!' : `${emoji} Add to Gratitude Jar`}
            </button>
            <button type="button" onClick={() => setPromptIdx(i => (i + 1) % PROMPTS.length)}
              className="px-3 py-2.5 rounded-full bg-amber-100 text-amber-600 font-bold text-sm hover:bg-amber-200 active:scale-95 transition-all">
              🎲
            </button>
          </div>
        </div>

        {/* Gratitude jar visual */}
        {entries.length > 0 && (
          <div className="text-center space-y-2">
            <div className="inline-flex items-end gap-1 flex-wrap justify-center max-w-xs mx-auto bg-white/60 rounded-3xl p-4 border border-amber-200">
              {entries.slice(0, 10).map((e, i) => (
                <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s`, animationDuration: '2s' }}>
                  {e.emoji}
                </span>
              ))}
              {entries.length > 10 && <span className="text-xs text-amber-400 font-bold">+{entries.length - 10} more</span>}
            </div>
            <p className="text-xs text-amber-500 font-semibold">Your gratitude jar ✨</p>
          </div>
        )}

        {/* Entry list */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Recent memories</p>
            {entries.map((e, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-2xl border border-amber-100 px-4 py-3 shadow-sm group">
                <span className="text-2xl shrink-0">{e.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{e.text}</p>
                  <p className="text-[10px] text-amber-400 mt-0.5">{e.date}</p>
                </div>
                <button type="button" onClick={() => handleDelete(i)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-xs transition-all shrink-0 mt-0.5">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {entries.length === 0 && (
          <div className="text-center py-10 text-amber-300 space-y-2">
            <p className="text-5xl">🫙</p>
            <p className="text-sm font-semibold">Your gratitude jar is empty.</p>
            <p className="text-xs">Add your first happy memory above!</p>
          </div>
        )}
      </div>
    </div>
  );
};
