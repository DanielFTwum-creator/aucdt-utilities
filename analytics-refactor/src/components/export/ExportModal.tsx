import React, { useState } from 'react';
import { useExport } from '../../contexts/ExportContext';

/**
 * Export Modal Component
 * 
 * Provides UI for exporting dashboard data in multiple formats:
 * - PDF: Full report with charts and branding
 * - CSV: Raw data for spreadsheet analysis
 * - Excel: Multi-sheet workbook with formatting
 * - Print: Current view screenshot
 * 
 * Features:
 * - Format selection
 * - Export options (what to include)
 * - Progress indicator
 * - Success/error feedback
 */

function ExportModal({ isOpen, onClose, data, stats }) {
  const { exportToCSV, exportToExcel, exportToPDF, exportCurrentView, isExporting, exportProgress } = useExport();
  
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeData: true,
    includeStats: true,
    dateRange: 'all'
  });
  const [exportStatus, setExportStatus] = useState(null); // 'success' | 'error' | null

  if (!isOpen) return null;

  const handleExport = async () => {
    setExportStatus(null);
    
    const timestamp = new Date().toISOString().split('T')[0];
    let result;

    switch (selectedFormat) {
      case 'csv':
        result = await exportToCSV(data, `analytics-data-${timestamp}.csv`);
        break;
      
      case 'excel':
        result = await exportToExcel(data, stats, `analytics-report-${timestamp}.xlsx`);
        break;
      
      case 'pdf':
        result = await exportToPDF(data, stats, {
          filename: `analytics-dashboard-${timestamp}.pdf`,
          ...exportOptions
        });
        break;
      
      case 'print':
        result = await exportCurrentView();
        break;
      
      default:
        result = { success: false, error: 'Unknown format' };
    }

    if (result.success) {
      setExportStatus('success');
      setTimeout(() => {
        onClose();
        setExportStatus(null);
      }, 2000);
    } else {
      setExportStatus('error');
    }
  };

  const formatOptions = [
    {
      id: 'pdf',
      name: 'PDF Report',
      icon: '📄',
      description: 'Complete report with branding',
      size: '~500 KB'
    },
    {
      id: 'excel',
      name: 'Excel Workbook',
      icon: '📊',
      description: 'Multi-sheet with formulas',
      size: '~200 KB'
    },
    {
      id: 'csv',
      name: 'CSV Data',
      icon: '📋',
      description: 'Raw data for analysis',
      size: '~50 KB'
    },
    {
      id: 'print',
      name: 'Print View',
      icon: '🖨️',
      description: 'Current screen view',
      size: 'N/A'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="export-modal"
        role="dialog"
        aria-labelledby="export-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="export-modal-title" className="modal-title">
            <span aria-hidden="true">💾</span> Export Dashboard
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close export modal"
            disabled={isExporting}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          
          {/* Format Selection */}
          <section className="modal-section">
            <h3 className="section-label">Choose Format</h3>
            <div className="format-grid">
              {formatOptions.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`format-card ${selectedFormat === format.id ? 'selected' : ''}`}
                  aria-pressed={selectedFormat === format.id ? 'true' : 'false'}
                >
                  <div className="format-icon" aria-hidden="true">{format.icon}</div>
                  <div className="format-name">{format.name}</div>
                  <div className="format-description">{format.description}</div>
                  <div className="format-size">{format.size}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Export Options (for PDF) */}
          {selectedFormat === 'pdf' && (
            <section className="modal-section">
              <h3 className="section-label">Include in Export</h3>
              <div className="options-list">
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeStats}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeStats: e.target.checked
                    }))}
                  />
                  <span>Summary Statistics</span>
                </label>
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeData}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeData: e.target.checked
                    }))}
                  />
                  <span>Monthly Data Table</span>
                </label>
                <label className="option-item">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeCharts: e.target.checked
                    }))}
                    disabled
                  />
                  <span>Chart Images <small>(Coming soon)</small></span>
                </label>
              </div>
            </section>
          )}

          {/* Export Info */}
          <section className="modal-section info-section">
            <div className="info-box">
              <strong>ℹ️ Export Details:</strong>
              <ul>
                <li>Data includes {data?.length || 0} months of records</li>
                <li>Generated on {new Date().toLocaleDateString()}</li>
                <li>Includes TECHBRIDGE branding and headers</li>
                {selectedFormat === 'excel' && (
                  <li>Excel includes multiple sheets and formulas</li>
                )}
                {selectedFormat === 'pdf' && (
                  <li>PDF optimized for A4 printing</li>
                )}
              </ul>
            </div>
          </section>

          {/* Progress Bar */}
          {isExporting && (
            <div className="progress-section">
              <div className="progress-label">Exporting... {exportProgress}%</div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${exportProgress}%` }}
                  role="progressbar"
                  aria-label="Export progress"
                  aria-valuenow={exportProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {exportStatus === 'success' && (
            <div className="status-message success">
              <span aria-hidden="true">✅</span> Export completed successfully!
            </div>
          )}
          {exportStatus === 'error' && (
            <div className="status-message error">
              <span aria-hidden="true">❌</span> Export failed. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="btn-secondary"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="btn-primary"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <span className="spinner" aria-hidden="true">⏳</span> Exporting...
              </>
            ) : (
              <>
                <span aria-hidden="true">💾</span> Export {selectedFormat.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
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

        .export-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-close {
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

        .modal-close:hover:not(:disabled) {
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
        }

        .modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .modal-section {
          margin-bottom: 1.5rem;
        }

        .modal-section:last-child {
          margin-bottom: 0;
        }

        .section-label {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .format-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .format-card {
          padding: 1rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: center;
        }

        .format-card:hover {
          border-color: var(--color-primary);
          background: var(--color-surface-elevated);
          transform: translateY(-2px);
        }

        .format-card.selected {
          border-color: var(--color-primary);
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .format-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .format-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .format-description {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-bottom: 0.25rem;
        }

        .format-size {
          font-size: 0.7rem;
          opacity: 0.6;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background var(--transition-fast);
        }

        .option-item:hover {
          background: var(--color-surface-elevated);
        }

        .option-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .option-item input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .info-section {
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
          padding: 1rem;
        }

        .info-box {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .info-box ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        .info-box li {
          margin-bottom: 0.25rem;
        }

        .progress-section {
          margin-top: 1rem;
        }

        .progress-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          height: 8px;
          background: var(--color-border);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary), var(--color-primary-light));
          transition: width 0.3s ease;
        }

        .status-message {
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          text-align: center;
          margin-top: 1rem;
        }

        .status-message.success {
          background: #d1fae5;
          color: #065f46;
        }

        [data-theme="dark"] .status-message.success {
          background: #064e3b;
          color: #d1fae5;
        }

        .status-message.error {
          background: #fee2e2;
          color: #991b1b;
        }

        [data-theme="dark"] .status-message.error {
          background: #7f1d1d;
          color: #fee2e2;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid var(--color-border);
        }

        .btn-secondary,
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
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-border);
        }

        .btn-primary {
          background: var(--color-primary);
          color: var(--color-text-inverse);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .btn-secondary:disabled,
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile responsive */
        @media (max-width: 640px) {
          .export-modal {
            width: 95%;
            max-height: 95vh;
          }

          .format-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-footer {
            flex-direction: column;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}

export default ExportModal;
