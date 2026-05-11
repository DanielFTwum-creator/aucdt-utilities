# Admin Guide: Animator Agent Desktop
## Version: 3.0.0

---

## 1. Accessing the Admin Section
The admin section is located at `#/admin`. Access is restricted via a password-protected gateway.

### 1.1 Authentication
- **URL**: `http://localhost:3000/#/admin`
- **Default Password**: `admin` (Configurable via `VITE_ADMIN_PASSWORD` in `.env.local`)
- **Lockout Policy**: After 5 failed attempts, the system will lock the admin section for 60 seconds.

## 2. Admin Dashboard
The dashboard provides a high-level overview of the system state:
- **System Status**: Verifies React version, Playwright integration, and state persistence.
- **Recent Auth Activity**: Lists the last 5 authentication events.

## 3. Audit Logging
Every sensitive action is recorded in the Audit Log (`#/admin/audit`):
- **Categories**: `auth`, `project`, `track`, `export`, `admin`, `system`.
- **Persistence**: Logs are saved to browser local storage (max 500 entries).
- **Clearing**: Only authorized admins can clear the log.

## 4. AI Instruction Processing
Admins can monitor AI-driven scene modifications:
- **Engine**: Gemini 2.0 Flash integration.
- **Diagnostics**: The simulation tool in `#/admin/testing` verifies AI logic integrity.

## 5. Routing & Subdirectory Support
The application uses **HashRouter** to ensure that deep links work correctly even when deployed in subdirectories (e.g., `techbridge.edu.gh/animator/`).
- **Standard URL**: `#/`
- **Admin URL**: `#/admin`

## 6. Keyboard Shortcuts for Admins
- **Cycle Theme**: Available via the theme icon in the admin header.
- **Global Stop**: `Escape` (also works in admin views if the Animator is active in the background).

---
*TUC Institutional Standards Applied*
