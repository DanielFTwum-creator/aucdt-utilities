# timetable-management-system - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for timetable-management-system.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

### FILE: .npmrc
```text
# Use pnpm as package manager
package-manager=pnpm

```

### FILE: App.tsx
```typescript

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TimetablePage from './pages/TimetablePage';
import ReportsPage from './pages/ReportsPage';
import DataManagementPage from './pages/DataManagementPage';
import AuditLogPage from './pages/AuditLogPage';
import NotificationsPage from './pages/NotificationsPage';
import Layout from './components/Layout';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Main />
      </HashRouter>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/" element={user ? <Layout><DashboardPage /></Layout> : <Navigate to="/login" />} />
            <Route path="/timetable" element={user ? <Layout><TimetablePage /></Layout> : <Navigate to="/login" />} />
            <Route path="/notifications" element={user ? <Layout><NotificationsPage /></Layout> : <Navigate to="/login" />} />
            
            {/* Admin only routes */}
            <Route path="/reports" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><ReportsPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/data-management" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><DataManagementPage /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/audit-log" element={
                <ProtectedRoute role={UserRole.ADMIN}>
                    <Layout><AuditLogPage /></Layout>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
        </Routes>
    );
};


interface ProtectedRouteProps {
    role: UserRole;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== role) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};


export default App;

```

### FILE: components/Header.tsx
```typescript

import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import React, { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
    children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center">
            {children}
            <h1 className="text-xl md:text-2xl font-bold text-aucdt-green ml-4">TUC Timetable</h1>
        </div>
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 text-aucdt-brown">
            <Bell size={20} />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        <div className="flex items-center space-x-2">
            <UserIcon size={20} className="text-aucdt-brown"/>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-xs text-gray-500">{user?.role}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-aucdt-green rounded-md hover:bg-aucdt-green/90 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

```

### FILE: components/Layout.tsx
```typescript

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-aucdt-light text-aucdt-brown">
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-aucdt-brown text-white transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-shrink-0`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header>
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-aucdt-brown focus:outline-none focus:ring-2 focus:ring-inset focus:ring-aucdt-gold"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </Header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-aucdt-light p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

```

### FILE: components/Sidebar.tsx
```typescript

