
# Techbridge TSAP - Administrator Guide
**Version 3.1 (Project Refresh Edition)**

## 1. Introduction
TSAP (Techbridge Salary Administration Portal) is a secure, automated platform for calculating net salaries according to 2025 Ghanaian regulations. This guide covers the advanced administrative functions required to maintain the system's integrity, security, and data accuracy.

## 2. Security Setup
### 2.1 First Login
The system defaults to a standard security key for initial deployment: `%oyibi%ghana+`.
**CRITICAL ACTION:** Navigate to the Admin Panel immediately after your first login. Use the "Security Management" section to update this password. The "System Security Status" card will display an amber warning until this default password is changed.

### 2.2 System Security Status
The Admin Panel features a real-time "System Security Status" dashboard. This provides:
*   **Admin Credential Status**: Checks if the default password is in use.
*   **Audit Reliability**: Verifies the integrity of the client-side log storage.

## 3. Advanced AI Features (New in v3.1)
### 3.1 CLAUDE AI Assistant
The floating button in the bottom-right opens **CLAUDE** (Conversational Language Audit & User Diagnostic Engine). 
- **Capabilities**: You can ask CLAUDE to "Calculate salary for GHS 50,000", "Show recent login failures", or "Explain the tax bracket for 17.5%".
- **Tool Access**: CLAUDE has direct, read-only access to your Grade Database and Audit Logs to provide context-aware answers.

### 3.2 Intelligent Scale Ingestion
To update your database from an official PDF Salary Scale without manual data entry:
1. Go to Admin Panel -> **Intelligent Salary Scale Ingestion**.
2. Upload the official PDF document.
3. Click **"Analyze with AI"**. The system will use Gemini AI to parse the table structure.
4. Review the extracted data preview table.
5. Click **"Import & Update Database"** to commit the changes to your local system.

## 4. Grade Management
The Grade List serves as the source of truth for all calculations.
*   **Add/Edit**: You can manually add or modify individual grades.
*   **Sorting**: The table is fully sortable. Click any column header (Emp Code, Grade, Status, Annual Salary) to toggle sorting.
*   **Views**: Toggle between "List View" (standard table) and "Matrix View" (grid layout) for easier comparison of steps within a grade.

## 5. Compliance & Auditing
### 5.1 Audit Log
Every calculation, login event, and administrative action is saved in the **Security Audit Log**.
*   **Review**: Logs are displayed in reverse chronological order.
*   **Export**: Click **"Export CSV"** to download the log file for external reporting, Excel analysis, or management approval.
*   **Retention**: Logs are stored in the browser. Use the "Clear Logs" button only after exporting if storage space is full.

### 5.2 Self-Testing Framework
The system includes a built-in diagnostic tool to prove compliance.
1.  Navigate to the **"Self-Test"** page.
2.  **Calculation Validation**: Runs the engine against every grade in the database to ensure 100% mathematical accuracy against the official sheet.
3.  **E2E Simulation**: Watches a bot user perform a salary calculation and override workflow in real-time.
4.  **Export Results**: After running tests, click the **Download Icon** to save a JSON report of the test results. This file serves as proof of system integrity for IT audits.

## 6. Support
For technical issues regarding the hosting environment or API keys, please contact the IT Infrastructure team. For questions regarding salary formulas, refer to the "Appendices" section of the [SRS Document](./SRS_ASAPro_Final.md).