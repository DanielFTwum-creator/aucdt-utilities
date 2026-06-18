import React from 'react';

/**
 * Clinical Analysis summary — insights panel (left) and range legend (right).
 * Metric cards (Highest Reading, Overall Average) were moved to the stats row.
 */

interface ClinicalAnalysisProps {
  unit: string;
  isHighContrast: boolean;
  patterns?: { type: string; description: string; severity: string }[];
}

const RED = '#dc2626';
const GREEN = '#059669';
const AMBER = '#d97706';

export function band(v: number | null) {
  if (v == null) return null;
  if (v < 3.9) return { label: 'Low', color: RED };
  if (v <= 5.5) return { label: 'Normal', color: GREEN };
  if (v <= 6.9) return { label: 'Pre-diabetes', color: AMBER };
  return { label: 'Diabetes', color: RED };
}

export function bandPost(v: number | null) {
  if (v == null) return null;
  if (v < 7.8) return { label: 'On target', color: GREEN };
  if (v <= 11.0) return { label: 'Elevated', color: AMBER };
  return { label: 'High', color: RED };
}

export const ClinicalAnalysis: React.FC<ClinicalAnalysisProps> = ({
  unit, isHighContrast, patterns,
}) => {
  const toMgdl = unit === 'mg/dL';
  const f = (x: number) => toMgdl ? Math.round(x * 18.0182).toString() : x.toFixed(1);
  const range = (lo: number | null, hiV: number | null) =>
    lo == null ? `< ${f(hiV!)}` : hiV == null ? `≥ ${f(lo)}` : `${f(lo)}–${f(hiV)}`;

  const ranges = [
    { label: 'Hypoglycaemia', value: range(null, 3.9), color: RED },
    { label: 'Normal Fasting', value: range(3.9, 5.5), color: GREEN },
    { label: 'Pre-Diabetes', value: range(5.6, 6.9), color: AMBER },
    { label: 'Diabetes Range', value: range(7.0, null), color: RED },
  ];

  const cardBg = isHighContrast ? 'bg-black border-gray-600' : 'bg-white border-slate-200';
  const titleCol = isHighContrast ? 'text-white' : 'text-slate-900';
  const subCol = isHighContrast ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="flex flex-col gap-3 print:block">
      <h2 className={`text-[11px] font-bold uppercase tracking-widest ${subCol}`}>Clinical Analysis ({unit})</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Clinical Insights */}
        <div className="lg:col-span-7 flex flex-col">
          {patterns && patterns.length > 0 ? (
            <div className={`${cardBg} border rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500 flex-grow`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h3 className={`text-[10px] font-bold uppercase tracking-widest ${subCol}`}>Clinical Insights & Patterns</h3>
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
          ) : (
            <div className={`${cardBg} border rounded-2xl p-6 shadow-sm flex-grow flex items-center justify-center`}>
              <p className={`text-[13px] italic ${subCol}`}>No clinical patterns detected for this period.</p>
            </div>
          )}
        </div>

        {/* Right: Clinical Glucose Ranges */}
        <div className="lg:col-span-5 flex flex-col">
          <div className={`${cardBg} border rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none flex-grow`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${subCol}`}>Clinical Glucose Ranges ({unit})</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ranges.map((r) => (
                <div key={r.label} className="text-center">
                  <div className="h-1.5 w-full rounded-full mb-2" style={{ backgroundColor: r.color }} />
                  <p className={`text-[13px] font-semibold ${titleCol}`}>{r.label}</p>
                  <p className="text-[15px] font-bold tabular-nums" style={{ color: r.color }}>{r.value}</p>
                </div>
              ))}
            </div>
            <p className={`text-[11px] mt-4 ${subCol}`}>
              Note: post-meal target &lt; {toMgdl ? '140' : '7.8'} {unit} (2 hrs after a meal). Bands follow standard fasting-glucose clinical thresholds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
