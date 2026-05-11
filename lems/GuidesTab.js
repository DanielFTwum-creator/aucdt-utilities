import React from 'react';
import '../../styles/tabs/GuidesTab.css';

function GuidesTab() {
  return (
    <div className="guides-tab">
      <h2>User Guides</h2>

      <div className="guides-container">
        <div className="guide-section">
          <h3>📖 Getting Started</h3>
          <p>
            Welcome to the Lecturer Assessment & Evaluation Portal (LEMS). This guide will help you
            navigate the system and understand its features.
          </p>
        </div>

        <div className="guide-section">
          <h3>👨‍🎓 For Students</h3>
          <ul>
            <li>
              <strong>Submit Feedback:</strong> Navigate to the main portal and select your
              programme, course, and lecturer to submit an evaluation.
            </li>
            <li>
              <strong>Rating Scale:</strong> Use the 1-5 scale where 1 = Strongly Disagree and 5 =
              Strongly Agree.
            </li>
            <li>
              <strong>Accordion Sections:</strong> Complete each section before moving to the next.
              All criteria must be rated.
            </li>
            <li>
              <strong>Additional Feedback:</strong> You can provide optional comments in the
              feedback section.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>⚙️ For Administrators</h3>
          <ul>
            <li>
              <strong>Login:</strong> Click the Admin button on the main portal and enter the admin
              password.
            </li>
            <li>
              <strong>Dashboard Tabs:</strong> Use the tabs to navigate different sections of the
              dashboard.
            </li>
            <li>
              <strong>Overview:</strong> View key statistics about evaluations, lecturers, courses,
              and programmes.
            </li>
            <li>
              <strong>Results:</strong> Search and filter individual evaluations submitted by
              students.
            </li>
            <li>
              <strong>Lecturers:</strong> View and manage lecturer information with sorting and
              search capabilities.
            </li>
            <li>
              <strong>Programmes:</strong> View all academic programmes and their associated
              courses.
            </li>
            <li>
              <strong>Analytics:</strong> Analyze evaluation data with average ratings and trends.
            </li>
            <li>
              <strong>Admin Panel:</strong> Upload curriculum PDFs and view system audit logs.
            </li>
            <li>
              <strong>Self Test:</strong> Run automated tests to verify system functionality.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>📄 PDF Upload</h3>
          <ul>
            <li>
              <strong>File Format:</strong> Only PDF files are accepted. Ensure your timetable is
              in PDF format.
            </li>
            <li>
              <strong>Data Extraction:</strong> The system uses AI to extract curriculum data from
              the PDF.
            </li>
            <li>
              <strong>Warning:</strong> Uploading a new PDF will replace existing curriculum data
              and clear all evaluations.
            </li>
            <li>
              <strong>Backup:</strong> Consider backing up your data before uploading a new PDF.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>🎨 Themes</h3>
          <ul>
            <li>
              <strong>Light Theme:</strong> Default theme with light background and dark text.
            </li>
            <li>
              <strong>Dark Theme:</strong> Dark background with light text for reduced eye strain.
            </li>
            <li>
              <strong>High Contrast:</strong> Enhanced contrast for better accessibility.
            </li>
          </ul>
        </div>

        <div className="guide-section">
          <h3>❓ FAQ</h3>
          <dl>
            <dt>How do I submit an evaluation?</dt>
            <dd>
              Select your programme, course, and lecturer from the dropdowns on the main portal,
              then rate each criterion and submit.
            </dd>

            <dt>Can I edit my evaluation after submission?</dt>
            <dd>Currently, evaluations cannot be edited after submission. Please review before submitting.</dd>

            <dt>What is the default admin password?</dt>
            <dd>The default admin password is "admin123". Change this in the system settings.</dd>

            <dt>How often should I back up the data?</dt>
            <dd>
              It is recommended to back up your data regularly, especially before uploading new
              curriculum PDFs.
            </dd>

            <dt>What file formats are supported for PDF upload?</dt>
            <dd>Only PDF files (.pdf) are supported for curriculum upload.</dd>
          </dl>
        </div>

        <div className="guide-section">
          <h3>📞 Support</h3>
          <p>
            For technical support or questions, please contact the system administrator or submit
            feedback through the application.
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuidesTab;

