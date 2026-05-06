
# Administrator Guide for the Lecturer Assessment System

**Version 1.0**

---

### Introduction

This guide provides instructions for administrators on how to use the advanced features of the Lecturer Assessment System. As an administrator, you have access to a secure panel that allows you to monitor system activity and manage application data.

### Table of Contents
1. [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2. [Understanding the Audit Log](#2-understanding-the-audit-log)
3. [Data Management](#3-data-management)
    - [Exporting Assessments](#31-exporting-assessments)
    - [Importing Assessments](#32-importing-assessments)
4. [Managing Lecturers with PDF Uploads](#4-managing-lecturers-with-pdf-uploads)

---

### 1. Accessing the Admin Panel

The Admin Panel is a restricted area for system oversight.

**Steps to Access:**

1.  Navigate to the main application page.
2.  In the main navigation bar, click on the **"Admin"** tab.
3.  A login modal will appear, prompting you for a password.
4.  Enter the administrator password and click "Login".
    - The default password is: `admin`
5.  Upon successful login, you will be taken to the Admin Panel. You will remain logged in for the duration of your browser session.

### 2. Understanding the Audit Log

The Audit Log is the central feature of the Admin Panel. It provides a real-time, chronological record of important events that occur within the application. This is crucial for monitoring usage and tracking data changes.

Each log entry contains:
- **Timestamp:** The exact date and time the event occurred.
- **Action:** The type of event that was logged.
- **Details:** A descriptive message explaining the event.

The following actions are automatically logged:

| Action Type       | Description                                                              |
|-------------------|--------------------------------------------------------------------------|
| `ADMIN_LOGIN`     | Recorded every time an administrator successfully logs into the panel.   |
| `ASSESSMENT_SUBMIT` | Recorded when a new lecturer assessment is submitted by a user.          |
| `DATA_EXPORT`     | Logged when assessment data is exported to a JSON file.                  |
| `DATA_IMPORT`     | Logged when assessment data is imported from a JSON file.                |
| `PDF_PROCESSED`   | Recorded when a PDF is processed by the AI to extract data.              |

By reviewing the audit log, you can track how the system is being used and when key data modifications occur.

### 3. Data Management

The data management tools are located in the **"Analytics"** tab. These tools allow you to create backups and restore assessment data.

#### 3.1 Exporting Assessments

Exporting creates a JSON file backup of all lecturer assessments currently in the system. This is useful for offline analysis, record-keeping, or migrating data.

**To Export Data:**
1. Go to the **"Analytics"** tab.
2. In the "Data Management" section, click the **"Export to JSON"** button.
3. Your browser will automatically download a file named `aucdt-assessments-export-[YYYY-MM-DD].json`. Save this file in a secure location.

#### 3.2 Importing Assessments

Importing allows you to restore assessment data from a previously exported JSON file.

**Important:** Importing data will **completely replace** all existing assessment data in the application. This action cannot be undone.

**To Import Data:**
1. Go to the **"Analytics"** tab.
2. Click the **"Import from JSON"** button.
3. Select the valid JSON file you wish to import from your computer.
4. A confirmation prompt will appear, asking you to confirm the data replacement.
5. Click "OK" to proceed. The data will be loaded into the system.

### 4. Managing Lecturers with PDF Uploads

The **"Upload Programmes"** tab allows you to use AI to automatically populate the list of lecturers and courses from official university documents.

**To use this feature:**
1. Navigate to the **"Upload Programmes"** tab.
2. Select the relevant programme from the dropdown list.
3. Drag and drop the programme's PDF document into the upload area, or click to browse for the file.
4. The system will process the document and display the extracted lecturer names and course codes.
5. Review the extracted information. You can click **"Edit Data"** to make corrections.
6. Once satisfied, click **"Save to System"** to add the new lecturers to the directory.
