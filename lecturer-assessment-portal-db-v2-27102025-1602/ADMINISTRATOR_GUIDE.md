# Administrator's Guide
## Lecturer Assessment & Evaluation Portal

Welcome to the Administrator's Guide for the Lecturer Assessment & Evaluation Portal. This document provides a comprehensive overview of all the features available in the secure admin panel.

---

### Table of Contents
1.  [Accessing the Admin Panel](#1-accessing-the-admin-panel)
2.  [Navigating the Dashboard](#2-navigating-the-dashboard)
3.  [Dashboard Tabs Explained](#3-dashboard-tabs-explained)
    -   [3.1 Overview](#31-overview)
    -   [3.2 Programmes](#32-programmes)
    -   [3.3 Results](#33-results)
    -   [3.4 Lecturers](#34-lecturers)
    -   [3.5 Analytics](#35-analytics)
    -   [3.6 Guides](#36-guides)
    -   [3.7 Self Test](#37-self-test)
    -   [3.8 Admin Panel](#38-admin-panel)
4.  [Core Feature: AI-Powered PDF Extractor](#4-core-feature-ai-powered-pdf-extractor)
5.  [Frequently Asked Questions (FAQ)](#5-frequently-asked-questions-faq)

---

### 1. Accessing the Admin Panel

To access the administrative features, follow these steps:
1.  Navigate to the portal's main URL. You will see the student assessment form.
2.  Click the **"Admin"** button in the top-right corner of the navigation bar.
3.  A login modal will appear. Enter the password: `admin123`
4.  Click **"Login"**.

Upon successful login, you will be redirected to the main admin dashboard. To exit, click the **"Logout"** button.

### 2. Navigating the Dashboard

The admin dashboard is organized into several tabs, accessible via the main navigation bar. The top of the page always displays three key summary cards:
-   **Total Evaluations:** A count of all submissions received.
-   **Average Rating:** The overall average rating across all evaluations.
-   **Recommendation Rate:** The percentage of evaluations where the lecturer was recommended.

### 3. Dashboard Tabs Explained

#### 3.1 Overview
This is the default landing page. It provides a high-level summary of all programmes, including the number of lecturers, courses, and evaluations for each, along with their average rating and recommendation rate.

#### 3.2 Programmes
This tab displays a sortable table of all academic programmes. It provides a clear, comparative view of key metrics for each programme, such as total lecturer count, evaluation volume, and overall performance scores. You can sort the table by clicking on the column headers.

#### 3.3 Results
This tab allows you to view individual evaluation submissions.
-   **Filtering:** Use the controls at the top to filter results by Programme or Semester.
-   **Searching:** Use the search bar to find evaluations for a specific lecturer or course.
-   **Evaluation Cards:** Each card displays a complete breakdown of a single assessment, including the average rating, all 20 categorical ratings, and any comments left by the student.

#### 3.4 Lecturers
This is a powerful master-detail view for analyzing lecturer performance.
-   **Master View:** A sortable and filterable table lists every lecturer in the system. You can see their associated programmes, courses taught, and high-level performance metrics. Use the search and filter controls to narrow the list.
-   **Detail View:** Click on any lecturer in the table to navigate to their dedicated detail page. This page provides an in-depth analysis, including:
    -   Performance broken down by each of the 20 assessment categories.
    -   A chart showing the distribution of ratings (1-star to 5-star).
    -   A table summarizing their performance in each course they teach.
    -   A complete list of all qualitative comments received.

#### 3.5 Analytics
This tab provides high-level visual analytics for the entire dataset.
-   **Recommendation Breakdown:** A donut chart showing the proportion of "Recommend", "Neutral", and "Not Recommend" ratings.
-   **Overall Rating Distribution:** A bar chart illustrating how many 1, 2, 3, 4, and 5-star ratings have been given across all evaluations.
-   **Average Ratings by Category:** A detailed bar chart comparing the performance across all 20 assessment criteria, helping you identify systemic strengths and weaknesses.

#### 3.6 Guides
This tab provides a quick-start guide to the main features of the dashboard. For more comprehensive information, refer to this document.

#### 3.7 Self Test
This tab contains a demonstration of the portal's End-to-End (E2E) automated test suite.
-   **Functionality:** Click the **"Run E2E Test Suite"** button to start the simulation.
-   **Purpose:** The suite will automatically run through key user journeys (like submitting a form or logging in as an admin) and provide real-time pass/fail feedback. This is a powerful tool for quickly verifying that the application's core functionalities are working as expected after any changes or updates.

#### 3.8 Admin Panel
This is the central control hub for data management.
-   **AI-Powered PDF Data Extractor:** This tool allows you to update the entire application's curriculum (programmes, courses, and lecturers) by simply uploading a timetable PDF. See the next section for more details.
-   **Audit Logs:** This section displays a real-time log of important system events, such as curriculum updates and new evaluation submissions. It's useful for monitoring activity and troubleshooting issues.

### 4. Core Feature: AI-Powered PDF Extractor

This is the most powerful administrative tool in the portal. It uses the Google Gemini AI to read a university timetable and automatically configure the entire application.

**⚠️ Important:** Using this feature will **permanently delete all existing evaluation data**. It is designed to be used at the beginning of a new assessment period to reset the system with the latest curriculum.

**How to Use:**
1.  Navigate to the **Admin Panel** tab.
2.  Click **"Choose a PDF file"** and select a clear, text-based timetable document.
3.  Click the **"Extract & Update Data"** button.
4.  A confirmation modal will appear, warning you about data deletion. Read it carefully.
5.  Click **"Confirm & Proceed"** to start the process.
6.  The system will provide real-time feedback as it uploads the file, sends it to the AI for analysis, and processes the results.
7.  Upon completion, a success message will be displayed, and the new curriculum will be active throughout the portal. An entry will also be added to the Audit Logs.

### 5. Frequently Asked Questions (FAQ)

**Q: Is student feedback truly anonymous?**
**A:** Yes. The student assessment form does not collect any personally identifiable information.

**Q: What happens if the PDF extraction fails?**
**A:** The system will display an error message, and no data will be changed or deleted. An error entry will be added to the Audit Logs with details about the failure.

**Q: Can I export the evaluation data?**
**A:** The "Export to JSON" and "Import from JSON" features are placeholders for future development and are not currently functional.