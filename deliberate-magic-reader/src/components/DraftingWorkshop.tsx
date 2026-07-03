import React, { useState } from "react";
import { Sparkles, Sliders, Play, Save, RotateCcw, PenTool, Check, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Essay } from "../data/essays";

interface DraftingWorkshopProps {
  onAddCustomEssay: (newEssay: Essay) => void;
}

export default function DraftingWorkshop({ onAddCustomEssay }: DraftingWorkshopProps) {
  const [userPrompt, setUserPrompt] = useState("");
  const [statusWord, setStatusWord] = useState("Befuddling");
  
  // Custom semantic engine sliders for literary immersion
  const [delegationLevel, setDelegationLevel] = useState(85);
  const [sauteLevel, setSauteLevel] = useState(70);
  const [memoryCohesion, setMemoryCohesion] = useState(90);
  const [debtClearance, setDebtClearance] = useState(60);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState("");
  const [draftedEssay, setDraftedEssay] = useState<Essay | null>(null);
  const [hasSaved, setHasSaved] = useState(false);
  const [draftError, setDraftError] = useState<string | null>(null);

  const loadingPhrases = [
    "Sautéing the surrounding context glucose...",
    "Rebalancing the A/B/C core weightings...",
    "Crawling institutional memory files for Befuddlement...",
    "Clearance passes over documentation debt queues...",
    "Drafting deliberate technical prose on port 3007...",
    "Refactoring paragraphs for poetic structural flow..."
  ];

  const handleDraft = async () => {
    setIsLoading(true);
    setHasSaved(false);
    setDraftError(null);
    setDraftedEssay(null);
    
    // Cycle loading phrases for immersion
    let phraseIdx = 0;
    setLoadingPhrase(loadingPhrases[0]);
    const phraseInterval = setInterval(() => {
      phraseIdx = (phraseIdx + 1) % loadingPhrases.length;
      setLoadingPhrase(loadingPhrases[phraseIdx]);
    }, 1500);

    // Form perspective components based on slider states
    const perspectives = [
      `Compute Delegation level calibrated at ${delegationLevel}% autonomy`,
      `Context Sauté caramelized at ${sauteLevel}% operational reduction`,
      `Institutional Memory test scoring ${memoryCohesion}% cohesion`,
      `Documentation Debt reduction pipeline running at ${debtClearance}% efficiency`
    ];

    try {
      const response = await fetch("/api/generate-part-6", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userPrompt,
          perspectiveList: perspectives,
          statusWordSelection: statusWord
        }),
      });

      const data = await response.json();
      clearInterval(phraseInterval);

      if (data.success && data.essay) {
        const essayObj: Essay = {
          id: Date.now(), // Unique ID
          part: 6,
          title: data.essay.title || "The Befuddlement of Scale",
          theme: data.essay.snippet || "Reconciling rapid automation with human pace",
          statusWord: data.essay.statusWord || statusWord,
          publishDate: data.essay.publishDate || "May 20, 2026",
          snippet: data.essay.snippet || "A custom co-written addition to the essay series.",
          content: data.essay.content || "",
          screenshotsDescription: data.essay.screenshotsDescription || "A visual representation of the drafted cognitive structures."
        };
        setDraftedEssay(essayObj);
      } else {
        setDraftError(data.error || "Unknown server error");
      }
    } catch (err: any) {
      setDraftError(err.message || "Connection failure while querying the AI Lexicon compiler.");
      clearInterval(phraseInterval);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (draftedEssay) {
      onAddCustomEssay(draftedEssay);
      setHasSaved(true);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 dark:bg-zinc-950 dark:border-zinc-850 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Slider & Custom Outline Settings */}
        <div className="flex-1 space-y-5 lg:max-w-md border-b lg:border-b-0 lg:border-r border-zinc-150 pb-5 lg:pb-0 lg:pr-6 dark:border-zinc-850">
          <div>
            <h3 className="font-display font-bold text-lg text-zinc-904 dark:text-zinc-100 flex items-center gap-1.5">
              <PenTool className="w-5 h-5 text-amber-500" /> Part 6 Drafting Pavilion
            </h3>
            <p className="text-xs text-zinc-500 font-serif leading-relaxed mt-1">
              Co-write the final chapter with Gemini. Adjust the sliders to alter the cognitive context parameters and tone matching the entire chronicle.
            </p>
          </div>

          {/* Semantic Sliders */}
          <div className="space-y-3.5 bg-zinc-50/50 dark:bg-zinc-900/10 p-3.5 rounded border border-zinc-150/50 dark:border-zinc-850/50">
            <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold text-zinc-400 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Semantic Context Scales
            </h4>

            {/* Slider 1 */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-zinc-550 dark:text-zinc-400 mb-1">
                <span>Autonomous Delegation</span>
                <span className="font-mono text-amber-600 font-bold">{delegationLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={delegationLevel}
                onChange={(e) => setDelegationLevel(Number(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
            </div>

            {/* Slider 2 */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-zinc-550 dark:text-zinc-400 mb-1">
                <span>Context Sauté Intensity</span>
                <span className="font-mono text-amber-600 font-bold">{sauteLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sauteLevel}
                onChange={(e) => setSauteLevel(Number(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
            </div>

            {/* Slider 3 */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-zinc-550 dark:text-zinc-400 mb-1">
                <span>Memory Cohesion Index</span>
                <span className="font-mono text-amber-600 font-bold">{memoryCohesion}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={memoryCohesion}
                onChange={(e) => setMemoryCohesion(Number(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
            </div>

            {/* Slider 4 */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-zinc-550 dark:text-zinc-400 mb-1">
                <span>Docs Debt Clearance</span>
                <span className="font-mono text-amber-600 font-bold">{debtClearance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={debtClearance}
                onChange={(e) => setDebtClearance(Number(e.target.value))}
                className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Seed Input & Configuration */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block mb-1">Custom Theme Seed</label>
              <textarea
                placeholder="e.g., Re-engineering overnight delegation, the psychological weight of perfect machine logic, or the final handshakes on port 3007."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full text-xs font-sans rounded border border-zinc-250 p-2.5 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-150 h-20 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider block mb-1">Elected Status Word</label>
              <select
                value={statusWord}
                onChange={(e) => setStatusWord(e.target.value)}
                className="w-full text-xs rounded border border-zinc-250 p-2 focus:outline-none dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-150 font-mono"
              >
                <option value="Befuddling">Befuddling (Recommended - Part 1 link)</option>
                <option value="Embodied">Embodied</option>
                <option value="Transcendental">Transcendental</option>
                <option value="Disoriented">Disoriented</option>
                <option value="Interfaced">Interfaced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleDraft}
            disabled={isLoading}
            className="w-full cursor-pointer py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-50 rounded text-xs tracking-wider border border-zinc-805 hover:cursor-pointer transition-all uppercase font-medium flex items-center justify-center space-x-1.5 dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-950 dark:border-white"
          >
            <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{isLoading ? "DRAFTING..." : "COMPILE DRAFT"}</span>
          </button>
        </div>

        {/* Dynamic Display Board */}
        <div className="flex-1 flex flex-col justify-between min-h-[400px] border border-zinc-200/60 rounded-lg p-5 bg-zinc-50/20 dark:border-zinc-850 dark:bg-zinc-950/20 relative">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                className="flex-1 flex flex-col items-center justify-center space-y-4 text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                  <Sparkles className="w-5 h-5 text-amber-550 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-mono text-zinc-650 dark:text-zinc-300 font-semibold">{loadingPhrase}</p>
                  <p className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase animate-pulse">Running server-side inference on Gemini 3.5 Flash</p>
                </div>
              </motion.div>
            ) : draftedEssay ? (
              <motion.div
                key="result"
                className="flex-1 flex flex-col space-y-4"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Essay Header Info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 h-auto dark:border-zinc-850">
                  <div>
                    <span className="text-[9px] font-mono bg-amber-50 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/40 px-2.5 py-0.5 rounded-full uppercase tracking-widest font-semibold mr-2 select-none">
                      PART {draftedEssay.part} Draft
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Word: <span className="font-bold underline text-zinc-650 dark:text-zinc-250">{draftedEssay.statusWord}</span></span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveDraft}
                      disabled={hasSaved}
                      className={`px-3 py-1.5 rounded text-[11px] font-mono tracking-wider flex items-center space-x-1.5 transition-all ${
                        hasSaved
                          ? "bg-emerald-50 border border-emerald-250 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900"
                          : "bg-zinc-900 text-white hover:bg-zinc-850 dark:bg-zinc-100 dark:text-zinc-950 border border-transparent hover:scale-102 cursor-pointer"
                      }`}
                    >
                      {hasSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      <span>{hasSaved ? "PUBLISHED TO CHRONICLE" : "APPEND TO CHRONICLE"}</span>
                    </button>
                    
                    <button
                      onClick={() => setDraftedEssay(null)}
                      className="p-1.5 border border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-700 transition-colors"
                      title="Discard layout"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4 pr-1 scrollbar-thin">
                  <h3 className="font-display font-black text-xl text-zinc-901 dark:text-zinc-50 uppercase tracking-tight leading-snug">
                    {draftedEssay.title}
                  </h3>
                  <p className="font-serif italic text-xs text-zinc-500 block">
                    Published {draftedEssay.publishDate} — "{draftedEssay.snippet}"
                  </p>
                  
                  {/* Styled body renderer */}
                  <div className="text-xs text-zinc-700 dark:text-zinc-300 font-serif leading-relaxed space-y-3 whitespace-pre-wrap selection:bg-amber-100">
                    {draftedEssay.content || "Draft rendering failed."}
                  </div>
                  
                  {/* Screenshots descriptions display */}
                  {draftedEssay.screenshotsDescription && (
                    <div className="p-3 bg-amber-50/30 border border-amber-200/30 rounded dark:bg-amber-970/10 dark:border-amber-900/30">
                      <span className="text-[9px] font-mono text-amber-600 block uppercase tracking-wider font-semibold mb-1">
                        Proposed System Illustration
                      </span>
                      <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 leading-normal italic">
                        "{draftedEssay.screenshotsDescription}"
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : draftError ? (
              <motion.div
                key="error"
                className="flex-1 flex flex-col items-center justify-center text-center py-10 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 rounded-full border border-red-200 dark:border-red-900/40">
                  <RotateCcw className="w-6 h-6 animate-pulse text-rose-500" />
                </div>
                <div className="space-y-2 max-w-sm">
                  <p className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest font-mono">Drafting Error</p>
                  <p className="text-[11px] font-mono text-zinc-650 dark:text-zinc-400 bg-black/10 dark:bg-white/5 p-3.5 rounded border border-black/10 dark:border-white/10 leading-relaxed text-left max-h-[160px] overflow-y-auto">
                    {draftError}
                  </p>
                  {draftError.includes("not configured") && (
                    <p className="text-[10px] text-zinc-500 font-sans leading-relaxed py-1">
                      💡 <strong>AI relay unavailable:</strong> the server's WMS relay credential is not configured. Contact the administrator.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setDraftError(null);
                    handleDraft();
                  }}
                  className="px-4 py-1.5 bg-zinc-900 dark:bg-[#FCFAF7] dark:text-zinc-950 text-white rounded font-mono text-[9px] uppercase font-bold tracking-widest cursor-pointer hover:bg-zinc-800 dark:hover:bg-white transition-all"
                >
                  Retry Compilation
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="flex-1 flex flex-col items-center justify-center text-center py-20 text-zinc-400 space-y-3 select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="p-3 bg-zinc-100 dark:bg-zinc-900 text-zinc-450 dark:text-zinc-605 rounded-full border border-zinc-200/65 dark:border-zinc-850">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-350 font-display uppercase tracking-wider">Canvas is vacant</p>
                  <p className="text-[11px] font-serif leading-relaxed text-zinc-500">
                    Configure your constraints and click **Compile Draft** in the auxiliary panel to generate your bespoke article using Gemini AI.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
