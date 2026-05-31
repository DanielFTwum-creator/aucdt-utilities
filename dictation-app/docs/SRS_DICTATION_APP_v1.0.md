# Software Requirements Specification
## Dictation App v1.0

**Document ID:** TUC-ICT-SRS-2026-001  
**Status:** Final  
**Date:** May 31, 2026  
**Version:** 1.0  
**Author:** Daniel Frempong Twum, Head of ICT  
**Organization:** Techbridge University College (TUC)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the Dictation App - an AI-powered voice transcription and note-polishing application developed for Techbridge University College.

### 1.2 Scope
The Dictation App provides students and staff with real-time voice transcription capabilities, AI-powered note polishing, and multi-format export functionality. The application supports authentication, theme management, responsive design, and comprehensive accessibility features.

### 1.3 Document Organization
- Section 2: Overall Description
- Section 3: Functional Requirements
- Section 4: Non-Functional Requirements
- Section 5: Design Constraints
- Section 6: Testing & Verification

---

## 2. Overall Description

### 2.1 Product Perspective
The Dictation App is a standalone web application built on React/TypeScript with a Node.js/Spring Boot backend. It integrates with:
- Google OAuth 2.0 for authentication
- Google Gemini 2.5 Flash API for AI note polishing
- IndexedDB for local data persistence
- Vite for build optimization

### 2.2 Product Features
1. **Voice Transcription** — Real-time audio capture and transcription
2. **AI Note Polishing** — Automatic note refinement using Gemini API
3. **Dual-View Interface** — Toggle between polished notes and raw transcript
4. **Theme Management** — Light/dark mode with persistence
5. **Responsive Design** — Mobile, tablet, desktop optimization
6. **Accessibility** — WCAG 2.1 AA compliance
7. **Data Management** — Local storage with IndexedDB
8. **Multi-Export** — Export notes in multiple formats

### 2.3 User Classes
- **Primary Users:** Students taking notes during lectures
- **Secondary Users:** Educators using for lesson preparation
- **Administrators:** TUC IT staff managing deployments

### 2.4 Operating Environment
- **Frontend:** React 18+, TypeScript, Tailwind CSS, Vite
- **Backend:** Spring Boot 3.x (Java) / Node.js runtime
- **Database:** IndexedDB (client-side), optional backend persistence
- **Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Platforms:** Desktop, Tablet, Mobile (iOS/Android via web)

---

## 3. Functional Requirements

### 3.1 Authentication & Authorization

**Requirement 3.1.1 - User Authentication**
- Application shall support Google OAuth 2.0 authentication
- Users shall be able to log in with Google credentials
- Users shall be able to register with email/password (optional)
- Session shall persist across browser sessions using secure tokens

**Requirement 3.1.2 - Access Control**
- Unauthenticated users shall only see login form
- Authenticated users shall access full application
- Users shall be able to logout and clear session
- Application shall handle token expiration gracefully

### 3.2 Voice Recording & Transcription

**Requirement 3.2.1 - Audio Input**
- Application shall access user's microphone (with permission)
- User shall be able to start/stop recording
- Application shall display real-time recording status
- Application shall show recording duration

**Requirement 3.2.2 - Transcription**
- Application shall send audio to transcription service
- Application shall display raw transcription in real-time
- Application shall support audio file upload as alternative
- Application shall handle transcription errors gracefully

### 3.3 Note Management

**Requirement 3.3.1 - Note Creation**
- Application shall create new note with timestamp
- Application shall automatically set default title ("Untitled Note")
- Application shall allow user to edit title
- Application shall store raw transcription text

**Requirement 3.3.2 - AI Polishing**
- Application shall send transcription to Gemini API
- Application shall display polished version alongside raw text
- Application shall allow switching between polished/raw view
- Application shall preserve original text for comparison

**Requirement 3.3.3 - Note Storage**
- Application shall store notes in IndexedDB
- Application shall support unlimited note creation
- Application shall persist notes across sessions
- Application shall support note deletion

### 3.4 User Interface

**Requirement 3.4.1 - Layout**
- Application shall display header with title and controls
- Application shall display main content area with note
- Application shall display tab interface for polished/raw view
- Application shall display theme toggle in header

**Requirement 3.4.2 - Tab Interface**
- Application shall display "Polished Note" tab (default active)
- Application shall display "Raw Transcript" tab
- User shall click to switch between tabs
- User shall use arrow keys to navigate tabs

**Requirement 3.4.3 - Header Controls**
- Header shall display application title "Dictation App"
- Header shall display theme toggle button (moon/sun icon)
- Header shall display record button with microphone icon
- Header shall display new note button
- Header shall display logout button
- Header shall be sticky (remain at top when scrolling)

