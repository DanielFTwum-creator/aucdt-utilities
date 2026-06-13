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
            <h1>Lecturer Assessment &amp; Evaluation Portal</h1>
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
                <strong>Your responses are anonymous.</strong> Your identity is never
                stored with your answers — it is only used to prevent duplicate
                submissions.
              </li>
              <li>
                You may submit <strong>one evaluation per lecturer per course each
                semester</strong>.
              </li>
              <li>
                Rate each statement on a scale of <strong>1 (Strongly Disagree)</strong>{' '}
                to <strong>5 (Strongly Agree)</strong>.
              </li>
              <li>
                Complete the sections in order — each section unlocks once the previous
                one is fully rated.
              </li>
              <li>
                Please be honest and constructive. Written comments are optional but
                especially valuable to your lecturers.
              </li>
              <li>The evaluation takes about five minutes.</li>
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
