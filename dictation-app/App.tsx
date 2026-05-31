import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { RecordingStore, Note } from './db';
import { useAuth } from './src/auth/AuthContext';
import { useTheme } from './src/contexts/ThemeContext';
import { Header } from './src/components/shared/Header';
import { Button } from './src/components/shared/Button';
import { Tabs } from './src/components/shared/Tabs';
import { Mic, Plus } from 'lucide-react';

const MODEL_NAME = 'gemini-2.5-flash';
const store = new RecordingStore();

export default function App() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  
  // State
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Ready to record');
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
    
    ctx.fillStyle = '#f43f5e';
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
      {/* Header */}
      {!isRecording ? (
        <Header
          title="Dictation App"
          subtitle={user ? `Signed in as ${user.username}` : 'System Ready'}
          icon={<Mic className="w-6 h-6" />}
          onLogout={logout}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={toggleRecording}
                icon={<Mic className="w-4 h-4" />}
                title="Start Recording"
              >
                Record
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewNote}
                icon={<Plus className="w-4 h-4" />}
                title="New Note"
                aria-label="Create new note"
              />
            </div>
          }
        />
      ) : (
        <header className="bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-10 gap-5">
              <div className="live-timer font-mono text-5xl text-white font-light tracking-widest drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
                {formatTime(recordingTimeMs)}
              </div>

              <canvas ref={canvasRef} className="w-full max-w-[500px] h-[60px]" />

              <Button
                onClick={toggleRecording}
                variant="secondary"
                size="lg"
                className="w-24 h-24 rounded-full shadow-2xl bg-white text-rose-600 hover:bg-slate-50 flex-shrink-0"
              >
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="5" y="5" width="10" height="10" />
                </svg>
              </Button>

              <p className="text-white text-sm font-medium animate-pulse tracking-wide uppercase">
                Recording Live...
              </p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col">
          {/* Note surface — a generous, centred document card that fills the height */}
          <div className="flex-1 flex flex-col bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm p-6 sm:p-10">
            {/* Title */}
            <input
              type="text"
              className="text-3xl sm:text-4xl font-display font-bold w-full outline-none bg-transparent
                text-slate-900 dark:text-white
                placeholder:text-slate-400 dark:placeholder:text-slate-500
                border-b border-slate-200 dark:border-slate-700 focus:border-blue-500
                rounded-none pb-2 transition-colors"
              placeholder="Untitled Note"
              value={currentNote.title}
              onChange={e => setCurrentNote({ ...currentNote, title: e.target.value })}
              disabled={isRecording}
              aria-label="Note title"
            />
            {/* Owner (R3 — Firstname Lastname of the logged-in user) */}
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Owner: <span className="font-medium text-slate-700 dark:text-slate-200">{user?.username || 'You'}</span>
            </p>

            {(!currentNote.rawTranscription && !isRecording && status === 'Ready to record') ? (
              /* Single hero empty state with a large, central record CTA */
              <div className="flex-1 flex flex-col items-center justify-center text-center py-10">
                <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-5">
                  <Mic className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-display font-semibold text-slate-900 dark:text-white mb-2">
                  Capture your thoughts
                </h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-7">
                  Tap the button and start talking — AI will instantly transcribe and polish your notes.
                </p>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="inline-flex items-center gap-2.5 px-7 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-lg shadow-rose-600/25 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                  Start recording
                </button>
              </div>
            ) : (
              <div className="mt-6">
                {status !== 'Ready to record' && status !== 'Complete' && !isRecording && (
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 animate-pulse mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    {status}
                  </div>
                )}
                <Tabs
                  tabs={[
                    {
                      id: 'polished',
                      label: 'Polished Note',
                      content: (
                        <div className="prose dark:prose-invert max-w-none prose-headings:font-display prose-a:text-blue-500 dark:prose-a:text-blue-400">
                          {currentNote.polishedNote ? (
                            <div dangerouslySetInnerHTML={{ __html: currentNote.polishedNote }} />
                          ) : (
                            <p className="text-slate-500 dark:text-slate-400 italic">
                              Your polished note will appear here.
                            </p>
                          )}
                        </div>
                      ),
                    },
                    {
                      id: 'raw',
                      label: 'Raw Transcript',
                      content: (
                        <div className="text-slate-700 dark:text-slate-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                          {currentNote.rawTranscription || (
                            <p className="text-slate-500 dark:text-slate-400 italic">
                              The raw transcript will appear here after recording.
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
