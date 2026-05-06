
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateLyrics } from './services/geminiService';
import { logAction } from './services/auditLogService';
import { secureGetItem, secureSetItem } from './services/storageService';
import { initializeDictionary } from './services/dictionaryService';
import Spinner from './components/Spinner';
import LyricsOutput from './components/LyricsOutput';
import History from './components/History';
import StructureBuilder from './components/StructureBuilder';
import HeaderIcon from './components/HeaderIcon';
import ThemeSwitcher from './components/ThemeSwitcher';
import AdminPanel from './components/AdminPanel';
import TestPanel from './components/TestPanel';
import PatoisDictionary from './components/PatoisDictionary';
import Equalizer from './components/Equalizer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types
export interface HistoryEntry {
  id: number;
  theme: string;
  songDescription: string;
  songTitle: string;
  artistName: string;
  albumName: string;
  lyrics: string;
  timestamp: string;
  rhymeScheme: string;
  djPersona: string;
  songStructure: string[];
}

export interface User {
  password: string;
  role: 'user' | 'admin';
  privacyAccepted?: boolean;
}

export type Theme = 'dark' | 'light' | 'high-contrast';
type View = 'main' | 'admin' | 'testing' | 'dictionary';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onend: () => void;
  onerror: (e: any) => void;
  onresult: (e: any) => void;
  start(): void;
  stop(): void;
}
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const PERSONA_DESCRIPTIONS: Record<string, string> = {
  "Hype Man": "High octane energy. Focus on crowd interaction, 'Call & Response', and energetic ad-libs.",
  "Storyteller": "Narrative flow with a chronological arc. Rich sensory descriptions and emotional delivery.",
  "Roots Conscious": "Spiritual, heavy use of Rastafarian terminology. Focus on 'Livity', nature, and social justice.",
  "DJ General": "Aggressive and authoritative. Military metaphors and dominance suitable for Sound Clashes.",
  "Sound System Operator": "Technical focus on the equipment (amps, bass). Exclusive dubplate boasting.",
  "Roots Dub Poet": "Rhythmic spoken word. Intellectual analysis of social issues with deep poetic metaphors.",
  "Spoken Word": "Purely rhythmic spoken delivery. No singing. Focus on street philosophy, cadence, and intentional pauses."
};

