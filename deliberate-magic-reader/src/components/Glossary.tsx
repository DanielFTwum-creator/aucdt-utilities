import React, { useState } from "react";
import { BookOpen, Search, Sparkles, RefreshCw, HelpCircle, Check, BookMarked, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  isAiGenerated?: boolean;
}

const curatingTerms: GlossaryTerm[] = [
  {
    term: "Overnight Delegation",
    definition: "The practice of leaving autonomous agents with full write capabilities to run, refactor, and self-heal codebases overnight.",
    category: "Delegation Systems"
  },
  {
    term: "Delegation Loop",
    definition: "A recursive execution cycle where human intention is mapped down into multi-layered agent actions, running with automated agency.",
    category: "Delegation Systems"
  },
  {
    term: "Tokens",
    definition: "The fundamental currency and feedstock of large language models, representing segments of characters that context windows digest as data.",
    category: "Compute & Metabolism"
  },
  {
    term: "Glucose",
    definition: "A metaphor for compute tokens, representing the core nourishment and metabolic fuel consumed by autonomous routing engines.",
    category: "Compute & Metabolism"
  },
  {
    term: "Context Weightings",
    definition: "The ratio (e.g. A/B/C) balancing structural guidelines, active diagnostics, and conversation histories to optimize model behavior.",
    category: "Compute & Metabolism"
  },
  {
    term: "Sautéed",
    definition: "Refers to context instructions that are refined and condensed via quick, iterative self-correction loops until only the most fragrant constraints remain.",
    category: "Chronicle Style"
  },
  {
    term: "Institutional Memory",
    definition: "The latent, unwritten tribal knowledge and architectural constraints that exist between the commits and design files of static codebases.",
    category: "Organizational Logic"
  },
  {
    term: "Semantic Decay",
    definition: "The natural degradation of code vocabulary and architectural intents over time as creators depart and documentation gathers dust.",
    category: "Organizational Logic"
  },
  {
    term: "Documentation Debt",
    definition: "The mounting cognitive tax on a system when unwritten words and vague naming schemas force agents to spend compute aligning terminology.",
    category: "Organizational Logic"
  },
  {
    term: "Osmosis",
    definition: "The passive, spectator-like absorption of local repo context before an agent initiates active execution pipelines.",
    category: "Agency Phases"
  },
  {
    term: "Osmosing",
    definition: "The state of passive contextual absorption. A spectator reading codebase parameters without initiating active, structured changes.",
    category: "Agency Phases"
  },
  {
    term: "Port Verification",
    definition: "Probing and validating network bindings (like Port 3007) to ensure an active, authorized bridge between intent and live execution.",
    category: "Infrastructure Boundaries"
  },
  {
    term: "Port 3007",
    definition: "The primary container ingress port that serves as the bridge between developers, reverse proxy servers, and agent actions.",
    category: "Infrastructure Boundaries"
  },
  {
    term: "Git",
    definition: "The distributed version control system that documents the history of code modifications, acting as the historical ledger of system progress.",
    category: "Utility Jargon"
  },
  {
    term: "Benchmarks",
    definition: "Standardized tests executed to quantify and compare the latency, token throughput, or execution speed of processing pipelines.",
    category: "Utility Jargon"
  },
  {
    term: "Refactoring",
    definition: "Restructuring existing computer code to improve internal non-functional attributes without changing its external behavior.",
    category: "Core Workflows"
  },
  {
    term: "Custom Hooks",
    definition: "Reusable functional blocks in React that encapsulate custom stateful logic, separating presentation from structural behaviors.",
    category: "Utility Jargon"
  },
  {
    term: "Routing Table",
    definition: "A database table that lists the paths and protocols of a network host, used by the ingress engine to guide transport packets.",
    category: "Infrastructure Boundaries"
  },
  {
    term: "Spaghetti Code",
    definition: "Devoid of modularity or separation of concerns; highly coupled, tangled software files prone to cascade failures.",
    category: "Organizational Logic"
  },
  {
    term: "Circular Dependencies",
    definition: "A situation where two or more software modules refer to each other directly or indirectly, creating compilation blocks.",
    category: "Core Workflows"
  },
  {
    term: "Cognitive Overhead",
    definition: "The mental demand and processing resource required to navigate, decant, or make sense of ambiguous system layouts.",
    category: "Organizational Logic"
  }
];

