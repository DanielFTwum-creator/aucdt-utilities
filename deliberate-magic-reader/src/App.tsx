import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import EssayCard from "./components/EssayCard";
import EssayReader from "./components/EssayReader";
import TelemetryConsole from "./components/TelemetryConsole";
import DraftingWorkshop from "./components/DraftingWorkshop";
import Glossary from "./components/Glossary";
import { essays as baseEssays, Essay } from "./data/essays";
import { BookOpen, Terminal, Sparkles, Sun, Moon, Database, ChevronLeft, Calendar, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [essays, setEssays] = useState<Essay[]>(() => {
    // Attempt local storage recall
    const stored = localStorage.getItem("deliberate_magic_chronicles");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return baseEssays;
      }
    }
    return baseEssays;
  });

  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);
  const [activeTab, setActiveTab] = useState<"archives" | "draft" | "telemetry" | "glossary">("archives");
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // Save changes to local storage when new drafts are appended
  useEffect(() => {
    localStorage.setItem("deliberate_magic_chronicles", JSON.stringify(essays));
  }, [essays]);

  // Handle dark mode DOM modifications
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  const handleAddNewEssay = (newEssay: Essay) => {
    // Support appending custom compiled Part 6 to our chronicle list
    setEssays((prev) => {
      // Avoid duplicates based on title
      const found = prev.find((e) => e.title.toLowerCase() === newEssay.title.toLowerCase());
      if (found) return prev;
      return [...prev, newEssay];
    });
    // Set view to newly published article in archives!
    setSelectedEssay(newEssay);
    setActiveTab("archives");
  };

  const navigateToEssay = (essay: Essay) => {
    setSelectedEssay(essay);
    setActiveTab("archives");
  };

  // Safe navigation inside reader views
  const handleNextEssay = () => {
    if (!selectedEssay) return;
    const sorted = [...essays].sort((a, b) => a.part - b.part);
    const index = sorted.findIndex((e) => e.id === selectedEssay.id);
    if (index >= 0 && index < sorted.length - 1) {
      setSelectedEssay(sorted[index + 1]);
    }
  };

  const handlePrevEssay = () => {
    if (!selectedEssay) return;
    const sorted = [...essays].sort((a, b) => a.part - b.part);
    const index = sorted.findIndex((e) => e.id === selectedEssay.id);
    if (index > 0) {
      setSelectedEssay(sorted[index - 1]);
    }
  };

  return (
    <div className={`min-h-screen bg-[#F9F7F4] text-[#1A1A1A] border-[16px] border-[#F2EEE9] transition-colors duration-300 dark:bg-[#121110] dark:text-[#E2DFDA] dark:border-[#222120] flex flex-col font-sans selection:bg-amber-100 dark:selection:bg-amber-950/40`}>
      {/* Header element */}
      <Header />

      {/* Main Container Wrapper */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col space-y-6">
        {/* Navigation Tabs and Style Toggles */}
        <div className="flex flex-wrap justify-between items-center gap-3.5 border-b border-black/10 pb-3 dark:border-white/10">
          <div className="flex flex-wrap gap-1 bg-[#F2EEE9] dark:bg-[#222120] p-1 rounded border border-black/10 dark:border-white/10">
            {/* Tab 1 */}
            <button
              onClick={() => {
                setActiveTab("archives");
                setSelectedEssay(null);
              }}
              className={`px-4 py-2 min-h-[44px] rounded font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === "archives" && !selectedEssay
                  ? "bg-[#FCFAF7] border border-black/15 text-black shadow-xs dark:bg-[#1E1D1C] dark:border-white/15 dark:text-white"
                  : "text-zinc-650 hover:text-black dark:text-zinc-450 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Chronicle Index</span>
            </button>

            {/* Tab 2 */}
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-4 py-2 min-h-[44px] rounded font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === "draft"
                  ? "bg-[#FCFAF7] border border-black/15 text-black shadow-xs dark:bg-[#1E1D1C] dark:border-white/15 dark:text-white"
                  : "text-zinc-650 hover:text-black dark:text-zinc-450 dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Part 6 Draft board</span>
            </button>

            {/* Tab 3 */}
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`px-4 py-2 min-h-[44px] rounded font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === "telemetry"
                  ? "bg-[#FCFAF7] border border-black/15 text-black shadow-xs dark:bg-[#1E1D1C] dark:border-white/15 dark:text-white"
                  : "text-zinc-650 hover:text-black dark:text-zinc-450 dark:hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-600" />
              <span>Ingress Diagnostics</span>
            </button>

            {/* Tab 4 */}
            <button
              onClick={() => {
                setActiveTab("glossary");
                setSelectedEssay(null);
              }}
              className={`px-4 py-2 min-h-[44px] rounded font-serif font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === "glossary"
                  ? "bg-[#FCFAF7] border border-black/15 text-black shadow-xs dark:bg-[#1E1D1C] dark:border-white/15 dark:text-white"
                  : "text-zinc-650 hover:text-black dark:text-zinc-450 dark:hover:text-white"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Glossary Log</span>
            </button>
          </div>

          {/* Theme & Actions Side widgets */}
          <div className="flex items-center space-x-3 bg-[#F2EEE9] dark:bg-[#222120] px-3 py-1.5 rounded border border-black/10 dark:border-white/10">
            {/* Theme mode button */}
            <button
              onClick={() => setThemeMode(themeMode === "light" ? "dark" : "light")}
              className="p-2 min-h-[44px] flex items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5 text-zinc-550 dark:text-zinc-450 transition-all cursor-pointer"
              title="Toggle editorial light/dark canvas theme"
              id="theme-toggle-btn"
            >
              {themeMode === "light" ? <Moon className="w-4 h-4 text-zinc-700" /> : <Sun className="w-4 h-4 text-amber-500 animate-pulse" />}
            </button>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-650 dark:text-zinc-400 tracking-widest flex items-center gap-1">
              <Database className="w-3 h-3 text-zinc-500" /> Index: {essays.length} Chapters
            </span>
          </div>
        </div>

        {/* Tab / View Router Screen */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === "archives" && (
              <motion.div
                key="archives"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {selectedEssay ? (
                  // Expanded Reader Mode
                  <EssayReader
                    essay={selectedEssay}
                    onBack={() => setSelectedEssay(null)}
                    allEssays={essays}
                    onSelectEssay={setSelectedEssay}
                    onNext={
                      [...essays].sort((a,b)=>a.part-b.part).findIndex((e)=>e.id===selectedEssay.id) < essays.length - 1
                        ? handleNextEssay
                        : undefined
                    }
                    onPrev={
                      [...essays].sort((a,b)=>a.part-b.part).findIndex((e)=>e.id===selectedEssay.id) > 0
                        ? handlePrevEssay
                        : undefined
                    }
                  />
                ) : (
                  // Grid List Overview Interface
                  <div className="space-y-6">
                    {/* Welcome Banner Panel */}
                    <div className="bg-white border border-zinc-200 rounded-lg p-5 dark:bg-zinc-950 dark:border-zinc-850 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
                      <div className="space-y-2 max-w-xl z-10 text-left">
                        <span className="text-[9px] font-mono tracking-widest bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-semibold px-2.5 py-0.5 rounded-full uppercase select-none">
                          Deliberate Chronicles Overview
                        </span>
                        <h2 className="font-display font-medium text-lg text-zinc-900 dark:text-zinc-50 leading-snug">
                          Welcome to the Deliberate Magic Reader
                        </h2>
                        <p className="text-xs text-zinc-500 font-serif leading-relaxed">
                          This platform archives our five sequential tech-industry essays on engineering agency. Part 1 introduced the concept of nocturnal delegation. Part 5 verified the wide-open status of Port 3007. Dive in or compile custom draft extensions via our dedicated workshops.
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
                        <button
                          onClick={() => navigateToEssay(essays[0])}
                          className="px-4 py-2 min-h-[44px] cursor-pointer border border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded font-display text-xs font-bold uppercase tracking-wider transition-all text-center"
                        >
                          Start at Part 1
                        </button>
                        <button
                          onClick={() => setActiveTab("draft")}
                          className="px-4 py-2 min-h-[44px] cursor-pointer bg-amber-600 hover:bg-amber-500 text-zinc-950 rounded font-display text-xs font-bold uppercase tracking-wider transition-all hover:scale-[1.01] text-center"
                        >
                          Co-write Part 6
                        </button>
                      </div>
                    </div>

                    {/* Columns structure: Main grid + spotlight side columns */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Grid cards */}
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...essays]
                          .sort((a, b) => a.part - b.part)
                          .map((essay) => (
                            <EssayCard
                              key={essay.id}
                              essay={essay}
                              isSelected={selectedEssay?.id === essay.id}
                              onSelect={(e) => setSelectedEssay(e)}
                            />
                          ))}
                      </div>

                      {/* Spotlight marginalia sidebar */}
                      <div className="md:col-span-1 space-y-4">
                        <div className="border border-zinc-200 bg-white/40 rounded-lg p-5 dark:border-zinc-850 dark:bg-zinc-950/40 text-left">
                          <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 mb-2 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Chronicle Index Log
                          </h4>
                          <p className="text-[11px] text-zinc-500 leading-normal font-mono mb-4">
                            Trace semantic evolution across consecutive volumes of development. Key words:
                          </p>

                          {/* Interactive list of status words */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-850">
                              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Part 2 status word:</span>
                              <span className="text-amber-600 font-mono font-bold">Sautéed</span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-850">
                              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Part 4 status word:</span>
                              <span className="text-sky-600 font-mono font-bold">Tinkering</span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5 border-b border-zinc-100 dark:border-zinc-850">
                              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Part 5 status word:</span>
                              <span className="text-emerald-600 font-mono font-bold">Osmosing</span>
                            </div>
                            <div className="flex justify-between text-xs py-1.5">
                              <span className="text-zinc-600 dark:text-zinc-400 font-medium">Next proposed part:</span>
                              <span className="text-rose-500 font-mono font-bold">Befuddling</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual diagnostic block */}
                        <div className="border border-zinc-200 bg-zinc-900 border-zinc-800 text-zinc-105 rounded-lg p-5 text-left">
                          <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-amber-500 mb-1 flex items-center gap-1">
                            <Terminal className="w-3.5 h-3.5" /> Ingress Live telemetry
                          </h4>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                            Port 3007 is wide open. Probe diagnostic verification blocks inside console tab.
                          </p>
                          <button
                            onClick={() => setActiveTab("telemetry")}
                            className="mt-3.5 w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 py-1.5 min-h-[44px] flex items-center justify-center rounded font-mono text-[10px] uppercase font-bold tracking-wider text-center cursor-pointer transition-colors"
                          >
                            Launch Console
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "draft" && (
              <motion.div
                key="draft"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
              >
                <DraftingWorkshop onAddCustomEssay={handleAddNewEssay} />
              </motion.div>
            )}

            {activeTab === "telemetry" && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
              >
                <TelemetryConsole />
              </motion.div>
            )}

            {activeTab === "glossary" && (
              <motion.div
                key="glossary"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15 }}
              >
                <Glossary />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Styled Footer Block */}
      <footer className="border-t border-zinc-200 bg-zinc-100/30 py-5 mt-auto dark:border-zinc-850 dark:bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6 text-center select-none flex flex-col sm:flex-row sm:justify-between items-center gap-3 text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
          <span>© Deliberate Magic chronicles 2026</span>
          <span className="lowercase font-serif italic text-zinc-500 tracking-normal text-xs">
            "Engineered deliberately, written thoughtfully."
          </span>
        </div>
      </footer>
    </div>
  );
}
