# Software Requirements Specification (SRS)
## for the Compliance Workflow Dashboard

### Version 3.0 - Project Refresh Baseline

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
    4.3. [Directive & Content Management](#43-directive--content-management)
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
This document provides a detailed description of the requirements for the **Compliance Workflow Dashboard**. It aims to define the functional and non-functional requirements of the system, serving as a foundational agreement between stakeholders on what the product should do. This Version 3.0 serves as the baseline for the current "Project Refresh" initiative.

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
-   "Copy Phase Items" functionality to copy the list of phase items as a bulleted text list.
-   Automatic saving of progress to the browser's local storage.
-   User-selectable UI themes (Light, Dark, High-Contrast).
-   A password-protected Admin Panel for managing the application.
-   Comprehensive audit logging for all administrative actions.
-   An interactive, AI-driven "Puppeteer Self-Test" tab for on-demand testing.

#### 2.3. User Classes and Characteristics
-   **Developer/Project Manager (User):** The primary user, technically proficient, who requires a structured process for executing complex, multi-phase tasks using AI development tools.
-   **Administrator:** A user (typically a Developer or PM) who needs access to the secure admin functions, such as password management and audit log review.

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

#### 3.2. Technology Stack
The application is built on a modern, client-side technology stack.
-   **Frontend:** React, TypeScript, Tailwind CSS.
-   **Storage:** Browser Local Storage.
-   **AI Integration:** Google Gemini API.

#### 3.3. Data Storage Architecture
Data is stored in the browser's `localStorage` using specific keys for different parts of the application state (e.g., `compliance-progress`, `compliance-theme`, `admin-password-hash`). All values are stored as JSON strings.

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

#### 4.3. Directive & Content Management
-   **Description:** The user can view and copy detailed instructions and item lists for each phase.
-   **Requirements:**
    -   Each phase card shall have a control to expand or collapse a detailed view.
    -   The detailed view must display the full `directive` text.
    -   A "Copy Directive" button shall copy the entire directive text to the user's clipboard.
    -   A copy button shall be available next to the phase items list to copy them as a bulleted text list (e.g., "- Item 1\n- Item 2").

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
    -   A "Puppeteer Self-Test" tab shall be available in the main UI.
    -   A "Generate & Run Tests" button initiates the process.
    -   The application must send a prompt to the Gemini API instructing it to generate and simulate a Puppeteer test suite.
    -   The application must be able to receive and parse a stream of JSON objects representing test results.
    -   Results (name, status, error) must be displayed in real-time.
    -   Each test result must include an option to view an AI-generated screenshot of the UI state.

### 5. External Interface Requirements

#### 5.1. User Interfaces
The application presents a clean, responsive, and intuitive tabbed graphical user interface.
-   **Header:** Title, theme switcher, and admin panel access.
-   **Tabs:** To switch between the "Dashboard" and "Puppeteer Self-Test" views.
-   **Dashboard View:** Framework selector, progress section, and a list of phase cards.
-   **Self-Test View:** A button to initiate tests and a display area for real-time results.
-   **Admin Panel:** A modal dialog for authentication and administrative functions.

#### 5.2. Software Interfaces
-   **Browser `localStorage` API:** Used for storing user progress, theme, and admin data.
-   **Browser `navigator.clipboard` API:** Used for the "Copy Directive" and "Copy Phase Items" functionality.
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