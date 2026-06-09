import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { RecordingStore, Note } from './db';
import { useAuth } from './src/auth/AuthContext';
import { useTheme } from './src/contexts/ThemeContext';
import { Header } from './src/components/shared/Header';
import { Button } from './src/components/shared/Button';
import { Tabs } from './src/components/shared/Tabs';
import { Mic, Plus, X, ChevronRight, ChevronLeft, Mic2, FileText, Sparkles } from 'lucide-react';

// ── Dismissible Onboarding Tutorial ─────────────────────────────
const TUTORIAL_KEY = 'dictation_tutorial_dismissed_v1';

const TUTORIAL_STEPS = [
  {
    icon: <Mic2 className="w-8 h-8" style={{ color: 'var(--cyan)' }} />,
    title: 'Welcome to Dictation Studio',
    body: 'A professional AI-powered note-taking environment. Speak naturally — the AI transcribes and polishes your words instantly.',
  },
  {
    icon: <Sparkles className="w-8 h-8" style={{ color: 'var(--amber)' }} />,
    title: 'One-tap recording',
    body: 'Hit the microphone button in the header or the standby screen to start. A live waveform and broadcast timer appear while you speak. Tap the stop square when done.',
  },
  {
    icon: <FileText className="w-8 h-8" style={{ color: '#22D3A0' }} />,
    title: 'Polished & Raw views',
    body: 'Switch between your AI-polished note and the raw transcript. New note resets the session. Your work is auto-saved.',
  },
];

