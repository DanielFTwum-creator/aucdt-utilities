import React, { useState, useEffect } from 'react';
import { apiService } from './api';
import './LecturersTab.css';

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

