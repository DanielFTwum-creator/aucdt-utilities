import React, { useState, useRef } from 'react';
import DataImportService from '../../services/DataImportService';
import { auditLogger } from '../../services/AuditLogger';

/**
 * Data Import Modal Component
 * 
 * Allows administrators to import analytics data from JSON files
 * 
 * Features:
 * - File upload (JSON)
 * - phpMyAdmin JSON format support
 * - Data validation
 * - Preview before import
 * - Merge strategies (replace, merge, append)
 * - Import statistics
 * - Error handling
 */

function DataImportModal({ isOpen, onClose, onImportSuccess }) {
  const [file, setFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [mergeStrategy, setMergeStrategy] = useState('replace');
  const [step, setStep] = useState('upload'); // 'upload', 'preview', 'confirm', 'complete'
  
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validate file type
    if (!selectedFile.name.endsWith('.json')) {
      alert('Please select a JSON file');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB');
      return;
    }
    
    setFile(selectedFile);
    setImportResult(null);
    console.log('✅ File selected:', selectedFile.name);
  };

  const handleProcessFile = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }
    
    setIsProcessing(true);
    setStep('preview');
    
    try {
      // Import and parse file
      const result = await DataImportService.importFromJSON(file);
      
      if (result.success) {
        setImportResult(result);
        setPreviewData(result.data);
        console.log('✅ File processed successfully');
        
        // Log the import attempt
        auditLogger.logAdminAction('DATA_IMPORT_PREVIEW', {
          filename: file.name,
          recordCount: result.stats.recordCount,
          format: result.format
        });
      } else {
        alert(`Import failed: ${result.error}`);
        setStep('upload');
        
        auditLogger.logError('DATA_IMPORT_ERROR', result.error, null);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setStep('upload');
      console.error('❌ Import error:', error);
      
      auditLogger.logError('DATA_IMPORT_ERROR', error.message, error.stack);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!previewData) return;
    
    // Call parent callback with imported data
    onImportSuccess(previewData, mergeStrategy);
    
    // Log successful import
    auditLogger.logAdminAction('DATA_IMPORTED', {
      filename: file.name,
      recordCount: importResult.stats.recordCount,
      dateRange: importResult.stats.dateRange,
      strategy: mergeStrategy
    });
    
    console.log('✅ Data import confirmed');
    
    // Move to complete step
    setStep('complete');
  };

  const handleReset = () => {
    setFile(null);
    setImportResult(null);
    setPreviewData(null);
    setStep('upload');
    setMergeStrategy('replace');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="import-modal"
        role="dialog"
        aria-labelledby="import-modal-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="import-modal-title" className="modal-title">
            <span aria-hidden="true">📥</span> Import Analytics Data
          </h2>
          <button
            onClick={handleClose}
            className="modal-close"
            aria-label="Close import modal"
            disabled={isProcessing}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="upload-section">
              <div className="upload-icon">📤</div>
              <h3>Select JSON File</h3>
              <p className="upload-description">
                Upload data exported from phpMyAdmin (JSON format)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="file-input"
                id="file-upload"
              />
              
              <label htmlFor="file-upload" className="file-label">
                {file ? (
                  <>
                    <span className="file-icon">📄</span>
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="file-icon">📁</span>
                    <span>Choose JSON File</span>
                  </>
                )}
              </label>
              
              {file && (
                <button
                  onClick={handleProcessFile}
                  className="btn-primary"
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳ Processing...' : '➡️ Process File'}
                </button>
              )}
              
              <div className="info-box">
                <strong>ℹ️ Supported Format:</strong>
                <ul>
                  <li>phpMyAdmin JSON export (v5.2.3+)</li>
                  <li>Contains MONTH, SIGNUPS, APPLICANTS, etc.</li>
                  <li>Maximum file size: 5MB</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && importResult && (
            <div className="preview-section">
              <div className="success-icon">✅</div>
              <h3>Data Preview</h3>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Records</div>
                  <div className="stat-value">{importResult.stats.recordCount}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Date Range</div>
                  <div className="stat-value">
                    {importResult.stats.dateRange.start}<br/>to<br/>{importResult.stats.dateRange.end}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Signups</div>
                  <div className="stat-value">{importResult.stats.totals.signups.toLocaleString()}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Conversion Rate</div>
                  <div className="stat-value">{importResult.stats.conversionRate}%</div>
                </div>
              </div>
              
              <div className="strategy-section">
                <h4>Import Strategy</h4>
                <div className="strategy-options">
                  <label className="strategy-option">
                    <input
                      type="radio"
                      name="strategy"
                      value="replace"
                      checked={mergeStrategy === 'replace'}
                      onChange={(e) => setMergeStrategy(e.target.value)}
                    />
                    <div>
                      <strong>Replace All</strong>
                      <p>Replace entire dataset with imported data</p>
                    </div>
                  </label>
                  
                  <label className="strategy-option">
                    <input
                      type="radio"
                      name="strategy"
                      value="merge"
                      checked={mergeStrategy === 'merge'}
                      onChange={(e) => setMergeStrategy(e.target.value)}
                    />
                    <div>
                      <strong>Merge & Update</strong>
                      <p>Update existing months, add new ones</p>
                    </div>
                  </label>
                  
                  <label className="strategy-option">
                    <input
                      type="radio"
                      name="strategy"
                      value="append"
                      checked={mergeStrategy === 'append'}
                      onChange={(e) => setMergeStrategy(e.target.value)}
                    />
                    <div>
                      <strong>Append Only</strong>
                      <p>Add only new months (skip duplicates)</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="preview-table">
                <h4>Sample Data (First 5 Records)</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Signups</th>
                      <th>Applicants</th>
                      <th>Accepted</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.slice(0, 5).map((record, index) => (
                      <tr key={index}>
                        <td>{record.month}</td>
                        <td>{record.signups}</td>
                        <td>{record.applicants}</td>
                        <td>{record.accepted}</td>
                        <td>{record.registered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewData.length > 5 && (
                  <p className="preview-note">
                    ...and {previewData.length - 5} more records
                  </p>
                )}
              </div>
              
              <div className="action-buttons">
                <button onClick={handleReset} className="btn-secondary">
                  ← Back
                </button>
                <button onClick={handleConfirmImport} className="btn-primary">
                  ✓ Confirm Import
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {step === 'complete' && (
            <div className="complete-section">
              <div className="success-icon large">🎉</div>
              <h3>Import Successful!</h3>
              <p>
                Successfully imported {importResult.stats.recordCount} records
                using <strong>{mergeStrategy}</strong> strategy.
              </p>
              
              <div className="success-stats">
                <p>✅ Date Range: {importResult.stats.dateRange.start} to {importResult.stats.dateRange.end}</p>
                <p>✅ Total Signups: {importResult.stats.totals.signups.toLocaleString()}</p>
                <p>✅ Dashboard will update automatically</p>
              </div>
              
              <button onClick={handleClose} className="btn-primary">
                Done
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          z-index: 9998;
        }

        .import-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 700px;
          max-height: 90vh;
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          z-index: 9999;
          display: flex;
          flex-direction: column;
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
          padding: 2rem;
        }

        .upload-section {
          text-align: center;
        }

        .upload-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .upload-section h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .upload-description {
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
        }

        .file-input {
          display: none;
        }

        .file-label {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: var(--color-surface-elevated);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-bottom: 1rem;
        }

        .file-label:hover {
          border-color: var(--color-primary);
          background: var(--color-surface);
        }

        .file-icon {
          font-size: 2rem;
        }

        .file-name {
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .file-size {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
          margin: 0.5rem;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
          border: 2px solid var(--color-border);
        }

        .btn-secondary:hover {
          border-color: var(--color-primary);
        }

        .info-box {
          background: #dbeafe;
          color: #1e40af;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-top: 2rem;
          text-align: left;
        }

        [data-theme="dark"] .info-box {
          background: #1e3a8a;
          color: #dbeafe;
        }

        .info-box ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        .info-box li {
          margin-bottom: 0.25rem;
        }

        .preview-section {
          text-align: center;
        }

        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .success-icon.large {
          font-size: 5rem;
        }

        .preview-section h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 1.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .strategy-section {
          margin-bottom: 2rem;
          text-align: left;
        }

        .strategy-section h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .strategy-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .strategy-option {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--color-surface-elevated);
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .strategy-option:hover {
          border-color: var(--color-primary);
        }

        .strategy-option input[type="radio"] {
          margin-top: 0.25rem;
        }

        .strategy-option strong {
          display: block;
          color: var(--color-text-primary);
          margin-bottom: 0.25rem;
        }

        .strategy-option p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .preview-table {
          margin-bottom: 2rem;
          text-align: left;
        }

        .preview-table h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .preview-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .preview-table th,
        .preview-table td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }

        .preview-table th {
          background: var(--color-surface-elevated);
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .preview-note {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        .complete-section {
          text-align: center;
        }

        .complete-section h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 1rem;
        }

        .complete-section p {
          font-size: 1.125rem;
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
        }

        .success-stats {
          background: #d1fae5;
          color: #065f46;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          margin-bottom: 2rem;
          text-align: left;
        }

        [data-theme="dark"] .success-stats {
          background: #064e3b;
          color: #d1fae5;
        }

        .success-stats p {
          margin: 0.5rem 0;
          font-size: 1rem;
        }

        @media (max-width: 640px) {
          .import-modal {
            width: 95%;
            max-height: 95vh;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}

export default DataImportModal;
