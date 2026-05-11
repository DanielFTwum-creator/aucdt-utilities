# Software Requirements Specification (SRS)
## for AUCDT MSEE Mathematics Aptitude Test
**Version:** 2.3
**Date:** November 5, 2023

---
### **Table of Contents**
1. [Introduction](#1-introduction)
    1.1 [Purpose](#11-purpose)
    1.2 [Scope](#12-scope)
    1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
    2.1 [Product Perspective](#21-product-perspective)
    2.2 [Product Features](#22-product-features)
    2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4 [Operating Environment](#24-operating-environment)
3. [System Features](#3-system-features)
    3.1 [Student Examination Module](#31-student-examination-module)
    3.2 [Administrator Module](#32-administrator-module)
    3.3 [Self-Test & Demonstration Module](#33-self-test--demonstration-module)
    3.4 [Accessibility Module](#34-accessibility-module)
    3.5 [Auditing Module](#35-auditing-module)
4. [External Interface Requirements](#4-external-interface-requirements)
    4.1 [User Interfaces](#41-user-interfaces)
    4.2 [Software Interfaces](#42-software-interfaces)
5. [Non-Functional Requirements](#5-non-functional-requirements)
    5.1 [Performance](#51-performance)
    5.2 [Security](#52-security)
    5.3 [Reliability](#53-reliability)
6. [System Architecture](#6-system-architecture)
    6.1 [Application Architecture](#61-application-architecture)
    6.2 [Database Schema](#62-database-schema)

---

### **1. Introduction**

#### **1.1 Purpose**
This document provides a detailed specification for the AUCDT Mature Students Entrance Examination (MSEE) Mathematics Aptitude Test web application, Version 2.2. The application is designed to provide a modern, robust, and accessible platform for students to take a timed mathematics exam and for administrators to manage and generate exam content using Artificial Intelligence.

#### **1.2 Scope**
The application is a comprehensive tool for mathematics assessment. Its scope includes:
*   A timed, multiple-choice examination environment for students, requiring user authentication.
*   A client-server architecture with a Node.js backend and a MySQL database.
*   Automatic server-side saving and restoration of exam progress.
*   A results summary with question-by-question feedback and PDF export functionality.
*   A password-protected admin section for generating new exam questions from text via a secure backend proxy to the Google Gemini API.
*   An automated self-test mode to demonstrate application functionality.
*   User-selectable accessibility themes (Light, Dark, High-Contrast).
*   Secure, server-side audit logging of key events to the MySQL database.
*   Filtering and searching of available exams for students.

#### **1.3 Definitions, Acronyms, and Abbreviations**
*   **AI**: Artificial Intelligence
*   **API**: Application Programming Interface
*   **SPA**: Single Page Application
*   **SRS**: Software Requirements Specification
*   **UI/UX**: User Interface / User Experience
*   **PDF**: Portable Document Format
*   **WCAG**: Web Content Accessibility Guidelines
*   **JWT**: JSON Web Token

### **2. Overall Description**

#### **2.1 Product Perspective**
The product is a three-tier, client-server application. The frontend is a Single Page Application (SPA) built using React and TypeScript. It is served by a Node.js (Express) backend, which handles all business logic, manages user authentication via JWTs, and acts as a secure proxy for API calls to the Google Gemini API. Persistence is managed by a self-hosted MySQL database.

#### **2.2 Product Features**
*   **Secure Authentication:** Role-based access control for students and administrators with JWT-based session management.
*   **Dynamic Student Flow:** A seamless experience from starting the exam to reviewing detailed results.
*   **Secure AI-Powered Content Creation:** Administrators generate new exam questions through the local server, which securely manages the API key and communication with the Google Gemini API.
*   **Persistent Progress Management:** Student work is saved automatically to the server, allowing them to resume sessions across different devices.
*   **Accessibility First:** A theme switcher ensures the application is usable for a wider range of users.
*   **Built-in Demo & Testing:** A self-test mode provides a quick, automated walkthrough of application features.
*   **Administrative Oversight:** Server-side audit logs in the MySQL database provide a secure record of important system interactions.
*   **Enhanced Exam Discovery:** Students can filter exams by subject and search by name.

#### **2.3 User Classes and Characteristics**
1.  **Student:** The primary user. Must register and log in to an account. Interacts with the exam-taking interface.
2.  **Administrator (Privileged User):** A user with a specific 'admin' role in the database. Accesses a separate interface to manage exam content.

#### **2.4 Operating Environment**
The application requires a server environment (e.g., an Ubuntu server) capable of running Node.js and a MySQL database. The client-side component runs in any modern web browser with JavaScript enabled. Internet connectivity is required for all functions.

### **3. System Features**

#### **3.1 Student Examination Module**
*   **3.1.1 Authentication:** Students must register and sign in to access the examination portal.
*   **3.1.2 Start Screen:** Presents exam instructions, duration, and an option to randomize question order. Allows students to filter available exams by subject and search by name.
*   **3.1.3 Exam Interface:** Displays a countdown timer, question navigation grid, and one question at a time. Features a control bar with buttons for manually pausing, resuming, and resetting the exam. The timer also pauses automatically if the user navigates away from the browser tab.
*   **3.1.4 Answering:** Users select answers from multiple-choice options. Progress is auto-saved to the server periodically.
*   **3.1.5 Submission:** The exam is submitted automatically when time expires, or manually by the student.
*   **3.1.6 Results View:** Displays the final score and a detailed review of each question. Users can export their results to a PDF.

#### **3.2 Administrator Module**
*   **3.2.1 Secure Access:** The admin panel is accessible via a `?admin` URL parameter and is protected by role-based authentication.
*   **3.2.2 Exam Generation:** Admins can paste text content into a text area and select a subject. Clicking "Generate" sends a request to the local Node.js server, which then securely calls the Google Gemini API.
*   **3.2.3 Exam Management:** Admins provide a name and description for the generated exam before saving it to the MySQL database.

#### **3.3 Self-Test & Demonstration Module**
*   **3.3.1 Access:** The mode is activated by navigating to the `?selftest` URL parameter.
*   **3.3.2 Automated Workflow:** The application automatically simulates the entire student journey.
*   **3.3.3 Screenshot Utility:** The self-test view includes a button to capture a screenshot of the current application state.

#### **3.4 Accessibility Module**
*   **3.4.1 Theme Switcher:** A UI component allows any user to toggle between 'Light', 'Dark', and 'High-Contrast' themes.
*   **3.4.2 State Persistence:** The selected theme is saved in the browser's local storage.

#### **3.5 Auditing Module**
*   **3.5.1 Event Logging:** Key actions are logged by the backend into the `audit_logs` table in the MySQL database.
*   **3.5.2 Secure Storage:** Logs are inaccessible from the client-side, ensuring integrity.

### **4. External Interface Requirements**

#### **4.1 User Interfaces**
The application presents a clean, responsive UI. It uses the MathJax library to render mathematical formulas, ensuring they are sharp and readable.

#### **4.2 Software Interfaces**
*   **Node.js/Express:** The backend server environment.
*   **MySQL:** The relational database for all application data.
*   **Google Gemini API (@google/genai):** Used by the backend server to generate questions.
*   **jsPDF & html2canvas:** Client-side libraries used for PDF export and screenshot capture.
*   **MathJax:** A client-side library for rendering mathematical notation.

### **5. Non-Functional Requirements**

#### **5.1 Performance**
The application shall have a fast initial load time. Backend API calls must be efficient and provide clear loading states on the client.

#### **5.2 Security**
*   User passwords are not stored in plaintext; they are hashed using `bcrypt`.
*   Sessions are managed using secure, short-lived JSON Web Tokens (JWTs).
*   Role-based authorization is enforced on the server for all sensitive actions (e.g., saving exams).
*   The Google Gemini API key is stored securely on the server as an environment variable.

#### **5.3 Reliability**
The backend server should include robust error handling. The frontend will gracefully handle server errors, displaying informative messages to the user.

### **6. System Architecture**

#### **6.1 Application Architecture**
The system is a three-tier application consisting of a client (browser), a backend server (Node.js), and a database (MySQL), all running on a single server environment, with external calls to Google's AI services.

<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" font-family="Arial, sans-serif" font-size="14px">
  <defs>
    <style>
      .box { fill: #fff; stroke: #333; stroke-width: 2; rx: 8; }
      .client-box { fill: #E3F2FD; stroke: #2196F3; }
      .server-box { fill: #E0F2F1; stroke: #009688; }
      .db-box { fill: #F3E5F5; stroke: #8E24AA; }
      .api-box { fill: #FCE4EC; stroke: #E91E63; }
      .arrow { stroke: #333; stroke-width: 1.5; fill: none; marker-end: url(#arrowhead); }
      .label { fill: #333; text-anchor: middle; }
      .title { font-size: 20px; font-weight: bold; text-anchor: middle; }
      .area-label { font-size: 16px; font-weight: bold; fill: #666; }
    </style>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#333"/>
    </marker>
  </defs>

  <rect x="1" y="1" width="798" height="598" fill="#F9FAFB" rx="10"/>
  <text x="400" y="40" class="title">AUCDT MSEE Test App - Architecture Diagram</text>

  <!-- Zones -->
  <rect x="20" y="70" width="370" height="510" fill="#F0F4F8" rx="5" stroke-dasharray="5,5" stroke="#90A4AE"/>
  <text x="205" y="95" class="area-label">User's Browser</text>
  
  <rect x="410" y="70" width="370" height="510" fill="#F0FBF4" rx="5" stroke-dasharray="5,5" stroke="#A5D6A7"/>
  <text x="595" y="95" class="area-label">Ubuntu Server</text>

  <!-- Client Application -->
  <g id="react-app">
    <rect x="50" y="250" width="310" height="150" class="box client-box"/>
    <text x="205" y="275" class="label" font-weight="bold">React SPA (Served by Node.js)</text>
    <text x="205" y="310" class="label">Student Exam Flow</text>
    <text x="205" y="340" class="label">Admin Panel</text>
    <text x="205" y="370" class="label">User Interface</text>
  </g>
  
  <!-- Server -->
   <g id="node-server">
    <rect x="440" y="140" width="310" height="150" class="box server-box"/>
    <text x="595" y="165" class="label" font-weight="bold">Node.js Backend (Express.js)</text>
    <text x="595" y="200" class="label">API Endpoints (/api/...)</text>
    <text x="595" y="225" class="label">Authentication (JWT)</text>
    <text x="595" y="250" class="label">Static File Serving</text>
  </g>

  <!-- Database -->
  <g id="mysql-db">
    <rect x="440" y="380" width="310" height="150" class="box db-box"/>
    <text x="595" y="405" class="label" font-weight="bold">MySQL Database</text>
    <text x="595" y="440" class="label">Users & Roles</text>
    <text x="595" y="465" class="label">Exams & Progress</text>
    <text x="595" y="490" class="label">Audit Logs</text>
  </g>
  
  <!-- Arrows -->
  <path class="arrow" d="M 360 325 H 440"/>
  <text x="400" y="320" class="label" font-size="12px">HTTP API Calls</text>
  
  <path class="arrow" d="M 595 290 V 380"/>
  <text x="635" y="335" class="label" font-size="12px">DB Queries</text>
  
  <!-- External API -->
  <g transform="translate(150, 450)">
    <rect x="440" y="-130" width="200" height="100" class="box api-box"/>
    <text x="540" y="-105" class="label" font-weight="bold">Google GenAI API</text>
    <text x="540" y="-75" class="label">Gemini 2.5 Flash</text>
    <path class="arrow" d="M 540 -180 V -130"/>
    <text x="540" y="-150" class="label" font-size="12px">Secure API Call</text>
  </g>
  <path class="arrow" d="M 595 140 C 625 110, 625 80, 540 80 C 455 80, 455 110, 540 180" stroke="none" fill="none"/>
  
</svg>

#### **6.2 Database Schema**
The MySQL database is composed of several related tables to manage users, exams, progress, and logs. See `docs/DATABASE_SCHEMA.svg` for a visual representation.