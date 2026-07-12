import { useEffect, useState } from 'react';
import { ShieldCheck, Sparkles, AlertTriangle, Cpu, GraduationCap, ArrowUpRight, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onStartTour?: () => void;
}

export default function Header({ onStartTour }: HeaderProps) {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/gemini/status')
      .then((res) => res.json())
      .then((data) => setIsApiConnected(!!data.available))
      .catch(() => setIsApiConnected(false));
  }, []);

  return (
    <header id="onboarding-header" className="relative bg-white text-editorial-text-dark py-8 px-6 sm:px-10 rounded-2xl border border-editorial-border shadow-sm mb-6">
      {/* Editorial layout corner detail */}
      <div className="absolute top-0 left-0 w-2 h-full bg-editorial-accent rounded-l-2xl"></div>

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10 pl-2">
        {/* Title and University Metadata */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-editorial-gold text-white text-[10px] font-bold tracking-widest uppercase rounded">
            <GraduationCap size={12} />
            TUC AI Ambassadors
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-editorial-accent leading-tight">
            Participant Workbook <span className="text-editorial-gold font-serif italic font-normal">— Rapid Track</span>
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-editorial-text-light font-mono">
            <span className="font-semibold">Techbridge University College</span>
            <span className="text-editorial-border">•</span>
            <span>ICT Department</span>
            <span className="text-editorial-border">•</span>
            <span className="text-editorial-gold bg-editorial-secondary px-2.5 py-0.5 rounded border border-editorial-border text-[10.5px]">Doc ID: TUC-ICT-TRN-2026-001-P</span>
          </div>
        </div>

        {/* Integration Status Badge */}
        <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-editorial-text-medium font-mono">
            <span className="font-semibold text-editorial-accent">2 Hours</span>
            <span>•</span>
            <span>Hands-On Workspace</span>
          </div>

          {isApiConnected === null ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-editorial-secondary border border-editorial-border text-xs font-mono text-editorial-text-light">
              <span className="w-2 h-2 rounded-full bg-editorial-text-muted animate-pulse"></span>
              Checking connection...
            </div>
          ) : isApiConnected ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E6F4EA] border border-[#B7E1CD] text-xs font-mono text-[#137333]">
              <ShieldCheck size={14} className="text-[#137333]" />
              <span className="font-semibold">Gemini 3.5 Flash Connected</span>
            </div>
          ) : (
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FEF7E0] border border-[#FDE293] text-xs font-mono text-[#B06000] shadow-sm">
                <AlertTriangle size={14} className="text-[#B06000]" />
                <span className="font-semibold">Demo Sandbox Mode</span>
              </div>
              <p className="text-[10px] text-editorial-text-light text-left md:text-right max-w-xs leading-normal">
                To run actual prompts, add your <code className="text-[#B06000] font-mono bg-editorial-secondary px-1 py-0.5 rounded border border-editorial-border/40">GEMINI_API_KEY</code> in the AI Studio Secrets menu.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick intro note */}
      <div className="relative mt-6 pt-5 border-t border-editorial-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-editorial-text-medium leading-relaxed max-w-4xl pl-2">
        <p className="font-sans">
          <strong className="text-editorial-accent font-serif italic text-sm">Welcome, Ambassador!</strong> You don't need to be an AI expert. Your role is to try it first, share what works, and help colleagues past the fear stage. Build three real teaching artefacts—a course outline, an interactive quiz with marking rubric, and a slide deck presentation.
        </p>
        <div className="flex flex-wrap items-center gap-4 shrink-0 font-sans">
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="inline-flex items-center gap-1.5 text-editorial-gold hover:text-editorial-accent font-bold uppercase tracking-wider text-[10px] whitespace-nowrap group border-b-2 border-editorial-gold pb-0.5 transition-colors cursor-pointer"
            >
              <HelpCircle size={12} className="text-editorial-gold" />
              <span>✨ Start Tour</span>
            </button>
          )}
          <a 
            href="#takeaway-templates" 
            onClick={(e) => {
              const el = document.getElementById('takeaway-templates');
              if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-1.5 text-editorial-accent hover:text-editorial-gold font-bold uppercase tracking-wider text-[10px] whitespace-nowrap group border-b-2 border-editorial-accent pb-0.5 transition-colors"
          >
            <span>Prompt Library</span>
            <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </header>
  );
}

