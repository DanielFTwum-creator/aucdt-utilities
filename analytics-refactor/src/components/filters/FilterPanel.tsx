import React, { useState } from 'react';
import DateRangeFilter from '../analytics/components/DateRangeFilter';

/**
 * Filter Panel Component
 * 
 * Provides advanced filtering options:
 * - Date range selection (presets + custom)
 * - Metric selection (which data to show)
 * - Year comparison
 * - Save/load filter presets
 * 
 * Features:
 * - Quick presets (Last 6 months, This year, etc.)
 * - Custom date range picker
 * - Multi-select metrics
 * - Filter persistence
 */

function FilterPanel({ isOpen, onClose, onApplyFilters, currentFilters = {} }) {
  const [datePreset, setDatePreset] = useState(currentFilters.datePreset || 'all-time');
  const [customDateRange, setCustomDateRange] = useState({
    start: currentFilters.customStart ? new Date(currentFilters.customStart) : null,
    end: currentFilters.customEnd ? new Date(currentFilters.customEnd) : null
  });
  const [selectedMetrics, setSelectedMetrics] = useState(currentFilters.selectedMetrics || [
    'signups', 'applicants', 'accepted', 'registered'
  ]);
  const [compareYears, setCompareYears] = useState(currentFilters.compareYears || []);

  if (!isOpen) return null;

  const datePresets = [
    { value: 'all-time', label: '📅 All Time', description: 'Complete dataset' },
    { value: 'last-30-days', label: '📆 Last 30 Days', description: 'Past month' },
    { value: 'last-3-months', label: '📊 Last 3 Months', description: 'Current quarter' },
    { value: 'last-6-months', label: '📈 Last 6 Months', description: 'Half year' },
    { value: 'last-12-months', label: '📉 Last 12 Months', description: 'Full year' },
    { value: 'this-year', label: '🗓️ This Year', description: new Date().getFullYear().toString() },
    { value: 'last-year', label: '🗓️ Last Year', description: (new Date().getFullYear() - 1).toString() },
    { value: 'custom', label: '⚙️ Custom Range', description: 'Select dates' }
  ];

  const availableMetrics = [
    { key: 'signups', label: 'Signups', color: '#3b82f6', icon: '👥' },
    { key: 'applicants', label: 'Applicants', color: '#8b5cf6', icon: '📝' },
    { key: 'accepted', label: 'Accepted', color: '#10b981', icon: '✅' },
    { key: 'rejected', label: 'Rejected', color: '#ef4444', icon: '❌' },
    { key: 'waitlisted', label: 'Waitlisted', color: '#f59e0b', icon: '⏸️' },
    { key: 'registered', label: 'Registered', color: '#f97316', icon: '⭐' }
  ];

  const availableYears = [];
  const currentYear = new Date().getFullYear();
  for (let year = 2017; year <= currentYear; year++) {
    availableYears.push(year);
  }

  const handleMetricToggle = (metricKey) => {
    setSelectedMetrics(prev => {
      if (prev.includes(metricKey)) {
        // Don't allow deselecting all metrics
        if (prev.length === 1) return prev;
        return prev.filter(m => m !== metricKey);
      } else {
        return [...prev, metricKey];
      }
    });
  };

  const handleYearToggle = (year) => {
    setCompareYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year].sort((a, b) => b - a);
      }
    });
  };

  const handleApply = () => {
    const filters = {
      datePreset,
      customStart: datePreset === 'custom' ? customDateRange.start : '',
      customEnd: datePreset === 'custom' ? customDateRange.end : '',
      selectedMetrics,
      compareYears
    };
    
    onApplyFilters(filters);
    console.log('🔍 Filters applied:', filters);
  };

  const handleReset = () => {
    setDatePreset('all-time');
    setCustomDateRange({ start: null, end: null });
    setSelectedMetrics(['signups', 'applicants', 'accepted', 'registered']);
    setCompareYears([]);
    console.log('🔄 Filters reset');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (datePreset !== 'all-time') count++;
    if (selectedMetrics.length < availableMetrics.length) count++;
    if (compareYears.length > 0) count++;
    return count;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="filter-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Filter Panel */}
      <div
        className="filter-panel"
        role="dialog"
        aria-labelledby="filter-panel-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="filter-header">
          <h2 id="filter-panel-title" className="filter-title">
            <span aria-hidden="true">🔍</span> Filter Data
          </h2>
          <button
            onClick={onClose}
            className="filter-close"
            aria-label="Close filter panel"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="filter-content">
          
          {/* Date Range Section */}
          <section className="filter-section">
            <h3 className="section-title">
              <span aria-hidden="true">📅</span> Date Range
            </h3>
            <div className="preset-grid">
              {datePresets.map(preset => (
                <button
                  key={preset.value}
                  onClick={() => setDatePreset(preset.value)}
                  className={`preset-card ${datePreset === preset.value ? 'active' : ''}`}
                  aria-pressed={datePreset === preset.value}
                >
                  <div className="preset-label">{preset.label}</div>
                  <div className="preset-description">{preset.description}</div>
                </button>
              ))}
            </div>

            {/* Custom Date Range Inputs */}
            {datePreset === 'custom' && (
              <div className="custom-date-range">
                <DateRangeFilter value={customDateRange} onChange={setCustomDateRange} />
              </div>
            )}
          </section>

          {/* Metrics Selection */}
          <section className="filter-section">
            <h3 className="section-title">
              <span aria-hidden="true">📊</span> Data Series
            </h3>
            <p className="section-description">
              Select which metrics to display in charts
            </p>
            <div className="metrics-grid">
              {availableMetrics.map(metric => (
                <label
                  key={metric.key}
                  className={`metric-checkbox ${selectedMetrics.includes(metric.key) ? 'checked' : ''}`}
                  style={{
                    borderColor: selectedMetrics.includes(metric.key) ? metric.color : 'var(--color-border)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.key)}
                    onChange={() => handleMetricToggle(metric.key)}
                  />
                  <span className="metric-icon" aria-hidden="true">{metric.icon}</span>
                  <span className="metric-label">{metric.label}</span>
                </label>
              ))}
            </div>
            <div className="metrics-actions">
              <button
                onClick={() => setSelectedMetrics(availableMetrics.map(m => m.key))}
                className="btn-link"
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedMetrics(['signups', 'applicants', 'accepted', 'registered'])}
                className="btn-link"
              >
                Reset to Default
              </button>
            </div>
          </section>

          {/* Year Comparison */}
          <section className="filter-section">
            <h3 className="section-title">
              <span aria-hidden="true">📈</span> Compare Years
            </h3>
            <p className="section-description">
              Overlay multiple years for comparison (optional)
            </p>
            <div className="years-grid">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => handleYearToggle(year)}
                  className={`year-button ${compareYears.includes(year) ? 'active' : ''}`}
                  aria-pressed={compareYears.includes(year)}
                >
                  {year}
                </button>
              ))}
            </div>
            {compareYears.length > 0 && (
              <div className="comparison-note">
                <span aria-hidden="true">ℹ️</span> Selected: {compareYears.join(', ')}
              </div>
            )}
          </section>

          {/* Active Filters Summary */}
          {getActiveFilterCount() > 0 && (
            <div className="active-filters">
              <strong>Active Filters: {getActiveFilterCount()}</strong>
              <ul>
                {datePreset !== 'all-time' && (
                  <li>Date: {datePresets.find(p => p.value === datePreset)?.label}</li>
                )}
                {selectedMetrics.length < availableMetrics.length && (
                  <li>Metrics: {selectedMetrics.length} of {availableMetrics.length} selected</li>
                )}
                {compareYears.length > 0 && (
                  <li>Comparing {compareYears.length} year(s)</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="filter-footer">
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            <span aria-hidden="true">🔄</span> Reset
          </button>
          <div className="footer-actions">
            <button
              onClick={onClose}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="btn-primary"
            >
              <span aria-hidden="true">✓</span> Apply Filters
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .filter-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 9998;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .filter-panel {
          position: fixed;
          right: 0;
          top: 0;
          height: 100vh;
          width: 90%;
          max-width: 500px;
          background: var(--color-surface);
          box-shadow: var(--shadow-2xl);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: slideInRight 0.3s ease;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .filter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
        }

        .filter-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-close {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .filter-close:hover {
          background: var(--color-surface);
          color: var(--color-text-primary);
        }

        .filter-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .filter-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--color-border);
        }

        .filter-section:last-child {
          border-bottom: none;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .section-description {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .preset-card {
          padding: 1rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }

        .preset-card:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-elevated);
        }

        .preset-card.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .preset-label {
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .preset-description {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .custom-date-range {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .date-input-group {
          flex: 1;
        }

        .date-input-group label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .date-input-group input {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          font-size: 0.875rem;
        }

        .date-input-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .metric-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .metric-checkbox:hover {
          background: var(--color-surface-elevated);
        }

        .metric-checkbox.checked {
          background: var(--color-surface-elevated);
        }

        .metric-checkbox input[type="checkbox"] {
          margin: 0;
        }

        .metric-icon {
          font-size: 1.25rem;
        }

        .metric-label {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metrics-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
        }

        .btn-link {
          border: none;
          background: transparent;
          color: var(--color-primary);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .btn-link:hover {
          color: var(--color-primary-dark);
        }

        .years-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .year-button {
          padding: 0.75rem 0.5rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .year-button:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-elevated);
        }

        .year-button.active {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .comparison-note {
          margin-top: 1rem;
          padding: 0.75rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .active-filters {
          background: #dbeafe;
          color: #1e40af;
          padding: 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
        }

        [data-theme="dark"] .active-filters {
          background: #1e3a8a;
          color: #dbeafe;
        }

        .active-filters ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        .active-filters li {
          margin-bottom: 0.25rem;
        }

        .filter-footer {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface-elevated);
        }

        .footer-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-secondary,
        .btn-cancel,
        .btn-primary {
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: var(--color-surface);
          color: var(--color-text-primary);
          border: 2px solid var(--color-border);
        }

        .btn-secondary:hover {
          border-color: var(--color-primary);
        }

        .btn-cancel {
          background: var(--color-surface);
          color: var(--color-text-primary);
          border: 2px solid var(--color-border);
        }

        .btn-cancel:hover {
          background: var(--color-border);
        }

        .btn-primary {
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .filter-panel {
            max-width: 100%;
            width: 100%;
          }

          .preset-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .years-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .custom-date-range {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default FilterPanel;
