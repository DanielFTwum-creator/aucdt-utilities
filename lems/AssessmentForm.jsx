import React, { useState, useEffect } from 'react';
import { apiService } from './api';
import './AssessmentForm.css';

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

  // Merged instrument (LEAP statement wording, LEMS 20-item depth):
  // each item is a statement rated 1 (Strongly Disagree) to 5 (Strongly Agree).
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

  const SCALE_LABELS = {
    1: 'Strongly Disagree',
    2: 'Disagree',
    3: 'Neutral',
    4: 'Agree',
    5: 'Strongly Agree',
  };

  useEffect(() => {
    loadProgrammes();
  }, []);

  const loadProgrammes = async () => {
    try {
      const response = await apiService.getProgrammes();
      if (response.data.success) {
        setProgrammes(response.data.data);
      }
    } catch (err) {
      console.error('Error loading programmes:', err);
    }
  };

  const handleProgrammeChange = async (e) => {
    const programmeId = e.target.value;
    setSelectedProgramme(programmeId);
    setSelectedCourse('');
    setSelectedLecturer('');
    setCourses([]);
    setLecturers([]);

    if (programmeId) {
      try {
        const response = await apiService.getCoursesByProgramme(programmeId);
        if (response.data.success) {
          setCourses(response.data.data);
        }
      } catch (err) {
        console.error('Error loading courses:', err);
      }
    }
  };

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    setSelectedLecturer('');
    setLecturers([]);

    if (courseId) {
      try {
        const response = await apiService.getCourseById(courseId);
        if (response.data.success) {
          const course = response.data.data;
          const courseLecturers = course.lecturers || [];
          setLecturers(courseLecturers);
          // Single-lecturer course: pre-select for the student (LEAP FR1.4).
          if (courseLecturers.length === 1) {
            setSelectedLecturer(String(courseLecturers[0].id));
          }
        }
      } catch (err) {
        console.error('Error loading lecturers:', err);
      }
    }
  };

  const handleRatingChange = (criteriaId, value) => {
    setRatings({
      ...ratings,
      [criteriaId]: parseInt(value),
    });
  };

  const isSectionComplete = (sectionIndex) => {
    const section = evaluationCriteria[sectionIndex];
    return section.items.every((item) => ratings[item.id] !== undefined);
  };

  const getSectionProgress = (sectionIndex) => {
    const section = evaluationCriteria[sectionIndex];
    const completedCount = section.items.filter((item) => ratings[item.id] !== undefined).length;
    const totalCount = section.items.length;
    return {
      completed: completedCount,
      total: totalCount,
      percentage: (completedCount / totalCount) * 100,
    };
  };

  const canExpandSection = (sectionIndex) => {
    if (sectionIndex === 0) return true;
    return isSectionComplete(sectionIndex - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Validation
    if (!selectedLecturer) {
      setError('Please select a lecturer');
      return;
    }

    if (!selectedSemester) {
      setError('Please select a semester');
      return;
    }

    if (!recommendation) {
      setError('Please indicate whether you would recommend this lecturer');
      return;
    }

    if (!isSectionComplete(evaluationCriteria.length - 1)) {
      setError('Please complete all evaluation criteria');
      return;
    }

    setLoading(true);

    try {
      // Persist each criterion with its name and section (not just the number),
      // so results and the audit trail stay meaningful as criteria evolve.
      const ratingDetails = [];
      evaluationCriteria.forEach((section) => {
        section.items.forEach((item) => {
          if (ratings[item.id] !== undefined) {
            ratingDetails.push({
              criteriaNumber: item.id,
              criteriaName: item.name,
              section: section.section,
              rating: ratings[item.id],
            });
          }
        });
      });

      const submissionData = {
        lecturerId: parseInt(selectedLecturer),
        courseId: parseInt(selectedCourse),
        studentFeedback: feedback,
        semester: parseInt(selectedSemester),
        recommend: recommendation,
        ratings: ratingDetails,
      };

      const response = await apiService.submitEvaluation(submissionData);

      if (response.data.success) {
        setMessage('Thank you! Your evaluation has been submitted successfully.');
        // Reset form
        setSelectedProgramme('');
        setSelectedSemester('');
        setSelectedCourse('');
        setSelectedLecturer('');
        setRecommendation('');
        setRatings({});
        setFeedback('');
        setExpandedSection(0);
      } else {
        setError(response.data.message || 'Failed to submit evaluation');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assessment-form">
      <form onSubmit={handleSubmit}>
        {/* Programme and Course Selection */}
        <div className="form-section selection-section">
          <div className="form-group">
            <label htmlFor="programme">Programme *</label>
            <select
              id="programme"
              value={selectedProgramme}
              onChange={handleProgrammeChange}
              required
            >
              <option value="">Select a programme</option>
              {programmes.map((prog) => (
                <option key={prog.id} value={prog.id}>
                  {prog.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <select
              id="course"
              value={selectedCourse}
              onChange={handleCourseChange}
              disabled={!selectedProgramme}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="lecturer">Lecturer *</label>
            <select
              id="lecturer"
              value={selectedLecturer}
              onChange={(e) => setSelectedLecturer(e.target.value)}
              disabled={!selectedCourse}
              required
            >
              <option value="">Select a lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.firstName} {lecturer.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <select
              id="semester"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              required
            >
              <option value="">Select a semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>

        {/* Rating scale legend */}
        <div className="scale-legend" aria-hidden="true">
          1 = Strongly Disagree · 2 = Disagree · 3 = Neutral · 4 = Agree · 5 = Strongly Agree
        </div>

        {/* Accordion Sections */}
        <div className="accordion">
          {evaluationCriteria.map((section, sectionIndex) => {
            const { completed, total, percentage } = getSectionProgress(sectionIndex);
            const isComplete = completed === total;
            const isActive = expandedSection === sectionIndex;

            return (
              <div key={sectionIndex} className={`accordion-item ${isComplete ? 'completed' : ''} ${isActive ? 'open' : ''}`}>
                <button
                  type="button"
                  className={`accordion-header ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    if (canExpandSection(sectionIndex)) {
                      setExpandedSection(isActive ? -1 : sectionIndex);
                    }
                  }}
                  disabled={!canExpandSection(sectionIndex)}
                >
                  <div className="accordion-header-left">
                    <span className="section-title">{section.section}</span>
                    <span className="section-progress-text">
                      {completed} of {total} completed
                    </span>
                  </div>
                  <span className="section-status">
                    {isComplete ? '✓' : '○'}
                  </span>
                  <div className="header-progress-bar-container">
                    <div 
                      className={`header-progress-bar ${isComplete ? 'complete' : ''}`} 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </button>

                {isActive && (
                  <div className="accordion-content">
                    {section.items.map((item) => (
                      <div key={item.id} className="rating-item">
                        <label className="rating-question">{item.name}</label>
                        <div className="rating-options">
                          {[1, 2, 3, 4, 5].map((value) => {
                            const isSelected = ratings[item.id] === value;
                            return (
                              <label 
                                key={value} 
                                className={`rating-card ${isSelected ? 'selected' : ''} rating-val-${value}`}
                                title={SCALE_LABELS[value]}
                              >
                                <input
                                  type="radio"
                                  name={`criteria-${item.id}`}
                                  value={value}
                                  checked={isSelected}
                                  onChange={() => handleRatingChange(item.id, value)}
                                  aria-label={`${SCALE_LABELS[value]} (${value})`}
                                />
                                <div className="rating-card-content">
                                  <span className="rating-number">{value}</span>
                                  <span className="rating-label-text">{SCALE_LABELS[value]}</span>
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

        {/* Recommendation */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="recommend">Would you recommend this lecturer? *</label>
            <select
              id="recommend"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              required
            >
              <option value="">Select an option</option>
              <option value="RECOMMEND">Recommend</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NOT_RECOMMEND">Not Recommend</option>
            </select>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="feedback">Additional Feedback (Optional)</label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please provide any additional comments or suggestions..."
              rows="4"
            />
          </div>
        </div>

        {/* Messages */}
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        {/* Submit Button */}
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

