import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentForm from './AssessmentForm';
import Header from './Header';
import './StudentPortal.css';

function StudentPortal({ theme, onThemeChange }) {
  const navigate = useNavigate();
  const [showAdminButton, setShowAdminButton] = useState(true);

  const handleAdminClick = () => {
    navigate('/admin/login');
  };

  return (
    <div className="student-portal">
      <Header theme={theme} onThemeChange={onThemeChange} />
      
      <div className="portal-container">
        <div className="portal-header">
          <h1>Lecturer Assessment & Evaluation Portal</h1>
          <p>Please provide your honest feedback about your lecturer and course experience</p>
          {showAdminButton && (
            <button className="admin-button" onClick={handleAdminClick}>
              Admin Panel
            </button>
          )}
        </div>

        <AssessmentForm />
      </div>
    </div>
  );
}

export default StudentPortal;