**Requirement 3.4.4 - Empty State**
- When no note content, display "Capture your thoughts"
- Display microphone icon in empty state
- Display helper text "Press the microphone button to start recording"
- Empty state shall be centered and visually prominent

### 3.5 Theme Management

**Requirement 3.5.1 - Light/Dark Mode**
- Application shall default to light mode
- User shall toggle between light and dark modes
- Theme preference shall persist in localStorage
- Application shall apply theme to all components

**Requirement 3.5.2 - Design Tokens**
- Application shall use CSS custom properties for colors
- Light mode colors: light backgrounds, dark text
- Dark mode colors: dark backgrounds, light text
- Color contrast shall meet WCAG 2.1 AA standards

### 3.6 Responsive Design

**Requirement 3.6.1 - Mobile (375px - 640px)**
- Application shall stack components vertically
- Buttons shall have minimum 44px touch target
- Text shall be readable without horizontal scroll
- Microphone icon shall be prominent and easy to tap

**Requirement 3.6.2 - Tablet (641px - 1024px)**
- Application shall use optimized layout for medium screens
- Tab interface shall display both tabs side-by-side
- Content area shall have max-width constraint
- Controls shall be properly spaced

**Requirement 3.6.3 - Desktop (1025px+)**
- Application shall use full-width efficient layout
- Max-width container shall be 1280px
- Sidebar or expanded header shall be available
- All controls shall be easily accessible

### 3.7 Keyboard Navigation

**Requirement 3.7.1 - Tab Navigation**
- User shall navigate to all interactive elements using Tab key
- User shall navigate backward using Shift+Tab
- Focus order shall be logical (left-to-right, top-to-bottom)
- User shall see visible focus indicator on focused element

**Requirement 3.7.2 - Component Navigation**
- User shall navigate tabs using arrow keys
- User shall activate buttons using Enter or Space keys
- User shall use Tab to move to next field in forms
- Keyboard shortcuts shall be documented

### 3.8 Accessibility

**Requirement 3.8.1 - Semantic HTML**
- Application shall use semantic HTML tags (<header>, <main>, <button>, <input>)
- Application shall properly structure headings (h1, h2, h3)
- Application shall use proper form labels with <label> tags
- Application shall use ARIA attributes where semantic HTML is insufficient

**Requirement 3.8.2 - Screen Reader Support**
- Icon buttons shall have aria-label attributes
- Tabs shall have proper ARIA roles (tablist, tab, tabpanel)
- Form inputs shall have associated labels
- Tab selection status shall be announced (aria-selected)

**Requirement 3.8.3 - Color Contrast**
- Text contrast ratio shall be at least 4.5:1 for normal text
- Large text (18pt+) contrast ratio shall be at least 3:1
- Both light and dark modes shall meet these standards
- Color shall not be the only means of conveying information

---

## 4. Non-Functional Requirements

### 4.1 Performance

**Requirement 4.1.1 - Load Time**
- Application shall load in under 3 seconds on 4G connection
- Initial render shall complete within 2 seconds
- Theme toggle shall respond within 100ms
- Tab switching shall animate smoothly (60fps)

**Requirement 4.1.2 - Audio Processing**
- Audio shall be captured at 16kHz or higher
- Transcription latency shall be under 2 seconds for typical audio
- AI polishing shall complete within 10 seconds per note

### 4.2 Reliability

**Requirement 4.2.1 - Data Persistence**
- Notes shall persist across browser refresh
- Theme preference shall persist across sessions
- Application shall recover from network failures gracefully
- Lost data due to network failure shall be recoverable

**Requirement 4.2.2 - Error Handling**
- Application shall handle API timeouts (>10s)
- Application shall display user-friendly error messages
- Application shall log errors for debugging
- Application shall never crash or display JavaScript errors to user

### 4.3 Security

**Requirement 4.3.1 - Authentication**
- Application shall use OAuth 2.0 for secure authentication
- Tokens shall be stored securely (httpOnly cookies preferred)
- Application shall validate tokens on each request
- Application shall force re-authentication on token expiration

**Requirement 4.3.2 - Data Protection**
- Sensitive data shall not be stored in localStorage
- HTTPS shall be required for all API communications
- User data shall be transmitted only to authorized services
- Application shall not log sensitive information

### 4.4 Usability

**Requirement 4.4.1 - Learnability**
- Application shall be self-explanatory with minimal training
- UI controls shall follow platform conventions
- Tooltips shall be available for complex features
- Help documentation shall be accessible in-app

**Requirement 4.4.2 - User Preferences**
- User shall be able to customize theme (light/dark)
- User shall be able to adjust text size (via browser zoom)
- User shall be able to customize keyboard shortcuts (future)
- Settings shall be remembered across sessions

### 4.5 Maintainability