export default function Glossary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [userCustomTerm, setUserCustomTerm] = useState("");
  const [aiResult, setAiResult] = useState<GlossaryTerm | null>(null);
  const [isDefining, setIsDefining] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [definedHistory, setDefinedHistory] = useState<GlossaryTerm[]>([]);

  // Unique sorted list of categories
  const categories = Array.from(new Set(curatingTerms.map((t) => t.category))).sort();

  // Alphabet letters representing existing terms
  const alphabet = Array.from(
    new Set(curatingTerms.map((t) => t.term.charAt(0).toUpperCase()))
  ).sort();

  // Handler to request AI-generated definition via backend API using gemini-3.5-flash
  const handleAiDefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCustomTerm.trim()) return;

    setIsDefining(true);
    setErrorMsg("");
    setAiResult(null);

    try {
      const response = await fetch("/api/define", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: userCustomTerm,
          context: "Deliberate Magic technical chronicle series"
        })
      });

      const data = await response.json();
      if (data.success) {
        const newTerm: GlossaryTerm = {
          term: data.term,
          definition: data.definition,
          category: data.category || "Generative Jargon",
          isAiGenerated: data.isAiGenerated
        };
        setAiResult(newTerm);
        // Prepend to history so users track their inquiries
        setDefinedHistory((prev) => [newTerm, ...prev.filter((t) => t.term.toLowerCase() !== newTerm.term.toLowerCase())]);
        setUserCustomTerm("");
      } else {
        setErrorMsg(data.error || "Failed to contact glossary engine.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Connection failure while querying the AI Lexicon compiler.");
    } finally {
      setIsDefining(false);
    }
  };

  // Combine curated list and user-queried history
  const combinedTerms = [...definedHistory, ...curatingTerms];

  // Filter terms based on criteria
  const filteredTerms = combinedTerms.filter((termItem) => {
    if (!termItem || typeof termItem.term !== "string" || typeof termItem.definition !== "string") {
      return false;
    }
    const q = (searchQuery || "").toLowerCase();
    const matchesSearch = termItem.term.toLowerCase().includes(q) || 
                          termItem.definition.toLowerCase().includes(q);
    const matchesLetter = selectedLetter ? termItem.term.charAt(0).toUpperCase() === selectedLetter : true;
    const matchesCategory = activeCategory ? termItem.category === activeCategory : true;
    return matchesSearch && matchesLetter && matchesCategory;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLetter(null);
    setActiveCategory(null);
  };

  return (
    <div id="glossary-lexicon-view" className="space-y-6 text-left">
      {/* Overview Intro card */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 dark:bg-zinc-950 dark:border-zinc-850 shadow-sm relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="text-[9px] font-mono tracking-widest bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-semibold px-2.5 py-0.5 rounded-full uppercase select-none">
            Dynamic Chronology Lexicon
          </span>
          <h2 className="font-display font-medium text-lg text-zinc-900 dark:text-zinc-50 leading-snug">
            The Chronicle's System Appendix
          </h2>
          <p className="text-xs text-zinc-500 font-serif leading-relaxed">
            Welcome to the official index of technical jargon and system metaphors woven through the chronicles. 
            Definitions are dynamically retrieved from our <strong>Gemini 3.5 Flash Model</strong> to crystallize meaning on demand, pairing real-world compute protocols with literary software philosophies.
          </p>
        </div>
        <div className="absolute top-0 right-0 h-full w-[40%] bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Term Search & Filtering */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-5 dark:bg-zinc-950 dark:border-zinc-850 shadow-xs">
            
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search definitions, metaphors, or terms..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded border border-zinc-200 dark:border-zinc-800 bg-[#FCFAF7] dark:bg-[#1E1D1C] focus:outline-none focus:border-amber-500 text-zinc-805 dark:text-zinc-205 transition-colors"
                id="glossary-term-search"
              />
            </div>

            {/* Letter Filtering Rolodex */}
            <div className="border-t border-b border-zinc-100 dark:border-zinc-900 py-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">Browse Alphabetical Index</span>
                {(selectedLetter || activeCategory || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="text-[10px] font-mono text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    [Reset Filters]
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                    className={`h-6 w-6 rounded font-mono text-[10px] flex items-center justify-center cursor-pointer transition-all ${
                      selectedLetter === letter
                        ? "bg-amber-600 text-zinc-950 font-bold"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono tracking-wider text-zinc-400 uppercase block">Filter by Domain Scope</span>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                    className={`px-2.5 py-1 rounded text-[10px] font-mono cursor-pointer transition-all border ${
                      activeCategory === cat
                        ? "bg-amber-100/80 border-amber-500/40 text-amber-900 dark:bg-amber-950/40 dark:border-amber-500/40 dark:text-amber-300"
                        : "bg-[#FCFAF7] border-zinc-200 text-zinc-650 hover:bg-zinc-50 dark:bg-[#1C1A19] dark:border-zinc-850 dark:text-zinc-350 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Render List of Index definitions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-450 font-bold flex items-center gap-1">
                <BookMarked className="w-3.5 h-3.5 text-amber-600" /> Compiled Terms ({filteredTerms.length})
              </span>
              <span className="text-[10px] font-mono text-zinc-400">
                Sorted Alphabetically
              </span>
            </div>

            {filteredTerms.length === 0 ? (
              <div className="bg-[#FCFAF7] dark:bg-[#1E1D1C] rounded border border-zinc-200 dark:border-zinc-850 p-8 text-center">
                <HelpCircle className="w-8 h-8 text-zinc-350 mx-auto mb-2 opacity-60" />
                <h4 className="font-serif italic text-sm text-zinc-650 dark:text-zinc-350">No catalog matching requirements</h4>
                <p className="text-[11px] text-zinc-400 mt-1 max-w-sm mx-auto font-sans leading-normal">
                  Try clearing your search filters or input a custom query to let Gemini generate a new term for you.
                </p>
                <button 
                  onClick={clearFilters}
                  className="mt-3.5 px-3 py-1 bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded font-mono text-[10px] uppercase font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer"
                >
                  Clear search parameters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTerms
                  .sort((a,b) => a.term.localeCompare(b.term))
                  .map((t, idx) => (
                    <div 
                      key={idx}
                      className="group border border-black/10 dark:border-white/10 bg-[#FCFAF7] dark:bg-[#1E1D1C] p-4 rounded text-left transition-all duration-300 hover:border-amber-600/35 relative flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-1.5">
                          <h4 className="font-serif font-bold text-xs uppercase tracking-tight text-black dark:text-[#F5F2EF] group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors duration-300">
                            {t.term}
                          </h4>
                          {t.isAiGenerated ? (
                            <span className="text-[8px] font-mono uppercase bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded tracking-widest flex items-center gap-1 select-none">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono tracking-wider font-bold text-zinc-400 uppercase">
                              {t.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-serif text-zinc-650 dark:text-zinc-350 leading-relaxed italic">
                          "{t.definition}"
                        </p>
                      </div>
                      
                      <div className="border-t border-dashed border-black/5 dark:border-white/5 mt-3 pt-2 text-[8px] font-mono text-zinc-400 flex justify-between items-center select-none">
                        <span>VOLUME SOURCE: DELIBERATE MAGIC</span>
                        <span>[CATALOGUE-{idx + 101}]</span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: dynamic Real-Time AI Term Generator */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-zinc-200 rounded-lg p-5 dark:bg-zinc-950 dark:border-zinc-850 shadow-xs text-left">
            <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-500 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> AI Decanting Crucible
            </h4>
            <p className="text-[11px] text-zinc-500 leading-normal font-serif mb-4">
              Enter any technical jargon, phrase, or systems development logic to let the forty-year veteran decant its meaning in the custom prose style of our main essays.
            </p>

            <form onSubmit={handleAiDefine} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-mono uppercase font-bold text-zinc-400 tracking-wider">
                  Target Term
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garbage Collector, Cache Coherence"
                  value={userCustomTerm}
                  onChange={(e) => setUserCustomTerm(e.target.value)}
                  className="w-full text-xs p-2 rounded border border-zinc-200 dark:border-zinc-800 bg-[#FCFAF7] dark:bg-[#1E1D1C] focus:outline-none focus:border-amber-500 text-zinc-900 dark:text-stone-100"
                  disabled={isDefining}
                />
              </div>

              <button
                type="submit"
                disabled={isDefining || !userCustomTerm.trim()}
                className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-100 dark:disabled:bg-zinc-900 disabled:text-zinc-400 text-zinc-950 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isDefining ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Decanting Prose...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Define with AI</span>
                  </>
                )}
              </button>
            </form>

            {errorMsg && (
              <div className="mt-3.5 p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 text-[10px] font-mono text-red-650 dark:text-red-400 rounded">
                ERROR: {errorMsg}
              </div>
            )}

            {/* Generated results container with slide effect */}
            {aiResult && (
              <div className="mt-5 border-t border-zinc-150 dark:border-zinc-850 pt-4 space-y-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Compilation Successful
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 select-none">
                    Gemini 3.5
                  </span>
                </div>

                <div className="p-3 bg-amber-50/30 dark:bg-amber-950/10 border border-amber-500/25 rounded space-y-2">
                  <span className="text-[8px] font-mono font-bold tracking-wider uppercase text-amber-700 dark:text-amber-400">
                    {aiResult.term}
                  </span>
                  <p className="text-[11px] font-serif italic text-zinc-750 dark:text-zinc-350 leading-relaxed">
                    "{aiResult.definition}"
                  </p>
                </div>
                <p className="text-[9px] font-mono text-zinc-400 text-right italic">
                  Term successfully compiled and added to Appendix index column.
                </p>
              </div>
            )}
          </div>

          {/* Quick guide cards in side column */}
          <div className="bg-[#FCFAF7] dark:bg-[#1E1D1C] rounded-lg p-4 border border-zinc-200 dark:border-zinc-850 text-left">
            <span className="text-[8px] font-mono uppercase bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 font-bold px-2 py-0.5 rounded tracking-wider block mb-2.5 w-max">
              Metabolism Concept Guide
            </span>
            <p className="text-[11px] text-zinc-500 leading-relaxed font-serif">
              Our writer equates compute to biological processes: **Tokens** are **Glucose** that provide cognitive calories, and the model's instruction sets must be **Sautéed** so they caramelized into rich operation reducers. Hover over these terms directly in active chapters to inspect details instantly.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
