# MarkAI Administrator Guide

This document provides instructions for accessing and using the administrative features of the MarkAI application.

## 1. Accessing the Admin Dashboard

1.  Navigate to the MarkAI application in your browser.
2.  In the main header navigation, click on the **"Admin"** button, identifiable by a shield icon.
3.  An "Admin Access" modal will appear, prompting you for a password.

## 2. Logging In

To log in, you must provide the correct administrator password.

-   **Password:** For this client-side demo application, the password is a hardcoded value: `admin123`.
-   **Note:** In a real-world production application, this password would be managed through a secure backend authentication system, not stored on the client. The `ADMIN_PASSWORD` environment variable is no longer used.

Enter the password and click the "Login" button. If the password is correct, you will be redirected to the Admin Dashboard. If it is incorrect, an error message will be displayed. All login attempts (successful and failed) are logged and will trigger a notification to the security contact.

## 3. Using the Admin Dashboard

The Admin Dashboard provides access to feature flags, model configuration, and the activity log.

### 3.1 Feature Flags

The Feature Flags section allows you to dynamically enable or disable core application functionality in real-time. Changes are saved automatically and will persist across browser sessions.

-   **AI Content Generation:** Controls the visibility and accessibility of the main content generator page.
-   **AI Image Tools:** Enables the Gemini-powered image editing and generation features.
-   **Campaign Scheduling:** Controls the visibility of the calendar page and the "Schedule" buttons on generated content cards.
-   **Live AI Chat:** Enables the real-time audio conversation feature powered by the Gemini Live API.

To toggle a feature, simply click the switch next to the feature name.

### 3.2 AI Model Configuration

This section allows you to select the specific Google Gemini model that the application will use for all AI content generation tasks.

-   **Active Gemini Model:** Use the dropdown menu to select from the available models (`gemini-2.5-flash` or `gemini-2.5-pro`). Your selection is saved automatically and takes effect immediately. This is useful for testing new model versions or switching to a model that better suits your needs for quality versus speed.

### 3.3 Activity Log

The Activity Log provides a chronological record of all security-sensitive actions performed by administrators. Each log entry includes:

-   **Timestamp:** The date and time when the event occurred.
-   **Action:** The type of event that was logged (e.g., Login Success, Feature Flag Toggle).
-   **Details:** Additional context for the event, such as the password used in a failed login attempt or the specific feature flag that was changed.

This log is crucial for monitoring security and auditing access to the administrative section.

## 4. Logging Out

To securely end your administrative session, click the **"Logout"** button located at the top-right of the Admin Dashboard. You will be returned to the main application view. A "Logout" event will be recorded in the Activity Log.
