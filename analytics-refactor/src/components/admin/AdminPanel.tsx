import React, { useState, useEffect, useCallback } from 'react';
import { auditLogger } from '../../services/AuditLogger';
import DataImportModal from './DataImportModal';
import TestPanel from './TestPanel';

/**
 * Admin Panel Component
 * 
 * Provides administrative controls:
 * - View audit logs
 * - Export logs
 * - System statistics
 * - Data management
 * - User management (future)
 * 
 * Password protected, separate from regular login
 */

function AdminPanel({ isOpen, onClose, onDataImport, currentData }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('logs');
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    severity: '',
    action: '',
    user: ''
  });
  const [stats, setStats] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PANEL_PASSWORD || 'admin2024';

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      auditLogger.logAdminAction('ADMIN_LOGIN', { success: true });
      console.log('✅ Admin authenticated');
    } else {
      setError('Invalid admin password');
      auditLogger.logSecurity('ADMIN_LOGIN_FAILED', { attempt: password });
      console.warn('⚠️ Failed admin login attempt');
    }
  };

  const loadLogs = useCallback(() => {
    const filteredLogs = auditLogger.getLogs(filters);
    setLogs(filteredLogs);
  }, [filters]);

  const loadStats = useCallback(() => {
    const statistics = auditLogger.getStatistics();
    setStats(statistics);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadLogs();
      loadStats();
    }
  }, [isAuthenticated, loadLogs, loadStats]);

  const handleExportLogs = () => {
    auditLogger.exportLogs();
    auditLogger.logAdminAction('LOGS_EXPORTED', { count: logs.length });
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all audit logs? This cannot be undone.')) {
      auditLogger.clearLogs();
      loadLogs();
      auditLogger.logAdminAction('LOGS_CLEARED', { cleared: true });
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: '#3b82f6',
      warning: '#f59e0b',
      error: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || '#6b7280';
  };

  if (!isOpen) return null;

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <>
        <div className="modal-backdrop" onClick={onClose} />
        <div className="admin-modal">
          <div className="admin-header">
            <h2>🔐 Admin Access</h2>
            <button onClick={onClose} className="close-btn">✕</button>
          </div>
          
          <form onSubmit={handleLogin} className="admin-login-form">
            <p className="admin-warning">
              ⚠️ Administrative access required
            </p>
            
            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="admin-password">Admin Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                required
              />
            </div>
            
            <button type="submit" className="btn-primary">
              Unlock Admin Panel
            </button>
            
            <p className="admin-note">
              <small>Default: admin2024 (change in production)</small>
            </p>
          </form>
        </div>
      </>
    );
  }

  // Admin panel (authenticated)
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="admin-modal large">
        <div className="admin-header">
          <h2>⚙️ Admin Panel</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📋 Audit Logs
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
          <button
            className={`tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            📥 Data Import
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className={`tab ${activeTab === 'refresh' ? 'active' : ''}`}
            onClick={() => setActiveTab('refresh')}
          >
            🔄 Refresh Status
          </button>
          <button
            className={`tab ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            🧪 System Test
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          
          {/* Refresh Status Tab */}
          {activeTab === 'refresh' && (
            <div className="refresh-panel">
              <div className="panel-header">
                <h3>🔄 Phased Project Refresh Status</h3>
                <span className="phase-badge">Phase 2: Security & UX</span>
              </div>
              
              <div className="refresh-timeline">
                <div className="refresh-step completed">
                  <div className="step-icon">✅</div>
                  <div className="step-content">
                    <h4>PHASE 1: FOUNDATION SETUP</h4>
                    <p>React 19.2.4 verified, IEEE SRS v3.0.0 generated, Phase 1 Gap Analysis complete.</p>
                  </div>
                </div>

                <div className="refresh-step active">
                  <div className="step-icon">🔄</div>
                  <div className="step-content">
                    <h4>PHASE 2: CORE IMPLEMENTATION</h4>
                    <p>Harding Admin security, enhancing audit logging, and verifying WCAG accessibility.</p>
                  </div>
                </div>

                <div className="refresh-step pending">
                  <div className="step-icon">⏳</div>
                  <div className="step-content">
                    <h4>PHASE 3: TESTING FRAMEWORK</h4>
                    <p>Integrating Puppeteer E2E suite and interactive simulation dashboard.</p>
                  </div>
                </div>

                <div className="refresh-step pending">
                  <div className="step-icon">⏳</div>
                  <div className="step-content">
                    <h4>PHASE 4: DOCUMENTATION & DIAGRAMS</h4>
                    <p>Generating Architecture SVGs and comprehensive project guides.</p>
                  </div>
                </div>

                <div className="refresh-step pending">
                  <div className="step-icon">⏳</div>
                  <div className="step-content">
                    <h4>PHASE 5: FINAL ALIGNMENT</h4>
                    <p>Synchronizing SRS with as-built state and organizing /docs directory.</p>
                  </div>
                </div>
              </div>

              <style jsx>{`
                .refresh-timeline {
                  display: flex;
                  flex-direction: column;
                  gap: 1.5rem;
                  margin-top: 1.5rem;
                }
                .refresh-step {
                  display: flex;
                  gap: 1.5rem;
                  padding: 1.5rem;
                  background: var(--color-surface-elevated);
                  border-radius: var(--radius-lg);
                  border-left: 4px solid transparent;
                }
                .refresh-step.completed { border-left-color: #10b981; }
                .refresh-step.active { border-left-color: var(--color-primary); background: var(--color-primary-light); }
                .refresh-step.pending { border-left-color: var(--color-border); opacity: 0.6; }
                .step-icon { font-size: 1.5rem; }
                .step-content h4 { margin: 0 0 0.25rem 0; font-size: 0.875rem; letter-spacing: 0.05em; color: var(--color-text-primary); }
                .step-content p { margin: 0; font-size: 0.875rem; color: var(--color-text-secondary); }
                .phase-badge { padding: 0.25rem 0.75rem; background: var(--color-primary); color: white; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }
              `}</style>
            </div>
          )}
          {activeTab === 'logs' && (
            <div className="logs-panel">
              <div className="panel-header">
                <h3>Audit Logs ({logs.length})</h3>
                <div className="panel-actions">
                  <button onClick={handleExportLogs} className="btn-secondary">
                    💾 Export CSV
                  </button>
                  <button onClick={handleClearLogs} className="btn-danger">
                    🗑️ Clear Logs
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="filters">
                <select
                  value={filters.severity}
                  onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                >
                  <option value="">All Severities</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>

                <input
                  type="text"
                  placeholder="Filter by action..."
                  value={filters.action}
                  onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                />

                <input
                  type="text"
                  placeholder="Filter by user..."
                  value={filters.user}
                  onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                />

                <button onClick={() => setFilters({ severity: '', action: '', user: '' })}>
                  🔄 Reset
                </button>
              </div>

              {/* Logs Table */}
              <div className="logs-table">
                <table>
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Severity</th>
                      <th>Action</th>
                      <th>User</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                          No audit logs found
                        </td>
                      </tr>
                    ) : (
                      logs.map(log => (
                        <tr key={log.id}>
                          <td className="timestamp">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td>
                            <span
                              className="severity-badge"
                              style={{ backgroundColor: getSeverityColor(log.severity) }}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="action">{log.action}</td>
                          <td>{log.user}</td>
                          <td className="details">
                            <details>
                              <summary>View</summary>
                              <pre>{JSON.stringify(log.details, null, 2)}</pre>
                            </details>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && stats && (
            <div className="stats-panel">
              <h3>System Statistics</h3>
              
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Logs</div>
                </div>

                <div className="stat-card info">
                  <div className="stat-value">{stats.bySeverity.info}</div>
                  <div className="stat-label">Info</div>
                </div>

                <div className="stat-card warning">
                  <div className="stat-value">{stats.bySeverity.warning}</div>
                  <div className="stat-label">Warnings</div>
                </div>

                <div className="stat-card error">
                  <div className="stat-value">{stats.bySeverity.error}</div>
                  <div className="stat-label">Errors</div>
                </div>

                <div className="stat-card critical">
                  <div className="stat-value">{stats.bySeverity.critical}</div>
                  <div className="stat-label">Critical</div>
                </div>
              </div>

              <h4>Recent Activity</h4>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.recentActivity.last24Hours}</div>
                  <div className="stat-label">Last 24 Hours</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.recentActivity.lastWeek}</div>
                  <div className="stat-label">Last Week</div>
                </div>

                <div className="stat-card">
                  <div className="stat-value">{stats.recentActivity.lastMonth}</div>
                  <div className="stat-label">Last Month</div>
                </div>
              </div>

              <h4>Actions Breakdown</h4>
              <div className="actions-list">
                {Object.entries(stats.byAction).map(([action, count]) => (
                  <div key={action} className="action-item">
                    <span className="action-name">{action}</span>
                    <span className="action-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data Import Tab */}
          {activeTab === 'import' && (
            <div className="import-panel">
              <h3>Data Import</h3>
              <p className="panel-description">
                Import analytics data from JSON files exported from phpMyAdmin
              </p>
              
              <div className="import-section">
                <div className="import-card">
                  <div className="import-icon">📥</div>
                  <h4>Import from JSON</h4>
                  <p>Upload phpMyAdmin JSON export to update dashboard data</p>
                  <button 
                    onClick={() => setIsImportModalOpen(true)}
                    className="btn-primary"
                  >
                    📤 Select JSON File
                  </button>
                </div>
                
                <div className="import-info">
                  <strong>ℹ️ Import Instructions:</strong>
                  <ol>
                    <li>Export data from phpMyAdmin as JSON format</li>
                    <li>Click "Select JSON File" button above</li>
                    <li>Choose your exported JSON file</li>
                    <li>Preview and confirm the import</li>
                    <li>Data will be validated and imported</li>
                  </ol>
                  
                  <strong className="mt-3">📋 Required Format:</strong>
                  <ul>
                    <li>phpMyAdmin JSON export (v5.2.3+)</li>
                    <li>Must contain: MONTH, SIGNUPS, APPLICANTS, ACCEPTED, REJECTED, WAITLISTED, REGISTERED</li>
                    <li>Date format: YYYY-MM (e.g., 2026-01)</li>
                    <li>Maximum file size: 5MB</li>
                  </ul>
                  
                  <strong className="mt-3">⚙️ Import Strategies:</strong>
                  <ul>
                    <li><strong>Replace All:</strong> Replace entire dataset</li>
                    <li><strong>Merge & Update:</strong> Update existing, add new</li>
                    <li><strong>Append Only:</strong> Add only new months</li>
                  </ul>
                </div>
              </div>
              
              <div className="import-recent">
                <h4>Recent Imports</h4>
                <div className="recent-imports-list">
                  {auditLogger.getLogsByAction('DATA_IMPORTED').slice(0, 5).map((log, index) => (
                    <div key={index} className="recent-import-item">
                      <div className="import-date">{new Date(log.timestamp).toLocaleString()}</div>
                      <div className="import-details">
                        {log.details.filename} - {log.details.recordCount} records
                      </div>
                      <div className="import-strategy">{log.details.strategy}</div>
                    </div>
                  ))}
                  {auditLogger.getLogsByAction('DATA_IMPORTED').length === 0 && (
                    <p className="no-imports">No imports yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-panel">
              <h3>System Settings</h3>
              
              <div className="setting-section">
                <h4>Audit Log Settings</h4>
                <button onClick={() => auditLogger.clearOldLogs(500)} className="btn-secondary">
                  Clear Old Logs (Keep Last 500)
                </button>
                <p className="setting-description">
                  Remove old audit logs while keeping recent entries
                </p>
              </div>

              <div className="setting-section">
                <h4>Data Management</h4>
                <button className="btn-secondary" disabled>
                  📤 Upload Data (Coming Soon)
                </button>
                <p className="setting-description">
                  Import admissions data from CSV or Excel files
                </p>
              </div>

              <div className="setting-section">
                <h4>User Management</h4>
                <button className="btn-secondary" disabled>
                  👥 Manage Users (Coming Soon)
                </button>
                <p className="setting-description">
                  Add, edit, or remove user accounts
                </p>
              </div>

              <div className="setting-section danger">
                <h4>Danger Zone</h4>
                <button onClick={handleClearLogs} className="btn-danger">
                  🗑️ Clear All Audit Logs
                </button>
                <p className="setting-description">
                  ⚠️ This action cannot be undone
                </p>
              </div>
            </div>
          )}

          {/* System Test Tab */}
          {activeTab === 'tests' && (
            <TestPanel currentData={currentData} onClose={() => setActiveTab('logs')} />
          )}
        </div>
      </div>

      {/* Data Import Modal */}
      <DataImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={(data, strategy) => {
          // Close import modal
          setIsImportModalOpen(false);
          
          // Call parent callback to update main data
          if (onDataImport) {
            onDataImport(data, strategy);
          }
          
          // Show success message
          alert(`✅ Successfully imported ${data.length} records using ${strategy} strategy!`);
          
          console.log('✅ Data import completed and propagated to dashboard');
        }}
      />

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          z-index: 9998;
        }

        .admin-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          background: var(--color-surface);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-2xl);
          z-index: 9999;
          display: flex;
          flex-direction: column;
        }

        .admin-modal.large {
          max-width: 1200px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--color-border);
        }

        .admin-header h2 {
          margin: 0;
          font-size: 1.5rem;
          color: var(--color-text-primary);
        }

        .close-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          font-size: 1.5rem;
          cursor: pointer;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .close-btn:hover {
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
        }

        .admin-login-form {
          padding: 2rem;
        }

        .admin-warning {
          background: #fef3c7;
          color: #92400e;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        [data-theme="dark"] .admin-warning {
          background: #78350f;
          color: #fef3c7;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--color-text-primary);
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--color-primary);
        }

        .btn-primary,
        .btn-secondary,
        .btn-danger {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: var(--radius-md);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          width: 100%;
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
        }

        .btn-secondary {
          background: var(--color-surface-elevated);
          color: var(--color-text-primary);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-border);
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .admin-note {
          text-align: center;
          margin-top: 1rem;
          color: var(--color-text-secondary);
        }

        .admin-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
          padding: 0 1.5rem;
          gap: 0.5rem;
        }

        .tab {
          padding: 1rem 1.5rem;
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          font-weight: 600;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all var(--transition-fast);
        }

        .tab:hover {
          color: var(--color-text-primary);
        }

        .tab.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .panel-header h3 {
          margin: 0;
          color: var(--color-text-primary);
        }

        .panel-actions {
          display: flex;
          gap: 0.5rem;
        }

        .filters {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .filters select,
        .filters input {
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
        }

        .filters button {
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          color: var(--color-text-primary);
          cursor: pointer;
        }

        .logs-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }

        th {
          background: var(--color-surface-elevated);
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .timestamp {
          font-family: monospace;
          font-size: 0.875rem;
        }

        .severity-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .action {
          font-weight: 600;
        }

        .details summary {
          cursor: pointer;
          color: var(--color-primary);
        }

        .details pre {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          overflow-x: auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .stat-card.info { border-left: 4px solid #3b82f6; }
        .stat-card.warning { border-left: 4px solid #f59e0b; }
        .stat-card.error { border-left: 4px solid #ef4444; }
        .stat-card.critical { border-left: 4px solid #dc2626; }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .action-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-md);
        }

        .action-count {
          font-weight: 600;
          color: var(--color-primary);
        }

        .setting-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
        }

        .setting-section.danger {
          border: 2px solid #ef4444;
        }

        .setting-section h4 {
          margin: 0 0 1rem 0;
          color: var(--color-text-primary);
        }

        .setting-description {
          margin: 0.5rem 0 0 0;
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .import-panel h3 {
          margin-bottom: 0.5rem;
        }

        .panel-description {
          color: var(--color-text-secondary);
          margin-bottom: 2rem;
        }

        .import-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .import-card {
          padding: 2rem;
          background: var(--color-surface-elevated);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .import-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .import-card h4 {
          margin: 1rem 0 0.5rem 0;
          color: var(--color-text-primary);
        }

        .import-card p {
          color: var(--color-text-secondary);
          margin-bottom: 1.5rem;
        }

        .import-info {
          padding: 1.5rem;
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
        }

        .import-info strong {
          display: block;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }

        .import-info strong.mt-3 {
          margin-top: 1.5rem;
        }

        .import-info ol,
        .import-info ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        .import-info li {
          margin-bottom: 0.5rem;
          color: var(--color-text-secondary);
        }

        .import-recent h4 {
          margin-bottom: 1rem;
          color: var(--color-text-primary);
        }

        .recent-imports-list {
          background: var(--color-surface-elevated);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .recent-import-item {
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .recent-import-item:last-child {
          border-bottom: none;
        }

        .import-date {
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .import-details {
          flex: 1;
          margin: 0 1rem;
          color: var(--color-text-primary);
        }

        .import-strategy {
          padding: 0.25rem 0.75rem;
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .no-imports {
          padding: 2rem;
          text-align: center;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        @media (max-width: 768px) {
          .admin-modal.large {
            max-width: 95%;
          }

          .filters {
            flex-direction: column;
          }

          .filters select,
          .filters input,
          .filters button {
            width: 100%;
          }

          .panel-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .panel-actions {
            width: 100%;
          }

          .panel-actions button {
            flex: 1;
          }

          .import-section {
            grid-template-columns: 1fr;
          }

          .recent-import-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}

export default AdminPanel;
