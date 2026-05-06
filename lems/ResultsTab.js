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