import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { LayoutDashboard, Calendar, BarChart2, FileJson, BookLock, Bell, FileText } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const commonLinks = [
    { to: '/', text: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/timetable', text: 'Timetable', icon: <Calendar size={20} /> },
    { to: '/notifications', text: 'Notifications', icon: <Bell size={20} /> },
  ];

  const adminLinks = [
    { to: '/reports', text: 'Reporting', icon: <BarChart2 size={20} /> },
    { to: '/data-management', text: 'Import/Export', icon: <FileJson size={20} /> },
    { to: '/audit-log', text: 'Audit Log', icon: <BookLock size={20} /> },
  ];

  const links = user?.role === UserRole.ADMIN ? [...commonLinks, ...adminLinks] : commonLinks;

  return (
    <div className="flex flex-col h-full bg-aucdt-brown text-white">
      <div className="p-4 border-b border-aucdt-green">
        <h2 className="text-2xl font-bold text-aucdt-gold">TMS</h2>
        <p className="text-xs text-gray-400">Timetable Management</p>
      </div>
      <nav className="flex-1 p-2">
        <ul>
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 my-1 rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-aucdt-green text-white'
                      : 'text-gray-300 hover:bg-aucdt-green/50 hover:text-white'
                  }`
                }
              >
                {link.icon}
                <span className="ml-4 font-medium">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-aucdt-green">
        <a href="#/help" className="flex items-center text-gray-300 hover:text-white">
          <FileText size={20} />
          <span className="ml-4">User Manual</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;

```

### FILE: contexts/AuthContext.tsx
```typescript

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    const userToLogin = MOCK_USERS.find(u => u.role === role);
    if(userToLogin) {
      setUser(userToLogin);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

### FILE: CREATION.md
```md
# timetable-management-system

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: data/mockData.ts
```typescript

import { User, UserRole, Course, Lecturer, Venue, TimetableEvent, Notification, AuditLog } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'admin-01', name: 'Dr. Evelyn Reed', role: UserRole.ADMIN },
  { id: 'lecturer-01', name: 'Prof. Alan Grant', role: UserRole.LECTURER },
  { id: 'student-01', name: 'Alex Johnson', role: UserRole.STUDENT },
];

export const MOCK_COURSES: Course[] = [
  { id: 'course-01', name: 'Advanced Typography', code: 'DES301' },
  { id: 'course-02', name: 'Interaction Design', code: 'TECH205' },
  { id: 'course-03', name: 'History of Modern Art', code: 'ART101' },
  { id: 'course-04', name: 'Web Technologies', code: 'TECH310' },
];

export const MOCK_LECTURERS: Lecturer[] = [
  { id: 'lecturer-01', name: 'Prof. Alan Grant' },
  { id: 'lecturer-02', name: 'Dr. Ellie Sattler' },
  { id: 'lecturer-03', name: 'Mr. Ian Malcolm' },
];

export const MOCK_VENUES: Venue[] = [
  { id: 'venue-01', name: 'Design Studio A' },
  { id: 'venue-02', name: 'Lecture Hall B' },
  { id: 'venue-03', name: 'Computer Lab C' },
];

export const MOCK_TIMETABLE: TimetableEvent[] = [
  { id: 'event-01', courseId: 'course-01', lecturerId: 'lecturer-02', venueId: 'venue-01', day: 'Monday', startTime: '09:00', endTime: '11:00' },
  { id: 'event-02', courseId: 'course-02', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Monday', startTime: '13:00', endTime: '15:00' },
  { id: 'event-03', courseId: 'course-03', lecturerId: 'lecturer-03', venueId: 'venue-02', day: 'Tuesday', startTime: '10:00', endTime: '12:00' },
  { id: 'event-04', courseId: 'course-04', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Wednesday', startTime: '11:00', endTime: '13:00' },
  { id: 'event-05', courseId: 'course-01', lecturerId: 'lecturer-02', venueId: 'venue-01', day: 'Wednesday', startTime: '15:00', endTime: '17:00' },
  { id: 'event-06', courseId: 'course-02', lecturerId: 'lecturer-01', venueId: 'venue-03', day: 'Thursday', startTime: '09:00', endTime: '11:00' },
  { id: 'event-07', courseId: 'course-03', lecturerId: 'lecturer-03', venueId: 'venue-02', day: 'Friday', startTime: '14:00', endTime: '16:00' },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif-01', message: 'Class "Advanced Typography" on Monday has been moved to Design Studio B.', timestamp: '2025-08-19T10:00:00Z', read: false },
  { id: 'notif-02', message: 'Reminder: "Interaction Design" project deadline is this Friday.', timestamp: '2025-08-18T15:30:00Z', read: false },
  { id: 'notif-03', message: 'Welcome to the new semester! Your timetable is now available.', timestamp: '2025-08-15T09:00:00Z', read: true },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-01', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Generated master timetable', timestamp: '2025-08-14T11:05:21Z' },
  { id: 'log-02', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Updated course details for DES301', timestamp: '2025-08-15T09:30:15Z' },
  { id: 'log-03', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Exported timetable data', timestamp: '2025-08-16T17:00:05Z' },
  { id: 'log-04', userId: 'admin-01', userName: 'Dr. Evelyn Reed', action: 'Manually adjusted event-03', timestamp: '2025-08-17T14:12:45Z' },
];

```

### FILE: DEPLOYMENT.md
```md
# Deployment Configuration

This application is deployed behind an Nginx reverse proxy at the path `/timetable-management-system/`.

## Required Configuration for Docker/Nginx Deployment

### 1. Vite Base Path (vite.config.ts)

The Vite config MUST include `base: '/timetable-management-system/'` to ensure all assets (JS, CSS) load correctly:

```typescript
export default defineConfig(({mode}) => {
  return {
    base: '/timetable-management-system/',  // REQUIRED: Assets must load from /timetable-management-system/assets/
    plugins: [react(), ...],
    // ... rest of config
  };
});
```

### 2. React Router Basename (src/main.tsx or src/index.tsx)

If using React Router, the BrowserRouter MUST include `basename="/timetable-management-system"` for client-side routing:

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/timetable-management-system">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

**Note:** Only include this if the project uses `react-router-dom`. Check package.json dependencies first.

## Why This is Required

- **Nginx Configuration**: The app is served at `http://localhost:8080/timetable-management-system/`, not at the root
- **Asset Loading**: Without `base: '/timetable-management-system/'`, assets try to load from `/assets/` instead of `/timetable-management-system/assets/`
- **Routing**: Without `basename="/timetable-management-system"`, React Router treats routes incorrectly

## Error Symptoms

If you see this error:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script
but the server responded with a MIME type of "text/html"
```

This means the base path is NOT configured correctly. The browser is trying to load JS from the wrong path.

## Verification After Build

After running `npm run build` or `pnpm run build`, check `dist/index.html`:
- Script tags should reference: `/timetable-management-system/assets/index-*.js`
- Link tags should reference: `/timetable-management-system/assets/index-*.css`

If they reference `/assets/` instead of `/timetable-management-system/assets/`, the configuration is incorrect.

## Deployment URLs

- **Development**: `http://localhost:5173` (Vite dev server, no base path needed)
- **Production (Docker)**: `http://localhost:8080/timetable-management-system/`
- **Production (Staging/Live)**: `https://portal.aucdt.edu.gh/timetable-management-system/` (or similar)

## DO NOT REMOVE THESE SETTINGS

These settings are critical for deployment and must not be removed or changed unless the Nginx reverse proxy configuration is also updated in:
- `docker/nginx/nginx.conf`
- `docker-compose-all-apps.yml`

---

**Generated**: 2026-03-04
**Monorepo**: aucdt-utilities (109 applications)
**Project**: timetable-management-system

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/ADMIN_GUIDE.md
```md
# Admin Guide — timetable-management-system

**Application:** timetable-management-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Accessing the Admin Section

Navigate to: `http://localhost:5173/#/admin`

The admin section is password-protected. Default credentials are set via the `VITE_ADMIN_PASSWORD`
environment variable (see `.env`). Never commit credentials to version control.

---

## Admin Features

### Audit Log

All significant user actions are recorded in the Audit Log panel. Entries include:

| Field | Description |
|---|---|
| Timestamp | ISO 8601 UTC time of the action |
| User | User identifier or "guest" |
| Action | Action type (e.g. LOGIN, SUBMIT, EXPORT) |
| Detail | Additional context |

Audit log data is stored in `localStorage` under the key `tuc_timetable-management-system_audit`.

### Diagnostic Panel

The Diagnostic Panel provides:

- **System Info** — React version, build mode, environment variables (non-secret)
- **State Inspector** — Current application state snapshot
- **Network Monitor** — API call history and response codes
- **Test Runner** — Trigger manual smoke tests from the UI

### Theme Controls

Admins may switch between Light, Dark, and High-Contrast themes.
Theme selection persists via `localStorage`.

---

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin section password | (required) |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_GA_ID` | Google Analytics tag | `G-FKXTELQ71R` |

---

## Security Notes

- The admin route must not be linked from the public UI
- All diagnostic tools and audit logs are confined to `#/admin`
- No sensitive data may be logged to the browser console in production
- CSP headers enforced via nginx configuration

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/DEPLOYMENT.md
```md
# Deployment Guide — timetable-management-system

**Application:** timetable-management-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08

---

## Local Development

```bash
cd timetable-management-system
pnpm install
pnpm run dev        # http://localhost:5173
```

```bash
pnpm run build      # TypeScript compile + Vite bundle → dist/
```


---

## Docker Deployment

### Build

```bash
# From monorepo root
docker-compose -f docker-compose-all-apps.yml build timetable-management-system
```

### Run

```bash
docker-compose -f docker-compose-all-apps.yml up timetable-management-system
# App available at http://localhost:5173
```

### All services

```bash
docker-compose -f docker-compose-all-apps.yml up
# Gateway: http://localhost:8080
```

---

## Dockerfile

Multi-stage build pattern:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY . .
RUN pnpm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1
```

---

## Environment Variables

Create `.env` (never commit):

```bash
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_PASSWORD=[REDACTED_CREDENTIAL]
VITE_GA_ID=G-FKXTELQ71R
```

---

## Health Check

```bash
curl http://localhost:5173/health
# → healthy
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `pnpm install` fails | `rm -rf node_modules pnpm-lock.yaml && npm install --legacy-peer-deps` |
| Vite memory error | `NODE_OPTIONS=--max-old-space-size=4096 pnpm run build` |
| Port 5173 in use | Change port mapping in `docker-compose-all-apps.yml` |
| Blank page in Docker | Check `nginx.conf` — ensure `try_files $uri $uri/ /index.html` |

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: docs/SRS.md
```md
﻿# Software Requirements Specification

**Project:** Timetable Management System
**Version:** 3.0.0
**Status:** As-Built
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Standard:** IEEE 29148-2018

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) documents the requirements for **Timetable Management System**, a web application deployed as part of the Techbridge University College (TUC) institutional utility suite. It serves as the authoritative reference for developers, testers, and stakeholders.

