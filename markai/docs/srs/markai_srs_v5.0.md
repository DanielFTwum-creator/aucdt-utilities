# MarkAI Software Requirements Specification (SRS) - As-Built

**Document Version:** 3.1.0
**Date:** April 24, 2026
**Author:** AI Assistant

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to specify the complete functional and non-functional requirements for MarkAI, a cloud-based marketing platform designed specifically for non-marketers. The platform leverages Artificial Intelligence (AI) to simplify and automate key marketing tasks, including content generation, image editing, real-time voice conversations, and campaign scheduling.

### 1.2 Scope
MarkAI provides a suite of tools for AI-powered marketing. This document covers its core functionalities: unified user authentication (username or phone), AI-powered content generation with platform-specific previews, AI image editing, live AI chat, campaign scheduling, a secure administrative dashboard, a multi-theme user interface, and an integrated testing suite with an interactive E2E simulation and screenshot capture capabilities.

### 1.3 Target Audience
- **Primary Users:** Small business owners, solo-preneurs, and freelancers with minimal marketing training who require an intuitive, automated marketing solution.
- **Secondary Users:** Marketing professionals and QA testers seeking efficient, AI-powered content generation, validation, and testing tools.

## 2. Overall Description

### 2.1 Product Perspective
MarkAI is a standalone, client-side Single Page Application (SPA) designed to run in modern web browsers. It utilizes a serverless architecture, relying on the browser's local storage for data persistence and a lightweight Node.js back-end to securely proxy requests to the Google Gemini API suite.

### 2.2 User Characteristics
Users are typically time-constrained and require a highly intuitive interface that minimizes complexity and avoids marketing jargon. The application is designed to be accessible to users with varying technical and marketing expertise.

## 3. Functional Requirements

### 3.1 User Authentication (FR-100)
- **FR-101 Unified Login:** Users can log in using either their username or a registered phone number in a single input field, along with their password. **[IMPLEMENTED]**
- **FR-102 User Registration:** Users can create an account by providing a username and password. An optional phone number field is available during registration. **[IMPLEMENTED]**
- **FR-103 Geolocation Verification:** The system requests access to the user's geolocation during login and registration as a simulated security measure; login proceeds if permission is denied. **[IMPLEMENTED]**
- **FR-104 Google OAuth (Client-Side):** Users can authenticate via Google using the OAuth 2.0 implicit flow. The client opens a popup, receives the access token in the URL hash via a static callback page (`/auth/google/callback/index.html`), fetches user info from Google's userinfo endpoint, and logs in without any backend token exchange. Configured via `VITE_GOOGLE_CLIENT_ID` and `VITE_GOOGLE_REDIRECT_URI` environment variables. **[IMPLEMENTED]**

### 3.2 AI-Powered Content Generation (FR-200)
- **FR-201 Content Prompts:** Users can generate marketing content by providing simple text prompts and specifying a brand voice. **[IMPLEMENTED]**
- **FR-202 Multi-Platform Adaptation:** The AI automatically tailors generated content for various social media and email platforms. **[IMPLEMENTED]**
- **FR-204 A/B Test Variants:** For the 'Email' platform, the AI generates multiple subject line variants to facilitate A/B testing. **[IMPLEMENTED]**
- **FR-205 Platform-Specific Content Preview:** Users can open a modal to preview generated content, which displays a realistic mock-up of how the post will appear on the selected platform (e.g., Instagram, Facebook, Twitter/X). **[IMPLEMENTED]**

### 3.3 AI-Powered Image Tools (FR-800)
- **FR-801 Image Upload:** Users can upload images via a file selector or a drag-and-drop interface. **[IMPLEMENTED]**
- **FR-802 AI-Powered Editing:** Users can modify an uploaded image by providing a text prompt to the Gemini AI model. **[IMPLEMENTED]**
- **FR-803 Image Preview:** The UI displays a side-by-side comparison of the original and the AI-edited image. **[IMPLEMENTED]**
- **FR-804 Image Download:** Users can download the final, edited image. **[IMPLEMENTED]**
- **FR-805 Image Generation:** Users can generate new images from a text prompt directly within the content generation workflow. **[IMPLEMENTED]**

### 3.4 Live AI Conversation (FR-900)
- **FR-901 Real-Time Voice Interaction:** Users can engage in a real-time voice conversation with the AI using the Gemini Live API. **[IMPLEMENTED]**
- **FR-902 Audio Input/Output:** The system captures microphone input and plays back the AI's spoken responses. **[IMPLEMENTED]**
- **FR-903 Live Transcription:** The conversation between the user and the AI is transcribed and displayed on-screen in real-time. **[IMPLEMENTED]**

