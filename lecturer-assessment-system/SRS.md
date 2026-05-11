
# Software Requirements Specification (SRS)
## for the Lecturer Assessment System

**Version 1.2**

**Prepared by:** World-Class Senior Frontend Engineer
**Date:** 2024-07-26

---

### Table of Contents
1. [Introduction](#1-introduction)
    1.1 [Purpose](#11-purpose)
    1.2 [Document Conventions](#12-document-conventions)
    1.3 [Project Scope](#13-project-scope)
    1.4 [References](#14-references)
2. [Overall Description](#2-overall-description)
    2.1 [Product Perspective](#21-product-perspective)
    2.2 [Product Features](#22-product-features)
    2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4 [Operating Environment](#24-operating-environment)
    2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
3. [System Features](#3-system-features)
    3.1 [Student Dashboard](#31-student-dashboard)
    3.2 [Lecturer Assessment Submission](#32-lecturer-assessment-submission)
    3.3 [AI-Powered PDF Data Extraction](#33-ai-powered-pdf-data-extraction)
    3.4 [Results Viewing](#34-results-viewing)
    3.5 [Lecturer Directory](#35-lecturer-directory)
    3.6 [Analytics Dashboard](#36-analytics-dashboard)
    3.7 [Data Management (Import/Export)](#37-data-management-importexport)
    3.8 [Self-Testing (Quiz) Functionality](#38-self-testing-quiz-functionality)
    3.9 [Administrator Panel](#39-administrator-panel)
4. [Non-Functional Requirements](#4-non-functional-requirements)
    4.1 [Performance Requirements](#41-performance-requirements)
    4.2 [Security Requirements](#42-security-requirements)
    4.3 [Usability Requirements](#43-usability-requirements)
    4.4 [Maintainability](#44-maintainability)

---

### 1. Introduction

#### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a detailed description of the requirements for the Lecturer Assessment System. Its purpose is to define the features, functionalities, and constraints of the application, serving as a foundational guide for development, testing, and future enhancements. This document is intended for project managers, developers, testers, and administrators.

#### 1.2 Document Conventions
This document follows a structure inspired by the IEEE Std 830-1998 standard for SRS documents.

#### 1.3 Project Scope
The Lecturer Assessment System is a web application designed for the University College community. Its primary scope is to:
- Provide students with a platform to submit anonymous assessments for lecturers.
- Enable administrators to view aggregated assessment results and analytics.
- Automate the process of populating lecturer and course data by extracting it from PDF programme documents using the Google Gemini API.
- Offer a self-testing feature for students to take quizzes on their courses.
- Provide a secure administrative backend for system monitoring and data management.

The system aims to improve academic feedback loops, provide data-driven insights, and enhance the student learning experience.

#### 1.4 References
- IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
- Google Gemini API Documentation.
- React.js and Tailwind CSS Documentation.

### 2. Overall Description

#### 2.1 Product Perspective
The application is a standalone, single-page web application (SPA) built using React. It operates entirely on the client-side, with data being stored in the browser's memory for the duration of a session. The integration with the Google Gemini API is a key external dependency for the AI-powered data extraction feature.

#### 2.2 Product Features
The major features of the system include:
- A dynamic home dashboard for programme and curriculum viewing.
- A structured form for submitting lecturer assessments.
- An AI-driven feature to upload and process PDF documents.
- Visualizations for assessment results and analytics.
- A public directory of lecturers with their average ratings.
- Import/Export functionality for assessment data.
- An interactive quiz system for student self-assessment.
- A password-protected administrator panel with audit logging.

#### 2.3 User Classes and Characteristics
- **Students:** The primary users. They can view programme curricula, submit assessments, and take quizzes. They do not need to log in.
- **Administrators:** Users with privileged access. They can view all results, analytics, manage data via import/export, and monitor system activity through audit logs. Access is controlled by a password.

#### 2.4 Operating Environment
The application is a web-based platform and must be compatible with modern web browsers, including:
- Google Chrome (latest two versions)
- Mozilla Firefox (latest two versions)
- Microsoft Edge (latest two versions)
- Safari (latest two versions)

The application is responsive and functional on desktops, tablets, and mobile devices.

#### 2.5 Design and Implementation Constraints
- **Technology Stack:** The frontend must be implemented using React, TypeScript, and Tailwind CSS.
- **API Key:** The Google Gemini API key must be managed as an environment variable (`process.env.API_KEY`) and not exposed on the client-side.
- **Client-Side Storage:** All data (assessments, logs, etc.) is stored in-memory and will be lost upon page refresh. No persistent database is in scope for this version.

### 3. System Features

#### 3.1 Student Dashboard
- **3.1.1 Description:** The default landing page of the application. It displays a list of available academic programmes.
- **3.1.2 Functional Requirements:**
    - Shall display each programme as an interactive card.
    - Each card shall show the programme name and total number of courses.
    - Clicking a programme card shall navigate the user to a detailed curriculum view, organized by academic year.
    - The curriculum view shall list all courses for that programme.

#### 3.2 Lecturer Assessment Submission
- **3.2.1 Description:** A form that allows students to rate lecturers and provide feedback.
- **3.2.2 Functional Requirements:**
    - The form shall require the user to select a programme, lecturer, subject, and semester.
    - The lecturer dropdown shall be dynamically populated based on the selected programme.
    - Users must provide a 1-5 star rating for multiple categories (e.g., Teaching Quality, Communication).
    - An optional text area for comments shall be available.
    - A recommendation dropdown shall be included.
    - Upon successful submission, a confirmation modal shall be displayed.

#### 3.3 AI-Powered PDF Data Extraction
- **3.3.1 Description:** A feature allowing administrators to upload PDF documents to automatically populate lecturer and course lists.
- **3.3.2 Functional Requirements:**
    - The user must first select a programme.
    - The user shall be able to upload a `.pdf` file via drag-and-drop or a file browser.
    - The system shall extract text from the PDF and send it to the Gemini API.
    - The API shall return a structured JSON object containing lists of lecturers and courses.
    - The extracted data shall be displayed for review.
    - The user shall have options to save the data to the system or edit it before saving.

#### 3.4 Results Viewing
- **3.4.1 Description:** A tab that displays all submitted assessments.
- **3.4.2 Functional Requirements:**
    - Shall list each assessment with lecturer name, subject, average rating, recommendation, and comments.
    - If no assessments have been submitted, a message shall indicate this.

#### 3.5 Lecturer Directory
- **3.5.1 Description:** A directory of all lecturers in the system.
- **3.5.2 Functional Requirements:**
    - Shall display each lecturer in a card format.
    - Each card shall show the lecturer's name, programme, average rating, and the number of reviews.
    - If a lecturer has no reviews, this shall be indicated.

#### 3.6 Analytics Dashboard
- **3.6.1 Description:** A dashboard showing high-level statistics about the submitted assessments.
- **3.6.2 Functional Requirements:**
    - Shall display the total number of assessments.
    - Shall display the overall average rating across all assessments.
    - Shall display the most frequently assessed programme.

#### 3.7 Data Management (Import/Export)
- **3.7.1 Description:** Tools for exporting and importing assessment data.
- **3.7.2 Functional Requirements:**
    - The "Export to JSON" feature shall compile all current assessment data into a single `.json` file and trigger a browser download.
    - The "Import from JSON" feature shall allow a user to upload a `.json` file.
    - The system shall validate the format of the imported file.
    - Before replacing existing data, the system shall prompt the user for confirmation.

#### 3.8 Self-Testing (Quiz) Functionality
- **3.8.1 Description:** An interactive quiz feature for students.
- **3.8.2 Functional Requirements:**
    - In the curriculum view, courses with available questions shall have a "Start Quiz" button.
    - Clicking the button shall open a quiz modal.
    - The quiz shall have a timer based on the course's specified duration.
    - The modal shall display one multiple-choice question at a time.
    - After the quiz is completed or the time runs out, a final score shall be displayed.

#### 3.9 Administrator Panel
- **3.9.1 Description:** A password-protected section for administrative functions.
- **3.9.2 Functional Requirements:**
    - Access to the Admin tab shall be restricted by a password.
    - A modal shall prompt for the password upon the first click.
    - Upon successful authentication, the Admin Panel shall be accessible for the remainder of the session.
    - The panel shall contain an Audit Log.
    - The Audit Log shall display a chronological list of important system events (e.g., admin login, data import/export).
    - Each log entry shall include a timestamp, action type, and a descriptive message.

### 4. Non-Functional Requirements

#### 4.1 Performance Requirements
- The application UI shall be responsive and load in under 3 seconds on a standard broadband connection.
- AI processing of PDFs should provide feedback to the user (e.g., loading indicator) and should ideally complete within 15 seconds.
- Quiz timers must be accurate and update every second.

#### 4.2 Security Requirements
- The Gemini API key must not be exposed to the client-side.
- The administrator password must not be stored in plaintext in the source code (though for this demo, it is a constant).
- All user-provided input should be treated as untrusted, though no server-side processing minimizes risks like XSS.

#### 4.3 Usability Requirements
- The application shall have a clean, intuitive, and consistent user interface.
- Navigation shall be clear and accessible.
- The design must be responsive and adapt to various screen sizes, from mobile phones to desktops.
- All interactive elements should provide clear visual feedback (e.g., hover states, click effects).

#### 4.4 Maintainability
- The code shall be written in TypeScript to ensure type safety.
- The codebase shall be organized into logical components, services, and constants.
- Documentation in the form of guides (Admin, Testing, Deployment) must be maintained and updated with the codebase.
