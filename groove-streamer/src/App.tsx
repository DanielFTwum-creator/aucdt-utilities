/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { openDB } from 'idb';
import { Play, Download, Disc3 } from 'lucide-react';
import { generateGroove } from './services/musicService';
import { GENRE_DESCRIPTIONS } from './constants';
import Admin from './components/Admin';
import AudioPlayer from './components/AudioPlayer';
import { motion } from 'motion/react';

// ─── VU Meter animation shown while generating ────────────────────────────────

const VU_BARS = [
  { h: 10, d: 0.40 }, { h: 22, d: 0.55 }, { h: 16, d: 0.38 },
  { h: 28, d: 0.62 }, { h: 12, d: 0.34 }, { h: 26, d: 0.58 },
  { h: 20, d: 0.45 }, { h: 30, d: 0.65 }, { h: 14, d: 0.37 },
  { h: 24, d: 0.52 }, { h: 18, d: 0.42 }, { h: 22, d: 0.50 },
];

function VuMeterBars() {
  return (
    <div className="flex items-end justify-center gap-[3px] h-8">
      {VU_BARS.map((bar, i) => (
        <div
          key={i}
          className="vu-bar"
          style={{
            '--bar-height': `${bar.h}px`,
            '--bar-duration': `${bar.d}s`,
            animationDelay: `${i * 0.035}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Ornamental rule divider ──────────────────────────────────────────────────

function OrnamentalRule() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #9A6828)' }} />
      <span style={{ color: '#C89040', fontSize: '10px' }}>◆</span>
      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #9A6828)' }} />
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [bpm, setBpm] = useState(160);
  const [style, setStyle] = useState<string>('inclusive');

  useEffect(() => {
    const checkApiKey = async () => {
      if ((window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const [savedGrooves, setSavedGrooves] = useState<{ id: string; base64: string; mimeType: string; bpm: number; style: string; timestamp: number }[]>([]);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState<number | null>(null);
  const dbRef = useRef<any>(null);

  useEffect(() => {
    const initDB = async () => {
      const db = await openDB('groove-streamer', 1, {
        upgrade(db) {
          db.createObjectStore('grooves', { keyPath: 'id' });
        },
      });
      dbRef.current = db;

      const saved = localStorage.getItem('groove_streamer_saved_grooves');
      if (saved) {
        const grooves = JSON.parse(saved);
        const tx = db.transaction('grooves', 'readwrite');
        for (const groove of grooves) {
          await tx.store.put(groove);
        }
        await tx.done;
        localStorage.removeItem('groove_streamer_saved_grooves');
      }

      const allGrooves = await db.getAll('grooves');
      setSavedGrooves(allGrooves.sort((a, b) => b.timestamp - a.timestamp));
    };
    initDB();
  }, []);

  const [currentGroove, setCurrentGroove] = useState<{ base64: string; mimeType: string; bpm: number } | null>(null);
  const [hasAutoplayed, setHasAutoplayed] = useState(false);
  const [autoPlayPlayer, setAutoPlayPlayer] = useState(false);

  useEffect(() => {
    if (savedGrooves.length > 0 && !hasAutoplayed) {
      playGrooveAtIndex(0, true);
      setHasAutoplayed(true);
    }
  }, [savedGrooves, hasAutoplayed]);

  const playGrooveAtIndex = (index: number, autoPlay: boolean = true) => {
    if (index < 0 || index >= savedGrooves.length) return;
    const groove = savedGrooves[index];
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const bytes = Uint8Array.from(atob(groove.base64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: groove.mimeType });
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setCurrentPlaylistIndex(index);
    setCurrentGroove({ base64: groove.base64, mimeType: groove.mimeType, bpm: groove.bpm });
    setAutoPlayPlayer(autoPlay);
  };

  const handleSaveToDrive = async () => {
    if (!currentGroove) return;
    try {
      const response = await fetch('/api/auth/url');
      const { url } = await response.json();
      const authWindow = window.open(url, 'oauth_popup', 'width=600,height=700');
      const handleMessage = async (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          const uploadResponse = await fetch('/api/drive/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentGroove),
          });
          if (uploadResponse.ok) {
            alert('Saved to Google Drive!');
          } else {
            alert('Failed to save to Google Drive.');
          }
        }
      };
      window.addEventListener('message', handleMessage);
    } catch (error) {
      console.error('Save to Drive error:', error);
      alert('Failed to save to Google Drive.');
    }
  };

  const downloadGroove = (groove: any) => {
    const bytes = Uint8Array.from(atob(groove.base64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: groove.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `groove-${groove.bpm}bpm-${groove.style || 'inclusive'}-${groove.timestamp}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEnded = () => {
    if (savedGrooves.length === 0) {
      setAudioUrl(null);
      setCurrentPlaylistIndex(null);
      return;
    }
    const nextIndex = (currentPlaylistIndex === null || currentPlaylistIndex >= savedGrooves.length - 1)
      ? 0
      : currentPlaylistIndex + 1;
    playGrooveAtIndex(nextIndex, true);
  };

  const saveGroove = async (base64: string, mimeType: string, bpm: number, style: string) => {
    const newGroove = { id: Date.now().toString(), base64, mimeType, bpm, style, timestamp: Date.now() };
    if (dbRef.current) {
      await dbRef.current.put('grooves', newGroove);
      const allGrooves = await dbRef.current.getAll('grooves');
      setSavedGrooves(allGrooves.sort((a, b) => b.timestamp - a.timestamp));
    }
    playGrooveAtIndex(0, true);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateGroove({ bpm, style: style !== 'inclusive' ? style as any : undefined });
      setAudioUrl(result.url);
      await saveGroove(result.base64, result.mimeType, bpm, style);
      setCurrentGroove({ base64: result.base64, mimeType: result.mimeType, bpm });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate groove.';
      if (errorMessage.includes('403') || errorMessage.includes('PERMISSION_DENIED')) {
        setHasApiKey(false);
        setError('Permission denied. Please re-select a valid API key with access to Lyria models.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const openKeyDialog = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const bpmFill = `${((bpm - 60) / 140) * 100}%`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center min-h-screen px-4 py-6 md:py-16 md:px-8"
    >

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="w-full max-w-5xl mb-6 md:mb-12 text-center">
        <p className="font-mono uppercase tracking-[0.45em] mb-4" style={{ fontSize: '9px', color: '#C89040' }}>
          ◆ &nbsp; Studio Session &nbsp; ◆
        </p>
        <h1
          className="font-black leading-none mb-5 tracking-tight"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            color: '#FAF0D8',
            textShadow: '0 2px 40px rgba(200, 146, 30, 0.15)',
          }}
        >
          Groove Streamer
        </h1>
        <OrnamentalRule />
        <p className="font-mono uppercase tracking-[0.35em] mt-4" style={{ fontSize: '9px', color: '#A07838' }}>
          Powered by Gemini Lyria
        </p>
      </header>

      {/* ── Main Grid ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">

        {/* ── Left: Mixing Console ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Console Panel */}
          <div className="studio-panel p-6 flex flex-col gap-6">

            {/* Panel header chrome */}
            <div className="flex items-center justify-between">
              <p className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
                Mixing Console
              </p>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full" style={{ background: '#5A1A1A', boxShadow: loading ? '0 0 6px #8B0000' : 'none' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#5A3A10', boxShadow: !loading && audioUrl ? '0 0 6px #C8921E' : 'none' }} />
                <div className="w-2 h-2 rounded-full" style={{ background: '#1A3A20' }} />
              </div>
            </div>

            {!hasApiKey ? (
              <button
                onClick={openKeyDialog}
                className="w-full py-4 rounded-xl font-mono uppercase tracking-widest text-sm font-bold transition-all"
                style={{ background: 'linear-gradient(135deg, #C8921E, #A87010)', color: '#160C05' }}
              >
                Select API Key
              </button>
            ) : (
              <div className="flex flex-col gap-6">

                {/* BPM Fader */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-baseline">
                    <label htmlFor="bpm" className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
                      Tempo
                    </label>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-mono font-bold tabular-nums"
                        style={{ fontSize: '2rem', color: '#C8921E', textShadow: '0 0 20px rgba(200,146,30,0.45)', lineHeight: 1 }}
                      >
                        {bpm}
                      </span>
                      <span className="font-mono" style={{ fontSize: '10px', color: '#C89040' }}>BPM</span>
                    </div>
                  </div>
                  <input
                    id="bpm"
                    type="range"
                    min="60"
                    max="200"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="w-full rounded-full cursor-pointer"
                    style={{
                      height: '5px',
                      background: `linear-gradient(to right, #C8921E 0%, #C8921E ${bpmFill}, #3E2410 ${bpmFill}, #3E2410 100%)`,
                      outline: 'none',
                    }}
                  />
                  <div className="flex justify-between">
                    <span className="font-mono" style={{ fontSize: '9px', color: '#6A4020' }}>Slow — 60</span>
                    <span className="font-mono" style={{ fontSize: '9px', color: '#6A4020' }}>200 — Fast</span>
                  </div>
                </div>

                {/* Genre Selector */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="style" className="font-mono uppercase tracking-[0.3em]" style={{ fontSize: '9px', color: '#C89040' }}>
                    Genre
                  </label>
                  <select
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full rounded-lg font-mono text-sm cursor-pointer transition-colors focus:outline-none"
                    style={{
                      padding: '10px 12px',
                      background: '#160C05',
                      color: '#FAF0D8',
                      border: '1px solid #3A2010',
                    }}
                  >
                    <option value="inclusive">— Inclusive —</option>
                    <option value="afrobeats">Afrobeats</option>
                    <option value="reggae-dancehall">Reggae / Dancehall</option>
                    <option value="highlife">Highlife</option>
                    <option value="electronic">Electronic</option>
                    <option value="jazz-funk">Jazz-Funk</option>
                    <option value="neosoul">Neo-Soul</option>
                    <option value="hip-hop-trap">Hip-Hop / Trap</option>
                  </select>
                  {GENRE_DESCRIPTIONS[style] && (
                    <p className="font-mono leading-relaxed" style={{ fontSize: '10px', color: '#A07838' }}>
                      {GENRE_DESCRIPTIONS[style]}
                    </p>
                  )}
                </div>

                {/* Record Button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full rounded-xl transition-all"
                  style={loading ? {
                    padding: '14px 0',
                    background: '#261408',
                    border: '1px solid #3A2010',
                    cursor: 'default',
                  } : {
                    padding: '14px 0',
                    background: 'linear-gradient(135deg, #C8921E 0%, #A07010 100%)',
                    color: '#160C05',
                    fontWeight: 700,
                    boxShadow: '0 4px 28px rgba(200,146,30,0.28), inset 0 1px 0 rgba(255,255,255,0.12)',
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-5">
                      <VuMeterBars />
                      <span className="font-mono uppercase tracking-widest" style={{ fontSize: '11px', color: '#C89040' }}>
                        Recording…
                      </span>
                      <VuMeterBars />
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-3 font-mono uppercase tracking-widest" style={{ fontSize: '12px' }}>
                      <span className="rec-dot w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#8B2020' }} />
                      Record Groove
                    </span>
                  )}
                </button>

              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(100,20,20,0.25)', border: '1px solid rgba(139,32,32,0.4)' }}
            >
              <p className="font-mono text-xs" style={{ color: '#F87171' }}>{error}</p>
            </motion.div>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <AudioPlayer url={audioUrl} onEnded={handleEnded} onSave={handleSaveToDrive} autoPlay={autoPlayPlayer} />
            </motion.div>
          )}
        </div>

        {/* ── Right: Session Archive ────────────────────────────────────────── */}
        <div className="w-full">
          {savedGrooves.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="studio-panel overflow-hidden flex flex-col"
            >
              {/* Archive header */}
              <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #5A3A18' }}>
                <div>
                  <p className="font-mono uppercase tracking-[0.3em] mb-1" style={{ fontSize: '9px', color: '#C89040' }}>
                    Session Archive
                  </p>
                  <h2
                    className="font-bold leading-tight"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.15rem', color: '#FAF0D8' }}
                  >
                    Saved Grooves
                  </h2>
                </div>
                <div className="text-right">
                  <div
                    className="font-mono font-bold tabular-nums"
                    style={{ fontSize: '2rem', color: '#C8921E', lineHeight: 1, textShadow: '0 0 16px rgba(200,146,30,0.35)' }}
                  >
                    {savedGrooves.length}
                  </div>
                  <p className="font-mono uppercase tracking-widest" style={{ fontSize: '8px', color: '#A07838' }}>Tracks</p>
                </div>
              </div>

              {/* Track listing */}
              <div className="flex flex-col overflow-y-auto" style={{ maxHeight: '420px', divideColor: '#3A2010' }}>
                {savedGrooves.map((groove, index) => (
                  <motion.div
                    key={groove.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025 }}
                    className="flex items-center gap-3 px-5 py-3 transition-colors"
                    style={{
                      borderBottom: '1px solid #3A2010',
                      background: currentPlaylistIndex === index ? '#301A08' : 'transparent',
                    }}
                    onMouseEnter={e => { if (currentPlaylistIndex !== index) (e.currentTarget as HTMLDivElement).style.background = '#301A08'; }}
                    onMouseLeave={e => { if (currentPlaylistIndex !== index) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    {/* Track number */}
                    <span className="font-mono shrink-0 tabular-nums w-6 text-right" style={{ fontSize: '10px', color: '#9A7030' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Play dot */}
                    <button
                      onClick={() => playGrooveAtIndex(index, true)}
                      aria-label={`Play track ${index + 1}`}
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={currentPlaylistIndex === index ? {
                        background: '#C8921E',
                        color: '#160C05',
                      } : {
                        background: '#3A2010',
                        color: '#C8921E',
                      }}
                    >
                      {currentPlaylistIndex === index ? (
                        <Disc3 className="w-3 h-3" style={{ animation: 'spin 3s linear infinite' }} />
                      ) : (
                        <Play className="w-2.5 h-2.5 ml-px" />
                      )}
                    </button>

                    {/* Info */}
                    <button onClick={() => playGrooveAtIndex(index, true)} className="flex-1 text-left min-w-0">
                      <div className="font-mono truncate" style={{ fontSize: '12px', color: '#FAF0D8' }}>
                        {groove.bpm} BPM
                        {groove.style && groove.style !== 'inclusive' && (
                          <span className="ml-2 uppercase" style={{ fontSize: '9px', color: '#C89040', letterSpacing: '0.1em' }}>
                            {groove.style}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Time + Download */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="font-mono" style={{ fontSize: '9px', color: '#9A7030' }}>
                        {new Date(groove.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => downloadGroove(groove)}
                        title="Download WAV"
                        className="transition-colors"
                        style={{ color: '#9A7030' }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = '#C8921E'}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = '#9A7030'}
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Empty state */
            <div
              className="studio-panel p-8 flex flex-col items-center justify-center gap-4 text-center"
              style={{ minHeight: '200px' }}
            >
              <div style={{ color: '#9A7030' }}>
                <Disc3 size={40} />
              </div>
              <p
                className="font-bold"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: '#C89040', fontSize: '1.1rem' }}
              >
                No Grooves Yet
              </p>
              <p className="font-mono" style={{ fontSize: '10px', color: '#9A7030' }}>
                Hit Record to lay down your first track
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="w-full max-w-5xl mt-8 md:mt-16 flex flex-col items-center gap-4">
        <OrnamentalRule />
        <Link
          to="/admin"
          className="font-mono uppercase transition-colors"
          style={{ fontSize: '9px', letterSpacing: '0.4em', color: '#7A5520' }}
          onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#C89040'}
          onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = '#7A5520'}
        >
          ◆ Control Room ◆
        </Link>
      </footer>

    </motion.div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASENAME || '/'}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
