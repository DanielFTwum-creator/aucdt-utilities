import React, { useState, useEffect } from 'react';
import { apiService } from './api';
import { extractCurriculum, readPdfText } from './gemini';
import './AdminPanelTab.css';

function AdminPanelTab() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(null);
  const [applying, setApplying] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [auditQuery, setAuditQuery] = useState('');
  const [auditSort, setAuditSort] = useState({ field: 'createdAt', dir: 'desc' });

  useEffect(() => {
    loadAuditLogs();
    loadProgrammes();
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

  const loadProgrammes = async () => {
    try {
      const response = await apiService.getProgrammes();
      if (response.data.success) {
        setProgrammes(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading programmes:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setExtracted(null);
      setUploadMessage('');
    } else {
      setUploadMessage('Please select a valid PDF file');
      setPdfFile(null);
    }
  };

  const handleExtract = async () => {
    if (!pdfFile || !selectedProgramme) {
      setUploadMessage('Please select a programme and a PDF file');
      return;
    }
    setExtracting(true);
    setUploadMessage('');
    setExtracted(null);
    try {
      const text = await readPdfText(pdfFile);
      const programmeName =
        programmes.find((p) => p.id === Number(selectedProgramme))?.name || '';
      const data = await extractCurriculum(text, programmeName);
      setExtracted(data);
      if (!data.lecturers.length && !data.courses.length) {
        setUploadMessage('No lecturers or courses were found in this document.');
      }
    } catch (err) {
      setUploadMessage('Extraction failed: ' + err.message);
    } finally {
      setExtracting(false);
    }
  };

  const handleApplyConfirm = async () => {
    if (!extracted) return;
    setApplying(true);
    try {
      const response = await apiService.importCurriculum({
        programmeId: Number(selectedProgramme),
        lecturers: extracted.lecturers,
        courses: extracted.courses,
      });
      const s = response.data.data;
      setUploadMessage(
        `Curriculum imported successfully — lecturers added: ${s.lecturersAdded}, ` +
          `courses added: ${s.coursesAdded}, courses updated: ${s.coursesUpdated}.`
      );
      setPdfFile(null);
      setExtracted(null);
      setShowConfirmation(false);
      loadAuditLogs();
    } catch (err) {
      setUploadMessage(
        'Import failed: ' + (err.response?.data?.message || err.message)
      );
    } finally {
      setApplying(false);
    }
  };

  const toggleAuditSort = (field) => {
    setAuditSort((cur) =>
      cur.field === field
        ? { field, dir: cur.dir === 'asc' ? 'desc' : 'asc' }
        : { field, dir: 'asc' }
    );
  };

  const sortArrow = (field) =>
    auditSort.field === field ? (auditSort.dir === 'asc' ? ' ▲' : ' ▼') : '';

  const visibleAuditLogs = auditLogs
    .filter((log) => {
      if (!auditQuery) return true;
      const q = auditQuery.toLowerCase();
      return (
        log.eventType?.toLowerCase().includes(q) ||
        log.description?.toLowerCase().includes(q) ||
        log.details?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const { field, dir } = auditSort;
      const av = a[field] ?? '';
      const bv = b[field] ?? '';
      const cmp =
        field === 'createdAt'
          ? new Date(av) - new Date(bv)
          : String(av).localeCompare(String(bv));
      return dir === 'asc' ? cmp : -cmp;
    });

  return (
    <div className="admin-panel-tab">
      <h2>Admin Panel</h2>

      <div className="admin-sections">
        {/* Curriculum PDF Extraction */}
        <div className="admin-section">
          <h3>📄 Upload Curriculum PDF</h3>
          <p>
            Upload a programme document to extract lecturers and courses with AI,
            review the result, then apply it to the catalogue. Existing data is
            updated, never deleted — evaluations are untouched.
          </p>

          <div className="pdf-upload-area">
            <select
              id="import-programme"
              value={selectedProgramme}
              onChange={(e) => setSelectedProgramme(e.target.value)}
              aria-label="Programme to update"
            >
              <option value="">Select a programme</option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>

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

            {pdfFile && !extracted && (
              <button
                className="upload-button"
                onClick={handleExtract}
                disabled={extracting || !selectedProgramme}
              >
                {extracting ? 'Extracting…' : 'Extract with AI'}
              </button>
            )}
          </div>

          {extracted && (
            <div className="extraction-preview">
              <h4>Extraction preview</h4>
              <div className="preview-columns">
                <div>
                  <strong>Lecturers ({extracted.lecturers.length})</strong>
                  <ul>
                    {extracted.lecturers.map((l, i) => (
                      <li key={i}>{l.name}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Courses ({extracted.courses.length})</strong>
                  <ul>
                    {extracted.courses.map((c, i) => (
                      <li key={i}>
                        {c.name}
                        {c.year ? ` — Year ${c.year}` : ''}
                        {c.semester ? `, Semester ${c.semester}` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                className="upload-button"
                onClick={() => setShowConfirmation(true)}
                disabled={applying}
              >
                Apply to Catalogue
              </button>
            </div>
          )}

          {showConfirmation && (
            <div className="confirmation-modal">
              <div className="modal-content">
                <h4>Confirm import</h4>
                <p>
                  This adds the extracted lecturers and adds/updates the courses for
                  the selected programme. Nothing is deleted and evaluations are not
                  affected. The import is recorded in the audit log.
                </p>
                <div className="modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowConfirmation(false)}
                    disabled={applying}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-confirm"
                    onClick={handleApplyConfirm}
                    disabled={applying}
                  >
                    {applying ? 'Importing…' : 'Proceed'}
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

          <div className="audit-search">
            <input
              type="text"
              placeholder="Search by event, description or details..."
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
              aria-label="Search audit logs"
            />
          </div>

          {loading ? (
            <div className="loading">Loading audit logs...</div>
          ) : visibleAuditLogs.length === 0 ? (
            <div className="no-data">No audit logs found</div>
          ) : (
            <div className="audit-logs-table">
              <table>
                <thead>
                  <tr>
                    <th className="sortable" onClick={() => toggleAuditSort('eventType')}>
                      Event Type{sortArrow('eventType')}
                    </th>
                    <th className="sortable" onClick={() => toggleAuditSort('description')}>
                      Description{sortArrow('description')}
                    </th>
                    <th>Status</th>
                    <th className="sortable" onClick={() => toggleAuditSort('createdAt')}>
                      Timestamp{sortArrow('createdAt')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleAuditLogs.map((log) => (
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
