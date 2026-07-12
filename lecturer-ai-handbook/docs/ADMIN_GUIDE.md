# LECTURER AI — ADMINISTRATOR SYSTEM MANUAL
## DOCUMENT REF: TUC-ADM-GUIDE-2026
### TARGET: TUC ICT Directorate, Oyibi, Ghana

---

## 1. CONTEXT & POLICIES
LecturerAI is structured as an interactive digital companion. As an administrator, you are tasked with:
*   Enforcing security standards set by the **TUC ICT Directorate**.
*   Auditing system actions for compliance with GTEC guidelines.
*   Assuring proper support for visually impaired instructors under W3C accessibility guidelines.

---

## 2. SECURITY CONFIGURATION & CREDENTIALS
Access to the **Diagnostics & Diagnostics Core** is restricted via a master password system.

### 2.1 Password Settings
*   **Default Master Password**: `tuc-ict-admin-2026`
*   **Security recommendations**: Keep this password stored in a secure on-premise vault. Do not store this credential in clear-text inside public files.

### 2.2 Relational Audit Logging Scheme
The application logs the following five categories of action dynamically inside its relational table framework:
1.  **AUTH**: Successful and failed login sessions.
2.  **PDF_EXPORT**: Hands-on prints of official GTEC curriculum handout documents.
3.  **BRIEFCASE**: Operations inside the local storage "My Briefcase" organizer.
4.  **API_PING**: Health-checks verifying connectivity from Node.js Express proxy to Google Gemini API.
5.  **TEST_RUN**: Automated regression tests triggered by administrators or workshop coordinators.

---

## 3. AUDIT CONTROL SYSTEM (FACILITY TRAINING)
When running faculty training workshops at TUC Oyibi:
1.  **Open the Admin Gateway**: Use the top-level navigational tab.
2.  **Authenticate**: Enter the master password.
3.  **Verify Active Traces**: Monitor rows in real-time as lecturers generate syllabi and download handout PDFs.
4.  **Search Logs**: Filter by keyword (e.g. `PDF` or `Failed`) or category dropdowns to trace training engagement or failed requests.
5.  **Flushing Table Logs**: You can clear logs for fresh cohorts by clicking **Clear DB Tables** (prompts a secure browser validation window).

---

## 4. W3C ACCESSIBILITY CONFIGURATION
To adjust the portal layout for visually impaired or elderly educators:
*   **Theme Switcher**: Select between Light Mode, Dark Mode, and **High Contrast Mode** (which utilizes absolute black background with neon green/yellow accents to provide 10:1 visibility ratio).
*   **Base Zoom**: Adjust baseline typography sizes to `110%` or `120%` globally without breaking layouts.
*   **Line Spacing**: Set spacing to double-spaced (1.8x line height) to assist readability.
*   These settings persist locally inside browser preferences (`localStorage`) so lecturers retain their custom environment automatically upon return.
