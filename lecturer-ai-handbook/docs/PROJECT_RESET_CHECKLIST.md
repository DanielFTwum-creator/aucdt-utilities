# PROJECT RESET & RESTORATION CHECKLIST
## DOCUMENT REF: TUC-INC-2026-002
### PROJECT: LecturerAI — Academic Preparation Companion Workbook
### TARGET AUDIENCE: TUC ICT Directorate Admins / Workshop Facilitators

---

## 1. PURPOSE & SCOPE
During faculty training workshops or department-level hands-on sessions at Techbridge University College, users will populate their local briefing briefcase, set custom productivity parameters, and trigger audit logging traces. 

This SOP outlines the precise sequence of operations required to completely reset the **LecturerAI** digital training environment back to its original baseline state. Running these actions guarantees a clean, predictable workspace for subsequent cohorts.

---

## 2. WORKSPACE RESET STEPS (EXECUTIVE LEVEL)

Confirm each step with ✅ before proceeding to the next.

### Phase A: Client-Side Browser Storage Cleansing
*   [ ] **Clear Browser Briefcase Storage**:
    Run the following command inside the browser's developer console (`F12`) to wipe all saved course outlines, quizzes, and slide decks:
    ```javascript
    localStorage.removeItem('tuc_briefcase');
    ```
*   [ ] **Reset Onboarding Tour Settings**:
    Force the interactive onboarding user tour to trigger again upon next load:
    ```javascript
    localStorage.removeItem('tuc_onboarding_tour_completed');
    ```
*   [ ] **Reset Layout and Contrast Preferences**:
    Wipe custom high-contrast or dark mode selections to restore default editorial light mode:
    ```javascript
    localStorage.removeItem('tuc_theme_preference');
    ```
*   [ ] **Clear All Console Session Headers**:
    Reset temporary application states and selected navigation tabs:
    ```javascript
    sessionStorage.clear();
    ```

### Phase B: Server-Side & Local Container Restructuring
*   [ ] **Kill Active Node.js Developer Processes**:
    Ensure there are no lingering port locks on `3000`:
    ```bash
    fuser -k 3000/tcp || true
    ```
*   [ ] **Wipe Hardcoded Output Cache (Build Artifacts)**:
    Delete compiled web assets and esbuild files inside the on-premise Docker server volume:
    ```bash
    npm run clean
    ```
*   [ ] **Repopulate Environment Configurations**:
    Ensure the on-premise `.env` is restored with standard placeholder variables but secure secrets:
    ```bash
    cp .env.example .env
    ```

### Phase C: On-Premise MySQL / MariaDB State Flush (If Relational Database Option Enabled)
*   [ ] **Truncate System Audit Logs Table**:
    Run the following database query via Plesk Database Explorer to purge diagnostic rows without dropping table schemas:
    ```sql
    TRUNCATE TABLE tuc_audit_logs;
    ```
*   [ ] **Reset Sequence Primers**:
    Restore index numbering for consistent regression report testing:
    ```sql
    ALTER TABLE tuc_audit_logs AUTO_INCREMENT = 1;
    ```

### Phase D: Deployment & Health Status Checks
*   [ ] **Rebuild the Web Application**:
    Compile a fresh, production-ready bundle to verify there are no syntax or typescript compiler issues:
    ```bash
    npm run build
    ```
*   [ ] **Trigger Integration Health-Checks**:
    Ping the `/api/health` endpoint on-premise to verify 200 OK responses from the node gateway.

---

## 3. MASTER WORKSHOP RESTORATION VERIFICATION
Run the interactive test runner from the **Admin panel** inside the live app and ensure all four integration categories (Auth, PDF, Briefcase, API) show positive green lights before allowing lecturers into the training laboratory.
