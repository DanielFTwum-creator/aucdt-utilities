import { ThemeMode, UserProgress } from "../types";
import { Sun, Moon, Eye, Award, Zap, Crosshair } from "lucide-react";

interface NavbarProps {
  progress: UserProgress;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  minimal?: boolean;
}

export default function Navbar({ progress, theme, onThemeChange, onNavigate, activeTab, minimal = false }: NavbarProps) {
  const getThemeIcon = (mode: ThemeMode) => {
    switch (mode) {
      case "light":        return <Sun size={16} className="text-amber-500" />;
      case "dark":         return <Moon size={16} className="text-violet-400" />;
      case "high-contrast": return <Eye size={16} className="text-lime-400" />;
    }
  };

  return (
    <header className="border-b border-violet-100 dark:border-white/5 bg-white dark:bg-[#080710]/95 backdrop-blur-xl transition-colors duration-300 shadow-sm dark:shadow-none">
      <div className={`w-full px-4 sm:px-6 lg:px-8 ${minimal ? "py-2" : "py-4"}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`relative rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md ${minimal ? "w-7 h-7" : "w-9 h-9"}`}>
              <span className={`font-black text-white ${minimal ? "text-xs" : "text-sm"}`}>VT</span>
              {/* Ghana flag accent */}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex h-[3px] w-3/4 overflow-hidden rounded-full" aria-hidden="true" title="Made in Ghana">
                <span className="flex-1 bg-[#CE1126]" />
                <span className="flex-1 bg-[#FCD116]" />
                <span className="flex-1 bg-[#006B3F]" />
              </div>
            </div>
            <div>
              {!minimal && (
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                    Techbridge University College
                  </span>
                  <span className="px-1.5 py-0.5 text-[8px] bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 rounded font-mono font-bold border border-violet-200 dark:border-violet-800/50">
                    OYIBI, GH
                  </span>
                </div>
              )}
              <h1 id="appHeaderTitle" className={`font-black tracking-tight text-zinc-900 dark:text-white ${minimal ? "text-sm" : "text-lg sm:text-xl"}`}>
                Vortex Type
                <span className={`text-violet-500 dark:text-violet-400 font-light ml-1.5 ${minimal ? "text-xs" : "text-sm"}`}>
                  typing tutor
                </span>
              </h1>
            </div>
          </div>

          {/* Stats */}
          {!minimal && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { icon: <Award size={13} className="text-amber-500" />, label: "LVL", value: progress.level },
                { icon: <Zap size={13} className="text-violet-500" />, label: "PTS", value: progress.points },
                { icon: <Zap size={13} className="text-emerald-500" />, label: "BEST WPM", value: progress.bestSpeed },
                { icon: <Crosshair size={13} className="text-rose-500" />, label: "ACC", value: `${progress.bestAccuracy}%` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 dark:bg-slate-900/50 rounded-lg border border-zinc-100 dark:border-white/5 hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors">
                  {icon}
                  <div>
                    <p className="text-[8px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-mono">{label}</p>
                    <p className="font-bold text-zinc-900 dark:text-white font-mono leading-none text-[11px] mt-0.5">{value}</p>
                  </div>
                </div>
              ))}

              {/* Theme */}
              <div className="relative inline-flex items-center">
                <select
                  id="themeSelectDropdown"
                  value={theme}
                  onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                  className="pl-7 pr-3 py-1.5 bg-zinc-50 dark:bg-slate-900/50 border border-zinc-100 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-lg text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-violet-400 appearance-none cursor-pointer hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors"
                >
                  <option value="light">Light Mode</option>
                  <option value="dark">Dark Mode</option>
                  <option value="high-contrast">High Contrast</option>
                </select>
                <div className="absolute left-2 pointer-events-none">
                  {getThemeIcon(theme)}
                </div>
              </div>
            </div>
          )}

          {/* Minimal theme toggle */}
          {minimal && (
            <div className="relative inline-flex items-center">
              <select
                id="themeSelectDropdown"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                className="pl-6 pr-2.5 py-1 bg-zinc-50 dark:bg-slate-900/50 border border-zinc-100 dark:border-white/5 text-zinc-700 dark:text-zinc-300 rounded-lg text-[11px] font-semibold focus:outline-none focus:ring-1 focus:ring-violet-400 appearance-none cursor-pointer"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="high-contrast">High Contrast</option>
              </select>
              <div className="absolute left-1.5 pointer-events-none">
                {getThemeIcon(theme)}
              </div>
            </div>
          )}

        </div>

        {/* Tab navigation */}
        {!minimal && (
          <div className="mt-4 flex flex-wrap border-t border-zinc-100 dark:border-white/5 pt-3 gap-1">
            {[
              { id: "navLessonsTabButton",   tab: "lessons",   label: "📚 Lessons" },
              { id: "navSpeedtestTabButton", tab: "speedtest", label: "⚡ Speed Test" },
              { id: "navGameTabButton",      tab: "game",      label: "🎮 Arcade" },
              { id: "navAdminTabButton",     tab: "admin",     label: "🛡️ Admin" },
              { id: "navDocsTabButton",      tab: "docs",      label: "📄 Docs" },
            ].map(({ id, tab, label }) => (
              <button
                key={tab}
                id={id}
                onClick={() => onNavigate(tab)}
                className={`px-3.5 py-1.5 min-h-[36px] rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-violet-600 text-white shadow-sm dark:bg-violet-500/20 dark:text-violet-300 dark:border dark:border-violet-500/40"
                    : "text-zinc-500 dark:text-zinc-400 hover:bg-violet-50 dark:hover:bg-violet-950/20 hover:text-violet-700 dark:hover:text-violet-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
