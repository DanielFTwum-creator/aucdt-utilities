import { useState } from 'react';
import type { ElementType } from 'react';
import { HomeCover } from './book/components/HomeCover';
import { TechniqueBoard } from './book/components/TechniqueBoard';
import { StoryPlayer } from './book/components/StoryPlayer';
import { ResourceHub } from './book/components/ResourceHub';
import { AdminHub } from './book/components/AdminHub';
import { LoadingScreen } from './book/components/LoadingScreen';
import { getAudioContext } from './book/lib/audio';
import { BookOpen, Sparkles, Volume2, ShieldCheck, Headphones, Heart, Lock } from 'lucide-react';

type BookView = 'cover' | 'prep' | 'story' | 'resources' | 'admin';
type BookTheme = 'light' | 'dark' | 'contrast';

export default function BookPage() {
  const [activeView, setActiveView] = useState<BookView>('cover');
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [theme, setTheme] = useState<BookTheme>(
    () => (localStorage.getItem('elephant_theme') as BookTheme) || 'light'
  );

  const handleSetTheme = (t: BookTheme) => {
    setTheme(t);
    localStorage.setItem('elephant_theme', t);
  };

  const initAudio = () => {
    try { getAudioContext(); setAudioInitialized(true); }
    catch (e) { console.warn('Audio init failed', e); }
  };

  const themeClass = theme === 'light' ? 'bg-[#FDFBF7] text-slate-800 font-sans'
    : theme === 'dark' ? 'bg-[#0F172A] text-slate-100 font-sans dark'
    : 'bg-black text-[#F59E0B] font-mono border-4 border-[#F59E0B] contrast-mode';

  const headerClass = theme === 'light' ? 'bg-white border-b border-amber-900/10 shadow-xs sticky top-0 z-50'
    : theme === 'dark' ? 'bg-[#1E293B] border-b border-slate-800 shadow-md sticky top-0 z-50'
    : 'bg-black border-b-4 border-[#F59E0B] sticky top-0 z-50';

  const navBtn = (view: BookView, label: string, Icon: ElementType) => (
    <button
      onClick={() => { initAudio(); setActiveView(view); }}
      type="button"
      className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
        activeView === view
          ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-amber-800 text-white font-bold')
          : (theme === 'light' ? 'bg-[#FAF8F3] text-amber-900 hover:bg-amber-50'
          : theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          : 'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
      }`}
    >
      <Icon className="h-3.5 w-3.5 hidden sm:inline" />
      <span>{label}</span>
    </button>
  );

  return (
    <>
      {appLoading && <LoadingScreen onFinished={() => setAppLoading(false)} />}
      <div className={`min-h-screen flex flex-col justify-between ${themeClass}`}>

        <header className={headerClass}>
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14 sm:h-16">
            <button onClick={() => setActiveView('cover')} type="button"
              className="flex items-center gap-2 cursor-pointer text-left select-none">
              <span className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '4s' }}>🐘</span>
              <div>
                <p className={`font-heading text-sm sm:text-base font-black tracking-tight leading-none ${
                  theme === 'light' ? 'text-amber-950' : theme === 'dark' ? 'text-white' : 'text-[#F59E0B]'
                }`}>An Elephant on Parade</p>
                <p className={`hidden sm:block text-[9px] font-mono font-semibold tracking-wider uppercase mt-0.5 ${
                  theme === 'light' ? 'text-amber-700' : theme === 'dark' ? 'text-indigo-400' : 'text-[#F59E0B]'
                }`}>The Heartbeat of Africa</p>
              </div>
            </button>

            <div className="flex items-center gap-1 sm:gap-2">
              {navBtn('prep', 'Prep', ShieldCheck)}
              {navBtn('story', 'Story', BookOpen)}
              {navBtn('resources', 'Sandbox', Sparkles)}
              <button onClick={() => { initAudio(); setActiveView('admin'); }} type="button"
                className={`p-1.5 px-2.5 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                  activeView === 'admin'
                    ? (theme === 'contrast' ? 'bg-[#F29F05] text-black font-extrabold' : 'bg-amber-950 text-white font-extrabold')
                    : (theme === 'light' ? 'bg-[#FAF8F3] text-amber-900 hover:bg-amber-50'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    : 'bg-black text-[#F59E0B] border border-[#F59E0B] hover:bg-amber-900/30')
                }`}>
                <Lock className="h-3.5 w-3.5 hidden sm:inline animate-pulse" />
                <span>Admin</span>
              </button>
            </div>

            <div className="hidden md:block">
              {audioInitialized ? (
                <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold rounded-full px-2.5 py-1 select-none ${
                  theme === 'light' ? 'text-green-700 bg-emerald-50 border border-green-300'
                  : theme === 'dark' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20'
                  : 'text-[#F59E0B] bg-black border border-[#F59E0B]'
                }`}>
                  <Volume2 className="h-3.5 w-3.5" /> Audio Enabled
                </span>
              ) : (
                <button type="button" onClick={initAudio}
                  className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold rounded-full px-2.5 py-1 transition-colors cursor-pointer ${
                    theme === 'light' ? 'text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100'
                    : theme === 'dark' ? 'text-indigo-200 bg-slate-800 border border-indigo-500/15 hover:bg-slate-700'
                    : 'text-black bg-[#F59E0B] border border-white hover:bg-amber-600'
                  }`}>
                  <Headphones className="h-3.5 w-3.5" /> Tap to Enable Audio
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
          {activeView === 'cover' && (
            <HomeCover
              onStartStory={() => { initAudio(); setActiveView('story'); }}
              onGoToPrep={() => { initAudio(); setActiveView('prep'); }}
              onGoToResources={() => { initAudio(); setActiveView('resources'); }}
            />
          )}
          {activeView === 'prep' && (
            <TechniqueBoard onBackToHome={() => setActiveView('cover')} onProceedToStory={() => setActiveView('story')} />
          )}
          {activeView === 'story' && (
            <StoryPlayer onBackToHome={() => setActiveView('cover')} />
          )}
          {activeView === 'resources' && (
            <ResourceHub onBackToHome={() => setActiveView('cover')} />
          )}
          {activeView === 'admin' && (
            <AdminHub onBackToHome={() => setActiveView('cover')} currentTheme={theme} setGlobalTheme={handleSetTheme} />
          )}
        </main>

        <footer className={`py-6 sm:py-8 ${
          theme === 'light' ? 'bg-white border-t border-amber-900/10 text-slate-700'
          : theme === 'dark' ? 'bg-[#1E293B] border-t border-slate-800 text-slate-300'
          : 'bg-black border-t-4 border-[#F59E0B] text-[#F59E0B]'
        }`}>
          <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
            <div className="flex justify-center items-center gap-2 text-xs font-semibold text-red-700">
              <Heart className="h-3.5 w-3.5 fill-current animate-pulse" />
              <span>Rhythm belongs to everyone, and everyone deserves a chance to feel it.</span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-xl mx-auto text-slate-500">
              Digital companion for <strong>&ldquo;An Elephant on Parade: The Heartbeat of Africa&rdquo;</strong> by <strong>Steve Ferraris</strong>. All sounds synthesised locally in real-time.
            </p>
            <p className="text-[10px] font-mono pt-1 text-slate-400">
              &copy; {new Date().getFullYear()} Steve Ferraris • Drumming for Success Curriculum
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
