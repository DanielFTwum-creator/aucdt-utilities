import { ThemeMode, UserProgress } from "../types";
import { Sun, Moon, Eye, Award, Zap, Crosshair } from "lucide-react";

interface NavbarProps {
  progress: UserProgress;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  /** Slim header during an active exercise — hides stats/tabs so the
   *  typing keyboard & hand diagram are visible without scrolling. */
  minimal?: boolean;
}

export default function Navbar({ progress, theme, onThemeChange, onNavigate, activeTab, minimal = false }: NavbarProps) {
  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return <Sun size={18} className="text-amber-500" />;
      case "dark":
        return <Moon size={18} className="text-slate-300" />;
      case "high-contrast":
        return <Eye size={18} className="text-lime-400" />;
    }
  };

  const getThemeLabel = (mode: ThemeMode) => {
    switch (mode) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "high-contrast":
        return "High Contrast";
    }
  };

  return (
    <header className="border-b border-zinc-200 dark:border-white/5 bg-white dark:bg-[#050608]/90 backdrop-blur-xl transition-colors duration-300">
      <div className={`w-full px-4 sm:px-6 lg:px-8 ${minimal ? "py-2" : "py-5"}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-5">

          {/* Logo / Title */}
          <div className="flex items-center space-x-3.5">
            <div className={`relative rounded-xl bg-sky-600/10 dark:bg-cyan-500/20 flex items-center justify-center border border-sky-600/30 dark:border-cyan-500/40 shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.3)] ${minimal ? "w-7 h-7" : "w-10 h-10"}`}>
              <div className={`bg-sky-600 dark:bg-cyan-400 rounded-sm ${minimal ? "w-3 h-3" : "w-4 h-4"}`}></div>
              {/* Pan-African / Ghana flag accent */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-[3px] w-3/4 overflow-hidden rounded-full" aria-hidden="true" title="Made in Ghana">
                <span className="flex-1 bg-[#CE1126]"></span>
                <span className="flex-1 bg-[#FCD116]"></span>
                <span className="flex-1 bg-[#006B3F]"></span>
              </div>
            </div>
            <div>
              {!minimal && (
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 dark:text-cyan-400">
                    Techbridge University College
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] bg-sky-100 dark:bg-cyan-950/40 text-sky-800 dark:text-cyan-300 rounded font-mono font-bold tracking-wider border border-transparent dark:border-cyan-500/20">
                    OYIBI, GHANA
                  </span>
                </div>
              )}
              <h1 id="appHeaderTitle" className={`font-black tracking-tight text-zinc-900 dark:text-white uppercase ${minimal ? "text-sm" : "text-xl sm:text-2xl"}`}>
                Vortex Type / <span className={`text-sky-600 dark:text-cyan-400 font-mono font-light tracking-wide lowercase ${minimal ? "text-xs" : "text-lg"}`}>typing protocol</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats Summary */}
          {!minimal && (
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            {/* Level */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-100 dark:bg-slate-900/40 rounded-lg border border-zinc-200 dark:border-white/5 hover:border-cyan-500/20 transition-all">
              <Award size={14} className="text-amber-500" />
              <div className="text-left">
                <p className="text-[8px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-mono font-semibold">LVL</p>
                <p className="font-bold text-zinc-900 dark:text-white font-mono leading-none mt-0.5">{progress.level}</p>
              </div>
            </div>

            {/* Total Points */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-100 dark:bg-slate-900/40 rounded-lg border border-zinc-200 dark:border-white/5 hover:border-cyan-500/20 transition-all">
              <Zap size={14} className="text-sky-500 dark:text-cyan-400" />
              <div className="text-left">
                <p className="text-[8px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-mono font-semibold">PTS</p>
                <p className="font-bold text-zinc-900 dark:text-white font-mono leading-none mt-0.5">{progress.points}</p>
              </div>
            </div>

            {/* Best Speed */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-100 dark:bg-slate-900/40 rounded-lg border border-zinc-200 dark:border-white/5 hover:border-cyan-500/20 transition-all">
              <Zap size={14} className="text-emerald-500" />
              <div className="text-left">
                <p className="text-[8px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-mono font-semibold">MAX WPM</p>
                <p className="font-bold text-zinc-900 dark:text-white font-mono leading-none mt-0.5">{progress.bestSpeed}</p>
              </div>
            </div>

            {/* Best Accuracy */}
            <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-zinc-100 dark:bg-slate-900/40 rounded-lg border border-zinc-200 dark:border-white/5 hover:border-cyan-500/20 transition-all">
              <Crosshair size={14} className="text-rose-500" />
              <div className="text-left">
                <p className="text-[8px] text-zinc-500 dark:text-slate-500 uppercase tracking-widest font-mono font-semibold">ACC</p>
                <p className="font-bold text-zinc-900 dark:text-white font-mono leading-none mt-0.5">{progress.bestAccuracy}%</p>
              </div>
            </div>

            {/* Accessibility Theme Toggler */}
            <div className="relative inline-flex items-center">
              <select
                id="themeSelectDropdown"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                className="pl-8 pr-4 py-1.5 bg-zinc-100 dark:bg-slate-900/40 border border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer hover:border-cyan-500/40 transition-all"
              >
                <option value="light" className="dark:bg-[#050608]">☀️ Light Mode</option>
                <option value="dark" className="dark:bg-[#050608]">🌙 Dark Mode</option>
                <option value="high-contrast" className="dark:bg-[#050608]">👁️ High Contrast</option>
              </select>
              <div className="absolute left-2.5 pointer-events-none">
                {getThemeIcon(theme)}
              </div>
            </div>
          </div>
          )}

          {/* Compact theme toggle shown in minimal (in-exercise) mode */}
          {minimal && (
            <div className="relative inline-flex items-center">
              <select
                id="themeSelectDropdown"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                className="pl-7 pr-2.5 py-1 bg-zinc-100 dark:bg-slate-900/40 border border-zinc-300 dark:border-white/10 text-zinc-800 dark:text-zinc-200 rounded-lg text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-cyan-500 appearance-none cursor-pointer hover:border-cyan-500/40 transition-all"
              >
                <option value="light" className="dark:bg-[#050608]">☀️ Light Mode</option>
                <option value="dark" className="dark:bg-[#050608]">🌙 Dark Mode</option>
                <option value="high-contrast" className="dark:bg-[#050608]">👁️ High Contrast</option>
              </select>
              <div className="absolute left-2 pointer-events-none">
                {getThemeIcon(theme)}
              </div>
            </div>
          )}

        </div>

        {/* Global Tab Navigation */}
        {!minimal && (
        <div className="mt-5 flex flex-wrap border-t border-zinc-100 dark:border-white/5 pt-3.5 gap-1.5">
          <button
            id="navLessonsTabButton"
            onClick={() => onNavigate("lessons")}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all ${
              activeTab === "lessons"
                ? "bg-sky-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-400/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            📚 Lessons Map
          </button>
          <button
            id="navSpeedtestTabButton"
            onClick={() => onNavigate("speedtest")}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all ${
              activeTab === "speedtest"
                ? "bg-sky-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-400/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            ⚡ WPM Speed Test
          </button>
          <button
            id="navGameTabButton"
            onClick={() => onNavigate("game")}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all ${
              activeTab === "game"
                ? "bg-sky-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-400/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            🎮 Arcade Race
          </button>
          <button
            id="navAdminTabButton"
            onClick={() => onNavigate("admin")}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all ${
              activeTab === "admin"
                ? "bg-sky-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-400/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            🛡️ Admin Log Panel
          </button>
          <button
            id="navDocsTabButton"
            onClick={() => onNavigate("docs")}
            className={`px-4 py-2 min-h-[44px] rounded-lg text-sm font-semibold transition-all ${
              activeTab === "docs"
                ? "bg-sky-600 text-white shadow-sm dark:bg-cyan-500/20 dark:text-cyan-400 dark:border dark:border-cyan-400/40 dark:shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                : "text-zinc-600 dark:text-slate-400 hover:bg-zinc-100 dark:hover:bg-white/5"
            }`}
          >
            📄 Specifications & Docs
          </button>
        </div>
        )}

      </div>
    </header>
  );
}
