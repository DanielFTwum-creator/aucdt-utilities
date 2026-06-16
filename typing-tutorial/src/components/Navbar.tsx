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
      case "light":         return <Sun size={15} className="text-amber-500" />;
      case "dark":          return <Moon size={15} className="text-slate-400" />;
      case "high-contrast": return <Eye size={15} className="text-lime-400" />;
    }
  };

  return (
    <header className="bg-[#1E1A17] dark:bg-[#1E1A17] border-b border-white/8 transition-colors">
      <div className={`w-full px-4 sm:px-6 lg:px-8 ${minimal ? "py-2" : "py-3"}`}>
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className={`rounded-lg bg-emerald-600 flex items-center justify-center ${minimal ? "w-7 h-7" : "w-8 h-8"}`}>
              <span className="font-black text-white text-xs">VT</span>
            </div>
            <div>
              {!minimal && (
                <p className="text-[9px] font-semibold text-stone-400 uppercase tracking-widest leading-none mb-0.5">
                  Techbridge University College
                </p>
              )}
              <h1 id="appHeaderTitle" className={`font-bold text-white leading-none ${minimal ? "text-sm" : "text-base"}`}>
                Vortex Type
                <span className="text-emerald-400 font-normal ml-1 text-sm">typing tutor</span>
              </h1>
            </div>
          </div>

          {/* Stats + Theme */}
          {!minimal && (
            <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
              {[
                { icon: <Award size={13} className="text-amber-500" />, label: "Level", value: progress.level },
                { icon: <Zap size={13} className="text-emerald-500" />, label: "Points", value: progress.points.toLocaleString() },
                { icon: <Zap size={13} className="text-sky-500" />, label: "Best WPM", value: progress.bestSpeed },
                { icon: <Crosshair size={13} className="text-rose-500" />, label: "Accuracy", value: `${progress.bestAccuracy}%` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-white/8 rounded-lg border border-white/12 text-xs">
                  {icon}
                  <span className="text-stone-400">{label}:</span>
                  <span className="font-bold text-stone-100">{value}</span>
                </div>
              ))}

              <div className="relative inline-flex items-center">
                <select
                  id="themeSelectDropdown"
                  value={theme}
                  onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                  className="pl-7 pr-3 py-1.5 bg-white/8 border border-white/15 text-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400/40 appearance-none cursor-pointer"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="high-contrast">High Contrast</option>
                </select>
                <div className="absolute left-2 pointer-events-none">
                  {getThemeIcon(theme)}
                </div>
              </div>
            </div>
          )}

          {minimal && (
            <div className="relative inline-flex items-center">
              <select
                id="themeSelectDropdown"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as ThemeMode)}
                className="pl-6 pr-2.5 py-1 bg-white/8 border border-white/15 text-stone-200 rounded-lg text-xs font-medium focus:outline-none appearance-none cursor-pointer"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="high-contrast">HC</option>
              </select>
              <div className="absolute left-1.5 pointer-events-none">
                {getThemeIcon(theme)}
              </div>
            </div>
          )}
        </div>

        {/* Tab navigation — underline style */}
        {!minimal && (
          <nav className="mt-3 flex gap-0 border-t border-white/10 pt-0 -mb-px">
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
                className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab
                    ? "border-emerald-400 text-white"
                    : "border-transparent text-stone-400 hover:text-stone-100 hover:border-stone-500"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
