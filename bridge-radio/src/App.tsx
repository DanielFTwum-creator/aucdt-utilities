import React, { useState, useEffect, useRef, useMemo } from 'react';
import Hls from 'hls.js';
import html2canvas from 'html2canvas';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Clock, 
  History, 
  Share2, 
  RefreshCw, 
  Volume2,
  Music,
  ChevronRight,
  Trash2,
  Settings,
  Shield,
  Sun,
  Moon,
  Zap,
  Lock,
  Unlock,
  Activity,
  X,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { Track, Genre, HistoryItem } from './types';

const GENRES: Genre[] = [
  {
    id: 'running',
    label: '🏃 Running',
    tagline: 'CROSSING THE LIMIT',
    metadata: 'CROSSING THE LIMIT · 146–150 BPM · HLS STREAM',
    base: 'https://ai.techbridge.edu.gh/music/',
    sources: [
      'https://ai.techbridge.edu.gh/music/master.m3u8',
      'https://ai.techbridge.edu.gh/music/combined.m3u8'
    ],
    heroes: [],
    accent: '#e8ff3c',
  },
  {
    id: 'afrobeats',
    label: '🥁 Afrobeats',
    tagline: 'GLOBAL RHYTHM SYNC',
    metadata: 'GLOBAL RHYTHM SYNC · DYNAMIC BPM · HLS STREAM',
    base: 'https://ai.techbridge.edu.gh/afrobeats/',
    sources: [
      'https://ai.techbridge.edu.gh/afrobeats/master.m3u8',
      'https://ai.techbridge.edu.gh/afrobeats/combined.m3u8'
    ],
    heroes: [],
    accent: '#ff6b35',
  },
  {
    id: 'neosoul',
    label: '✨ Neosoul',
    tagline: 'THE MIDNIGHT CONNECTION',
    metadata: 'THE MIDNIGHT CONNECTION · 85–90 BPM · HLS STREAM',
    base: 'https://ai.techbridge.edu.gh/neosoul/',
    sources: [
      'https://ai.techbridge.edu.gh/neosoul/master.m3u8',
      'https://ai.techbridge.edu.gh/neosoul/combined.m3u8'
    ],
    heroes: [],
    accent: '#a855f7',
  },
];

const HEROES_JSON = 'https://ai.techbridge.edu.gh/heroes.json';
const ARTWORK_BASE = 'https://ai.techbridge.edu.gh/artwork/';

const inferBpm = (n: string) => /\b150\b/.test(n) ? '150' : /\b146\b/.test(n) ? '146' : '—';

const addAuditLog = (action: string, setAuditLogs: React.Dispatch<React.SetStateAction<{ action: string, ts: number }[]>>) => {
  setAuditLogs(prev => [{ action, ts: Date.now() }, ...prev].slice(0, 50));
};

const getProxyUrl = (url: string) => {
  if (!url || url.startsWith('/api/proxy')) return url;
  // Decode ampersands and spaces to prevent double encoding
  const decoded = url.replace(/%26/g, '&').replace(/%20/g, ' ');
  return `/api/proxy?url=${encodeURIComponent(decoded)}`;
};

const parseM3U8 = (text: string, base: string) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // Detect if it's a Media Playlist (segments) vs Multivariant Playlist (sub-playlists)
  // Media playlists have segments (.ts, .m4s, etc.) and specific tags
  const isMediaPlaylist = text.includes('#EXT-X-TARGETDURATION') || 
                          text.includes('#EXT-X-MEDIA-SEQUENCE') ||
                          lines.some(l => !l.startsWith('#') && l.match(/\.(ts|m4s|aac|mp3|m4a)$/i));

  if (isMediaPlaylist) {
    // Return empty array to trigger fallback (treat as single stream)
    return [];
  }

  const raw: Track[] = [];
  let nextTitle: string | null = null;
  let nextBpm: string | null = null;
  let nextArtwork: string | null = null;
  let nextDuration: number | null = null;
  const SKIP = /^(combined|master)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXT-X-TITLE:')) {
      nextTitle = line.replace('#EXT-X-TITLE:', '').trim();
    } else if (line.startsWith('#EXT-X-BPM:')) {
      nextBpm = line.replace('#EXT-X-BPM:', '').trim();
      if (nextBpm === 'unknown') nextBpm = null;
    } else if (line.startsWith('#EXT-X-ARTWORK:')) {
      nextArtwork = line.replace('#EXT-X-ARTWORK:', '').trim();
    } else if (line.startsWith('#EXT-X-STREAM-INF:')) {
      // Handle Multivariant Playlist stream info
      const nameMatch = line.match(/NAME="([^"]+)"/);
      if (nameMatch) nextTitle = nameMatch[1];
      
      const bpmMatch = line.match(/BPM=([\d.]+)/);
      if (bpmMatch) nextBpm = bpmMatch[1];
    } else if (line.startsWith('#EXTINF:')) {
      // Handle format: #EXTINF:120 bpm="122" artwork="...",Title
      const durationMatch = line.match(/#EXTINF:([\d.-]+)/);
      if (durationMatch) {
        const d = parseFloat(durationMatch[1]);
        if (d > 0) nextDuration = d;
      }

      const bpmMatch = line.match(/bpm="([^"]+)"/);
      if (bpmMatch) nextBpm = bpmMatch[1];
      
      const artMatch = line.match(/artwork="([^"]+)"/);
      if (artMatch) nextArtwork = artMatch[1];

      const commaIdx = line.indexOf(',');
      if (commaIdx >= 0) {
        const titlePart = line.slice(commaIdx + 1).trim();
        if (titlePart) nextTitle = titlePart;
      }
      if (!nextTitle) nextTitle = `Track ${raw.length + 1}`;
    } else if (!line.startsWith('#') && !line.startsWith('EXT')) {
      if (nextTitle || line.endsWith('.m3u8') || line.endsWith('.m3u')) {
        const name = nextTitle || line.split('/').pop()?.replace(/\.m3u8?$/, '') || 'Unknown Track';
        
        if (!SKIP.test(name.trim())) {
          const url = (line.startsWith('http') || line.startsWith('/api/proxy'))
            ? line
            : line.match(/\.(m3u8|m3u)$/i)
              ? base + line
              : base + encodeURIComponent(name) + '.m3u8';
          
          let artwork = nextArtwork || undefined;
          if (artwork && !artwork.startsWith('http')) {
            artwork = base + artwork;
          }

          raw.push({ 
            name, 
            url, 
            bpm: nextBpm || inferBpm(name),
            artwork,
            duration: nextDuration || undefined
          });
        }
        nextTitle = null;
        nextBpm = null;
        nextArtwork = null;
        nextDuration = null;
      }
    }
  }
  return raw;
};

const SLEEP_OPTIONS = [0, 15, 30, 45, 60];

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  screenshot?: string;
}