function OnboardingTutorial({ onDismiss }: { onDismiss: () => void }) {
  const [step, setStep] = useState(0);
  const current = TUTORIAL_STEPS[step];
  const isLast = step === TUTORIAL_STEPS.length - 1;

  const next = () => isLast ? onDismiss() : setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal aria-label="Getting started tutorial">
      <div className="tutorial-card">
        {/* Dismiss X */}
        <button
          onClick={onDismiss}
          aria-label="Skip tutorial"
          className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{ background: 'rgba(var(--accent-rgb),0.06)', border: '1px solid rgba(var(--accent-rgb),0.1)', color: 'var(--text-muted)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-muted)'; }}
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Step dots */}
        <div className="flex gap-2 mb-6">
          {TUTORIAL_STEPS.map((_, i) => (
            <span key={i} className={`tutorial-step-dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(var(--accent-rgb),0.06)', border: '1px solid rgba(var(--accent-rgb),0.1)' }}
        >
          {current.icon}
        </div>

        {/* Text */}
        <h2
          className="font-display font-bold mb-3"
          style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}
        >
          {current.title}
        </h2>
        <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
          {current.body}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              onClick={back}
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-secondary)', background: 'rgba(var(--accent-rgb),0.05)' }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <span />}

          <button
            onClick={next}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
            style={{
              background: 'var(--cyan)',
              color: 'var(--studio-black)',
              boxShadow: '0 0 16px rgba(var(--accent-rgb),0.25)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(var(--accent-rgb),0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(var(--accent-rgb),0.25)'; }}
          >
            {isLast ? 'Get started' : (<>Next <ChevronRight className="w-4 h-4" /></>)}
          </button>
        </div>
      </div>
    </div>
  );
}

const MODEL_NAME = 'gemini-2.5-flash';
const store = new RecordingStore();

export default function App() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Ready to record');

  // Onboarding tutorial — shown once to new users
  const [showTutorial, setShowTutorial] = useState<boolean>(
    () => !localStorage.getItem(TUTORIAL_KEY)
  );
  const dismissTutorial = () => {
    localStorage.setItem(TUTORIAL_KEY, '1');
    setShowTutorial(false);
  };
  const [activeTab, setActiveTab] = useState<'polished' | 'raw'>('polished');
  const [currentNote, setCurrentNote] = useState<Note>({
    id: 'new',
    title: '',
    rawTranscription: '',
    polishedNote: '',
    timestamp: Date.now()
  });
  
  // Visualizer / Recording
  const [recordingTimeMs, setRecordingTimeMs] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const reqFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const persistIntervalRef = useRef<number | null>(null);

  // Initialize DB and recovery
  useEffect(() => {
    const initDb = async () => {
      await store.open();
      const saved = await store.load();
      if (saved && saved.chunks.length > 0) {
        // Recovery UI logic
        if (confirm(`A recording from ${Math.round((Date.now() - saved.startedAt)/60000)} mins ago was not processed. Recover?`)) {
          const blob = new Blob(saved.chunks, { type: saved.mimeType });
          processAudio(blob);
          await store.clear();
        } else {
          await store.clear();
        }
      }
    };
    initDb();
    
    return () => {
      stopRecordingCleanup();
    };
  }, []);

  const stopRecordingCleanup = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (persistIntervalRef.current) clearInterval(persistIntervalRef.current);
    if (reqFrameRef.current) cancelAnimationFrame(reqFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.warn);
    }
    mediaRecorderRef.current = null;
  };

  const drawWaveform = useCallback(() => {
    if (!analyserRef.current || !canvasRef.current || !isRecording) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    reqFrameRef.current = requestAnimationFrame(drawWaveform);
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const numBars = Math.floor(bufferLength * 0.5);
    const totalWidth = canvas.width / numBars;
    const barWidth = Math.max(1, totalWidth * 0.7);
    const spacing = Math.max(0, totalWidth * 0.3);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#F0C84A');   // TUC Gold (light)
    gradient.addColorStop(0.5, '#B8860B'); // TUC Gold
    gradient.addColorStop(1, '#6B0000');   // TUC Maroon
    ctx.fillStyle = gradient;
    let x = 0;
    
    for (let i = 0; i < numBars; i++) {
      if (x >= canvas.width) break;
      const dataIdx = Math.floor(i * (bufferLength / numBars));
      let barHeight = (dataArray[dataIdx] / 255.0) * canvas.height;
      if (barHeight > 0 && barHeight < 1) barHeight = 1;
      
      const y = (canvas.height - barHeight) / 2;
      ctx.fillRect(x, y, barWidth, barHeight);
      x += barWidth + spacing;
    }
  }, [isRecording]);

  // Start the waveform loop once recording begins and the canvas is mounted.
  // The canvas only renders while isRecording is true, so sizing + the first
  // draw must run from here (after the state flip + mount) rather than inside
  // toggleRecording, where canvasRef is still null and the closure sees stale state.
  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    drawWaveform();
  }, [isRecording, drawWaveform]);

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setStatus('Processing audio...');
      stopRecordingCleanup();
    } else {
      try {
        setStatus('Requesting microphone access...');
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false } });
        }
        
        streamRef.current = stream;
        audioChunksRef.current = [];
        
        // Setup Audio visualizer
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        // Canvas sizing + waveform start happen in a useEffect keyed on isRecording,
        // once the canvas has actually mounted (it only renders while recording).

        // Setup Media Recorder
        let recorder: MediaRecorder;
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        } catch {
          recorder = new MediaRecorder(stream);
        }
        
        recorder.ondataavailable = e => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        
        recorder.onstop = () => {
          const mimeType = recorder.mimeType || 'audio/webm';
          const blob = new Blob(audioChunksRef.current, { type: mimeType });
          if (blob.size > 0) processAudio(blob, mimeType);
          else setStatus('No audio captured.');
        };
        
        mediaRecorderRef.current = recorder;
        recorder.start(100);
        setIsRecording(true);
        setStatus('Recording live');
        
        startTimeRef.current = Date.now();
        timerIntervalRef.current = window.setInterval(() => {
          setRecordingTimeMs(Date.now() - startTimeRef.current);
        }, 50);
        
        await store.save([], recorder.mimeType, startTimeRef.current);
        persistIntervalRef.current = window.setInterval(() => {
          store.save([...audioChunksRef.current], recorder.mimeType || 'audio/webm', startTimeRef.current);
        }, 30000);
        
      } catch (err) {
        setStatus(`Error: ${(err as Error).message}`);
        setIsRecording(false);
      }
    }
  };

  const processAudio = async (blob: Blob, mimeType: string = 'audio/webm') => {
    try {
      setStatus('Converting audio...');
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      
      setStatus('Processing dictation...');
      const API_BASE = (import.meta as any).env?.VITE_API_URL || 'https://ai-tools.techbridge.edu.gh';
      const response = await fetch(`${API_BASE}/ai-lab/api/dictation/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mimeType, base64Audio })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }

      const { rawTranscription, polishedNote } = await response.json();

      if (!rawTranscription) {
        setStatus('Transcription returned empty.');
        return;
      }
      
      const htmlContent = await marked.parse(polishedNote);
      
      setCurrentNote(prev => {
        const next = { ...prev, rawTranscription, polishedNote: htmlContent };
        store.saveNote(next);
        return next;
      });
      
      setStatus('Complete');
      await store.clear();
      
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${(err as Error).message}`);
    }
  };

  const handleNewNote = () => {
    if (isRecording) toggleRecording();
    setCurrentNote({
      id: crypto.randomUUID(),
      title: '',
      rawTranscription: '',
      polishedNote: '',
      timestamp: Date.now()
    });
    setStatus('Ready to record');
    setRecordingTimeMs(0);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    const hunds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${mins}:${secs}.${hunds}`;
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* ── Onboarding Tutorial ───────────────────────────────── */}
      {showTutorial && <OnboardingTutorial onDismiss={dismissTutorial} />}

      {/* ── Header ─────────────────────────────────────────────── */}
      {!isRecording ? (
        <Header
          title="Dictation Studio"
          subtitle={user ? `OPERATOR · ${user.username.toUpperCase()}` : 'SYSTEM READY'}
          icon={<Mic className="w-4 h-4" />}
          onLogout={logout}
          actions={
            <div className="flex items-center gap-2">
              {/* Record button — only once a note exists; on standby the hero mic is the sole control */}
              {currentNote.polishedNote && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  title="Start recording"
                  className="record-button"
                  aria-label="Start recording"
                >
                  <Mic className="w-5 h-5" />
                </button>
              )}
              {/* New note */}
              <button
                onClick={handleNewNote}
                title="New note"
                aria-label="Create new note"
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                style={{
                  background: 'rgba(var(--accent-rgb),0.05)',
                  border: '1px solid rgba(var(--accent-rgb),0.1)',
                  color: 'var(--text-secondary)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          }
        />
      ) : (
        /* ── Broadcast Recording Header ─────────────────────── */
        <header className="app-header recording sticky top-0 z-40">
          {/* REC badge */}
          <div className="rec-badge mb-1">
            <span className="rec-dot" />
            REC
          </div>

          {/* Timer */}
          <div className="live-timer">{formatTime(recordingTimeMs)}</div>

          {/* Waveform canvas */}
          <canvas
            ref={canvasRef}
            className="w-full max-w-[480px] h-[44px] my-1"
            style={{ opacity: 0.9 }}
          />

          {/* Stop button */}
          <button
            onClick={toggleRecording}
            aria-label="Stop recording"
            className="record-button recording mt-1"
            style={{ width: 52, height: 52 }}
          >
            {/* Stop square icon */}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="5" y="5" width="10" height="10" rx="1" />
            </svg>
          </button>
        </header>
      )}

      {/* ── Main Canvas ────────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col items-center relative z-10"
        style={{ padding: '1.5rem 1rem' }}
      >
        <div className="w-full max-w-4xl flex-1 flex flex-col gap-0">

          {/* Monitor panel */}
          <div
            className="flex-1 flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(var(--surface-rgb),0.7)',
              border: '1px solid rgba(var(--accent-rgb),0.1)',
              boxShadow: '0 0 0 1px rgba(var(--accent-rgb),0.04), 0 24px 48px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Panel top-bar */}
            <div
              className="flex items-center justify-between px-5 py-3 flex-shrink-0"
              style={{
                borderBottom: '1px solid rgba(var(--accent-rgb),0.08)',
                background: 'rgba(var(--surface-rgb),0.5)',
              }}
            >
              <div className="flex items-center gap-2">
                {/* Panel indicator dots */}
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--rec-red)', opacity: 0.7 }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--amber)', opacity: 0.7 }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#22D3A0', opacity: 0.7 }} />
                <span
                  className="ml-3 text-[10px] font-mono uppercase tracking-widest"
                  style={{ color: 'var(--text-muted)' }}
                >
                  NOTE MONITOR
                </span>
              </div>

              {/* Processing status pill */}
              {status !== 'Ready to record' && status !== 'Complete' && !isRecording && (
                <div
                  className="flex items-center gap-2 text-[10px] font-mono px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(var(--accent-rgb),0.06)',
                    border: '1px solid rgba(var(--accent-rgb),0.15)',
                    color: 'var(--cyan)',
                  }}
                >
                  <div className="spinner" style={{ width: 10, height: 10 }} />
                  {status}
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1 flex flex-col p-6 sm:p-8">
              {/* Title input */}
              <input
                type="text"
                className="w-full outline-none bg-transparent font-display font-bold pb-3 mb-1 transition-colors"
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  color: 'var(--text-primary)',
                  borderBottom: '1px solid rgba(var(--accent-rgb),0.12)',
                  caretColor: 'var(--cyan)',
                }}
                placeholder="Untitled Session"
                value={currentNote.title}
                onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
                disabled={isRecording}
                aria-label="Note title"
                onFocus={e => { (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(var(--accent-rgb),0.4)'; }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderBottomColor = 'rgba(var(--accent-rgb),0.12)'; }}
              />

              {/* Owner */}
              <p
                className="text-[11px] font-mono mb-6"
                style={{ color: 'var(--text-muted)' }}
              >
                OPERATOR:{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                  {user?.username?.toUpperCase() || 'UNKNOWN'}
                </span>
              </p>

              {/* Tabs */}
              <div className="flex-1 flex flex-col">
                <Tabs
                  tabs={[
                    {
                      id: 'polished',
                      label: 'Polished Note',
                      content: (
                        <div className="note-editor">
                          {currentNote.polishedNote ? (
                            <div dangerouslySetInnerHTML={{ __html: currentNote.polishedNote }} />
                          ) : (
                            /* ── STANDBY empty state ─── */
                            <div className="flex flex-col items-center justify-center text-center py-16">
                              {/* Single, calm record button (no competing mics, no blinking) */}
                              <button
                                type="button"
                                onClick={toggleRecording}
                                aria-label="Start recording"
                                className="relative w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-200"
                                style={{
                                  background: 'rgba(var(--accent-rgb),0.08)',
                                  border: '1px solid rgba(var(--accent-rgb),0.3)',
                                  boxShadow: '0 0 32px rgba(var(--accent-rgb),0.1)',
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 44px rgba(var(--accent-rgb),0.24)'; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 32px rgba(var(--accent-rgb),0.1)'; }}
                              >
                                <Mic className="w-10 h-10" style={{ color: 'var(--cyan)' }} />
                              </button>

                              <div
                                className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase mb-3"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                ◈ STANDBY ◈
                              </div>

                              <h3
                                className="font-display font-semibold mb-2"
                                style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}
                              >
                                Ready to capture
                              </h3>
                              <p
                                className="text-sm max-w-xs leading-relaxed"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                Tap the microphone to begin your session. AI will transcribe and polish your notes in real time.
                              </p>
                            </div>
                          )}
                        </div>
                      ),
                    },
                    {
                      id: 'raw',
                      label: 'Raw Transcript',
                      content: (
                        <div
                          className="text-sm whitespace-pre-wrap leading-relaxed"
                          style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
                        >
                          {currentNote.rawTranscription || (
                            <p
                              className="text-center py-10 text-sm italic"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              Raw transcript will appear here after recording.
                            </p>
                          )}
                        </div>
                      ),
                    },
                  ]}
                  defaultTab="polished"
                  onChange={id => setActiveTab(id as 'polished' | 'raw')}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
