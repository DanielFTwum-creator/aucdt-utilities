import React, { useState, useEffect, useCallback } from 'react';
import ResponseLogModal from './ResponseLogModal'; // Import the new modal

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false); // State for the modal

  const fetchUrls = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/urls' );
      if (!response.ok) {
        throw new Error('Could not fetch URL data.');
      }
      const data = await response.json();
      setUrls(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    fetchUrls();
    const interval = setInterval(fetchUrls, 5000); // Refresh data every 5 seconds
    return () => clearInterval(interval);
  }, [fetchUrls]);

  const handleExport = () => {
    window.location.href = 'http://localhost:3001/api/urls/export';
  };

  const handleImport = async (event ) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3001/api/urls/import', {
        method: 'POST',
        body: formData,
      } );
      if (!response.ok) {
        throw new Error('Import failed');
      }
      fetchUrls(); // Refresh the list after import
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard">
      {/* --- This section is new/updated --- */}
      {isLogModalOpen && <ResponseLogModal onClose={() => setIsLogModalOpen(false)} />}
      
      <div className="toolbar">
        <h2>Monitored URLs</h2>
        <div className="actions">
          <button onClick={() => document.getElementById('import-file').click()}>Import JSON</button>
          <input type="file" id="import-file" style={{ display: 'none' }} onChange={handleImport} accept=".json" />
          <button onClick={handleExport}>Export JSON</button>
          <button onClick={() => setIsLogModalOpen(true)}>View Logs</button>
        </div>
      </div>
      {/* --- End of new/updated section --- */}

      {error && <p className="message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Status</th>
            <th>Response Time</th>
            <th>Last Checked</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td><a href={url.url} target="_blank" rel="noopener noreferrer">{url.url}</a></td>
              <td>
                <span className={`status-indicator status-${url.status.toLowerCase()}`}>
                  {url.status}
                </span>
              </td>
              <td>{url.responseTime}</td>
              <td>{url.lastChecked ? new Date(url.lastChecked).toLocaleString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
