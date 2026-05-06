import { CheckCircle2 } from "lucide-react";
import React from "react";
import { MODULES } from "../constants";
import { useTheme } from "../hooks/useTheme";
import { Card, MetricCard } from "./ui/Cards";

export const Dashboard: React.FC<{ setActiveModule: (id: string) => void }> = ({ setActiveModule }) => {
  const { colors } = useTheme();

  return (
    <div className="p-8 lg:p-10 animate-in">
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-widest font-bold mb-1" style={{ color: colors.textMuted }}>
          Good morning — TECHBRIDGE University College
        </div>
        <h1 className="text-4xl font-semibold leading-tight mb-2" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>
          Platform Overview
        </h1>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          MannequinAI is live. All 8 modules initialised. IEEE SRS v1.0.0 compliance: ✓
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Active Designers", value: "1,240", delta: "+18% MoM", color: colors.gold },
          { label: "Designs Generated", value: "45,210", delta: "+32% MoM", color: colors.terracotta },
          { label: "VTO Sessions", value: "24,100", delta: "+41% MoM", color: colors.accent },
          { label: "Academy Enrolments", value: "3,200", delta: "+12% MoM", color: colors.success },
        ].map((kpi) => (
          <MetricCard 
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Module Grid */}
      <div className="mb-10">
        <div className="text-[11px] uppercase tracking-widest font-bold mb-4" style={{ color: colors.textDim }}>
          All Modules
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {MODULES.map((m) => {
             const accentColor = m.color === "gold" ? colors.gold : m.color === "terracotta" ? colors.terracotta : m.color === "accent" ? colors.accent : m.color === "success" ? colors.success : m.color === "error" ? colors.error : colors.gold;
             return (
              <Card 
                key={m.id}
                onClick={() => setActiveModule(m.id)}
                borderLeft={accentColor}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border" 
                        style={{ 
                          borderColor: m.status === 'active' ? `${colors.success}4d` : m.status === 'beta' ? `${colors.warning}4d` : `${colors.error}4d`,
                          color: m.status === 'active' ? colors.success : m.status === 'beta' ? colors.warning : colors.error,
                          background: m.status === 'active' ? `${colors.success}1a` : m.status === 'beta' ? `${colors.warning}1a` : `${colors.error}1a`
                        }}>
                    {m.status}
                  </span>
                </div>
                <div className="text-xl font-semibold mb-1" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>{m.name}</div>
                <div className="text-xs leading-relaxed mb-4" style={{ color: colors.textMuted }}>{m.tagline}</div>
                <div className="h-px w-full my-4" style={{ background: colors.border }} />
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {Object.entries(m.stats).slice(0, 2).map(([k, v]) => (
                    <span key={k} className="text-[11px]" style={{ color: colors.textMuted }}>
                      <strong style={{ color: colors.text }}>{v}</strong> {k}
                    </span>
                  ))}
                </div>
              </Card>
             );
          })}
        </div>
      </div>

      {/* SRS Compliance Banner */}
      <div className="bg-surface-alt border rounded-lg p-6 lg:p-8 border-l-[4px]" 
           style={{ backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderLeftColor: colors.gold }}>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <div className="text-lg font-semibold" style={{ color: colors.text, fontFamily: "var(--font-display)" }}>IEEE SRS v1.0.0 — MannequinAI</div>
            <div className="text-sm mt-1" style={{ color: colors.textMuted }}>60+ functional requirements · 8 modules · Ghana Data Protection Act compliant · GDPR aligned</div>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider"
                 style={{ borderColor: `${colors.success}4d`, color: colors.success, background: `${colors.success}1a` }}>
              <CheckCircle2 size={12} />
              Validated
            </div>
            <div className="px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider"
                 style={{ borderColor: `${colors.gold}4d`, color: colors.gold, background: `${colors.gold}1a` }}>
              880 Paragraphs
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: "Functional Req.", value: "60+", pct: 100 },
            { label: "Security Req.", value: "OWASP A+", pct: 100 },
            { label: "Performance SLAs", value: "< 200ms", pct: 95 },
            { label: "Cultural Compliance", value: "West Africa", pct: 100 },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-[11px] uppercase tracking-wider font-bold" style={{ color: colors.textDim }}>{r.label}</span>
                <span className="text-[11px] font-bold" style={{ color: colors.gold }}>{r.value}</span>
              </div>
              <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: colors.border }}>
                <div className="h-full rounded-full" 
                     style={{ 
                       width: `${r.pct}%`, 
                       background: `linear-gradient(90deg, ${colors.gold}, ${colors.terracotta})` 
                     }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
