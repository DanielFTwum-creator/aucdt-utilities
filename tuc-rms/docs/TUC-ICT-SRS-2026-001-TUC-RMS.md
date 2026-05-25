# Software Requirements Specification
## TUC Results Management System (RMS) v2.1

**Document ID:** TUC-ICT-SRS-2026-001  
**Status:** READY FOR PRODUCTION DEPLOYMENT  
**Version:** 2.1  
**Date:** May 25, 2026  
**Owner:** Daniel Frempong Twum, Head of ICT, Techbridge University College  
**Institution:** Techbridge University College, Oyibi, Greater Accra, Ghana  

---

## 1. INTRODUCTION

### 1.1 Purpose

This document specifies the complete functional and non-functional requirements for the **TUC Results Management System (RMS) v2.1**, an academic results tracking and lifecycle management platform for Techbridge University College (TUC).

The RMS provides end-to-end results workflows from data entry through approval, transcripts, and reporting. It supports role-based access control (RBAC) for Registrars, QA Officers, Lecturers, and Heads of Department (HODs).

### 1.2 Scope

**In Scope:**
- Centralised MySQL database for students, courses, results, and audit trails
- Express.js REST API with JWT authentication
- React frontend with role-based UI rendering
- Student review/case management system
- Course management (CRUD operations)
- Results entry, submission, and approval workflows
- Transcript generation
- Class and departmental reports
- Audit logging of all administrative actions
- User management and password management

**Out of Scope (Future Phases):**
- Mobile-first optimisations (Capacitor deployment)
- Advanced analytics engine
- Integration with external systems (SIS, finance)
- Real-time WebSocket notifications
- Document management system for student records

### 1.3 Document Overview

| Section | Purpose |
|---------|---------|
| 2. System Architecture | High-level design and deployment topology |
| 3. Functional Requirements | Feature specification by user role |
| 4. Non-Functional Requirements | Performance, security, scalability targets |
| 5. Database Schema | Entity relationships and data model |
| 6. API Specification | REST endpoints and contract definitions |
| 7. UI/UX Flows | Page routes and user journeys |
| 8. Security & Compliance | Authentication, encryption, audit logging |
| 9. Deployment Configuration | Environment variables, installation, operations |
| 10. Acceptance Criteria | Testing strategy and sign-off checklist |

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2.5 |
| **Build Tool** | Vite | 8.0.10 |
| **Backend** | Node.js / Express | 5.2.1 |
| **Database** | MySQL / MariaDB | 5.7+ |
| **Authentication** | JWT (jsonwebtoken) | 9.0.3 |
| **Password Hashing** | bcryptjs | 3.0.3 |
| **API Validation** | express-validator | 7.3.2 |
| **CORS** | cors | 2.8.6 |
| **Environment** | dotenv | 17.4.2 |

### 2.2 Deployment Topology

