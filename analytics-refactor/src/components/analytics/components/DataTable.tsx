import React, { useMemo, useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowsUpDownIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

/**
 * Accessible Data Table Component - WCAG 2.1 AA Compliant
 *
 * Provides an accessible alternative to chart visualizations with:
 * - Screen reader friendly table structure
 * - Sortable columns with keyboard support
 * - ARIA labels and semantic HTML
 * - Responsive design
 * - Export to CSV functionality
 * - Keyboard navigation
 *
 * @component
 * @example
 * <DataTable
 *   data={chartData}
 *   caption="Year-over-Year Growth Data"
 *   columns={[
 *     { key: 'year', label: 'Year', sortable: true },
 *     { key: 'signups', label: 'Signups', format: formatNumber, sortable: true }
 *   ]}
 * />
 */
export const DataTable = ({
  data,
  caption,
  columns,
  onExportCSV,
  className = '',
  maxHeight = '600px',
  id,
}) => {
  const [sortConfig, setSortConfig] = useState(null);

  /**
   * Sort data based on current sort configuration
   */
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (aStr < bStr) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aStr > bStr) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  /**
   * Request sorting by column
   */
  const requestSort = (key) => {
    let direction = 'asc';

    // Toggle direction if same column
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  /**
   * Handle keyboard navigation on sortable headers
   */
  const handleKeyDown = (e, key) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      requestSort(key);
    }
  };

  /**
   * Export table data to CSV
   */
  const handleExport = () => {
    if (onExportCSV) {
      onExportCSV(sortedData);
      return;
    }

    // Default CSV export
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(row =>
      columns.map(col => {
        const value = row[col.key];
        const formatted = col.format ? col.format(value) : value;
        // Escape commas and quotes
        return `"${String(formatted).replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = `${caption.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!data || data.length === 0) {
    return (
      <div className="data-table-empty" role="status">
        <p>No data available to display.</p>
      </div>
    );
  }

  return (
    <div className={`data-table-container ${className}`} id={id}>
      {/* Table Header with Caption and Export */}
      <div className="data-table-header">
        <h3 className="data-table-caption" id={`${id}-caption`}>
          {caption}
        </h3>
        <button
          onClick={handleExport}
          className="export-button"
          aria-label={`Export ${caption} to CSV`}
          title="Export table data to CSV file"
        >
          <ArrowDownTrayIcon className="w-5 h-5" aria-hidden="true" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Scrollable Table Wrapper */}
      <div
        className="data-table-wrapper"
        style={{ maxHeight }}
        role="region"
        aria-labelledby={`${id}-caption`}
        tabIndex="0"
      >
        <table
          className="data-table"
          role="table"
          aria-label={caption}
          aria-describedby={`${id}-info`}
        >
          <caption className="sr-only">{caption}</caption>

          {/* Table Head */}
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={`table-header ${column.sortable ? 'sortable' : ''}`}
                  onClick={column.sortable ? () => requestSort(column.key) : undefined}
                  onKeyDown={column.sortable ? (e) => handleKeyDown(e, column.key) : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  aria-sort={
                    sortConfig?.key === column.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : column.sortable
                      ? 'none'
                      : undefined
                  }
                  role="columnheader"
                >
                  <div className="header-content">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="sort-icon" aria-hidden="true">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUpIcon className="w-4 h-4" />
                          ) : (
                            <ArrowDownIcon className="w-4 h-4" />
                          )
                        ) : (
                          <ArrowsUpDownIcon className="w-4 h-4 opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                  {column.sortable && (
                    <span className="sr-only">
                      {sortConfig?.key === column.key
                        ? `Sorted ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`
                        : 'Not sorted'}
                      . Press Enter to sort.
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="table-row">
                {columns.map((column, colIndex) => {
                  const value = row[column.key];
                  const formattedValue = column.format ? column.format(value) : value;

                  return (
                    <td
                      key={column.key}
                      className="table-cell"
                      role="cell"
                      data-label={column.label}
                    >
                      {colIndex === 0 ? (
                        <th scope="row" className="row-header">
                          {formattedValue}
                        </th>
                      ) : (
                        <span>{formattedValue}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Info */}
      <div id={`${id}-info`} className="data-table-info" role="status" aria-live="polite">
        Showing {sortedData.length} {sortedData.length === 1 ? 'row' : 'rows'}
        {sortConfig && (
          <span>
            {' '}• Sorted by {columns.find(c => c.key === sortConfig.key)?.label}{' '}
            ({sortConfig.direction === 'asc' ? 'ascending' : 'descending'})
          </span>
        )}
      </div>

      <style jsx>{`
        .data-table-container {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }

        .data-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-bottom: 2px solid #e5e7eb;
        }

        .data-table-caption {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .export-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.625rem 1.25rem;
          background: #4f46e5;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .export-button:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        .export-button:active {
          transform: translateY(0);
        }

        .export-button:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: 2px;
          box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.3);
        }

        .data-table-wrapper {
          overflow-x: auto;
          overflow-y: auto;
          position: relative;
        }

        .data-table-wrapper:focus {
          outline: 2px solid #4f46e5;
          outline-offset: -2px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .table-header {
          background: #f9fafb;
          color: #1f2937;
          font-weight: 600;
          text-align: left;
          padding: 1rem;
          border-bottom: 2px solid #e5e7eb;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .table-header.sortable {
          cursor: pointer;
          user-select: none;
          transition: background-color 150ms;
        }

        .table-header.sortable:hover {
          background: #f3f4f6;
        }

        .table-header.sortable:focus {
          outline: none;
        }

        .table-header.sortable:focus-visible {
          outline: 3px solid #fbbf24;
          outline-offset: -3px;
          box-shadow: inset 0 0 0 3px rgba(251, 191, 36, 0.3);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: space-between;
        }

        .sort-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          color: #4f46e5;
        }

        .table-row {
          transition: background-color 150ms;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-row:nth-child(even) {
          background: #fafafa;
        }

        .table-row:nth-child(even):hover {
          background: #f3f4f6;
        }

        .table-cell {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          color: #4b5563;
        }

        .row-header {
          font-weight: 600;
          color: #1f2937;
        }

        .data-table-info {
          padding: 1rem 1.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          font-size: 0.8125rem;
          color: #6b7280;
          text-align: center;
        }

        .data-table-empty {
          padding: 3rem;
          text-align: center;
          color: #6b7280;
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .data-table-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .export-button {
            width: 100%;
            justify-content: center;
          }

          /* Stack table on mobile */
          .data-table thead {
            display: none;
          }

          .table-row {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            overflow: hidden;
          }

          .table-cell {
            display: block;
            text-align: right;
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #f3f4f6;
          }

          .table-cell:last-child {
            border-bottom: none;
          }

          .table-cell::before {
            content: attr(data-label);
            float: left;
            font-weight: 600;
            color: #1f2937;
          }

          .row-header {
            background: #f9fafb;
            font-size: 1rem;
            text-align: left !important;
          }
        }

        /* Print Styles */
        @media print {
          .data-table-header,
          .export-button,
          .data-table-info {
            display: none;
          }

          .data-table-wrapper {
            max-height: none !important;
            overflow: visible !important;
          }

          .table-row:nth-child(even) {
            background: #fafafa !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DataTable;
