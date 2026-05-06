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

