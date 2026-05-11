import React, { useState } from 'react';
import { ChartBarIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { DataTable } from './DataTable';

/**
 * Chart with Table View Toggle - Accessibility Enhancement
 *
 * Wrapper component that adds a toggleable data table view to any chart.
 * Provides an accessible alternative for users who cannot see or interact with charts.
 *
 * Features:
 * - Toggle between chart and table view
 * - Keyboard accessible
 * - Screen reader friendly
 * - Maintains chart interactivity
 * - Export to CSV functionality
 *
 * @component
 * @example
 * <ChartWithTable
 *   chartComponent={<YearOverYearChart data={data} />}
 *   tableData={data}
 *   tableCaption="Year-over-Year Growth Data"
 *   tableColumns={[
 *     { key: 'year', label: 'Year', sortable: true },
 *     { key: 'signups', label: 'Signups', format: formatNumber, sortable: true }
 *   ]}
 * />
 */
export const ChartWithTable = ({
  chartComponent,
  tableData,
  tableCaption,
  tableColumns,
  defaultView = 'chart', // 'chart' | 'table'
  onExportCSV,
  className = '',
  id,
}) => {
  const [viewMode, setViewMode] = useState(defaultView);

  const toggleView = () => {
    const newMode = viewMode === 'chart' ? 'table' : 'chart';
    setViewMode(newMode);

    // Announce to screen readers
    const announcement = newMode === 'chart'
      ? `Switched to chart view for ${tableCaption}`
      : `Switched to table view for ${tableCaption}`;

    announceToScreenReader(announcement);
  };

  /**
   * Announce message to screen readers
   */
  const announceToScreenReader = (message) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return (
    <div className={`chart-with-table ${className}`} id={id}>
      {/* View Toggle Controls */}
      <div className="view-toggle-container" role="group" aria-label="View mode controls">
        <button
          onClick={toggleView}
          className={`view-toggle-button ${viewMode === 'chart' ? 'active' : ''}`}
          aria-label={`Switch to ${viewMode === 'chart' ? 'table' : 'chart'} view`}
          aria-pressed={viewMode === 'chart' ? 'true' : 'false'}
          title="Toggle between chart and table view"
        >
          <ChartBarIcon className="w-5 h-5" aria-hidden="true" />
          <span>Chart View</span>
        </button>

        <button
          onClick={toggleView}
          className={`view-toggle-button ${viewMode === 'table' ? 'active' : ''}`}
          aria-label={`Switch to ${viewMode === 'table' ? 'chart' : 'table'} view`}
          aria-pressed={viewMode === 'table' ? 'true' : 'false'}
          title="View data as an accessible table"
        >
          <TableCellsIcon className="w-5 h-5" aria-hidden="true" />
          <span>Table View</span>
        </button>
      </div>

      {/* Content Area */}
      <div
        className="content-area"
        role="region"
        aria-label={`${viewMode === 'chart' ? 'Chart' : 'Table'} view of ${tableCaption}`}
      >
        {viewMode === 'chart' ? (
          <div className="chart-view">
            {chartComponent}
          </div>
        ) : (
          <div className="table-view">
            <DataTable
              data={tableData}
              caption={tableCaption}
              columns={tableColumns}
              onExportCSV={onExportCSV}
              id={`${id}-table`}
            />
          </div>
        )}
      </div>

      {/* Accessibility Hint */}
      <div className="accessibility-hint" role="note">
        <p className="sr-only">
          You can toggle between chart visualization and accessible table view using the buttons above.
          {viewMode === 'chart'
            ? ' Currently viewing chart. Press the Table View button for an accessible data table.'
            : ' Currently viewing table. Press the Chart View button for the visual chart.'}
        </p>
      </div>

      <style jsx>{`
        .chart-with-table {
          position: relative;
        }

        .view-toggle-container {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          background: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .view-toggle-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: #f9fafb;
          color: #6b7280;
          border: 2px solid transparent;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .view-toggle-button:hover {
          background: #f3f4f6;
          color: #4b5563;
        }

        .view-toggle-button.active {
          background: #4f46e5;
          color: white;
          border-color: #4f46e5;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.3);
        }

        .view-toggle-button:focus {
          outline: none;
        }

        .view-toggle-button:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
        }

        .content-area {
          animation: fadeIn 300ms ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .chart-view,
        .table-view {
          min-height: 400px;
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .view-toggle-container {
            flex-direction: column;
          }

          .view-toggle-button {
            width: 100%;
          }
        }

        /* Print Styles */
        @media print {
          .view-toggle-container {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartWithTable;
