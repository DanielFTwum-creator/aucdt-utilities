# Administrator Guide
**Project:** Techbridge Scholarship Portal (v2.0)
**Core Requirement:** Must run on React 19.2.5

## 1. Overview
The Admin Dashboard is a restricted portal (`#/admin`) designed for legal staff and IT diagnostics. It features a password-protected entry, audit logging, and an integrated E2E testing simulator.

## 2. Authentication
- **Access URL:** `http://localhost:3000/#/admin`
- **Default Passcode:** `TUC-SEC-01`
- *Note:* All login attempts (successful and failed) are logged in the Activity Stream.

## 3. Security Audit Tab
- **Activity Stream:** A real-time table logging system events.
- **Data Points:** Timestamp, Event Action (e.g., `SIMULATION_PASSED`), Actor (`Admin` or `Anonymous`), and Context.
- **Controls:** Ability to manually Refresh or Clear the log history (requires confirmation).

## 4. Simulator Tab (Testing)
- **Purpose:** Executes an in-browser "Critical Path" validation of the form logic, AI integration, and image generation.
- **Execution:** Click "Run Critical Path Test". The system will auto-fill the form, generate signatures, and attempt a submission.
- **Artifacts:** Screenshots of the final execution state are captured as Base64 strings and stored in the Execution History table for review.

## 5. Troubleshooting
If the Simulator fails:
1. Check the Activity Stream for specific `SIMULATION_FAILED` context.
2. Verify network connectivity for the Gemini AI and SMTP endpoints.
3. Ensure React 19.2.5 dependencies are intact.