
# Software Requirements Specification (SRS)
## Techbridge University College (TUC) Digital Platform
**Version:** 2.1 (Current Build)
**Date:** March 04, 2025

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to define the implemented software requirements and architectural design for the Techbridge University College (TUC) web platform. This document serves as the source of truth for the current production build, replacing all previous AUCDT specifications.

#### 1.2 Scope
The application is a high-fidelity Single Page Application (SPA) built with React 18.3 and TypeScript. It serves as the primary digital interface for the university, facilitating:
*   **Public Information:** Program discovery, admissions, and institutional news.
*   **Student Support:** AI-driven assistance via "BridgeBot".
*   **Administration:** Secure auditing and system diagnostics.

#### 1.3 Definitions & Acronyms
*   **TUC:** Techbridge University College (formerly AUCDT).
*   **BridgeBot:** The institutional AI assistant powered by Google Gemini.
*   **SPA:** Single Page Application (Hash-based routing).
*   **Playwright-Lite:** A browser-side implementation of end-to-end testing logic.

---

### 2. Overall Description

#### 2.1 Product Perspective
The platform is a client-side application designed for static hosting environments. It minimizes server-side dependencies by utilizing browser APIs (LocalStorage) for persistence and communicating directly with cloud APIs (Google Cloud) for intelligence features.

#### 2.2 User Classes
*   **Prospective Students:** Accessing admission portals, program details, and scholarships.
*   **Current Students:** Viewing academic calendars, timetables, and faculty directories.
*   **Administrators:** Managing security logs and verifying system integrity via the Admin Portal.
*   **General Public:** Consuming news and institutional history.

#### 2.3 Operating Environment
*   **Client:** Modern Browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge).
*   **Hosting:** Static Web Server / CDN.
*   **API Dependencies:** Google Gemini API (v1beta/v1).

---

### 3. Specific Requirements

#### 3.1 User Interface & Experience
*   **REQ-UI-001 (Branding):** The interface must prominently feature the TUC identity, utilizing the Maroon (#630f12) and Gold (#ffcb05) color palette.
*   **REQ-UI-002 (Responsiveness):** The layout must adapt fluidly between Mobile (320px), Tablet (768px), and Desktop (1280px+) viewports.
*   **REQ-UI-003 (Theming):** The system must support user-selectable themes: Light, Dark, and High-Contrast (for accessibility).
*   **REQ-UI-004 (Navigation):** Global navigation must be sticky and include a mobile drawer for smaller screens.

#### 3.2 AI Assistant ("BridgeBot")
*   **REQ-AI-001 (Model):** The agent shall utilize **Google Gemini 3 Pro Preview** for reasoning and generation.
*   **REQ-AI-002 (Context):** The agent must be grounded in the "Student Handbook" system instruction set.
*   **REQ-AI-003 (Multimodality):** The chat interface must support text inputs and image uploads for analysis.
*   **REQ-AI-004 (Streaming):** Responses must be streamed in real-time to reduce perceived latency.

#### 3.3 Administrative Security
*   **REQ-SEC-001 (Authentication):** A hidden route (`#/admin`) shall provide access to administrative tools via password authentication.
*   **REQ-SEC-002 (Brute Force Protection):** The system shall lock access for 30 seconds after 3 consecutive failed login attempts.
*   **REQ-SEC-003 (Persistence):** Lockout timers must persist in LocalStorage to prevent bypass via page refresh.
*   **REQ-SEC-004 (Audit Logging):** Critical actions (Login Success/Failure, Logout, Clear Logs) must be recorded and viewable in the Admin Dashboard.

#### 3.4 Academic Modules
*   **REQ-ACAD-001 (Faculty Directory):** Users must be able to search faculty by name or department.
*   **REQ-ACAD-002 (Profiles):** Detailed faculty profiles must be presented in a modal view to maintain navigation context.
*   **REQ-ACAD-003 (Timetables):** Static academic schedules must be accessible for main departments.

#### 3.5 System Diagnostics
*   **REQ-TEST-001 (Self-Test):** The application shall include a "Playwright-Lite" suite accessible via the footer.
*   **REQ-TEST-002 (Coverage):** The suite must verify:
    1.  Homepage Branding (TUC Identity).
    2.  Broken Link Detection.
    3.  Faculty Directory Data Hydration.
    4.  AI Agent Initialization.
    5.  Theme Engine Functionality.
*   **REQ-TEST-003 (Reporting):** The system must generate visual logs and simulated "snapshots" of test states.

---

### 4. Technical Stack

#### 4.1 Core Technologies
*   **Frontend:** React 18.3.1
*   **Language:** TypeScript 5.x
*   **Build System:** Vite
*   **Routing:** React Router DOM (HashRouter)

#### 4.2 Libraries
*   **Styling:** Tailwind CSS, Lucide React
*   **AI:** `@google/genai` SDK
*   **Analytics:** Google Analytics 4 (`gtag.js`)

#### 4.3 Data Persistence
*   **LocalStorage:** Used for Theme preferences, Admin Audit Logs, and Admin Lockout timers.

---

### 5. Implementation Status
*   **Phase 1 (Core UI):** ✅ Complete
*   **Phase 2 (Admin/Security):** ✅ Complete
*   **Phase 3 (Self-Testing):** ✅ Complete
*   **Phase 4 (AI Integration):** ✅ Complete (Gemini 3 Pro)
*   **Phase 5 (Content Population):** ✅ Complete (News, Faculty Data)

**System Status:** Stable / Production Ready