**Requirement 4.5.1 - Code Quality**
- Code shall follow project coding standards (TypeScript, ESLint)
- Code coverage shall be maintained above 80%
- Components shall be modular and reusable
- Documentation shall be kept current with code

**Requirement 4.5.2 - Testing**
- Automated tests shall cover core functionality (77 E2E tests)
- Tests shall include accessibility validation
- Tests shall cover responsive design across breakpoints
- Tests shall be runnable in CI/CD pipeline

---

## 5. Design Constraints

### 5.1 Technology Stack

**Frontend:**
- React 18.2+
- TypeScript 5.0+
- Tailwind CSS 3.x
- Vite 5.0+
- Cypress 15.x (testing)

**Backend:**
- Spring Boot 3.x / Node.js 18+
- Google Gemini 2.5 Flash API
- IndexedDB (client-side)

**Infrastructure:**
- Ubuntu 22.04 LTS
- Docker containerization
- Nginx reverse proxy
- GitHub for version control

### 5.2 Browser Support
- Chrome 90+ (primary)
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 14+, Chrome Mobile 90+)

### 5.3 Accessibility Standards
- WCAG 2.1 Level AA compliance required
- Section 508 compliance for US deployment
- Mobile accessibility standards

### 5.4 Performance Standards
- Lighthouse Performance score: 90+
- Lighthouse Accessibility score: 95+
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s

---

## 6. Testing & Verification

### 6.1 Test Coverage

**E2E Tests (77 total)**
- Theme Management: 5 tests
- Tabs Component: 7 tests
- Header Component: 8 tests
- UI Components: 15 tests
- Accessibility: 22 tests
- Responsive Design: 19 tests

**Coverage Areas:**
- User interactions (click, type, keyboard navigation)
- Component rendering and state management
- Accessibility compliance (WCAG 2.1 AA)
- Responsive design across 3 breakpoints
- Theme application and persistence
- Error handling and edge cases

### 6.2 Verification Criteria

**Must Pass:**
- [ ] All E2E tests pass (≥80% pass rate)
- [ ] No accessibility violations (axe-core)
- [ ] Lighthouse scores ≥90 (performance) & ≥95 (accessibility)
- [ ] Manual testing on primary browsers
- [ ] Manual testing on mobile devices

**Should Have:**
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance profiling results
- [ ] Security audit results
- [ ] User acceptance testing

### 6.3 Deployment Verification

**Pre-Production:**
- [ ] Code review complete
- [ ] Security review complete
- [ ] Performance testing complete
- [ ] Documentation complete

**Production:**
- [ ] Staging deployment successful
- [ ] Smoke testing passed
- [ ] Monitoring and alerting configured
- [ ] Rollback plan documented

---

## 7. Release Notes

### Version 1.0 (Current - May 31, 2026)

**Features Implemented:**
✅ Voice transcription with real-time processing
✅ AI-powered note polishing using Gemini 2.5 Flash
✅ Dual-view interface (polished/raw transcript)
✅ Google OAuth 2.0 authentication
✅ Light/dark theme management with persistence
✅ Responsive design (mobile, tablet, desktop)
✅ WCAG 2.1 AA accessibility compliance
✅ Keyboard navigation support
✅ IndexedDB data persistence
✅ Comprehensive E2E test suite (77 tests)

**Design System:**
✅ 9 production-ready components
✅ Design tokens with CSS variables
✅ Theme context provider
✅ Responsive grid system
✅ Focus management utilities

**Documentation:**
✅ IEEE SRS document
✅ Architecture diagrams
✅ Admin guide
✅ Deployment guide
✅ Testing guide
✅ API reference
✅ Design system documentation

---

## 8. Appendices

### A. Glossary
- **E2E:** End-to-End testing
- **OAuth:** Open Authorization protocol
- **WCAG:** Web Content Accessibility Guidelines
- **IndexedDB:** Browser-based database API
- **Gemini:** Google's AI model
- **SRS:** Software Requirements Specification

### B. References
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- OAuth 2.0 Specification: https://tools.ietf.org/html/rfc6749
- IEEE 29148 SRS Standard: https://standards.ieee.org/standard/29148-2018.html

### C. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | May 31, 2026 | Daniel Frempong Twum | Initial release |

---

## Sign-Off

**Project Status:** ✅ Complete & Ready for Production

This SRS document specifies all functional and non-functional requirements for the Dictation App v1.0. The application has completed Phases 1-5 (Design, Building, Refactoring, Testing) and is ready for Phase 6 (Documentation & Finalization).

**Next Steps:**
1. Deploy to staging environment
2. Conduct final user acceptance testing
3. Deploy to production
4. Monitor and support end-users

---

**Document Generated:** May 31, 2026  
**Status:** FINAL  
**Classification:** Project Documentation

