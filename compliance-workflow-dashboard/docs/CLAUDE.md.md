# Software Requirements Specification (SRS)
## for the Compliance Workflow Dashboard

### Version 2.0 (Final)

---

### Table of Contents

1.  [Introduction](#1-introduction)
    1.1. [Purpose](#11-purpose)
    1.2. [Document Conventions](#12-document-conventions)
    1.3. [Intended Audience](#13-intended-audience)
    1.4. [Project Scope](#14-project-scope)
    1.5. [References](#15-references)
2.  [Overall Description](#2-overall-description)
    2.1. [Product Perspective](#21-product-perspective)
    2.2. [Product Features](#22-product-features)
    2.3. [User Classes and Characteristics](#23-user-classes-and-characteristics)
    2.4. [Operating Environment](#24-operating-environment)
    2.5. [Design and Implementation Constraints](#25-design-and-implementation-constraints)
3.  [System Architecture](#3-system-architecture)
    3.1. [High-Level Architecture](#31-high-level-architecture)
    3.2. [Technology Stack](#32-technology-stack)
    3.3. [Data Storage Architecture](#33-data-storage-architecture)
4.  [System Features](#4-system-features)
    4.1. [Framework Selection](#41-framework-selection)
    4.2. [Progress Tracking](#42-progress-tracking)
    4.3. [Directive Management](#43-directive-management)
    4.4. [State Persistence](#44-state-persistence)
    4.5. [Secure Admin Panel](#45-secure-admin-panel)
    4.6. [UI Theming](#46-ui-theming)
    4.7. [AI-Driven Self-Testing](#47-ai-driven-self-testing)
5.  [External Interface Requirements](#5-external-interface-requirements)
    5.1. [User Interfaces](#51-user-interfaces)
    5.2. [Software Interfaces](#52-software-interfaces)
6.  [Non-Functional Requirements](#6-non-functional-requirements)
    6.1. [Performance](#61-performance)
    6.2. [Usability & Accessibility](#62-usability--accessibility)
    6.3. [Reliability](#63-reliability)
    6.4. [Security](#64-security)

---

### 1. Introduction

#### 1.1. Purpose
This document provides a detailed description of the requirements for the **Compliance Workflow Dashboard**. It aims to define the functional and non-functional requirements of the system, serving as a foundational agreement between stakeholders on what the product should do.

#### 1.2. Document Conventions
This document follows the IEEE Std 830-1998 standard for Software Requirements Specifications.

#### 1.3. Intended Audience
This SRS is intended for project managers, developers, QA testers, and any stakeholders involved in the development, testing, and maintenance of the Compliance Workflow Dashboard.

#### 1.4. Project Scope
The project is a client-side web application designed to assist developers and project managers in tracking and managing project updates and compliance implementations. It provides a structured workflow for various frameworks (e.g., Standard Project Refresh, HIPAA, PCI-DSS) by breaking them down into actionable phases. For each phase, the application supplies a detailed directive that can be copied and used within an AI development environment, such as Google's AI Studio. The scope also includes administrative functions, user-selectable themes, and a novel AI-driven self-testing mechanism.

#### 1.5. References
- React Documentation
- Tailwind CSS Documentation
- Google Gemini API Documentation
- IEEE Std 830-1998, "Recommended Practice for Software Requirements Specifications"

### 2. Overall Description

#### 2.1. Product Perspective
The Compliance Workflow Dashboard is a standalone, single-page web application (SPA). It is built using modern web technologies and is intended to run entirely within a user's web browser. It has no server-side backend for its core functionality, relying on browser storage for data persistence and the Google Gemini API for its self-testing feature.

#### 2.2. Product Features
The major features of the dashboard are:
-   Selection from a predefined list of project/compliance frameworks.
-   Visualization of distinct phases for each framework.
-   Status tracking for each phase ('In Progress', 'Complete', 'Blocked').
-   An overall progress bar for the selected framework.
-   Expandable view for each phase containing a detailed text-based directive.
-   "Copy to Clipboard" functionality for each directive.
-   Automatic saving of progress to the browser's local storage.
-   User-selectable UI themes (Light, Dark, High-Contrast).
-   A password-protected Admin Panel for managing the application.
-   Comprehensive audit logging for all administrative actions.
-   An interactive, AI-driven "Playwright Self-Test" tab for on-demand testing.

#### 2.3. User Classes and Characteristics
-   **Developer/Project Manager (User):** The primary user, technically proficient, who requires a structured process for executing complex, multi-phase tasks using AI development tools.
-   **Administrator:** A user (typically a Developer or PM) who needs access to the secure admin functions, such as password management and audit log review.

The following Use Case diagram illustrates the interactions between actors and the system:

<details>
<summary>View UML Use Case Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <style>
      .actor-style { fill: #fff; stroke: #2d3748; stroke-width: 2; }
      .use-case-style { fill: #ebf8ff; stroke: #90cdf4; stroke-width: 2; rx: 20; }
      .text-style { fill: #2d3748; text-anchor: middle; }
      .actor-text { font-weight: 600; }
      .line-style { stroke: #4a5568; stroke-width: 1.5; }
      .system-boundary { fill: none; stroke: #cbd5e0; stroke-width: 2; stroke-dasharray: 8 4; }
    </style>
  </defs>
  <rect x="250" y="50" width="500" height="500" class="system-boundary"/>
  <text x="500" y="80" class="text-style" font-size="18" font-weight="bold">Compliance Dashboard System</text>
  <!-- Actors -->
  <g id="user-actor">
    <circle cx="100" cy="200" r="20" class="actor-style"/>
    <line x1="100" y1="220" x2="100" y2="260" class="actor-style"/>
    <line x1="100" y1="230" x2="80" y2="245" class="actor-style"/>
    <line x1="100" y1="230" x2="120" y2="245" class="actor-style"/>
    <line x1="100" y1="260" x2="80" y2="290" class="actor-style"/>
    <line x1="100" y1="260" x2="120" y2="290" class="actor-style"/>
    <text x="100" y="315" class="text-style actor-text">User</text>
  </g>
  <g id="admin-actor" transform="translate(0, 200)">
    <circle cx="100" cy="200" r="20" class="actor-style"/>
    <line x1="100" y1="220" x2="100" y2="260" class="actor-style"/>
    <line x1="100" y1="230" x2="80" y2="245" class="actor-style"/>
    <line x1="100" y1="230" x2="120" y2="245" class="actor-style"/>
    <line x1="100" y1="260" x2="80" y2="290" class="actor-style"/>
    <line x1="100" y1="260" x2="120" y2="290" class="actor-style"/>
    <text x="100" y="315" class="text-style actor-text">Administrator</text>
  </g>
  <!-- Inheritance -->
  <line x1="100" y1="330" x2="100" y2="380" class="line-style"/>
  <line x1="100" y1="380" x2="140" y2="380" class="line-style"/>
  <path d="M140 375 L 150 380 L 140 385 Z" fill="#fff" stroke="#4a5568" stroke-width="1.5"/>
  <text x="120" y="360" class="text-style" font-size="12">(is a)</text>

  <!-- User Use Cases -->
  <rect x="350" y="100" width="180" height="40" class="use-case-style"/>
  <text x="440" y="125" class="text-style">Select Framework</text>
  <line x1="150" y1="230" x2="350" y2="120" class="line-style"/>

  <rect x="350" y="160" width="180" height="40" class="use-case-style"/>
  <text x="440" y="185" class="text-style">Track Phase Progress</text>
  <line x1="150" y1="230" x2="350" y2="180" class="line-style"/>
  
  <rect x="350" y="220" width="180" height="40" class="use-case-style"/>
  <text x="440" y="245" class="text-style">Copy Directive</text>
  <line x1="150" y1="230" x2="350" y2="240" class="line-style"/>

  <rect x="350" y="280" width="180" height="40" class="use-case-style"/>
  <text x="440" y="305" class="text-style">Change Theme</text>
  <line x1="150" y1="230" x2="350" y2="300" class="line-style"/>

  <rect x="350" y="340" width="180" height="40" class="use-case-style"/>
  <text x="440" y="365" class="text-style">Run Self-Test</text>
  <line x1="150" y1="230" x2="350" y2="360" class="line-style"/>

  <!-- Admin Use Cases -->
  <rect x="550" y="420" width="180" height="40" class="use-case-style"/>
  <text x="640" y="445" class="text-style">Manage Password</text>
  <line x1="150" y1="430" x2="550" y2="440" class="line-style"/>

  <rect x="550" y="480" width="180" height="40" class="use-case-style"/>
  <text x="640" y="505" class="text-style">View/Clear Audit Log</text>
  <line x1="150" y1="430" x2="550" y2="500" class="line-style"/>
</svg>
</details>

#### 2.4. Operating Environment
The application is a web application and requires a modern web browser (e.g., Chrome, Firefox, Safari, Edge) with JavaScript enabled. An internet connection is required for the AI-driven self-testing feature.

#### 2.5. Design and Implementation Constraints
-   Must be implemented as a client-side only application.
-   Must be built using React and TypeScript.
-   Styling must be implemented using Tailwind CSS.
-   All user progress and settings data must be stored locally using the browser's `localStorage` API.
-   The AI-driven testing feature must use the Google Gemini API.

### 3. System Architecture

#### 3.1. High-Level Architecture
The application is a purely client-side system. The user interacts with the React application running in the browser, which reads from and writes to the browser's Local Storage for state persistence. For the self-testing feature, the application makes an external API call to the Google Gemini service.

<details>
<summary>View System Architecture Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <style>
      .bg { fill: #f9fafb; }
      .title { font-size: 20px; font-weight: 600; fill: #111827; text-anchor: middle; }
      .box { fill: #ffffff; stroke: #d1d5db; stroke-width: 1.5; rx: 8; }
      .box-title { font-weight: 600; fill: #374151; }
      .arrow { fill: none; stroke: #4f46e5; stroke-width: 2; marker-end: url(#arrowhead); }
      .arrow-dashed { stroke-dasharray: 6 4; }
      .arrow-label { fill: #4338ca; font-size: 13px; font-weight: 500; text-anchor: middle; }
    </style>
    <marker id="arrowhead" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#4f46e5"/>
    </marker>
  </defs>

  <rect width="100%" height="100%" class="bg"/>
  <text x="400" y="45" class="title">High-Level System Architecture</text>

  <!-- User -->
  <g transform="translate(50, 155)">
    <circle cx="50" cy="50" r="40" fill="#e0e7ff" stroke="#a5b4fc"/>
    <text x="50" y="55" text-anchor="middle" font-weight="600" fill="#3730a3">User</text>
  </g>
  
  <!-- Browser Box -->
  <rect x="200" y="90" width="300" height="220" class="box"/>
  <text x="350" y="120" text-anchor="middle" class="box-title">Web Browser</text>
  <line x1="210" y1="135" x2="490" y2="135" stroke="#e5e7eb"/>
  
  <!-- React App -->
  <rect x="225" y="150" width="250" height="70" fill="#d1fae5" stroke="#6ee7b7" rx="6"/>
  <text x="350" y="185" text-anchor="middle" font-weight="500" fill="#065f46">React App (UI & Logic)</text>
  
  <!-- Local Storage -->
  <rect x="225" y="230" width="250" height="60" fill="#fef3c7" stroke="#fcd34d" rx="6"/>
  <text x="350" y="260" text-anchor="middle" font-weight="500" fill="#92400e">Local Storage</text>

  <!-- Gemini API -->
  <g transform="translate(580, 155)">
    <rect x="0" y="10" width="180" height="80" fill="#fee2e2" stroke="#fca5a5" rx="6"/>
    <text x="90" y="45" text-anchor="middle" font-weight="500" fill="#991b1b">Google Gemini API</text>
    <text x="90" y="65" text-anchor="middle" font-size="12" fill="#b91c1c">(for Self-Testing)</text>
  </g>

  <!-- Arrows -->
  <path d="M 145 205 H 195" class="arrow"/>
  <text x="170" y="195" class="arrow-label">Interacts</text>

  <path d="M 350 225 V 230" class="arrow"/>
  <text x="375" y="228" class="arrow-label">Writes</text>
  
  <path d="M 320 230 V 225" class="arrow"/>
  <text x="295" y="228" class="arrow-label">Reads</text>

  <path d="M 475 185 H 575" class="arrow arrow-dashed"/>
  <text x="525" y="175" class="arrow-label">API Call</text>
  
  <path d="M 575 205 H 475" class="arrow arrow-dashed"/>
  <text x="525" y="220" class="arrow-label">Test Results</text>
</svg>
</details>

#### 3.2. Technology Stack
The application is built on a modern, client-side technology stack.

<details>
<summary>View Technology Stack Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <style>
      .bg { fill: #f9fafb; }
      .title { font-size: 20px; font-weight: 600; fill: #111827; text-anchor: middle; }
      .category-title { font-size: 16px; font-weight: 600; fill: #1f2937; text-anchor: middle; }
      .card { fill: #ffffff; stroke: #e5e7eb; rx: 8; }
      .item-text { font-weight: 500; fill: #1e40af; }
      .item-desc { fill: #6b7280; }
    </style>
  </defs>

  <rect width="100%" height="100%" class="bg"/>
  <text x="400" y="50" class="title">Technology Stack</text>

  <!-- Frontend Category -->
  <g transform="translate(50, 90)">
    <text x="125" y="20" class="category-title">Frontend</text>
    <rect x="0" y="30" width="250" height="250" fill="#f0f9ff" stroke="#e0f2fe" rx="10"/>
    <g class="card" transform="translate(20, 50)">
      <rect width="210" height="60"/>
      <text x="20" y="30" class="item-text">React & TypeScript</text>
      <text x="20" y="50" class="item-desc">Core UI library and language</text>
    </g>
    <g class="card" transform="translate(20, 130)">
      <rect width="210" height="60"/>
      <text x="20" y="30" class="item-text">Tailwind CSS</text>
      <text x="20" y="50" class="item-desc">Utility-first styling framework</text>
    </g>
  </g>

  <!-- Data & AI Category -->
  <g transform="translate(325, 90)">
    <text x="175" y="20" class="category-title">Data Persistence & AI</text>
    <rect x="0" y="30" width="350" height="250" fill="#fefce8" stroke="#fef9c3" rx="10"/>
    <g class="card" transform="translate(20, 50)">
      <rect width="310" height="60"/>
      <text x="20" y="30" class="item-text">Browser Local Storage</text>
      <text x="20" y="50" class="item-desc">Client-side storage for progress and settings</text>
    </g>
    <g class="card" transform="translate(20, 130)">
      <rect width="310" height="60"/>
      <text x="20" y="30" class="item-text">Google Gemini API</text>
      <text x="20" y="50" class="item-desc">Engine for AI-driven test generation</text>
    </g>
     <g class="card" transform="translate(20, 210)">
       <rect width="310" height="0"/>
    </g>
  </g>
</svg>
</details>

#### 3.3. Data Storage Architecture
Data is stored in the browser's `localStorage` using specific keys for different parts of the application state. All values are stored as JSON strings.

<details>
<summary>View Data Storage Architecture Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500" viewBox="0 0 700 500" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <style>
      .bg { fill: #f9fafb; }
      .title { font-size: 18px; font-weight: 600; fill: #111827; text-anchor: middle; }
      .header { font-weight: 600; fill: #1f2937; }
      .cell { fill: #ffffff; stroke: #e5e7eb; }
      .key-cell { fill: #f3f4f6; }
      .text { fill: #374151; }
      .code { font-family: 'Courier New', Courier, monospace; fill: #1e40af; font-size: 13px; }
      .desc { fill: #6b7280; font-size: 12px; }
    </style>
  </defs>

  <rect width="100%" height="100%" class="bg" />

  <text x="350" y="40" class="title">"Database" Architecture (Browser Local Storage)</text>

  <g transform="translate(30, 80)">
    <!-- Table Header -->
    <rect x="0" y="0" width="640" height="40" fill="#e5e7eb" stroke="#d1d5db" />
    <text x="120" y="25" class="header" text-anchor="middle">Local Storage Key</text>
    <text x="440" y="25" class="header" text-anchor="middle">Value (Stored as JSON String)</text>

    <!-- Row 1: compliance-progress -->
    <rect x="0" y="40" width="640" height="100" class="cell" />
    <rect x="0" y="40" width="240" height="100" class="key-cell" />
    <text x="20" y="85" class="code">compliance-progress</text>
    <line x1="0" y1="140" x2="640" y2="140" stroke="#e5e7eb" />
    <text x="260" y="65" class="text">Object mapping phase IDs to their status.</text>
    <text x="260" y="90" class="code" xml:space="preserve">
      {
        [phaseId: string]: 'complete' | 'in-progress' | 'blocked'
      }
    </text>
    <text x="260" y="125" class="desc">Example: { "std-1": "complete", "std-2": "in-progress" }</text>

    <!-- Row 2: compliance-theme -->
    <rect x="0" y="140" width="640" height="80" class="cell" />
    <rect x="0" y="140" width="240" height="80" class="key-cell" />
    <text x="20" y="180" class="code">compliance-theme</text>
    <line x1="0" y1="220" x2="640" y2="220" stroke="#e5e7eb" />
    <text x="260" y="165" class="text">Stores the user's selected UI theme.</text>
    <text x="260" y="190" class="code">'light' | 'dark' | 'high-contrast'</text>
    <text x="260" y="210" class="desc">Example: "dark"</text>

    <!-- Row 3: admin-password-hash -->
    <rect x="0" y="220" width="640" height="80" class="cell" />
    <rect x="0" y="220" width="240" height="80" class="key-cell" />
    <text x="20" y="260" class="code">admin-password-hash</text>
    <line x1="0" y1="300" x2="640" y2="300" stroke="#e5e7eb" />
    <text x="260" y="245" class="text">SHA-256 hash of the admin password.</text>
    <text x="260" y="270" class="code">string | null</text>
    <text x="260" y="290" class="desc">Example: "a591a6d40bf420404a011733cfb7b190..."</text>

    <!-- Row 4: admin-audit-log -->
    <rect x="0" y="300" width="640" height="100" class="cell" />
    <rect x="0" y="300" width="240" height="100" class="key-cell" />
    <text x="20" y="350" class="code">admin-audit-log</text>
    <line x1="0" y1="400" x2="640" y2="400" stroke="#e5e7eb" />
    <text x="260" y="325" class="text">An array of audit log entries.</text>
    <text x="260" y="350" class="code" xml:space="preserve">
      Array&lt;{
        timestamp: string,
        action: string
      }&gt;
    </text>
    <text x="260" y="385" class="desc">Example: [{ timestamp: "...", action: "Admin logged in." }]</text>
  </g>
</svg>
</details>

### 4. System Features

#### 4.1. Framework Selection
-   **Description:** The user can select from a list of available frameworks.
-   **Requirements:**
    -   The UI must display buttons for all available frameworks.
    -   The currently selected framework shall be visually highlighted.
    -   Upon selection, the main view must update to display the phases for that framework.

#### 4.2. Progress Tracking
-   **Description:** The user can track the status of each phase within a framework.
-   **Requirements:**
    -   Each phase must have controls to set its status to 'In Progress', 'Complete', or 'Blocked'.
    -   A 'Clear' button shall be available to remove any set status.
    -   An overall progress bar must reflect the percentage of phases marked as 'Complete'.

#### 4.3. Directive Management
-   **Description:** The user can view and copy detailed instructions for each phase.
-   **Requirements:**
    -   Each phase card shall have a control to expand or collapse a detailed view.
    -   The detailed view must display the full `directive` text.
    -   A "Copy Directive" button shall copy the entire directive text to the user's clipboard.

#### 4.4. State Persistence
-   **Description:** The application saves the user's progress and settings automatically.
-   **Requirements:**
    -   All phase statuses and the selected theme must be saved to `localStorage`.
    -   When the application is loaded, it must restore the state from `localStorage`.

#### 4.5. Secure Admin Panel
-   **Description:** A password-protected section for administrative tasks.
-   **Requirements:**
    -   Access is granted via a lock icon in the header.
    -   First-time access requires creating a password (min. 8 characters).
    -   Subsequent access requires password authentication.
    -   The password shall be stored as a SHA-256 hash, not plaintext.
    -   Authenticated users can change the password and view/clear an audit log.
    -   The audit log shall record all significant events (login, failed login, password change, log clearing).

The sequence diagram below details the admin login process:

<details>
<summary>View Admin Login Sequence Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="550" viewBox="0 0 800 550" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <marker id="seq-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#1d4ed8"/>
    </marker>
    <style>
      .lifeline { stroke: #9ca3af; stroke-width: 2; }
      .lifeline-box { fill: #e0f2fe; stroke: #7dd3fc; stroke-width: 1.5; rx: 5; }
      .lifeline-text { fill: #0c4a6e; font-weight: 600; text-anchor: middle; }
      .message { stroke: #1d4ed8; stroke-width: 2; marker-end: url(#seq-arrow); }
      .message-text { fill: #1e3a8a; font-size: 13px; }
      .reply-message { stroke: #6b7280; stroke-width: 2; stroke-dasharray: 5 3; marker-end: url(#seq-arrow); }
      .activation-box { fill: #bfdbfe; stroke: #93c5fd; stroke-width: 1; }
    </style>
  </defs>

  <!-- Lifelines -->
  <g id="user-lifeline">
    <rect x="50" y="40" width="100" height="40" class="lifeline-box"/>
    <text x="100" y="65" class="lifeline-text">:User</text>
    <line x1="100" y1="80" x2="100" y2="500" class="lifeline"/>
  </g>
  <g id="panel-lifeline">
    <rect x="250" y="40" width="140" height="40" class="lifeline-box"/>
    <text x="320" y="65" class="lifeline-text">:AdminPanel</text>
    <line x1="320" y1="80" x2="320" y2="500" class="lifeline"/>
  </g>
  <g id="hash-lifeline">
    <rect x="470" y="40" width="120" height="40" class="lifeline-box"/>
    <text x="530" y="65" class="lifeline-text">:useSimpleHash</text>
    <line x1="530" y1="80" x2="530" y2="500" class="lifeline"/>
  </g>
  <g id="storage-lifeline">
    <rect x="630" y="40" width="140" height="40" class="lifeline-box"/>
    <text x="700" y="65" class="lifeline-text">:LocalStorage</text>
    <line x1="700" y1="80" x2="700" y2="500" class="lifeline"/>
  </g>

  <!-- Activation Boxes -->
  <rect x="95" y="120" width="10" height="340" class="activation-box"/>
  <rect x="315" y="140" width="10" height="300" class="activation-box"/>
  <rect x="695" y="160" width="10" height="50" class="activation-box"/>
  <rect x="525" y="240" width="10" height="50" class="activation-box"/>
  <rect x="695" y="320" width="10" height="50" class="activation-box"/>

  <!-- Messages -->
  <text x="105" y="135" class="message-text">1. Enters password &amp; clicks Login</text>
  <line x1="105" y1="145" x2="315" y2="145" class="message"/>

  <text x="325" y="155" class="message-text">2. handleLogin(event)</text>
  <line x1="325" y1="165" x2="695" y2="165" class="message"/>
  <text x="450" y="180" class="message-text">3. getItem('admin-password-hash')</text>

  <line x1="695" y1="200" x2="325" y2="200" class="reply-message"/>
  <text x="480" y="215" class="message-text">4. returns storedHash</text>
  
  <text x="325" y="235" class="message-text">5. hash(passwordInput)</text>
  <line x1="325" y1="245" x2="525" y2="245" class="message"/>
  
  <line x1="525" y1="280" x2="325" y2="280" class="reply-message"/>
  <text x="400" y="295" class="message-text">6. returns inputHash</text>

  <text x="325" y="315" class="message-text">7. if (inputHash === storedHash)</text>
  
  <line x1="325" y1="325" x2="695" y2="325" class="message"/>
  <text x="480" y="340" class="message-text">8. setItem('admin-audit-log', ...)</text>

  <text x="325" y="375" class="message-text">9. setIsAuthenticated(true)</text>
  
  <line x1="315" y1="430" x2="105" y2="430" class="reply-message"/>
  <text x="160" y="425" class="message-text">10. Displays authenticated view</text>
</svg>
</details>

#### 4.6. UI Theming
-   **Description:** Users can change the application's visual theme.
-   **Requirements:**
    -   A theme switcher shall be available in the header.
    -   Three themes must be supported: 'Light', 'Dark', and 'High-Contrast'.
    -   The selected theme must be persisted in `localStorage` and applied on subsequent visits.
    -   The high-contrast theme must meet basic accessibility standards for visibility.

#### 4.7. AI-Driven Self-Testing
-   **Description:** An on-demand testing suite powered by the Gemini AI.
-   **Requirements:**
    -   A "Playwright Self-Test" tab shall be available in the main UI.
    -   A "Generate & Run Tests" button initiates the process.
    -   The application must send a prompt to the Gemini API instructing it to generate and simulate a Playwright test suite.
    -   The application must be able to receive and parse a stream of JSON objects representing test results.
    -   Results (name, status, error) must be displayed in real-time.
    -   Each test result must include an option to view an AI-generated screenshot of the UI state.

The data flow for this feature is illustrated below:

<details>
<summary>View Self-Test Data Flow Diagram</summary>
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="450" viewBox="0 0 900 450" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="14">
  <defs>
    <marker id="dfd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#c026d3"/>
    </marker>
    <style>
      .entity { fill: #ffffff; stroke: #9ca3af; stroke-width: 2; text-anchor: middle; }
      .process { fill: #f3e8ff; stroke: #c084fc; stroke-width: 2; rx: 12; text-anchor: middle; }
      .api-entity { fill: #fef2f2; stroke: #fca5a5; stroke-width: 2; text-anchor: middle; }
      .label { font-weight: 600; fill: #1f2937; }
      .arrow { stroke: #9333ea; stroke-width: 2.5; fill: none; marker-end: url(#dfd-arrow); }
      .arrow-label { font-size: 13px; font-weight: 500; fill: #7e22ce; text-anchor: middle; }
    </style>
  </defs>

  <!-- Entities and Processes -->
  <g id="user-entity">
    <rect x="50" y="185" width="120" height="60" class="entity"/>
    <text x="110" y="220" class="label">User</text>
  </g>
  <g id="process-app">
    <rect x="300" y="185" width="200" height="60" class="process"/>
    <text x="400" y="212" class="label">Compliance Dashboard</text>
    <text x="400" y="232" font-size="12">(React Application)</text>
  </g>
  <g id="api-entity">
    <rect x="650" y="185" width="180" height="60" class="api-entity"/>
    <text x="740" y="220" class="label">Gemini API</text>
  </g>

  <!-- Arrows -->
  <path d="M 175 215 H 295" class="arrow"/>
  <text x="235" y="205" class="arrow-label">1. Initiates Test Run</text>
  
  <path d="M 505 215 H 645" class="arrow"/>
  <text x="575" y="205" class="arrow-label">2. Test Generation Prompt</text>
  
  <g transform="translate(575, 270)">
    <path d="M 0 0 H -100" class="arrow" transform="rotate(180)" />
    <text x="-50" y="15" class="arrow-label">3. Streaming Test Results (JSON)</text>
  </g>
  
  <g transform="translate(235, 160)">
     <path d="M 0 0 H -100" class="arrow" transform="rotate(180)" />
     <text x="-50" y="-10" class="arrow-label">4. Renders Real-time UI Updates</text>
  </g>
</svg>
</details>

### 5. External Interface Requirements

#### 5.1. User Interfaces
The application presents a clean, responsive, and intuitive tabbed graphical user interface.
-   **Header:** Title, theme switcher, and admin panel access.
-   **Tabs:** To switch between the "Dashboard" and "Playwright Self-Test" views.
-   **Dashboard View:** Framework selector, progress section, and a list of phase cards.
-   **Self-Test View:** A button to initiate tests and a display area for real-time results.
-   **Admin Panel:** A modal dialog for authentication and administrative functions.

#### 5.2. Software Interfaces
-   **Browser `localStorage` API:** Used for storing user progress, theme, and admin data.
-   **Browser `navigator.clipboard` API:** Used for the "Copy Directive" functionality.
-   **Google Gemini API:** Used as the engine for the self-testing feature. Requires a valid API key to be configured in the environment.

### 6. Non-Functional Requirements

#### 6.1. Performance
-   As a client-side application, all local UI interactions must be instantaneous with no perceptible delay.
-   The AI-driven test execution time is dependent on the Gemini API response time. The UI must remain responsive and show a loading state during this process.

#### 6.2. Usability & Accessibility
-   The interface must be self-explanatory.
-   The application must be responsive and function correctly on various screen sizes.
-   ARIA attributes and proper semantic HTML shall be used to ensure screen reader compatibility and keyboard navigability.
-   A high-contrast theme shall be available for users with visual impairments.

#### 6.3. Reliability
-   The application's state persistence should be robust.
-   The application must gracefully handle potential errors from the Gemini API, displaying a clear error message to the user.

#### 6.4. Security
-   The admin password must not be stored in plaintext. A SHA-256 hash must be used.
-   All administrative functions must be protected behind the password wall.
-   The application is client-side only and does not transmit user data to any backend, with the exception of the prompt sent to the Gemini API during self-testing.