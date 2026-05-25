# TUC RMS Admin Guide

**Document ID:** TUC-RMS-ADMIN-2026-001  
**Version:** 3.0  
**Last Updated:** 25 May 2026  
**Audience:** Registrars, ICT Administrators

## Table of Contents
1. [Introduction](#introduction)
2. [User Management](#user-management)
3. [Student Management](#student-management)
4. [Course Management](#course-management)
5. [Results Workflow](#results-workflow)
6. [Audit Log](#audit-log)
7. [Notifications](#notifications)
8. [Theme Switching](#theme-switching)
9. [Session Management](#session-management)
10. [Security Best Practices](#security-best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Introduction

The TUC Results Management System (RMS) is a web-based application designed to streamline the management of student results, course administration, and audit logging. This guide provides step-by-step instructions for registrars and administrators.

**Who should use this guide:** Registrars (administrators with full system access), ICT staff responsible for system maintenance.

**Key features:**
- Dashboard with real-time statistics
- User account management (create, edit, deactivate)
- Student information management and searching
- Course creation and lecturer assignment
- Results entry, approval, and rejection workflows
- Complete audit trail of all administrative actions
- Theme customisation (Light, Dark, High-Contrast)
- Automatic session timeout with warnings

---

## User Management

### Overview
User management allows you to create, edit, and manage accounts for registrars, lecturers, and system administrators.

### Adding a New User

1. Navigate to **Users** from the sidebar
2. Click the **Add User** button (top-right)
3. Fill in the form:
   - **Email:** A unique email address (e.g., `lecturer@tuc.edu.gh`)
   - **Role:** Select from:
     - **Registrar** — Full system access, can manage all users and results
     - **Lecturer** — Can only enter scores for their courses
     - **Admin** — System administrator with additional security privileges
   - **Initial Password:** The system generates a temporary password. The user will be prompted to change it on first login.
4. Click **Add User**

The new user will receive a notification email (if configured) with their temporary credentials.

### Editing a User

1. Navigate to **Users**
2. Find the user in the table and click **Edit**
3. Modify the required fields
4. Click **Save** or **Cancel** to discard changes

### Deactivating a User

1. Navigate to **Users**
2. Find the user and click **Reset Password** or **Deactivate**
3. A confirmation modal will appear. Click **Confirm** to proceed.

**Important:** Deactivated users cannot log in, but their historical records (results, audit logs) are retained for compliance.

### Resetting a User's Password

1. Navigate to **Users**
2. Find the user and click **Reset Password**
3. Confirm the action in the dialog
4. A temporary password is generated and logged in the audit trail

---

## Student Management

### Searching for Students

1. Navigate to **Students** from the sidebar
2. Use the search bar to find students by:
   - Student ID (e.g., `STU-2026-001`)
   - Name (first or last)
   - Email address
3. Results display in the table below

### Adding a New Student

1. Click **Add Student** (top-right)
2. Fill in the form:
   - **First Name** and **Last Name**
   - **Student ID** (unique identifier, e.g., `STU-2026-001`)
   - **Email** (optional; for communications)
   - **Enrolled Date** (default: today)
3. Click **Add Student**

### Editing Student Information

1. Find the student in the table and click **Edit**
2. Modify the fields as needed
3. Click **Save**

### Student Reviews

1. Find a student and click **View Reviews**
2. A panel shows all academic reviews (added by lecturers or admins)
3. To add a review:
   - Click **Add Review**
   - Enter comments
   - Click **Save**

---

## Course Management

### Adding a New Course

1. Navigate to **Courses** from the sidebar
2. Click **Add Course** (top-right)
3. Fill in the form:
   - **Course Code** (e.g., `CS-101`)
   - **Course Title** (e.g., `Introduction to Programming`)
   - **Credits** (e.g., `3`)
   - **Semester** (e.g., `2026-Spring`)
   - **Lecturer** — Select from the dropdown list of assigned lecturers
4. Click **Add Course**

### Editing a Course

1. Find the course in the table and click **Edit**
2. Modify the fields
3. Click **Save**

### Assigning Lecturers

Lecturers are assigned to courses during course creation. To change the lecturer:

1. Click **Edit** on the course
2. Select a different lecturer from the dropdown
3. Click **Save**

---

## Results Workflow

### Overview
Results follow a multi-step approval process:
1. **Lecturer enters scores** (draft status)
2. **Registrar reviews** the results
3. **Registrar approves or rejects** the batch
4. **Approved results** become final and visible to students

### Approving Results

1. Navigate to **Approve Results** from the sidebar
2. A table displays pending result batches with:
   - Course name and code
   - Number of students
   - Status (Pending, Approved, Rejected)
   - Lecturer name
3. Click **View** on a batch to see detailed scores
4. Review the scores and:
   - Click **Approve** to finalise the results
   - Click **Reject** with a reason if corrections are needed

### Rejecting Results

1. In the Approve Results page, find the batch
2. Click **Reject**
3. Enter a reason for rejection (e.g., "Scores need recalculation for GPA adjustment")
4. Click **Confirm Rejection**
5. The batch returns to "Draft" status; the lecturer can re-enter scores

### Viewing Result History

1. Navigate to **Reports** → **Results History**
2. Filter by:
   - Course
   - Semester
   - Student
   - Date range
3. View a timeline of all result submissions, approvals, and rejections

---

## Audit Log

### Overview
Every administrative action (user creation, result approval, score rejection) is logged for compliance and accountability.

### Accessing the Audit Log

1. Navigate to **Audit Log** from the sidebar
2. View a table of all logged actions with:
   - **Timestamp** — When the action occurred
   - **User** — Email of the person who performed the action
   - **Action** — Type of action (see table below)
   - **Table** — Which database table was affected
   - **Record ID** — ID of the affected record
   - **IP Address** — Network location of the request

### Action Codes

| Action Code | Meaning | Example |
|---|---|---|
| `USER_CREATE` | New user account created | Administrator adds lecturer account |
| `USER_EDIT` | User account modified | Password reset or role change |
| `USER_DEACTIVATE` | User account deactivated | Lecturer left the institution |
| `STUDENT_CREATE` | New student record created | Enrolment of new student |
| `STUDENT_EDIT` | Student information modified | Name correction |
| `COURSE_CREATE` | New course added | Adding CS-201 for Spring 2026 |
| `COURSE_EDIT` | Course details updated | Changing lecturer assignment |
| `RESULT_APPROVE` | Results approved for final submission | Registrar approves scores |
| `RESULT_REJECT` | Results rejected for revision | Scores returned for correction |
| `RESULT_ENTER` | Scores entered (draft) | Lecturer uploads initial scores |
| `ADMIN_ACTION` | Other administrative action | Theme change, notification sent |

### Exporting the Audit Log

1. In the Audit Log page, click **Export as CSV** (if available)
2. A file `audit_log_YYYY-MM-DD.csv` is downloaded
3. Open in Excel or your preferred spreadsheet application for further analysis

---

## Notifications

### Overview
The system sends notifications for important events:
- New user account created
- Results requiring approval
- Result batch rejected (notify lecturer)
- System maintenance announcements

### Viewing Notifications

1. Click the **bell icon** (🔔) in the top-right corner
2. A dropdown shows recent notifications
3. Click **View All** to see the full list

### Marking Notifications as Read

1. Click a notification to mark it as read
2. Click the **X** icon to dismiss

### Sending System Announcements

1. Navigate to **Settings** → **Notifications** (admin only)
2. Click **Send Announcement**
3. Enter the message and target audience (all users, registrars, lecturers, etc.)
4. Click **Send**

---

## Theme Switching

### Changing the System Theme

TUC RMS supports three colour schemes to suit different preferences and accessibility needs:

1. **Light Theme** (default) — High contrast, suitable for bright environments
2. **Dark Theme** — Reduced blue light, easier on the eyes in low-light conditions
3. **High-Contrast Theme** — Enhanced contrast for visually impaired users (WCAG 2.1 AA compliant)

### To Switch Themes

1. Look for the **theme toggle button** in the top-right of the page (next to the notification bell)
2. Click the button to cycle through themes:
   - Light → Dark → High-Contrast → Light (repeats)
3. Your preference is saved automatically in your browser

---

## Session Management

### Automatic Session Timeout

For security, the system automatically logs you out after **30 minutes of inactivity**. You will receive a warning at **25 minutes** with the option to extend your session.

### Session Timeout Warning

1. At 25 minutes of inactivity, a banner appears at the top of the page:
   - "Your session will expire in 5 minutes. Click here to continue working."
2. Click **Extend Session** to reset the timer
3. Or simply click anywhere on the page to dismiss the warning and remain logged in

### Logging Out Manually

1. Click your **email address** in the top-right corner
2. Click **Log Out**
3. You will be redirected to the login page

### Session Security

- Sessions are stored securely in encrypted cookies
- Each session token expires after 30 minutes of inactivity
- Logging out clears all session data
- The system tracks all login attempts in the audit log

---

## Security Best Practices

### Password Management

- **Change your password regularly** — At least every 90 days
- **Use strong passwords** — Mix uppercase, lowercase, numbers, and symbols (minimum 12 characters)
- **Never share your password** — Including with other staff
- **Reset forgotten passwords immediately** — Contact the IT department

### Account Security

- **Log out before leaving your desk** — Even for short absences
- **Use the automatic timeout feature** — It protects your account if you forget to log out
- **Report suspicious activity** — Contact IT immediately if you notice unauthorized actions in the audit log
- **Verify requests for user information** — Do not share passwords or account details via email or phone

### Data Protection

- **Results are confidential** — Do not share student results outside official channels
- **Handle personal information carefully** — Student emails and phone numbers are sensitive
- **Use HTTPS only** — The system uses encrypted connections; never access via unsecured networks
- **Back up important data** — The system is backed up daily, but inform IT of critical changes

### Phishing and Social Engineering

- **Suspicious emails** — If an email asks you to "verify your account" by clicking a link, contact IT first
- **Legitimate requests** — The system will never ask for your password via email
- **Caller verification** — If someone calls claiming to be from IT, hang up and call IT directly using a known number

---

## Troubleshooting

### I Cannot Log In

**Problem:** "Invalid email or password" message appears.

**Solution:**
1. Verify the email address is spelled correctly
2. Check that **Caps Lock** is not enabled
3. Request a password reset by clicking "Forgot Password?" on the login page
4. If you still cannot access your account, contact the IT department

### My Session Expired

**Problem:** "Your session has expired. Please log in again."

**Solution:**
1. Click **Log In**
2. Enter your credentials again
3. To prevent future timeouts, use the session extension button (see Session Management)

### Results Are Showing Incorrect Grades

**Problem:** Approved results display wrong grade calculations.

**Solution:**
1. Navigate to **Approve Results** and find the affected course
2. Click **Reject** and explain the issue
3. The lecturer will be notified to re-enter scores
4. Once resubmitted, review and approve again

### I Cannot Add a User / Student / Course

**Problem:** Error message when attempting to add a new record.

**Solution:**
1. Check that all required fields are filled (marked with *)
2. Ensure the email or ID is unique (not already in the system)
3. Verify you have the "Registrar" role (contact IT if unsure)
4. Try clearing your browser cache and refreshing the page
5. If the error persists, contact the IT department with the error message

### The System Is Slow

**Problem:** Pages take a long time to load or freeze.

**Solution:**
1. **Check your internet connection** — Run a speed test at speedtest.net
2. **Clear your browser cache** — Press Ctrl+Shift+Delete and select "All time"
3. **Use a different browser** — Test in Chrome, Firefox, or Edge
4. **Refresh the page** — Press Ctrl+R or F5
5. **Report to IT** — If slowness persists, provide the time and affected page

### I Accidentally Approved Wrong Results

**Problem:** Results were approved in error.

**Solution:**
1. **Contact the IT department immediately** — This is a critical action
2. Provide the course code and date of approval
3. IT can review the audit log and, in rare cases, revert the approval
4. Re-enter the correct results through the proper workflow

---

## Contact and Support

For technical issues, feature requests, or security concerns:

- **Email:** [ict@tuc.edu.gh](mailto:ict@tuc.edu.gh)
- **Phone:** +233 XXX XXX XXX (during business hours)
- **Office:** ICT Department, Techbridge University College, Oyibi, Greater Accra, Ghana

---

**Document Status:** Final — Version 3.0  
**Next Review Date:** 25 May 2027
