# lems - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for lems.

### FILE: .env.local
```text
GEMINI_API_KEY=[REDACTED_CREDENTIAL]
VITE_GEMINI_API_KEY=[REDACTED_CREDENTIAL]

```

### FILE: AdminDashboard.css
```css
.admin-dashboard {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
}

.logout-button {
  background-color: var(--error-color);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0;
  overflow-x: auto;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: var(--secondary-color);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--primary-color);
  background-color: rgba(37, 99, 235, 0.05);
}

.tab-button.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-label {
  font-size: 1rem;
}

/* Tab Content */
.tab-content {
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 2rem;
  animation: fadeIn 0.3s ease;
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

@media (max-width: 1024px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .tabs-navigation {
    gap: 0.25rem;
  }

  .tab-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
  }

  .tab-icon {
    font-size: 1rem;
  }

  .tab-label {
    display: none;
  }

  .tab-content {
    padding: 1rem;
  }
}


```

### FILE: AdminDashboard.js
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import OverviewTab from '../components/tabs/OverviewTab';
import ResultsTab from '../components/tabs/ResultsTab';
import LecturersTab from '../components/tabs/LecturersTab';
import ProgrammesTab from '../components/tabs/ProgrammesTab';
import AnalyticsTab from '../components/tabs/AnalyticsTab';
import AdminPanelTab from '../components/tabs/AdminPanelTab';
import GuidesTab from '../components/tabs/GuidesTab';
import SelfTestTab from '../components/tabs/SelfTestTab';
import '../styles/AdminDashboard.css';

function AdminDashboard({ theme, onThemeChange, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'programmes', label: 'Programmes' },
    { id: 'results', label: 'Results' },
    { id: 'lecturers', label: 'Lecturers' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'guides', label: 'Guides' },
    { id: 'admin', label: 'Admin Panel' },
    { id: 'selftest', label: 'Self Test' },
  ];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'programmes':
        return <ProgrammesTab />;
      case 'results':
        return <ResultsTab />;
      case 'lecturers':
        return <LecturersTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'guides':
        return <GuidesTab />;
      case 'admin':
        return <AdminPanelTab />;
      case 'selftest':
        return <SelfTestTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Header theme={theme} onThemeChange={onThemeChange} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="tabs-navigation">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


```

### FILE: AdminPanelTab.css
```css
.admin-panel-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  padding: 1.5rem;
  background-color: rgba(100, 116, 139, 0.05);
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
}

.admin-section h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.admin-section > p {
  margin: 0 0 1rem 0;
  color: var(--secondary-color);
}

/* PDF Upload Area */
.pdf-upload-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: var(--bg-color);
  border: 2px dashed var(--border-color);
  border-radius: 0.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.pdf-upload-area:hover {
  border-color: var(--primary-color);
  background-color: rgba(37, 99, 235, 0.05);
}

.pdf-input {
  display: none;
}

.pdf-label {
  padding: 1rem;
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pdf-label:hover {
  background-color: rgba(37, 99, 235, 0.2);
}

.upload-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.upload-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.upload-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Confirmation Modal */
.confirmation-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-content h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--warning-color);
}

.modal-content p {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.btn-cancel {
  background-color: var(--secondary-color);
  color: white;
}

.btn-cancel:hover:not(:disabled) {
  background-color: #475569;
}

.btn-confirm {
  background-color: var(--error-color);
  color: white;
}

.btn-confirm:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Messages */
.message {
  padding: 1rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.message.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  border-left: 4px solid var(--success-color);
}

.message.error {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border-left: 4px solid var(--error-color);
}

/* Audit Logs Table */
.audit-logs-table {
  overflow-x: auto;
  margin-top: 1rem;
}

.audit-logs-table table {
  width: 100%;
  border-collapse: collapse;
}

.audit-logs-table thead {
  background-color: rgba(37, 99, 235, 0.1);
}

.audit-logs-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

.audit-logs-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.audit-logs-table tbody tr:hover {
  background-color: rgba(100, 116, 139, 0.05);
}

.event-type {
  display: inline-block;
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 600;
  font-size: 0.875rem;
}

.status.success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
}

