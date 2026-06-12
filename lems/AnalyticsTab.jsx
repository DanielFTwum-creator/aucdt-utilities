import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import { apiService } from './api';
import './AnalyticsTab.css';

// Old rows have no section on their ratings — map by criteria number
// (mirrors the 4-section instrument in AssessmentForm).
const SECTION_BY_NUMBER = (n) => {
  if (n <= 5) return "Lecturer's Delivery & Knowledge";
  if (n <= 10) return 'Communication & Engagement';
  if (n <= 15) return 'Assessment & Feedback';
  return 'Course Management';
};

const MAROON = '#630f12';
const GOLD = '#c8a84b';

function AnalyticsTab() {
  const [evaluations, setEvaluations] = useState([]);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturerId, setSelectedLecturerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [evalsRes, lectsRes] = await Promise.all([
          apiService.getAllEvaluations(),
          apiService.getLecturers(),
        ]);
        if (evalsRes.data.success) setEvaluations(evalsRes.data.data || []);
        if (lectsRes.data.success) setLecturers(lectsRes.data.data || []);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const evalAverage = (ev) => {
    const ratings = ev.ratings || [];
    if (!ratings.length) return null;
    return ratings.reduce((s, r) => s + r.rating, 0) / ratings.length;
  };

  // Overall bar chart: average score per lecturer.
  const overallStats = useMemo(() => {
    const byLecturer = new Map();
    evaluations.forEach((ev) => {
      const id = ev.lecturer?.id;
      const avg = evalAverage(ev);
      if (id == null || avg == null) return;
      const cur = byLecturer.get(id) || { total: 0, count: 0 };
      byLecturer.set(id, { total: cur.total + avg, count: cur.count + 1 });
    });
    return lecturers.map((l) => {
      const s = byLecturer.get(l.id);
      return {
        id: l.id,
        name: `${l.firstName} ${l.lastName}`,
        averageScore: s ? +(s.total / s.count).toFixed(2) : 0,
        evaluations: s ? s.count : 0,
      };
    });
  }, [evaluations, lecturers]);

  // Detail view for the selected lecturer.
  const detail = useMemo(() => {
    if (selectedLecturerId == null) return null;
    const evals = evaluations.filter((ev) => ev.lecturer?.id === selectedLecturerId);
    if (!evals.length) return { empty: true };

    const sectionScores = {};
    let sum = 0;
    let count = 0;
    const recommendCounts = { RECOMMEND: 0, NEUTRAL: 0, NOT_RECOMMEND: 0 };
    const comments = [];

    evals.forEach((ev) => {
      (ev.ratings || []).forEach((r) => {
        const section = r.section || SECTION_BY_NUMBER(r.criteriaNumber);
        if (!sectionScores[section]) sectionScores[section] = { total: 0, count: 0 };
        sectionScores[section].total += r.rating;
        sectionScores[section].count += 1;
        sum += r.rating;
        count += 1;
      });
      if (ev.recommend && recommendCounts[ev.recommend] !== undefined) {
        recommendCounts[ev.recommend] += 1;
      }
      if (ev.studentFeedback) {
        comments.push({ text: ev.studentFeedback, date: ev.createdAt });
      }
    });

    comments.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalEvaluations: evals.length,
      overallAverage: count ? +(sum / count).toFixed(2) : 0,
      radarData: Object.entries(sectionScores).map(([section, s]) => ({
        subject: section,
        score: +(s.total / s.count).toFixed(2),
        fullMark: 5,
      })),
      recommendCounts,
      comments: comments.slice(0, 5),
    };
  }, [evaluations, selectedLecturerId]);

  const selectedLecturer = lecturers.find((l) => l.id === selectedLecturerId);

  if (loading) {
    return (
      <div className="analytics-tab">
        <h2>Analytics & Insights</h2>
        <div className="loading">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="analytics-tab">
      <h2>Analytics & Insights</h2>

      <div className="analytics-layout">
        <div className="lecturer-list">
          <h3>Lecturers</h3>
          <button
            className={`lecturer-item ${selectedLecturerId === null ? 'selected' : ''}`}
            onClick={() => setSelectedLecturerId(null)}
          >
            Overall Performance
          </button>
          {overallStats.map((l) => (
            <button
              key={l.id}
              className={`lecturer-item ${selectedLecturerId === l.id ? 'selected' : ''}`}
              onClick={() => setSelectedLecturerId(l.id)}
            >
              <span>{l.name}</span>
              <span className="lecturer-meta">
                {l.evaluations ? `${l.averageScore} / 5 · ${l.evaluations}` : 'no data'}
              </span>
            </button>
          ))}
        </div>

        <div className="analytics-detail">
          {selectedLecturer && detail ? (
            detail.empty ? (
              <div className="no-data">
                No evaluations found for {selectedLecturer.firstName} {selectedLecturer.lastName}.
              </div>
            ) : (
              <>
                <h3>
                  Evaluation for {selectedLecturer.firstName} {selectedLecturer.lastName}
                </h3>
                <div className="detail-stats">
                  <div className="detail-stat">
                    <span className="detail-label">Total Evaluations</span>
                    <span className="detail-value">{detail.totalEvaluations}</span>
                  </div>
                  <div className="detail-stat">
                    <span className="detail-label">Overall Average</span>
                    <span className="detail-value">{detail.overallAverage} / 5</span>
                  </div>
                  <div className="detail-stat">
                    <span className="detail-label">Recommend</span>
                    <span className="detail-value">
                      {detail.recommendCounts.RECOMMEND} 👍 · {detail.recommendCounts.NEUTRAL} 😐 ·{' '}
                      {detail.recommendCounts.NOT_RECOMMEND} 👎
                    </span>
                  </div>
                </div>

                <h4>Average Score by Category</h4>
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={detail.radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 5]} />
                      <Radar
                        name={`${selectedLecturer.firstName} ${selectedLecturer.lastName}`}
                        dataKey="score"
                        stroke={MAROON}
                        fill={MAROON}
                        fillOpacity={0.45}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <h4>Recent Comments</h4>
                {detail.comments.length ? (
                  <div className="comments-list">
                    {detail.comments.map((c, i) => (
                      <p key={i} className="comment">
                        “{c.text}”
                        <span className="comment-date">
                          {new Date(c.date).toLocaleDateString()}
                        </span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No comments yet.</p>
                )}
              </>
            )
          ) : (
            <>
              <h3>Overall Performance</h3>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={overallStats} margin={{ top: 5, right: 20, left: -10, bottom: 60 }}>
                    <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="averageScore" fill={MAROON} name="Avg. Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="hint">Select a lecturer on the left for category breakdown and comments.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsTab;
