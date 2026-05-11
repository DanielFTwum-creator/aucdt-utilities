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