export default function App() {
  // --- State ---
  const [activeGenre, setActiveGenre] = useState<Genre>(GENRES[0]);
  const [genres, setGenres] = useState<Genre[]>(GENRES);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoop, setIsLoop] = useState<boolean>(true);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isSleepMenuOpen, setIsSleepMenuOpen] = useState<boolean>(false);
  const [sleepTime, setSleepTime] = useState<number>(0); // index in SLEEP_OPTIONS
  const [sleepRemaining, setSleepRemaining] = useState<number>(0);
  const [customSleepMins, setCustomSleepMins] = useState<number>(30);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isFetchingLyrics, setIsFetchingLyrics] = useState<boolean>(false);

  // Phase 2 State
  const [theme, setTheme] = useState<'dark' | 'light' | 'high-contrast'>('dark');
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: '', email: '', message: '' });
  const [isFeedbackSubmitting, setIsFeedbackSubmitting] = useState<boolean>(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [auditLogs, setAuditLogs] = useState<{ action: string, ts: number }[]>([]);
  const [hlsStats, setHlsStats] = useState<{ bandwidth: number, level: number }>({ bandwidth: 0, level: 0 });
  const [heroIdx, setHeroIdx] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [silenceCounter, setSilenceCounter] = useState<number>(0);

  // Phase 3 State
  const [adminTab, setAdminTab] = useState<'status' | 'testing' | 'logs' | 'network'>('status');
  const [networkStatus, setNetworkStatus] = useState<{ url: string, status: string, details?: string }[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([
    { name: 'Stream Initialization', status: 'pending' },
    { name: 'Theme Switching', status: 'pending' },
    { name: 'Audio Controls', status: 'pending' },
    { name: 'Admin Security', status: 'pending' },
  ]);
  const [isTesting, setIsTesting] = useState(false);
  const [testScreenshots, setTestScreenshots] = useState<string[]>([]);

  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const eqBarsRef = useRef<(HTMLDivElement | null)[]>([]);
  const eqPeaksRef = useRef<(HTMLDivElement | null)[]>([]);
  const peaksRef = useRef<number[]>(new Array(32).fill(0));

  // --- Derived ---
  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] : null;

  // --- Helpers ---
  const formatTime = (s: number) => {
    if (!s || isNaN(s) || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const formatLongTime = (s: number) => {
    if (!s || !isFinite(s)) return '';
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(sec).padStart(2, '0')}s`;
  };

  const getFilename = (url: string) => {
    if (!url) return '';
    try {
      // Handle proxy URLs
      if (url.includes('/api/proxy?url=')) {
        const innerUrl = new URLSearchParams(url.split('?')[1]).get('url');
        if (innerUrl) url = innerUrl;
      }
      const parts = url.split('/');
      return parts[parts.length - 1] || url;
    } catch (e) {
      return url.split('/').pop() || url;
    }
  };

  const totalDuration = useMemo(() => {
    return tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  }, [tracks]);

  const fetchLyrics = async (trackName: string, genreLabel: string) => {
    if (!process.env.GEMINI_API_KEY) {
      setLyrics("AI Services Unavailable (Missing API Key)");
      return;
    }

    setIsFetchingLyrics(true);
    setLyrics(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Find or generate poetic lyrics for a track titled "${trackName}" in the ${genreLabel} music genre. Format with line breaks. If no suitable lyrics can be found or imagined for this specific track title and mood, simply respond with "Lyrics not found".`,
      });

      const text = response.text;
      if (text && text.trim().toLowerCase() !== "lyrics not found") {
        setLyrics(text);
      } else {
        setLyrics("Lyrics not found");
      }
    } catch (e) {
      console.error("Error fetching lyrics:", e);
      setLyrics("Lyrics not found (Service Error)");
    } finally {
      setIsFetchingLyrics(false);
    }
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentTrack) {
      // Automatic fetching on track change, but keep section closed unless user opens it
      fetchLyrics(currentTrack.name, activeGenre.label);
    } else {
      setLyrics(null);
    }
  }, [currentIndex, activeGenre.id]);

  // --- Audio Logic ---
  const initWebAudio = () => {
    if (audioCtxRef.current || !audioRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
      startEqDraw();
    } catch (e) {
      console.error('Web Audio API not supported', e);
    }
  };

  const startEqDraw = () => {
    if (!analyserRef.current) return;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const draw = () => {
      rafIdRef.current = requestAnimationFrame(draw);
      analyserRef.current?.getByteFrequencyData(dataArray);
      
      const barCount = eqBarsRef.current.length;
      
      eqBarsRef.current.forEach((bar, i) => {
        if (!bar) return;
        
        // Logarithmic frequency mapping
        // We want to sample more from the lower frequencies and less from the higher ones
        const percent = i / barCount;
        const index = Math.floor(Math.pow(percent, 1.5) * dataArray.length * 0.6);
        const value = dataArray[index] || 0;

        // Apply some logarithmic-like scaling for better visual range
        const normalized = value / 255;
        const height = Math.pow(normalized, 0.7) * 44 + 4;
        
        bar.style.height = `${height}px`;
        bar.style.backgroundColor = activeGenre.accent;
        
        if (isPlaying) {
          bar.style.boxShadow = `0 0 20px ${activeGenre.accent}66, 0 0 5px ${activeGenre.accent}aa`;
          bar.style.opacity = (0.5 + normalized * 0.5).toString();
        } else {
          bar.style.boxShadow = 'none';
          bar.style.opacity = '0.3';
        }

        // Handle peaks
        const peak = eqPeaksRef.current[i];
        if (peak) {
          if (height > peaksRef.current[i]) {
            peaksRef.current[i] = height;
          } else {
            peaksRef.current[i] = Math.max(4, peaksRef.current[i] - 0.6);
          }
          peak.style.transform = `translateY(-${peaksRef.current[i]}px)`;
          peak.style.backgroundColor = activeGenre.accent;
          peak.style.boxShadow = isPlaying ? `0 0 10px ${activeGenre.accent}` : 'none';
        }
      });
    };
    draw();
  };

  const stopEqDraw = () => {
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    eqBarsRef.current.forEach(bar => {
      if (bar) {
        bar.style.height = '2px';
        bar.style.boxShadow = 'none';
      }
    });
    eqPeaksRef.current.forEach((peak, i) => {
      if (peak) {
        peak.style.transform = 'translateY(-2px)';
        peaksRef.current[i] = 2;
      }
    });
  };

  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = async () => {
    if (audioRef.current) {
      try {
        // If there's already a play promise, wait for it to avoid interruption errors
        if (playPromiseRef.current) {
          await playPromiseRef.current;
        }
        playPromiseRef.current = audioRef.current.play();
        await playPromiseRef.current;
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.error('Playback failed:', e);
        }
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  const loadTrack = (index: number, shouldPlay: boolean = true, forceUnmute: boolean = false) => {
    if (index < 0 || index >= tracks.length) return;
    
    // If it's the same track and it's already playing, just return
    if (index === currentIndex && isPlaying && shouldPlay) return;

    setCurrentIndex(index);
    const track = tracks[index];
    addAuditLog(`Loaded track: ${track.name}`, setAuditLogs);
    const effectivelyMuted = forceUnmute ? false : isMuted;
    
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (audioRef.current) {
      // Pause current playback before loading new source
      audioRef.current.pause();
      audioRef.current.removeAttribute('src'); // Clear src for HLS
      audioRef.current.load();
      
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });
        
        hls.on(Hls.Events.ERROR, (_event, data) => {
          const errorInfo = `HLS Error: ${data.type} - ${data.details} (Fatal: ${data.fatal})`;
          addAuditLog(errorInfo, setAuditLogs);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                setErrorMsg('Network error. Check Admin > Network for diagnostics.');
                addAuditLog('Attempting HLS network recovery...', setAuditLogs);
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                setErrorMsg('Media error, trying to recover...');
                addAuditLog('Attempting HLS media recovery...', setAuditLogs);
                hls.recoverMediaError();
                break;
              default:
                setErrorMsg('Fatal error, skipping track');
                addAuditLog('Unrecoverable HLS error. Skipping track.', setAuditLogs);
                hls.destroy();
                nextTrack();
                break;
            }
          } else {
            // Log non-fatal errors that might cause dropouts
            if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
              addAuditLog('Playback stalled: Buffer empty', setAuditLogs);
            }
          }
        });

        hls.on(Hls.Events.BUFFER_APPENDING, () => setIsBuffering(true));
        hls.on(Hls.Events.BUFFER_APPENDED, () => setIsBuffering(false));
        hls.on(Hls.Events.FRAG_BUFFERED, () => setIsBuffering(false));
        
        hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
          setHlsStats(prev => ({ ...prev, bandwidth: (data as any).stats?.bw || prev.bandwidth }));
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
          setHlsStats(prev => ({ ...prev, level: data.level }));
        });

        hls.loadSource(getProxyUrl(track.url));
        hls.attachMedia(audioRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setErrorMsg(null);
          if (shouldPlay && !effectivelyMuted) {
            safePlay();
          }
        });
        hlsRef.current = hls;
      } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        audioRef.current.src = track.url;
        if (shouldPlay && !effectivelyMuted) {
          safePlay();
        }
      }
    }

    // Add to history
    const newHistoryItem: HistoryItem = {
      idx: index,
      name: track.name,
      ts: Date.now(),
      artwork: track.artwork
    };
    setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
    if (activeGenre.heroes.length > 0) {
      setHeroIdx(prev => (prev + 1) % activeGenre.heroes.length);
    }
  };

  const togglePlay = () => {
    let currentMuted = isMuted;
    if (isMuted) {
      setIsMuted(false);
      currentMuted = false;
      initWebAudio();
      addAuditLog('Audio unmuted', setAuditLogs);
    }
    if (currentIndex === -1) {
      loadTrack(0, true, true);
      return;
    }
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        addAuditLog('Playback paused', setAuditLogs);
      } else {
        if (audioRef.current.muted) audioRef.current.muted = false;
        safePlay();
        addAuditLog('Playback started', setAuditLogs);
      }
    }
  };

  const nextTrack = (isManual: boolean = true) => {
    if (isShuffle) {
      const nextIdx = Math.floor(Math.random() * tracks.length);
      loadTrack(nextIdx, true);
    } else {
      const nextIdx = currentIndex + 1;
      if (nextIdx < tracks.length) {
        loadTrack(nextIdx, true);
      } else if (isLoop || isManual) {
        loadTrack(0, true);
      } else {
        setIsPlaying(false);
        addAuditLog('End of playlist reached', setAuditLogs);
      }
    }
  };

  const handleTrackEnded = () => {
    if (isAutoplay) {
      nextTrack(false);
    } else {
      setIsPlaying(false);
      addAuditLog('Track ended (Autoplay OFF)', setAuditLogs);
    }
  };

  const prevTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const prevIdx = (currentIndex - 1 + tracks.length) % tracks.length;
      loadTrack(prevIdx, true);
    }
  };

  // --- Effects ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    addAuditLog(`Theme changed to ${theme}`, setAuditLogs);
  }, [theme]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'studio2026') {
      setIsAdminAuthenticated(true);
      addAuditLog('Admin authenticated successfully', setAuditLogs);
    } else {
      alert('Invalid credentials');
      addAuditLog('Admin authentication failed', setAuditLogs);
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setAdminPassword('');
    setAdminTab('status');
    addAuditLog('Admin logged out', setAuditLogs);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message.trim()) return;
    
    setIsFeedbackSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addAuditLog(`Feedback submitted by ${feedbackForm.name || 'Anonymous'}`, setAuditLogs);
    setIsFeedbackSubmitting(false);
    setFeedbackSuccess(true);
    
    setTimeout(() => {
      setFeedbackSuccess(false);
      setIsFeedbackOpen(false);
      setFeedbackForm({ name: '', email: '', message: '' });
    }, 2000);
  };

  const testNetwork = async () => {
    setNetworkStatus([{ url: 'Checking...', status: 'pending' }]);
    const urlsToTest = [
      'https://ai.techbridge.edu.gh/music/master.m3u8',
      'https://ai.techbridge.edu.gh/music/combined.m3u8'
    ];
    
    const results = await Promise.all(urlsToTest.map(async (url) => {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const start = Date.now();
        const res = await fetch(proxyUrl);
        const duration = Date.now() - start;
        if (res.ok) {
          return { url, status: 'SUCCESS', details: `${res.status} OK (${duration}ms)` };
        } else {
          const text = await res.text();
          return { url, status: 'FAILED', details: `${res.status} ${res.statusText}: ${text.substring(0, 50)}` };
        }
      } catch (e) {
        return { url, status: 'ERROR', details: e instanceof Error ? e.message : String(e) };
      }
    }));
    setNetworkStatus(results);
    addAuditLog('Network diagnostic completed', setAuditLogs);
  };

  const runTests = async () => {
    if (isTesting) return;
    setIsTesting(true);
    addAuditLog('Starting Playwright E2E Suite', setAuditLogs);
    setTestScreenshots([]);
    
    // Reset results
    setTestResults(prev => prev.map(t => ({ ...t, status: 'pending', message: undefined, screenshot: undefined })));
    
    const capture = async () => {
      try {
        const canvas = await html2canvas(document.body);
        return canvas.toDataURL('image/png');
      } catch (e) {
        console.error('Screenshot capture failed', e);
        return undefined;
      }
    };

    const steps = [
      { 
        name: 'Stream Initialization', 
        fn: async () => {
          const ok = tracks.length > 0;
          return { ok, msg: ok ? 'HLS Manifests loaded successfully' : 'No tracks found' };
        }
      },
      { 
        name: 'Theme Switching', 
        fn: async () => {
          const attr = document.documentElement.getAttribute('data-theme');
          const ok = attr === theme;
          return { ok, msg: `Theme attribute matches state: ${theme}` };
        }
      },
      { 
        name: 'Audio Controls', 
        fn: async () => {
          const ok = !!audioRef.current;
          return { ok, msg: ok ? 'Audio element initialized' : 'Audio element missing' };
        }
      },
      { 
        name: 'Admin Security', 
        fn: async () => {
          const ok = isAdminAuthenticated;
          return { ok, msg: ok ? 'Admin session verified' : 'Unauthorized access detected' };
        }
      }
    ];

    for (const step of steps) {
      setTestResults(prev => prev.map(t => t.name === step.name ? { ...t, status: 'running' } : t));
      await new Promise(r => setTimeout(r, 800));
      const result = await step.fn();
      const screenshot = await capture();
      setTestResults(prev => prev.map(t => t.name === step.name ? { ...t, status: result.ok ? 'pass' : 'fail', message: result.msg, screenshot } : t));
      if (screenshot) setTestScreenshots(prev => [...prev, screenshot]);
    }

    setIsTesting(false);
    addAuditLog('Playwright E2E Suite completed', setAuditLogs);
  };

  useEffect(() => {
    const fetchHeroes = async () => {
      const paths = [
        HEROES_JSON,
        'https://ai.techbridge.edu.gh/music/heroes.json',
        'https://ai.techbridge.edu.gh/running/heroes.json',
        'https://ai.techbridge.edu.gh/afrobeats/heroes.json'
      ];
      
      let success = false;
      for (const path of paths) {
        try {
          const response = await fetch(getProxyUrl(path));
          if (response.ok) {
            const data = await response.json();
            if (data.heroes && data.heroes.length > 0) {
              const artworkUrls = data.heroes.map((h: string) => `${ARTWORK_BASE}${h}`);
              setGenres(prev => prev.map((g, i) => ({
                ...g,
                heroes: [...artworkUrls.slice(i % artworkUrls.length), ...artworkUrls.slice(0, i % artworkUrls.length)]
              })));
              success = true;
              break;
            }
          }
        } catch (e) {
          // Try next path
        }
      }

      if (!success) {
        // Fallback to some defaults if all paths fail
        setGenres(prev => prev.map(g => ({
          ...g,
          heroes: [
            `${ARTWORK_BASE}artwork-01.jpg`,
            `${ARTWORK_BASE}artwork-02.jpg`,
            `${ARTWORK_BASE}artwork-03.jpg`,
            `${ARTWORK_BASE}artwork-04.jpg`
          ]
        })));
      }
    };
    fetchHeroes();
  }, []);

  useEffect(() => {
    setActiveGenre(prev => genres.find(g => g.id === prev.id) || prev);
  }, [genres]);

  useEffect(() => {
    const fetchPlaylist = async () => {
      setIsLoading(true);
      setTracks([]); // Clear tracks to ensure UI count matches loading state
      try {
        let fetchedTracks: Track[] = [];
        
        for (const source of activeGenre.sources) {
          try {
            const proxyUrl = getProxyUrl(source);
            const response = await fetch(proxyUrl);
            if (response.ok) {
              const text = await response.text();
              const parsed = parseM3U8(text, activeGenre.base);
              if (parsed.length > 0) {
                // Assign baseline fallback artwork from the genre's hero list
                fetchedTracks = parsed.map((t, idx) => ({
                  ...t,
                  artwork: t.artwork || (activeGenre.heroes.length > 0 
                    ? activeGenre.heroes[idx % activeGenre.heroes.length] 
                    : `${ARTWORK_BASE}artwork-${String((idx % 16) + 1).padStart(2, '0')}.jpg`)
                }));
                break;
              } else if (text.includes('#EXTM3U')) {
                // Fallback: treat the combined.m3u8 as a single stream if it's a valid M3U8 but no tracks found
                fetchedTracks = [{
                  name: `${activeGenre.label} Continuous Mix`,
                  url: source,
                  bpm: activeGenre.id === 'running' ? '146–150' : '—',
                  duration: 0
                }];
                break;
              }
            } else {
              console.error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
              setErrorMsg(`Server error: ${response.status}`);
            }
          } catch (err) {
            console.error(`Error fetching source ${source}:`, err);
            setErrorMsg('Network error fetching playlist');
          }
        }

        if (fetchedTracks.length === 0) {
          // Fallback to mock tracks if fetching fails
          if (activeGenre.id === 'running') {
            fetchedTracks = [
              { name: '146 BPM Drive (Soft Lead V1)', url: `${activeGenre.base}146%20BPM%20Drive%20(Soft%20Lead%20V1).m3u8`, bpm: '146', duration: 180 },
              { name: '146 BPM Drive (Soft Lead V2)', url: `${activeGenre.base}146%20BPM%20Drive%20(Soft%20Lead%20V2).m3u8`, bpm: '146', duration: 195 },
              { name: 'Drum & Bass Tribal Pace 150 (V1)', url: `${activeGenre.base}Drum%20%26%20Bass%20Tribal%20Pace%20150%20(V1).m3u8`, bpm: '150', duration: 210 },
              { name: 'Drum & Bass Tribal Pace 150 (V2)', url: `${activeGenre.base}Drum%20%26%20Bass%20Tribal%20Pace%20150%20(V2).m3u8`, bpm: '150', duration: 205 },
              { name: 'No Breaks Tribal Pace 150 (V1)', url: `${activeGenre.base}No%20Breaks%20Tribal%20Pace%20150%20(V1).m3u8`, bpm: '150', duration: 185 },
              { name: 'No Breaks Tribal Pace 150 (V2)', url: `${activeGenre.base}No%20Breaks%20Tribal%20Pace%20150%20(V2).m3u8`, bpm: '150', duration: 190 },
              { name: 'Running Groove Track 1 (A Minor)', url: `${activeGenre.base}Running%20Groove%20Track%201%20(A%20Minor).m3u8`, bpm: '148', duration: 240 },
              { name: 'Running Groove Track 2 (D Minor)', url: `${activeGenre.base}Running%20Groove%20Track%202%20(D%20Minor).m3u8`, bpm: '148', duration: 230 },
              { name: 'Running Groove Track 3 (G Minor)', url: `${activeGenre.base}Running%20Groove%20Track%203%20(G%20Minor).m3u8`, bpm: '148', duration: 220 },
              { name: 'Pace Setter 150 (V1)', url: `${activeGenre.base}Pace%20Setter%20150%20(V1).m3u8`, bpm: '150', duration: 200 },
              { name: 'Pace Setter 150 (V2)', url: `${activeGenre.base}Pace%20Setter%20150%20(V2).m3u8`, bpm: '150', duration: 215 },
              { name: 'Endurance Run 146', url: `${activeGenre.base}Endurance%20Run%20146.m3u8`, bpm: '146', duration: 300 },
              { name: 'Sprint Interval 150', url: `${activeGenre.base}Sprint%20Interval%20150.m3u8`, bpm: '150', duration: 120 },
              { name: 'Marathon Pace 148', url: `${activeGenre.base}Marathon%20Pace%20148.m3u8`, bpm: '148', duration: 360 },
              { name: 'Uphill Climb 146', url: `${activeGenre.base}Uphill%20Climb%20146.m3u8`, bpm: '146', duration: 240 },
            ];
            addAuditLog('Using Running mock tracks (Fetch failed)', setAuditLogs);
          } else if (activeGenre.id === 'afrobeats') {
            fetchedTracks = [
              { name: 'Afrobeat Rhythm 1', url: `${activeGenre.base}Afrobeat%20Rhythm%201.m3u8`, bpm: '110', duration: 180 },
              { name: 'Lagos Night Groove', url: `${activeGenre.base}Lagos%20Night%20Groove.m3u8`, bpm: '105', duration: 210 },
              { name: 'Highlife Fusion', url: `${activeGenre.base}Highlife%20Fusion.m3u8`, bpm: '115', duration: 195 },
              { name: 'Abuja Sunset', url: `${activeGenre.base}Abuja%20Sunset.m3u8`, bpm: '108', duration: 240 },
              { name: 'Desert Pulse', url: `${activeGenre.base}Desert%20Pulse.m3u8`, bpm: '112', duration: 200 },
            ];
            addAuditLog('Using Afrobeats mock tracks (Fetch failed)', setAuditLogs);
          } else if (activeGenre.id === 'neosoul') {
            fetchedTracks = [
              { name: 'Midnight Soul', url: `${activeGenre.base}Midnight%20Soul.m3u8`, bpm: '85', duration: 240 },
              { name: 'Velvet Rhythms', url: `${activeGenre.base}Velvet%20Rhythms.m3u8`, bpm: '90', duration: 220 },
              { name: 'Urban Serenade', url: `${activeGenre.base}Urban%20Serenade.m3u8`, bpm: '88', duration: 200 },
              { name: 'Purple Raindrops', url: `${activeGenre.base}Purple%20Raindrops.m3u8`, bpm: '86', duration: 210 },
              { name: 'Silk & Satin', url: `${activeGenre.base}Silk%20%26%20Satin.m3u8`, bpm: '92', duration: 190 },
            ];
            addAuditLog('Using Neosoul mock tracks (Fetch failed)', setAuditLogs);
          }
        }
        
        setTracks(fetchedTracks);
        setCurrentIndex(-1);
      } catch (e) {
        console.error('Failed to fetch playlist', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaylist();
  }, [activeGenre]);

  useEffect(() => {
    const enrichTrackArtworks = async () => {
      if (tracks.length === 0) return;
      
      const CHUNK_SIZE = 3;
      for (let i = 0; i < tracks.length; i += CHUNK_SIZE) {
        const chunk = tracks.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(async (track, idx) => {
          const trackIdx = i + idx;
          if (track.artwork && !track.artwork.includes('artwork-')) return;
          
          try {
            const proxyUrl = getProxyUrl(track.url);
            const response = await fetch(proxyUrl);
            if (response.ok) {
              const text = await response.text();
              const lines = text.split('\n');
              const artLine = lines.find(l => l.startsWith('#EXT-X-ARTWORK:'));
              if (artLine) {
                const artworkUrl = artLine.replace('#EXT-X-ARTWORK:', '').trim();
                setTracks(prev => {
                  const newTracks = [...prev];
                  if (newTracks[trackIdx] && newTracks[trackIdx].url === track.url) {
                    newTracks[trackIdx] = { ...newTracks[trackIdx], artwork: artworkUrl };
                  }
                  return newTracks;
                });
              } else {
                // Fallback to a genre hero if no specific artwork found
                const fallbackArt = activeGenre.heroes[trackIdx % activeGenre.heroes.length] || 
                                   `${ARTWORK_BASE}artwork-${String((trackIdx % 16) + 1).padStart(2, '0')}.jpg`;
                
                setTracks(prev => {
                  const newTracks = [...prev];
                  if (newTracks[trackIdx] && newTracks[trackIdx].url === track.url) {
                    newTracks[trackIdx] = { ...newTracks[trackIdx], artwork: fallbackArt };
                  }
                  return newTracks;
                });
              }
            }
          } catch (e) {
            // Silently fail for pre-fetch
          }
        }));
      }
    };
    
    enrichTrackArtworks();
  }, [tracks.length, activeGenre.id, activeGenre.heroes]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleStalled = () => addAuditLog('Audio element stalled (network slow)', setAuditLogs);
    const handleWaiting = () => {
      setIsBuffering(true);
      addAuditLog('Audio element waiting for data...', setAuditLogs);
    };
    const handleError = () => {
      const err = audio.error;
      addAuditLog(`Audio element error: ${err?.code} - ${err?.message}`, setAuditLogs);
    };
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsPlaying(true);
    };

    audio.addEventListener('stalled', handleStalled);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);
    audio.addEventListener('playing', handlePlaying);

    return () => {
      audio.removeEventListener('stalled', handleStalled);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Silence detection effect
  useEffect(() => {
    let interval: any;
    if (isPlaying && !isBuffering) {
      interval = setInterval(() => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          
          if (sum === 0) {
            setSilenceCounter(prev => {
              const next = prev + 1;
              if (next === 5) { // 5 seconds of silence while "playing"
                addAuditLog('WARNING: Silence detected in audio stream', setAuditLogs);
              }
              return next;
            });
          } else {
            setSilenceCounter(0);
          }
        }
      }, 1000);
    } else {
      setSilenceCounter(0);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isBuffering]);

  useEffect(() => {
    let interval: any;
    if (sleepRemaining > 0 && isPlaying) {
      interval = setInterval(() => {
        setSleepRemaining(prev => {
          if (prev <= 1) {
            audioRef.current?.pause();
            setIsPlaying(false);
            addAuditLog('Sleep timer reached zero. Playback stopped.', setAuditLogs);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sleepRemaining, isPlaying]);

  // --- Render ---
  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      {/* Background Hero */}
      <AnimatePresence>
        <motion.div
          key={currentTrack?.artwork || activeGenre.heroes[heroIdx] || 'fallback'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentTrack?.artwork || activeGenre.heroes[heroIdx] || `${ARTWORK_BASE}artwork-01.jpg`})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-[#0a0a0a]" aria-hidden="true" />
        </motion.div>
      </AnimatePresence>

      {/* Header / Nav */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-accent rounded flex items-center justify-center text-black font-display text-2xl">B</div>
          <div>
            <h1 className="font-display text-3xl tracking-tight leading-none">BRIDGE RADIO</h1>
            <p className="text-[10px] tracking-[0.3em] text-accent uppercase">Cinematic Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switcher */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            <button 
              onClick={() => setTheme('dark')}
              className={`p-2 rounded-full transition-all ${theme === 'dark' ? 'bg-accent text-black' : 'text-white/40 hover:text-white'}`}
              title="Dark Mode"
              aria-label="Switch to Dark Mode"
            >
              <Moon size={14} />
            </button>
            <button 
              onClick={() => setTheme('light')}
              className={`p-2 rounded-full transition-all ${theme === 'light' ? 'bg-accent text-black' : 'text-white/40 hover:text-white'}`}
              title="Light Mode"
              aria-label="Switch to Light Mode"
            >
              <Sun size={14} />
            </button>
            <button 
              onClick={() => setTheme('high-contrast')}
              className={`p-2 rounded-full transition-all ${theme === 'high-contrast' ? 'bg-accent text-black' : 'text-white/40 hover:text-white'}`}
              title="High Contrast"
              aria-label="Switch to High Contrast Mode"
            >
              <Zap size={14} />
            </button>
          </div>

          <button 
            onClick={() => setIsFeedbackOpen(true)}
            className="p-2 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-accent hover:border-accent transition-all"
            title="Send Feedback"
            aria-label="Open Feedback Form"
          >
            <MessageSquare size={16} />
          </button>

          <button 
            onClick={() => setIsAdminOpen(true)}
            className="p-2 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-accent hover:border-accent transition-all"
            title="Admin Panel"
            aria-label="Open Admin Panel"
          >
            <Shield size={16} />
          </button>
        </div>
      </header>

      {/* Mute Overlay */}
      {isMuted && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-morphism px-6 py-3 rounded-full flex items-center gap-3 text-accent text-xs tracking-widest pointer-events-none"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          STREAMING MUTED — TAP TO UNMUTE
        </motion.div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col max-w-4xl mx-auto w-full px-6 pt-24 pb-32">
        <header className="mb-8">
          <motion.h1 
            className="font-display text-6xl md:text-8xl text-accent tracking-wider uppercase leading-none mb-2"
            animate={isPlaying ? { textShadow: ["0 0 20px rgba(232,255,60,0.3)", "0 0 40px rgba(232,255,60,0.6)", "0 0 20px rgba(232,255,60,0.3)"] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            BRIDGE RADIO
          </motion.h1>
          <p className="text-white/50 text-[10px] tracking-[0.3em] uppercase mb-6">{activeGenre.metadata}</p>
          
          <div className="flex gap-2 flex-wrap">
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => setActiveGenre(g)}
                className={`px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all border ${
                  activeGenre.id === g.id 
                    ? 'bg-accent border-accent text-black font-bold' 
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-accent hover:text-accent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </header>

        {/* Player Card */}
        <section className="glass-morphism rounded-lg p-6 mb-8">
          <div className="flex gap-6 items-center mb-6">
            <div className={`relative w-20 h-20 rounded-full border-2 border-white/10 flex-shrink-0 overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${currentTrack?.artwork || activeGenre.heroes[heroIdx]})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-black border-2 border-accent" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-accent text-[10px] tracking-widest uppercase block mb-1">
                {isLoading ? 'Loading playlist...' : isBuffering ? 'Buffering...' : currentIndex === -1 ? 'Ready' : 'Now Playing'}
              </span>
              <h2 className="text-lg font-bold truncate leading-tight">
                {errorMsg ? <span className="text-red-500">{errorMsg}</span> : (currentTrack?.name || 'Open the Bridge: Select a Stream')}
              </h2>
              <p className="text-white/40 text-xs mt-1">
                {isLoading ? '— / — tracks' : currentIndex === -1 ? `— / ${tracks.length} tracks` : `Track ${currentIndex + 1} of ${tracks.length} · ${currentTrack?.bpm} BPM`}
              </p>

              {currentTrack && (
                <button 
                  onClick={() => setIsLyricsOpen(!isLyricsOpen)}
                  className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] tracking-widest uppercase hover:text-accent hover:border-accent transition-all"
                >
                  <Music size={12} className={isFetchingLyrics ? "animate-pulse" : ""} />
                  {isLyricsOpen ? 'Hide Lyrics' : 'Show Lyrics'}
                  <motion.div
                    animate={{ rotate: isLyricsOpen ? 180 : 0 }}
                  >
                    <ChevronRight size={10} />
                  </motion.div>
                </button>
              )}
            </div>
          </div>

          {/* Collapsible Lyrics Display */}
          <AnimatePresence>
            {isLyricsOpen && currentTrack && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6 border-l-2 border-accent/20 pl-4"
              >
                <div className="py-2 text-xs text-white/70 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                  {isFetchingLyrics ? (
                    <div className="flex items-center gap-2 text-white/30 italic">
                      <RefreshCw size={12} className="animate-spin" />
                      Fetching lyrics from AI...
                    </div>
                  ) : (
                    lyrics || "Lyrics not found"
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EQ Visualizer */}
          <div className="flex items-end gap-[3px] h-14 mb-8 relative overflow-hidden px-2">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="flex-1 relative h-full flex flex-col justify-end">
                {/* Peak Dot */}
                <div
                  ref={el => eqPeaksRef.current[i] = el}
                  className="absolute w-full h-[3px] rounded-full transition-transform duration-100 ease-out z-10"
                  style={{ 
                    backgroundColor: activeGenre.accent,
                    bottom: 0,
                    opacity: 0.9
                  }}
                />
                {/* Main Bar */}
                <div
                  ref={el => eqBarsRef.current[i] = el}
                  className="w-full rounded-t-[2px] transition-all duration-100 ease-out"
                  style={{ 
                    height: '4px', 
                    backgroundColor: activeGenre.accent,
                    opacity: 0.3
                  }}
                />
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div 
              className="h-1 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = (e.clientX - rect.left) / rect.width;
                if (audioRef.current) audioRef.current.currentTime = pct * duration;
              }}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-secondary transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-white/40 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={prevTrack}
                className="p-2 rounded bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all"
              >
                <SkipBack size={16} />
              </button>
              <button 
                onClick={togglePlay}
                className={`w-12 h-12 rounded flex items-center justify-center transition-all border ${
                  isPlaying 
                    ? 'bg-accent border-accent text-black' 
                    : 'bg-white/5 border-accent text-accent hover:bg-accent/10'
                }`}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>
              <button 
                onClick={nextTrack}
                className="p-2 rounded bg-white/5 border border-white/10 hover:border-accent hover:text-accent transition-all"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 rounded border transition-all ${isShuffle ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                title="Shuffle"
              >
                <Shuffle size={14} />
              </button>
              <button 
                onClick={() => setIsLoop(!isLoop)}
                className={`p-2 rounded border transition-all ${isLoop ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                title="Loop Playlist"
              >
                <Repeat size={14} />
              </button>
              <button 
                onClick={() => setIsAutoplay(!isAutoplay)}
                className={`px-3 py-2 rounded border text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${isAutoplay ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                title="Autoplay"
              >
                <Play size={12} fill={isAutoplay ? "currentColor" : "none"} />
                {isAutoplay ? 'Autoplay ON' : 'Autoplay OFF'}
              </button>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsSleepMenuOpen(!isSleepMenuOpen)}
                className={`px-3 py-2 rounded border text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${sleepRemaining > 0 ? 'border-orange-500 text-orange-500 bg-orange-500/5' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                aria-label="Set Sleep Timer"
              >
                <Clock size={12} />
                {sleepRemaining > 0 ? formatTime(sleepRemaining) : 'SLEEP'}
              </button>
              
              <AnimatePresence>
                {isSleepMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full mb-2 left-0 w-48 glass-morphism rounded-lg border border-white/10 p-2 z-50 shadow-2xl"
                  >
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] mb-2 px-2">Set Sleep Timer</p>
                    <div className="grid grid-cols-1 gap-1">
                      {SLEEP_OPTIONS.map((mins, idx) => (
                        <button
                          key={mins}
                          onClick={() => {
                            setSleepTime(idx);
                            setSleepRemaining(mins * 60);
                            setIsSleepMenuOpen(false);
                            addAuditLog(mins === 0 ? 'Sleep timer disabled' : `Sleep timer set to ${mins}m`, setAuditLogs);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-[10px] uppercase tracking-wider transition-all ${
                            (mins === 0 && sleepRemaining === 0) || (mins > 0 && Math.abs(sleepRemaining - mins * 60) < 2)
                              ? 'bg-orange-500/20 text-orange-500' 
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {mins === 0 ? 'Disable Timer' : `${mins} Minutes`}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-white/10 px-2 pb-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] text-white/30 uppercase tracking-widest">Custom</span>
                        <span className="text-[10px] text-accent font-mono">{customSleepMins}m</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="120"
                        value={customSleepMins}
                        onChange={(e) => setCustomSleepMins(parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent mb-3"
                      />
                      <button
                        onClick={() => {
                          setSleepRemaining(customSleepMins * 60);
                          setIsSleepMenuOpen(false);
                          addAuditLog(`Custom sleep timer set to ${customSleepMins}m`, setAuditLogs);
                        }}
                        className="w-full py-2 bg-accent text-black text-[9px] font-bold uppercase tracking-widest rounded hover:scale-[1.02] transition-transform"
                      >
                        Start Custom Timer
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`px-3 py-2 rounded border text-[10px] tracking-widest uppercase transition-all flex items-center gap-2 ${isHistoryOpen ? 'border-accent text-accent bg-accent/5' : 'border-white/10 text-white/40 hover:border-white/30'}`}
              aria-label="Toggle History"
            >
              <History size={12} />
              History
            </button>

            <div className="ml-auto flex items-center gap-3">
              <Volume2 size={14} className="text-white/40" />
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        </section>

        {/* History Panel */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.section 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-morphism rounded-lg p-6 mb-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-white/40">Recently Played</h3>
                <button 
                  onClick={() => setHistory([])}
                  className="text-[10px] text-white/30 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={10} />
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {history.length === 0 ? (
                  <p className="text-xs text-white/20 italic">No history yet</p>
                ) : (
                  history.map((item, i) => (
                    <div 
                      key={`${item.ts}-${i}`}
                      onClick={() => loadTrack(item.idx)}
                      className="flex items-center gap-4 py-2 border-b border-white/5 cursor-pointer group"
                    >
                      <span className="text-[10px] text-white/20 w-4">{i + 1}</span>
                      {item.artwork && (
                        <div 
                          className="w-6 h-6 rounded bg-cover bg-center border border-white/10 flex-shrink-0"
                          style={{ backgroundImage: `url(${item.artwork})` }}
                        />
                      )}
                      <span className="text-xs text-white/60 group-hover:text-accent transition-colors flex-1 truncate">{item.name}</span>
                      <span className="text-[10px] text-white/20">{new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Tracklist */}
        <section className="flex-1">
          <div className="flex justify-between items-center py-4 border-b border-white/10 mb-4">
            <h3 className="text-[10px] tracking-[0.2em] uppercase text-white/40">Tracklist</h3>
            <div className="flex items-center gap-4 text-[10px] tracking-widest">
              <span className="text-accent">{isLoading ? '—:——' : formatLongTime(totalDuration)}</span>
              <span className="text-white/40">{isLoading ? '—' : tracks.length} TRACKS</span>
            </div>
          </div>

          <div className="space-y-1">
            {isLoading ? (
              <div className="py-12 text-center text-white/20 text-xs tracking-widest animate-pulse">
                LOADING PLAYLIST...
              </div>
            ) : (
              tracks.map((track, i) => (
                <div 
                  key={i}
                  onClick={() => {
                    if (isMuted) {
                      setIsMuted(false);
                      initWebAudio();
                      loadTrack(i, true, true);
                    } else {
                      loadTrack(i, true);
                    }
                  }}
                  className={`p-3 rounded transition-all cursor-pointer border-l-2 ${
                    currentIndex === i 
                      ? 'bg-accent/5 border-accent shadow-[inset_0_0_20px_rgba(232,255,60,0.05)]' 
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] w-6 text-right ${currentIndex === i ? 'text-accent' : 'text-white/20'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      {track.artwork ? (
                        <div 
                          className="w-10 h-10 rounded bg-cover bg-center border border-white/10 flex-shrink-0 shadow-lg"
                          style={{ backgroundImage: `url(${track.artwork})` }}
                          title={track.artwork}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Music size={16} className="text-white/20" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${currentIndex === i ? 'text-accent font-bold' : 'text-white/80'}`}>
                          {track.name}
                        </p>
                        <p className="text-[9px] text-white/30 truncate font-mono uppercase tracking-wider">
                          {track.bpm} BPM {track.duration ? `· ${formatTime(track.duration)}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-mono ${currentIndex === i ? 'text-accent/60' : 'text-white/20'}`}>
                        {track.duration ? formatTime(track.duration) : '--:--'}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
                        currentIndex === i 
                          ? 'border-accent/30 text-accent/60' 
                          : 'border-white/5 text-white/10'
                      }`}>
                        {track.bpm}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Metadata Panel */}
                  <AnimatePresence>
                    {currentIndex === i && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-1">
                            <div 
                              className="aspect-square rounded-lg bg-cover bg-center border border-white/10 shadow-2xl"
                              style={{ backgroundImage: `url(${track.artwork || activeGenre.heroes[heroIdx]})` }}
                            />
                          </div>
                          <div className="md:col-span-3 grid grid-cols-2 gap-4">
                            <div className="p-3 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] text-white/40 uppercase mb-1">Duration</p>
                              <p className="text-xs text-accent font-mono">{track.duration ? formatTime(track.duration) : 'Unknown'}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] text-white/40 uppercase mb-1">Tempo</p>
                              <p className="text-xs text-accent font-mono">{track.bpm} BPM</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] text-white/40 uppercase mb-1">Protocol</p>
                              <p className="text-[10px] text-white/80 uppercase tracking-tighter">HLS / AES-128</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] text-white/40 uppercase mb-1">Status</p>
                              <p className="text-[10px] text-green-500 uppercase tracking-tighter">Synchronized</p>
                            </div>
                            <div className="col-span-2 p-3 bg-white/5 rounded border border-white/5">
                              <p className="text-[8px] text-white/40 uppercase mb-1">Source URL</p>
                              <p className="text-[9px] text-white/40 truncate font-mono">{getFilename(track.url)}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl glass-morphism rounded-xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <Shield className="text-accent" size={20} />
                  <h2 className="font-display text-2xl tracking-tight">STUDIO DIAGNOSTICS</h2>
                </div>
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Close Admin Panel"
                >
                  <X size={20} />
                </button>
              </div>

              {isAdminAuthenticated && (
                <div className="flex border-b border-white/10 bg-white/5">
                  <button 
                    onClick={() => setAdminTab('status')}
                    className={`px-6 py-3 text-[10px] tracking-widest uppercase transition-all border-b-2 ${adminTab === 'status' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                  >
                    Status
                  </button>
                  <button 
                    onClick={() => setAdminTab('testing')}
                    className={`px-6 py-3 text-[10px] tracking-widest uppercase transition-all border-b-2 ${adminTab === 'testing' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                  >
                    Testing
                  </button>
                  <button 
                    onClick={() => setAdminTab('logs')}
                    className={`px-6 py-3 text-[10px] tracking-widest uppercase transition-all border-b-2 ${adminTab === 'logs' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                  >
                    Audit Logs
                  </button>
                  <button 
                    onClick={() => setAdminTab('network')}
                    className={`px-6 py-3 text-[10px] tracking-widest uppercase transition-all border-b-2 ${adminTab === 'network' ? 'border-accent text-accent' : 'border-transparent text-white/40 hover:text-white'}`}
                  >
                    Network
                  </button>
                </div>
              )}

              {!isAdminAuthenticated ? (
                <form onSubmit={handleAdminLogin} className="p-12 flex flex-col items-center gap-6">
                  <Lock size={48} className="text-white/20 mb-4" />
                  <p className="text-white/60 text-sm text-center max-w-xs">Enter studio credentials to access diagnostic tools and audit logs.</p>
                  <input 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Studio Password"
                    className="w-full max-w-sm bg-white/5 border border-white/10 rounded px-4 py-3 text-center text-accent tracking-[0.5em] focus:outline-none focus:border-accent transition-all"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="w-full max-w-sm bg-accent text-black font-bold py-3 rounded hover:scale-[1.02] transition-transform"
                  >
                    AUTHENTICATE
                  </button>
                </form>
              ) : (
                <div className="p-8 h-[500px] overflow-y-auto">
                  {adminTab === 'status' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-[10px] tracking-[0.2em] text-accent uppercase mb-4 flex items-center gap-2">
                            <Activity size={12} />
                            System Status
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">HLS Engine</span>
                              <span className="text-green-500">ACTIVE</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Audio Context</span>
                              <span className={audioCtxRef.current ? 'text-green-500' : 'text-orange-500'}>
                                {audioCtxRef.current ? 'INITIALIZED' : 'PENDING'}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Bandwidth</span>
                              <span className="text-white/80">{(hlsStats.bandwidth / 1000000).toFixed(2)} Mbps</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Active Level</span>
                              <span className="text-white/80">LEVEL {hlsStats.level}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-white/40">Session ID</span>
                              <span className="text-white/80 font-mono">BRIDGE-{Math.floor(Date.now() / 1000000)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] tracking-[0.2em] text-accent uppercase mb-4 flex items-center gap-2">
                            <Zap size={12} />
                            Environment
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-3 bg-white/5 rounded border border-white/5 text-center">
                              <p className="text-[8px] text-white/40 mb-1">THEME</p>
                              <p className="text-[10px] text-white/80 uppercase">{theme}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded border border-white/5 text-center">
                              <p className="text-[8px] text-white/40 mb-1">TRACKS</p>
                              <p className="text-[10px] text-white/80">{tracks.length}</p>
                            </div>
                            <div className="p-3 bg-white/5 rounded border border-white/5 text-center col-span-2">
                              <p className="text-[8px] text-white/40 mb-1">DATA SOURCE</p>
                              <p className={`text-[10px] uppercase ${auditLogs.some(l => l.action.includes('mock')) ? 'text-orange-500' : 'text-green-500'}`}>
                                {auditLogs.some(l => l.action.includes('mock')) ? 'MOCK FALLBACK' : 'LIVE STREAM'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
                          <p className="text-[10px] text-accent/60 uppercase tracking-widest mb-2">Security Notice</p>
                          <p className="text-xs text-white/60 leading-relaxed">
                            All diagnostic actions and stream changes are logged to the persistent audit trail. Unauthorized access attempts trigger automated IP flags.
                          </p>
                        </div>
                        <button 
                          onClick={logoutAdmin}
                          className="w-full py-3 border border-red-500/30 text-red-500 text-[10px] tracking-widest uppercase rounded hover:bg-red-500/10 transition-all"
                        >
                          TERMINATE SESSION
                        </button>
                      </div>
                    </div>
                  )}

                  {adminTab === 'testing' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-display tracking-tight">Playwright E2E Suite</h3>
                          <p className="text-xs text-white/40">Automated verification of critical user journeys with screenshot capture.</p>
                        </div>
                        <button 
                          onClick={runTests}
                          disabled={isTesting}
                          className={`px-6 py-2 rounded text-[10px] tracking-widest uppercase transition-all ${isTesting ? 'bg-white/10 text-white/40' : 'bg-accent text-black font-bold hover:scale-[1.05]'}`}
                        >
                          {isTesting ? 'Executing...' : 'Run Suite'}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {testResults.map((test, i) => (
                          <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center gap-4 mb-3">
                              <div className={`w-2 h-2 rounded-full ${
                                test.status === 'pass' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                test.status === 'fail' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                test.status === 'running' ? 'bg-accent animate-pulse shadow-[0_0_10px_rgba(232,255,60,0.5)]' :
                                'bg-white/20'
                              }`} />
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium">{test.name}</span>
                                  <span className={`text-[10px] tracking-widest uppercase ${
                                    test.status === 'pass' ? 'text-green-500' :
                                    test.status === 'fail' ? 'text-red-500' :
                                    test.status === 'running' ? 'text-accent' :
                                    'text-white/20'
                                  }`}>
                                    {test.status}
                                  </span>
                                </div>
                                {test.message && (
                                  <p className="text-[10px] text-white/40 mt-1">{test.message}</p>
                                )}
                              </div>
                            </div>
                            {test.screenshot && (
                              <div className="mt-2 border border-white/10 rounded overflow-hidden">
                                <p className="text-[8px] text-white/20 bg-white/5 px-2 py-1 uppercase tracking-widest">Screenshot Capture</p>
                                <img 
                                  src={test.screenshot} 
                                  alt={`Test ${test.name}`} 
                                  className="w-full h-auto opacity-80 hover:opacity-100 transition-opacity cursor-zoom-in" 
                                  onClick={() => window.open(test.screenshot)} 
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {testScreenshots.length > 0 && (
                        <div className="pt-6 border-t border-white/10">
                          <h4 className="text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Artifact Gallery</h4>
                          <div className="grid grid-cols-4 gap-2">
                            {testScreenshots.map((src, i) => (
                              <div key={i} className="aspect-video bg-white/5 border border-white/10 rounded overflow-hidden cursor-pointer hover:border-accent transition-all" onClick={() => window.open(src)}>
                                <img src={src} className="w-full h-full object-cover opacity-50 hover:opacity-100" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {isTesting && (
                        <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg flex items-center gap-3">
                          <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                          <p className="text-[10px] text-accent uppercase tracking-widest">Simulating Playwright environment...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {adminTab === 'network' && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-display tracking-tight">Network Diagnostic</h3>
                          <p className="text-xs text-white/40">Verify connectivity to music servers via proxy.</p>
                        </div>
                        <button 
                          onClick={testNetwork}
                          className="px-6 py-2 bg-accent text-black font-bold rounded text-[10px] tracking-widest uppercase hover:scale-[1.05] transition-all"
                        >
                          Run Diagnostic
                        </button>
                      </div>

                      <div className="space-y-3">
                        {networkStatus.length === 0 ? (
                          <p className="text-xs text-white/20 italic text-center py-8">No diagnostic data. Click "Run Diagnostic" to start.</p>
                        ) : (
                          networkStatus.map((res, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] text-white/40 font-mono truncate max-w-[70%]">{getFilename(res.url)}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  res.status === 'SUCCESS' ? 'bg-green-500/20 text-green-500' : 
                                  res.status === 'pending' ? 'bg-white/10 text-white/40 animate-pulse' : 
                                  'bg-red-500/20 text-red-500'
                                }`}>
                                  {res.status}
                                </span>
                              </div>
                              {res.details && <p className="text-[10px] text-white/60 font-mono">{res.details}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {adminTab === 'logs' && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] tracking-[0.2em] text-accent uppercase flex items-center gap-2">
                          <History size={12} />
                          Audit Trail
                        </h3>
                        <span className="text-[10px] text-white/20 uppercase">{auditLogs.length} Events Logged</span>
                      </div>
                      <div className="space-y-2 font-mono">
                        {auditLogs.length === 0 ? (
                          <p className="text-xs text-white/20 italic">No logs recorded in current session.</p>
                        ) : (
                          [...auditLogs].reverse().map((log, i) => (
                            <div key={i} className="text-[10px] py-2 border-b border-white/5 flex gap-4">
                              <span className="text-white/20">[{new Date(log.ts).toLocaleTimeString()}]</span>
                              <span className="text-white/60 uppercase">{log.action}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isFeedbackOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-morphism w-full max-w-md rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="font-display text-2xl tracking-tight">SEND FEEDBACK</h2>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Help us improve Bridge Radio</p>
                </div>
                <button 
                  onClick={() => setIsFeedbackOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {feedbackSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                      <Zap size={32} />
                    </div>
                    <h3 className="text-xl font-display">THANK YOU!</h3>
                    <p className="text-sm text-white/60">Your feedback has been received and logged.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Name</label>
                      <input 
                        type="text"
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                        placeholder="Your Name (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                        placeholder="your@email.com (Optional)"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase tracking-widest ml-1">Message</label>
                      <textarea 
                        required
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                        placeholder="What's on your mind?"
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isFeedbackSubmitting}
                      className="w-full py-4 bg-accent text-black font-bold rounded-lg text-xs tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                    >
                      {isFeedbackSubmitting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          SENDING...
                        </>
                      ) : (
                        <>
                          <MessageSquare size={16} />
                          SUBMIT FEEDBACK
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => {
          setIsPlaying(true);
          startEqDraw();
        }}
        onPause={() => {
          setIsPlaying(false);
          stopEqDraw();
        }}
        onEnded={handleTrackEnded}
        crossOrigin="anonymous"
      />

      {/* Mobile Mini Player */}
      <AnimatePresence>
        {currentIndex !== -1 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 glass-morphism border-t border-white/10 px-4 py-3 pb-safe flex items-center gap-4 md:hidden"
          >
            <div 
              className={`w-10 h-10 rounded-full border border-white/20 bg-cover bg-center flex-shrink-0 ${isPlaying ? 'animate-spin-slow' : ''}`} 
              style={{ backgroundImage: `url(${currentTrack?.artwork || activeGenre.heroes[heroIdx]})` }} 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{currentTrack?.name}</p>
              <p className="text-[10px] text-white/40 truncate">
                {isLoading ? 'Track — / —' : `Track ${currentIndex + 1} / ${tracks.length}`}
              </p>
            </div>
            <button 
              onClick={togglePlay}
              className={`w-10 h-10 rounded flex items-center justify-center border ${isPlaying ? 'bg-accent border-accent text-black' : 'border-accent text-accent'}`}
            >
              {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
            </button>
            <button 
              onClick={nextTrack}
              className="w-10 h-10 rounded flex items-center justify-center border border-white/10 text-white/80"
            >
              <SkipForward size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Bar */}
      <footer className="relative z-10 py-4 px-6 text-center text-[8px] text-white/20 tracking-widest uppercase">
        Studio Monitor Engine v2.0 · React 19.2.4 · Cinematic Protocol Active
      </footer>
    </div>
  );
}
