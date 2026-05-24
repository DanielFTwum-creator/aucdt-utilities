# TUC Results Management System — v2.1

Techbridge University College  
Academic Results Management System  
Node.js (Express) + MySQL + React (Vite)

---

## What Was Fixed and Added

### 1. Review Button (Students page)
The Review button on every student row now opens a fully functional modal with:
- Category selector: Academic Standing, Enrollment Issue, Grade Dispute, Documents, General
- Priority selector: Low, Medium, High, Critical
- Description text area with validation
- Saves to the new `student_reviews` table
- A separate "History" button shows all past reviews for that student with the ability to update status, priority, and add resolution notes

### 2. Add Course — Registrar
The Courses page now shows an "Add Course" button when logged in as Registrar.  
Full form: course code, course name, department, programme, level, semester, credit hours.  
Edit and Delete actions also added for Registrar.

### 3. New: student_reviews Table
Tracks all student review cases with full lifecycle:  
Open -> In Progress -> Resolved -> Closed  
Priority levels: Low, Medium, High, Critical  
Categories: Academic Standing, Enrollment Issue, Grade Dispute, Documents, General

---

## Setup Instructions

### Step 1 — Database

```sql
mysql -u root -p
source /path/to/tuc-rms/backend/database.sql
```

Or import `backend/database.sql` through phpMyAdmin / MySQL Workbench.  
The SQL file creates the database, all tables, and seeds default users and sample data.

### Step 2 — Backend

```bash
cd backend
npm install
npm run dev
```

The API runs on http://localhost:5000

Configure `backend/.env` if needed:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=tuc_rms
JWT_SECRET=tuc_rms_secret_2026
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Step 3 — Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173

---

## Default Login Credentials

All accounts use password: **Admin@123**

| Role        | Email                      | Password  |
|-------------|----------------------------|-----------|
| Registrar   | registrar@tuc.edu.gh       | Admin@123 |
| QA Officer  | qa@tuc.edu.gh              | Admin@123 |
| Lecturer    | buchag@tuc.edu.gh          | Admin@123 |
| Lecturer    | wellington@tuc.edu.gh      | Admin@123 |
| Lecturer    | ahiabu@tuc.edu.gh          | Admin@123 |

---

## System Roles

| Role        | Capabilities |
|-------------|--------------|
| Registrar   | All access: students, courses (add/edit/delete), approve/reject results, transcripts, reports, user management, audit log, student reviews |
| QA Officer  | View students, courses, approve results (QA sign-off), transcripts, reports, student reviews |
| Lecturer    | View and enter scores for assigned courses, submit for approval |
| HOD         | Same as Lecturer + can view department data |

---

## Page Reference

| Page             | Route                         | Who Can Access       |
|------------------|-------------------------------|----------------------|
| Dashboard        | /dashboard                    | All                  |
| Students         | /students                     | Registrar, QA        |
| All Courses      | /courses                      | Registrar, QA        |
| My Courses       | /courses                      | Lecturer, HOD        |
| Enter Scores     | /courses/:courseId/enter-scores | Lecturer, Registrar |
| Approve Results  | /approve-results              | Registrar, QA        |
| Transcripts      | /transcripts                  | Registrar, QA        |
| Class Reports    | /reports                      | Registrar, QA        |
| User Management  | /users                        | Registrar            |
| Audit Log        | /audit-log                    | Registrar            |
| Change Password  | /change-password              | All                  |

---

## API Reference

### Auth
- POST   /api/auth/login
- GET    /api/auth/me
- POST   /api/auth/change-password

### Students
- GET    /api/students
- GET    /api/students/:id
- POST   /api/students
- PUT    /api/students/:id
- GET    /api/students/meta/programmes
- GET    /api/students/:id/reviews
- POST   /api/students/:id/reviews
- PUT    /api/students/:studentId/reviews/:reviewId
- GET    /api/students/reviews/all

### Courses
- GET    /api/courses
- GET    /api/courses/departments
- GET    /api/courses/programmes
- POST   /api/courses  (registrar only)
- PUT    /api/courses/:id  (registrar only)
- DELETE /api/courses/:id  (registrar only)
- GET    /api/courses/:courseId/students

### Results
- POST   /api/results/enter-scores
- POST   /api/results/submit/:courseId
- POST   /api/results/approve/:courseId
- GET    /api/results/course/:courseId
- GET    /api/results/pending
- GET    /api/results/transcript/:studentId
- GET    /api/results/notifications
- PUT    /api/results/notifications/:id/read
- PUT    /api/results/notifications/read-all

### Dashboard & Reports
- GET    /api/dashboard/stats
- GET    /api/reports/class-report
- GET    /api/reports/transcript/:studentId
- GET    /api/reports/audit-log

### Users
- GET    /api/users
- POST   /api/users
- PUT    /api/users/:id
- GET    /api/users/:id/courses
- POST   /api/users/:id/reset-password
- POST   /api/users/assign-course

---

## Grading Scale

| Total Score | Grade | Grade Point | Remarks |
|-------------|-------|-------------|---------|
| 80 - 100    | A     | 4.00        | PASS    |
| 70 - 79     | B+    | 3.50        | PASS    |
| 60 - 69     | B     | 3.00        | PASS    |
| 55 - 59     | C+    | 2.50        | PASS    |
| 50 - 54     | C     | 2.00        | PASS    |
| 45 - 49     | D+    | 1.50        | PASS    |
| 40 - 44     | D     | 1.00        | PASS    |
| 0  - 39     | F     | 0.00        | FAIL    |

Class score: max 30 points  
Exam score: max 70 points  
Total: max 100 points
