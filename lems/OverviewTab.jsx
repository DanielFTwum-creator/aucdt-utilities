import React, { useState, useEffect } from 'react';
import { apiService } from './api';
import './OverviewTab.css';

function OverviewTab({ onNavigate }) {
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
          {[
            { icon: '📋', label: 'Total Evaluations', value: stats.totalEvaluations, tab: 'results'    },
            { icon: '👨‍🏫', label: 'Total Lecturers',   value: stats.totalLecturers,   tab: 'lecturers' },
            { icon: '📚', label: 'Total Courses',     value: stats.totalCourses,     tab: 'programmes' },
            { icon: '🎓', label: 'Total Programmes',  value: stats.totalProgrammes,  tab: 'programmes' },
          ].map(({ icon, label, value, tab }) => (
            <button
              key={label}
              className="stat-card stat-card-interactive"
              onClick={() => onNavigate?.(tab)}
              aria-label={`${label}: ${value} — go to ${tab}`}
            >
              <div className="stat-icon">{icon}</div>
              <div className="stat-content">
                <h3>{label}</h3>
                <p className="stat-value">{value}</p>
              </div>
            </button>
          ))}
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

