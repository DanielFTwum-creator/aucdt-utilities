import React from 'react';
import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { formatMonth, formatNumber, formatPercentage } from '../../../utils/formatters';
import { MetricSelector } from './MetricSelector';

/**
 * Dashboard Header Component - Magazine Quality Edition
 * 
 * Premium header with professional styling, icons, and typography
 * 
 * Features:
 * - Professional SVG icons (Heroicons)
 * - Proper date/number formatting
 * - Enhanced typography hierarchy  
 * - Magazine-quality styling
 * - Full WCAG 2.1 AA accessibility
 * - Premium animations
 * 
 * @component
 */
export const DashboardHeader = ({
  insights,
  dateRange,
  selectedMetrics,
  onDateRangeChange,
  onMetricsChange,
  onPrint,
  onExport,
  onFilter,
  onAdmin,
  onLogout,
  activeFilterCount = 0
}) => {
  if (!insights) return null;

  const { latestMonth, trends, acceptanceRate, currentMonth } = insights;

  return (
    <header 
      className="premium-header"
      role="banner"
    >
      {/* Header Content */}
      <div className="header-content">
        {/* Title Section */}
        <div className="title-section">
          <div className="flex items-center gap-3 mb-3">
            <div className="icon-badge">
              <SparklesIcon className="w-7 h-7 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="premium-title">
                Advanced Analytics Suite
              </h1>
              <p className="premium-subtitle">
                5 Deep-Dive Charts for Strategic Insights
              </p>
            </div>
          </div>
        </div>

        {/* Metric Quick-Toggle */}
        {selectedMetrics && onMetricsChange && (
          <div className="px-1 pb-1">
            <MetricSelector selectedMetrics={selectedMetrics} onChange={onMetricsChange} />
          </div>
        )}

        {/* Control Buttons */}
        <div className="controls-section" role="group" aria-label="Dashboard controls">
          {/* Filter Button */}
          <button 
            onClick={onFilter}
            className="premium-button"
            aria-label={`Open filter panel${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
            title="Filter data by date range and metrics"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" aria-hidden="true" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="filter-badge" aria-label={`${activeFilterCount} filters active`}>
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {/* Export Button */}
          <button 
            onClick={onExport}
            className="premium-button"
            aria-label="Export dashboard data"
            title="Export to PDF, Excel, or CSV"
          >
            <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
            <span>Export</span>
          </button>
          
          {/* Print Button */}
          <button 
            onClick={onPrint}
            className="premium-button"
            aria-label="Print dashboard"
            title="Print dashboard"
          >
            <PrinterIcon className="w-5 h-5" aria-hidden="true" />
            <span>Print</span>
          </button>
          
          {/* Admin Button */}
          <button 
            onClick={onAdmin}
            className="premium-button admin-button"
            aria-label="Open admin panel"
            title="Access admin panel and audit logs"
          >
            <Cog6ToothIcon className="w-5 h-5" aria-hidden="true" />
            <span>Admin</span>
          </button>
          
          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="premium-button logout-button"
            aria-label="Logout"
            title="Logout from dashboard"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="quick-stats-bar">
        {/* Latest Update */}
        <div className="stat-item">
          <div className="stat-label">Last Updated</div>
          <div className="stat-value">{formatMonth(latestMonth)}</div>
        </div>
        
        {/* Signup Trend */}
        {trends && trends.signups !== undefined && (
          <div className="stat-item">
            <div className="stat-label">Monthly Growth</div>
            <div className="stat-value trend">
              {trends.signups > 0 ? (
                <span className="trend-positive">
                  +{formatNumber(trends.signups)} signups
                </span>
              ) : trends.signups < 0 ? (
                <span className="trend-negative">
                  {formatNumber(trends.signups)} signups
                </span>
              ) : (
                <span className="trend-neutral">No change</span>
              )}
            </div>
          </div>
        )}
        
        {/* Acceptance Rate */}
        {acceptanceRate !== undefined && (
          <div className="stat-item">
            <div className="stat-label">Acceptance Rate</div>
            <div className="stat-value">{formatPercentage(acceptanceRate)}</div>
          </div>
        )}
        
        {/* Current Month Stats */}
        {currentMonth && (
          <div className="stat-item highlighted">
            <div className="stat-label">Current Month</div>
            <div className="stat-value">
              <strong>{formatNumber(currentMonth.signups)}</strong> signups,{' '}
              <strong>{formatNumber(currentMonth.accepted)}</strong> accepted
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .premium-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 2.5rem;
          margin-bottom: 2.5rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .premium-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .header-content {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .title-section {
          flex: 1;
        }

        .icon-badge {
          width: 3rem;
          height: 3rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .premium-title {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0;
        }

        .premium-subtitle {
          font-size: 1.125rem;
          font-weight: 500;
          opacity: 0.95;
          margin: 0.5rem 0 0 0;
          letter-spacing: 0.01em;
        }

        .controls-section {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: flex-start;
        }

        .premium-button {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          color: white;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .premium-button:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .premium-button:active {
          transform: translateY(0);
        }

        .premium-button:focus {
          outline: none;
        }

        .premium-button:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: 3px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3), 0 20px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .premium-button.admin-button {
          background: rgba(251, 191, 36, 0.15);
          border-color: rgba(251, 191, 36, 0.4);
        }

        .premium-button.admin-button:hover {
          background: rgba(251, 191, 36, 0.25);
          border-color: rgba(251, 191, 36, 0.6);
        }

        .premium-button.logout-button {
          background: rgba(239, 68, 68, 0.15);
          border-color: rgba(239, 68, 68, 0.4);
        }

        .premium-button.logout-button:hover {
          background: rgba(239, 68, 68, 0.25);
          border-color: rgba(239, 68, 68, 0.6);
        }

        .filter-badge {
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
          min-width: 1.5rem;
          height: 1.5rem;
          padding: 0 0.375rem;
          background: #ef4444;
          border: 2px solid white;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        .quick-stats-bar {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 1.5rem;
        }

        .stat-item {
          flex: 1;
          min-width: 180px;
        }

        .stat-item.highlighted {
          padding: 0.75rem 1.25rem;
          background: rgba(251, 191, 36, 0.2);
          border: 1px solid rgba(251, 191, 36, 0.3);
          border-radius: 1rem;
        }

        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
          margin-bottom: 0.375rem;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 700;
          line-height: 1.3;
        }

        .stat-value strong {
          font-weight: 800;
        }

        .trend-positive {
          color: #86efac;
        }

        .trend-negative {
          color: #fca5a5;
        }

        .trend-neutral {
          opacity: 0.7;
        }

        @media (max-width: 1024px) {
          .header-content {
            flex-direction: column;
            gap: 1.5rem;
          }

          .controls-section {
            width: 100%;
            justify-content: flex-start;
          }

          .premium-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 640px) {
          .premium-header {
            padding: 1.5rem;
          }

          .premium-title {
            font-size: 2rem;
          }

          .premium-subtitle {
            font-size: 1rem;
          }

          .controls-section {
            gap: 0.5rem;
          }

          .premium-button {
            padding: 0.625rem 1rem;
            font-size: 0.8125rem;
          }

          .quick-stats-bar {
            flex-direction: column;
            gap: 1rem;
          }

          .stat-item {
            min-width: 100%;
          }
        }
      `}</style>
    </header>
  );
};

export default DashboardHeader;
