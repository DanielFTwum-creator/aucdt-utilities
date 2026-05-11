import React, { ReactNode, useState, useEffect } from 'react';
import { ThemeSwitcher, Theme } from './ui/ThemeSwitcher';
import { Tooltip } from './ui/Tooltip';
import { Share2, Download, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  onAdminClick: () => void;
}

export const Layout: React.FC<Props> = ({ children, theme, setTheme, onAdminClick }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (navigator.share) {
      setCanShare(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Techbridge Portal',
        text: 'Scholarship Bond Agreement Portal',
        url: window.location.href,
      });
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-tuc-cream dark:bg-tuc-ink text-tuc-ink dark:text-tuc-cream relative font-body selection:bg-tuc-gold/30 transition-colors duration-500">
      
      {/* Top Gold Accent Bar */}
      <div className="h-1 w-full bg-tuc-gold fixed top-0 z-50 shadow-[0_0_15px_rgba(200,168,75,0.3)]"></div>

      {/* Masthead */}
      <header className="pt-12 pb-8 px-6 border-b border-tuc-ink/10 dark:border-tuc-gold/20 relative z-10 animate-fade-down transition-colors duration-500 bg-gradient-to-b from-white/5 to-transparent dark:from-tuc-gold/5 dark:to-transparent shadow-sm">
        <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-center px-6">
            {/* Left: Seal */}
            <div className="col-span-1 md:col-span-3 flex justify-center md:justify-start">
                 <img 
                   src="https://techbridge.edu.gh/static/TUC_LOGO_1.png" 
                   alt="Techbridge Crest" 
                   className="h-24 w-auto opacity-90 mix-blend-multiply dark:mix-blend-screen filter contrast-125" 
                 />
            </div>
            
            {/* Center: Wordmark */}
            <div className="col-span-1 md:col-span-6 text-center">
                <h1 className="font-display font-black text-5xl md:text-7xl tracking-tight text-tuc-ink dark:text-white uppercase leading-none mb-4 drop-shadow-lg transition-colors duration-500">
                    Techbridge
                </h1>
                <div className="flex flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-4">
                        <span className="h-px w-12 bg-gradient-to-r from-transparent via-tuc-gold to-transparent opacity-60"></span>
                        <span className="font-display italic text-tuc-gold text-2xl tracking-wide">University College</span>
                        <span className="h-px w-12 bg-gradient-to-r from-transparent via-tuc-gold to-transparent opacity-60"></span>
                    </div>
                    <span className="font-label text-tuc-gold/60 text-xs tracking-[0.3em] uppercase">
                        Formerly AsanSka University College of Design and Technology (AUCDT)
                    </span>
                </div>
            </div>

            {/* Right: Issue Badge / Meta */}
            <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-end text-right space-y-4">
                <div className="border border-tuc-gold/30 p-3 px-5 rounded-sm bg-tuc-gold/5 backdrop-blur-sm">
                    <span className="block font-label text-tuc-gold tracking-widest-xl text-xs mb-1">Scholarship</span>
                    <span className="block font-display font-bold text-tuc-ink dark:text-white text-3xl leading-none transition-colors duration-500">2026</span>
                </div>
                
                {/* Actions Row */}
                <div className="flex items-center gap-4">
                   {canShare && (
                     <Tooltip content="Share Portal">
                       <button onClick={handleShare} className="text-tuc-gold/60 hover:text-tuc-gold transition-colors p-2 hover:bg-tuc-gold/10 rounded-full">
                         <Share2 size={18} />
                       </button>
                     </Tooltip>
                   )}
                   {isInstallable && (
                     <Tooltip content="Install App">
                       <button onClick={handleInstallClick} className="text-tuc-gold/60 hover:text-tuc-gold transition-colors p-2 hover:bg-tuc-gold/10 rounded-full">
                         <Download size={18} />
                       </button>
                     </Tooltip>
                   )}
                   <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
                </div>
            </div>
        </div>
      </header>
      
      {/* Main Content Area - Editorial Grid */}
      <main className="flex-grow w-full max-w-[1800px] mx-auto px-6 py-16 relative z-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {/* Ghost Watermark */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-[50vw] text-tuc-gold opacity-[0.02] pointer-events-none select-none z-0 leading-none">
          T
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer Bar */}
      <footer className="mt-auto border-t border-tuc-ink/10 dark:border-tuc-rule bg-tuc-cream dark:bg-tuc-ink py-12 relative animate-fade-up transition-colors duration-500" style={{ animationDelay: '0.4s' }}>
         <div className="absolute bottom-0 left-0 w-full h-2 bg-tuc-gold shadow-[0_0_20px_rgba(200,168,75,0.4)]"></div>
         <div className="max-w-[1800px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
                <p className="font-display italic text-tuc-gold text-2xl tracking-wide">"Design and Build a Nation"</p>
                <p className="font-body text-tuc-gold/40 text-sm">Techbridge University College • Accra, Ghana</p>
            </div>
            
            <div className="flex items-center gap-8 font-meta text-xs text-tuc-gold/60 tracking-widest uppercase">
                <span className="flex items-center gap-2 px-3 py-1 border border-tuc-gold/20 rounded-full">
                  <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                  System Operational
                </span>
                <span>© {new Date().getFullYear()} TUC</span>
                <Tooltip content="Administrative & Support Access">
                  <button 
                    onClick={onAdminClick} 
                    className="hover:text-tuc-ink dark:hover:text-white transition-colors flex items-center gap-2 group px-3 py-1 border border-transparent hover:border-tuc-gold/30 rounded-full"
                  >
                    <ShieldCheck size={14} className="group-hover:text-tuc-gold transition-colors" />
                    Staff Access
                  </button>
                </Tooltip>
            </div>
         </div>
      </footer>
    </div>
  );
};
