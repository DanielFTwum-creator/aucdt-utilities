# Software Requirements Specification (SRS)
## AsanSka University College of Design and Technology (AUCDT) Web Application
**Version:** 2.0 (Final)
**Date:** October 26, 2025

---

### 1. Introduction
#### 1.1 Purpose
The purpose of this document is to define the final software requirements and architectural design for the AUCDT Reimagined Web Application. This modern SPA replaces the legacy website, offering improved performance, an AI-driven student assistant, and administrative oversight tools.

#### 1.2 Scope
The application is built using React 19 and TypeScript. It features:
*   **Public Interface:** Homepage, Programs, News, Admissions.
*   **AI Integration:** "Nkyinkyim" Chatbot powered by Google Gemini 2.5 Flash.
*   **Administrative Core:** Secure login, Audit Logging, and System Diagnostics.
*   **Testing:** Integrated Puppeteer-Lite self-testing suite.

---

### 2. System Architecture
The system follows a client-side Single Page Application (SPA) architecture. It minimizes server dependency by utilizing browser APIs (LocalStorage) for persistence and communicating directly with Google Cloud for AI services.

**Key Components:**
*   **React SPA:** Handles routing, rendering, and state management.
*   **Audit Logger:** Intercepts sensitive actions and persists them to LocalStorage.
*   **Gemini Service:** Manages streaming connections to the Google GenAI API.

*(See `svg/system_architecture.svg` for visual diagram)*

---

### 3. Functional Requirements

#### 3.1 User Interface
*   **REQ-UI-001:** Responsive design for Mobile, Tablet, and Desktop.
*   **REQ-UI-002:** Theme toggle supporting Light, Dark, and High-Contrast modes.
*   **REQ-UI-003:** Sticky navigation with "Apply Now" prominence.

#### 3.2 AI Assistant ("Nkyinkyim")
*   **REQ-AI-001:** Floating widget accessible globally.
*   **REQ-AI-002:** Streaming text responses via Gemini 2.5 Flash.
*   **REQ-AI-003:** Multimodal input support (Text + Images).
*   **REQ-AI-004:** Context-aware responses based on "Student Handbook" system instructions.

#### 3.3 Administration
*   **REQ-ADM-001:** Hidden route (`/#admin`) for access.
*   **REQ-ADM-002:** Password-based authentication with lockout policy (3 attempts / 30s).
*   **REQ-ADM-003:** Audit logs recording Login, Logout, and Security Events.

#### 3.4 Self-Testing
*   **REQ-TEST-001:** Built-in "Puppeteer-Lite" runner.
*   **REQ-TEST-002:** Automated scenarios for Homepage, Theme, Chat, and Security.
*   **REQ-TEST-003:** Visual pass/fail reporting in a terminal-like interface.

---

### 4. Technical Stack
*   **Frontend Framework:** React 19
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **AI SDK:** @google/genai
*   **Build Tool:** Vite

*(See `svg/tech_stack.svg` for visual breakdown)*

---

### 5. Data Flow & Persistence
Data flow is primarily unidirectional within the React component tree, with external loops for API calls.

*   **Chat:** User Input -> State -> API Request -> Stream Response -> State Update -> UI.
*   **Admin:** User Input -> Validation -> LocalStorage Write -> State Update -> UI.

*(See `svg/data_flow.svg` for DFD)*

---

### 6. Use Cases
1.  **Prospective Student:** Browses programs, asks AI about fees, clicks "Apply Now".
2.  **Administrator:** Logs in to check security logs, clears history.
3.  **Developer/QA:** Runs the "Test Suite" to verify deployment integrity.

*(See `svg/use_case.svg` and `svg/sequence.svg` for UML diagrams)*

---

**PROJECT STATUS: COMPLETE**
All phases of the project refresh have been executed, tested, and documented.