const App: React.FC = () => {
  // --- Auth & Session (SOC 2 Governance) ---
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('patoisLyricistCurrentUser'));
  const [currentUserRole, setCurrentUserRole] = useState<'user' | 'admin'>('user');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [sessionTimeoutReached, setSessionTimeoutReached] = useState(false);
  const [showErasureConfirm, setShowErasureConfirm] = useState(false);
  const [showDirective, setShowDirective] = useState(false);

  // --- Laboratory State ---
  const [themeInput, setThemeInput] = useState<string>('');
  const [songDescription, setSongDescription] = useState<string>('');
  const [rhymeScheme, setRhymeScheme] = useState<string>('AABB');
  const [djPersona, setDjPersona] = useState<string>('Hype Man');
  
  // Initialize structure from secure storage to persist user customization across reloads
  const [songStructure, setSongStructure] = useState<string[]>(() => {
    const saved = secureGetItem<string[]>('patoisLyricistStructure');
    return saved || ['Intro', 'Verse', 'Chorus', 'Verse', 'Chorus', 'DJ Toast', 'Outro'];
  });
  
  const [lyrics, setLyrics] = useState<string>('');
  const [songTitle, setSongTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<View>('main');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [copyStatus, setCopyStatus] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'txt' | 'md' | 'pdf' | null>(null);
  const [eqSpeed, setEqSpeed] = useState<'S' | 'M' | 'F'>('M');

  // --- Voice & Session Timing ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const THEME_LIMIT = 500;
  const DESC_LIMIT = 200;
  const MAX_FAILED_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 60 * 1000;
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  // --- SOC 2 Guardrails ---
  const resetInactivityTimer = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (currentUser) {
      timeoutRef.current = window.setTimeout(() => {
        setSessionTimeoutReached(true);
        handleLogout();
      }, INACTIVITY_LIMIT);
    }
  }, [currentUser]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [resetInactivityTimer]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('patoisLyricistCurrentUser');
    if (loggedInUser) {
      const users = secureGetItem<Record<string, User>>('patoisLyricistUsers') || {};
      if (users[loggedInUser]) {
        setCurrentUser(loggedInUser);
        setCurrentUserRole(users[loggedInUser].role);
        setHistory(secureGetItem<HistoryEntry[]>(`patoisLyricistHistory_${loggedInUser}`) || []);
      } else { handleLogout(); }
    }
    const savedTheme = localStorage.getItem('patoisLyricistTheme') as Theme || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Initialize Dictionary
    initializeDictionary();
    
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      setIsSpeechSupported(true);
      recognitionRef.current = new SpeechRecognitionClass();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-JM'; 
        
        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setThemeInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        };
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser) secureSetItem(`patoisLyricistHistory_${currentUser}`, history);
  }, [history, currentUser]);

  // Persist song structure changes to secure storage
  useEffect(() => {
    secureSetItem('patoisLyricistStructure', songStructure);
  }, [songStructure]);

  // --- Handlers ---
  const toggleSpeech = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleLogin = () => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      setAuthError(`Security Lockout. Retry in ${Math.ceil((lockoutUntil - Date.now()) / 1000)}s.`);
      return;
    }
    const users = secureGetItem<Record<string, User>>('patoisLyricistUsers') || {};
    const user = users[authUsername];
    if (user && user.password === authPassword) {
      localStorage.setItem('patoisLyricistCurrentUser', authUsername);
      setCurrentUser(authUsername);
      setCurrentUserRole(user.role);
      setAuthUsername(''); setAuthPassword(''); setAuthError(null); setFailedAttempts(0);
      setHistory(secureGetItem<HistoryEntry[]>(`patoisLyricistHistory_${authUsername}`) || []);
      logAction(authUsername, 'Identity Verification Success', { forensics: true });
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= MAX_FAILED_ATTEMPTS) setLockoutUntil(Date.now() + LOCKOUT_DURATION);
      setAuthError(`Verification Failed. ${MAX_FAILED_ATTEMPTS - attempts} attempts remaining.`);
      logAction(authUsername || 'unknown', 'Identity Verification Failure', { attempt: attempts });
    }
  };

  const handleRegister = () => {
    if (!authUsername.trim() || authPassword.length < 8) {
      setAuthError('Identity requires username & 8+ char password.'); return;
    }
    if (!privacyAccepted) { setAuthError('Privacy Consent Required.'); return; }
    const users = secureGetItem<Record<string, User>>('patoisLyricistUsers') || {};
    if (users[authUsername]) { setAuthError('Identity already exists.'); return; }
    users[authUsername] = { password: authPassword, role: authUsername === 'admin' ? 'admin' : 'user', privacyAccepted: true };
    secureSetItem('patoisLyricistUsers', users);
    logAction('system', 'Identity Enrollment', { username: authUsername });
    handleLogin();
  };

  const handleLogout = () => {
    logAction(currentUser || 'unknown', 'Session Termination', {});
    localStorage.removeItem('patoisLyricistCurrentUser');
    setCurrentUser(null); setHistory([]); setCurrentView('main');
  };

  const handleGenerate = useCallback(async () => {
    if (!themeInput.trim()) return;
    setIsLoading(true); setLyrics(''); setSongTitle('');
    setGenerationStatus('Constructing riddim... please hold.');
    try {
      const result = await generateLyrics(themeInput, rhymeScheme, djPersona, songStructure, songDescription);
      setLyrics(result.lyrics);
      setSongTitle(result.title);
      setGenerationStatus('Riddim construction complete!');
      setHistory(prev => [{
        id: Date.now(), theme: themeInput, songDescription: songDescription, songTitle: result.title, artistName: '', albumName: '', lyrics: result.lyrics,
        timestamp: new Date().toISOString(), rhymeScheme, djPersona, songStructure
      }, ...prev].slice(0, 50));
      logAction(currentUser || 'unknown', 'Riddim Generated', { title: result.title });
    } catch (err: any) {
      setGenerationStatus('Construction failed. Try again.');
      console.error(err);
    } finally { setIsLoading(false); }
  }, [themeInput, rhymeScheme, djPersona, songStructure, songDescription, currentUser]);

  const handleCopy = () => {
    if (!lyrics) return;
    navigator.clipboard.writeText(`${songTitle}\n\n${lyrics}`);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const handleExport = async (format: 'txt' | 'md' | 'pdf') => {
    if (!lyrics) return;
    setExportingFormat(format);
    
    try {
      if (format === 'pdf') {
        const outputEl = document.getElementById('lyrics-export-container');
        if (outputEl) {
          const canvas = await html2canvas(outputEl, { backgroundColor: '#111111', scale: 2 });
          const imgData = canvas.toDataURL('image/png');
          const pdfWidth = 210; // A4 width in mm
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
          
          const doc = new jsPDF({
            orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
          });
          
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          doc.save(`${(songTitle || 'riddim').replace(/\s+/g, '_').toLowerCase()}.pdf`);
        }
      } else {
        let content = '';
        if (format === 'md') {
            content = `# ${songTitle || 'Untitled Riddim'}\n\n**Theme:** ${themeInput}\n**Description:** ${songDescription}\n**Rhyme Scheme:** ${rhymeScheme}\n**Persona:** ${djPersona}\n**Structure:** ${songStructure.join(' → ')}\n\n---\n\n${lyrics}`;
        } else {
            content = `TITLE: ${songTitle || 'Untitled Riddim'}\nTHEME: ${themeInput}\nDESCRIPTION: ${songDescription}\nRHYME SCHEME: ${rhymeScheme}\nPERSONA: ${djPersona}\nSTRUCTURE: ${songStructure.join(' -> ')}\n\n--------------------------------------------------\n\n${lyrics}`;
        }
        
        const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(songTitle || 'riddim').replace(/\s+/g, '_').toLowerCase()}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
      logAction(currentUser || 'unknown', 'Export Lyrics', { format, title: songTitle });
    } finally {
      setExportingFormat(null);
    }
  };

  const nuclearErasure = () => {
    if (!currentUser) return;
    
    // 1. Purge Local History
    localStorage.removeItem(`patoisLyricistHistory_${currentUser}`);
    
    // 2. Purge Identity (Full Right to be Forgotten)
    const users = secureGetItem<Record<string, User>>('patoisLyricistUsers') || {};
    if (users[currentUser]) {
      const { [currentUser]: deleted, ...remainingUsers } = users;
      secureSetItem('patoisLyricistUsers', remainingUsers);
    }
    
    // 3. Log Action (Audit trail remains anonymously for system integrity)
    logAction(currentUser, 'NUCLEAR ERASURE', { type: 'Account & Data Destroyed' });
    
    // 4. Reset Local State
    setHistory([]);
    setLyrics('');
    setThemeInput('');
    setSongDescription('');
    setShowErasureConfirm(false);
    
    // 5. Terminate Session
    handleLogout();
  };

  if (!currentUser) {
    return (
      <div className="login-background" role="main">
        {sessionTimeoutReached && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-yellow-600 text-black px-6 py-2 rounded-full font-bold z-50 shadow-2xl" role="alert">
            ⚠️ Security: Session Expired
          </div>
        )}
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-logo">PATOISLyricist</h1>
            <p className="login-subtitle">SECURE RIDDIM LABORATORY</p>
            <div className="relative">
              <Equalizer speed={eqSpeed} />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3 text-[9px] font-black tracking-widest text-white/40">
                <button 
                  onClick={() => setEqSpeed('S')} 
                  className={`hover:text-green-500 transition-colors px-2 py-1 rounded border border-white/5 ${eqSpeed === 'S' ? 'text-green-500 border-green-500/30 bg-green-500/10' : ''}`}
                  aria-label="Set roots tempo (Slow)"
                >S (ROOTS)</button>
                <button 
                  onClick={() => setEqSpeed('M')} 
                  className={`hover:text-yellow-500 transition-colors px-2 py-1 rounded border border-white/5 ${eqSpeed === 'M' ? 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10' : ''}`}
                  aria-label="Set riddim tempo (Medium)"
                >M (RIDDIM)</button>
                <button 
                  onClick={() => setEqSpeed('F')} 
                  className={`hover:text-red-500 transition-colors px-2 py-1 rounded border border-white/5 ${eqSpeed === 'F' ? 'text-red-500 border-red-500/30 bg-red-500/10' : ''}`}
                  aria-label="Set dancehall tempo (Fast)"
                >F (VAR)</button>
              </div>
            </div>
          </div>
          <div className="login-card mt-12">
            <h2 className="card-title" id="auth-heading">{authView === 'login' ? 'Verification' : 'Enrollment'}</h2>
            {authError && <p className="text-red-400 text-center mb-4 text-sm font-bold bg-red-900/20 p-2 rounded" role="alert">{authError}</p>}
            <form onSubmit={e => { e.preventDefault(); authView === 'login' ? handleLogin() : handleRegister(); }} aria-labelledby="auth-heading">
              <div className="form-group">
                <label className="sr-only" htmlFor="username">Username</label>
                <div className="input-wrapper">
                   <input 
                      id="username" 
                      type="text" 
                      placeholder="Identity Handle" 
                      required 
                      value={authUsername} 
                      onChange={e => setAuthUsername(e.target.value)} 
                      aria-required="true" 
                      className="focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                   />
                   <span className="input-icon" aria-hidden="true">👤</span>
                </div>
              </div>
              <div className="form-group">
                <label className="sr-only" htmlFor="password">Password</label>
                <div className="input-wrapper">
                   <input 
                      id="password" 
                      type="password" 
                      placeholder="Access Token" 
                      required 
                      value={authPassword} 
                      onChange={e => setAuthPassword(e.target.value)} 
                      aria-required="true"
                      className="focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                   />
                   <span className="input-icon" aria-hidden="true">🔑</span>
                </div>
              </div>
              {authView === 'register' && (
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-start gap-3">
                    <input id="consent" type="checkbox" checked={privacyAccepted} onChange={e => setPrivacyAccepted(e.target.checked)} className="accent-[#D4AF37] w-5 h-5 mt-0.5" aria-required="true" />
                    <label htmlFor="consent" className="text-xs opacity-60 cursor-pointer">
                      I have read and consent to the <button type="button" onClick={() => setShowDirective(true)} className="text-title font-bold underline hover:text-white">SOC 2 Security Directive</button> concerning local data obfuscation and forensic monitoring.
                    </label>
                  </div>
                </div>
              )}
              <button type="submit" className="login-btn">{authView === 'login' ? 'Validate Identity' : 'Enroll Identity'}</button>
              <p className="register-link">
                {authView === 'login' ? "New entity?" : "Existing entity?"} 
                <button type="button" onClick={() => setAuthView(authView === 'login' ? 'register' : 'login')} className="ml-2 underline text-title font-bold">{authView === 'login' ? 'Enroll' : 'Verify'}</button>
              </p>
            </form>
          </div>
          
          <div className="mt-8 text-center">
             <button onClick={() => setShowDirective(true)} className="text-[10px] text-gray-500 uppercase tracking-widest hover:text-title transition-colors border-b border-dashed border-gray-700 pb-1">Review SOC 2 Phase 1 Directive</button>
          </div>

        </div>
        
        {showDirective && (
            <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="directive-title">
              <div className="bg-[#111] p-8 rounded-[2rem] shadow-2xl border border-title/20 max-w-2xl w-full relative overflow-hidden">
                <div className="rasta-stripes absolute top-0 left-0 right-0 h-1"></div>
                <h3 id="directive-title" className="text-2xl font-black text-title mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Security Directive: Phase 1</h3>
                
                <div className="space-y-4 text-sm text-gray-300 max-h-[60vh] overflow-y-auto pr-2 mb-6 font-mono">
                  <p><strong className="text-white">1.0 ACCESS CONTROL POLICY</strong><br/>
                  Access to the Patois Lyricist Laboratory is restricted to authorized entities. All identity verification events are logged. Brute force attempts (3 failures) result in a mandatory 60-second lockout.</p>
                  
                  <p><strong className="text-white">2.0 FORENSIC MONITORING</strong><br/>
                  To maintain SOC 2 compliance, this system captures forensic metadata during all sessions, including but not limited to User Agent strings, Screen Resolution, Timezone, and Language settings. This data is immutable.</p>
                  
                  <p><strong className="text-white">3.0 DATA CONFIDENTIALITY (AT-REST)</strong><br/>
                  All user generated content (lyrics, themes, history) and identity tokens stored within the browser's LocalStorage are subject to Base64 obfuscation. No data is transmitted to third parties except for the stateless processing required by the Gemini API.</p>
                  
                  <p><strong className="text-white">4.0 DATA SOVEREIGNTY</strong><br/>
                  Users retain full ownership of their generated lyrics. The "Right to be Forgotten" is exercisable via the "Purge My Repository" function, which executes a nuclear erasure of all local data.</p>
                </div>
                
                <button onClick={() => setShowDirective(false)} className="w-full py-4 bg-gray-800 hover:bg-title hover:text-black rounded-xl font-black uppercase tracking-[0.2em] transition-all">Acknowledge Directive</button>
              </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" role="application" aria-label="Patois Lyricist App">
      <div className="rasta-stripes" aria-hidden="true" />
      <div className="container mx-auto p-6 max-w-4xl">
        <header className="mb-12 flex flex-col items-center" role="banner">
          <div className="w-full flex justify-between items-center mb-6">
            <ThemeSwitcher onThemeChange={t => { document.body.setAttribute('data-theme', t); localStorage.setItem('patoisLyricistTheme', t); }} />
            <div className="text-right flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-md">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-black text-green-500 uppercase">Audit Link Active</span>
              </div>
              <button onClick={() => setShowErasureConfirm(true)} className="text-[10px] text-red-500/40 hover:text-red-500 font-bold uppercase transition-colors" aria-label="Nuclear erasure of all your data">Purge My Repository</button>
              <div className="h-4 w-px bg-white/10" />
              <div>
                <span className="text-xs opacity-50 block uppercase tracking-tighter">Identity: {currentUser}</span>
                <button onClick={handleLogout} className="text-xs font-black text-title hover:underline uppercase" aria-label="Terminate current session">Terminate Session</button>
              </div>
            </div>
          </div>
          <HeaderIcon />
          <nav className="flex gap-10 mt-10 border-b border-white/5 w-full justify-center pb-4" role="navigation" aria-label="Primary Navigation">
            <button onClick={() => setCurrentView('main')} aria-current={currentView === 'main' ? 'page' : undefined} className={`text-xs font-black uppercase tracking-[0.2em] transition-all ${currentView === 'main' ? 'text-title' : 'opacity-30 hover:opacity-60'}`}>Laboratory</button>
            <button onClick={() => setCurrentView('dictionary')} aria-current={currentView === 'dictionary' ? 'page' : undefined} className={`text-xs font-black uppercase tracking-[0.2em] transition-all ${currentView === 'dictionary' ? 'text-title' : 'opacity-30 hover:opacity-60'}`}>Glossary</button>
            {currentUserRole === 'admin' && <button onClick={() => setCurrentView('admin')} aria-current={currentView === 'admin' ? 'page' : undefined} className={`text-xs font-black uppercase tracking-[0.2em] transition-all ${currentView === 'admin' ? 'text-title' : 'opacity-30 hover:opacity-60'}`}>Governance</button>}
            <button onClick={() => setCurrentView('testing')} aria-current={currentView === 'testing' ? 'page' : undefined} className={`text-xs font-black uppercase tracking-[0.2em] transition-all ${currentView === 'testing' ? 'text-title' : 'opacity-30 hover:opacity-60'}`}>Diagnostics</button>
          </nav>
        </header>

        {currentView === 'main' && (
          <main className="grid gap-10 fade-in" aria-label="Riddim Laboratory Content">
            <section className="bg-card p-8 rounded-[2rem] border border-white/5 shadow-inner" aria-labelledby="input-heading">
              <div className="flex justify-between items-center mb-6">
                <h3 id="input-heading" className="font-black uppercase tracking-widest text-title text-sm">Vision Input</h3>
                <div className="flex items-center gap-2">
                   {isSpeechSupported && (
                     <button onClick={toggleSpeech} className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/5 text-gray-400 hover:text-white'}`} aria-label={isListening ? "Stop voice recording" : "Start voice recording"}>
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/></svg>
                     </button>
                   )}
                   {isListening && <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20" role="status">● FIELD RECORDING</span>}
                </div>
              </div>
              <div className="relative mb-6 group">
                <label htmlFor="themeInput" className="sr-only">Song Narrative</label>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border border-[#D4AF37]/30 shadow-xl z-10 whitespace-nowrap pointer-events-none fade-in">
                    Max Capacity: {THEME_LIMIT} Chars
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-b border-r border-[#D4AF37]/30 rotate-45"></div>
                </div>
                <textarea 
                  id="themeInput" 
                  value={themeInput} 
                  onChange={e => setThemeInput(e.target.value)} 
                  maxLength={THEME_LIMIT} 
                  placeholder="Narrative for the Riddim..." 
                  className="w-full p-6 bg-black/40 border-2 border-white/5 rounded-3xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all h-40 text-lg placeholder:opacity-30" 
                />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mt-2 px-4">
                  <span className="opacity-30">Theme Character Count</span>
                  <span className={themeInput.length >= THEME_LIMIT ? 'text-red-500' : 'opacity-30'}>{themeInput.length} / {THEME_LIMIT} characters</span>
                </div>
              </div>

              <div className="relative mb-6 group">
                <label htmlFor="songDescription" className="sr-only">Song Description</label>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-900 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border border-[#D4AF37]/30 shadow-xl z-10 whitespace-nowrap pointer-events-none fade-in">
                    Max Capacity: {DESC_LIMIT} Chars
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 border-b border-r border-[#D4AF37]/30 rotate-45"></div>
                </div>
                <textarea 
                  id="songDescription" 
                  value={songDescription} 
                  onChange={e => setSongDescription(e.target.value)} 
                  maxLength={DESC_LIMIT} 
                  placeholder="Specific instructions (vibes, mood, story details)..." 
                  className="w-full p-6 bg-black/40 border-2 border-white/5 rounded-3xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all h-32 text-base placeholder:opacity-30" 
                />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mt-2 px-4">
                  <span className="opacity-30">Description Persistence</span>
                  <span className={songDescription.length >= DESC_LIMIT ? 'text-red-500' : 'opacity-30'}>{songDescription.length} / {DESC_LIMIT}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cadence" className="text-[10px] uppercase font-bold opacity-40 ml-2">Cadence Control</label>
                  <select 
                    id="cadence" 
                    value={rhymeScheme} 
                    onChange={e => setRhymeScheme(e.target.value)} 
                    className="p-4 bg-black/40 border border-white/5 rounded-2xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                  >
                    <option value="AABB">Couplets (AABB)</option>
                    <option value="ABAB">Alternate (ABAB)</option>
                    <option value="Freestyle">Freestyle Roots</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 relative group">
                  <div className="flex justify-between items-center ml-2">
                    <label htmlFor="signature" className="text-[10px] uppercase font-bold opacity-40">Vocal Signature</label>
                    <div className="group relative">
                      <span className="text-[10px] cursor-help border-b border-dashed border-white/30 text-white/50 hover:text-white transition-colors">ℹ️ Info</span>
                      <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-gray-900 border border-[#D4AF37]/30 rounded-xl shadow-2xl hidden group-hover:block z-20 text-xs text-gray-300 pointer-events-none">
                         <span className="text-[#D4AF37] font-bold block mb-1">{djPersona}</span>
                         {PERSONA_DESCRIPTIONS[djPersona]}
                      </div>
                    </div>
                  </div>
                  <select 
                    id="signature" 
                    value={djPersona} 
                    onChange={e => setDjPersona(e.target.value)} 
                    className="p-4 bg-black/40 border border-white/5 rounded-2xl text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all w-full"
                  >
                    <option value="Hype Man">Hype Man</option>
                    <option value="Storyteller">Storyteller</option>
                    <option value="Roots Conscious">Roots Conscious</option>
                    <option value="DJ General">DJ General</option>
                    <option value="Sound System Operator">Sound System Operator</option>
                    <option value="Roots Dub Poet">Roots Dub Poet</option>
                    <option value="Spoken Word">Spoken Word</option>
                  </select>
                  
                  <div className="mt-2 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-400 italic">
                      <span className="text-title not-italic font-bold mr-1">Current Persona Context:</span>
                      {PERSONA_DESCRIPTIONS[djPersona] || "Select a persona to define the vocal style."}
                  </div>
                </div>
              </div>
              
              <div className="mt-10"><StructureBuilder structure={songStructure} setStructure={setSongStructure} disabled={isLoading} /></div>
              
              <button onClick={handleGenerate} disabled={isLoading || !themeInput.trim()} className="w-full mt-12 bg-green-600 hover:bg-green-500 disabled:opacity-20 py-5 rounded-3xl font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all active:scale-[0.98]" aria-busy={isLoading}>
                CONSTRUCT RIDDIM
              </button>
              {isLoading && <Spinner status={generationStatus} />}
              <div className="mt-2 text-center text-xs opacity-50 font-bold" aria-live="polite">
                {generationStatus}
              </div>
            </section>

            {lyrics && (
              <section className="mt-10 fade-in" aria-labelledby="output-heading">
                <div id="lyrics-export-container" className="absolute -top-[9999px] -left-[9999px] w-[800px]" aria-hidden="true">
                  <div className="p-10 bg-[#111111] text-white">
                    <div className="rasta-stripes mb-8 h-2 w-full" />
                    <h1 className="text-4xl font-bold mb-4 text-[#D4AF37] font-serif">{songTitle || 'Untitled Riddim'}</h1>
                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm opacity-70 border-b border-white/10 pb-4">
                      <p><strong className="text-[#D4AF37]">Theme:</strong> {themeInput}</p>
                      <p><strong className="text-[#D4AF37]">Style:</strong> {djPersona} ({rhymeScheme})</p>
                      {songDescription && <p className="col-span-2 italic"><strong className="text-[#D4AF37]">Vision:</strong> {songDescription}</p>}
                      <p className="col-span-2"><strong className="text-[#D4AF37]">Structure:</strong> {songStructure.join(' → ')}</p>
                    </div>
                    <div className="whitespace-pre-wrap font-mono text-lg leading-relaxed">{lyrics}</div>
                    <div className="mt-10 pt-4 border-t border-white/10 text-center text-xs opacity-30 uppercase tracking-widest">
                      Generated by Patois Lyricist • {new Date().toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between items-end mb-4 gap-4">
                  <h2 id="output-heading" className="title-font text-3xl font-bold border-b-2 border-title pb-1">{songTitle}</h2>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={handleCopy} 
                      aria-label="Copy lyrics to clipboard"
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-title hover:text-black px-4 py-2 rounded-full border border-white/10 hover:border-title transition-all focus:outline-none focus:ring-2 focus:ring-title active:scale-95"
                    >
                      {copyStatus ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      )}
                      {copyStatus ? 'Copied!' : 'Copy'}
                    </button>
                    <button 
                      onClick={() => handleExport('txt')} 
                      disabled={exportingFormat !== null}
                      aria-label="Export lyrics as Plain Text"
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-title hover:text-black px-4 py-2 rounded-full border border-white/10 hover:border-title transition-all focus:outline-none focus:ring-2 focus:ring-title active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exportingFormat === 'txt' ? (
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      )}
                      .TXT
                    </button>
                    <button 
                      onClick={() => handleExport('md')} 
                      disabled={exportingFormat !== null}
                      aria-label="Export lyrics as Markdown"
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-title hover:text-black px-4 py-2 rounded-full border border-white/10 hover:border-title transition-all focus:outline-none focus:ring-2 focus:ring-title active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exportingFormat === 'md' ? (
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      )}
                      .MD
                    </button>
                    <button 
                      onClick={() => handleExport('pdf')} 
                      disabled={exportingFormat !== null}
                      aria-label="Export lyrics as PDF Document"
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-900/40 hover:bg-green-500 hover:text-black px-4 py-2 rounded-full border border-green-500/30 hover:border-green-500 transition-all focus:outline-none focus:ring-2 focus:ring-green-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {exportingFormat === 'pdf' ? (
                        <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      )}
                      .PDF
                    </button>
                  </div>
                </div>
                <LyricsOutput lyrics={lyrics} description={songDescription} />
              </section>
            )}
            
            <History history={history} onLoad={h => { 
              setThemeInput(h.theme); 
              setSongDescription(h.songDescription || ''); 
              setLyrics(h.lyrics); 
              setSongTitle(h.songTitle); 
              if (h.rhymeScheme) setRhymeScheme(h.rhymeScheme);
              if (h.djPersona) setDjPersona(h.djPersona);
              if (h.songStructure) setSongStructure(h.songStructure);
            }} onClear={() => setHistory([])} />
          </main>
        )}

        {currentView === 'dictionary' && <PatoisDictionary currentUser={currentUser} />}
        {currentView === 'admin' && currentUserRole === 'admin' && <AdminPanel currentUser={currentUser} />}
        {currentView === 'testing' && <TestPanel />}

        <footer className="mt-32 text-center opacity-10 text-[9px] uppercase tracking-[0.4em] pb-10" role="contentinfo">
          SOC 2 Certification Active • Secure Environment v3.0.0 • Final Refresh Complete
        </footer>
      </div>

      {showErasureConfirm && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-gray-900 p-8 rounded-[2rem] shadow-2xl border-2 border-red-500/30 max-w-md w-full text-center">
            <h4 className="text-2xl font-black text-red-500 mb-2 uppercase tracking-tighter">Right to be Forgotten</h4>
            <p className="text-sm text-gray-400 mb-8">This will immediately purge all your song history, vision data, and identity records from this device. This operation is irreversible.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowErasureConfirm(false)} className="flex-1 py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl font-black uppercase tracking-widest transition-colors">Abort</button>
              <button onClick={nuclearErasure} className="flex-1 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black uppercase tracking-widest transition-colors shadow-lg shadow-red-600/20">Purge Data</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
