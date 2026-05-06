# Admin Guide — dmcdAI Institutional Control Center

**Version:** 1.0.0  
**Institution:** Techbridge University College (TUC)  
**Access Required:** Admin Password (`dmcdai-admin-2025-secure`)

---

## 1. Accessing the Admin Panel

The Admin Panel is an isolated diagnostic and monitoring section protected by TUC-standard authentication.

1.  Navigate to `#/admin` in your browser.
2.  Alternatively, click the **Admin Panel** link at the bottom of the sidebar.
3.  Enter the institutional admin password to unlock the dashboard.

## 2. Audit Logs

The "Audit Logs" tab provides a transparent, immutable record of all student and system activities.

-   **Navigation Tracking**: Records when users enter or exit modules.
-   **AI Activity**: Records the initiation of AI generation requests (truncated prompts).
-   **Security Events**: Records login attempts and session cleared events.
-   **Persistence**: Logs are stored in **IndexedDB** and persist across browser restarts.
-   **Maintenance**: Use the **Clear Logs** button to reset the history for a new assessment cycle.

## 3. System Diagnostics & AI Simulator

The "System Diagnostics" tab contains the **AI Simulator**, a critical tool for testing UI resilience and student reactivity to error states.

### Using the AI Simulator

1.  **Toggle Simulator ON**: This intercepts all outgoing calls to the Google Gemini API.
2.  **Select Response Type**:
    -   **SUCCESS**: Proceed to real API (default).
    -   **QUOTA_EXCEEDED**: Simulates a 429 Rate Limit error.
    -   **SAFETY_BLOCK**: Simulates a safety filter trigger.
    -   **INVALID_KEY**: Simulates a 403 Forbidden error.
3.  **Observation**: Navigate to any learning module (e.g., Visual Design) and attempt a generation. The app will immediately present the selected error state.

### Running System Audit

Click **Run System Audit** to perform an internal E2E diagnostic. This simulates a full pass of core system health checks (Accessibility, Navigation, and State Consistency) and logs the results.

---

> [!IMPORTANT]
> **Data Privacy**: The Admin Panel contains sensitive interaction data. Always logout (Terminate Session) when finished to clear the institutional session cookie.
