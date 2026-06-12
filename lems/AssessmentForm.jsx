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
  
  const [expandedSection, setExpandedSection] = useState(0);
  const [ratings, setRatings] = useState({});
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const evaluationCriteria = [
    {
      section: 'Teaching Quality',
      items: [
        { id: 1, name: 'Clear explanation of concepts' },
        { id: 2, name: 'Organized course content' },
        { id: 3, name: 'Effective use of teaching materials' },
        { id: 4, name: 'Engagement with students' },
        { id: 5, name: 'Clarity in course objectives' },
      ],
    },
    {
      section: 'Communication',
      items: [
        { id: 6, name: 'Responsiveness to student questions' },
        { id: 7, name: 'Clear communication of expectations' },
        { id: 8, name: 'Availability for consultation' },
        { id: 9, name: 'Constructive feedback on assignments' },
        { id: 10, name: 'Professional communication' },
      ],
    },
    {
      section: 'Assessment & Feedback',
      items: [
        { id: 11, name: 'Fair and transparent grading' },
        { id: 12, name: 'Timely feedback on work' },
        { id: 13, name: 'Clear assessment criteria' },
        { id: 14, name: 'Appropriate difficulty level' },
        { id: 15, name: 'Alignment with learning objectives' },
      ],
    },
    {
      section: 'Course Management',
      items: [
        { id: 16, name: 'Adherence to course schedule' },
        { id: 17, name: 'Well-organized course materials' },
        { id: 18, name: 'Effective use of learning platforms' },
        { id: 19, name: 'Accommodation of diverse learning styles' },
        { id: 20, name: 'Overall course quality' },
      ],
    },
  ];

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
          setLecturers(course.lecturers || []);
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
        ratings: ratingDetails,
      };

      const response = await apiService.submitEvaluation(submissionData);

      if (response.data.success) {
        setMessage('Thank you! Your evaluation has been submitted successfully.');
        // Reset form
        setSelectedProgramme('');
        setSelectedCourse('');
        setSelectedLecturer('');
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
        </div>

        {/* Accordion Sections */}
        <div className="accordion">
          {evaluationCriteria.map((section, sectionIndex) => (
            <div key={sectionIndex} className="accordion-item">
              <button
                type="button"
                className={`accordion-header ${expandedSection === sectionIndex ? 'active' : ''}`}
                onClick={() => {
                  if (canExpandSection(sectionIndex)) {
                    setExpandedSection(expandedSection === sectionIndex ? -1 : sectionIndex);
                  }
                }}
                disabled={!canExpandSection(sectionIndex)}
              >
                <span className="section-title">{section.section}</span>
                <span className="section-status">
                  {isSectionComplete(sectionIndex) ? '✓' : '○'}
                </span>
              </button>

              {expandedSection === sectionIndex && (
                <div className="accordion-content">
                  {section.items.map((item) => (
                    <div key={item.id} className="rating-item">
                      <label>{item.name}</label>
                      <div className="rating-options">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <label key={value} className="radio-label">
                            <input
                              type="radio"
                              name={`criteria-${item.id}`}
                              value={value}
                              checked={ratings[item.id] === value}
                              onChange={() => handleRatingChange(item.id, value)}
                            />
                            <span className="radio-text">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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

