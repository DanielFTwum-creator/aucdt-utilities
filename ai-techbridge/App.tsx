
import React, { createContext, useEffect, useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import DirectoryHome from './components/DirectoryHome';
import Documentation from './components/Documentation';
import InteractiveShell from './components/InteractiveShell';
import Navbar from './components/Navbar';
import Placeholder from './components/Placeholder';
import ResearchAssistant from './components/ResearchAssistant';
import TestSuite from './components/TestSuite';
import { ThemeMode } from './types';

export const ThemeContext = createContext<{
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}>({ theme: 'light', setTheme: () => {} });

const App: React.FC = () => {
  // Initialize theme from localStorage with fallback to 'light'
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('tb_theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'contrast') {
        return savedTheme;
      }
    }
    return 'light';
  });

  const [view, setView] = useState<'home' | 'directory' | 'admin' | 'test' | 'docs' | 'placeholder'>('home');
  const [prevView, setPrevView] = useState<'home' | 'directory' | 'admin' | 'test' | 'docs'>('home');

  const goToPlaceholder = (current: any) => {
    setPrevView(current);
    setView('placeholder');
  };

  useEffect(() => {
    // Persist theme selection
    localStorage.setItem('tb_theme', theme);

    // Apply global theme classes
    document.documentElement.classList.remove('dark', 'high-contrast');
    if (theme === 'dark') document.documentElement.classList.add('dark');
    if (theme === 'contrast') document.documentElement.classList.add('high-contrast');
  }, [theme]);

  const renderView = () => {
    switch (view) {
      case 'directory':
        return <DirectoryHome onViewPlaceholder={() => goToPlaceholder('directory')} />;
      case 'admin':
        return <AdminDashboard onLogout={() => setView('home')} onViewChange={setView} />;
      case 'test':
        return <TestSuite />;
      case 'docs':
        return <Documentation />;
      case 'placeholder':
        return <Placeholder onBack={() => setView(prevView)} />;
      default:
        return (
          <>
            <section className="relative h-screen flex items-center px-4 overflow-hidden">
              <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                  <source src="https://aucdt.edu.gh/videos/aucdt_video_backgrond.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-techbridge-burgundy/85 via-techbridge-burgundyDark/80 to-techbridge-burgundyDark/95"></div>
              </div>

              <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="text-left text-white space-y-8">
                  <div className="inline-block px-4 py-1 rounded-full bg-techbridge-gold text-techbridge-burgundy-dark text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    Nation Building Hub
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter font-serif text-white">
                    Future of AI <br/><span className="text-techbridge-gold animate-pulse">TechBridge.</span>
                  </h1>
                  <h2 className="text-lg md:text-2xl font-medium text-white/90 max-w-xl leading-relaxed drop-shadow-lg">
                    Pioneering ethical intelligence and creative engineering to <span className="text-techbridge-gold font-bold">Design and Build a Nation.</span>
                  </h2>
                  <div className="flex flex-wrap gap-4 pt-8">
                    <button 
                      onClick={() => setView('directory')}
                      className="bg-techbridge-gold text-techbridge-burgundy-dark px-12 py-5 rounded-2xl font-black hover:bg-white transition-all transform hover:scale-105 shadow-[0_20px_40px_-10px_rgba(212,175,55,0.6)] uppercase tracking-widest text-xs border-2 border-transparent hover:border-techbridge-gold"
                    >
                      Explore Tools
                    </button>
                    <button onClick={() => setView('docs')} className="backdrop-blur-xl bg-white/20 border-2 border-white/40 text-white px-12 py-5 rounded-2xl font-black hover:bg-white/30 transition-all uppercase tracking-widest text-xs shadow-lg">
                      System Docs
                    </button>
                  </div>
                </div>
                <div className="hidden md:block relative">
                   <div className="absolute -inset-4 bg-techbridge-gold/20 blur-3xl rounded-full animate-pulse"></div>
                   <InteractiveShell onViewPlaceholder={() => goToPlaceholder('home')} />
                </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black">Scroll to Begin</span>
                <div className="w-px h-16 bg-gradient-to-b from-techbridge-gold to-transparent"></div>
              </div>
            </section>
            
            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
               <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-3xl p-6 rounded-[3rem] brand-shadow flex flex-wrap gap-6 justify-center border border-white/50 dark:border-slate-700/50">
                  {[
                    { id: 'directory', label: 'Tools Directory', icon: '🚀', color: 'bg-techbridge-burgundy text-white' },
                    { id: 'docs', label: 'System Docs', icon: '📊', color: 'bg-techbridge-goldLight/20 text-techbridge-burgundy' },
                    { id: 'admin', label: 'Admin Node', icon: '🛡️', color: 'bg-techbridge-goldLight/20 text-techbridge-burgundy' },
                    { id: 'test', label: 'Verification', icon: '🧪', color: 'bg-techbridge-goldLight/20 text-techbridge-burgundy' }
                  ].map(btn => (
                    <button 
                      key={btn.id}
                      onClick={() => setView(btn.id as any)} 
                      className={`${btn.color} px-8 py-4 rounded-2xl flex items-center gap-4 text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/5`}
                    >
                      <span className="text-xl">{btn.icon}</span> {btn.label}
                    </button>
                  ))}
               </div>
            </div>

            <section className="py-48 bg-techbridge-cream dark:bg-slate-900 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 relative">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-techbridge-gold/5 blur-3xl rounded-full"></div>
                <div className="flex flex-col items-center mb-32">
                  <span className="text-techbridge-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4">Milestones</span>
                  <h2 className="text-5xl md:text-8xl font-black text-center text-techbridge-burgundy dark:text-white tracking-tighter font-serif">
                    Legacy & <span className="text-techbridge-gold">Global Impact</span>
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                  {[
                    { val: "50+", label: "Faculty Members", desc: "Leading AI researchers across computer science, engineering, and humanities." },
                    { val: "10+", label: "Research Areas", desc: "From foundational AI to applications in business, health, arts, and policy." },
                    { val: "1956", label: "Founding Year", desc: "The 'TechBridge Workshop' is where Artificial Intelligence was named." },
                    { val: "Leaders", label: "Alumni Impact", desc: "Founders of OpenAI, Anthropic, and frontier labs at Google and NVIDIA." }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-12 rounded-[2.5rem] brand-shadow border border-techbridge-beige dark:border-slate-700 hover:shadow-2xl transition-all group hover:-translate-y-4">
                      <div className="text-techbridge-burgundy dark:text-techbridge-gold text-5xl font-black mb-8 group-hover:scale-110 transition-transform origin-left tracking-tighter font-serif">{stat.val}</div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tighter">{stat.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{stat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] bg-techbridge-gold text-techbridge-burgundy px-6 py-3 rounded-xl font-black shadow-2xl border-2 border-techbridge-burgundy"
        >
          Skip to Main Content
        </a>
        <Navbar currentView={view} onViewChange={setView} />
        <main id="main-content" className="outline-none" tabIndex={-1}>{renderView()}</main>
        <footer className="bg-techbridge-burgundyDark text-white py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 p-1">
                   <img src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" alt="TechBridge Logo" className="w-full h-full object-contain" />
                </div>
                <span className="font-black text-2xl tracking-tighter uppercase">AI @ TechBridge</span>
              </div>
              <p className="text-sm text-techbridge-goldLight/70 leading-relaxed font-medium">Designing and building a nation through ethical innovation.</p>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-techbridge-gold">Discovery</h5>
              <button onClick={() => setView('directory')} className="text-gray-300 hover:text-white block mb-2 underline">AI Tools Directory</button>
              <button onClick={() => setView('docs')} className="text-gray-300 hover:text-white block mb-2 underline">System Architecture</button>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-techbridge-gold">Administrative</h5>
              <button onClick={() => setView('admin')} className="text-sm text-gray-300 hover:text-white block mb-2 underline font-bold transition-all">Security Node Access</button>
              <button onClick={() => setView('test')} className="text-sm text-gray-300 hover:text-white block mb-2 underline font-bold transition-all">System Verification</button>
            </div>
            <div>
               <h5 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-techbridge-gold">Campus HQ</h5>
               <p className="text-sm text-gray-400 font-medium">TUC Innovation Campus,<br/>Oyibi, Accra</p>
            </div>
          </div>
        </footer>
        <ResearchAssistant />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
