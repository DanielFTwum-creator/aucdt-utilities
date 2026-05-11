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