### 3.5 Campaign Scheduling and Management (FR-300)
- **FR-301 Unified Calendar:** A unified, interactive calendar allows users to schedule, view, and manage their content pipeline. **[IMPLEMENTED]**
- **FR-302 Post Management:** Users can click on scheduled posts to view their full details or to delete them. **[IMPLEMENTED]**

### 3.6 Administration (FR-600)
- **FR-601 Secure Access:** Access to the administrative dashboard is protected by a password at `/admin`. **[IMPLEMENTED]**
- **FR-602 Audit Logging:** Admin actions are logged with timestamps, accessible only via `/admin/logs`. **[IMPLEMENTED]**
- **FR-603 Feature Flagging:** Feature control from `/admin/dashboard`. **[IMPLEMENTED]**
- **FR-604 Diagnostic Diagnostics:** Diagnostic tools restricted to `/admin/testing`. **[IMPLEMENTED]**

### 3.7 Testing (FR-700)
- **FR-701 Self-Testing Capabilities:** A dedicated testing dashboard restricted to admin users is available at `/admin/testing`, providing in-app diagnostics, screenshot capture, and E2E simulation triggers. **[IMPLEMENTED]**
- **FR-702 Sanity Checks:** Runtime checks for API key configuration and local storage accessibility. **[IMPLEMENTED]**
- **FR-703 Screenshot Capture:** Tool to capture a screenshot for visual regression testing accessible via the dashboard. **[IMPLEMENTED]**
- **FR-704 E2E Workflow Simulation & Testing:** Automated interactive simulation of core user journey (Invalid Login Handling -> Invalid Registration (mismatched passwords) -> successful Registration -> explicit Logout/Login -> Content creation -> Scheduling -> Calendar verification). The project includes a dedicated `playwright` E2E test suite (`tests/playwright/main.test.js`) for CI/CD validation. **[IMPLEMENTED]**

## 4. Non-Functional Requirements

### 4.1 Usability & Accessibility (NFR-300)
- **NFR-302 Accessibility:** Conforms to standards (keyboard nav, screen reader, ARIA labelling). **[IMPLEMENTED]**
- **NFR-303 User Interface:** UI is minimalist and jargon-free. **[IMPLEMENTED]**
- **NFR-304 Theming:** Supports multi-theme (Light/Dark/High-Contrast) for accessibility. **[IMPLEMENTED]**

### 4.2 Security (NFR-200)
- **NFR-201 Authentication:** The admin section is protected by a password. User authentication is simulated for demo purposes. **[IMPLEMENTED]**

### 4.3 Reliability (NFR-400)
- **NFR-403 Data Persistence:** All critical application state (scheduled posts, audit logs, user preferences) is persisted in the browser's local storage to survive page reloads and session closures. **[IMPLEMENTED]**

### 4.4 Testability (NFR-600)
- **NFR-601 End-to-End Testing:** The project includes an end-to-end test suite using Playwright to automate and validate the core user workflow, ensuring application stability. **[IMPLEMENTED]**

## 5. System Architecture & Data Model

### 5.1 System Architecture
The application is a client-side Single Page Application (SPA) built with React. It interacts with a lightweight Node.js back-end which securely proxies requests to the Google Gemini API for all AI functionalities. State is managed within React and persisted to the browser's Local Storage, minimizing server-side load.

