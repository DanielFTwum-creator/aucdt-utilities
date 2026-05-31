import React from 'react';

/**
 * Clinical Analysis summary — metric cards + range legend whose accents are
 * driven by the value's clinical band (green = normal, amber = pre-diabetes /
 * elevated, red = diabetes / hypo). Bands follow standard fasting-glucose
 * thresholds in mmol/L; values are converted for display when unit is mg/dL.
 */

interface ClinicalAnalysisProps {
  highest: number | null;      // base mmol/L
  overall: number | null;      // base mmol/L
  readingCount: number;
  unit: string;                // 'mmol/L' | 'mg/dL'
  isHighContrast: boolean;
}

const RED = '#dc2626';
const GREEN = '#059669';
const AMBER = '#d97706';

// Fasting / general clinical bands (mmol/L) — shared so the top stat cards and
// this analysis section colour identically (DRY).
export function band(v: number | null) {
  if (v == null) return null;
  if (v < 3.9) return { label: 'Low', color: RED };
  if (v <= 5.5) return { label: 'Normal', color: GREEN };
  if (v <= 6.9) return { label: 'Pre-diabetes', color: AMBER };
  return { label: 'Diabetes', color: RED };
}

// Post-prandial (2 hrs) bands (mmol/L)
export function bandPost(v: number | null) {
  if (v == null) return null;
  if (v < 7.8) return { label: 'On target', color: GREEN };
  if (v <= 11.0) return { label: 'Elevated', color: AMBER };
  return { label: 'High', color: RED };
}

export const ClinicalAnalysis: React.FC<ClinicalAnalysisProps> = ({
  highest, overall, readingCount, unit, isHighContrast,
}) => {
  const toMgdl = unit === 'mg/dL';
  const disp = (v: number | null) => v == null ? '—' : (toMgdl ? Math.round(v * 18.0182).toString() : v.toFixed(1));
  const f = (x: number) => toMgdl ? Math.round(x * 18.0182).toString() : x.toFixed(1);
  const range = (lo: number | null, hiV: number | null) =>
    lo == null ? `< ${f(hiV!)}` : hiV == null ? `≥ ${f(lo)}` : `${f(lo)}–${f(hiV)}`;

  const cards = [
    { label: 'Highest Reading', v: highest, b: band(highest), note: 'Peak in the period' },
    { label: 'Overall Average', v: overall, b: band(overall), note: `${readingCount} readings recorded` },
  ];

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
    <div className="flex flex-col gap-5 print:block">
      <h2 className={`text-[11px] font-bold uppercase tracking-widest ${subCol}`}>Clinical Analysis ({unit})</h2>

      {/* Metric cards — left accent driven by clinical band */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 print:flex print:flex-wrap">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`${cardBg} border rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none`}
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

      {/* Clinical range legend */}
      <div className={`${cardBg} border rounded-2xl p-6 shadow-sm print:border-slate-300 print:shadow-none`}>
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
  );
};
