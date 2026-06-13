import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from './AssessmentForm';
import Header from './Header';
import './StudentPortal.css';

const ENABLE_ENHANCED_UI = true;

function StudentPortal({ theme, onThemeChange }) {
  const navigate = useNavigate();
  const [instructionsRead, setInstructionsRead] = useState(false);

  const handleAdminClick = () => navigate('/admin/login');

  return (
    <div className="student-portal">
      <Header
        theme={theme}
        onThemeChange={onThemeChange}
        onAdminClick={handleAdminClick}
        showAdmin={true}
      />

      <div className={`portal-container${ENABLE_ENHANCED_UI ? ' portal-container-enhanced' : ''}`}>
        {!ENABLE_ENHANCED_UI && (
          <div className="portal-header">
            <button className="admin-link" onClick={handleAdminClick} aria-label="Admin">
              Admin
            </button>
            <img
              src="https://techbridge.edu.gh/static/TUC_LOGO_small.png"
              alt="TUC"
              className="portal-logo"
            />
            <h1>Lecturer Evaluation &amp; Management System</h1>
            <p>Please provide your honest feedback about your lecturer and course experience</p>
          </div>
        )}

        {instructionsRead ? (
          <AssessmentForm />
        ) : (
          <div className={`instructions-card${ENABLE_ENHANCED_UI ? ' instructions-card-enhanced' : ''}`}>
            {ENABLE_ENHANCED_UI && (
              <span className="step-label">Step 1 of 2</span>
            )}
            <h2 className={ENABLE_ENHANCED_UI ? 'instructions-heading-enhanced' : ''}>Before you begin</h2>
            <ul className="instructions-list">
              <li>
                <strong>Takes about five minutes</strong> to complete.
              </li>
              <li>
                <strong>Your responses are completely anonymous.</strong> Your identity
                is only used to prevent duplicate submissions — it is never stored with
                your answers.
              </li>
              <li>
                You may submit <strong>one evaluation per lecturer per course each
                semester</strong>.
              </li>
              <li>
                <strong>Rate each statement 1–5:</strong> 1 = Strongly Disagree,
                5 = Strongly Agree.
              </li>
              <li>
                <strong>Complete the sections in order</strong> — each section unlocks
                after the previous one is fully rated.
              </li>
              <li>
                Written comments are optional but valuable to your lecturers.
              </li>
            </ul>
            <button
              className="proceed-button"
              onClick={() => setInstructionsRead(true)}
            >
              Proceed to Evaluation
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentPortal;
