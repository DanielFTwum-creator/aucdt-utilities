import { CheckCircle2 } from "lucide-react";
import React from "react";
import { useTheme } from "../hooks/useTheme";
import type { Module } from "../types";
import { Card, MetricCard } from "./ui/Cards";

interface ModuleDetailProps {
  module: Module;
}

export const ModuleDetail: React.FC<ModuleDetailProps> = ({ module }) => {
  const { colors } = useTheme();
  
  const accentColor = module.color === "gold" ? colors.gold : module.color === "terracotta" ? colors.terracotta : module.color === "accent" ? colors.accent : module.color === "success" ? colors.success : module.color === "error" ? colors.error : colors.gold;

  return (
    <div className="p-8 lg:p-10 animate-in">
      <div className="flex items-start gap-6 mb-10">
        <div className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl shrink-0" 
             style={{ background: `${accentColor}26`, border: `1px solid ${accentColor}4d` }}>
          {module.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: accentColor }}>{module.code}</span>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border" 
                  style={{ 
                    borderColor: module.status === 'active' ? `${colors.success}4d` : module.status === 'beta' ? `${colors.warning}4d` : `${colors.error}4d`,
                    color: module.status === 'active' ? colors.success : module.status === 'beta' ? colors.warning : colors.error,
                    background: module.status === 'active' ? `${colors.success}1a` : module.status === 'beta' ? `${colors.warning}1a` : `${colors.error}1a`
                  }}>
              {module.status}
            </span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight mb-2" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
            {module.name}
          </h1>
          <p className="text-sm font-medium italic" style={{ color: colors.textMuted }}>{module.tagline}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {Object.entries(module.stats).map(([k, v]) => (
          <MetricCard 
            key={k}
            label={k}
            value={v}
            color={accentColor}
          />
        ))}
      </div>

      {/* Features & SRS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col gap-4">
          <div className="text-[11px] uppercase tracking-widest font-bold mb-2" style={{ color: colors.textDim }}>Core Features</div>
          <div className="space-y-3">
            {module.features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-md border" style={{ background: colors.surfaceAlt, borderColor: colors.border }}>
                <div className="w-2 h-2 rounded-full" style={{ background: accentColor }} />
                <span className="text-[13px]" style={{ color: colors.text }}>{f}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card borderLeft={accentColor}>
          <div className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: colors.textDim }}>SRS Requirements — {module.code}</div>
          <div className="space-y-4">
            {[
              `REQ-${module.code}-001: System shall support ${module.features[0]}`,
              `REQ-${module.code}-002: Platform shall comply with WCAG 2.1 AA accessibility`,
              `REQ-${module.code}-003: All data processing subject to Ghana Data Protection Act`,
              `REQ-${module.code}-004: Response time ≤ 200ms for 95th percentile`,
              `REQ-${module.code}-005: System shall log all user actions to audit trail`,
            ].map((req, i) => (
              <div key={i} className="flex gap-3 text-[12px]">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" style={{ color: colors.success }} />
                <span className="font-mono leading-relaxed" style={{ color: colors.textMuted }}>{req}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
