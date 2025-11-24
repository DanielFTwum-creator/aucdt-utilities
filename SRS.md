# Software Requirements Specification (SRS)
## ThesisAI Frontend Application

**Version:** 1.0.0
**Date:** November 24, 2025
**Prepared by:** AUCDT Development Team
**Organization:** African University College of Digital Technologies

---

## Table of Contents

1. [Introduction](#1-introduction)
   - 1.1 [Purpose](#11-purpose)
   - 1.2 [Document Conventions](#12-document-conventions)
   - 1.3 [Intended Audience and Reading Suggestions](#13-intended-audience-and-reading-suggestions)
   - 1.4 [Project Scope](#14-project-scope)
   - 1.5 [References](#15-references)
2. [Overall Description](#2-overall-description)
   - 2.1 [Product Perspective](#21-product-perspective)
   - 2.2 [Product Functions](#22-product-functions)
   - 2.3 [User Classes and Characteristics](#23-user-classes-and-characteristics)
   - 2.4 [Operating Environment](#24-operating-environment)
   - 2.5 [Design and Implementation Constraints](#25-design-and-implementation-constraints)
   - 2.6 [Assumptions and Dependencies](#26-assumptions-and-dependencies)
3. [System Features](#3-system-features)
   - 3.1 [Landing Page and Navigation](#31-landing-page-and-navigation)
   - 3.2 [Document Analysis Feature](#32-document-analysis-feature)
   - 3.3 [AI Evaluation Feature](#33-ai-evaluation-feature)
   - 3.4 [Detailed Feedback Feature](#34-detailed-feedback-feature)
4. [External Interface Requirements](#4-external-interface-requirements)
   - 4.1 [User Interfaces](#41-user-interfaces)
   - 4.2 [Hardware Interfaces](#42-hardware-interfaces)
   - 4.3 [Software Interfaces](#43-software-interfaces)
   - 4.4 [Communications Interfaces](#44-communications-interfaces)
5. [Non-Functional Requirements](#5-non-functional-requirements)
   - 5.1 [Performance Requirements](#51-performance-requirements)
   - 5.2 [Security Requirements](#52-security-requirements)
   - 5.3 [Software Quality Attributes](#53-software-quality-attributes)
6. [Other Requirements](#6-other-requirements)
   - 6.1 [Appendix A: Technology Stack](#61-appendix-a-technology-stack)
   - 6.2 [Appendix B: Configuration Requirements](#62-appendix-b-configuration-requirements)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the ThesisAI Frontend application. It describes the functional and non-functional requirements for the web-based user interface that enables academic institutions to assess thesis documents using AI-powered analysis tools.

The intended audience includes:
- Development team members
- Project stakeholders
- Quality assurance personnel
- System administrators
- Academic staff and evaluators

### 1.2 Document Conventions

This document follows IEEE Std 830-1998 conventions for Software Requirements Specifications. Requirements are prioritized using the following terminology:

- **SHALL/MUST**: Indicates a mandatory requirement
- **SHOULD**: Indicates a recommended requirement
- **MAY**: Indicates an optional requirement

Technical terms and acronyms:
- **SPA**: Single Page Application
- **UI**: User Interface
- **API**: Application Programming Interface
- **HTTP**: Hypertext Transfer Protocol
- **CSS**: Cascading Style Sheets
- **DOM**: Document Object Model

### 1.3 Intended Audience and Reading Suggestions

This document is organized to provide information relevant to different stakeholders:

- **Developers**: Focus on Sections 3 (System Features) and 4 (External Interface Requirements)
- **Project Managers**: Focus on Sections 1 (Introduction) and 2 (Overall Description)
- **QA Testers**: Focus on Sections 3 (System Features) and 5 (Non-Functional Requirements)
- **End Users**: Focus on Section 2 (Overall Description) and 3 (System Features)

### 1.4 Project Scope

ThesisAI Frontend is a modern web application designed to provide an intuitive interface for AI-powered thesis assessment. The system aims to:

**Primary Goals:**
- Streamline the academic evaluation process
- Provide intelligent document analysis capabilities
- Generate detailed feedback for thesis improvements
- Support academic institutions in maintaining assessment standards

**Benefits:**
- Reduced time for initial thesis review
- Consistent evaluation criteria application
- Comprehensive feedback generation
- Enhanced academic quality assurance

**Scope Boundaries:**
- This specification covers only the frontend web application
- Backend API integration points are defined but backend implementation is out of scope
- AI model training and development is out of scope

### 1.5 References

- React 19.2.0 Documentation: https://react.dev
- TypeScript 5.9.3 Documentation: https://www.typescriptlang.org
- Vite 7.2.4 Documentation: https://vitejs.dev
- Tailwind CSS 4.1.17 Documentation: https://tailwindcss.com
- IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications
- W3C Web Accessibility Guidelines (WCAG) 2.1

---

## 2. Overall Description

### 2.1 Product Perspective

ThesisAI Frontend is the user-facing component of a larger thesis assessment ecosystem. The system operates as:

- **Client-Server Architecture**: Web-based frontend communicating with a backend API service
- **Browser-Based Application**: Runs in modern web browsers without plugin requirements
- **Responsive Design**: Adapts to desktop, tablet, and mobile devices
- **Containerized Deployment**: Deployable via Docker containers with Nginx web server

**System Context:**
```
┌─────────────────┐
│   Web Browser   │
│   (User Agent)  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  ThesisAI       │
│  Frontend       │◄── This System
│  (React SPA)    │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│  Backend API    │
│  (Port 8080)    │ (Out of Scope)
└─────────────────┘
```

### 2.2 Product Functions

The ThesisAI Frontend provides the following major functions:

**F1. User Interface Navigation**
- Display application branding and navigation
- Provide access to feature information
- Enable user account management (Get Started)

**F2. Hero Section and Call-to-Action**
- Present value proposition
- Enable assessment workflow initiation
- Guide users through onboarding

**F3. Feature Showcase**
- Display Document Analysis capabilities
- Present AI Evaluation features
- Highlight Detailed Feedback functionality

**F4. Responsive Layout**
- Adapt layout for different screen sizes
- Maintain usability across devices
- Support accessibility standards

### 2.3 User Classes and Characteristics

**Primary User Classes:**

| User Class | Description | Technical Expertise | Frequency of Use |
|------------|-------------|---------------------|------------------|
| Faculty Evaluators | Academic staff assessing theses | Low to Medium | Daily to Weekly |
| Thesis Supervisors | Faculty guiding student research | Low to Medium | Weekly |
| Academic Administrators | Staff managing assessment processes | Medium | Daily |
| Students | Thesis authors seeking feedback | Low | Occasional |

**User Characteristics:**
- Age range: 22-65 years
- Education level: Bachelor's degree or higher
- Language: English proficiency required
- Accessibility: May require screen readers or keyboard navigation

### 2.4 Operating Environment

**Client Environment:**
- **Supported Browsers**:
  - Chrome 120+ (recommended)
  - Firefox 120+
  - Safari 17+
  - Edge 120+
- **Screen Resolutions**: 1024x768 minimum, optimized for 1920x1080
- **Network**: Broadband internet connection (minimum 5 Mbps)
- **JavaScript**: Must be enabled

**Server Environment:**
- **Web Server**: Nginx (Alpine Linux based)
- **Container Runtime**: Docker 20.10+
- **Network**: HTTP/HTTPS on port 80/443
- **Backend API**: Expected at port 8080

### 2.5 Design and Implementation Constraints

**Technical Constraints:**
- **C1**: Must use React 19.2.0 framework
- **C2**: Must use TypeScript for type safety
- **C3**: Must use pnpm 8.15.0 as package manager
- **C4**: Must follow Tailwind CSS utility-first approach
- **C5**: Must maintain < 3 second initial load time
- **C6**: Must support ES2020+ JavaScript features

**Business Constraints:**
- **C7**: Must comply with academic data privacy standards
- **C8**: Must be deployable in institution networks
- **C9**: Must support offline-first development workflow

**Regulatory Constraints:**
- **C10**: Must follow WCAG 2.1 Level AA accessibility standards
- **C11**: Must support GDPR compliance mechanisms

### 2.6 Assumptions and Dependencies

**Assumptions:**
- **A1**: Users have access to modern web browsers
- **A2**: Institution networks allow port 80/443 traffic
- **A3**: Users have basic computer literacy
- **A4**: Backend API will be available at configured endpoints
- **A5**: Google Fonts CDN is accessible

**Dependencies:**
- **D1**: Backend API service for data processing
- **D2**: Google Fonts for Crimson Text and Inter fonts
- **D3**: External npm registry for package management
- **D4**: Docker infrastructure for deployment
- **D5**: Network connectivity for API communication

---

## 3. System Features

### 3.1 Landing Page and Navigation

**Priority**: Critical
**Use Case ID**: UC-001

#### 3.1.1 Description and Purpose

Provides the primary entry point and navigation structure for the application. Users access all major features through this interface.

#### 3.1.2 Stimulus/Response Sequences

**Stimulus**: User navigates to application URL
**Response**: System displays landing page with header, hero section, features, and footer

**Stimulus**: User clicks navigation link (Features/About)
**Response**: System scrolls to corresponding section

**Stimulus**: User clicks "Get Started" or "Start Assessment"
**Response**: System initiates authentication or assessment workflow

#### 3.1.3 Functional Requirements

**FR-1.1**: The system SHALL display a header with application branding
**FR-1.2**: The system SHALL display a navigation bar with "Features" and "About" links
**FR-1.3**: The system SHALL provide a "Get Started" button in the header
**FR-1.4**: The system SHALL display the GraduationCap icon with "ThesisAI" branding
**FR-1.5**: The system SHALL apply academic-themed color scheme (navy, blue, amber, gold)
**FR-1.6**: The system SHALL maintain navigation visibility on all screen sizes
**FR-1.7**: The system SHALL use smooth scroll behavior for anchor navigation

### 3.2 Document Analysis Feature

**Priority**: High
**Use Case ID**: UC-002

#### 3.2.1 Description and Purpose

Presents the Document Analysis feature to users, highlighting the capability to upload and analyze thesis documents for structural and formatting issues.

#### 3.2.2 Stimulus/Response Sequences

**Stimulus**: User views landing page
**Response**: System displays Document Analysis feature card with icon and description

**Stimulus**: User hovers over feature card
**Response**: System applies visual feedback (elevation effect)

#### 3.2.3 Functional Requirements

**FR-2.1**: The system SHALL display a "Document Analysis" feature card
**FR-2.2**: The system SHALL show FileText icon for visual identification
**FR-2.3**: The system SHALL display description: "Upload thesis documents and receive comprehensive structural analysis and formatting checks."
**FR-2.4**: The system SHALL apply hover animation using Framer Motion
**FR-2.5**: The system SHALL maintain consistent card styling with other features

### 3.3 AI Evaluation Feature

**Priority**: High
**Use Case ID**: UC-003

#### 3.3.1 Description and Purpose

Presents the AI Evaluation feature, showcasing the system's capability to evaluate content quality, argumentation, and academic rigor using artificial intelligence.

#### 3.3.2 Stimulus/Response Sequences

**Stimulus**: User views landing page
**Response**: System displays AI Evaluation feature card with icon and description

**Stimulus**: User hovers over feature card
**Response**: System applies visual feedback (elevation effect)

#### 3.3.3 Functional Requirements

**FR-3.1**: The system SHALL display an "AI Evaluation" feature card
**FR-3.2**: The system SHALL show Brain icon for visual identification
**FR-3.3**: The system SHALL display description: "Leverage advanced AI to evaluate content quality, argumentation, and academic rigor."
**FR-3.4**: The system SHALL apply hover animation using Framer Motion
**FR-3.5**: The system SHALL maintain consistent card styling with other features

### 3.4 Detailed Feedback Feature

**Priority**: High
**Use Case ID**: UC-004

#### 3.4.1 Description and Purpose

Presents the Detailed Feedback feature, highlighting the system's ability to generate actionable feedback with specific improvement suggestions and grading criteria.

#### 3.4.2 Stimulus/Response Sequences

**Stimulus**: User views landing page
**Response**: System displays Detailed Feedback feature card with icon and description

**Stimulus**: User hovers over feature card
**Response**: System applies visual feedback (elevation effect)

#### 3.4.3 Functional Requirements

**FR-4.1**: The system SHALL display a "Detailed Feedback" feature card
**FR-4.2**: The system SHALL show CheckCircle icon for visual identification
**FR-4.3**: The system SHALL display description: "Get actionable feedback with specific suggestions for improvement and grading criteria."
**FR-4.4**: The system SHALL apply hover animation using Framer Motion
**FR-4.5**: The system SHALL maintain consistent card styling with other features

---

## 4. External Interface Requirements

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements

**UI-1**: The system SHALL use a responsive design that adapts to screen sizes from 320px to 4K resolution
**UI-2**: The system SHALL maintain a maximum content width of 1280px (7xl container)
**UI-3**: The system SHALL use serif fonts (Crimson Text, Georgia) for headings
**UI-4**: The system SHALL use sans-serif fonts (Inter, system-ui) for body text
**UI-5**: The system SHALL implement a gradient background from academic-navy to academic-blue

#### 4.1.2 Header Component

**UI-6**: Header height SHALL be approximately 64px
**UI-7**: Header background SHALL use white/10 opacity with backdrop blur
**UI-8**: Logo icon SHALL be 32x32 pixels in academic-gold color
**UI-9**: Navigation links SHALL display hover state with color transition
**UI-10**: "Get Started" button SHALL use academic-amber background

#### 4.1.3 Hero Section

**UI-11**: Main heading SHALL use 3rem (48px) font size
**UI-12**: Hero description SHALL have 1.25rem (20px) font size
**UI-13**: "Start Assessment" button SHALL be prominent with academic-gold background
**UI-14**: Hero section SHALL animate on page load (fade-in with slide-up)

#### 4.1.4 Feature Cards

**UI-15**: Each feature card SHALL have white/10 background with backdrop blur
**UI-16**: Cards SHALL display in 3-column grid on medium+ screens
**UI-17**: Cards SHALL display in single column on mobile devices
**UI-18**: Icons SHALL be 40x40 pixels in academic-gold color
**UI-19**: Cards SHALL lift on hover (translateY: -5px)

#### 4.1.5 Footer

**UI-20**: Footer SHALL have black/20 background with border
**UI-21**: Footer text SHALL use white/60 opacity
**UI-22**: Footer SHALL display copyright and institution name

### 4.2 Hardware Interfaces

**HW-1**: The system requires no direct hardware interfaces
**HW-2**: All hardware interaction is mediated through the web browser

### 4.3 Software Interfaces

#### 4.3.1 Browser APIs

**SW-1**: The system SHALL use standard DOM APIs for rendering
**SW-2**: The system SHALL use Fetch API or Axios for HTTP requests
**SW-3**: The system SHALL use History API for client-side routing (future)
**SW-4**: The system SHALL use Local Storage for client-side data persistence (future)

#### 4.3.2 Backend API Interface

**SW-5**: The system SHALL communicate with backend API at `/api` endpoint
**SW-6**: The system SHALL use HTTP/HTTPS protocol
**SW-7**: The system SHALL send JSON-formatted request bodies
**SW-8**: The system SHALL expect JSON-formatted responses
**SW-9**: The system SHALL handle HTTP status codes: 200, 400, 401, 403, 404, 500

**API Proxy Configuration:**
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

#### 4.3.3 Third-Party Services

**SW-10**: The system SHALL load fonts from Google Fonts CDN
**SW-11**: The system MAY integrate analytics services (future)
**SW-12**: The system MAY integrate error tracking services (future)

### 4.4 Communications Interfaces

**COM-1**: The system SHALL use HTTPS for production deployments
**COM-2**: The system SHALL use HTTP/1.1 or HTTP/2 protocols
**COM-3**: The system SHALL include appropriate CORS headers
**COM-4**: The system SHALL set Content-Type: application/json for API requests
**COM-5**: The system SHALL handle network timeout after 30 seconds

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

**PERF-1**: Initial page load SHALL complete within 3 seconds on broadband connection
**PERF-2**: Time to Interactive (TTI) SHALL be less than 5 seconds
**PERF-3**: Total bundle size SHALL not exceed 1MB (gzipped)
**PERF-4**: API response rendering SHALL complete within 500ms
**PERF-5**: Animation frame rate SHALL maintain 60 FPS
**PERF-6**: System SHALL support 1000+ concurrent users
**PERF-7**: Memory usage SHALL not exceed 100MB per browser tab

### 5.2 Security Requirements

**SEC-1**: The system SHALL not store sensitive data in browser localStorage
**SEC-2**: The system SHALL validate all user inputs before submission
**SEC-3**: The system SHALL sanitize HTML content to prevent XSS attacks
**SEC-4**: The system SHALL use HTTPS in production environment
**SEC-5**: The system SHALL implement Content Security Policy (CSP)
**SEC-6**: The system SHALL not expose API keys in client-side code
**SEC-7**: The system SHALL implement CSRF protection for state-changing operations

### 5.3 Software Quality Attributes

#### 5.3.1 Availability

**AVAIL-1**: The system SHALL maintain 99.9% uptime during business hours
**AVAIL-2**: Planned maintenance SHALL be scheduled during off-peak hours
**AVAIL-3**: System SHALL display user-friendly error messages during downtime

#### 5.3.2 Maintainability

**MAINT-1**: Code SHALL follow TypeScript strict mode guidelines
**MAINT-2**: Components SHALL be modular and reusable
**MAINT-3**: Code SHALL include type annotations for all functions
**MAINT-4**: Code SHALL pass TypeScript compiler with zero errors
**MAINT-5**: Code coverage SHALL exceed 80% for critical paths

#### 5.3.3 Portability

**PORT-1**: The system SHALL run on Windows, macOS, and Linux
**PORT-2**: The system SHALL be browser-agnostic (Chrome, Firefox, Safari, Edge)
**PORT-3**: Docker images SHALL be platform-independent (linux/amd64, linux/arm64)

#### 5.3.4 Reliability

**REL-1**: The system SHALL gracefully handle API failures
**REL-2**: The system SHALL implement retry logic for network requests
**REL-3**: The system SHALL log errors for debugging
**REL-4**: Mean Time Between Failures (MTBF) SHALL exceed 720 hours

#### 5.3.5 Usability

**USE-1**: New users SHALL complete first assessment within 10 minutes
**USE-2**: System SHALL provide clear visual feedback for user actions
**USE-3**: Error messages SHALL be clear and actionable
**USE-4**: System SHALL follow WCAG 2.1 Level AA guidelines
**USE-5**: Keyboard navigation SHALL be fully supported
**USE-6**: Screen reader compatibility SHALL be maintained

#### 5.3.6 Scalability

**SCALE-1**: System SHALL support horizontal scaling via multiple container instances
**SCALE-2**: Static assets SHALL be CDN-ready
**SCALE-3**: Code splitting SHALL be implemented for route-based loading

---

## 6. Other Requirements

### 6.1 Appendix A: Technology Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Core Framework** | React | 19.2.0 | UI component library |
| **Language** | TypeScript | 5.9.3 | Type-safe development |
| **Build Tool** | Vite | 7.2.4 | Fast development and building |
| **Package Manager** | pnpm | 8.15.0 | Efficient dependency management |
| **Styling** | Tailwind CSS | 4.1.17 | Utility-first CSS framework |
| **HTTP Client** | Axios | 1.13.2 | API communication |
| **Routing** | React Router DOM | 7.9.6 | Client-side routing |
| **Animation** | Framer Motion | 12.23.24 | Smooth animations |
| **Icons** | Lucide React | 0.554.0 | Icon components |
| **Charts** | Recharts | 3.5.0 | Data visualization |
| **Testing** | Vitest | 4.0.13 | Unit and integration testing |
| **Test Utils** | Testing Library | 16.3.0 | React component testing |
| **Coverage** | @vitest/coverage-v8 | 4.0.13 | Code coverage reporting |
| **Server** | Nginx | Alpine | Production web server |
| **Container** | Docker | 20.10+ | Application containerization |

### 6.2 Appendix B: Configuration Requirements

#### Build Configuration

```typescript
// vite.config.ts
{
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
}
```

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "bundler",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Tailwind Configuration

```javascript
{
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'academic-navy': '#1e3a5f',
        'academic-blue': '#2563eb',
        'academic-amber': '#f59e0b',
        'academic-gold': '#fbbf24',
        'academic-slate': '#475569'
      }
    }
  }
}
```

#### Docker Configuration

**Multi-stage Build:**
1. Stage 1: Node 18 Alpine with pnpm for building
2. Stage 2: Nginx Alpine for serving static files

**Nginx Configuration:**
- Single Page Application routing support
- Gzip compression enabled
- Cache headers for static assets

---

## Document Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Lead Developer | | | |
| QA Lead | | | |
| Stakeholder | | | |

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2025-11-24 | AUCDT Dev Team | Initial SRS document |

---

**End of Document**
