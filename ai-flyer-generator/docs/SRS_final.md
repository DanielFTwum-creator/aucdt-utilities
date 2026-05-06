# Software Requirements Specification (SRS)
## for AI Flyer Generator (Final Version)

**Version 2.0**

**Prepared by:** AI Senior Frontend Engineer
**Date:** [Current Date]

---

### Table of Contents
1. [Introduction](#1-introduction)
   1.1 [Purpose](#11-purpose)
   1.2 [Scope](#12-scope)
   1.3 [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
2. [Overall Description](#2-overall-description)
   2.1 [Product Perspective](#21-product-perspective)
   2.2 [Product Functions](#22-product-functions)
   2.3 [User Characteristics](#23-user-characteristics)
   2.4 [Constraints](#24-constraints)
   2.5 [System Architecture](#25-system-architecture)
3. [System Features](#3-system-features)
   3.1 [Flyer Generation](#31-flyer-generation)
   3.2 [Theming and Accessibility](#32-theming-and-accessibility)
   3.3 [Administration](#33-administration)
   3.4 [Interactive Testing](#34-interactive-testing)
4. [External Interface Requirements](#4-external-interface-requirements)
   4.1 [User Interfaces](#41-user-interfaces)
   4.2 [Software Interfaces](#42-software-interfaces)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
   5.1 [Performance Requirements](#51-performance-requirements)
   5.2 [Security Requirements](#52-security-requirements)
   5.3 [Usability and Accessibility Requirements](#53-usability-and-accessibility-requirements)

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to provide a detailed description of the requirements for the AI Flyer Generator application, Version 2.0. This version includes significant enhancements such as an admin panel, accessibility features, and a testing suite. This document is intended for project stakeholders, developers, and testers.

#### 1.2 Scope
The AI Flyer Generator is a feature-rich web application that enables users to generate a professional business flyer from a predefined data structure. This version introduces a multi-tab interface for accessing the core generator, a password-protected admin section for monitoring, and an interactive testing panel. The application supports multiple visual themes (Light, Dark, High-Contrast) and adheres to accessibility best practices.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **AI:** Artificial Intelligence
- **API:** Application Programming Interface
- **Gemini:** A family of multimodal AI models developed by Google.
- **UI:** User Interface
- **SRS:** Software Requirements Specification
- **WCAG:** Web Content Accessibility Guidelines

---

### 2. Overall Description

#### 2.1 Product Perspective
The AI Flyer Generator is a standalone, client-side web application. It operates entirely within the user's web browser and communicates directly with the external Google Gemini API. It does not have its own backend or database. State, such as authentication and audit logs, is managed in-memory for the duration of a user session.

#### 2.2 Product Functions
The functions of the application include:
- All functions from Version 1.0 (Flyer generation, loading/error states).
- A tabbed navigation system to switch between "Generator", "Admin", and "Testing" views.
- A theme switcher allowing users to select Light, Dark, or High-Contrast mode.
- A password-protected "Admin" section.
- An audit log to track key events within the application session.
- An "Testing" section with tools for self-testing and screenshot capture.

#### 2.3 User Characteristics
- **General Users:** Same as Version 1.0.
- **Administrators:** Users with the admin password who need to monitor application events via the audit log.
- **Developers/Testers:** Users who will utilize the "Testing" tab to perform diagnostics and capture results.

#### 2.4 Constraints
- The application must run in all modern web browsers.
- A valid Google Gemini API key must be provided as an environment variable (`API_KEY`).
- Session-based data (login status, audit log) is ephemeral and does not persist across page reloads.

#### 2.5 System Architecture
The application follows a simple client-server architecture where the client is the user's browser and the server is the Google Gemini API. There is no intermediary application server.

- **System Architecture Diagram:** See `docs/system_architecture.svg`
- **Database Architecture Diagram:** See `docs/database_architecture.svg`

---

### 3. System Features

#### 3.1 Flyer Generation
- **3.1.1 Description and Priority:** Core functionality, same as v1.0. Priority: High.
- **3.1.2 Functional Requirements:**
    - All requirements from v1.0, Section 3.1.2, are retained.
    - All flyer generation activities (start, success, failure) shall be logged in the audit log.

#### 3.2 Theming and Accessibility
- **3.2.1 Description and Priority:** Allows users to change the visual theme and ensures the application is accessible. Priority: High.
- **3.2.2 Functional Requirements:**
    - The UI shall include a theme switcher with options for "Light", "Dark", and "High-Contrast".
    - Selecting a theme shall immediately apply the new color scheme across the entire application.
    - The chosen theme shall be persisted in the browser's `localStorage` and automatically applied on subsequent visits.
    - All interactive elements shall have appropriate ARIA roles, states, and properties.
    - All interactive elements must be keyboard-navigable and have visible focus indicators.

#### 3.3 Administration
- **3.3.1 Description and Priority:** Provides a secure area for monitoring application events. Priority: Medium.
- **3.3.2 Functional Requirements:**
    - Access to the Admin tab shall be protected by a hardcoded password (`password123`).
    - The system shall display a login form when an unauthenticated user visits the Admin tab.
    - Upon successful login, the system shall display the Admin Panel.
    - The Admin Panel shall display an audit log of all logged actions.
    - The Admin Panel shall provide a "Logout" button to terminate the admin session.
    - Login attempts (successful and failed) and logout actions shall be recorded in the audit log.

#### 3.4 Interactive Testing
- **3.4.1 Description and Priority:** Provides tools for developers and testers to validate application health. Priority: Medium.
- **3.4.2 Functional Requirements:**
    - The "Testing" tab shall be accessible to all users.
    - The system shall provide a "Run Self-Test" button that checks for the presence of the `API_KEY`.
    - The system shall display the pass/fail status of the self-test.
    - The system shall provide a "Capture Flyer Screenshot" button.
    - When clicked, the screenshot button shall use the `html2canvas` library to capture the currently displayed flyer and trigger a browser download of the resulting PNG image.
    - If no flyer is visible, the system shall alert the user.

---

### 4. External Interface Requirements

#### 4.1 User Interfaces
- A main header shall contain the tab navigation ("Generator", "Admin", "Testing") and the Theme Switcher.
- The content area below the header will render the component corresponding to the active tab.

#### 4.2 Software Interfaces
- **Google Gemini API:** No changes from Version 1.0.
- **html2canvas Library:** The application will interface with the `html2canvas` library (loaded via CDN) to capture DOM elements as images.

---

### 5. Other Nonfunctional Requirements

#### 5.1 Performance Requirements
- Theme changes must apply instantaneously with no perceivable delay.
- The UI must remain responsive during all operations.

#### 5.2 Security Requirements
- The Google Gemini API key must not be exposed in the client-side source code.
- The admin password must not be stored in plain text in a way that is easily accessible to end-users. (Note: For this project, it is hardcoded, but this is a stated constraint for a real-world application).

#### 5.3 Usability and Accessibility Requirements
- The application should strive for WCAG 2.1 AA compliance.
- The color palettes for all themes must meet minimum contrast ratios for text and UI elements.
- The tabbed interface must be intuitive and clearly indicate the active section.