import React from 'react';

interface ClinicalAnalysisProps {
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
  unit, isHighContrast, patterns,
}) => {
  const cardBg = isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200';
  const titleCol = isHighContrast ? 'text-white' : 'text-slate-900';
  const subCol = isHighContrast ? 'text-slate-400' : 'text-slate-500';

  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 print:block">
      <h2 className={`text-[11px] font-bold uppercase tracking-widest ${subCol}`}>Clinical Analysis ({unit})</h2>

      {/* Clinical Insights Alert Section */}
      <div className={`${cardBg} border rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500 w-full`}>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          <h3 className={`text-[10px] font-bold uppercase tracking-widest ${subCol}`}>System-Generated Pattern Observations</h3>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {patterns.map((p, i) => (
            <li key={i} className="flex flex-col bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100/50 dark:border-amber-900/30">
              <span className={`text-[14px] font-bold ${titleCol}`}>{p.type}</span>
              <span className={`text-[12px] ${subCol}`}>{p.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