.status.failure {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

@media (max-width: 768px) {
  .admin-section {
    padding: 1rem;
  }

  .pdf-upload-area {
    padding: 1rem;
  }

  .modal-content {
    max-width: 90%;
    padding: 1.5rem;
  }

  .audit-logs-table table {
    font-size: 0.875rem;
  }

  .audit-logs-table th,
  .audit-logs-table td {
    padding: 0.75rem;
  }
}


```

### FILE: AdminPanelTab.js
```javascript
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


```

### FILE: AnalyticsTab.css
```css
.analytics-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.analytics-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: linear-gradient(135deg, var(--primary-color), #1e40af);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  text-align: center;
}

.summary-card h3 {
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.big-number {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.analytics-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: rgba(100, 116, 139, 0.05);
  border-radius: 0.5rem;
}

.analytics-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rating-bar label {
  min-width: 100px;
  font-weight: 500;
}

.bar-container {
  flex: 1;
  height: 30px;
  background-color: rgba(100, 116, 139, 0.1);
  border-radius: 0.375rem;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #1e40af);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: width 0.3s ease;
}

@media (max-width: 768px) {
  .analytics-summary {
    grid-template-columns: 1fr;
  }

  .rating-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-bar label {
    min-width: auto;
  }
}


```

### FILE: AnalyticsTab.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/AnalyticsTab.css';

function AnalyticsTab() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRatings, setAverageRatings] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await apiService.getAllEvaluations();
      if (response.data.success) {
        const evals = response.data.data || [];
        setEvaluations(evals);
        calculateAverageRatings(evals);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRatings = (evals) => {
    const ratingMap = {};
    let totalRatings = 0;
    let sumRatings = 0;

    evals.forEach((evaluation) => {
      if (evaluation.ratings) {
        evaluation.ratings.forEach((rating) => {
          if (!ratingMap[rating.criteriaNumber]) {
            ratingMap[rating.criteriaNumber] = { sum: 0, count: 0 };
          }
          ratingMap[rating.criteriaNumber].sum += rating.rating;
          ratingMap[rating.criteriaNumber].count += 1;
          sumRatings += rating.rating;
          totalRatings += 1;
        });
      }
    });

    const averages = {};
    Object.keys(ratingMap).forEach((key) => {
      averages[key] = (ratingMap[key].sum / ratingMap[key].count).toFixed(2);
    });

    setAverageRatings({
      averages,
      overallAverage: totalRatings > 0 ? (sumRatings / totalRatings).toFixed(2) : 0,
      totalRatings,
    });
  };

  return (
    <div className="analytics-tab">
      <h2>Analytics & Insights</h2>

      {loading ? (
        <div className="loading">Loading analytics...</div>
      ) : (
        <>
          <div className="analytics-summary">
            <div className="summary-card">
              <h3>Overall Average Rating</h3>
              <p className="big-number">{averageRatings.overallAverage || 0}</p>
              <p className="subtitle">out of 5.0</p>
            </div>
            <div className="summary-card">
              <h3>Total Ratings</h3>
              <p className="big-number">{averageRatings.totalRatings || 0}</p>
              <p className="subtitle">criteria rated</p>
            </div>
            <div className="summary-card">
              <h3>Total Evaluations</h3>
              <p className="big-number">{evaluations.length}</p>
              <p className="subtitle">submissions</p>
            </div>
          </div>

          <div className="analytics-section">
            <h3>Rating Distribution</h3>
            <div className="rating-distribution">
              {Object.entries(averageRatings.averages || {}).map(([criteria, average]) => (
                <div key={criteria} className="rating-bar">
                  <label>Criteria {criteria}</label>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{ width: `${(average / 5) * 100}%` }}
                    >
                      {average}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="analytics-section">
            <h3>Evaluation Trends</h3>
            <p>Detailed trend analysis and charts would be displayed here.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default AnalyticsTab;


```

### FILE: api.js
```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = [REDACTED_CREDENTIAL]
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Service Functions
export const apiService = {
  // Programmes
  getProgrammes: () => api.get('/programmes'),
  getProgrammeById: (id) => api.get(`/programmes/${id}`),
  createProgramme: (data) => api.post('/programmes', data),
  updateProgramme: (id, data) => api.put(`/programmes/${id}`, data),
  deleteProgramme: (id) => api.delete(`/programmes/${id}`),

  // Courses
  getCourses: () => api.get('/courses'),
  getCourseById: (id) => api.get(`/courses/${id}`),
  getCoursesByProgramme: (programmeId) => api.get(`/courses/programme/${programmeId}`),
  getCoursesByProgrammeAndSemester: (programmeId, semester) => 
    api.get(`/courses/programme/${programmeId}/semester/${semester}`),
  createCourse: (data) => api.post('/courses', data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  deleteCourse: (id) => api.delete(`/courses/${id}`),

  // Lecturers
  getLecturers: () => api.get('/lecturers'),
  getLecturerById: (id) => api.get(`/lecturers/${id}`),
  searchLecturers: (query) => api.get(`/lecturers/search?query=${query}`),
  createLecturer: (data) => api.post('/lecturers', data),
  updateLecturer: (id, data) => api.put(`/lecturers/${id}`, data),
  deleteLecturer: (id) => api.delete(`/lecturers/${id}`),

  // Evaluations
  submitEvaluation: (data) => api.post('/evaluations/submit', data),
  getEvaluationsByLecturer: (lecturerId) => api.get(`/evaluations/lecturer/${lecturerId}`),
  getEvaluationsByCourse: (courseId) => api.get(`/evaluations/course/${courseId}`),
  getAllEvaluations: () => api.get('/evaluations/all'),

  // Audit Logs
  getAuditLogs: () => api.get('/audit-logs'),
  getAuditLogsByEventType: (eventType) => api.get(`/audit-logs/event-type/${eventType}`),

  // Authentication
  login: (password) => api.post('/auth/login', { password }),
  verify: () => api.post('/auth/verify'),

  // PDF Extraction
  extractPdf: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/pdf/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  processCurriculum: (extractedText) => 
    api.post('/pdf/process-curriculum', { extractedText }),

  // Health Check
  health: () => api.get('/health'),
};

export default api;


```

### FILE: App.css
```css
/* Root Theme Variables */
:root {
  --primary-color: #2563eb;
  --secondary-color: #64748b;
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --bg-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Dark Theme */
[data-theme='dark'] {
  --primary-color: #3b82f6;
  --secondary-color: #cbd5e1;
  --success-color: #34d399;
  --error-color: #f87171;
  --warning-color: #fbbf24;
  --bg-color: #1f2937;
  --text-color: #f3f4f6;
  --border-color: #374151;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.3);
}

/* High Contrast Theme */
[data-theme='high-contrast'] {
  --primary-color: #0000ff;
  --secondary-color: #000000;
  --success-color: #008000;
  --error-color: #ff0000;
  --warning-color: #ff8800;
  --bg-color: #ffffff;
  --text-color: #000000;
  --border-color: #000000;
  --shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 4px 8px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.app {
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* Utility Classes */
.loading {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--secondary-color);
  font-size: 1rem;
  background-color: rgba(100, 116, 139, 0.1);
  border-radius: 0.5rem;
}

.error-message {
  padding: 1rem;
  margin: 1rem 0;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border-left: 4px solid var(--error-color);
  border-radius: 0.25rem;
}

.success-message {
  padding: 1rem;
  margin: 1rem 0;
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--success-color);
  border-left: 4px solid var(--success-color);
  border-radius: 0.25rem;
}

/* Button Styles */
button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.secondary-button {
  background-color: var(--secondary-color);
  color: white;
}

.secondary-button:hover:not(:disabled) {
  background-color: #475569;
}

/* Form Styles */
input,
select,
textarea {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: border-color 0.3s ease;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

input:disabled,
select:disabled,
textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Table Styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table thead {
  background-color: rgba(100, 116, 139, 0.1);
}

table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
}

table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

table tbody tr:hover {
  background-color: rgba(100, 116, 139, 0.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  table {
    font-size: 0.875rem;
  }

  table th,
  table td {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  button {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
  }

  input,
  select,
  textarea {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}


```

### FILE: App.js
```javascript
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/App.css';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check if user is already authenticated
    const token = [REDACTED_CREDENTIAL]
    if (token) {
      setIsAuthenticated(true);
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeName) => {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('theme', themeName);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="app" data-theme={theme}>
        <Routes>
          <Route 
            path="/" 
            element={<StudentPortal theme={theme} onThemeChange={handleThemeChange} />} 
          />
          <Route 
            path="/admin/login" 
            element={
              isAuthenticated ? (
                <AdminDashboard 
                  theme={theme} 
                  onThemeChange={handleThemeChange}
                  onLogout={handleLogout}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? (
                <AdminDashboard 
                  theme={theme} 
                  onThemeChange={handleThemeChange}
                  onLogout={handleLogout}
                />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;


```

### FILE: AssessmentForm.css
```css
.assessment-form {
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow);
  padding: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.selection-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Accordion Styles */
.accordion {
  margin: 2rem 0;
}

.accordion-item {
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  padding: 1rem;
  background-color: rgba(100, 116, 139, 0.05);
  border: none;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.accordion-header:hover:not(:disabled) {
  background-color: rgba(100, 116, 139, 0.1);
}

.accordion-header:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.accordion-header.active {
  background-color: var(--primary-color);
  color: white;
}

.section-title {
  flex: 1;
}

.section-status {
  margin-left: 1rem;
  font-size: 1.2rem;
}

.accordion-content {
  padding: 1.5rem;
  background-color: var(--bg-color);
  border-top: 1px solid var(--border-color);
}

.rating-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.rating-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.rating-item label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.rating-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.radio-label input[type='radio'] {
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
}

.radio-text {
  font-weight: 500;
  min-width: 2rem;
  text-align: center;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.submit-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .assessment-form {
    padding: 1rem;
  }

  .selection-section {
    grid-template-columns: 1fr;
  }

  .rating-options {
    gap: 0.5rem;
  }

  .radio-label {
    gap: 0.25rem;
  }

  .radio-text {
    min-width: 1.5rem;
    font-size: 0.875rem;
  }
}


```

### FILE: AssessmentForm.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import '../styles/AssessmentForm.css';

function AssessmentForm() {
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  
  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState('');
  
  const [expandedSection, setExpandedSection] = useState(0);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const evaluationCriteria = [
    {
      section: 'Teaching Quality',
      items: [
        { id: 1, name: 'Clear explanation of concepts' },
        { id: 2, name: 'Organized course content' },
        { id: 3, name: 'Effective use of teaching materials' },
        { id: 4, name: 'Engagement with students' },
        { id: 5, name: 'Clarity in course objectives' },
      ],
    },
    {
      section: 'Communication',
      items: [
        { id: 6, name: 'Responsiveness to student questions' },
        { id: 7, name: 'Clear communication of expectations' },
        { id: 8, name: 'Availability for consultation' },
        { id: 9, name: 'Constructive feedback on assignments' },
        { id: 10, name: 'Professional communication' },
      ],
    },
    {
      section: 'Assessment & Feedback',
      items: [
        { id: 11, name: 'Fair and transparent grading' },
        { id: 12, name: 'Timely feedback on work' },
        { id: 13, name: 'Clear assessment criteria' },
        { id: 14, name: 'Appropriate difficulty level' },
        { id: 15, name: 'Alignment with learning objectives' },
      ],
    },
    {
      section: 'Course Management',
      items: [
        { id: 16, name: 'Adherence to course schedule' },
        { id: 17, name: 'Well-organized course materials' },
        { id: 18, name: 'Effective use of learning platforms' },
        { id: 19, name: 'Accommodation of diverse learning styles' },
        { id: 20, name: 'Overall course quality' },
      ],
    },
  ];

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    try {
      const response = await apiService.getProgrammes();
      if (response.data.success) {
        setProgrammes(response.data.data);
      }
    } catch (err) {
      console.error('Error loading programmes:', err);
    }
  };

  const handleProgrammeChange = async (e) => {
    const programmeId = e.target.value;
    setSelectedProgramme(programmeId);
    setSelectedCourse('');
    setSelectedLecturer('');
    setCourses([]);
    setLecturers([]);

    if (programmeId) {
      try {
        const response = await apiService.getCoursesByProgramme(programmeId);
        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedLecturer('');
    setLecturers([]);

    if (courseId) {
      try {
        const response = await apiService.getCourseById(courseId);
        if (response.data.success) {
          const course = response.data.data;
          setLecturers(course.lecturers || []);
        }
      } catch (err) {
        console.error('Error loading lecturers:', err);
      }
    }
  };

  const handleRatingChange = (criteriaId, value) => {
    setRatings({
      ...ratings,
      [criteriaId]: parseInt(value),
    });
  };

  const isSectionComplete = (sectionIndex) => {
    const section = evaluationCriteria[sectionIndex];
    return section.items.every((item) => ratings[item.id] !== undefined);
  };

  const canExpandSection = (sectionIndex) => {
    if (sectionIndex === 0) return true;
    return isSectionComplete(sectionIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!selectedLecturer) {
      setError('Please select a lecturer');
      return;
    }

    if (!isSectionComplete(evaluationCriteria.length - 1)) {
      setError('Please complete all evaluation criteria');
      return;
    }

    setLoading(true);

    try {
      const submissionData = {
        lecturerId: parseInt(selectedLecturer),
        courseId: parseInt(selectedCourse),
        studentFeedback: feedback,
        ratings: ratings,
      };

      const response = await apiService.submitEvaluation(submissionData);

      if (response.data.success) {
        setMessage('Thank you! Your evaluation has been submitted successfully.');
        // Reset form
        setSelectedProgramme('');
        setSelectedCourse('');
        setSelectedLecturer('');
        setRatings({});
        setFeedback('');
        setExpandedSection(0);
      } else {
        setError(response.data.message || 'Failed to submit evaluation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-form">
      <form onSubmit={handleSubmit}>
        {/* Programme and Course Selection */}
        <div className="form-section selection-section">
          <div className="form-group">
            <label htmlFor="programme">Programme *</label>
            <select
              id="programme"
              value={selectedProgramme}
              onChange={handleProgrammeChange}
              required
            >
              <option value="">Select a programme</option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              disabled={!selectedProgramme}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lecturer">Lecturer *</label>
            <select
              id="lecturer"
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
              disabled={!selectedCourse}
              required
            >
              <option value="">Select a lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.firstName} {lecturer.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="accordion">
          {evaluationCriteria.map((section, sectionIndex) => (
            <div key={sectionIndex} className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${expandedSection === sectionIndex ? 'active' : ''}`}
                onClick={() => {
                  if (canExpandSection(sectionIndex)) {
                    setExpandedSection(expandedSection === sectionIndex ? -1 : sectionIndex);
                  }
                }}
                disabled={!canExpandSection(sectionIndex)}
              >
                <span className="section-title">{section.section}</span>
                <span className="section-status">
                  {isSectionComplete(sectionIndex) ? '✓' : '○'}
                </span>
              </button>

              {expandedSection === sectionIndex && (
                <div className="accordion-content">
                  {section.items.map((item) => (
                    <div key={item.id} className="rating-item">
                      <label>{item.name}</label>
                      <div className="rating-options">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <label key={value} className="radio-label">
                            <input
                              type="radio"
                              name={`criteria-${item.id}`}
                              value={value}
                              checked={ratings[item.id] === value}
                              onChange={() => handleRatingChange(item.id, value)}
                            />
                            <span className="radio-text">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="feedback">Additional Feedback (Optional)</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide any additional comments or suggestions..."
              rows="4"
            />
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !isSectionComplete(evaluationCriteria.length - 1)}
            className="submit-button"
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssessmentForm;


```

### FILE: CREATION.md
```md
# lems

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Java, Spring Boot, Maven

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
FROM node:24-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || npm install
COPY . .
RUN pnpm run build || npm run build

FROM node:24-alpine
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — Lecturer Assessment & Evaluation Portal - React Frontend

**Application:** lems-frontend
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_lems-frontend_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — Lecturer Assessment & Evaluation Portal - React Frontend

**Application:** lems-frontend
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd lems-frontend
pnpm install
pnpm run dev        # http://localhost:5173
```



---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build lems-frontend
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up lems-frontend
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Lecturer Assessment & Evaluation Portal - React Frontend
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Lecturer Assessment & Evaluation Portal - React Frontend**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Lecturer Assessment & Evaluation Portal - React Frontend** is a React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Lecturer Assessment & Evaluation Portal - React Frontend** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âŒ Non-compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âŒ Non-compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5, Vite 7.3.1, React Router DOM
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — Lecturer Assessment & Evaluation Portal - React Frontend

**Application:** lems-frontend
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd lems-frontend
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: GuidesTab.css
```css
.guides-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.guides-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.guide-section {
  padding: 1.5rem;
  background-color: rgba(100, 116, 139, 0.05);
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
}

.guide-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: var(--text-color);
}

.guide-section p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.guide-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.guide-section li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.guide-section strong {
  color: var(--primary-color);
  font-weight: 600;
}

.guide-section code {
  background-color: rgba(37, 99, 235, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.guide-section dl {
  margin: 0;
}

.guide-section dt {
  margin-top: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.guide-section dt:first-child {
  margin-top: 0;
}

.guide-section dd {
  margin: 0.5rem 0 0 1.5rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .guide-section {
    padding: 1rem;
  }

  .guide-section h3 {
    font-size: 1.1rem;
  }

  .guide-section ul,
  .guide-section dl {
    font-size: 0.95rem;
  }
}


```

### FILE: GuidesTab.js
```javascript
import React from 'react';
import '../../styles/tabs/GuidesTab.css';

function GuidesTab() {
  return (
    <div className="guides-tab">
      <h2>User Guides</h2>

      <div className="guides-container">
        <div className="guide-section">
          <h3>📖 Getting Started</h3>
          <p>
            Welcome to the Lecturer Assessment & Evaluation Portal (LEMS). This guide will help you
            navigate the system and understand its features.
          </p>
        </div>

        <div className="guide-section">
          <h3>👨‍🎓 For Students</h3>
          <ul>
            <li>
              <strong>Submit Feedback:</strong> Navigate to the main portal and select your
              programme, course, and lecturer to submit an evaluation.
            </li>
            <li>
              <strong>Rating Scale:</strong> Use the 1-5 scale where 1 = Strongly Disagree and 5 =
              Strongly Agree.
            </li>
            <li>
              <strong>Accordion Sections:</strong> Complete each section before moving to the next.
              All criteria must be rated.
            </li>
            <li>
              <strong>Additional Feedback:</strong> You can provide optional comments in the
              feedback section.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>⚙️ For Administrators</h3>
          <ul>
            <li>
              <strong>Login:</strong> Click the Admin button on the main portal and enter the admin
              password.
            </li>
            <li>
              <strong>Dashboard Tabs:</strong> Use the tabs to navigate different sections of the
              dashboard.
            </li>
            <li>
              <strong>Overview:</strong> View key statistics about evaluations, lecturers, courses,
              and programmes.
            </li>
            <li>
              <strong>Results:</strong> Search and filter individual evaluations submitted by
              students.
            </li>
            <li>
              <strong>Lecturers:</strong> View and manage lecturer information with sorting and
              search capabilities.
            </li>
            <li>
              <strong>Programmes:</strong> View all academic programmes and their associated
              courses.
            </li>
            <li>
              <strong>Analytics:</strong> Analyze evaluation data with average ratings and trends.
            </li>
            <li>
              <strong>Admin Panel:</strong> Upload curriculum PDFs and view system audit logs.
            </li>
            <li>
              <strong>Self Test:</strong> Run automated tests to verify system functionality.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>📄 PDF Upload</h3>
          <ul>
            <li>
              <strong>File Format:</strong> Only PDF files are accepted. Ensure your timetable is
              in PDF format.
            </li>
            <li>
              <strong>Data Extraction:</strong> The system uses AI to extract curriculum data from
              the PDF.
            </li>
            <li>
              <strong>Warning:</strong> Uploading a new PDF will replace existing curriculum data
              and clear all evaluations.
            </li>
            <li>
              <strong>Backup:</strong> Consider backing up your data before uploading a new PDF.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>🎨 Themes</h3>
          <ul>
            <li>
              <strong>Light Theme:</strong> Default theme with light background and dark text.
            </li>
            <li>
              <strong>Dark Theme:</strong> Dark background with light text for reduced eye strain.
            </li>
            <li>
              <strong>High Contrast:</strong> Enhanced contrast for better accessibility.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>❓ FAQ</h3>
          <dl>
            <dt>How do I submit an evaluation?</dt>
            <dd>
              Select your programme, course, and lecturer from the dropdowns on the main portal,
              then rate each criterion and submit.
            </dd>

            <dt>Can I edit my evaluation after submission?</dt>
            <dd>Currently, evaluations cannot be edited after submission. Please review before submitting.</dd>

            <dt>What is the default admin password?</dt>
            <dd>The default admin password is "admin123". Change this in the system settings.</dd>

            <dt>How often should I back up the data?</dt>
            <dd>
              It is recommended to back up your data regularly, especially before uploading new
              curriculum PDFs.
            </dd>

            <dt>What file formats are supported for PDF upload?</dt>
            <dd>Only PDF files (.pdf) are supported for curriculum upload.</dd>
          </dl>
        </div>

        <div className="guide-section">
          <h3>📞 Support</h3>
          <p>
            For technical support or questions, please contact the system administrator or submit
            feedback through the application.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuidesTab;


```

### FILE: Header.css
```css
.header {
  background-color: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.theme-switcher {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-switcher label {
  margin: 0;
  font-weight: 500;
}

.theme-select {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
}

.theme-select option {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.theme-select:focus {
  outline: none;
  background-color: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .header {
    padding: 0.75rem 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .logo h2 {
    font-size: 1.25rem;
  }
}


```

### FILE: Header.js
```javascript
import React from 'react';
import '../styles/Header.css';

function Header({ theme, onThemeChange }) {
  const themes = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'high-contrast', label: 'High Contrast' },
  ];

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <h2>LEMS</h2>
        </div>

        <div className="theme-switcher">
          <label htmlFor="theme-select">Theme:</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) => onThemeChange(e.target.value)}
            className="theme-select"
          >
            {themes.map((t) => (
              <option key={t.name} value={t.name}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;


```

### FILE: index.css
```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'roboto', 'oxygen',
    'ubuntu', 'cantarell', 'fira sans', 'droid sans', 'helvetica neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

html, body, #root {
  height: 100%;
  width: 100%;
}


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="utf-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="LEMS - Lecturer Assessment & Evaluation Portal" />
    <meta property="og:description" content="Lecturer Assessment & Evaluation Portal - Collect and analyze student feedback" />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="LEMS - Lecturer Assessment & Evaluation Portal" />
    <meta name="twitter:description" content="Lecturer Assessment & Evaluation Portal - Collect and analyze student feedback" />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#2563eb" />
    <meta
      name="description"
      content="Lecturer Assessment & Evaluation Portal - Collect and analyze student feedback"
    />
    <title>LEMS - Lecturer Assessment & Evaluation Portal</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>


```

### FILE: index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


```

### FILE: LecturersTab.css
```css
.lecturers-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.lecturers-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.sort-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.sort-select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.lecturers-table-container {
  overflow-x: auto;
}

.lecturers-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.lecturers-table thead {
  background-color: rgba(37, 99, 235, 0.1);
}

.lecturers-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-color);
}

.lecturers-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.lecturers-table tbody tr:hover {
  background-color: rgba(100, 116, 139, 0.05);
}

@media (max-width: 768px) {
  .lecturers-controls {
    flex-direction: column;
  }

  .search-input,
  .sort-select {
    width: 100%;
  }

  .lecturers-table {
    font-size: 0.875rem;
  }

  .lecturers-table th,
  .lecturers-table td {
    padding: 0.75rem;
  }
}


```

### FILE: LecturersTab.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/LecturersTab.css';

function LecturersTab() {
  const [lecturers, setLecturers] = useState([]);
  const [filteredLecturers, setFilteredLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    loadLecturers();
  }, []);

  useEffect(() => {
    filterAndSortLecturers();
  }, [searchQuery, sortBy, lecturers]);

  const loadLecturers = async () => {
    try {
      const response = await apiService.getLecturers();
      if (response.data.success) {
        setLecturers(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading lecturers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLecturers = () => {
    let filtered = lecturers;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lecturer) =>
          lecturer.firstName?.toLowerCase().includes(query) ||
          lecturer.lastName?.toLowerCase().includes(query) ||
          lecturer.email?.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'name') {
      filtered.sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      );
    } else if (sortBy === 'department') {
      filtered.sort((a, b) => (a.department || '').localeCompare(b.department || ''));
    }

    setFilteredLecturers(filtered);
  };

  return (
    <div className="lecturers-tab">
      <h2>Lecturers</h2>

      <div className="lecturers-controls">
        <input
          type="text"
          placeholder="Search lecturers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="department">Sort by Department</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading lecturers...</div>
      ) : filteredLecturers.length === 0 ? (
        <div className="no-data">No lecturers found</div>
      ) : (
        <div className="lecturers-table-container">
          <table className="lecturers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map((lecturer) => (
                <tr key={lecturer.id}>
                  <td>{lecturer.firstName} {lecturer.lastName}</td>
                  <td>{lecturer.email || 'N/A'}</td>
                  <td>{lecturer.department || 'N/A'}</td>
                  <td>{lecturer.courses?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LecturersTab;


```

### FILE: LoginPage.css
```css
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), #1e40af);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-box {
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  text-align: center;
}

.login-box h1 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.login-box p {
  color: var(--secondary-color);
  margin-bottom: 2rem;
}

.login-box form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.login-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
}

.login-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 0.75rem;
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
  border-left: 4px solid var(--error-color);
  border-radius: 0.25rem;
  text-align: left;
}

.login-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
  color: var(--secondary-color);
}

.login-footer code {
  background-color: rgba(100, 116, 139, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  color: var(--primary-color);
}

@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }

  .login-box h1 {
    font-size: 1.5rem;
  }
}


```

### FILE: LoginPage.js
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import '../styles/LoginPage.css';

function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.login(password);
      if (response.data.success) {
        const token = [REDACTED_CREDENTIAL]
        onLogin(token);
        navigate('/admin');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>Admin Login</h1>
          <p>Enter your password to access the admin dashboard</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={loading} className="login-button">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p>Default password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;


```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: OverviewTab.css
```css
.overview-tab h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, var(--primary-color), #1e40af);
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.overview-section {
  background-color: rgba(100, 116, 139, 0.05);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
}

.overview-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}


```

### FILE: OverviewTab.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/OverviewTab.css';

function OverviewTab() {
  const [stats, setStats] = useState({
    totalEvaluations: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalProgrammes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [evaluations, lecturers, courses, programmes] = await Promise.all([
        apiService.getAllEvaluations(),
        apiService.getLecturers(),
        apiService.getCourses(),
        apiService.getProgrammes(),
      ]);

      setStats({
        totalEvaluations: evaluations.data.data?.length || 0,
        totalLecturers: lecturers.data.data?.length || 0,
        totalCourses: courses.data.data?.length || 0,
        totalProgrammes: programmes.data.data?.length || 0,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overview-tab">
      <h2>Dashboard Overview</h2>

      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Evaluations</h3>
              <p className="stat-value">{stats.totalEvaluations}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-content">
              <h3>Total Lecturers</h3>
              <p className="stat-value">{stats.totalLecturers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Total Courses</h3>
              <p className="stat-value">{stats.totalCourses}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎓</div>
            <div className="stat-content">
              <h3>Total Programmes</h3>
              <p className="stat-value">{stats.totalProgrammes}</p>
            </div>
          </div>
        </div>
      )}

      <div className="overview-section">
        <h3>Recent Activity</h3>
        <p>Audit logs and recent evaluations will be displayed here.</p>
      </div>
    </div>
  );
}

export default OverviewTab;


```

### FILE: package.json
```json
{
  "name": "lems-frontend",
  "version": "3.0.0",
  "description": "Lecturer Assessment & Evaluation Portal - React Frontend",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "keywords": [
    "lems",
    "evaluation",
    "assessment",
    "lecturer"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.7.2",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^6.15.0"
  },
  "devDependencies": {
    "@babel/core": "^7.24.7",
    "@babel/preset-env": "^7.24.7",
    "@babel/preset-react": "^7.24.7",
    "@vitejs/plugin-react": "^5.1.0",
    "babel-loader": "^9.1.3",
    "css-loader": "^7.1.2",
    "html-webpack-plugin": "^5.6.0",
    "style-loader": "^4.0.0",
    "vite": "^7.1.12",
    "webpack": "^5.93.0",
    "webpack-cli": "^5.1.4",
    "webpack-dev-server": "^5.0.4",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0"
  }
}

```

### FILE: ProgrammesTab.css
```css
.programmes-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.programmes-table-container {
  overflow-x: auto;
}

.programmes-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.programmes-table thead {
  background-color: rgba(37, 99, 235, 0.1);
}

.programmes-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  color: var(--text-color);
}

.programmes-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.programmes-table tbody tr:hover {
  background-color: rgba(100, 116, 139, 0.05);
}

@media (max-width: 768px) {
  .programmes-table {
    font-size: 0.875rem;
  }

  .programmes-table th,
  .programmes-table td {
    padding: 0.75rem;
  }
}


```

### FILE: ProgrammesTab.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/ProgrammesTab.css';

function ProgrammesTab() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    try {
      const response = await apiService.getProgrammes();
      if (response.data.success) {
        setProgrammes(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading programmes:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="programmes-tab">
      <h2>Academic Programmes</h2>

      {loading ? (
        <div className="loading">Loading programmes...</div>
      ) : programmes.length === 0 ? (
        <div className="no-data">No programmes found</div>
      ) : (
        <div className="programmes-table-container">
          <table className="programmes-table">
            <thead>
              <tr>
                <th>Programme Name</th>
                <th>Code</th>
                <th>Description</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((programme) => (
                <tr key={programme.id}>
                  <td>{programme.name}</td>
                  <td>{programme.code || 'N/A'}</td>
                  <td>{programme.description || 'N/A'}</td>
                  <td>{programme.courses?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProgrammesTab;


```

### FILE: ResultsTab.css
```css
.results-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.search-box {
  margin-bottom: 2rem;
}

.search-box input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  font-size: 1rem;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.evaluations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.evaluation-card {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.evaluation-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.evaluation-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.evaluation-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-color);
}

.evaluation-date {
  font-size: 0.875rem;
  color: var(--secondary-color);
  white-space: nowrap;
  margin-left: 1rem;
}

.course-name {
  margin: 0.5rem 0 1rem 0;
  font-weight: 600;
  color: var(--primary-color);
}

.feedback {
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: rgba(100, 116, 139, 0.05);
  border-radius: 0.375rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.ratings-summary {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.rating-count {
  font-size: 0.875rem;
  color: var(--secondary-color);
}

@media (max-width: 768px) {
  .evaluations-list {
    grid-template-columns: 1fr;
  }

  .evaluation-header {
    flex-direction: column;
  }

  .evaluation-date {
    margin-left: 0;
    margin-top: 0.5rem;
  }
}


```

### FILE: ResultsTab.js
```javascript
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import '../../styles/tabs/ResultsTab.css';

function ResultsTab() {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEvaluations();
  }, []);

  useEffect(() => {
    filterEvaluations();
  }, [searchQuery, evaluations]);

  const loadEvaluations = async () => {
    try {
      const response = await apiService.getAllEvaluations();
      if (response.data.success) {
        setEvaluations(response.data.data || []);
      }
    } catch (err) {
      console.error('Error loading evaluations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEvaluations = () => {
    if (!searchQuery) {
      setFilteredEvaluations(evaluations);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = evaluations.filter(
      (eval) =>
        eval.lecturer?.firstName?.toLowerCase().includes(query) ||
        eval.lecturer?.lastName?.toLowerCase().includes(query) ||
        eval.course?.name?.toLowerCase().includes(query)
    );
    setFilteredEvaluations(filtered);
  };

  return (
    <div className="results-tab">
      <h2>Evaluation Results</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by lecturer name or course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading evaluations...</div>
      ) : filteredEvaluations.length === 0 ? (
        <div className="no-data">No evaluations found</div>
      ) : (
        <div className="evaluations-list">
          {filteredEvaluations.map((evaluation) => (
            <div key={evaluation.id} className="evaluation-card">
              <div className="evaluation-header">
                <h3>
                  {evaluation.lecturer?.firstName} {evaluation.lecturer?.lastName}
                </h3>
                <span className="evaluation-date">
                  {new Date(evaluation.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="course-name">{evaluation.course?.name}</p>
              {evaluation.studentFeedback && (
                <p className="feedback">{evaluation.studentFeedback}</p>
              )}
              <div className="ratings-summary">
                <span className="rating-count">
                  {evaluation.ratings?.length || 0} criteria rated
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsTab;


```

### FILE: SelfTestTab.css
```css
.self-test-tab h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.test-description {
  padding: 1.5rem;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 0.5rem;
  border-left: 4px solid var(--primary-color);
  margin-bottom: 2rem;
}

.test-description p {
  margin: 0;
  line-height: 1.6;
}

.test-controls {
  margin-bottom: 2rem;
}

.run-tests-button {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: none;
}

.run-tests-button:hover:not(:disabled) {
  background-color: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.run-tests-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Test Progress */
.test-progress {
  padding: 1.5rem;
  background-color: rgba(100, 116, 139, 0.05);
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), #1e40af);
  transition: width 0.3s ease;
}

.test-progress p {
  margin: 0;
  text-align: center;
  color: var(--secondary-color);
  font-weight: 500;
}

/* Test Results */
.test-results {
  margin-top: 2rem;
}

.results-summary {
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.results-summary.passed {
  background-color: rgba(16, 185, 129, 0.1);
  border-left: 4px solid var(--success-color);
}

.results-summary.failed {
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 4px solid var(--error-color);
}

.results-summary h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.results-summary p {
  margin: 0;
  color: var(--secondary-color);
}

/* Test Results List */
.test-results-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-result {
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid var(--border-color);
  background-color: rgba(100, 116, 139, 0.05);
}

.test-result.passed {
  border-left-color: var(--success-color);
  background-color: rgba(16, 185, 129, 0.05);
}

.test-result.failed {
  border-left-color: var(--error-color);
  background-color: rgba(239, 68, 68, 0.05);
}

.result-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.result-icon {
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 2rem;
  text-align: center;
}

.test-result.passed .result-icon {
  color: var(--success-color);
}

.test-result.failed .result-icon {
  color: var(--error-color);
}

.result-info {
  flex: 1;
}

.result-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-color);
}

.result-info p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--secondary-color);
}

.result-time {
  font-size: 0.875rem;
  color: var(--secondary-color);
  white-space: nowrap;
  margin-left: 1rem;
}

.result-error {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.result-error p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--error-color);
  font-family: 'Courier New', monospace;
}

@media (max-width: 768px) {
  .result-header {
    flex-direction: column;
  }

  .result-time {
    margin-left: 0;
    margin-top: 0.5rem;
  }

  .run-tests-button {
    width: 100%;
  }
}


```

### FILE: SelfTestTab.js
```javascript
import React, { useState } from 'react';
import '../../styles/tabs/SelfTestTab.css';

function SelfTestTab() {
  const [testRunning, setTestRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const tests = [
    {
      name: 'API Health Check',
      description: 'Verify backend API is accessible',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/health');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Programmes Endpoint',
      description: 'Fetch all programmes from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/programmes');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Lecturers Endpoint',
      description: 'Fetch all lecturers from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/lecturers');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Courses Endpoint',
      description: 'Fetch all courses from the database',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/courses');
          return response.ok;
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Authentication',
      description: 'Test admin login functionality',
      run: async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: '[REDACTED_PASSWORD]' }),
          });
          return response.ok;
        } catch {
          return false;
        }
      },
    },
  ];

  const handleRunTests = async () => {
    setTestRunning(true);
    setTestResults([]);
    setCurrentTestIndex(0);

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i);
      const test = tests[i];

      try {
        const passed = await test.run();
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            description: test.description,
            passed,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      } catch (err) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            description: test.description,
            passed: false,
            error: err.message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      }

      // Simulate delay for visual effect
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setTestRunning(false);
  };

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalCount = testResults.length;
  const allPassed = passedCount === totalCount && totalCount > 0;

  return (
    <div className="self-test-tab">
      <h2>E2E Self-Testing Suite</h2>

      <div className="test-description">
        <p>
          This testing suite runs automated tests to verify the stability and functionality of the
          LEMS application. Click the button below to start the tests.
        </p>
      </div>

      <div className="test-controls">
        <button
          className="run-tests-button"
          onClick={handleRunTests}
          disabled={testRunning}
        >
          {testRunning ? `Running Tests (${currentTestIndex + 1}/${tests.length})...` : 'Run E2E Test Suite'}
        </button>
      </div>

      {testRunning && (
        <div className="test-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentTestIndex + 1) / tests.length) * 100}%` }}
            />
          </div>
          <p>Running test {currentTestIndex + 1} of {tests.length}...</p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="test-results">
          <div className={`results-summary ${allPassed ? 'passed' : 'failed'}`}>
            <h3>{allPassed ? 'All Tests Passed!' : 'Some Tests Failed'}</h3>
            <p>
              {passedCount} of {totalCount} tests passed
            </p>
          </div>

          <div className="test-results-list">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`test-result ${result.passed ? 'passed' : 'failed'}`}
              >
                <div className="result-header">
                  <span className="result-icon">
                    {result.passed ? 'PASS' : 'FAIL'}
                  </span>
                  <div className="result-info">
                    <h4>{result.name}</h4>
                    <p>{result.description}</p>
                  </div>
                  <span className="result-time">{result.timestamp}</span>
                </div>
                {result.error && (
                  <div className="result-error">
                    <p>Error: {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SelfTestTab;


```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — lems-frontend
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('lems-frontend E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.jsx
```javascript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: StudentPortal.css
```css
.student-portal {
  min-height: 100vh;
  background-color: var(--bg-color);
}

.portal-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.portal-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, var(--primary-color), #1e40af);
  color: white;
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
}

.portal-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.portal-header p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  opacity: 0.95;
}

.admin-button {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.admin-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .portal-container {
    padding: 1rem;
  }

  .portal-header {
    padding: 1.5rem;
  }

  .portal-header h1 {
    font-size: 1.5rem;
  }

  .portal-header p {
    font-size: 1rem;
  }
}


```

### FILE: StudentPortal.js
```javascript
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from '../components/AssessmentForm';
import Header from '../components/Header';
import '../styles/StudentPortal.css';

function StudentPortal({ theme, onThemeChange }) {
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(true);

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="student-portal">
      <Header theme={theme} onThemeChange={onThemeChange} />
      
      <div className="portal-container">
        <div className="portal-header">
          <h1>Lecturer Assessment & Evaluation Portal</h1>
          <p>Please provide your honest feedback about your lecturer and course experience</p>
          {showAdminButton && (
            <button className="admin-button" onClick={handleAdminClick}>
              Admin Panel
            </button>
          )}
        </div>

        <AssessmentForm />
      </div>
    </div>
  );
}

export default StudentPortal;


```

### FILE: vite.config.js
```javascript
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'vendor-react-dom';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
            if (id.includes('framer-motion') || id.includes('motion')) return 'vendor-motion';
            if (id.includes('lucide') || id.includes('heroicons')) return 'vendor-icons';
            return 'vendor';
          }
        },
      },
    },
  },
})

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — lems-frontend
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — lems-frontend
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

### FILE: webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};


```

