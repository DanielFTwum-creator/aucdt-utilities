import { useState, useEffect } from 'react';
import { HomeCover } from './components/HomeCover';
import { TechniqueBoard } from './components/TechniqueBoard';
import { StoryPlayer } from './components/StoryPlayer';
import { ResourceHub } from './components/ResourceHub';
import { AdminHub } from './components/AdminHub';
import { LoadingScreen } from './components/LoadingScreen';
import { getAudioContext } from './lib/audio';
import { BookOpen, Sparkles, Volume2, ShieldCheck, Headphones, Heart, Lock } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'cover' | 'prep' | 'story' | 'resources' | 'admin'>('cover');
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);
  const [appLoading, setAppLoading] = useState<boolean>(true);
  
  // Theme state: light, dark, or contrast
  const [theme, setTheme] = useState<'light' | 'dark' | 'contrast'>(() => {
    return (localStorage.getItem('tuc_global_theme') as any) || 'light';
  });

  const handleSetTheme = (newTheme: 'light' | 'dark' | 'contrast') => {
    setTheme(newTheme);
    localStorage.setItem('tuc_global_theme', newTheme);
  };

  // Safely prime the Web Audio engine on click
  const initAudio = () => {
    try {
      getAudioContext();
      setAudioInitialized(true);
    } catch (e) {
      console.warn("Audio Context init failing", e);
    }
  };

  const getThemeClass = () => {
    if (theme === 'light') return 'bg-[#FDFBF7] text-slate-800 font-sans';
    if (theme === 'dark') return 'bg-[#0F172A] text-slate-100 font-sans dark';
    return 'bg-black text-[#F59E0B] font-mono border-4 border-[#F59E0B] contrast-mode';
  };

  const getHeaderClass = () => {
    if (theme === 'light') return 'bg-white border-b border-amber-900/10 shadow-xs sticky top-0 z-50';
    if (theme === 'dark') return 'bg-[#1E293B] border-b border-slate-800 shadow-md sticky top-0 z-50';
    return 'bg-black border-b-4 border-[#F59E0B] sticky top-0 z-50';
  };

  return (
    <>
      {appLoading && <LoadingScreen onFinished={() => setAppLoading(false)} />}
      <div className={`min-h-screen flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 ${getThemeClass()}`}>
      
      {/* Top Main Navigation Bar */}
      <header className={getHeaderClass()}>
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
          
          <button
            onClick={() => setActiveView('cover')}
            type="button"
            className="flex items-center gap-2 cursor-pointer text-left select-none outline-hidden focus:ring-2 focus:ring-brand-gold/20 rounded"
          >
            <span className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '4s' }}>🐘</span>
            <div>
              <p className={`font-heading text-sm sm:text-base font-black tracking-tight leading-none ${
                theme === 'light' ? 'text-brand-charcoal' :
                theme === 'dark' ? 'text-white' :
                'text-[#F59E0B]'
              }`}>
                An Elephant on Parade
              </p>
              <p className={`hidden sm:block text-[9px] font-mono font-semibold tracking-wider uppercase mt-0.5 ${
                theme === 'light' ? 'text-brand-gold' :
                theme === 'dark' ? 'text-indigo-400' :
                'text-[#F59E0B]'
              }`}>
                The Heartbeat of Africa
              </p>
            </div>
          </button>

          {/* Nav links hub */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            <button
              onClick={() => { initAudio(); setActiveView('prep'); }}
              type="button"
              className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                activeView === 'prep'
                  ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-brand-earth text-white font-bold')
                  : (theme === 'light' ? 'bg-[#FAF8F3] text-brand-earth hover:bg-amber-50' : 
                     theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' :
                     'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 hidden sm:inline" />
              <span>Prep</span>
            </button>

            <button
              onClick={() => { initAudio(); setActiveView('story'); }}
              type="button"
              className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                activeView === 'story'
                  ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-brand-earth text-white font-bold')
                  : (theme === 'light' ? 'bg-[#FAF8F3] text-brand-earth hover:bg-amber-50' : 
                     theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' :
                     'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 hidden sm:inline" />
              <span>Story</span>
            </button>

            <button
              onClick={() => { initAudio(); setActiveView('resources'); }}
              type="button"
              className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                activeView === 'resources'
                  ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-brand-earth text-white font-bold')
                  : (theme === 'light' ? 'bg-[#FAF8F3] text-brand-earth hover:bg-amber-50' : 
                     theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' :
                     'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 hidden sm:inline" />
              <span>Sandbox</span>
            </button>

            <button
              onClick={() => { initAudio(); setActiveView('admin'); }}
              type="button"
              className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                activeView === 'admin'
                  ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-amber-950 text-white font-extrabold')
                  : (theme === 'light' ? 'bg-[#FAF8F3] text-brand-earth hover:bg-amber-50' : 
                     theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' :
                     'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
              }`}
              title="Access Admin Panel"
            >
              <Lock className="h-3.5 w-3.5 hidden sm:inline animate-pulse" />
              <span>Admin Hub</span>
            </button>

          </div>

          {/* Audio Engine Status indicator */}
          <div className="hidden md:block">
            {audioInitialized ? (
              <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold rounded-full px-2.5 py-1 select-none ${
                theme === 'light' ? 'text-brand-green bg-emerald-50 border border-brand-green/20' :
                theme === 'dark' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20' :
                'text-[#F59E0B] bg-black border border-[#F59E0B]'
              }`}>
                <Volume2 className="h-3.5 w-3.5" /> Audio Enabled
              </span>
            ) : (
              <button
                type="button"
                onClick={initAudio}
                className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
                  theme === 'light' ? 'text-amber-900 bg-amber-50 border border-brand-gold/20 hover:bg-amber-100' :
                  theme === 'dark' ? 'text-indigo-200 bg-slate-800 border border-indigo-500/15 hover:bg-slate-700' :
                  'text-black bg-[#F59E0B] border border-white hover:bg-amber-600'
                }`}
                title="Enable sound outputs"
              >
                <Headphones className="h-3.5 w-3.5" /> Tap to Enable Audio
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Interactive Screen Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
        
        {/* State Route switch */}
        {activeView === 'cover' && (
          <HomeCover
            onStartStory={() => { initAudio(); setActiveView('story'); }}
            onGoToPrep={() => { initAudio(); setActiveView('prep'); }}
            onGoToResources={() => { initAudio(); setActiveView('resources'); }}
          />
        )}

        {activeView === 'prep' && (
          <TechniqueBoard
            onBackToHome={() => setActiveView('cover')}
            onProceedToStory={() => setActiveView('story')}
          />
        )}

        {activeView === 'story' && (
          <StoryPlayer
            onBackToHome={() => setActiveView('cover')}
          />
        )}

        {activeView === 'resources' && (
          <ResourceHub
            onBackToHome={() => setActiveView('cover')}
          />
        )}

        {activeView === 'admin' && (
          <AdminHub
            onBackToHome={() => setActiveView('cover')}
            currentTheme={theme}
            setGlobalTheme={handleSetTheme}
          />
        )}

      </main>

      {/* Educational Standard footer */}
      <footer className={`py-6 sm:py-8 ${
        theme === 'light' ? 'bg-white border-t border-amber-900/10 text-slate-700' :
        theme === 'dark' ? 'bg-[#1E293B] border-t border-slate-800 text-slate-300' :
        'bg-black border-t-4 border-[#F59E0B] text-[#F59E0B]'
      }`}>
        <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
          
          <div className="flex justify-center items-center gap-2 text-xs font-semibold text-[#B91C1C]" aria-hidden="true">
            <Heart className={`h-3.5 w-3.5 fill-current animate-pulse ${theme === 'contrast' ? 'text-red-500' : ''}`} />
            <span>Rhythm belongs to everyone, and everyone deserves a chance to feel it.</span>
          </div>

          <div className={`text-[11px] leading-relaxed max-w-xl mx-auto ${
            theme === 'light' ? 'text-[#64748B]' :
            theme === 'dark' ? 'text-slate-400' :
            'text-[#F59E0B]'
          }`}>
            This application is a digital companion for <strong>&ldquo;An Elephant on Parade: The Heartbeat of Africa&rdquo;</strong>, written by master djembe educator <strong>Steve Ferraris</strong>. All synthesized sounds are programmatically modeled locally in real-time.
          </div>

          <div className={`text-[10px] font-mono pt-1 ${
            theme === 'light' ? 'text-[#94A3B8]' :
            theme === 'dark' ? 'text-slate-500' :
            'text-[#F59E0B]'
          }`}>
            &copy; {new Date().getFullYear()} Steve Ferraris • Drumming for Success Curriculum. Digital Companion v1.0.0
          </div>

        </div>
      </footer>

      </div>
    </>
  );
}
