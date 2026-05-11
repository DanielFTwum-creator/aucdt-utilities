# Orbit Walk — Administrator Guide

## Overview
Orbit Walk is a high-precision movement engine designed to encourage healthy work habits via 15-minute rhythmic dings. The administration portal allows TUC-ICT staff to monitor system integrity and security events.

## Accessing the Admin Portal
1. Navigate to the main application interface.
2. Select the **Shield Icon** (Security) in the top-right header navigation.
3. Enter the authorised **TUC Authentication Key**.
   - *Default Key:* Refer to internal `process.env.ADMIN_PASSWORD`.

## Security Audit Logs
The portal provides a real-time view of security-sensitive operations.
- **LOGIN_SUCCESS:** Recorded when an administrator enters the correct key.
- **LOGIN_FAILURE:** Recorded on incorrect password attempts (monitored for brute-force attacks).
- **RUN_TESTS:** Recorded whenever the Puppeteer diagnostic suite is executed.
- **LOGOUT:** Recorded when a session is explicitly terminated.

All logs are stored server-side in `logs/audit.log` for semi-permanent retention.

## System Diagnostics
Under the **System Tests** tab, administrators can verify engine health:
- **Database Status:** Verifies if the local state engine is responsive.
- **FS Mode:** Confirms that the server has write permissions for audit logging.
- **Puppeteer Suite:** Executes four critical end-to-end tests:
  1. **Page Load:** Ensures the Vite middleware is serving the React bundle.
  2. **Timer Init:** Confirms the countdown logic is active and valid.
  3. **Theme Engine:** Verifies that CSS variables update correctly when themes shift.
  4. **Admin Gate:** Ensures the security modal blocks unauthorised access.

## Troubleshooting
- **Logs Not Appearing:** Ensure the `logs` directory exists and has `0755` permissions.
- **Tests Failing:** If "Page Load" fails, restart the Node.js server to reboot the Vite middleware.
- **Authentication Issues:** Sessions expire after 2 hours. If a "Halt Engine" button does not respond, clear cookies or re-authenticate.

---
*Techbridge University College — ICT Department*
