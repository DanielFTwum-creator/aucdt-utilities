import React, { useState, useEffect } from "react";
import { Coffee, Globe, Calendar, Terminal, Type, ChevronDown } from "lucide-react";

export default function Header() {
  const [utcTime, setUtcTime] = useState("");
  type AccessibilityMode = "default" | "amber-highlight" | "high-contrast-blue";

  const [accessibilityMode, setAccessibilityMode] = useState<AccessibilityMode>(() => {
    const saved = localStorage.getItem("accessibility_mode");
    if (saved === "amber-highlight" || saved === "high-contrast-blue" || saved === "default") {
      return saved as AccessibilityMode;
    }
    // Backward compatibility check
    if (localStorage.getItem("accessibility_amber") === "true") {
      return "amber-highlight";
    }
    return "default";
  });
  const [fontTheme, setFontTheme] = useState<"sans" | "serif" | "mono">(() => {
    return (localStorage.getItem("global_font_theme") as "sans" | "serif" | "mono") || "sans";
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toISOString().replace("T", " ").substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    // Reset all accessibility theme classes first
    root.classList.remove("accessibility-amber", "accessibility-blue");

    if (accessibilityMode === "amber-highlight") {
      root.classList.add("accessibility-amber");
      localStorage.setItem("accessibility_mode", "amber-highlight");
      localStorage.setItem("accessibility_amber", "true");
    } else if (accessibilityMode === "high-contrast-blue") {
      root.classList.add("accessibility-blue");
      localStorage.setItem("accessibility_mode", "high-contrast-blue");
      localStorage.setItem("accessibility_amber", "false");
    } else {
      localStorage.setItem("accessibility_mode", "default");
      localStorage.setItem("accessibility_amber", "false");
    }
  }, [accessibilityMode]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("font-theme-sans", "font-theme-serif", "font-theme-mono");
    root.classList.add(`font-theme-${fontTheme}`);
    localStorage.setItem("global_font_theme", fontTheme);
  }, [fontTheme]);

  return (
    <header className="border-b border-black/15 bg-[#F9F7F4]/90 sticky top-0 z-50 transition-colors duration-300 dark:border-white/15 dark:bg-[#121110]/95 backdrop-blur-xs">
      <div className="max-w-6xl mx-auto px-6 py-5">
        {/* Editorial Metadata Bar */}
        <div className="flex flex-wrap justify-between items-center text-[10px] tracking-[0.2em] font-mono font-bold uppercase text-gray-500 border-b border-black/10 pb-3 mb-4 dark:border-white/10 dark:text-zinc-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 font-semibold text-zinc-800 dark:text-zinc-200">
              <Globe className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" /> Volume 04
            </span>
            <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span className="hidden sm:inline flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Systemic Logic
            </span>
          </div>
          
          <div className="flex items-center space-x-4 mt-1 sm:mt-0">
            <span className="flex items-center gap-1.5 bg-[#F2EEE9] dark:bg-[#222120] text-zinc-800 dark:text-zinc-350 px-2.5 py-0.5 rounded font-bold border border-black/5 dark:border-white/5">
              Serial No. 3007
            </span>
            <span className="hidden md:inline text-zinc-300 dark:text-zinc-700">|</span>
            <span className="font-mono flex items-center gap-1 text-zinc-650 dark:text-zinc-400">
              <Terminal className="w-3.5 h-3.5" /> Status: Wide Open
            </span>
          </div>
        </div>

        {/* Brand Display Wrapper */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-serif italic font-medium text-3xl sm:text-4xl tracking-tight text-black dark:text-[#F5F2EF]">
              The Deliberate Magic
            </h1>
            <p className="font-serif italic text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 mt-1 max-w-xl">
              "The magic is real. The engineering behind it is deliberate. After forty years in this industry, I have learned that those two things are not in tension."
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Accessibility Mode Toggle Button */}
            <button
              onClick={() => {
                setAccessibilityMode((prev) => {
                  if (prev === "default") return "amber-highlight";
                  if (prev === "amber-highlight") return "high-contrast-blue";
                  return "default";
                });
              }}
              className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-all cursor-pointer ${
                accessibilityMode === "amber-highlight"
                  ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 border-amber-500/50"
                  : accessibilityMode === "high-contrast-blue"
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-400 border-blue-500/40"
                  : "bg-black/5 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
              title="Toggle through accessibility color highlighting modes"
              id="accessibility-amber-toggle-btn"
            >
              <span className={`w-2 h-2 rounded-full ${
                accessibilityMode === "amber-highlight"
                  ? "bg-amber-500 animate-pulse"
                  : accessibilityMode === "high-contrast-blue"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-zinc-450 dark:bg-zinc-550"
              }`} />
              <span>
                Accessibility: {
                  accessibilityMode === "amber-highlight"
                    ? "Amber"
                    : accessibilityMode === "high-contrast-blue"
                    ? "Blue"
                    : "Default"
                }
              </span>
            </button>

            {/* Font Theme Dropdown Menu */}
            <div className="relative inline-block text-left" id="font-theme-dropdown-container">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded border transition-all cursor-pointer ${
                  dropdownOpen
                    ? "bg-amber-100 dark:bg-amber-950/40 text-amber-900 dark:text-amber-400 border-amber-500/50"
                    : "bg-black/5 dark:bg-white/5 text-zinc-650 dark:text-zinc-400 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
                title="Select application global font theme"
                id="font-theme-dropdown-btn"
              >
                <Type className="w-3.5 h-3.5 text-amber-600" />
                <span>Font: <span className="font-bold underline capitalize">{fontTheme === "sans" ? "Sans" : fontTheme === "serif" ? "Serif" : "Mono"}</span></span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop overlay to close when clicking outside */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setDropdownOpen(false)} 
                  />
                  
                  {/* Dropdown Options Box */}
                  <div 
                    className="absolute right-0 mt-1 w-40 rounded-md shadow-lg bg-[#FCFAF7] dark:bg-[#1C1A19] border border-black/15 dark:border-white/15 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-100"
                    id="font-theme-dropdown-options"
                  >
                    <button
                      onClick={() => {
                        setFontTheme("serif");
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-serif hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between ${
                        fontTheme === "serif" ? "text-amber-600 font-bold" : "text-zinc-805 dark:text-zinc-205"
                      }`}
                      id="font-theme-option-serif"
                    >
                      <span>Serif</span>
                      {fontTheme === "serif" && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        setFontTheme("sans");
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-sans hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between ${
                        fontTheme === "sans" ? "text-amber-600 font-bold" : "text-zinc-805 dark:text-zinc-205"
                      }`}
                      id="font-theme-option-sans"
                    >
                      <span>Sans-serif</span>
                      {fontTheme === "sans" && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                    </button>

                    <button
                      onClick={() => {
                        setFontTheme("mono");
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex items-center justify-between ${
                        fontTheme === "mono" ? "text-amber-600 font-bold" : "text-zinc-805 dark:text-zinc-205"
                      }`}
                      id="font-theme-option-mono"
                    >
                      <span>Monospace</span>
                      {fontTheme === "mono" && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-550 dark:text-zinc-400 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded border border-black/10 dark:border-white/10">
              <Coffee className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              <span>40 years of engineering, condensed</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