<svg width="700" height="500" viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bg-grad-data" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;" />
      <stop offset="100%" style="stop-color:#e2e8f0;" />
    </linearGradient>
    <linearGradient id="node-grad-data" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
    <linearGradient id="arrow-grad-data" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <marker id="arrowhead-data" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrow-grad-data)" />
    </marker>
    <filter id="node-shadow-data" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.1" />
    </filter>
  </defs>

  <rect width="700" height="500" fill="url(#bg-grad-data)" />

  <text x="350" y="50" font-size="28" font-weight="bold" text-anchor="middle" fill="#1e293b">MarkAI System Architecture</text>
  <line x1="200" y1="65" x2="500" y2="65" stroke="#cbd5e1" stroke-width="1" />

  <!-- Nodes -->
  <g id="node-user-data" transform="translate(40, 210)" filter="url(#node-shadow-data)">
    <rect width="120" height="80" rx="10" fill="url(#node-grad-data)" stroke="#cbd5e1" stroke-width="1"/>
    <text x="60" y="35" font-size="32" text-anchor="middle">👤</text>
    <text x="60" y="65" font-size="14" fill="#1e293b" text-anchor="middle" font-weight="bold">User</text>
  </g>
  
  <g id="node-react-data" transform="translate(240, 210)" filter="url(#node-shadow-data)">
    <rect width="220" height="80" rx="10" fill="url(#node-grad-data)" stroke="#cbd5e1" stroke-width="1"/>
    <text x="110" y="35" font-size="18" font-weight="bold" fill="#0369a1" text-anchor="middle">⚛️ React SPA (MarkAI)</text>
    <text x="110" y="60" font-size="12" fill="#475569" text-anchor="middle">Client-Side Application</text>
  </g>

  <g id="node-gemini-data" transform="translate(500, 120)" filter="url(#node-shadow-data)">
    <rect width="160" height="80" rx="10" fill="url(#node-grad-data)" stroke="#cbd5e1" stroke-width="1"/>
    <text x="80" y="35" font-size="18" font-weight="bold" fill="#059669" text-anchor="middle">🤖 Gemini API</text>
    <text x="80" y="60" font-size="12" fill="#475569" text-anchor="middle">External Google Service</text>
  </g>

  <g id="node-storage-data" transform="translate(500, 300)" filter="url(#node-shadow-data)">
    <rect width="160" height="80" rx="10" fill="url(#node-grad-data)" stroke="#cbd5e1" stroke-width="1"/>
    <text x="80" y="35" font-size="18" font-weight="bold" fill="#94a3b8" text-anchor="middle">💾 Local Storage</text>
    <text x="80" y="60" font-size="12" fill="#475569" text-anchor="middle">In-Browser Data</text>
  </g>

  <!-- Arrows -->
  <path d="M 165 250 H 235" stroke="url(#arrow-grad-data)" stroke-width="2.5" marker-end="url(#arrowhead-data)"/>
  <text x="200" y="240" fill="#475569" font-size="11" text-anchor="middle">User Input</text>

  <!-- SPA to API -->
  <path d="M 350 205 C 400 205, 450 180, 495 170" stroke="url(#arrow-grad-data)" stroke-width="2.5" fill="none" marker-end="url(#arrowhead-data)"/>
  <text x="425" y="195" fill="#475569" font-size="11" text-anchor="middle">API Request (Prompt)</text>
  
  <path d="M 495 150 C 450 140, 400 165, 350 165 L 350 205" stroke="url(#arrow-grad-data)" stroke-width="2.5" fill="none" marker-start="url(#arrowhead-data)"/>
  <text x="425" y="150" fill="#475569" font-size="11" text-anchor="middle">API Response (Content)</text>

  <!-- SPA to Storage -->
  <path d="M 350 295 C 400 295, 450 320, 495 330" stroke="url(#arrow-grad-data)" stroke-width="2.5" fill="none" marker-end="url(#arrowhead-data)"/>
  <text x="425" y="305" fill="#475569" font-size="11" text-anchor="middle">Persist Data (Save)</text>
  
  <path d="M 495 350 C 450 360, 400 335, 350 335 L 350 295" stroke="url(#arrow-grad-data)" stroke-width="2.5" fill="none" marker-start="url(#arrowhead-data)"/>
  <text x="425" y="350" fill="#475569" font-size="11" text-anchor="middle">Load Data</text>

  <text x="350" y="450" font-size="14" fill="#64748b" text-anchor="middle" font-style="italic">
    A client-centric architecture with a secure backend proxy.
  </text>
</svg>

### 5.2 Conceptual Data Model
Data entities, such as users, scheduled posts, and audit logs, are stored as serialized JSON in the browser's Local Storage, acting as a client-side database.