```
┌─────────────────────────────────────────────────────────────┐
│  Plesk / Apache (Ubuntu 20.04 LTS) — 66.226.72.199        │
└─────────────────────────────────────────────────────────────┘
              ↓                                  ↓
┌──────────────────────────────┐    ┌──────────────────────────┐
│  Frontend (React + Vite)     │    │  Backend (Node.js/PM2)   │
│  /tuc-rms/                   │    │  Port: 5000 (proxied)    │
│  - dist/ (Vite build output) │    │ /api/* routes            │
│  - index.html (SPA)          │    │                          │
│  - .htaccess (routing)       │    │ Express.js server        │
│  - Static assets             │    │ JWT middleware           │
└──────────────────────────────┘    └──────────────────────────┘
              ↓                                  ↓
┌─────────────────────────────────────────────────────────────┐
│  MySQL Database (localhost or remote)                       │
│  Database: tuc_rms                                          │
│  Tables: users, students, courses, results, reviews, etc.   │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 Application Layers

**Frontend (React/Vite):**
- Static SPA served by Apache via .htaccess SPA routing
- Role-based conditional rendering (AuthContext)
- localStorage for theme, sessionStorage for auth token
- All API calls to backend `/api/*` endpoints

**Backend (Express.js):**
- 8 route modules: auth, users, students, courses, results, reports, dashboard, middleware
- JWT middleware for authentication
- Request validation via express-validator
- CORS configured for frontend domain
- Direct MySQL pool connections

**Database (MySQL):**
- Normalised schema with 12+ tables
- Foreign key relationships enforced
- Audit logging on critical operations
- Indexes on frequently queried columns

---

## 3. FUNCTIONAL REQUIREMENTS

### 3.1 User Roles & Permissions

| Role | Login | View Students | Enter Scores | Approve Results | Manage Courses | Manage Users | Manage Reviews |
|------|-------|--------------|--------------|-----------------|----------------|--------------|-----------------|
| **Registrar** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **QA Officer** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **Lecturer** | ✅ | ❌ (own courses) | ✅ | ❌ | ❌ (view only) | ❌ | ❌ |
| **HOD** | ✅ | ❌ (department) | ✅ | ❌ | ❌ (view only) | ❌ | ❌ |

### 3.2 Authentication (FR-AUTH)

**FR-AUTH-001: User Login**
- Users log in with email + password
- System validates credentials against `users` table
- Password stored as bcrypt hash (10 rounds)
- On success, JWT issued with 12-hour expiry
- Login event logged to `audit_log` table

**FR-AUTH-002: Session Management**
- JWT token stored in frontend localStorage
- Token included in all API requests (Authorization header)
- Expired token triggers logout + redirect to login page
- Logout clears token and sessionStorage

**FR-AUTH-003: Password Management**
- Users can change password via /change-password endpoint
- Current password verified before allowing change
- New password must be ≥6 characters
- Change logged to audit_log

### 3.3 Students Management (FR-STU)

**FR-STU-001: View All Students**
- Registrar and QA can view paginated list of all students
- Filterable by programme, department, enrolment status
- Searchable by student ID, full name, email
- Displays: ID, Name, Email, Programme, Department, Level

**FR-STU-002: Student Details**
- Click student row → modal with full profile
- Shows: contact info, programme, enrolment date, academic standing
- Related data: enrolled courses, results, reviews history

**FR-STU-003: Student Reviews (Case Management)**
- Registrar/QA can create review case for any student
- Review workflow: Open → In Progress → Resolved → Closed
- Categories: Academic Standing, Enrollment Issue, Grade Dispute, Documents, General
- Priority levels: Low, Medium, High, Critical
- Can add resolution notes and update status/priority
- History tab shows all past reviews for student

**FR-STU-004: Add/Edit/Delete Students**
- Registrar only
- Required fields: full name, email, student ID, programme, department, level
- Validates unique email + student ID
- Edit preserves created_at, updates updated_at
- Delete is soft delete (sets is_active = 0)

### 3.4 Courses Management (FR-COU)

**FR-COU-001: View Courses**
- Registrar/QA view all courses with department, programme, semester, level
- Lecturer views only assigned courses
- Filterable by department, programme, level, semester
- Searchable by course code + course name

**FR-COU-002: Add/Edit/Delete Courses**
- Registrar only
- Required fields: course code, course name, department, programme, level, semester, credit hours
- Validates unique course code per semester
- Edit preserves created_at timestamp
- Delete is soft delete (is_active = 0)

**FR-COU-003: Enrol Students in Courses**
- Registrar bulk-enrolls students via API
- Enrolled students appear in "Enter Scores" page for Lecturer
- Can unenrol students (soft delete from course_students)

### 3.5 Results Entry & Approval (FR-RES)

**FR-RES-001: Enter Scores**
- Lecturer enters marks for enrolled students in assigned course
- Fields: student ID, mark (0–100), grade (auto-calculated), comment
- Validates: 0 ≤ mark ≤ 100
- Draft saved to `results` table with status='DRAFT'
- Only Lecturer can view/edit their own entries

**FR-RES-002: Submit for Approval**
- Lecturer submits completed course scores
- Changes status from DRAFT → SUBMITTED
- Notifies QA Officer via audit log
- Submitted scores locked from further editing by Lecturer

**FR-RES-003: Approve Results**
- QA Officer reviews submitted results
- Can approve (status → APPROVED) or reject (status → REJECTED)
- Reject returns to Lecturer with comment
- Approved results frozen and cannot be edited
- Approval event logged with QA Officer name

**FR-RES-004: Grade Calculation**
- Automatic based on mark:
  - 70–100: A, 60–69: B, 50–59: C, 40–49: D, <40: F
- Grade point calculated based on institutional scale
- GPA computed as: (Σ(grade_point × credit_hours)) / Σ(credit_hours)

### 3.6 Transcripts & Reports (FR-REP)

**FR-REP-001: Student Transcript**
- Registrar/QA generates transcript for any student
- Shows: all courses, marks, grades, GPA
- Downloadable as PDF with TUC letterhead
- Marks academic standing (Good Standing, Academic Probation, etc.)

**FR-REP-002: Class Reports**
- By course: average mark, pass/fail distribution, grade breakdown
- By department: summary statistics
- Exportable to Excel
- Only approved results included

**FR-REP-003: Dashboard Summary**
- Shows: total students, courses this semester, pending approvals, recent activities
- Quick links to high-priority workflows
- Real-time counts (no cached data >5 minutes old)

### 3.7 User Management (FR-USR)

**FR-USR-001: View Users**
- Registrar only
- List all users with role, email, department, staff ID, status
- Filterable by role, department

**FR-USR-002: Add/Edit/Delete Users**
- Registrar creates new users with email, password, role, department
- Initial password generated securely (random 12 chars)
- User must change password on first login (future enhancement)
- Registrar can reset password for any user
- Registrar can deactivate users (is_active = 0)

### 3.8 Audit Logging (FR-AUD)

**FR-AUD-001: Audit Trail**
- Every login, password change, result approval, course modification logged
- Entries include: user ID, action type, timestamp, details, IP address (future)
- Registrar can view full audit log
- Audit table never deleted (retention policy: 7 years minimum)

---

## 4. NON-FUNCTIONAL REQUIREMENTS

### 4.1 Performance (NFR-PERF)

| Requirement | Target |
|-------------|--------|
| Page load time | <2 seconds (cached) |
| API response time (avg) | <500ms |
| Database query time | <100ms (with indexes) |
| Concurrent users | 100+ simultaneous |
| Uptime target | 99.5% (monthly) |
| Session timeout | 12 hours (inactivity after 30 min logs out) |

### 4.2 Security (NFR-SEC)

**Authentication & Authorisation:**
- ✅ JWT tokens with 12-hour expiry
- ✅ Passwords hashed with bcrypt (cost factor 10)
- ✅ Role-based access control (RBAC) enforced at API level
- ✅ No credentials stored in frontend code or localStorage

**Data Protection:**
- ✅ All API calls over HTTPS only (enforced by .htaccess)
- ✅ Database connections from backend only (no direct frontend DB access)
- ✅ Input validation on all API endpoints (express-validator)
- ✅ SQL injection prevention via parameterised queries
- ✅ CORS restricted to approved frontend domain

**Audit & Compliance:**
- ✅ All administrative actions logged to audit_log table
- ✅ User identity captured for every action
- ✅ Timestamps preserved with UTC timezone
- ✅ Deletion is soft-delete (data retained for audit)

### 4.3 Availability (NFR-AVL)

- System available 24/7 except scheduled maintenance windows (notified 7 days prior)
- Automated health checks every 5 minutes
- Error pages with contact information for support

### 4.4 Scalability (NFR-SCA)

- Backend horizontally scalable (stateless Node.js services)
- Database connection pooling (max 10 connections per instance)
- Frontend static assets cacheable by browser (1-year cache for versioned assets)
- Database read replicas supported (future phase)

### 4.5 Usability (NFR-USE)

- Responsive design (desktop, tablet, mobile)
- Consistent navigation and layout across all pages
- Keyboard-accessible forms and buttons (a11y)
- Loading states and error messages user-friendly
- Dark/Light theme toggle (future phase)

### 4.6 Maintainability (NFR-MAIN)

- Code documented with JSDoc comments
- API endpoints documented in README
- Database schema documented
- Configuration via environment variables (no hardcoded secrets)
- Deployment scripts version-controlled

---

## 5. DATABASE SCHEMA

### 5.1 Core Tables

**users**
```sql
id (PK), email (UNIQUE), password_hash, full_name, role, department, 
staff_id, is_active, created_at, updated_at
```

**students**
```sql
id (PK), student_id (UNIQUE), full_name, email, programme, department, 
level, enrolment_date, is_active, created_at, updated_at
```

**courses**
```sql
id (PK), course_code (UNIQUE), course_name, department, programme, level, 
semester, credit_hours, is_active, created_at, updated_at
```

**course_students**
```sql
id (PK), course_id (FK), student_id (FK), enrolment_date, is_active
```

**results**
```sql
id (PK), course_id (FK), student_id (FK), lecturer_id (FK), mark (0-100), 
grade, grade_point, comment, status (DRAFT/SUBMITTED/APPROVED/REJECTED), 
created_at, updated_at
```

**student_reviews**
```sql
id (PK), student_id (FK), category, priority, description, status 
(OPEN/IN_PROGRESS/RESOLVED/CLOSED), resolution_notes, created_by (FK), 
created_at, updated_at
```

**audit_log**
```sql
id (PK), user_id (FK), action, details, created_at
```

### 5.2 Indexes

- `users(email)` — for login lookup
- `students(student_id, email)` — for search
- `courses(course_code)` — for course lookup
- `results(student_id, course_id, status)` — for result queries
- `audit_log(user_id, created_at)` — for audit trail queries

---

## 6. API SPECIFICATION

### 6.1 Authentication Endpoints

```
POST   /api/auth/login
  Body: { email, password }
  Returns: { token, user }
  
GET    /api/auth/me
  Header: Authorization: Bearer {token}
  Returns: { user }
  
POST   /api/auth/change-password
  Body: { current_password, new_password }
  Returns: { message: "Password changed successfully" }
```

### 6.2 Students Endpoints

```
GET    /api/students?skip=0&limit=20&search=name&programme=BSc
  Returns: { students: [], total }
  
GET    /api/students/:id
  Returns: { student, courses, reviews, gpa }
  
POST   /api/students
  Body: { full_name, email, student_id, programme, department, level }
  Returns: { id, student }
  
PUT    /api/students/:id
  Body: { full_name, email, programme, ... }
  Returns: { message, student }
  
GET    /api/students/:id/reviews
  Returns: { reviews: [] }
  
POST   /api/students/:id/reviews
  Body: { category, priority, description }
  Returns: { id, review }
  
PUT    /api/students/:studentId/reviews/:reviewId
  Body: { status, priority, resolution_notes }
  Returns: { message, review }
```

### 6.3 Courses Endpoints

```
GET    /api/courses?department=ICT&level=100
  Returns: { courses: [], total }
  
POST   /api/courses
  Body: { course_code, course_name, department, programme, level, semester, credit_hours }
  Returns: { id, course }
  
PUT    /api/courses/:id
  Body: { ... same fields ... }
  Returns: { message, course }
  
DELETE /api/courses/:id
  Returns: { message: "Course deleted" }
```

### 6.4 Results Endpoints

```
POST   /api/results/enter-scores
  Body: { courseId, scores: [{ studentId, mark, comment }, ...] }
  Returns: { message, count }
  
POST   /api/results/submit/:courseId
  Returns: { message, courseId }
  
POST   /api/results/approve/:courseId
  Body: { approved: true/false, comment }
  Returns: { message, courseId }
```

---

## 7. USER INTERFACES

### 7.1 Page Routes

| Route | Component | Users | Purpose |
|-------|-----------|-------|---------|
| `/login` | LoginView | Public | Authentication |
| `/dashboard` | Dashboard | All authenticated | Home page |
| `/students` | StudentsPage | Registrar, QA | Student list + reviews |
| `/courses` | CoursesPage | All | Course list (view/edit) |
| `/courses/:id/enter-scores` | EnterScoresPage | Lecturer, Registrar | Score entry form |
| `/approve-results` | ApproveResultsPage | Registrar, QA | Results approval workflow |
| `/transcripts` | TranscriptsPage | Registrar, QA | Student transcript generation |
| `/reports` | ReportsPage | Registrar, QA | Analytics & exports |
| `/users` | UsersPage | Registrar | User management |
| `/audit-log` | AuditLogPage | Registrar | Audit trail viewer |
| `/change-password` | ChangePasswordPage | All | Password change form |

### 7.2 Key UI Components

- **AuthContext** — Manages login state, JWT token, user profile
- **ProtectedRoute** — Enforces role-based access control (redirects to login if unauthorised)
- **StudentModal** — Displays full student profile + reviews in modal
- **ReviewForm** — Modal for creating/updating student reviews
- **ScoresTable** — Editable table for entering marks
- **LoadingSpinner** — Animated loader for async operations

---

## 8. SECURITY & COMPLIANCE

### 8.1 Authentication Flow

```
1. User enters email + password on /login
2. Frontend POST to /api/auth/login
3. Backend validates: email exists, password matches hash
4. Backend generates JWT (exp: 12h)
5. Frontend stores JWT in localStorage
6. All subsequent API calls include: Authorization: Bearer {jwt}
7. Backend verifies JWT via auth middleware
8. If expired/invalid → return 401 → frontend redirects to /login
```

### 8.2 Secrets Management

- All secrets in `.env` file (never committed to Git)
- Template: `.env.template` committed with placeholder values
- Secrets: DB_PASS, JWT_SECRET, API keys (future phases)

### 8.3 HTTPS & Transport Security

- All traffic over HTTPS (enforced by Apache at front end)
- HSTS headers set (max-age=31536000)
- Cookies (JWT in future phases) set with HttpOnly, Secure, SameSite flags

### 8.4 Data Privacy

- No student personal data logged in audit trails (only IDs and actions)
- Database backups encrypted at rest
- Retention policy: audit logs kept 7 years minimum

---

## 9. DEPLOYMENT CONFIGURATION

### 9.1 Environment Variables

**Backend (.env)**
```
DB_HOST=localhost
DB_USER=root
DB_PASS=secure_password_here
DB_NAME=tuc_rms
JWT_SECRET=tuc_rms_secret_key_min_32_chars
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://ai-tools.techbridge.edu.gh/tuc-rms
```

**Frontend (.env.local)**
```
VITE_API_URL=https://api.techbridge.edu.gh/tuc-rms
VITE_APP_NAME=TUC Results Management System
```

### 9.2 Installation & Setup

**Database:**
```bash
mysql -u root -p < backend/database.sql
```

**Backend:**
```bash
cd backend
npm install
npm start  # or via PM2: pm2 start server.js --name tuc-rms-api
```

**Frontend:**
```bash
cd frontend
npm install
npm run build
# dist/ folder deployed to Plesk via .htaccess SPA routing
```

### 9.3 Production Checklist

- [ ] MySQL database created with seed data
- [ ] .env variables populated with production secrets
- [ ] Backend running on port 5000 (proxied via Nginx/Apache)
- [ ] Frontend dist/ deployed to Plesk with .htaccess
- [ ] SSL certificate installed (HTTPS)
- [ ] Health check endpoint responding: GET /api/health
- [ ] Database backups scheduled (daily, 7-day retention)
- [ ] Monitoring set up (error logs, uptime checks)
- [ ] Audit logs backing up separately
- [ ] User accounts created for all staff
- [ ] Default passwords changed by all users
- [ ] Load tests passed (100+ concurrent users)

---

## 10. ACCEPTANCE CRITERIA

### 10.1 Functional Testing

- [ ] All 8 user roles can log in with correct password validation
- [ ] RBAC enforced: Lecturer cannot access Registrar pages
- [ ] Student review workflow: can create, update status, resolve
- [ ] Course management: Registrar can add/edit/delete courses
- [ ] Results entry: Lecturer can enter marks, Registrar can approve
- [ ] Transcripts generate with correct GPA calculation
- [ ] Audit log captures all administrative actions
- [ ] Password change requires current password verification

### 10.2 Security Testing

- [ ] JWT expires after 12 hours of inactivity
- [ ] Expired token → 401 response → login redirect
- [ ] SQL injection attempt on login field → rejected (input validation)
- [ ] CORS blocks requests from unauthorised domains
- [ ] API endpoints reject requests without valid JWT
- [ ] Passwords stored as bcrypt hash (verified via hash comparison)
- [ ] Audit log never contains sensitive data (passwords, API keys)

### 10.3 Performance Testing

- [ ] Dashboard loads in <2 seconds
- [ ] Student list with 10,000 students loads in <1 second (paginated)
- [ ] API response time avg <500ms
- [ ] 100+ concurrent users can be supported without errors
- [ ] Database queries use indexes (no full table scans)

### 10.4 Deployment Testing

- [ ] Frontend accessible at https://ai-tools.techbridge.edu.gh/tuc-rms/
- [ ] .htaccess SPA routing works (direct URLs, page refresh)
- [ ] Backend API responding at /api/health with 200 status
- [ ] Database backups running automatically
- [ ] Error pages display with contact info
- [ ] Monitoring alerts triggered on errors

---

## 11. REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.1 | 2026-05-25 | Daniel Frempong Twum | Current production-ready state |
| 2.0 | 2026-05-18 | Daniel Frempong Twum | Added student reviews, course CRUD |
| 1.0 | 2026-04-01 | Daniel Frempong Twum | Initial release |

---

## 12. SIGN-OFF

**Prepared by:** Daniel Frempong Twum  
**Title:** Head of ICT & Special Advisor to the Founder  
**Institution:** Techbridge University College  
**Date:** May 25, 2026  

**Approval Status:** ✅ READY FOR PRODUCTION DEPLOYMENT

This document reflects the current implementation of tuc-rms v2.1 and serves as the baseline for all deployment, maintenance, and future enhancement work.

---

*End of Document*
