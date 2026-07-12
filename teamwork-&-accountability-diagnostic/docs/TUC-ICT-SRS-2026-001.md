# SOFTWARE REQUIREMENTS SPECIFICATION (IEEE Std 830-1998 / 29148-2018)
## PROJECT: TypeMaster Pro (An Adaptive Typing Tutor System)
### DOCUMENT REFERENCE: TUC-ICT-SRS-2026-001
### DATE: June 15, 2026 | Prepared by: Techbridge University College (TUC) Software Lab

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for **TypeMaster Pro**, a feature-complete adaptive typing tutor application targeting parity with commercial benchmarks set by Mavis Beacon Teaches Typing. It provides specifications for software developers, UI/UX designers, QA engineers, and institutional managers.

### 1.2 Scope
TypeMaster Pro is an advanced adaptive keyboarding platform. It covers:
* Full touch-typing instruction from the home row to layout mastery (QWERTY, Dvorak, Colemak, AZERTY).
* Real-time metrics (WPM, Accuracy, CPM) with keystroke-level feedback.
* Dynamic difficulty modulation via an intelligent Adaptive Engine.
* Gamified progression, achievements, global/cohort leaderboards, and an interactive multiplayer arena.
* Complete screen-reader compatibility, high-contrast, TTS, and motion reduction.
* SCORM 2004 4th Edition and LTI 1.3 LMS packages for institutional deployment (Moodle, Canvas).

### 1.3 Definitions, Acronyms, and Abbreviations
* **WPM**: Words Per Minute (1 word = 5 keystrokes).
* **CPM**: Characters Per Minute.
* **Accuracy (%)**: (Correct keystrokes / Total keystrokes) * 100.
* **Adaptive Engine**: Algorithmic module calibrating subsequent lesson difficulties.
* **Ghost Hand**: On-screen transparent overlay demonstrating real-time fingers placement.
* **LMS**: Learning Management System.

### 1.4 References
1. IEEE Std 830-1998 – Recommended Practice for Software Requirements Specifications.
2. IEEE Std 29148-2018 – Systems and Software Engineering – Requirements Engineering.
3. WCAG 2.1 Level AA Contrast Standards.

### 1.5 Overview
The rest of this document covers detailed product descriptors (Section 2), functional requirements grids (Section 3), non-functional performance benchmarks (Section 4), system safety/security policies (Sections 9-10), and the requirements traceability matrix (Section 13).

---

## 2. Overall Description

### 2.1 Product Perspective
TypeMaster Pro functions as a standalone client-server web app, a Progressive Web App (PWA) with extensive offline caching, and a native Electron desktop shell. It links with institutional LMS systems via standardized LTI 1.3/SCORM.

### 2.2 Product Functions
1. **Curriculum Delivery**: 200+ lessons spanning 10 progressive tiers.
2. **Analysis Engine**: Calculates bigram error metrics, heatmaps, and WPM trends.
3. **Adaptive Engine**: Personalizes exercise text complexity and timer pressure.
4. **Gamification**: XP points, achievements, and multi-user racing over WebSockets.
5. **Administrative Console**: Facilitates class cohorts, reports, and data exports.

### 2.3 User Classes
* **Novice / Intermediate / Advanced Typists**: Different instructional paces.
* **LMS Instructors**: Administer cohorts and audit progress.
* **Accessibility Users**: Rely on keyboard-only controls, high contrast, and TTS.

---

## 3. Specific Requirements

### 3.1 Curriculum & Lesson Delivery
* **FR-CL-001 (Critical)**: Provide 200 structured modules across 10 skill tiers.
* **FR-CL-002 (Critical)**: Each lesson consists of a warm-up, core typing, and analytics review.
* **FR-CL-003 (High)**: Restrict advanced levels until basic Home Row modules are cleared.
* **FR-CL-004 (High)**: Support custom text practice (50 - 10,000 characters).

### 3.2 Real-Time Keystroke Feedback
* **FR-KF-001 (Critical)**: Update UI states within 16ms of standard keystrokes.
* **FR-KF-002 (Critical)**: Display running speed & accuracy indicators updated every 2 seconds.
* **FR-KF-003 (High)**: Virtual keyboard with persistent key-error heatmaps.

### 3.3 Adaptive Engine (Dynamic Personalization)
* **FR-AE-001 (Critical)**: Compute difficulty weights based on WPM (40%), Accuracy (40%), and bigram repeat error rate (20%).
* **FR-AE-002 (Critical)**: Enforce remedial reviews if accuracy falls below 90% twice sequentially.

---

## 4. Performance Requirements
* **NFR-PR-001 (Critical)**: UI feedback latency <= 16ms under standard browser threads.
* **NFR-PR-002 (Critical)**: Application Time to Interactive (TTI) <= 3 seconds on a 25 Mbps connection.
* **NFR-PR-004 (High)**: Backend Adaptive scoring API responds <= 200ms under 500 concurrent sessions.

---

## 5. Design Constraints
* **Standards**: WCAG 2.1 AA compliant, LTI 1.3 & SCORM 2004 compliance.
* **WASM/W3C Audio**: Sound triggers must conform to Web Audio standard APIs.
* **Technology**: Built using React, TypeScript, Tailwind CSS, Framer Motion, and Electron.

---

## 6. Software System Attributes

### 6.1 Reliability & Availability
* **Uptime**: 99.5% service availability excluding scheduled monthly maintenance.
* **Caching**: Core lesson components cached in offline IndexedDB for local PWA use.

### 6.2 Security
* **Passwords**: Safe authentication using bcrypt-hashed passwords (cost >= 12).
* **CSP**: Content Security Policy Level 3 headers enforced globally.
* **Encryption**: TLS 1.3 for active transport, AES-256 for quiet database storage.

---

## 7. Other Requirements
* **Localization**: Fully externalized JSON localization packages, supporting RTL layout systems.
* **Ergonomics**: Compulsory screen rest notification every 45 minutes of active training.

---

## 13. Requirements Traceability Matrix

| Product Goal | SRS Req ID | Verification Method | Status |
| :--- | :--- | :--- | :--- |
|Touch-Typing Curriculum|FR-CL-001 to FR-CL-005|Curriculum layout audit & pathway locks test|Verified ✅|
|Real-Time Feedback|FR-KF-001 to FR-KF-004|Visual latency analysis & performance profiling|Verified ✅|
|Adaptive Learning Engine|FR-AE-001, FR-AE-002|Dynamic scoring function verification tests|Verified ✅|
|Gamified Motivation|FR-GM-001 to FR-GM-006|WebSocket racing stability tests|Verified ✅|
|Security Compliance|NFR-SEC-001 to 004|OWASP security and penetration audits|Verified ✅|

---

## 14. Appendices

### Appendix A: Learner Readiness Score Formula
$$\text{LRS} = 0.40 \times \text{WPM\_norm} + 0.40 \times \left(\frac{\text{Accuracy}}{100}\right) + 0.20 \times (1 - \text{Error\_recurrence\_rate})$$

### Appendix B: Keyboard Layout Support Matrix
* **QWERTY (US/UK)**: Full Support (Lessons, Symbols, Ghost Hands)
* **AZERTY (FR/BE)**: Full Support (Latin Lessons, Symbols, Partial Ghost Hands)
* **Dvorak / Colemak**: Full Support (Specialist lessons, Ghost Hands)
