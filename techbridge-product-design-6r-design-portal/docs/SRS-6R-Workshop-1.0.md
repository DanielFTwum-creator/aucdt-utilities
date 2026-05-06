# IEEE Software Requirements Specification (SRS)
## Project: 6R Design Workshop Portal
### Version: 2.0.0 (Gold Master)
### Date: August 2024

---

## 1. Introduction
The 6R Design Workshop Portal is a world-class PWA designed to facilitate the "6R" Design Methodology at TechBridge University College. This version marks the final implementation of all scholastic and administrative modules.

---

## 2. System Architecture
### 2.1 Decoupled UI Engine
*   **React 19 Hooks-Based State**: Handles multi-view transitions between Auth, Dashboard, Lesson, Quiz, and Admin portals.
*   **Gemini Multimodal Services**: Integrated via `@google/genai` for both text-based coaching (`gemini-3-flash-preview`) and conceptual image generation (`gemini-2.5-flash-image`).

### 2.2 Data Integrity
*   **Pioneer Registry**: Persistent LocalStorage schema for student enrollment and session history.
*   **Institutional Audit**: Automated logging of all high-value system operations.

---

## 3. Core Capabilities
### 3.1 6R Learning Path (Complete)
*   **Structured Modules**: 6 Phases (Review to Render) with progress persistence.
*   **Interactive Assessments**: Integrated quiz engine with real-time mastery validation.
*   **AI Visual Aids**: Real-time generation of design diagrams to assist multimodal learning.

### 3.2 Faculty Control (Complete)
*   **Centralized Hub**: Admin access to audit logs, cohort statistics, and system health.
*   **Scholastic Testbed**: Integrated Playwright-style automated QA dashboard.

### 3.3 PWA Standards (Exceeded)
*   **Offline Performance**: Full Service Worker caching for lessons and assets.
*   **Push Notifications**: Broadcast capability from Faculty Hub to the cohort.
*   **Accessibility**: Full WCAG 2.1 compliance with High-Contrast specialized skin.

---

## 4. Final Verification
System verified via 4-stage internal Testbed and external Playwright regression suite. Readiness for institutional deployment is confirmed.