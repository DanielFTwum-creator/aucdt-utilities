import React, { useState, useEffect } from 'react';
import './ResponseLogModal.css'; // We will create this CSS file next

const ResponseLogModal = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/logs' );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Response Log</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          {loading && <p>Loading logs...</p>}
          {error && <p className="error-message">Error fetching logs: {error}</p>}
          {!loading && !error && (
            <div className="log-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>URL</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, index) => (
                    <tr key={index}>
                      <td>{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="log-url">{log.url}</td>
                      <td>
                        <span className={`status-indicator status-${log.status.toLowerCase()}`}>
                          {log.status}
                        </span>
                      </td>
                      <td>{log.responseTime}</td>
                      <td>{log.statusCode}{log.error ? ` (${log.error})` : ''}</td>
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
};

export default ResponseLogModal;
