# LEAP - Administrator Guide

This guide provides a comprehensive overview of the administrative features of the Lecturer Assessment & Evaluation Portal (LEAP).

### 1. Accessing the Administrator Panel

1.  **Navigate to the Portal:** Open the application in your web browser.
2.  **Click "Admin":** In the header, click the "Admin" button.
3.  **Enter Password:** You will be prompted for a password.
    *   For development, the default password is `admin123`.
    *   In a production environment, this password should be configured via the `ADMIN_PASSWORD` environment variable for security.
4.  **Sign In:** Click "Sign in" to access the dashboard.

Upon successful login, an "Admin Login" event is recorded in the System Audit Log.

### 2. Navigating the Dashboard

The dashboard is organized into four main tabs:

-   **Overview:** For visualizing and analyzing evaluation data.
-   **Curriculum AI:** For updating the system's curriculum data using a PDF timetable.
-   **Audit Log:** For viewing a log of all significant system events.
-   **Self-Testing:** For running an in-browser suite of tests to verify core functionality.

### 3. Overview Tab: Analyzing Evaluations

This is the main analytics view.

-   **Overall Performance (Default View):**
    -   A bar chart displays the average evaluation score for every lecturer who has received at least one evaluation. This gives a high-level comparison of performance.
-   **Detailed View (After Selecting a Lecturer):**
    -   Click on a lecturer's name from the list on the left to see their detailed statistics.
    -   The selected lecturer will be highlighted.
    -   **Key Stats:** View the total number of evaluations and the overall average score for the selected lecturer.
    -   **Radar Chart:** This chart visualizes the lecturer's performance across the main evaluation categories (e.g., "Delivery & Knowledge", "Content & Structure"). This helps identify specific strengths and weaknesses.
    -   **Recent Comments:** A list of the most recent written comments from student evaluations is displayed.

### 4. Curriculum AI Tab: Updating Data

This powerful feature allows you to update the entire application's curriculum (programmes, courses, lecturers) using a university timetable PDF.

**Warning:** Using this feature will clear all existing evaluation data for the current session, as the old data will no longer correspond to the new curriculum.

1.  **Select PDF:** Click the upload area to select a PDF file from your computer.
2.  **Upload & Process:** Click the "Upload & Process" button.
3.  **Confirm:** A modal will appear warning you that existing evaluations will be cleared. Click "Proceed" to continue.
4.  **Processing:** The system will:
    a.  Extract text from the PDF.
    b.  Send the text to the Google Gemini API for analysis.
    c.  Receive structured JSON data back from the API.
    d.  Load the new data into the application.
5.  **Status:** The UI will show the current status (Processing, Success, or Error). If an error occurs, a descriptive message will be displayed.

### 5. Audit Log Tab

This tab provides a chronological record of important system events for monitoring and security purposes.

-   **Events Logged:** Admin Login, Admin Logout, Evaluation Submitted, Curriculum Updated, Curriculum Update Failed.
-   **Filtering:** Use the search bar at the top to filter logs by text in the "Action" or "Details" columns.
-   **Sorting:** Click on the table headers (Timestamp, Action, Details) to sort the data in ascending or descending order.

### 6. Self-Testing Tab

This feature allows you to run a quick, automated check to ensure the application's core frontend logic is working as expected.

1.  **Start Suite:** Click the "Start Suite" button.
2.  **Execution:** The test runner will simulate key user actions, such as submitting a student form.
3.  **Results:** The status of each test (Running, Passed, Failed) will be displayed in real-time. If a test fails, a brief error message will explain the cause.
