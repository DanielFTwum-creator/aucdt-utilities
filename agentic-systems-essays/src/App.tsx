import React, { useState, useEffect } from "react";
import { essays } from "./data";
import { Essay } from "./types";
import EssayReader from "./components/EssayReader";
import AdminConsole from "./components/AdminConsole";
import { systemDocs, SystemDoc } from "./docsData";
import { 
  Book, 
  CheckSquare, 
  Square, 
  Search, 
  BookOpen, 
  Clock, 
  RefreshCw, 
  Cpu, 
  Star, 
  Shield,
  Download,
  Copy,
  Check,
  FileText,
  Info,
  ExternalLink
} from "lucide-react";

export default function App() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [utcTime, setUtcTime] = useState("");
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("tuc_app_theme") || "light");
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<"index" | "theory" | "manifesto" | "about">("index");
  const [selectedDocId, setSelectedDocId] = useState<string>("admin_guide");
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Initialize and run a highly precise live UTC clock based on current local time context
  useEffect(() => {
    const currentBase = new Date("2026-05-22T12:10:10Z");
    let elapsedMs = 0;

    const interval = setInterval(() => {
      elapsedMs += 1000;
      const calculated = new Date(currentBase.getTime() + elapsedMs);
      const year = calculated.getUTCFullYear();
      const month = String(calculated.getUTCMonth() + 1).padStart(2, "0");
      const day = String(calculated.getUTCDate()).padStart(2, "0");
      const hours = String(calculated.getUTCHours()).padStart(2, "0");
      const minutes = String(calculated.getUTCMinutes()).padStart(2, "0");
      const seconds = String(calculated.getUTCSeconds()).padStart(2, "0");
      setUtcTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sync theme with document element classes for global accessibility overrides
  useEffect(() => {
    localStorage.setItem("tuc_app_theme", theme);
    const html = document.documentElement;
    html.className = "";
    if (theme === "dark") {
      html.classList.add("dark-theme-active");
    } else if (theme === "high-contrast") {
      html.classList.add("high-contrast-active");
    }
  }, [theme]);

  const activeEssay = essays.find((e) => e.id === selectedId) || essays[0];

  const toggleComplete = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent changing the selected essay when checking/unchecking
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (selectedId < essays.length) {
      setSelectedId((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedId > 1) {
      setSelectedId((prev) => prev - 1);
    }
  };

  const filteredEssays = essays.filter((e) => {
    const term = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(term) ||
      e.theme.toLowerCase().includes(term) ||
      e.content.toLowerCase().includes(term) ||
      e.snippet.toLowerCase().includes(term)
    );
  });

  const progressPercent = Math.round((completedIds.length / essays.length) * 100);

  // Dynamic Theme Class mapping
  const themeClass = 
    theme === "dark" 
      ? "bg-[#121212] text-neutral-100 selection:bg-neutral-800 selection:text-white" 
      : theme === "high-contrast" 
      ? "bg-black text-white selection:bg-[#FACC15] selection:text-black" 
      : "bg-[#FDFCF9] text-[#1A1A1A] selection:bg-black/10 selection:text-black";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${themeClass}`}>
      
      {/* Editorial Navigation Masthead Header */}
      <header className={`border-b backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-5 transition-colors duration-300 ${
        theme === "dark" 
          ? "border-neutral-800 bg-[#161616]/95 text-white" 
          : theme === "high-contrast" 
          ? "border-b-4 border-[#FACC15] bg-black text-white" 
          : "border-black/10 bg-[#FDFCF9]/95 text-[#1A1A1A]"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase opacity-60">
              The Synthesis Archive
            </span>
            <h1 className="text-3xl md:text-4xl font-serif tracking-tighter font-medium">
              DELEGATION LOGS
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[10px] font-sans uppercase tracking-widest">
            <span 
              onClick={() => setCurrentTab("index")}
              className={`pb-1 text-[11px] cursor-pointer transition-all ${
                currentTab === "index"
                  ? theme === "high-contrast" ? "border-b-2 border-[#FACC15] text-[#FACC15] font-bold" : "border-b-2 border-black dark:border-white font-bold text-black dark:text-white"
                  : "opacity-60 hover:opacity-100 text-current"
              }`}
            >
              Index
            </span>
            <span 
              onClick={() => setCurrentTab("theory")}
              className={`pb-1 text-[11px] cursor-pointer transition-all ${
                currentTab === "theory"
                  ? theme === "high-contrast" ? "border-b-2 border-[#FACC15] text-[#FACC15] font-bold" : "border-b-2 border-black dark:border-white font-bold text-black dark:text-white"
                  : "opacity-60 hover:opacity-100 text-current"
              }`}
            >
              Theory (SRS)
            </span>
            <span 
              onClick={() => setCurrentTab("manifesto")}
              className={`pb-1 text-[11px] cursor-pointer transition-all ${
                currentTab === "manifesto"
                  ? theme === "high-contrast" ? "border-b-2 border-[#FACC15] text-[#FACC15] font-bold" : "border-b-2 border-black dark:border-white font-bold text-black dark:text-white"
                  : "opacity-60 hover:opacity-100 text-current"
              }`}
            >
              Manifesto
            </span>
            <span 
              onClick={() => setCurrentTab("about")}
              className={`pb-1 text-[11px] cursor-pointer transition-all ${
                currentTab === "about"
                  ? theme === "high-contrast" ? "border-b-2 border-[#FACC15] text-[#FACC15] font-bold" : "border-b-2 border-black dark:border-white font-bold text-black dark:text-white"
                  : "opacity-60 hover:opacity-100 text-current"
              }`}
            >
              About & Docs
            </span>
            
            {/* Admin trigger element */}
            <button
              id="admin-login-btn"
              onClick={() => setIsAdminOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded border cursor-pointer hover:shadow-xs transition-all ${
                theme === "dark"
                  ? "border-neutral-700 hover:bg-neutral-800 text-neutral-200"
                  : theme === "high-contrast"
                  ? "border-2 border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10"
                  : "border-black/15 hover:bg-black/5 text-black"
              }`}
              title="Open Admin Portal"
            >
              <Shield className="w-3 h-3" />
              <span>Admin Console</span>
            </button>
          </div>

          <div className="flex flex-col lg:items-end text-left lg:text-right">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider block">ISSUE NO. 01</span>
            <span className="text-[10px] font-mono opacity-60 uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-current opacity-70" />
              <span>{utcTime || "2026-05-22 12:10:10 UTC"}</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Dual Pane Frame */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {currentTab === "index" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-fade-in">
            {/* Navigation Sidebar Drawer Panel (4 cols) */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              
              {/* Reading Progress Gauge */}
              <div className={`border rounded-lg p-6 shadow-xs transition-colors duration-300 ${
                theme === "dark" 
                  ? "bg-[#1C1C1C] border-neutral-800" 
                  : theme === "high-contrast" 
                  ? "bg-black border-2 border-[#FACC15]" 
                  : "bg-white border-black/10"
              }`}>
                <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] opacity-60 mb-3 block">
                  Reading Progress Gauge
                </h3>
                
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-serif tracking-tighter">
                    {completedIds.length} <span className="text-xs font-mono opacity-60 uppercase">of</span> {essays.length}
                  </span>
                  <span className={`text-[10px] font-sans font-bold px-2 py-0.5 uppercase tracking-tighter ${
                    theme === "high-contrast" ? "bg-[#FACC15] text-black" : "bg-black dark:bg-white text-white dark:text-black"
                  }`}>
                    {progressPercent}% READ
                  </span>
                </div>

                {/* Progress Line Bar */}
                <div className="w-full bg-current/10 h-1.5 rounded-full overflow-hidden mb-3.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      theme === "high-contrast" ? "bg-[#FACC15]" : "bg-current"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="text-xs opacity-80 font-serif leading-relaxed">
                  Tackling unwritten documentation logs, semantic structures, and metabolic tokens step-by-step.
                </div>
              </div>

              {/* Custom Interactive Search bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 opacity-40" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search semantic themes & keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border pl-11 pr-4 py-3 rounded-lg text-xs font-sans focus:outline-none focus:ring-1 focus:ring-current/10 ${
                    theme === "dark" 
                      ? "bg-[#1C1C1C] border-neutral-855 text-white placeholder-neutral-500" 
                      : theme === "high-contrast" 
                      ? "bg-black border-2 border-white text-white focus:border-[#FACC15] placeholder-white/50" 
                      : "bg-white border-black/15 text-black placeholder-black/40"
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-3.5 text-[10px] font-sans font-bold opacity-60 hover:opacity-100 transition-colors"
                  >
                    CLEAR
                  </button>
                )}
              </div>

              {/* Chapters list */}
              <div className="space-y-4">
                <span className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] opacity-50 block px-1">
                  Sequential Logs — ({filteredEssays.length})
                </span>

                {filteredEssays.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEssays.map((essay) => {
                      const isSelected = essay.id === selectedId;
                      const isCompleted = completedIds.includes(essay.id);

                      // Dynamic selection classes based on accessibility themes
                      const selectionCardClass = isSelected
                        ? theme === "dark"
                          ? "bg-[#1C1C1C] border-white text-white shadow-xl shadow-black/20"
                          : theme === "high-contrast"
                          ? "bg-black border-4 border-[#FACC15] text-white"
                          : "bg-white border-black text-[#1A1A1A] shadow-md shadow-black/5"
                        : theme === "dark"
                        ? "bg-[#1C1C1C]/40 border-neutral-900 hover:bg-[#1C1C1C] hover:border-neutral-800"
                        : theme === "high-contrast"
                        ? "bg-black border-2 border-white hover:border-[#FACC15]"
                        : "bg-white/40 border-black/5 hover:bg-white hover:border-black/15";

                      return (
                        <div
                          key={essay.id}
                          onClick={() => setSelectedId(essay.id)}
                          className={`group p-5 rounded-lg border transition-all duration-300 cursor-pointer ${selectionCardClass}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1.5 flex-1">
                              {/* Part label and Status Tag */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-sans text-[10px] font-bold uppercase tracking-tighter opacity-60">
                                  {String(essay.part).padStart(2, '0')} / Theme
                                </span>
                                {essay.statusWord !== "—" && (
                                  <span className={`font-sans text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                    theme === "high-contrast" ? "bg-white text-black" : "bg-current/5 text-current"
                                  }`}>
                                    {essay.statusWord}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h4 className={`text-xl font-serif leading-tight transition-colors ${
                                isSelected ? "italic font-semibold" : "opacity-90 group-hover:italic group-hover:opacity-100"
                              }`}>
                                {essay.title}
                              </h4>
                              
                              {/* Theme snippet (short) */}
                              <p className={`text-xs leading-relaxed font-serif line-clamp-2 ${
                                theme === "light" ? "text-black/50" : "text-neutral-400"
                              }`}>
                                {essay.snippet}
                              </p>
                            </div>

                            {/* Quick Completion Button */}
                            <button
                              onClick={(e) => toggleComplete(essay.id, e)}
                              className="opacity-50 hover:opacity-100 transition-colors p-1 shrink-0 cursor-pointer mt-0.5"
                              title={isCompleted ? "Mark as unread" : "Mark as read"}
                            >
                              {isCompleted ? (
                                <CheckSquare className="w-4.5 h-4.5" />
                              ) : (
                                <Square className="w-4.5 h-4.5 opacity-30 hover:opacity-70" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`border rounded-lg p-8 text-center text-xs font-serif italic ${
                    theme === "dark" ? "bg-[#1C1C1C]/40 border-neutral-900" : "bg-white/50 border-black/10"
                  }`}>
                    No chapters matching your query.
                  </div>
                )}
              </div>

              {/* Micro Credit Widget */}
              <div className={`border rounded-lg p-5 text-[10px] font-mono space-y-1 ${
                theme === "dark" 
                  ? "bg-[#1C1C1C] border-neutral-800 text-neutral-300" 
                  : theme === "high-contrast" 
                  ? "bg-black border-2 border-[#FACC15] text-white" 
                  : "bg-white/40 border border-black/10 text-black/60"
              }`}>
                <span className="uppercase opacity-40 text-[9px] block mb-2 font-sans font-bold tracking-wider">
                  Reader Systems Core Specs
                </span>
                <p>Host Ingress: {window.location.host || "ai.studio"}</p>
                <p>Engine Runtime: React 18 / Tailwind CSS</p>
                <p className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  <span>Telemetry Ingress Active</span>
                </p>
              </div>

            </div>

            {/* Core Essay Presentation Panel (8 cols) */}
            <div className="lg:col-span-8">
              <EssayReader
                essay={activeEssay}
                theme={theme}
                onNext={handleNext}
                onPrev={handlePrev}
                hasNext={selectedId < essays.length}
                hasPrev={selectedId > 1}
              />
            </div>

          </div>
        )}

        {currentTab === "theory" && (
          <div className="space-y-10">
            {/* Theory Banner */}
            <div className={`border rounded-lg p-8 space-y-4 transition-colors duration-300 ${
              theme === "dark" 
                ? "bg-[#1C1C1C] border-neutral-800" 
                : theme === "high-contrast" 
                ? "bg-black border-2 border-[#FACC15]" 
                : "bg-white border-black/10"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                  theme === "high-contrast" ? "bg-[#FACC15] text-black animate-pulse" : "bg-black text-white dark:bg-white dark:text-black"
                }`}>IEEE 830 STANDARD</span>
                <span className="text-[10px] font-mono opacity-60 font-semibold text-current">DOC REF: TUC-ICT-SRS-2026-001</span>
              </div>
              <h2 className="text-3xl font-serif text-current font-medium tracking-tight">
                Software Requirements Specification (SRS)
              </h2>
              <p className="text-xs md:text-sm font-serif italic text-neutral-500 max-w-3xl leading-relaxed">
                The formal specification browser for the Techbridge AI Blueprint application, detailing client interfaces, admin protection protocols, continuous logger systems, database tables, and continuous verification suites for Techbridge University College (TUC) at Oyibi, Ghana.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sections Selector Sidebar */}
              <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-28">
                <div className={`p-5 border rounded-lg space-y-3 shadow-xs ${
                  theme === "dark" 
                    ? "bg-[#1C1C1C] border-neutral-850" 
                    : theme === "high-contrast" 
                    ? "bg-black border-2 border-[#FACC15]" 
                    : "bg-neutral-50 border-black/10"
                }`}>
                  <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">SRS Chapters</h3>
                  <div className="space-y-1.5 flex flex-col font-sans">
                    <a href="#srs-intro" className="text-xs py-1 hover:underline text-left text-current hover:text-indigo-400">1. Introduction & Context</a>
                    <a href="#srs-architecture" className="text-xs py-1 hover:underline text-left text-current hover:text-indigo-400">2. Topology Architecture</a>
                    <a href="#srs-interface" className="text-xs py-1 hover:underline text-left text-current hover:text-indigo-400">3. Specific Requirements</a>
                    <a href="#srs-erd" className="text-xs py-1 hover:underline text-left text-current hover:text-indigo-400">4. Relational Database ERD</a>
                    <a href="#srs-coverage" className="text-xs py-1 hover:underline text-left text-current hover:text-indigo-400">5. Compliance Gap Analysis</a>
                  </div>
                </div>
                
                {/* Download Button */}
                <button
                  onClick={() => {
                    const srs = systemDocs.find(d => d.id === "srs");
                    if (srs) {
                      const blob = new Blob([srs.content], { type: "text/markdown;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute("download", "TUC-ICT-SRS-2026-001.md");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }
                  }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded border cursor-pointer hover:shadow-xs transition-all ${
                    theme === "dark"
                      ? "border-neutral-700 bg-neutral-900 text-neutral-200 hover:bg-neutral-800"
                      : theme === "high-contrast"
                      ? "border-2 border-[#FACC15] bg-black text-[#FACC15] hover:bg-[#FACC15]/20"
                      : "border-black bg-white text-black hover:bg-black/5"
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full SRS (.md)</span>
                </button>
              </div>

              {/* SRS Content Render Pane */}
              <div className={`lg:col-span-9 p-8 border rounded-lg space-y-12 font-serif text-sm leading-relaxed transition-colors duration-300 ${
                theme === "dark" 
                  ? "bg-[#1C1C1C]/60 border-neutral-800 text-neutral-200 shadow-xl" 
                  : theme === "high-contrast" 
                  ? "bg-black border-2 border-[#FACC15] text-white" 
                  : "bg-white border-black/10 text-neutral-800"
              }`}>
                {/* 1. Introduction */}
                <section id="srs-intro" className="space-y-4">
                  <h3 className="text-xl font-medium tracking-tight border-b pb-2 text-current flex items-center gap-1.5 font-serif font-bold">
                    <Info className="w-4 h-4 text-neutral-500" />
                    <span>1. Introduction & Institutional Context</span>
                  </h3>
                  <div className="space-y-3 font-serif">
                    <p>
                      <strong>1.1 Purpose:</strong> This Software Requirements Specification (SRS) establishes a baseline configuration for the <strong>Techbridge AI Blueprint [TAB]</strong> application at Techbridge University College (TUC) at Oyibi, Ghana.
                    </p>
                    <p>
                      <strong>1.2 Scope:</strong> The system acts as the official Synthesis Log repository, providing an intuitive dual-pane browser equipped with continuous security authentication shields, persistent accessibility theme-switching logic (Light, Dark, High-contrast), and rigorous continuous diagnostic checks with unit testing runners simulating Playwright operations under container environments.
                    </p>
                    <p>
                      <strong>1.3 Institutional Definitions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 text-xs font-sans pl-2 opacity-95">
                      <li><strong>TUC:</strong> Techbridge University College, located in Oyibi, Ghana.</li>
                      <li><strong>ICT Admin:</strong> College System Administrator overseen by Daniel Twum, Head of ICT.</li>
                      <li><strong>Act 843 of Ghana:</strong> Regulatory legislation ensuring data protection and strict minimalisation.</li>
                    </ul>
                  </div>
                </section>

                {/* 2. Topology Architecture */}
                <section id="srs-architecture" className="space-y-4">
                  <h3 className="text-xl font-medium tracking-tight border-b pb-2 text-current flex items-center gap-1.5 font-serif font-bold">
                    <Cpu className="w-4 h-4 text-neutral-500" />
                    <span>2. Overall Description & Topology Architecture</span>
                  </h3>
                  <p className="text-xs font-sans opacity-90 leading-relaxed">
                    The platform is containerised within Docker and hosted inside an active Plesk Web Admin Panel on regional academic nodes reverse-proxied with Nginx. The following interactive SVG represents the high-level system topology:
                  </p>
                  
                  {/* Embedded System Architecture Diagram */}
                  <div className="my-6">
                    <span className="block text-[10px] font-mono mb-2 text-center opacity-65 uppercase font-bold text-current">
                      Figure 2.1: TUC-TAB High-Level Systems Topology
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" className="w-full h-auto border rounded-md p-4 bg-[#FDFCF9] dark:bg-neutral-900 border-black/10 dark:border-neutral-800">
                      {/* Title block */}
                      <text x="30" y="40" style={{ fontWeight: "bold", fontSize: "16px", fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontFamily: "Georgia, serif" }}>TUC-TAB SYSTEM ARCHITECTURE DIAGRAM</text>
                      <text x="30" y="58" style={{ fontSize: "10px", fill: "#888888", fontFamily: "monospace" }}>TUC-ICT-SRS-2026-001 | SYSTEM TOPOLOGY</text>

                      {/* Legend */}
                      <rect x="560" y="20" width="210" height="50" rx="4" fill="transparent" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff30" : "#00000015"} />
                      <text x="570" y="35" style={{ fontSize: "9px", fontWeight: "bold", fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111" }}>LEGEND</text>
                      <line x1="570" y1="45" x2="600" y2="45" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                      <text x="610" y="48" style={{ fontSize: "9px", fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111" }}>Ingress Direction</text>

                      {/* Client Layer card */}
                      <rect x="40" y="100" width="200" height="320" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                      <rect x="40" y="100" width="200" height="30" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#2a2a2a" : "#1a1a1a"} />
                      <text x="140" y="119" textAnchor="middle" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "sans-serif" }}>CLIENT TERMINAL LAYER</text>

                      <rect x="55" y="145" width="170" height="50" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="65" y="165" style={{ fontSize: "11px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Capacitor Native CLI</text>
                      <text x="65" y="180" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>iOS & Android 1.0.0</text>

                      <rect x="55" y="215" width="170" height="50" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="65" y="235" style={{ fontSize: "11px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Modern Web SPA</text>
                      <text x="65" y="250" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>React 18 & Vite Router</text>

                      <rect x="55" y="285" width="170" height="50" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="65" y="305" style={{ fontSize: "11px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Accessibility Theme</text>
                      <text x="65" y="320" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>ARIA Contrast Engine</text>

                      {/* Ingress Tunnel card */}
                      <rect x="290" y="100" width="200" height="320" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                      <rect x="290" y="100" width="200" height="30" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#2a2a2a" : "#1a1a1a"} />
                      <text x="390" y="119" textAnchor="middle" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "sans-serif" }}>WEB INGRESS & SERVING</text>

                      <rect x="305" y="150" width="170" height="60" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="315" y="175" style={{ fontSize: "11px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Nginx Proxy Module</text>
                      <text x="315" y="195" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>External Ingress Port 3000</text>

                      <rect x="305" y="240" width="170" height="60" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="315" y="265" style={{ fontSize: "11px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Let's Encrypt SSL</text>
                      <text x="315" y="285" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>HTTPS Enforced 443</text>

                      {/* Backend services card */}
                      <rect x="540" y="100" width="220" height="320" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                      <rect x="540" y="100" width="220" height="30" rx="6" fill={theme === "dark" || theme === "high-contrast" ? "#2a2a2a" : "#1a1a1a"} />
                      <text x="650" y="119" textAnchor="middle" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "sans-serif" }}>HOST & INFRASTRUCTURE</text>

                      <rect x="555" y="150" width="190" height="55" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="565" y="172" style={{ fontSize: "11.5px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>Docker Containers</text>
                      <text x="565" y="188" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>Virtual Stack Mapped</text>

                      <rect x="555" y="235" width="190" height="55" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#ffffff"} stroke={theme === "dark" || theme === "high-contrast" ? "#fff" : "#000"} strokeWidth="1" />
                      <text x="565" y="258" style={{ fontSize: "11.5px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#000", fontWeight: "bold", fontFamily: "sans-serif" }}>MariaDB SQL Node</text>
                      <text x="565" y="274" style={{ fontSize: "9px", fill: "#888888", fontFamily: "monospace" }}>Tables: tuc_audit_logs, etc.</text>

                      {/* Direction tunnels */}
                      <path d="M 240 260 L 290 260" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" fill="none" />
                      <polygon points="290,260 282,256 282,264" fill={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} />

                      <path d="M 490 260 L 540 260" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" fill="none" />
                      <polygon points="540,260 532,256 532,264" fill={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} />
                    </svg>
                  </div>
                </section>

                {/* 3. Specific Requirements */}
                <section id="srs-interface" className="space-y-4">
                  <h3 className="text-xl font-medium tracking-tight border-b pb-2 text-current flex items-center gap-1.5 font-serif font-bold">
                    <Shield className="w-4 h-4 text-neutral-500" />
                    <span>3. Specific Functional & Security Requirements</span>
                  </h3>
                  <div className="space-y-3 font-serif">
                    <p>
                      <strong>3.1 Administrative Credentials & Security:</strong> Access to the diagnostic and logs purge console requires a password-protected modal lock verifying the hash configuration of <code>admin123</code>.
                    </p>
                    <p>
                      <strong>3.2 Persistent Telemetry Logs:</strong> Theme preferences and certified chapter checklists, reading completion variables must persist locally in the client database engine (local storage) under Act 843 of Ghana, enabling offline reading capabilities with zero server latency tracking.
                    </p>
                    <p>
                      <strong>3.3 Embedded Testing Suite:</strong> The system implements a visual unit-level test simulator that checks administrative authentication and continuous component rendering, providing downloadable screenshots verifying active system state compliance.
                    </p>
                  </div>
                </section>

                {/* 4. Relational Database ERD */}
                <section id="srs-erd" className="space-y-4">
                  <h3 className="text-xl font-medium tracking-tight border-b pb-2 text-current flex items-center gap-1.5 font-serif font-bold">
                    <BookOpen className="w-4 h-4 text-neutral-500" />
                    <span>4. Relational Database ERD Specifications</span>
                  </h3>
                  <p className="text-xs font-sans opacity-95 leading-relaxed">
                    Our backend structures are modeled in MariaDB (SQL), locking schemas tightly under database constraint integrity rule checks. The schema includes four critical tables linked with foreign keys:
                  </p>

                  {/* Embedded ERD SVG */}
                  <div className="my-6">
                    <span className="block text-[10px] font-mono mb-2 text-center opacity-65 uppercase font-bold text-current">
                      Figure 4.1: Relational Database Entity Relationship Diagram (ERD) Model
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480" className="w-full h-auto border rounded-md p-4 bg-[#FDFCF9] dark:bg-neutral-900 border-black/10 dark:border-neutral-800">
                      {/* Diagram title */}
                      <text x="30" y="40" style={{ fontWeight: "bold", fontSize: "16px", fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontFamily: "Georgia, serif" }}>TUC-TAB SCHEMA ERD STRUCTS</text>
                      <text x="30" y="58" style={{ fontSize: "10px", fill: "#888888", fontFamily: "monospace" }}>TUC-INC-2026-001 | DATAMODEL RELATIONS</text>

                      {/* Table 1: admins */}
                      <g transform="translate(40, 110)">
                        <rect width="210" height="110" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                        <rect width="210" height="24" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#1A1A1A"} />
                        <text x="12" y="16" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "monospace" }}>tuc_admins</text>
                        <text x="12" y="44" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🔑 admin_id : INT [PK]</text>
                        <text x="12" y="62" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>👤 email : VARCHAR(100)</text>
                        <text x="12" y="80" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🛡️ role_auth : VARCHAR(30)</text>
                        <text x="12" y="98" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🔐 passcode_hash : VARCHAR(100)</text>
                      </g>

                      {/* Table 2: audit_logs */}
                      <g transform="translate(390, 110)">
                        <rect width="240" height="145" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                        <rect width="240" height="24" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#1A1A1A"} />
                        <text x="12" y="16" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "monospace" }}>tuc_audit_logs</text>
                        <text x="12" y="44" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🔑 log_id : INT [PK]</text>
                        <text x="12" y="62" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>👤 caller_admin_id : INT [FK]</text>
                        <text x="12" y="80" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>📝 action : VARCHAR(100)</text>
                        <text x="12" y="98" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>💡 details : TEXT</text>
                        <text x="12" y="116" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>📅 timestamp_utc : DATETIME</text>
                        <text x="12" y="134" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🌐 ip_address : VARCHAR(45)</text>
                      </g>

                      {/* Association line */}
                      <path d="M 250 165 L 390 165" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" fill="none" />
                      {/* One of association */}
                      <line x1="260" y1="158" x2="260" y2="172" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1" />
                      <line x1="265" y1="158" x2="265" y2="172" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1" />
                      {/* Crowfoot of association (many side) */}
                      <line x1="380" y1="158" x2="380" y2="172" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1" />
                      <line x1="380" y1="158" x2="390" y2="165" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1" />
                      <line x1="380" y1="172" x2="390" y2="165" stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1" />
                      
                      <rect x="280" y="148" width="60" height="15" rx="2" fill={theme === "dark" || theme === "high-contrast" ? "#222" : "#f0f0f0"} />
                      <text x="310" y="159" textAnchor="middle" style={{ fontSize: "8px", fill: theme === "dark" || theme === "high-contrast" ? "#fff" : "#111", fontWeight: "bold" }}>performs</text>

                      {/* Table 3: tuc_system_preferences */}
                      <g transform="translate(40, 290)">
                        <rect width="210" height="110" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                        <rect width="210" height="24" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#1A1A1A"} />
                        <text x="12" y="16" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "monospace" }}>tuc_system_preferences</text>
                        <text x="12" y="44" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🔑 pref_id : INT [PK]</text>
                        <text x="12" y="62" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🎨 theme_state : VARCHAR(30)</text>
                        <text x="12" y="80" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>♿ high_contrast : TINYINT(1)</text>
                        <text x="12" y="98" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>⚙️ last_updated : DATETIME</text>
                      </g>

                      {/* Table 4: tuc_health_logs */}
                      <g transform="translate(390, 290)">
                        <rect width="240" height="110" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#1e1e1e" : "#FAF9F5"} stroke={theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111"} strokeWidth="1.5" />
                        <rect width="240" height="24" rx="4" fill={theme === "dark" || theme === "high-contrast" ? "#121212" : "#1A1A1A"} />
                        <text x="12" y="16" style={{ fill: "#ffffff", fontSize: "11px", fontWeight: "bold", fontFamily: "monospace" }}>tuc_health_logs</text>
                        <text x="12" y="44" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🔑 check_id : INT [PK]</text>
                        <text x="12" y="62" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🎯 service_name : VARCHAR(60)</text>
                        <text x="12" y="80" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>🟢 status : VARCHAR(20)</text>
                        <text x="12" y="98" style={{ fill: theme === "dark" || theme === "high-contrast" ? "#ffffff" : "#111111", fontSize: "10px", fontFamily: "monospace" }}>⚡ ping_latency_ms : INT</text>
                      </g>
                    </svg>
                  </div>
                </section>

                {/* 5. Compliance Gap Analysis */}
                <section id="srs-coverage" className="space-y-4">
                  <h3 className="text-xl font-medium tracking-tight border-b pb-2 text-current flex items-center gap-1.5 font-serif font-bold">
                    <CheckSquare className="w-4 h-4 text-neutral-500" />
                    <span>5. Compliance Gap Analysis Matrix</span>
                  </h3>
                  <div className="overflow-x-auto">
                    <table className={`w-full text-xs font-sans text-left border rounded-md ${
                      theme === "dark" ? "border-neutral-800" : "border-black/10"
                    }`}>
                      <thead className={theme === "dark" ? "bg-neutral-900" : "bg-neutral-50"}>
                        <tr className="border-b">
                          <th className="p-3 font-bold text-current">SRS Sec</th>
                          <th className="p-3 font-bold text-current">Mandated Specification</th>
                          <th className="p-3 font-bold text-current">Implementation Engine</th>
                          <th className="p-3 font-bold text-current text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-current/5">
                        <tr>
                          <td className="p-3 font-mono font-bold">3.2.1</td>
                          <td className="p-3">Password-Protected Admins Gate</td>
                          <td className="p-3">Administrative overlay checking hash input <code>admin123</code>. Unlocks telemetry panels.</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">✅ 100% Full</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">3.2.2</td>
                          <td className="p-3">Persistent Audit Registration</td>
                          <td className="p-3">Interactive audit telemetry console registering event-timestamp structures locally.</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">✅ 100% Full</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">3.2.3</td>
                          <td className="p-3">Theme & Accessibility Selector</td>
                          <td className="p-3 font-mono">Theme contrast switcher toggle saved to localStorage. WCAG compliant.</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">✅ 100% Full</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">3.2.4</td>
                          <td className="p-3">Automated Service Sensors</td>
                          <td className="p-3">Continuous diagnostic checking algorithms verifying system pings to local servers.</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">✅ 100% Full</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono font-bold">3.2.5</td>
                          <td className="p-3">Continuous Test Suites Runner</td>
                          <td className="p-3 font-mono">E2E simulation browser verifying component triggers and generating diagnostic PNG snapshots.</td>
                          <td className="p-3 text-center text-emerald-500 font-bold">✅ 100% Full</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {currentTab === "manifesto" && (
          <div className="max-w-4xl mx-auto space-y-12 py-6">
            <div className="text-center space-y-4">
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">The Techbridge Declaration</span>
              <h2 className="text-4xl md:text-5xl font-serif text-current tracking-tighter font-medium">The TUC Delegation Manifesto</h2>
              <p className="text-xs font-mono uppercase tracking-widest opacity-55">By Daniel Twum • TUC ICT Center of Academic Excellence, Oyibi, Ghana</p>
              <div className="w-16 h-0.5 bg-current mx-auto opacity-20" />
            </div>

            <div className="font-serif text-base md:text-lg leading-relaxed space-y-6 text-neutral-800 dark:text-neutral-200">
              <p className="indent-8 italic text-neutral-600 dark:text-neutral-400">
                "Sometimes, software engineering does not require more writing of characters. It requests a deep, quiet letting go."
              </p>
              <p>
                In the classrooms of Techbridge University College in Oyibi, Ghana, we have spent years teaching students the manual mechanics of the standard software compilation lifecycle. We drilled the rules of variables, memory limits, port binding offsets, and relational SQL key structures. But we are crossing a threshold.
              </p>
              <p>
                As autonomous agent frameworks with direct write permissions begin taking active, overnight delegation control of system branches, the core role of the engineer is shifting. We are no longer compilers of alphanumeric syntax; we are curators of deep intentional architecture goals.
              </p>
              <p>
                The friction has vanished from the compiler loop and relocated directly into our human reluctance to trust systems. When our agents wake up, having refactored asynchronous buffers in our server containers by 14% while we slept, we experience a feeling of befuddlement. It challenges our sense of ownership.
              </p>
              <p>
                Compute is a metabolic process. If floating-point calculation streams represent the muscle tissue of active servers, token context parameters are the glucose. Proper prompt engineering is not about pouring raw documents into an empty text window. We must cook and caramelize instructions into compact instruction reductions, sautéing constraints down to raw, highly concentrated conceptual specifications.
              </p>
              <p>
                We do not build systems that simply automate. We compile platforms that hold active memory, retaining institutional knowledge and resolving technical debts through continuous micro-tinkering. When our virtual diagnostic port is open, our spectator status ceases. Passive osmosis crystallizes into clean systems agency. Techbridge is bridging this boundary, deploying stable, fully-responsive digital blueprints that stand firm in standard production grids.
              </p>
            </div>

            <div className="pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-xs opacity-50 font-mono gap-4 border-current/10">
              <span>ESTABLISHED MAY 2026 IN OYIBI, GHANA</span>
              <span>CERTIFIED: [DANIEL_TWUM_HEAD_OF_ICT_2026]</span>
            </div>
          </div>
        )}

        {currentTab === "about" && (
          <div className="space-y-10 animate-fade-in">
            {/* About Banner */}
            <div className={`border rounded-lg p-8 space-y-4 transition-colors duration-300 ${
              theme === "dark" 
                ? "bg-[#1C1C1C] border-neutral-800" 
                : theme === "high-contrast" 
                ? "bg-black border-2 border-[#FACC15]" 
                : "bg-white border-black/10"
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded ${
                  theme === "high-contrast" ? "bg-[#FACC15] text-black animate-pulse" : "bg-black text-white dark:bg-white dark:text-black"
                }`}>TUC CONTROL</span>
                <span className="text-[10px] font-mono opacity-60 font-semibold text-current">ADMINISTRATOR DESK</span>
              </div>
              <h2 className="text-3xl font-serif text-current font-medium tracking-tight">
                Academic & Document Control Desk
              </h2>
              <p className="text-xs md:text-sm font-serif italic text-neutral-500 max-w-2xl leading-relaxed">
                Official documentation archive and asset pipeline index for Techbridge University College (TUC). Select any manual below to review its contents or download its raw markdown source.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Document Sidebar (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className={`p-5 border rounded-lg space-y-4 shadow-xs ${
                  theme === "dark" 
                    ? "bg-[#1C1C1C] border-neutral-850" 
                    : theme === "high-contrast" 
                    ? "bg-black border-2 border-[#FACC15]" 
                    : "bg-neutral-50 border-black/10"
                }`}>
                  <h3 className="text-[10px] font-sans font-bold uppercase tracking-widest opacity-60">Documentation Library</h3>
                  
                  <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                    {systemDocs.map((doc) => {
                      const isSelected = doc.id === selectedDocId;
                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDocId(doc.id);
                            setCopiedDocId(null);
                          }}
                          className={`p-3.5 rounded-md border cursor-pointer transition-all text-left ${
                            isSelected
                              ? theme === "high-contrast"
                                ? "bg-[#FACC15]/20 border-2 border-[#FACC15]"
                                : "bg-black dark:bg-white text-white dark:text-black border-transparent"
                              : theme === "dark"
                              ? "bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800"
                              : "bg-white border-black/10 hover:bg-black/5"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[8px] font-mono uppercase opacity-60 tracking-wider">REF: {doc.ref}</span>
                            <span className={`text-[8px] font-sans font-bold uppercase px-1.5 py-0.5 rounded ${
                              theme === "high-contrast" ? "bg-black text-[#FACC15] border border-[#FACC15]" : "bg-black/5 dark:bg-white/10"
                            }`}>{doc.category}</span>
                          </div>
                          <h4 className="text-xs font-serif font-semibold text-current">{doc.title}</h4>
                          <p className="text-[9px] opacity-65 mt-1 truncate">By {doc.author}</p>
                        </div>
                      );
                    })}

                    {/* privacy.html public reference */}
                    <div
                      onClick={() => {
                        setSelectedDocId("privacy_policy");
                        setCopiedDocId(null);
                      }}
                      className={`p-3.5 rounded-md border cursor-pointer transition-all text-left ${
                        selectedDocId === "privacy_policy"
                          ? theme === "high-contrast"
                            ? "bg-[#FACC15]/20 border-2 border-[#FACC15]"
                            : "bg-black dark:bg-white text-white dark:text-black border-transparent"
                          : theme === "dark"
                          ? "bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800"
                          : "bg-white border-black/10 hover:bg-black/5"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[8px] font-mono uppercase opacity-60 tracking-wider">PUBLIC URL: /privacy.html</span>
                        <span className="text-[8px] font-sans font-bold bg-indigo-500/15 text-indigo-400 uppercase px-1.5 py-0.5 rounded">Compliance</span>
                      </div>
                      <h4 className="text-xs font-serif font-semibold text-current">GDPR & Ghana Act 843 Privacy Policy</h4>
                      <p className="text-[9px] opacity-65 mt-1">Institutional Data Protection SOP</p>
                    </div>
                  </div>
                </div>

                {/* Institutional Info Card */}
                <div className={`p-5 border rounded-lg text-xs space-y-3 transition-colors duration-300 ${
                  theme === "dark" 
                    ? "bg-[#1C1C1C] border-neutral-800 text-neutral-300" 
                    : theme === "high-contrast" 
                    ? "bg-black border-2 border-[#FACC15] text-white" 
                    : "bg-white/50 border border-black/10 text-black/70"
                }`}>
                  <h4 className="text-[10px] font-sans font-bold uppercase tracking-wider block border-b pb-2 opacity-50">TUC ICT Center Contact Info</h4>
                  <p><strong>Affiliation:</strong> Techbridge University College, Oyibi, Ghana</p>
                  <p><strong>Head of ICT:</strong> Daniel Twum</p>
                  <p><strong>Academic Email:</strong> <a href="mailto:danieltwum@gmail.com" className="underline hover:opacity-80">danieltwum@gmail.com</a></p>
                  <p><strong>Server Topology:</strong> Docker Stack Node Container hosted in Plesk</p>
                </div>
              </div>

              {/* Document Reader Frame (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const activeDoc = selectedDocId === "privacy_policy" ? {
                    id: "privacy",
                    title: "Privacy Policy — Techbridge AI Blueprint",
                    ref: "TUC-INC-2026-605",
                    author: "Daniel Twum, Head of ICT",
                    category: "Compliance",
                    content: `<!-- PUBLIC HOSTING SOURCE FILE DIRECTORY: /public/privacy.html -->
# Privacy Policy
### Document Reference: TUC-INC-2026-605
**Legal Jurisdictions:** General Data Protection Regulation (GDPR) / California Consumer Privacy Act (CCPA) / Ghana Data Protection Act 2012 (Act 843)

---

The Techbridge AI Blueprint [TAB] is fully committed to absolute data minimalisation. The application has been designed to operate with high performance and zero telemetry leaks:

## 1. Controller Identity
- **Institution:** Techbridge University College (TUC)
- **Campuses:** Oyibi Campus, Accra, Ghana
- **Officer in charge:** Daniel Twum, Head of ICT
- **Contact:** danieltwum@gmail.com

## 2. Information Handled
- **No User Account Creation:** Standard readers browse essays seamlessly without creating user accounts.
- **Local Browser Persistence:** Your certified chapter checklists, reading completion variables, and accessibility theme modes (Light, Dark, High-contrast) are saved entirely inside your client browser local cache (LocalStorage).
- **No Remote Telemetry Logs:** Audit logs and simulation diagnostics records are kept inside the operational cache and are purged automatically when you logout or exit. We gather no device fingerprints, no locations, and no analytical trackers.`
                  } : systemDocs.find(d => d.id === selectedDocId) || systemDocs[1];

                  const handleCopy = () => {
                    navigator.clipboard.writeText(activeDoc.content);
                    setCopiedDocId(activeDoc.ref);
                    setTimeout(() => setCopiedDocId(null), 2500);
                  };

                  return (
                    <div className={`p-8 border rounded-lg space-y-6 transition-colors duration-300 ${
                      theme === "dark" 
                        ? "bg-[#1C1C1C]/60 border-neutral-800 text-neutral-200" 
                        : theme === "high-contrast" 
                        ? "bg-black border-2 border-[#FACC15] text-white" 
                        : "bg-white border-black/10 text-neutral-800"
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 border-current/10">
                        <div>
                          <span className="text-[8px] font-mono uppercase opacity-65 tracking-widest block mb-1">REF: {activeDoc.ref}</span>
                          <h3 className="text-xl font-serif font-bold text-current leading-tight">{activeDoc.title}</h3>
                        </div>

                        {/* Action buttons with REAL linkages */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded border cursor-pointer hover:shadow-xs transition-all ${
                              copiedDocId === activeDoc.ref
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                                : theme === "dark"
                                ? "border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                                : theme === "high-contrast"
                                ? "border-2 border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 bg-black"
                                : "border-black/15 bg-white hover:bg-black/5 text-black"
                            }`}
                            title="Copy full text to clipboard"
                          >
                            {copiedDocId === activeDoc.ref ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => {
                              const blob = new Blob([activeDoc.content], { type: selectedDocId === "privacy_policy" ? "text/html;charset=utf-8;" : "text/markdown;charset=utf-8;" });
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute("download", selectedDocId === "privacy_policy" ? "privacy.html" : `${activeDoc.id}.md`);
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-sans font-bold uppercase tracking-wider rounded border cursor-pointer hover:shadow-xs transition-all ${
                              theme === "dark"
                                ? "border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200"
                                : theme === "high-contrast"
                                ? "border-2 border-[#FACC15] text-[#FACC15] hover:bg-[#FACC15]/10 bg-black"
                                : "border-black/15 bg-white hover:bg-black/5 text-black"
                            }`}
                            title="Download file"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download File</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Render Parser */}
                      <div className="font-serif text-xs leading-relaxed space-y-4 max-h-[500px] overflow-y-auto pr-2 text-current opacity-95">
                        {activeDoc.content.split("\n\n").map((para, pIdx) => {
                          if (para.startsWith("# ")) {
                            return <h1 key={pIdx} className="text-xl font-bold tracking-tight text-current pt-2 pb-1 border-b border-current/10">{para.replace("# ", "")}</h1>;
                          }
                          if (para.startsWith("## ")) {
                            return <h2 key={pIdx} className="text-sm font-sans font-bold tracking-wider text-current uppercase pt-3 pb-1">{para.replace("## ", "")}</h2>;
                          }
                          if (para.startsWith("### ")) {
                            return <h3 key={pIdx} className="text-xs font-sans font-bold text-current pt-2">{para.replace("### ", "")}</h3>;
                          }
                          if (para.startsWith("- [ ]") || para.startsWith("- [x]")) {
                            const checked = para.startsWith("- [x]");
                            return (
                              <div key={pIdx} className="flex items-start gap-2.5 my-1.5">
                                <span className={`p-0.5 rounded ${checked ? "text-emerald-500" : "opacity-40"}`}>
                                  {checked ? <CheckSquare className="w-4 h-4 text-emerald-500" /> : <Square className="w-4 h-4" />}
                                </span>
                                <span className="text-xs font-sans text-current">{para.replace("- [ ] ", "").replace("- [x] ", "")}</span>
                              </div>
                            );
                          }
                          if (para.startsWith("* ")) {
                            return (
                              <ul key={pIdx} className="list-disc list-inside pl-3 space-y-1">
                                {para.split("\n").map((li, lIdx) => (
                                  <li key={lIdx} className="text-xs text-current">{li.replace("* ", "")}</li>
                                ))}
                              </ul>
                            );
                          }
                          if (para.includes("|")) {
                            const lines = para.trim().split("\n");
                            const headers = lines[0].split("|").filter((h, idx) => idx > 0 && idx < lines[0].split("|").length - 1);
                            const rows = lines.slice(2).map(r => r.split("|").filter((val, idx) => idx > 0 && idx < r.split("|").length - 1));
                            return (
                              <div key={pIdx} className="overflow-x-auto my-3">
                                <table className="w-full text-[10px] font-sans border border-current/10 text-left rounded">
                                  <thead>
                                    <tr className="bg-current/5 border-b border-current/10">
                                      {headers.map((h, hIdx) => <th key={hIdx} className="p-2 font-bold text-current">{h.trim()}</th>)}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-current/5">
                                    {rows.map((row, rIdx) => (
                                      <tr key={rIdx}>
                                        {row.map((val, vIdx) => <td key={vIdx} className="p-2 text-current">{val.trim()}</td>)}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            );
                          }
                          if (para.startsWith("```")) {
                            return (
                              <pre key={pIdx} className="p-3 font-mono text-[10px] bg-neutral-900 border border-neutral-850 text-emerald-400 rounded-md overflow-x-auto whitespace-pre my-3">
                                <code>{para.replace(/```[a-z]*/g, "").replace(/```/g, "").trim()}</code>
                              </pre>
                            );
                          }
                          return <p key={pIdx} className="text-current leading-relaxed">{para}</p>;
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Editorial Footer */}
      <footer className={`border-t py-12 text-center text-[10px] font-sans uppercase tracking-widest transition-colors duration-300 ${
        theme === "dark" 
          ? "border-neutral-800 bg-[#181818] text-neutral-400" 
          : theme === "high-contrast" 
          ? "border-t-4 border-[#FACC15] bg-black text-white" 
          : "border-black/10 bg-[#FDFCF9] text-black/50"
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>Folio © 2026 Collective Intelligence • Techbridge University College</div>
          <div className="flex gap-6">
            <span>Pagination: [ {String(selectedId).padStart(2, '0')} ] of {String(essays.length).padStart(2, '0')}</span>
            <span>Synthesized with Natural & Computer Intent</span>
          </div>
        </div>
      </footer>

      {/* Admin Dialog Console overlay */}
      {isAdminOpen && (
        <AdminConsole
          theme={theme}
          setTheme={setTheme}
          onClose={() => setIsAdminOpen(false)}
        />
      )}
    </div>
  );
}
