import React, { useState, useEffect } from 'react';
import { apiService } from './api';
import './ResultsTab.css';

function ResultsTab() {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadEvaluations();
  }, []);

  useEffect(() => {
    filterEvaluations();
  }, [searchQuery, fromDate, toDate, evaluations]);

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
    const query = searchQuery.toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    // End of the selected "to" day, so the range is inclusive.
    const to = toDate ? new Date(new Date(toDate).getTime() + 24 * 60 * 60 * 1000) : null;

    const filtered = evaluations.filter((ev) => {
      if (query &&
          !ev.lecturer?.firstName?.toLowerCase().includes(query) &&
          !ev.lecturer?.lastName?.toLowerCase().includes(query) &&
          !ev.course?.name?.toLowerCase().includes(query)) {
        return false;
      }
      const created = new Date(ev.createdAt);
      if (from && created < from) return false;
      if (to && created >= to) return false;
      return true;
    });
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
        <div className="date-filter">
          <label>
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              aria-label="Filter from date"
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              aria-label="Filter to date"
            />
          </label>
        </div>
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
              <p className="course-name">
                {evaluation.course?.name}
                {evaluation.semester ? ` · Semester ${evaluation.semester}` : ''}
              </p>
              {evaluation.studentFeedback && (
                <p className="feedback">{evaluation.studentFeedback}</p>
              )}
              <div className="ratings-summary">
                <span className="rating-count">
                  {evaluation.ratings?.length || 0} criteria rated
                </span>
                {evaluation.recommend && (
                  <span className={`recommend-badge ${evaluation.recommend.toLowerCase()}`}>
                    {evaluation.recommend === 'RECOMMEND' && 'Recommends'}
                    {evaluation.recommend === 'NEUTRAL' && 'Neutral'}
                    {evaluation.recommend === 'NOT_RECOMMEND' && 'Does not recommend'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResultsTab;

