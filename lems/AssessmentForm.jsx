import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CheckCircle2, Lock } from 'lucide-react';
import { apiService } from './api';
import './AssessmentForm.css';

// Set to false to revert to the original card-grid UI.
const ENABLE_ENHANCED_UI = true;

const SCALE_LABELS = {
  1: 'Strongly Disagree',
  2: 'Disagree',
  3: 'Neutral',
  4: 'Agree',
  5: 'Strongly Agree',
};

// ---------------------------------------------------------------------------
// SegmentedControl — one horizontal bar, 5 equal segments
// ---------------------------------------------------------------------------
function SegmentedControl({ itemId, value, onChange }) {
  return (
    <div className="seg-control" role="radiogroup">
      {[1, 2, 3, 4, 5].map((v) => {
        const selected = value === v;
        return (
          <motion.button
            key={v}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${v} — ${SCALE_LABELS[v]}`}
            className={`seg-segment${selected ? ' seg-selected' : ''}`}
            onClick={() => onChange(itemId, v)}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.15 }}
          >
            {selected && (
              <CheckCircle size={13} className="seg-check" aria-hidden="true" />
            )}
            <span className="seg-num">{v}</span>
            <span className="seg-label">{SCALE_LABELS[v]}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// GlobalProgressBar — X of 20 questions answered
// ---------------------------------------------------------------------------
function GlobalProgressBar({ answered, total }) {
  const pct = Math.round((answered / total) * 100);
  return (
    <div className="global-progress" aria-label={`${answered} of ${total} questions answered`}>
      <div className="global-progress-label">
        <span>{answered} of {total} questions answered</span>
        <span>{pct}%</span>
      </div>
      <div className="global-progress-track">
        <motion.div
          className="global-progress-fill"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StickyLegend — rating scale bar, sticks below the LEMS nav
// ---------------------------------------------------------------------------
function StickyLegend() {
  return (
    <div className="sticky-legend" aria-hidden="true">
      1 = Strongly Disagree &nbsp;·&nbsp; 2 = Disagree &nbsp;·&nbsp; 3 = Neutral
      &nbsp;·&nbsp; 4 = Agree &nbsp;·&nbsp; 5 = Strongly Agree
    </div>
  );
}

// ---------------------------------------------------------------------------
// AssessmentForm
// ---------------------------------------------------------------------------
function AssessmentForm() {
  const [programmes, setProgrammes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [selectedProgramme, setSelectedProgramme] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState('');
  const [recommendation, setRecommendation] = useState('');

  const [expandedSection, setExpandedSection] = useState(0);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sectionRefs = useRef([]);

  const evaluationCriteria = [
    {
      section: "Lecturer's Delivery & Knowledge",
      items: [
        { id: 1, name: 'The lecturer was knowledgeable in the field of study represented by this course.' },
        { id: 2, name: 'The course content was delivered in a well-organised and structured manner.' },
        { id: 3, name: 'The lecturer made effective use of teaching and learning materials.' },
        { id: 4, name: "The lecturer's teaching style was enthusiastic and stimulating." },
        { id: 5, name: 'Course objectives, content and assessment methods were clearly communicated to students.' },
      ],
    },
    {
      section: 'Communication & Engagement',
      items: [
        { id: 6, name: 'The lecturer always responded to specific questions confidently and promptly.' },
        { id: 7, name: 'Expectations for the course were communicated clearly.' },
        { id: 8, name: 'The lecturer was available for consultation outside class hours.' },
        { id: 9, name: 'The lecturer provided constructive feedback on assignments.' },
        { id: 10, name: 'The lecturer communicated professionally at all times.' },
      ],
    },
    {
      section: 'Assessment & Feedback',
      items: [
        { id: 11, name: 'Assessment methods were fair and appropriate.' },
        { id: 12, name: 'Feedback on my work was provided in good time.' },
        { id: 13, name: 'Assessment criteria were clear and transparent.' },
        { id: 14, name: 'The difficulty level of assessments was appropriate for the course.' },
        { id: 15, name: 'Assessments aligned with the stated learning objectives.' },
      ],
    },
    {
      section: 'Course Management',
      items: [
        { id: 16, name: 'The lecturer was always regular and punctual in class.' },
        { id: 17, name: 'Course materials were well organised and accessible.' },
        { id: 18, name: 'The lecturer made effective use of the learning platforms.' },
        { id: 19, name: 'The lecturer accommodated diverse learning styles.' },
        { id: 20, name: 'Overall, the quality of this course was high.' },
      ],
    },
  ];

  const totalItems = evaluationCriteria.reduce((s, sec) => s + sec.items.length, 0);
  const answeredItems = Object.keys(ratings).length;

  useEffect(() => { loadProgrammes(); }, []);

  const loadProgrammes = async () => {
    try {
      const res = await apiService.getProgrammes();
      if (res.data.success) setProgrammes(res.data.data);
    } catch (err) { console.error('Error loading programmes:', err); }
  };

  const handleProgrammeChange = async (e) => {
    const id = e.target.value;
    setSelectedProgramme(id);
    setSelectedCourse('');
    setSelectedLecturer('');
    setCourses([]);
    setLecturers([]);
    if (id) {
      try {
        const res = await apiService.getCoursesByProgramme(id);
        if (res.data.success) setCourses(res.data.data);
      } catch (err) { console.error('Error loading courses:', err); }
    }
  };

  const handleCourseChange = async (e) => {
    const id = e.target.value;
    setSelectedCourse(id);
    setSelectedLecturer('');
    setLecturers([]);
    if (id) {
      try {
        const res = await apiService.getCourseById(id);
        if (res.data.success) {
          const lecs = res.data.data?.lecturers || [];
          setLecturers(lecs);
          if (lecs.length === 1) setSelectedLecturer(String(lecs[0].id));
        }
      } catch (err) { console.error('Error loading lecturers:', err); }
    }
  };

  const isSectionComplete = (idx) =>
    evaluationCriteria[idx].items.every((item) => ratings[item.id] !== undefined);

  const canExpandSection = (idx) => idx === 0 || isSectionComplete(idx - 1);

  const getSectionProgress = (idx) => {
    const items = evaluationCriteria[idx].items;
    const done = items.filter((i) => ratings[i.id] !== undefined).length;
    return { completed: done, total: items.length, percentage: (done / items.length) * 100 };
  };

  const handleRatingChange = (criteriaId, value) => {
    const next = { ...ratings, [criteriaId]: value };
    setRatings(next);

    if (!ENABLE_ENHANCED_UI) return;

    // Auto-advance: when this section is now complete, move to the next
    const currentSec = evaluationCriteria.findIndex((sec) =>
      sec.items.some((i) => i.id === criteriaId)
    );
    if (currentSec === -1) return;
    const secComplete = evaluationCriteria[currentSec].items.every(
      (i) => (i.id === criteriaId ? value : next[i.id]) !== undefined
    );
    if (secComplete && currentSec < evaluationCriteria.length - 1) {
      const nextSec = currentSec + 1;
      setTimeout(() => {
        setExpandedSection(nextSec);
        sectionRefs.current[nextSec]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 320); // let the Framer exit animation finish
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedLecturer) { setError('Please select a lecturer'); return; }
    if (!selectedSemester) { setError('Please select a semester'); return; }
    if (!recommendation) { setError('Please indicate whether you would recommend this lecturer'); return; }
    if (!isSectionComplete(evaluationCriteria.length - 1)) {
      setError('Please complete all evaluation criteria'); return;
    }

    setLoading(true);
    try {
      const ratingDetails = [];
      evaluationCriteria.forEach((sec) => {
        sec.items.forEach((item) => {
          if (ratings[item.id] !== undefined) {
            ratingDetails.push({
              criteriaNumber: item.id,
              criteriaName: item.name,
              section: sec.section,
              rating: ratings[item.id],
            });
          }
        });
      });

      const res = await apiService.submitEvaluation({
        lecturerId: parseInt(selectedLecturer),
        courseId: parseInt(selectedCourse),
        studentFeedback: feedback,
        semester: parseInt(selectedSemester),
        recommend: recommendation,
        ratings: ratingDetails,
      });

      if (res.data.success) {
        setMessage('Thank you! Your evaluation has been submitted successfully.');
        setSelectedProgramme(''); setSelectedSemester(''); setSelectedCourse('');
        setSelectedLecturer(''); setRecommendation(''); setRatings({}); setFeedback('');
        setExpandedSection(0);
      } else {
        setError(res.data.message || 'Failed to submit evaluation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render — original path when feature flag is off
  // ---------------------------------------------------------------------------
  if (!ENABLE_ENHANCED_UI) {
    return (
      <div className="assessment-form">
        <form onSubmit={handleSubmit}>
          <div className="form-section selection-section">
            <div className="form-group">
              <label htmlFor="programme">Programme *</label>
              <select id="programme" value={selectedProgramme} onChange={handleProgrammeChange} required>
                <option value="">Select a programme</option>
                {programmes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="course">Course *</label>
              <select id="course" value={selectedCourse} onChange={handleCourseChange} disabled={!selectedProgramme} required>
                <option value="">Select a course</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="lecturer">Lecturer *</label>
              <select id="lecturer" value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)} disabled={!selectedCourse} required>
                <option value="">Select a lecturer</option>
                {lecturers.map((l) => <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="semester">Semester *</label>
              <select id="semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
                <option value="">Select a semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </select>
            </div>
          </div>
          <div className="scale-legend" aria-hidden="true">
            1 = Strongly Disagree · 2 = Disagree · 3 = Neutral · 4 = Agree · 5 = Strongly Agree
          </div>
          <div className="accordion">
            {evaluationCriteria.map((section, si) => {
              const { completed, total, percentage } = getSectionProgress(si);
              const isComplete = completed === total;
              const isActive = expandedSection === si;
              return (
                <div key={si} className={`accordion-item ${isComplete ? 'completed' : ''} ${isActive ? 'open' : ''}`}>
                  <button type="button" className={`accordion-header ${isActive ? 'active' : ''}`}
                    onClick={() => { if (canExpandSection(si)) setExpandedSection(isActive ? -1 : si); }}
                    disabled={!canExpandSection(si)}>
                    <div className="accordion-header-left">
                      <span className="section-title">{section.section}</span>
                      <span className="section-progress-text">{completed} of {total} completed</span>
                    </div>
                    <span className="section-status">{isComplete ? '✓' : '○'}</span>
                    <div className="header-progress-bar-container">
                      <div className={`header-progress-bar ${isComplete ? 'complete' : ''}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </button>
                  {isActive && (
                    <div className="accordion-content">
                      {section.items.map((item) => (
                        <div key={item.id} className="rating-item">
                          <label className="rating-question">{item.name}</label>
                          <div className="rating-options">
                            {[1, 2, 3, 4, 5].map((v) => {
                              const sel = ratings[item.id] === v;
                              return (
                                <label key={v} className={`rating-card ${sel ? 'selected' : ''} rating-val-${v}`} title={SCALE_LABELS[v]}>
                                  <input type="radio" name={`criteria-${item.id}`} value={v} checked={sel}
                                    onChange={() => handleRatingChange(item.id, v)} aria-label={`${SCALE_LABELS[v]} (${v})`} />
                                  <div className="rating-card-content">
                                    <span className="rating-number">{v}</span>
                                    <span className="rating-label-text">{SCALE_LABELS[v]}</span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="recommend">Would you recommend this lecturer? *</label>
              <select id="recommend" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} required>
                <option value="">Select an option</option>
                <option value="RECOMMEND">Recommend</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="NOT_RECOMMEND">Not Recommend</option>
              </select>
            </div>
          </div>
          <div className="form-section">
            <div className="form-group">
              <label htmlFor="feedback">Additional Feedback (Optional)</label>
              <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please provide any additional comments or suggestions..." rows="4" />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          <div className="form-actions">
            <button type="submit" disabled={loading || !isSectionComplete(evaluationCriteria.length - 1)} className="submit-button">
              {loading ? 'Submitting...' : 'Submit Evaluation'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render — enhanced UI (ENABLE_ENHANCED_UI = true)
  // ---------------------------------------------------------------------------
  return (
    <div className="assessment-form">
      <StickyLegend />

      <form onSubmit={handleSubmit}>
        {/* Selection */}
        <div className="form-section selection-section">
          <div className="form-group">
            <label htmlFor="programme">Programme *</label>
            <select id="programme" value={selectedProgramme} onChange={handleProgrammeChange} required>
              <option value="">Select a programme</option>
              {programmes.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <select id="course" value={selectedCourse} onChange={handleCourseChange} disabled={!selectedProgramme} required>
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="lecturer">Lecturer *</label>
            <select id="lecturer" value={selectedLecturer} onChange={(e) => setSelectedLecturer(e.target.value)} disabled={!selectedCourse} required>
              <option value="">Select a lecturer</option>
              {lecturers.map((l) => <option key={l.id} value={l.id}>{l.firstName} {l.lastName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <select id="semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
              <option value="">Select a semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        {/* Global progress bar */}
        <GlobalProgressBar answered={answeredItems} total={totalItems} />

        {/* Accordion */}
        <div className="accordion">
          {evaluationCriteria.map((section, si) => {
            const { completed, total, percentage } = getSectionProgress(si);
            const isComplete = completed === total;
            const isActive = expandedSection === si;
            const isLocked = !canExpandSection(si);

            return (
              <div
                key={si}
                ref={(el) => { sectionRefs.current[si] = el; }}
                className={`accordion-item${isComplete ? ' completed' : ''}${isActive ? ' open' : ''}${isLocked ? ' locked' : ''}`}
              >
                <button
                  type="button"
                  className={`accordion-header${isActive ? ' active' : ''}${isComplete && !isActive ? ' enh-complete' : ''}${isLocked ? ' enh-locked' : ''}`}
                  onClick={() => { if (!isLocked) setExpandedSection(isActive ? -1 : si); }}
                  disabled={isLocked}
                >
                  <div className="accordion-header-left">
                    <span className="section-title">
                      {isLocked && <Lock size={15} className="sec-icon sec-lock" aria-hidden="true" />}
                      {isComplete && !isActive && <CheckCircle2 size={15} className="sec-icon sec-done" aria-hidden="true" />}
                      {section.section}
                    </span>
                    <span className="section-progress-text">{completed} of {total} completed</span>
                  </div>
                  <span className="section-status">{isComplete ? '✓' : '○'}</span>
                  <div className="header-progress-bar-container">
                    <div className={`header-progress-bar${isComplete ? ' complete' : ''}`} style={{ width: `${percentage}%` }} />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="accordion-content">
                        {section.items.map((item) => (
                          <div key={item.id} className="rating-item">
                            <label className="rating-question">{item.name}</label>
                            <SegmentedControl
                              itemId={item.id}
                              value={ratings[item.id]}
                              onChange={handleRatingChange}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Recommendation */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="recommend">Would you recommend this lecturer? *</label>
            <select id="recommend" value={recommendation} onChange={(e) => setRecommendation(e.target.value)} required>
              <option value="">Select an option</option>
              <option value="RECOMMEND">Recommend</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NOT_RECOMMEND">Not Recommend</option>
            </select>
          </div>
        </div>

        {/* Feedback */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="feedback">Additional Feedback (Optional)</label>
            <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide any additional comments or suggestions..." rows="4" />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading || !isSectionComplete(evaluationCriteria.length - 1)}
            className="submit-button"
          >
            {loading ? 'Submitting...' : 'Submit Evaluation'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AssessmentForm;