<svg width="700" height="500" viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
  <defs>
    <linearGradient id="bg-grad-db" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;" />
      <stop offset="100%" style="stop-color:#e2e8f0;" />
    </linearGradient>
    <linearGradient id="table-header-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f1f5f9;" />
      <stop offset="100%" style="stop-color:#e2e8f0;" />
    </linearGradient>
    <filter id="table-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="2" dy="4" stdDeviation="4" flood-color="#000" flood-opacity="0.1" />
    </filter>
  </defs>
  <rect width="700" height="500" fill="url(#bg-grad-db)" />
  <text x="350" y="50" font-size="28" font-weight="bold" text-anchor="middle" fill="#1e293b">MarkAI Data Model (Local Storage)</text>
  <line x1="150" y1="65" x2="550" y2="65" stroke="#cbd5e1" stroke-width="1" />
  <text x="350" y="90" font-size="14" text-anchor="middle" fill="#475569">Data is stored as JSON strings in the browser's key-value local storage.</text>

  <!-- User Table -->
  <g transform="translate(20, 120)" filter="url(#table-shadow)">
    <rect width="200" height="240" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
    <rect width="200" height="40" rx="8" ry="8" fill="url(#table-header-grad)"/>
    <text x="100" y="27" font-size="16" font-weight="bold" fill="#1e293b" text-anchor="middle">👤 User</text>
    <line x1="0" y1="40" x2="200" y2="40" stroke="#cbd5e1" />
    <g transform="translate(15, 55)" font-size="12" fill="#334155">
      <text y="15"><tspan font-weight="bold">id:</tspan> string (PK)</text>
      <text y="35"><tspan font-weight="bold">name:</tspan> string</text>
      <text y="55"><tspan font-weight="bold">email:</tspan> string</text>
      <text y="75"><tspan font-weight="bold">tier:</tspan> string</text>
      <text y="95"><tspan font-weight="bold">username:</tspan> string</text>
      <text y="115"><tspan font-weight="bold">password:</tspan> string (mock)</text>
      <text y="135"><tspan font-weight="bold">phone?:</tspan> string</text>
      <text y="155"><tspan font-weight="bold">location?:</tspan> Geolocation</text>
    </g>
    <text x="100" y="230" font-size="11" fill="#94a3b8" text-anchor="middle">Key: 'markai-users'</text>
  </g>

  <!-- ScheduledPost Table -->
  <g transform="translate(240, 120)" filter="url(#table-shadow)">
    <rect width="220" height="240" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
    <rect width="220" height="40" rx="8" ry="8" fill="url(#table-header-grad)"/>
    <text x="110" y="27" font-size="16" font-weight="bold" fill="#1e293b" text-anchor="middle">📅 ScheduledPost</text>
    <line x1="0" y1="40" x2="220" y2="40" stroke="#cbd5e1" />
    <g transform="translate(15, 55)" font-size="12" fill="#334155">
      <text y="15"><tspan font-weight="bold">id:</tspan> string (PK)</text>
      <text y="35"><tspan font-weight="bold">platform:</tspan> enum</text>
      <text y="55"><tspan font-weight="bold">content:</tspan> string</text>
      <text y="75"><tspan font-weight="bold">imagePrompt:</tspan> string</text>
      <text y="95"><tspan font-weight="bold">generatedImageUrl?:</tspan> string</text>
      <text y="115"><tspan font-weight="bold">scheduledAt:</tspan> ISO string</text>
      <text y="135"><tspan font-weight="bold">status:</tspan> enum</text>
      <text y="155"><tspan font-weight="bold">priority:</tspan> enum</text>
    </g>
    <text x="110" y="230" font-size="11" fill="#94a3b8" text-anchor="middle">Key: 'markai-scheduled-posts'</text>
  </g>

  <!-- AuditLogEntry Table -->
  <g transform="translate(480, 120)" filter="url(#table-shadow)">
    <rect width="200" height="150" rx="8" fill="#ffffff" stroke="#cbd5e1"/>
    <rect width="200" height="40" rx="8" ry="8" fill="url(#table-header-grad)"/>
    <text x="100" y="27" font-size="16" font-weight="bold" fill="#1e293b" text-anchor="middle">🛡️ AuditLogEntry</text>
    <line x1="0" y1="40" x2="200" y2="40" stroke="#cbd5e1" />
    <g transform="translate(15, 55)" font-size="12" fill="#334155">
      <text y="15"><tspan font-weight="bold">id:</tspan> string (PK)</text>
      <text y="35"><tspan font-weight="bold">timestamp:</tspan> ISO string</text>
      <text y="55"><tspan font-weight="bold">action:</tspan> string</text>
      <text y="75"><tspan font-weight="bold">details?:</tspan> string</text>
    </g>
     <text x="100" y="140" font-size="11" fill="#94a3b8" text-anchor="middle">Key: 'markai-audit-logs'</text>
  </g>

  <text x="350" y="450" font-size="14" fill="#64748b" text-anchor="middle" font-style="italic">
    A simple, robust data model for a client-side application.
  </text>
</svg>
