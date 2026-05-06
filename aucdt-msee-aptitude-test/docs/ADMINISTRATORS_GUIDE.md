# Administrator's Guide

This guide provides instructions for administrators on how to manage the AUCDT MSEE Mathematics Aptitude Test application.

## Table of Contents
1. [Accessing the Admin Dashboard](#1-accessing-the-admin-dashboard)
2. [Generating Questions with AI](#2-generating-questions-with-ai)
3. [Saving a New Exam](#3-saving-a-new-exam)
4. [Viewing Audit Logs](#4-viewing-audit-logs)
5. [Managing Users](#5-managing-users)

---

### 1. Accessing the Admin Dashboard

The admin dashboard is a protected area where you can create new exams.

**Steps to Access:**
1.  Navigate to the application's URL and append `?admin` to the end. For example: `https://your-app-url.com/?admin`.
2.  You will be presented with the login screen. Use the email and password for a user account that has the `admin` role in the database.
3.  Click "Sign In". Upon successful authentication, you will be redirected to the Admin Dashboard.

If you enter incorrect credentials, an error message will be displayed.

### 2. Generating Questions with AI

The core feature of the admin panel is its ability to generate new, high-quality questions from a piece of source text using the Google Gemini AI.

**Steps to Generate Questions:**
1.  **Select a Subject:** Use the "Select Subject" dropdown to choose the topic for the exam you want to create.
2.  **Find Source Material:** Copy a section of text from a textbook, lecture notes, or any relevant document for the chosen subject.
3.  **Paste Content:** In the Admin Dashboard, paste the copied text into the large text area labeled "Paste Content to Generate Exam".
4.  **Initiate Generation:** Click the "Generate Questions with AI" button.
5.  **Wait for AI:** The system will send the content to the backend server, which securely calls the AI. This process may take a few moments.
6.  **Review Questions:** Once generation is complete, a list of 24 multiple-choice questions will appear below. Each question will show the correct answer highlighted in green.

### 3. Saving a New Exam

After the AI has generated questions and you are satisfied with them, you can save them as a new exam, making it available for students.

**Steps to Save an Exam:**
1.  **Assign a Name:** In the "Exam Name" input field, provide a clear and descriptive name for the new exam.
2.  **Provide a Description:** In the "Exam Description" textarea, write a short summary of the exam's content or purpose.
3.  **Save:** Click the "Save Exam" button. The button will be disabled until both a name and description are provided.
4.  **Confirmation:** The system will save the exam to the MySQL database. A success message will appear, and the form will reset.

The new exam will now be available for students to take from the main application page.

### 4. Viewing Audit Logs

The application automatically records important events to the database for security and monitoring purposes. There is no web interface for viewing these logs; they must be accessed directly from the database.

**Steps to View Logs:**
1.  Gain access to the MySQL database where the application data is stored.
2.  Use a database client (e.g., MySQL Workbench, DBeaver, or the command-line interface) to connect to the database.
3.  Execute a SQL query to view the logs. For example:
    ```sql
    SELECT u.email, a.action, a.details, a.timestamp 
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.timestamp DESC;
    ```
This query will show a chronological list of all recorded actions, who performed them, and any associated data.

### 5. Managing Users

User management (creating administrators, resetting passwords) is performed directly in the database.

*   **Creating an Administrator:** To make a user an administrator, update their `role` in the `users` table from the default `student` to `admin`.
*   **Resetting a Password:** There is no "forgot password" feature. An administrator with database access must manually generate a new password hash and update the `password_hash` field for the user in the `users` table.