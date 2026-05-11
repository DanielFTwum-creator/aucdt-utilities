import { clsx, type ClassValue } from "clsx";
import { Contrast, LayoutGrid, Moon, ShieldAlert, Sun } from "lucide-react";
import React from "react";
import { twMerge } from "tailwind-merge";
import { MODULES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import type { ThemeType } from "../types";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeModule: string;
  setActiveModule: (id: string) => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, isAdmin }) => {
  const { theme, setTheme, colors } = useTheme();

  return (
    <aside className="w-60 shrink-0 border-r flex flex-col h-screen sticky top-0" style={{ background: colors.surface, borderColor: colors.border }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: colors.border }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md flex items-center justify-center text-lg font-bold text-black" 
               style={{ background: `linear-gradient(135deg, ${colors.gold}, ${colors.terracotta})`, fontFamily: "var(--font-display)" }}>
            M
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>MannequinAI</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>v1.0.0 · IEEE SRS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] uppercase tracking-widest font-bold px-1 mb-1" style={{ color: colors.textDim }}>Modules</div>
        {MODULES.filter(m => m.id !== "admin").map((m) => (
          <button 
            key={m.id} 
            onClick={() => setActiveModule(m.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
              activeModule === m.id ? "font-medium" : "font-normal hover:bg-opacity-50"
            )}
            style={{ 
              color: activeModule === m.id ? colors.gold : colors.textMuted,
              background: activeModule === m.id ? `${colors.gold}1a` : "transparent"
            }}
          >
            <span className="text-base">{m.icon}</span>
            <span>{m.name}</span>
            {m.status === "beta" && (
              <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full border" 
                    style={{ borderColor: `${colors.warning}4d`, color: colors.warning, background: `${colors.warning}1a` }}>
                BETA
              </span>
            )}
          </button>
        ))}

        <div className="h-px my-4" style={{ background: colors.border }} />
        
        <div className="text-[10px] uppercase tracking-widest font-bold px-1 mb-1" style={{ color: colors.textDim }}>System</div>
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
            activeModule === "admin" ? "font-medium" : "font-normal hover:bg-opacity-10"
          )}
          onClick={() => setActiveModule("admin")}
          style={{ 
            color: activeModule === "admin" ? colors.error : colors.textMuted,
            background: activeModule === "admin" ? `${colors.error}1a` : "transparent"
          }}
        >
          <ShieldAlert size={16} />
          <span>Admin Console</span>
          {isAdmin && <div className="ml-auto w-2 h-2 rounded-full shadow-sm" style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}` }} />}
        </button>
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2 rounded-sm text-sm transition-all duration-200 text-left",
            activeModule === "dashboard" ? "font-medium" : "font-normal hover:bg-opacity-10"
          )}
          onClick={() => setActiveModule("dashboard")}
          style={{ 
            color: activeModule === "dashboard" ? colors.gold : colors.textMuted,
            background: activeModule === "dashboard" ? `${colors.gold}1a` : "transparent"
          }}
        >
          <LayoutGrid size={16} />
          <span>Dashboard</span>
        </button>
      </div>

      {/* Theme switcher */}
      <div className="p-4 border-t space-y-3" style={{ borderColor: colors.border }}>
        <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>Theme</div>
        <div className="flex gap-1.5">
          {(["dark", "light", "highContrast"] as ThemeType[]).map((t) => (
            <button 
              key={t} 
              onClick={() => setTheme(t)}
              className={cn(
                "flex-1 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border transition-all duration-200",
                theme === t ? "border-gold" : "border-transparent"
              )}
              style={{ 
                borderColor: theme === t ? colors.gold : colors.border,
                background: theme === t ? `${colors.gold}26` : "transparent",
                color: theme === t ? colors.gold : colors.textMuted
              }}
            >
              {t === "dark" ? <Moon size={12} className="mx-auto" /> : t === "light" ? <Sun size={12} className="mx-auto" /> : <Contrast size={12} className="mx-auto" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="w-2 h-2 rounded-full" style={{ background: colors.success, boxShadow: `0 0 6px ${colors.success}` }} />
          <span className="text-[11px]" style={{ color: colors.textMuted }}>All systems operational</span>
        </div>
      </div>
    </aside>
  );
};
