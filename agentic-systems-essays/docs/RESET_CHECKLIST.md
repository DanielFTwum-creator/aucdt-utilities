# Project Reset Checklist [TUC-TAB-RESET]
### Document Reference: TUC-INC-2026-002
**Institution:** Techbridge University College (TUC), Oyibi, Ghana  
**Owner:** Daniel Twum, Head of ICT  

This SOP outlines the exact sequence to reset the system states (database, environmental variables, node packages, local browser persistent configurations) to prepare the application for fresh development cycles or production handover.

---

## 📅 Pre-Reset Archive Procedure
Before executing any purge, guarantee that backups of database tables and custom credentials are captured.
1. [ ] Back up administrative audit logging. Export logs via SQL command:
   ```bash
   mysqldump -u tuc_user -p tuc_database tuc_audit_logs > backup_audit_logs_$(date +%F).sql
   ```
2. [ ] Backup any custom user properties or themes.
3. [ ] Verify that current developer environment states are logged.

---

## 🧹 Local Web Cache Reset
Reset local storage properties to clear administrative sessions and theme overrides.
1. [ ] Open Web Developer Tools (F12) in target browser.
2. [ ] Direct to the **Application** or **Storage** pane.
3. [ ] Select **Local Storage** under the active domain URL.
4. [ ] Run clear commands or delete these keys:
   - `tuc_admin_authenticated` (Clears active admin login session)
   - `tuc_app_theme` (Resets interface to default light canvas)
   - `tuc_audit_logs` (Purges local simulation audit telemetry)
   - `tuc_completed_essay_ids` (Resets index read progress)
5. [ ] Refresh browser page (Ctrl + F5 for hard reload).

---

## 📦 Service Dependencies Reset
Purge node modules and local compilation directories for a fresh dependency load.
1. [ ] Terminate active Vite or Node development servers.
2. [ ] Delete the dependency directory and lock files:
   ```bash
   rm -rf node_modules
   rm -f package-lock.json
   ```
3. [ ] Clear local NPM package cache:
   ```bash
   npm cache clean --force
   ```
4. [ ] Re-install development and production dependencies:
   ```bash
   npm install
   ```

---

## 🐳 Docker Container & Nginx Proxy Reset
Reset active Docker virtual networks and reload Ingress systems on Plesk.
1. [ ] Power down active Compose services:
   ```bash
   docker-compose down --volumes --rmi local
   ```
2. [ ] Prune unused network components:
   ```bash
   docker network prune -f
   ```
3. [ ] Build and launch virtualized application containers using fresh volumes:
   ```bash
   docker-compose up -d --build
   ```
4. [ ] Reload the custom Nginx web serving configuration:
   ```bash
   nginx -s reload
   ```

---

## 🔌 Capacitor Mobile Integration Reset
Re-enable fresh native layers on Capacitor iOS and Android configurations.
1. [ ] Clean existing iOS/Android compilation workspaces:
   ```bash
   npx cap clean
   ```
2. [ ] Eliminate existing native platforms directories:
   ```bash
   rm -rf ios android
   ```
3. [ ] Generate fresh native project wrapper files:
   ```bash
   npx cap add ios
   npx cap add android
   ```
4. [ ] Sync dist resources to the fresh wrappers:
   ```bash
   npx cap sync
   ```

---
*Operational Checklist authorized by Head of ICT Daniel Twum. Confirmed with ✅ before initiating any operations.*
