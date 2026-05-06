import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/AdminPanelTab.css';

function AdminPanelTab() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      const response = await apiService.getAuditLogs();
      if (response.data.success) {
        setAuditLogs(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setUploadMessage('');
    } else {
      setUploadMessage('Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const handleUploadConfirm = async () => {
    if (!pdfFile) return;

    setUploading(true);
    try {
      const response = await apiService.extractPdf(pdfFile);
      if (response.data.success) {
        setUploadMessage('PDF processed successfully! Curriculum data has been updated.');
        setPdfFile(null);
        setShowConfirmation(false);
        loadAuditLogs();
      } else {
        setUploadMessage('Failed to process PDF: ' + response.data.message);
      }
    } catch (err) {
      setUploadMessage('Error uploading PDF: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-panel-tab">
      <h2>Admin Panel</h2>

      <div className="admin-sections">
        {/* PDF Upload Section */}
        <div className="admin-section">
          <h3>📄 Upload Curriculum PDF</h3>
          <p>Upload a timetable PDF to extract and update curriculum data.</p>

          <div className="pdf-upload-area">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              id="pdf-input"
              className="pdf-input"
            />
            <label htmlFor="pdf-input" className="pdf-label">
              {pdfFile ? `Selected: ${pdfFile.name}` : 'Click to select PDF file'}
            </label>

            {pdfFile && (
              <button
                className="upload-button"
                onClick={() => setShowConfirmation(true)}
                disabled={uploading}
              >
                {uploading ? 'Processing...' : 'Upload & Process'}
              </button>
            )}
          </div>

          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="modal-content">
                <h4>⚠️ Warning</h4>
                <p>
                  Uploading this PDF will delete all existing evaluation data and replace it with
                  new curriculum data. This action cannot be undone.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowConfirmation(false)}
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={handleUploadConfirm}
                    disabled={uploading}
                  >
                    {uploading ? 'Processing...' : 'Proceed'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {uploadMessage && (
            <div className={`message ${uploadMessage.includes('successfully') ? 'success' : 'error'}`}>
              {uploadMessage}
            </div>
          )}
        </div>

        {/* Audit Logs Section */}
        <div className="admin-section">
          <h3>📋 Audit Logs</h3>
          <p>System events and activities</p>

          {loading ? (
            <div className="loading">Loading audit logs...</div>
          ) : auditLogs.length === 0 ? (
            <div className="no-data">No audit logs found</div>
          ) : (
            <div className="audit-logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Event Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <span className="event-type">{log.eventType}</span>
                      </td>
                      <td>{log.description}</td>
                      <td>
                        <span className={`status ${log.status?.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanelTab;

