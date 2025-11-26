# Software Requirements Specification (SRS)
## ThesisAI - AI-Powered Thesis Assessment Platform

**Version:** 1.0
**Date:** November 26, 2025
**Prepared by:** AUCDT Development Team
**Organization:** African University College of Digital Technologies

---

## Document Control

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2025-11-26 | AUCDT Dev Team | Initial release - Foundation setup |

---

## Table of Contents

1. [Introduction](#1-introduction)
   1. [Purpose](#11-purpose)
   2. [Scope](#12-scope)
   3. [Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
   4. [References](#14-references)
   5. [Overview](#15-overview)
2. [Overall Description](#2-overall-description)
   1. [Product Perspective](#21-product-perspective)
   2. [Product Functions](#22-product-functions)
   3. [User Characteristics](#23-user-characteristics)
   4. [Constraints](#24-constraints)
   5. [Assumptions and Dependencies](#25-assumptions-and-dependencies)
3. [Specific Requirements](#3-specific-requirements)
   1. [Functional Requirements](#31-functional-requirements)
   2. [Non-Functional Requirements](#32-non-functional-requirements)
4. [System Architecture](#4-system-architecture)
5. [Technical Specifications](#5-technical-specifications)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a comprehensive description of the ThesisAI frontend application. It details the functional and non-functional requirements, system architecture, and technical specifications for the AI-powered thesis assessment platform designed for the African University College of Digital Technologies (AUCDT).

The intended audience includes:
- Development team members
- Project stakeholders
- Quality assurance team
- System administrators
- Academic administrators and faculty

### 1.2 Scope

**ThesisAI Frontend** is a modern web-based application that serves as the user interface for an AI-powered thesis assessment system. The system aims to:

**Goals:**
- Streamline the academic thesis evaluation process
- Provide intelligent analysis of thesis documents
- Deliver comprehensive, actionable feedback to students and evaluators
- Reduce manual evaluation time while maintaining quality standards

**Benefits:**
- Accelerated thesis review cycles
- Consistent evaluation criteria application
- Detailed, structured feedback for students
- Enhanced academic quality assurance
- Improved resource allocation for faculty

**Scope Boundaries:**

*In Scope:*
- Frontend user interface for thesis submission and analysis
- Document upload and management interface
- Results visualization and feedback display
- User authentication and authorization flows
- Responsive design for desktop and mobile devices

*Out of Scope:*
- Backend AI processing engine (separate system)
- Database management system
- Authentication service implementation
- Document storage infrastructure
- Administrative backend systems

### 1.3 Definitions, Acronyms, and Abbreviations

| Term | Definition |
|------|------------|
| **AI** | Artificial Intelligence |
| **API** | Application Programming Interface |
| **AUCDT** | African University College of Digital Technologies |
| **CSS** | Cascading Style Sheets |
| **DOM** | Document Object Model |
| **HMR** | Hot Module Replacement |
| **HTTP** | Hypertext Transfer Protocol |
| **IEEE** | Institute of Electrical and Electronics Engineers |
| **JSX** | JavaScript XML |
| **pnpm** | Performant Node Package Manager |
| **SPA** | Single Page Application |
| **SRS** | Software Requirements Specification |
| **UI** | User Interface |
| **UX** | User Experience |
| **Vite** | Next Generation Frontend Tooling |

### 1.4 References

1. IEEE Std 830-1998, IEEE Recommended Practice for Software Requirements Specifications
2. React Documentation v19 - https://react.dev/
3. TypeScript Documentation v5.9 - https://www.typescriptlang.org/
4. Vite Documentation v7 - https://vitejs.dev/
5. Tailwind CSS Documentation v4 - https://tailwindcss.com/
6. WCAG 2.1 Web Accessibility Guidelines

### 1.5 Overview

This SRS document is structured according to IEEE Std 830-1998. Section 2 provides an overall description of the system, including product perspective, functions, user characteristics, and constraints. Section 3 details specific functional and non-functional requirements. Sections 4 and 5 cover system architecture and technical specifications respectively.

---

## 2. Overall Description

### 2.1 Product Perspective

ThesisAI Frontend is a standalone web application that serves as the presentation layer in a larger thesis assessment ecosystem. It interfaces with:

**External Interfaces:**

1. **Backend API Service** (http://localhost:8080 in development, backend:8080 in production)
   - RESTful API for thesis submission
   - Document analysis requests
   - Results retrieval
   - User authentication

2. **Web Browser Environment**
   - Modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
   - JavaScript must be enabled
   - Cookies enabled for session management

**System Architecture Position:**
```
┌─────────────────┐
│  Web Browser    │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  ThesisAI       │
│  Frontend (SPA) │◄─── This Application
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  Backend API    │
│  Service        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Processing  │
│  Engine         │
└─────────────────┘
```

### 2.2 Product Functions

The ThesisAI Frontend provides the following major functions:

#### F1: User Interface Presentation
- Responsive landing page with product information
- Feature showcase with interactive animations
- Clear call-to-action elements
- Accessible navigation structure

#### F2: Document Analysis Interface (Planned)
- Document upload functionality
- File format validation
- Upload progress tracking
- Structural analysis results display

#### F3: AI Evaluation Interface (Planned)
- Content quality assessment display
- Argumentation analysis visualization
- Academic rigor metrics
- Research methodology evaluation

#### F4: Feedback System (Planned)
- Detailed feedback presentation
- Improvement suggestions
- Grading criteria breakdown
- Downloadable reports

#### F5: User Experience Features
- Smooth animations and transitions
- Loading states and progress indicators
- Error handling and user notifications
- Responsive design across devices

### 2.3 User Characteristics

**Primary User Groups:**

1. **Academic Evaluators (Faculty)**
   - Education Level: Doctorate or Master's degree
   - Technical Expertise: Intermediate computer literacy
   - Domain Knowledge: Expert in specific academic fields
   - Usage Frequency: Regular (daily to weekly)
   - Goals: Efficient thesis evaluation, consistent grading, detailed feedback generation

2. **Graduate Students**
   - Education Level: Bachelor's degree or higher
   - Technical Expertise: Basic to intermediate computer literacy
   - Domain Knowledge: Developing expertise in research area
   - Usage Frequency: Periodic (during thesis development)
   - Goals: Receive feedback, improve thesis quality, understand evaluation criteria

3. **Academic Administrators**
   - Education Level: Master's degree or higher
   - Technical Expertise: Basic computer literacy
   - Domain Knowledge: Academic processes and policies
   - Usage Frequency: Occasional (monitoring and reporting)
   - Goals: Quality assurance, process monitoring, statistical reporting

### 2.4 Constraints

**Technical Constraints:**

1. **C1: Browser Compatibility**
   - Must support modern browsers (Chrome, Firefox, Safari, Edge)
   - Minimum browser versions as specified in package dependencies
   - JavaScript required for functionality

2. **C2: Package Management**
   - Must use pnpm v8.15.0 specifically
   - Cannot use npm or yarn as alternatives

3. **C3: Build System**
   - Must use Vite v7.2.4 as build tool
   - Production builds must be statically served

4. **C4: Responsive Design**
   - Must function on devices with minimum 320px width
   - Must support touch and mouse interactions

**Regulatory Constraints:**

5. **C5: Data Privacy**
   - Must comply with academic data protection standards
   - User session data must be handled securely

6. **C6: Accessibility**
   - Should follow WCAG 2.1 Level AA guidelines
   - Must be usable with keyboard navigation

**Business Constraints:**

7. **C7: Open Source License**
   - Licensed under MIT License
   - All dependencies must have compatible licenses

8. **C8: Development Resources**
   - Development environment must support Node.js 18+
   - Docker deployment support required

### 2.5 Assumptions and Dependencies

**Assumptions:**

1. **A1:** Users have access to modern web browsers with JavaScript enabled
2. **A2:** Backend API service will be available and functional
3. **A3:** Users have stable internet connectivity
4. **A4:** Thesis documents will be in supported formats (PDF, DOCX)
5. **A5:** Users have basic computer literacy skills

**Dependencies:**

1. **D1: Backend API Service**
   - API endpoints must be available at configured URL
   - API must follow RESTful conventions
   - Response formats must be JSON

2. **D2: External Libraries**
   - React v19.2.0
   - TypeScript v5.9.3
   - Tailwind CSS v4.1.17
   - Framer Motion v12.23.24
   - Axios v1.13.2

3. **D3: Development Tools**
   - Node.js v18 or higher
   - pnpm v8.15.0
   - Modern terminal with bash support

4. **D4: Deployment Infrastructure**
   - Docker support for containerization
   - Nginx for production serving
   - HTTPS/SSL certificate for production

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Interface Requirements

**FR-UI-001: Landing Page Display**
- **Priority:** High
- **Description:** The system shall display a responsive landing page with product information
- **Input:** User navigates to application root URL
- **Processing:** Render hero section, feature cards, header, and footer
- **Output:** Fully rendered landing page with animations
- **Acceptance Criteria:**
  - Hero section displays product title and description
  - Three feature cards are visible and interactive
  - Header navigation is functional
  - Footer displays copyright information
  - All animations execute smoothly

**FR-UI-002: Responsive Layout**
- **Priority:** High
- **Description:** The system shall adapt layout to different screen sizes
- **Input:** User accesses application from various devices
- **Processing:** Apply responsive CSS classes based on viewport width
- **Output:** Optimally formatted interface for current viewport
- **Acceptance Criteria:**
  - Desktop view (≥1024px): Three-column feature grid
  - Tablet view (768px-1023px): Two-column or single-column layout
  - Mobile view (<768px): Single-column stacked layout
  - All content remains accessible across breakpoints

**FR-UI-003: Navigation System**
- **Priority:** High
- **Description:** The system shall provide clear navigation between sections
- **Input:** User clicks navigation links or buttons
- **Processing:** Smooth scroll to target section or route change
- **Output:** User navigated to requested content
- **Acceptance Criteria:**
  - Header links navigate to corresponding sections
  - "Get Started" and "Start Assessment" buttons trigger appropriate actions
  - Smooth scroll animations for section navigation

#### 3.1.2 Feature Display Requirements

**FR-FD-001: Document Analysis Feature Card**
- **Priority:** High
- **Description:** The system shall display information about document analysis capabilities
- **Input:** Page load
- **Processing:** Render FeatureCard component with FileText icon
- **Output:** Feature card with icon, title, and description
- **Acceptance Criteria:**
  - FileText icon displayed in academic-gold color
  - Title: "Document Analysis"
  - Description accurately describes functionality
  - Hover effect: Card lifts 5px upward

**FR-FD-002: AI Evaluation Feature Card**
- **Priority:** High
- **Description:** The system shall display information about AI evaluation capabilities
- **Input:** Page load
- **Processing:** Render FeatureCard component with Brain icon
- **Output:** Feature card with icon, title, and description
- **Acceptance Criteria:**
  - Brain icon displayed in academic-gold color
  - Title: "AI Evaluation"
  - Description accurately describes functionality
  - Hover effect: Card lifts 5px upward

**FR-FD-003: Detailed Feedback Feature Card**
- **Priority:** High
- **Description:** The system shall display information about feedback capabilities
- **Input:** Page load
- **Processing:** Render FeatureCard component with CheckCircle icon
- **Output:** Feature card with icon, title, and description
- **Acceptance Criteria:**
  - CheckCircle icon displayed in academic-gold color
  - Title: "Detailed Feedback"
  - Description accurately describes functionality
  - Hover effect: Card lifts 5px upward

#### 3.1.3 Animation Requirements

**FR-AN-001: Hero Section Animation**
- **Priority:** Medium
- **Description:** The system shall animate hero section on page load
- **Input:** Page load complete
- **Processing:** Execute Framer Motion fade-in and slide-up animation
- **Output:** Smoothly animated hero content appearance
- **Acceptance Criteria:**
  - Animation duration: 600ms
  - Initial state: opacity 0, translateY 20px
  - Final state: opacity 1, translateY 0
  - Animation starts automatically

**FR-AN-002: Feature Cards Animation**
- **Priority:** Medium
- **Description:** The system shall animate feature cards on page load
- **Input:** Page load complete
- **Processing:** Execute Framer Motion fade-in animation with delay
- **Output:** Smoothly animated feature cards appearance
- **Acceptance Criteria:**
  - Animation delay: 300ms after page load
  - Animation duration: 600ms
  - All three cards animate simultaneously

**FR-AN-003: Interactive Hover Effects**
- **Priority:** Low
- **Description:** The system shall provide visual feedback on interactive elements
- **Input:** User hovers over interactive element
- **Processing:** Apply hover state styles with transitions
- **Output:** Visual feedback to user
- **Acceptance Criteria:**
  - Feature cards lift on hover
  - Navigation links change opacity on hover
  - Buttons change background color on hover
  - All transitions are smooth (no jank)

#### 3.1.4 Future Functional Requirements (Planned)

**FR-FU-001: Document Upload** (Priority: High - Phase 2)
- User can select and upload thesis documents
- Supported formats: PDF, DOCX
- File size limit: 50MB
- Upload progress indicator displayed

**FR-FU-002: Analysis Request** (Priority: High - Phase 2)
- User can initiate AI analysis on uploaded document
- System validates document before processing
- Loading state displayed during analysis

**FR-FU-003: Results Display** (Priority: High - Phase 2)
- Analysis results displayed in structured format
- Visual charts for quantitative metrics
- Expandable sections for detailed feedback

**FR-FU-004: User Authentication** (Priority: High - Phase 2)
- User login and registration
- Session management
- Role-based access control

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements

**NFR-PERF-001: Page Load Time**
- **Priority:** High
- **Description:** The system shall load the initial page within 3 seconds on standard broadband connection (5 Mbps)
- **Measurement:** Time from URL request to complete page render
- **Target:** ≤ 3 seconds (average), ≤ 5 seconds (95th percentile)

**NFR-PERF-002: Animation Frame Rate**
- **Priority:** Medium
- **Description:** The system shall maintain 60 FPS during animations
- **Measurement:** Frames per second during animation execution
- **Target:** ≥ 60 FPS on modern hardware

**NFR-PERF-003: Bundle Size**
- **Priority:** Medium
- **Description:** The system shall maintain optimized JavaScript bundle size
- **Measurement:** Total size of JavaScript bundles after gzip compression
- **Target:** ≤ 500 KB (initial bundle)

**NFR-PERF-004: Time to Interactive**
- **Priority:** High
- **Description:** The system shall become fully interactive quickly
- **Measurement:** Time until user can interact with all elements
- **Target:** ≤ 4 seconds on standard hardware

#### 3.2.2 Reliability Requirements

**NFR-REL-001: System Availability**
- **Priority:** High
- **Description:** The system shall be available for use 99.5% of the time
- **Measurement:** (Total time - Downtime) / Total time × 100
- **Target:** ≥ 99.5% uptime

**NFR-REL-002: Error Handling**
- **Priority:** High
- **Description:** The system shall gracefully handle errors without crashing
- **Measurement:** Percentage of errors handled without app crash
- **Target:** 100% of errors caught and handled

**NFR-REL-003: Browser Compatibility**
- **Priority:** High
- **Description:** The system shall function correctly across supported browsers
- **Measurement:** Feature compatibility testing across browser matrix
- **Target:** 100% core functionality on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

#### 3.2.3 Usability Requirements

**NFR-USE-001: User Interface Intuitiveness**
- **Priority:** High
- **Description:** The system shall be usable without training for users with basic computer literacy
- **Measurement:** Task completion rate for new users
- **Target:** ≥ 90% task completion rate without help

**NFR-USE-002: Response Time Feedback**
- **Priority:** Medium
- **Description:** The system shall provide visual feedback for all user actions within 100ms
- **Measurement:** Time from user action to visual response
- **Target:** ≤ 100ms for immediate feedback (loading indicators, etc.)

**NFR-USE-003: Accessibility Compliance**
- **Priority:** High
- **Description:** The system shall meet WCAG 2.1 Level AA standards
- **Measurement:** Automated and manual accessibility testing
- **Target:** 0 Level A violations, ≤ 2 Level AA violations

**NFR-USE-004: Mobile Usability**
- **Priority:** High
- **Description:** The system shall be fully functional on mobile devices
- **Measurement:** Touch target sizes, text readability, layout adaptation
- **Target:** All touch targets ≥ 44×44 pixels, text ≥ 16px base size

#### 3.2.4 Maintainability Requirements

**NFR-MAIN-001: Code Quality**
- **Priority:** High
- **Description:** The system shall maintain high code quality standards
- **Measurement:** TypeScript strict mode compliance, test coverage
- **Target:** 0 TypeScript errors, ≥ 80% test coverage

**NFR-MAIN-002: Component Modularity**
- **Priority:** Medium
- **Description:** The system shall be built with reusable, modular components
- **Measurement:** Component coupling and cohesion metrics
- **Target:** Each component has single responsibility, clear interfaces

**NFR-MAIN-003: Documentation**
- **Priority:** Medium
- **Description:** The system shall maintain comprehensive documentation
- **Measurement:** Documentation coverage of components and functions
- **Target:** All exported components and functions documented

#### 3.2.5 Security Requirements

**NFR-SEC-001: Secure Communication**
- **Priority:** High
- **Description:** The system shall use HTTPS for all network communications in production
- **Measurement:** SSL/TLS certificate validation, secure protocol usage
- **Target:** 100% of requests over HTTPS in production

**NFR-SEC-002: Data Validation**
- **Priority:** High
- **Description:** The system shall validate all user inputs before processing
- **Measurement:** Input validation coverage
- **Target:** 100% of user inputs validated

**NFR-SEC-003: Dependency Security**
- **Priority:** High
- **Description:** The system shall not include dependencies with known vulnerabilities
- **Measurement:** Security audit results (npm audit, Snyk, etc.)
- **Target:** 0 high or critical severity vulnerabilities

#### 3.2.6 Portability Requirements

**NFR-PORT-001: Docker Deployment**
- **Priority:** High
- **Description:** The system shall be deployable via Docker containers
- **Measurement:** Successful build and deployment of Docker image
- **Target:** Single-command deployment from Docker image

**NFR-PORT-002: Environment Configuration**
- **Priority:** Medium
- **Description:** The system shall support different environments through configuration
- **Measurement:** Successful deployment to dev, staging, production environments
- **Target:** Environment-specific configuration without code changes

**NFR-PORT-003: Browser Platform Independence**
- **Priority:** High
- **Description:** The system shall function identically across supported platforms
- **Measurement:** Cross-platform functional testing
- **Target:** Identical functionality on Windows, macOS, Linux, iOS, Android

---

## 4. System Architecture

### 4.1 Architecture Overview

ThesisAI Frontend follows a **Single Page Application (SPA)** architecture pattern built with React. The application uses a component-based structure with the following architectural layers:

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (React)          │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │  App    │──│ Header  │  │ Footer  │    │
│  │Component│  └─────────┘  └─────────┘    │
│  └────┬────┘                               │
│       │                                    │
│       ├──► FeatureCard Components          │
│       └──► Hero Section                    │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         State Management Layer              │
│  (React State, Future: Context/Redux)       │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         API Service Layer (Axios)           │
│  (Future: API clients, interceptors)        │
└─────────────────────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────┐
│         Backend API (External)              │
│         http://localhost:8080/api           │
└─────────────────────────────────────────────┘
```

### 4.2 Component Architecture

**Current Component Structure:**

```
src/
├── main.tsx                 # Application entry point
│   └── Renders App in StrictMode
│
├── App.tsx                  # Root component
│   ├── Header               # Navigation and branding
│   ├── Hero Section         # Main content area
│   │   └── Call-to-action buttons
│   ├── Features Grid
│   │   ├── FeatureCard (Document Analysis)
│   │   ├── FeatureCard (AI Evaluation)
│   │   └── FeatureCard (Detailed Feedback)
│   └── Footer               # Copyright and links
│
└── FeatureCard Component    # Reusable feature display
    ├── Icon
    ├── Title
    └── Description
```

### 4.3 Data Flow

**Current State (Phase 1 - Static):**
```
User Action → React State Update → Component Re-render → UI Update
```

**Future State (Phase 2 - API Integration):**
```
User Action →
  Event Handler →
    API Request (Axios) →
      Backend Processing →
        API Response →
          State Update →
            Component Re-render →
              UI Update
```

### 4.4 Technology Stack Architecture

```
┌────────────────────────────────────────┐
│   Development Tools                    │
│   • TypeScript 5.9.3                  │
│   • Vite 7.2.4 (Build & Dev Server)  │
│   • pnpm 8.15.0 (Package Manager)    │
└────────────────────────────────────────┘
                 ▼
┌────────────────────────────────────────┐
│   Frontend Framework                   │
│   • React 19.2.0                      │
│   • React DOM 19.2.0                  │
└────────────────────────────────────────┘
                 ▼
┌────────────────────────────────────────┐
│   UI & Styling                         │
│   • Tailwind CSS 4.1.17               │
│   • Framer Motion 12.23.24            │
│   • Lucide React 0.554.0 (Icons)     │
└────────────────────────────────────────┘
                 ▼
┌────────────────────────────────────────┐
│   Data & Routing (Future)              │
│   • Axios 1.13.2                      │
│   • React Router DOM 7.9.6            │
│   • Recharts 3.5.0                    │
└────────────────────────────────────────┘
```

### 4.5 Deployment Architecture

**Development Environment:**
```
┌─────────────┐
│  Developer  │
│  Machine    │
└──────┬──────┘
       │
       ├─► pnpm install (Install dependencies)
       ├─► pnpm dev (Start Vite dev server :3000)
       └─► http://localhost:3000
           │
           └─► Proxy /api → http://localhost:8080
```

**Production Environment (Docker):**
```
┌──────────────────────────────────────┐
│  Docker Container                    │
│                                      │
│  ┌────────────────────────────────┐ │
│  │  Nginx (Port 80)               │ │
│  │  • Serve static files          │ │
│  │  • SPA routing fallback        │ │
│  │  • Gzip compression            │ │
│  └─────────────┬──────────────────┘ │
│                │                     │
│  ┌─────────────▼──────────────────┐ │
│  │  Static Build Files            │ │
│  │  /usr/share/nginx/html/        │ │
│  │  • index.html                  │ │
│  │  • assets/js/*.js              │ │
│  │  • assets/css/*.css            │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
           │
           ├─► Browser :80
           └─► API calls → backend:8080
```

---

## 5. Technical Specifications

### 5.1 Development Environment

**Required Software:**
- Node.js: v18.0.0 or higher
- pnpm: v8.15.0 (exact version required)
- Git: Latest stable version
- Modern code editor (VS Code recommended)

**Recommended VS Code Extensions:**
- ESLint
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- Prettier - Code formatter

### 5.2 Build Configuration

**Vite Configuration (vite.config.ts):**
```typescript
{
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
}
```

**TypeScript Configuration (tsconfig.json):**
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

### 5.3 Styling System

**Tailwind CSS Custom Theme:**

| Property | Value | Usage |
|----------|-------|-------|
| `academic-navy` | #1e3a5f | Primary backgrounds, dark sections |
| `academic-blue` | #2563eb | Gradient backgrounds, accents |
| `academic-amber` | #f59e0b | Hover states, secondary buttons |
| `academic-gold` | #fbbf24 | Primary buttons, icons, highlights |
| `academic-slate` | #475569 | Text, subtle elements |

**Font System:**
- Serif: `'Crimson Text', Georgia, serif` - Used for headings
- Sans: `'Inter', system-ui, sans-serif` - Used for body text

### 5.4 Component Specifications

**FeatureCard Component:**

```typescript
interface FeatureCardProps {
  icon: React.ReactNode    // Lucide icon component
  title: string           // Feature name
  description: string     // Feature description
}

// Styling:
// - Glass morphism effect (backdrop-blur)
// - White/10 background with white/20 border
// - Hover: translateY(-5px)
// - Rounded corners: 2xl (16px)
// - Padding: 8 (32px)
```

### 5.5 Animation Specifications

**Framer Motion Variants:**

1. **Hero Section Animation:**
   - Initial: `{ opacity: 0, y: 20 }`
   - Animate: `{ opacity: 1, y: 0 }`
   - Transition: `{ duration: 0.6 }`

2. **Features Grid Animation:**
   - Initial: `{ opacity: 0 }`
   - Animate: `{ opacity: 1 }`
   - Transition: `{ delay: 0.3, duration: 0.6 }`

3. **Card Hover Effect:**
   - WhileHover: `{ y: -5 }`

### 5.6 API Integration (Planned)

**Base Configuration:**
- Base URL: `http://localhost:8080/api` (development)
- Base URL: `http://backend:8080/api` (production)
- Client: Axios 1.13.2
- Timeout: 30 seconds for file uploads
- Headers: `Content-Type: application/json`

**Planned Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/login | User authentication |
| POST | /api/thesis/upload | Upload thesis document |
| GET | /api/thesis/:id | Retrieve thesis details |
| POST | /api/analysis/start | Start AI analysis |
| GET | /api/analysis/:id | Get analysis results |

### 5.7 Testing Specifications

**Test Framework Configuration:**

```javascript
// vitest.config.ts
{
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
}
```

**Test Coverage Targets:**
- Statements: ≥ 80%
- Branches: ≥ 80%
- Functions: ≥ 80%
- Lines: ≥ 80%

**Current Test Coverage:**
- App.tsx: 100%
- FeatureCard: 100%

### 5.8 Docker Specifications

**Multi-Stage Build:**

1. **Build Stage (Node 18 Alpine):**
   - Install pnpm
   - Copy package files
   - Install dependencies
   - Copy source code
   - Run production build

2. **Production Stage (Nginx Alpine):**
   - Copy built files from build stage
   - Copy nginx configuration
   - Expose port 80
   - Start Nginx server

**Nginx Configuration:**
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;  # SPA routing
  }
}
```

### 5.9 Version Control

**Git Workflow:**
- Main branch: `main` (production-ready code)
- Feature branches: `claude/*` pattern
- Commit message format: Conventional Commits
- Pull requests required for merging to main

**Commit Message Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: feat, fix, docs, style, refactor, test, chore

### 5.10 Security Measures

**Implemented:**
1. TypeScript strict mode for type safety
2. React StrictMode for development warnings
3. Dependencies from trusted sources (npm registry)
4. MIT License compliance

**Planned (Phase 2):**
1. HTTPS enforcement in production
2. Content Security Policy headers
3. Input sanitization for user data
4. XSS protection
5. CSRF token implementation

---

## Appendix A: Change Log

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-26 | 1.0 | Initial SRS document creation for Phase 1 foundation setup |

---

## Appendix B: Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Technical Lead | | | |
| QA Lead | | | |
| Stakeholder | | | |

---

*End of Software Requirements Specification Document*
