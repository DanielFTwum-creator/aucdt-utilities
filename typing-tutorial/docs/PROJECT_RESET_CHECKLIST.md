# PROJECT RESET & RESTORATION CHECKLIST
## Document Identifier: TUC-INC-2026-002
### VortexType (Techbridge University College)

This disaster recovery and environmental synchronization guide provides operational actions to reset the application workspace to a known clean reference state.

---

## 1. Local Browser Storage Reset
Perform these steps to delete local user history, progress state, and restore initial levels:
- [ ] Open the Browser DevTools (Press `F12` or `Ctrl+Shift+I`).
- [ ] Direct to the **Application** (or **Storage**) Tab.
- [ ] Under **Local Storage**, select the host's URL.
- [ ] Locate the following keys and delete them:
  - `tuc_user_progress` (Clears user scores, speed, accuracy, levels)
  - `tuc_audit_logs` (Clears recorded activities)
  - `tuc_theme` (Clears visual display presets)
  - `tuc_admin_logged` (Wipes admin gating authorization state)
- [ ] Press `F5` to perform a hard reload.

## 2. Server Runtime Reset (Plesk + Nginx Container Ecosystem)
If the Node server becomes stale, follow these commands:
- [ ] Log in to the Plesk Obsidian control panel (`https://ict-server.tuc.edu.gh:8443`).
- [ ] Select **Websites & Domains** -> locate the domain context.
- [ ] Navigate to **Docker Container** or **Node.js** application settings.
- [ ] Click **Restart** on the app runner.
- [ ] Verify the reverse-proxy routes and confirm port binding:
  - Docker inbound binding: container port `3000` mapped to Plesk internal port.
  - Check Nginx reverse proxy rewrite rule configurations for incoming CORS handling.

## 3. Database Restoration (MySQL/MariaDB)
To drop and rebuild student tables:
- [ ] Connect to the MariaDB instance via SSH or Plesk phpMyAdmin.
- [ ] Execute the migration schema resetting script:
  ```sql
  DROP TABLE IF EXISTS tuc_student_progress;
  DROP TABLE IF EXISTS tuc_audit_logs;
  
  CREATE TABLE tuc_student_progress (
    student_id VARCHAR(50) PRIMARY KEY,
    current_level INT DEFAULT 1,
    total_points INT DEFAULT 0,
    best_wpm INT DEFAULT 0,
    best_accuracy DECIMAL(5,2) DEFAULT 0.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
  ```
- [ ] Verify database connectivity and seed standard logs.

## 4. Compilation Verification
Ensure source integrity by running code checking suites:
```bash
npm run clean
npm run lint
npm run build
```
Confirm deployment directories (`dist/`) are successfully populated.