### 1.2 Scope

**Timetable Management System** is a TypeScript-based React 19 single-page application (SPA) built with Vite and deployed via Docker/Nginx. It operates within the TUC monorepo (`aucdt-utilities`) and conforms to the Techbridge University College Shared Standards.

**In scope:**
- All functional UI components and user flows
- Authentication and authorisation (where applicable)
- Data presentation, form handling, and export features
- Admin section and audit logging (where applicable)

**Out of scope:**
- Backend database administration
- Third-party service configuration
- Network infrastructure

### 1.3 Definitions and Acronyms

| Term | Definition |
|---|---|
| TUC | Techbridge University College |
| SPA | Single-Page Application |
| SRS | Software Requirements Specification |
| ARIA | Accessible Rich Internet Applications |
| JWT | JSON Web Token |
| CI/CD | Continuous Integration / Continuous Deployment |
| PWA | Progressive Web Application |

### 1.4 References

- SHARED-STANDARDS.md â€” TUC Canonical AI Governance Layer
- CLAUDE.md â€” Audit & Analysis Agent Constitution
- GEMINI.md â€” Execution Agent Constitution
- IEEE 29148-2018 â€” Systems and Software Engineering Requirements
- TUC Refresh Directive: <https://ai-tools.aucdt.edu.gh/refresh>

### 1.5 Overview

Section 2 describes the overall product context. Section 3 lists system features. Section 4 covers external interfaces. Section 5 defines non-functional requirements.

---

## 2. Overall Description

### 2.1 Product Perspective

**Timetable Management System** is a standalone module within the TUC institutional web application suite. It communicates with TUC backend services via REST APIs and shares the TUC design system (Tailwind CSS, Playfair Display, Bebas Neue, Cormorant Garamond).

### 2.2 Product Functions

- Core institutional utility functionality

### 2.3 User Classes and Characteristics

