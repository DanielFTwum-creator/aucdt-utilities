import React from 'react';

interface ClinicalAnalysisProps {
  highest: number | null;      // base mmol/L
  overall: number | null;      // base mmol/L
  readingCount: number;
  unit: string;                // 'mmol/L' | 'mg/dL'
  isHighContrast: boolean;
  patterns?: { type: string; description: string; severity: string }[];
}

const ACUTE_RED = '#dc2626';     // True acute states (Hypoglycemia)
const WARNING_ORANGE = '#ea580c'; // Elevated / Diabetes ranges
const GREEN = '#059669';
const AMBER = '#d97706';

// Fasting / general clinical bands (mmol/L) — shared so the top stat cards and
// this analysis section colour identically (DRY).
export function band(v: number | null) {
  if (v == null) return null;
  if (v < 3.9) return { label: 'Hypoglycaemia', color: ACUTE_RED };
  if (v <= 5.5) return { label: 'Normal', color: GREEN };
  if (v <= 6.9) return { label: 'Pre-diabetes', color: AMBER };
  return { label: 'Diabetes', color: WARNING_ORANGE };
}

// Post-prandial (2 hrs) bands (mmol/L)
export function bandPost(v: number | null) {
  if (v == null) return null;
  if (v < 7.8) return { label: 'On target', color: GREEN };
  if (v <= 11.0) return { label: 'Elevated', color: AMBER };
  return { label: 'High', color: WARNING_ORANGE };
}

export const ClinicalAnalysis: React.FC<ClinicalAnalysisProps> = ({
  highest, overall, readingCount, unit, isHighContrast, patterns,
}) => {
  const toMgdl = unit === 'mg/dL';
  const disp = (v: number | null) => v == null ? '—' : (toMgdl ? Math.round(v * 18.0182).toString() : v.toFixed(1));

  const cards = [
    { label: 'Highest Reading', v: highest, b: band(highest), note: 'Peak in the period' },
    { label: 'Overall Average', v: overall, b: band(overall), note: `${readingCount} readings recorded` },
  ];

  const cardBg = isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200';
  const titleCol = isHighContrast ? 'text-white' : 'text-slate-900';
  const subCol = isHighContrast ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="flex flex-col gap-3 print:block">
      <h2 className={`text-[11px] font-bold uppercase tracking-widest ${subCol}`}>Clinical Analysis ({unit})</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Insights */}
        <div className="lg:col-span-7 flex flex-col gap-5 justify-between">
          {/* Clinical Insights Alert Section */}
          {patterns && patterns.length > 0 && (
            <div className={`${cardBg} border rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500 flex-grow`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className={`text-[10px] font-bold uppercase tracking-widest ${subCol}`}>System-Generated Pattern Observations</h3>
              </div>
              <ul className="space-y-3">
                {patterns.map((p, i) => (
                  <li key={i} className="flex flex-col">
                    <span className={`text-[14px] font-bold ${titleCol}`}>{p.type}</span>
                    <span className={`text-[12px] ${subCol}`}>{p.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Metric Cards */}
        <div className="lg:col-span-5 flex flex-col gap-5 justify-between">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`${cardBg} border rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none flex-1 flex flex-col justify-center`}
              style={{ borderLeftWidth: 4, borderLeftColor: c.b?.color || 'transparent' }}
            >
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${subCol}`}>{c.label}</p>
              <div className="flex items-end gap-2 mb-1">
                <div
                  className="text-4xl font-mono font-bold tabular-nums tracking-tighter"
                  style={{ color: c.b?.color || (isHighContrast ? '#ffffff' : '#0f172a') }}
                >
                  {disp(c.v)}
                </div>
                {c.b && (
                  <span
                    className="text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider mb-1.5"
                    style={{ backgroundColor: c.b.color + '1A', color: c.b.color }}
                  >
                    {c.b.label}
                  </span>
                )}
              </div>
              <p className={`text-[12px] font-medium mt-1 ${subCol}`}>{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
