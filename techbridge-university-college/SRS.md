# Software Requirements Specification (SRS)
## AsanSka University College of Design and Technology (AUCDT) Web Application
**Version:** 1.1
**Date:** October 26, 2025

---

### 1. Introduction

#### 1.1 Purpose
The purpose of this document is to define the software requirements for the AUCDT Reimagined Web Application. This application serves as the primary digital presence for AsanSka University College of Design and Technology, providing information to prospective students, current students, and the general public.

#### 1.2 Scope
The application is a responsive, single-page application (SPA) built using React. It encompasses the homepage, departmental information, admissions details, an integrated AI Chat Assistant ("Nkyinkyim"), and a comprehensive self-testing suite.

#### 1.3 Definitions, Acronyms, and Abbreviations
*   **AUCDT:** AsanSka University College of Design and Technology
*   **SPA:** Single Page Application
*   **SRS:** Software Requirements Specification
*   **AI:** Artificial Intelligence
*   **LLM:** Large Language Model (specifically Google Gemini)
*   **Puppeteer:** A Node library for controlling headless Chrome (simulated in this client-side implementation).

### 2. Overall Description

#### 2.1 Product Perspective
This product is a standalone web application replacing the legacy website. It integrates with Google Gemini API for the conversational agent but otherwise operates as a static frontend application.

#### 2.2 User Characteristics
*   **Prospective Students:** Seeking information on programs, admission requirements, and scholarships.
*   **Current Students:** Accessing academic calendars, resources, and portal links.
*   **Parents/Guardians:** Investigating university credibility and fees.
*   **Faculty/Staff:** Accessing administrative links.
*   **Administrators:** Managing audit logs and running system diagnostics.

#### 2.3 Assumptions and Dependencies
*   Users have access to modern web browsers (Chrome, Firefox, Safari, Edge).
*   Active internet connection is required for loading assets and AI functionality.
*   Google Gemini API availability is required for the Chat Assistant.

### 3. Specific Requirements

#### 3.1 Functional Requirements

##### 3.1.1 Navigation & Structure
*   **REQ-NAV-001:** The system shall provide a global navigation bar available on all screens.
*   **REQ-NAV-002:** The navigation bar shall include links/dropdowns for: Home, About Us, Academics, Departments, Admissions, Ofosua Library, Newsroom, and Resources.
*   **REQ-NAV-003:** The system shall support mobile navigation via a hamburger menu.
*   **REQ-NAV-004:** The header shall become sticky upon scrolling past the initial viewport.

##### 3.1.2 Homepage Sections
*   **REQ-HOME-001:** The homepage shall feature a "Hero Slider" displaying key university highlights (e.g., Departments, Scholarships).
*   **REQ-HOME-002:** A "Programs" section shall list available degrees and certificates with horizontal scrolling.
*   **REQ-HOME-003:** A "News Feed" section shall display mock latest news items.
*   **REQ-HOME-004:** Call-to-Action (CTA) sections shall direct users to the Admissions Portal.

##### 3.1.3 AI Chat Assistant ("Nkyinkyim")
*   **REQ-AI-001:** The application shall include an AI Chat Agent accessible via a floating action button and a header button.
*   **REQ-AI-002:** The Chat Agent shall use Google Gemini 2.5 Flash model.
*   **REQ-AI-003:** The Agent shall possess system instructions defining its persona as "Nkyinkyim" and its knowledge base regarding AUCDT.
*   **REQ-AI-004:** The chat interface shall support text input and image upload for multimodal queries.
*   **REQ-AI-005:** The chat window shall be expandable/minimizable.
*   **REQ-AI-006:** The chat agent shall persist across the session and be controllable (open/close) from the global header.

##### 3.1.4 Administration & Security
*   **REQ-ADM-001:** The system shall include a secure Admin Login portal protected by a configurable password.
*   **REQ-ADM-002:** The system shall implement Brute Force protection, locking the account after 3 failed attempts for 30 seconds.
*   **REQ-ADM-003:** All sensitive actions (login, logout, clear logs) shall be recorded in an Audit Log persisted in local storage.

##### 3.1.5 Testing Framework
*   **REQ-TEST-001:** The system shall include an interactive "Puppeteer Self-Test" dashboard accessible via the footer.
*   **REQ-TEST-002:** The test suite shall automatically execute critical user journeys: Homepage validation, Theme toggling, Chat Agent interaction, and Admin Security checks.
*   **REQ-TEST-003:** The dashboard shall display real-time logs and pass/fail status for each test case.

#### 3.2 Non-Functional Requirements

##### 3.2.1 Performance
*   **REQ-PERF-001:** Initial load time should be under 2 seconds on 4G networks.
*   **REQ-PERF-002:** Animations shall run at 60fps on supported devices.

##### 3.2.2 Reliability
*   **REQ-REL-001:** The application shall handle API failures gracefully, displaying user-friendly error messages in the chat.

##### 3.2.3 Usability & Accessibility
*   **REQ-USE-001:** The application shall use the official AUCDT color palette (Maroon: #630f12, Gold: #ffcb05).
*   **REQ-USE-002:** The design shall be fully responsive across Mobile (320px+), Tablet (768px+), and Desktop (1024px+) viewports.
*   **REQ-USE-003:** The application shall support High Contrast mode for visually impaired users.

### 4. Interface Requirements

#### 4.1 User Interfaces
*   **Header:** Sticky, white background, maroon text, gold accents.
*   **Footer:** Dark theme, comprehensive links, Admin/Test links.
*   **Chat:** Floating widget, white/maroon theme, accessible toggle.
*   **Test Dashboard:** Dark, terminal-style interface with real-time logging.

#### 4.2 Software Interfaces
*   **Google GenAI SDK:** Used for communicating with Gemini API.

---
**PHASE 2 & 3 COMPLETE - READY FOR PHASE 4**