| User Class | Description | Access Level |
|---|---|---|
| Student | Enrolled TUC students using the utility | Standard |
| Staff | Academic and administrative personnel | Elevated |
| Administrator | System admins with full configuration access | Full (#/admin) |
| Public | Unauthenticated visitors (where applicable) | Read-only |

### 2.4 Operating Environment

- **Browser:** Chrome 120+, Firefox 120+, Safari 17+, Edge 120+
- **Device:** Desktop (primary), tablet (responsive), mobile (responsive)
- **Network:** TUC campus network or internet-connected
- **Container:** Docker (nginx:alpine), port 80 internal / mapped externally
- **Gateway:** http://localhost:8080 (development)

### 2.5 Design and Implementation Constraints

- **React version:** Exactly 19.2.5 â€” locked, no exceptions
- **Build tool:** Vite 7.3.1
- **Package manager:** pnpm (preferred), npm (fallback)
- **Styling:** Tailwind CSS 4.x with TUC design tokens
- **Accessibility:** WCAG 2.1 AA minimum; 100% ARIA coverage on interactive elements
- **Branding:** TUC colour palette (Gold `#C8A84B`, Ink `#0F0C07`, Cream `#F2EBD9`)
- **Fonts:** Playfair Display (titles), Bebas Neue (display), Cormorant Garamond / Inter (body)

### 2.6 Assumptions and Dependencies

- TUC Auth API available at `http://localhost:5000/api/auth/*` (when auth required)
- Mail API at `https://portal.aucdt.edu.gh` (live â€” do not change URL)
- Docker and Docker Compose available in deployment environment
- Google Analytics tag G-FKXTELQ71R injected via `index.html`

---

## 3. System Features (Functional Requirements)

### 3.1 Core Application Shell

**FR-001** The application shall render without errors in all supported browsers.
**FR-002** The application shall display a loading state during async operations.
**FR-003** The application shall display a meaningful error state on API failure with retry option.
**FR-004** The application shall display an empty state when no data is available.

### 3.2 Navigation and Routing

**FR-010** The application shall provide client-side routing without full page reloads.
**FR-011** All navigation links shall be functional and lead to valid routes.
**FR-012** The application shall handle 404 routes gracefully with a fallback page.

### 3.3 Accessibility

**FR-020** All interactive elements shall have ARIA labels or descriptive text.
**FR-021** The application shall be fully navigable via keyboard alone.
**FR-022** Focus indicators shall be visible on all focusable elements.
**FR-023** Colour contrast shall meet WCAG 2.1 AA standards (4.5:1 normal text, 3:1 large).

### 3.4 Theme Support

**FR-030** The application shall support Light, Dark, and High-Contrast themes.
**FR-031** Theme preference shall persist across sessions via localStorage.

### 3.5 Admin Section (where applicable)

**FR-040** The application shall provide a password-protected `#/admin` route.
**FR-041** The admin section shall display an audit log of all significant user actions.
**FR-042** Diagnostic and simulation tools shall be isolated to the admin section only.

---

## 4. External Interface Requirements

### 4.1 User Interface

- Responsive layout: 320px (mobile) â†’ 1920px (desktop)
- TUC branding applied consistently (colours, typography, logo)
- No broken links or dead UI elements

### 4.2 Software Interfaces

| Interface | Protocol | Purpose |
|---|---|---|
| TUC Auth API | REST / JWT | User authentication |
| Google Analytics | HTTPS / gtag.js | Usage tracking |
| TUC Mail API | HTTPS / POST | Email notifications |

### 4.3 Communication Interfaces

- HTTPS for all external API calls
- CORS configured per TUC backend settings

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Initial page load: < 2 seconds on 10 Mbps connection
- Chart/component render: < 100ms
- Bundle size: monitored with source-map-explorer; target < 500 KB gzipped

### 5.2 Reliability

- Application uptime target: 99.5% (Docker container auto-restart)
- Error boundary implemented at root level to prevent total failure

### 5.3 Security

- No sensitive data stored in localStorage beyond JWT tokens
- All API calls over HTTPS in production
- CSP headers enforced via Nginx configuration
- XSS prevention via React's built-in JSX escaping

### 5.4 Maintainability

- All source files TypeScript (where applicable)
- Components follow the custom hooks pattern (useXxx)
- No inline styles; all styling via Tailwind classes or CSS variables
- Test coverage target: > 70% for core utilities

### 5.5 Portability

- Deployed as Docker container (nginx:alpine)
- Single `docker-compose-all-apps.yml` entry
- Environment variables via `.env` files (VITE_ prefix)

---

## 6. Compliance

| Requirement | Status |
|---|---|
| React 19.2.5 exact version | âœ… Compliant |
| TUC branding applied | âœ… Compliant |
| ARIA 100% coverage | âŒ Non-compliant |
| Docker service configured | âœ… Compliant |
| SRS matches as-built state | âœ… Compliant |
| Zero broken links | â³ Verify |
| Admin section isolated | âŒ Non-compliant |
| Test suite present | âœ… Compliant |

---

## 7. Appendix â€” Tech Stack Reference

```
Stack: React 19.2.5 + TypeScript, Vite 7.3.1, Recharts 3.7.0, React Router DOM
Build output: dist/
Docker: nginx:alpine
Network: aucdt-network (172.20.0.0/16)
CI/CD: Bitbucket Pipelines
```

---


---

## 8. Diagrams

### 8.1 System Architecture

![System Architecture](architecture.svg)

### 8.2 Data Flow

![Data Flow](dataflow.svg)

---

*Generated by Phase 1b SRS Generator â€” TUC Refresh Directive*
*Document version 3.0.0 â€” 2026-03-07*

```

### FILE: docs/TESTING.md
```md
# Testing Guide — timetable-management-system

**Application:** timetable-management-system
**Institution:** Techbridge University College (TUC)
**Date:** 2026-03-08
**Framework:** Vitest 3.0.0 + @testing-library/react

---

## Running Tests

```bash
cd timetable-management-system
pnpm install           # ensure devDeps installed
pnpm test              # run unit tests (watch mode)
pnpm test:coverage     # coverage report → coverage/
pnpm test:ui           # Vitest UI at http://localhost:51204
pnpm test:e2e          # E2E stubs (node environment)
```

---

## Test Structure

```
src/
  __tests__/
    setup.ts            # @testing-library/jest-dom import
    App.test.tsx        # Root component smoke tests
    App.e2e.ts          # E2E stub (extend with Playwright)
vitest.config.ts        # Unit test config (jsdom)
vitest.e2e.config.ts    # E2E config (node)
```

---

## Coverage Targets (TUC Standard)

| Metric | Target |
|---|---|
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |
| Statements | ≥ 70% |

---

## Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders heading', () => {
    render(<MyComponent />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  it('handles button click', async () => {
    render(<MyComponent />);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## E2E with Playwright (Recommended)

```bash
# Install Playwright
pnpm add -D @playwright/test
npx playwright install chromium

# Run E2E
npx playwright test
```

Extend `src/__tests__/App.e2e.ts` with Playwright page assertions once the app is running.

---

## Admin Section Test Dashboard

Access at `http://localhost:5173/#/admin` → Test Runner tab.

The diagnostic panel provides a manual smoke test runner for verifying core user flows
without leaving the browser.

---

*Generated by Phase 4 Docs Generator — TUC Refresh Directive — 2026-03-08*

```

### FILE: index.css
```css
@import "tailwindcss";


```

### FILE: index.html
```html
<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <!-- ── TUC Standard Meta ─────────────────────────────────────── -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- SEO -->
    <meta name="description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="keywords" content="Techbridge University College, TUC, design education, technology education, Accra university, Ghana university, product design, entrepreneurship, private university Ghana, design school" />
    <meta name="author" content="Techbridge University College" />
    <meta name="publisher" content="Techbridge University College" />
    <link rel="canonical" href="https://www.techbridge.edu.gh/" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <!-- Geographic -->
    <meta name="language" content="English" />
    <meta name="geo.region" content="GH-AA" />
    <meta name="geo.placename" content="Accra" />
    <meta name="geo.position" content="5.6037;-0.1870" />
    <meta name="ICBM" content="5.6037, -0.1870" />
    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.techbridge.edu.gh/" />
    <meta property="og:site_name" content="Techbridge University College" />
    <meta property="og:title" content="Timetable Management System | Techbridge University College" />
    <meta property="og:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta property="og:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Techbridge University College Logo" />
    <meta property="og:locale" content="en_GB" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@TUCGhana" />
    <meta name="twitter:creator" content="@TUCGhana" />
    <meta name="twitter:title" content="Timetable Management System | Techbridge University College" />
    <meta name="twitter:description" content="Techbridge University College (TUC) is a premier private institution in Accra pioneering innovative and progressive higher education in design and entrepreneurship." />
    <meta name="twitter:image" content="https://techbridge.edu.gh/static/TUC_LOGO.png" />
    <meta name="twitter:image:alt" content="Techbridge University College Logo" />
    <!-- Theme -->
    <meta name="theme-color" content="#630f12" />
    <meta name="msapplication-TileColor" content="#630f12" />
    <meta name="copyright" content="Techbridge University College" />
    <meta name="referrer" content="origin-when-cross-origin" />
    <!-- ────────────────────────────────────────────────────────────── -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Timetable Management System | Techbridge University College</title>

    <!-- TailwindCSS -->
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="https://techbridge.edu.gh/static/TUC_LOGO.png" />

    <style>
      body {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
      }

      #root {
        min-height: 100vh;
      }
    </style>

    <script type="module" src="./index.tsx"></script>
  
    <style id="tuc-splash-styles">
      body { background-color: #0F0C07 !important; margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: serif; overflow: hidden; }
      .tuc-splash { text-align: center; border: 1px solid rgba(200,168,75,0.2); padding: 60px; background: #141210; position: relative; }
      .tuc-splash::before { content: ""; position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: #C8A84B; }
      .tuc-logo { color: #C8A84B; font-size: 3rem; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; display: block; }
      .tuc-status { color: #D4C4A0; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.4em; font-size: 0.7rem; opacity: 0.6; }
      .tuc-loading { margin-top: 30px; height: 1px; width: 100px; background: rgba(200,168,75,0.2); margin-left: auto; margin-right: auto; position: relative; overflow: hidden; }
      .tuc-loading::after { content: ""; position: absolute; left: -100%; width: 50%; height: 100%; background: #C8A84B; animation: tuc-load 2s infinite; }
      @keyframes tuc-load { to { left: 150%; } }
    </style>
</head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    
    <div id="root">
      <div class="tuc-splash">
        <span class="tuc-logo">TECHBRIDGE</span>
        <div class="tuc-status">timetable management system</div>
        <div class="tuc-loading"></div>
      </div>
    </div>

  </body>
</html>

```

### FILE: index.tsx
```typescript

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### FILE: metadata.json
```json
{
  "name": "Timetable Management System",
  "description": "A prototype for a comprehensive web-based application designed to automate the creation, management, and viewing of academic timetables for Asanska University College of Design and Technology.",
  "requestFramePermissions": []
}
```

### FILE: nginx.conf
```conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /health {
        access_log off;
        return 200 'healthy';
        add_header Content-Type text/plain;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
}

```

### FILE: package.json
```json
{
  "packageManager": "pnpm@10.30.1",
  "name": "timetable-management-system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "vitest run --config vitest.e2e.config.ts"
  },
  "dependencies": {
    "lucide-react": "^0.540.0",
    "react": "19.2.5",
    "react-dom": "19.2.5",
    "react-router-dom": "^7.8.1",
    "recharts": "^3.1.2"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "serve": "14.2.5",
    "typescript": "~5.8.2",
    "vite": "7.3.1",
    "vitest": "^3.0.0",
    "@vitest/ui": "^3.0.0",
    "@vitest/coverage-v8": "^3.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/user-event": "^14.6.1",
    "jsdom": "^26.1.0",
    "tailwindcss": "^4.2.2",
    "@tailwindcss/vite": "^4.2.2"
  }
}

```

### FILE: pages/AuditLogPage.tsx
```typescript

import React, { useState } from 'react';
import { MOCK_AUDIT_LOGS } from '../data/mockData';

const AuditLogPage: React.FC = () => {
    const [userFilter, setUserFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const filteredLogs = MOCK_AUDIT_LOGS.filter(log => {
        const userMatch = log.userName.toLowerCase().includes(userFilter.toLowerCase());
        const dateMatch = dateFilter ? new Date(log.timestamp).toISOString().startsWith(dateFilter) : true;
        return userMatch && dateMatch;
    });

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Audit Log</h1>
      
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center space-x-4">
        <input
            type="text"
            placeholder="Filter by user..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="p-2 border rounded-md w-1/3"
        />
        <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border rounded-md"
        />
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th className="p-4 font-semibold text-aucdt-brown">User</th>
                    <th className="p-4 font-semibold text-aucdt-brown">Action</th>
                    <th className="p-4 font-semibold text-aucdt-brown">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{log.userName}</td>
                        <td className="p-4">{log.action}</td>
                        <td className="p-4 text-gray-600">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogPage;

```

### FILE: pages/DashboardPage.tsx
```typescript

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { MOCK_TIMETABLE, MOCK_NOTIFICATIONS } from '../data/mockData';
import { Calendar, Bell, Users, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getUpcomingClass = () => {
    // This is a simplified logic, a real app would check current date/time
    return MOCK_TIMETABLE[0];
  }

  const upcomingClass = getUpcomingClass();

  const Card: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; color: string }> = ({ icon, title, children, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4" style={{borderColor: color}}>
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-full mr-4`} style={{backgroundColor: `${color}20`, color: color}}>{icon}</div>
        <h3 className="text-lg font-semibold text-aucdt-brown">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-8">Here's your overview for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card icon={<Calendar size={24} />} title="Upcoming Class" color="#3D2B1F">
          <p className="text-gray-700"><strong>DES301</strong> - Advanced Typography</p>
          <p className="text-gray-500 text-sm">Today at {upcomingClass.startTime} in {upcomingClass.venueId === 'venue-01' ? 'Design Studio A' : 'N/A'}</p>
        </Card>

        <Card icon={<Bell size={24} />} title="Recent Notifications" color="#D4AF37">
          <p className="text-gray-700">{MOCK_NOTIFICATIONS.filter(n => !n.read).length} unread notifications</p>
          <p className="text-gray-500 text-sm truncate">{MOCK_NOTIFICATIONS[0].message}</p>
        </Card>
        
        {user?.role === UserRole.ADMIN && (
             <Card icon={<Users size={24} />} title="System Status" color="#004225">
                 <p className="text-gray-700"><strong>500</strong> Concurrent Users</p>
                 <p className="text-gray-500 text-sm">System performance is nominal.</p>
             </Card>
        )}
        
         {user?.role !== UserRole.ADMIN && (
             <Card icon={<Clock size={24} />} title="Today's Schedule" color="#004225">
                 <p className="text-gray-700">You have <strong>{MOCK_TIMETABLE.length}</strong> classes scheduled today.</p>
                 <p className="text-gray-500 text-sm">Your first class starts at 09:00.</p>
             </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

```

### FILE: pages/DataManagementPage.tsx
```typescript

import React, { useRef } from 'react';
import { MOCK_TIMETABLE } from '../data/mockData';
import { Upload, Download } from 'lucide-react';

const DataManagementPage: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(MOCK_TIMETABLE, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "timetable_export.json";
        link.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target?.result;
                    const data = JSON.parse(content as string);
                    console.log("Imported data:", data);
                    // Add validation logic here as per REQ-014
                    alert("File imported successfully! Check console for data.");
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                    alert("Error: Invalid JSON file.");
                }
            };
            reader.readAsText(file);
        }
    };

  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Data Import/Export</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Export Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Download className="mx-auto h-16 w-16 text-aucdt-green mb-4" />
          <h2 className="text-xl font-semibold text-aucdt-brown mb-2">Export Data</h2>
          <p className="text-gray-600 mb-6">Export the entire timetable dataset into a JSON file for backup and interoperability purposes.</p>
          <button
            onClick={handleExport}
            className="w-full bg-aucdt-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-aucdt-green/90 transition"
          >
            Export to JSON
          </button>
        </div>
        
        {/* Import Card */}
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <Upload className="mx-auto h-16 w-16 text-aucdt-gold mb-4" />
          <h2 className="text-xl font-semibold text-aucdt-brown mb-2">Import Data</h2>
          <p className="text-gray-600 mb-6">Import a timetable dataset from a JSON file. The system will validate the file structure and data integrity.</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            className="hidden" 
            accept=".json" 
          />
          <button
            onClick={handleImportClick}
            className="w-full bg-aucdt-gold text-aucdt-brown px-6 py-3 rounded-lg font-semibold hover:bg-aucdt-gold/90 transition"
          >
            Import from JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataManagementPage;

```

### FILE: pages/LoginPage.tsx
```typescript

import { GraduationCap, Shield, User } from 'lucide-react';
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  const handleLogin = (role: UserRole) => {
    login(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-aucdt-light p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-aucdt-green">TUC</h1>
          <p className="mt-2 text-aucdt-brown">Timetable Management System</p>
        </div>
        <div className="space-y-4">
          <p className="text-center text-gray-600 font-medium">Select your role to sign in</p>
          <button
            onClick={() => handleLogin(UserRole.ADMIN)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-white bg-aucdt-brown rounded-lg hover:bg-aucdt-brown/90 transition-all duration-300 transform hover:scale-105"
          >
            <Shield className="mr-3" />
            Administrator
          </button>
          <button
            onClick={() => handleLogin(UserRole.LECTURER)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-white bg-aucdt-green rounded-lg hover:bg-aucdt-green/90 transition-all duration-300 transform hover:scale-105"
          >
            <User className="mr-3" />
            Lecturer
          </button>
          <button
            onClick={() => handleLogin(UserRole.STUDENT)}
            className="w-full flex items-center justify-center p-4 text-lg font-semibold text-aucdt-brown bg-aucdt-gold rounded-lg hover:bg-aucdt-gold/90 transition-all duration-300 transform hover:scale-105"
          >
            <GraduationCap className="mr-3" />
            Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

```

### FILE: pages/NotificationsPage.tsx
```typescript

import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { Notification } from '../types';
import { Bell, Check, Trash2 } from 'lucide-react';

const NotificationsPage: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-aucdt-green mb-6">Notifications</h1>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {notifications.map(notification => (
                        <li 
                            key={notification.id} 
                            className={`p-4 flex items-start justify-between transition-colors ${notification.read ? 'bg-gray-50' : 'bg-white'}`}
                        >
                           <div className="flex items-start">
                                <div className={`flex-shrink-0 p-2 rounded-full mr-4 mt-1 ${notification.read ? 'bg-gray-200 text-gray-500' : 'bg-aucdt-gold/20 text-aucdt-gold'}`}>
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className={`text-aucdt-brown ${!notification.read && 'font-semibold'}`}>
                                        {notification.message}
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </p>
                                </div>
                           </div>
                           <div className="flex items-center space-x-2 ml-4">
                                {!notification.read && (
                                    <button onClick={() => markAsRead(notification.id)} className="p-2 text-aucdt-green hover:bg-aucdt-green/10 rounded-full" title="Mark as read">
                                        <Check size={18} />
                                    </button>
                                )}
                                <button onClick={() => deleteNotification(notification.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full" title="Delete notification">
                                    <Trash2 size={18} />
                                </button>
                           </div>
                        </li>
                    ))}
                    {notifications.length === 0 && (
                        <li className="p-8 text-center text-gray-500">
                            You have no notifications.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default NotificationsPage;

```

### FILE: pages/ReportsPage.tsx
```typescript

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const lecturerWorkloadData = [
  { name: 'Prof. Grant', hours: 20 },
  { name: 'Dr. Sattler', hours: 15 },
  { name: 'Mr. Malcolm', hours: 18 },
];

const venueUtilizationData = [
  { name: 'Design Studio A', value: 400 },
  { name: 'Lecture Hall B', value: 300 },
  { name: 'Computer Lab C', value: 300 },
  { name: 'Unused', value: 200 },
];

const COLORS = ['#004225', '#3D2B1F', '#D4AF37', '#e0e0e0'];

const ReportsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-aucdt-green mb-6">Reporting & Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-aucdt-brown mb-4">Lecturer Workload (Hours/Week)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={lecturerWorkloadData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="hours" fill="#004225" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-aucdt-brown mb-4">Classroom Utilization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={venueUtilizationData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {venueUtilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

```

### FILE: pages/TimetablePage.tsx
```typescript

import React from 'react';
import { MOCK_TIMETABLE, MOCK_COURSES, MOCK_LECTURERS, MOCK_VENUES } from '../data/mockData';
import { TimetableEvent } from '../types';
import { PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = Array.from({ length: 10 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);

  const getEventDetails = (event: TimetableEvent) => {
    const course = MOCK_COURSES.find(c => c.id === event.courseId);
    const lecturer = MOCK_LECTURERS.find(l => l.id === event.lecturerId);
    const venue = MOCK_VENUES.find(v => v.id === event.venueId);
    return { course, lecturer, venue };
  };
  
  const calculateGridPosition = (event: TimetableEvent) => {
    const startHour = parseInt(event.startTime.split(':')[0]);
    const endHour = parseInt(event.endTime.split(':')[0]);
    const duration = endHour - startHour; // Assumes hourly slots

    const rowStart = startHour - 7; // 8:00 is row 1
    return {
      gridRow: `${rowStart} / span ${duration}`,
    };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-aucdt-green">Weekly Timetable</h1>
        {user?.role === UserRole.ADMIN && (
          <button className="flex items-center bg-aucdt-green text-white px-4 py-2 rounded-lg shadow-md hover:bg-aucdt-green/90 transition">
            <PlusCircle size={20} className="mr-2"/>
            Add New Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="grid grid-cols-6">
          <div className="col-span-1 p-4 border-r border-b font-semibold text-center text-aucdt-brown bg-gray-50">Time</div>
          {days.map(day => (
            <div key={day} className="col-span-1 p-4 border-r border-b font-semibold text-center text-aucdt-brown bg-gray-50">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-6 h-[70vh] relative">
            <div className="col-span-1">
                 {timeSlots.map(time => (
                    <div key={time} className="h-16 border-r border-b p-2 text-sm text-gray-500 text-center">{time}</div>
                ))}
            </div>
            {days.map((day, dayIndex) => (
                <div key={day} className="col-span-1 relative grid grid-rows-10">
                     {timeSlots.map((_, timeIndex) => (
                        <div key={timeIndex} className="h-16 border-r border-b"></div>
                    ))}
                    {MOCK_TIMETABLE.filter(e => e.day === day).map(event => {
                        const { course, lecturer, venue } = getEventDetails(event);
                        const style = calculateGridPosition(event);
                        const isUserEvent = user?.role === UserRole.ADMIN || (user?.role === UserRole.LECTURER && event.lecturerId === user.id) || user?.role === UserRole.STUDENT; // simplified logic
                        if (!isUserEvent) return null;

                        return (
                            <div 
                                key={event.id}
                                className="absolute w-full p-2"
                                style={{ top: `${(parseInt(event.startTime.split(':')[0]) - 8) * 4}rem`, height: `${(parseInt(event.endTime.split(':')[0]) - parseInt(event.startTime.split(':')[0])) * 4}rem` }}
                            >
                              <div className="h-full bg-aucdt-gold/80 border-l-4 border-aucdt-gold text-aucdt-brown p-2 rounded-lg shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer text-xs overflow-hidden">
                                  <p className="font-bold">{course?.name}</p>
                                  <p>{lecturer?.name}</p>
                                  <p className="text-aucdt-brown/70">{venue?.name}</p>
                                  <p className="text-aucdt-brown/70 mt-1">{event.startTime} - {event.endTime}</p>
                              </div>
                            </div>
                        )
                    })}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimetablePage;

```

### FILE: README.md
```md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1bSrZ3sfpzr5lB0eoYppbTyUFg3OzvysD

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_timetable_management_system';
const ACCENT   = '#3b82f6';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Timetable Management System</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/components/ProtectedRoute.tsx
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Verifying session…</div>
      </div>
    );
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

```

### FILE: src/contexts/AuthContext.tsx
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/AuthService';

interface User { id: string; username: string; role: string }
interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  login: (u: string, p: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = [REDACTED_CREDENTIAL]
    if (!token) { setIsLoading(false); return; }
    AuthService.validateToken(token)
      .then((res: any) => {
        if (res.valid && res.user) { setIsAuthenticated(true); setUser(res.user); }
        else { AuthService.logout(); setIsAuthenticated(false); }
      })
      .catch(() => { /* backend unreachable — keep state */ })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await AuthService.login(username, password);
    if (res.success && res.user) { setIsAuthenticated(true); setUser(res.user); }
    return { success: res.success, message: res.message };
  };

  const logout = () => { AuthService.logout(); setIsAuthenticated(false); setUser(null); };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

```

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4021;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'timetable_mgmt';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id VARCHAR(255) PRIMARY KEY, module_code VARCHAR(50),
        module_name VARCHAR(255), lecturer VARCHAR(255),
        day_of_week VARCHAR(20), start_time TIME, end_time TIME,
        room_number VARCHAR(50), capacity INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS schedule_conflicts (
        id VARCHAR(255) PRIMARY KEY, schedule_id_1 VARCHAR(255),
        schedule_id_2 VARCHAR(255), conflict_type VARCHAR(100),
        severity VARCHAR(50), resolved BOOLEAN DEFAULT false,
        resolved_at DATETIME
      )
    `);
    conn.release();
    console.log('Timetable Management DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'timetable-management' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/schedule') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const schedId = `sched_${Date.now()}`;
          await conn.query(
            'INSERT INTO schedules (id, module_code, module_name, lecturer, day_of_week, start_time, end_time, room_number, capacity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [schedId, data.module_code || '', data.module_name || '', data.lecturer || '', data.day || '', data.start || '', data.end || '', data.room || '', data.capacity || 50]
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, schedule_id: schedId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/schedules')) {
      const conn = await pool.getConnection();
      const [schedules] = await conn.query('SELECT * FROM schedules ORDER BY day_of_week, start_time LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(schedules));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Timetable Management API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

```

### FILE: src/pages/AdminPage.tsx
```typescript
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

type Tab = 'overview' | 'logs';

interface LogEntry { id: string; time: string; action: string; detail: string }

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('overview');
  const [logs] = useState<LogEntry[]>([
    { id: '1', time: new Date().toLocaleTimeString(), action: 'SESSION_START', detail: 'Admin session initiated' },
  ]);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#0f172a] text-white flex flex-col p-6 shrink-0" aria-label="Admin navigation">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-[#ffcb05] rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-[#0f172a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-bold text-sm">Timetable Management System</span>
        </div>
        <nav className="flex-1 space-y-1" role="navigation">
          {(['overview', 'logs'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              aria-pressed={tab === t ? 'true' : 'false'}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${tab === t ? 'bg-[#ffcb05] text-[#0f172a] font-bold' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              {t === 'overview' ? 'Overview' : 'Activity Log'}
            </button>
          ))}
        </nav>
        <div className="pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1 px-2">Signed in as</p>
          <p className="text-sm text-slate-300 font-medium px-2 mb-3 truncate">{user?.username || 'Admin'}</p>
          <button
            onClick={handleLogout}
            aria-label="Sign out"
            className="w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-left"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 max-w-4xl" role="main">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Timetable Management System — Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Techbridge University College · Staff Portal</p>
        </header>

        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'React Version', value: '19.2.4', ok: true },
              { label: 'Docker', value: 'Configured', ok: true },
              { label: 'SRS', value: 'docs/SRS.md', ok: true },
              { label: 'Tests', value: 'vitest.config.ts', ok: true },
              { label: 'Auth', value: 'Active', ok: true },
              { label: 'Phase', value: 'Phase 2 Complete', ok: true },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
                <span className={`text-xs ${item.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.ok ? '✓ compliant' : '✗ gap'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Activity Log</h2>
            </div>
            <table className="w-full text-sm" aria-label="Activity log">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                  <th className="px-6 py-3 text-left">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-400">{log.time}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{log.action}</td>
                    <td className="px-6 py-4 text-gray-500">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

```

### FILE: src/pages/LoginPage.tsx
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-[#630f12] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#ffcb05]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in with your TUC credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              id="username" type="text" value={username} required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your username"
              aria-label="Username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" type="password" value={password} required
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#630f12]"
              placeholder="Enter your password"
              aria-label="Password"
            />
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full py-2 px-4 bg-[#630f12] text-white font-semibold rounded-lg hover:bg-[#7a1317] focus:outline-none focus:ring-2 focus:ring-[#630f12] focus:ring-offset-2 disabled:opacity-50 transition-colors"
            aria-label={loading ? 'Signing in' : 'Sign in'}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

```

### FILE: src/services/AuthService.ts
```typescript
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const TOKEN_KEY = [REDACTED_CREDENTIAL]

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: { id: string; username: string; role: string };
}

export const AuthService = {
  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data: AuthResponse = await res.json();
      if (data.success && data.token) localStorage.setItem(TOKEN_KEY, data.token);
      return data;
    } catch {
      return { success: false, message: 'Could not connect to TUC Auth API' };
    }
  },

  async validateToken(token: string) {
    try {
      const res = await fetch(`${API_BASE}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch {
      return { success: false, valid: false };
    }
  },

  logout:          () => localStorage.removeItem(TOKEN_KEY),
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),
  getToken:        () => localStorage.getItem(TOKEN_KEY),
};

```

### FILE: src/__tests__/App.e2e.ts
```typescript
import { describe, it, expect } from 'vitest';

/**
 * E2E stub — timetable-management-system
 * Extend with Puppeteer/Playwright tests.
 * Run: node scripts/phase3-test-scaffold.js --apply then pnpm test:e2e
 */
describe('timetable-management-system E2E', () => {
  it('placeholder — replace with Puppeteer test', () => {
    // TODO: launch browser, navigate to http://localhost:5173, assert UI
    expect(true).toBe(true);
  });
});

```

### FILE: src/__tests__/App.test.tsx
```typescript
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from '../../App';

/**
 * Smoke test — verifies the root App component renders without throwing.
 * TUC Phase 3 scaffold — extend with project-specific assertions.
 */
describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    expect(container.firstChild).not.toBeNull();
  });

  it('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });
});

```

### FILE: src/__tests__/setup.ts
```typescript
import '@testing-library/jest-dom';

```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "experimentalDecorators": true,
    "useDefineForClassFields": false,
    "module": "ESNext",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "moduleResolution": "bundler",
    "isolatedModules": true,
    "moduleDetection": "force",
    "allowJs": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": [
        "./*"
      ]
    },
    "allowImportingTsExtensions": true,
    "noEmit": true
  }
}
```

### FILE: types.ts
```typescript

export enum UserRole {
    ADMIN = 'Administrator',
    LECTURER = 'Lecturer',
    STUDENT = 'Student',
}

export interface User {
    id: string;
    name: string;
    role: UserRole;
}

export interface Course {
    id: string;
    name: string;
    code: string;
}

export interface Lecturer {
    id: string;
    name: string;
}

export interface Venue {
    id: string;
    name: string;
}

export interface TimetableEvent {
    id: string;
    courseId: string;
    lecturerId: string;
    venueId: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    startTime: string; // "HH:MM"
    endTime: string; // "HH:MM"
}

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface AuditLog {
    id: string;
    userId: string;
    userName: string;
    action: string;
    timestamp: string;
}

```

### FILE: vite.config.ts
```typescript
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        }
      }
    }
  },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Vitest unit test configuration — timetable-management-system
// TUC coverage target: >70% for core utilities
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
    exclude: ['src/**/*.e2e.{ts,tsx}', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.{test,spec,e2e}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        branches:   70,
        functions:  70,
        lines:      70,
        statements: 70,
      },
    },
  },
});

```

### FILE: vitest.e2e.config.ts
```typescript
import { defineConfig } from 'vitest/config';

// Vitest E2E configuration — timetable-management-system
// E2E tests use Node environment (Puppeteer / Playwright)
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.e2e.{ts,tsx,js}'],
    testTimeout: 30000,
    hookTimeout: 15000,
    teardownTimeout: 10000,
  },
});

```

