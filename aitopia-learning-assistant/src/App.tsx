import React, { useState } from "react";
import SyllabusViewer from "./components/SyllabusViewer";
import FluteSimulator from "./components/FluteSimulator";
import AITutorAndAnalyzer from "./components/AITutorAndAnalyzer";
import { Sparkles, GraduationCap, Music, Cpu, Terminal, CheckCircle } from "lucide-react";

export default function App() {
  // Toggle between Course Workspace and Dedicated Flute Studio
  const [activeView, setActiveView] = useState<"course" | "flute">("course");

  // Sync state between Video Analyzer and Flute Simulator
  const [fluteAction, setFluteAction] = useState<{ type: string; timestamp: number; extraData?: any } | null>(null);

  const handleSyncWithFlute = (type: string, extraData?: any) => {
    setFluteAction({ type, timestamp: Date.now(), extraData });
    // Smoothly auto-switch to Flute Studio view so user can see visual guidelines
    setActiveView("flute");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 antialiased font-sans">
      
      {/* Top Professional Header Bar */}
      <header className="bg-slate-900 border-b border-slate-850 px-6 py-4 text-white flex items-center justify-between shadow-md relative overflow-hidden shrink-0">
        <div className="absolute right-0 top-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="bg-gradient-to-tr from-amber-500 to-emerald-500 p-2 rounded-xl shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight font-display bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
                AITOPIA
              </h1>
              <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider font-mono">
                Studio v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Course Companion &amp; Ghanaian Atɛntɛbɛn Flute Studio
            </p>
          </div>
        </div>

        {/* Apprentice Status / User Metadata */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[11px] font-bold text-slate-200">Daniel Twum</span>
            <span className="text-[9px] text-slate-400 font-mono">daniel.twum@techbridge.edu.gh</span>
          </div>
          <div className="w-9 h-9 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400 shadow-inner">
            DT
          </div>
        </div>
      </header>

      {/* Segmented Workspace Toggle Bar */}
      <div className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 shadow-xs relative z-20">
        <div className="flex items-center gap-3">
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 font-mono select-none">Select App:</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-inner">
            <button
              onClick={() => setActiveView("course")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-250 flex items-center gap-2 cursor-pointer ${
                activeView === "course"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${activeView === "course" ? "text-amber-400 animate-pulse" : "text-slate-400"}`} />
              <span>AI Academy &amp; Syllabus</span>
            </button>
            <button
              onClick={() => setActiveView("flute")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-250 flex items-center gap-2 cursor-pointer ${
                activeView === "flute"
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60"
              }`}
            >
              <Music className={`w-4 h-4 ${activeView === "flute" ? "text-emerald-400 animate-pulse" : "text-slate-400"}`} />
              <span>Atɛntɛbɛn Flute Studio</span>
            </button>
          </div>
        </div>
        
        {/* Helper info or active view metadata */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className={`w-2 h-2 rounded-full animate-pulse ${activeView === "course" ? "bg-amber-400" : "bg-emerald-500"}`}></span>
          <span>
            {activeView === "course" 
              ? "Syllabus, 14-Week Course Roadmap & AI Tutor Study Workspace" 
              : "Full-Screen Interactive Flute Simulator, Fingering Cues & Trainer Active"}
          </span>
        </div>
      </div>

      {/* Main Grid Content Area */}
      <main className="flex-1 p-6 overflow-hidden min-h-0">
        <div className="max-w-7xl mx-auto h-full min-h-0">
          
          {activeView === "course" ? (
            /* Mode 1: Course Workspace (Syllabus and AI Tutor side-by-side) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 animate-fade-in">
              {/* Left: Weekly Syllabus (Span 6) */}
              <section className="lg:col-span-6 h-full flex flex-col min-h-0">
                <div className="flex-1 h-full min-h-0">
                  <SyllabusViewer />
                </div>
              </section>

              {/* Right: AI Tutor & Video Analyzer (Span 6) */}
              <section className="lg:col-span-6 h-full flex flex-col min-h-0">
                <div className="flex-1 h-full min-h-0">
                  <AITutorAndAnalyzer onSyncWithFlute={handleSyncWithFlute} />
                </div>
              </section>
            </div>
          ) : (
            /* Mode 2: Dedicated Immersive Atɛntɛbɛn Flute Studio */
            <div className="h-full min-h-0 overflow-y-auto pr-1 animate-fade-in flex flex-col justify-start">
              <div className="w-full">
                <FluteSimulator fluteAction={fluteAction} />
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer Meta Details */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-center text-[10px] text-slate-400 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Formative portfolio-based learning actively logged in Ghana local time</span>
        </div>
        <div className="font-mono">
          © 2026 TechBridge AI Academy • Blended 14-Week Cohort
        </div>
      </footer>

    </div>
  );
}
