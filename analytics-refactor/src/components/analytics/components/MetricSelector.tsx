import React, { useCallback, useId } from 'react';

const ALL_METRICS = [
  { key: 'signups',     label: 'Signups',     color: '#6366f1' },
  { key: 'applicants',  label: 'Applicants',  color: '#8b5cf6' },
  { key: 'accepted',    label: 'Accepted',    color: '#10b981' },
  { key: 'rejected',    label: 'Rejected',    color: '#ef4444' },
  { key: 'waitlisted',  label: 'Waitlisted',  color: '#f59e0b' },
  { key: 'registered',  label: 'Registered',  color: '#3b82f6' },
] as const;

type MetricKey = typeof ALL_METRICS[number]['key'];

interface MetricSelectorProps {
  selectedMetrics: string[];
  onChange: (metrics: string[]) => void;
}

/**
 * MetricSelector — inline quick-toggle for which metrics are visible across charts.
 * Persisted to localStorage via AdvancedAnalytics.
 */
export const MetricSelector: React.FC<MetricSelectorProps> = ({ selectedMetrics, onChange }) => {
  const labelId = useId();

  const isAll = selectedMetrics.includes('all') || selectedMetrics.length === ALL_METRICS.length;

  const isSelected = useCallback(
    (key: MetricKey) => isAll || selectedMetrics.includes(key),
    [isAll, selectedMetrics],
  );

  const toggle = (key: MetricKey) => {
    if (isAll) {
      // Deselect this one, keep all others
      const next = ALL_METRICS.map((m) => m.key).filter((k) => k !== key);
      onChange(next);
    } else if (selectedMetrics.includes(key)) {
      // Deselect — must keep at least one
      const next = selectedMetrics.filter((k) => k !== key);
      if (next.length === 0) return;
      onChange(next.length === ALL_METRICS.length ? ['all'] : next);
    } else {
      const next = [...selectedMetrics, key];
      onChange(next.length === ALL_METRICS.length ? ['all'] : next);
    }
  };

  const selectAll = () => onChange(['all']);

  return (
    <div role="group" aria-labelledby={labelId} className="flex flex-wrap items-center gap-1.5 py-1">
      <span id={labelId} className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-1 sr-only">
        Metrics
      </span>

      {/* All button */}
      <button
        type="button"
        onClick={selectAll}
        aria-pressed={isAll}
        className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
          isAll
            ? 'bg-gray-800 text-white border-gray-800'
            : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
        }`}
      >
        All
      </button>

      {ALL_METRICS.map(({ key, label, color }) => {
        const active = isSelected(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            aria-pressed={active}
            className={`px-2.5 py-1 text-xs font-medium rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              active
                ? 'text-white border-transparent'
                : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
            }`}
            style={
              active
                ? { backgroundColor: color, borderColor: color, '--tw-ring-color': color } as React.CSSProperties
                : { '--tw-ring-color': color } as React.CSSProperties
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default MetricSelector;
