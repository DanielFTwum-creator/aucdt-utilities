# YouTube Description Genie — Admin Guide

**Document ID:** TUC-YTG-ADMIN-2026-001
**Version:** 1.0
**Last Updated:** 30 June 2026
**Audience:** ICT Administrators, Techbridge University College

## Table of Contents

1. [Introduction](#introduction)
2. [Accessing the Admin Panel](#accessing-the-admin-panel)
3. [Usage Statistics](#usage-statistics)
4. [Data Management](#data-management)
5. [Session Audit Log](#session-audit-log)
6. [Environment Variables](#environment-variables)
7. [Changing the Admin Password](#changing-the-admin-password)
8. [Security Notes](#security-notes)
9. [Troubleshooting](#troubleshooting)
10. [Contact and Support](#contact-and-support)

---

## Introduction

The YouTube Description Genie is a TUC AI tool that generates optimised YouTube video descriptions for music releases. It is deployed at:

```
https://ai-tools.techbridge.edu.gh/youtube-genie/
```

Access is restricted to TUC Google accounts (`@techbridge.edu.gh` or authorised personal accounts). The admin panel provides usage statistics, data management, and a session-scoped audit log.

---

## Accessing the Admin Panel

The admin panel is accessible via URL hash navigation. It is not linked from the main UI.

**Admin URL:**
```
https://ai-tools.techbridge.edu.gh/youtube-genie/#/admin
```

On arrival you will see a password prompt. Enter the admin password (set via the `VITE_ADMIN_PASSWORD` build variable — see [Environment Variables](#environment-variables)).

**Lockout policy:** After 5 consecutive failed attempts the login form is disabled for the remainder of the browser session. To reset, close the tab and reopen the URL.

---

## Usage Statistics

The dashboard displays two counters pulled from the user's browser `localStorage`:

| Stat | Description |
|---|---|
| **Total Generations** | Number of AI descriptions generated in this browser |
| **Last Used** | Date and time of the most recent generation (displayed in UK English locale) |

These figures are per-browser, not server-side aggregates. They reflect usage from the device running the admin panel, not the full user base.

---

## Data Management

The **Clear All Stats and Form Data** button in the Data Management section removes the following keys from the current browser's `localStorage`:

| Key | Contents |
|---|---|
| `youtube-genie-stats` | Generation count and last-used timestamp |
| `youtube-genie-form-data` | The user's last saved form inputs |

This action is recorded in the session audit log. Once cleared, the button becomes disabled for the remainder of the session to prevent accidental double-clearing.

**Note:** This only affects the browser where the action is performed. It does not affect other users or other devices.

---

## Session Audit Log

The audit log records significant admin events during the current browser session. Events are stored in `sessionStorage` under the key `youtube-genie-admin-audit` and are cleared automatically when the tab is closed.

Up to 20 events are retained, with the most recent at the top.

**Recorded event types:**

| Event | Trigger |
|---|---|
| `Admin login successful` | Correct password entered |
| `Admin cleared all stats and form data` | Clear button clicked |
| `Admin logout` | Exit Admin button clicked |

Each entry shows the time in `HH:MM:SS` format (en-GB locale) and the event description.

**Limitation:** Because events are session-only, the log does not persist across tab or browser restarts. For persistent audit records, server-side logging would need to be added to a future release.

---

## Environment Variables

These variables are set at build time and baked into the frontend bundle. Changes require a redeployment (`.\deploy.ps1 -Build` from Windows PowerShell).

| Variable | Purpose | Default |
|---|---|---|
| `VITE_ADMIN_PASSWORD` | Admin panel password | `tuc-ict-2026` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for the login gate | (required — no default) |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth callback URL | `https://ai-tools.techbridge.edu.gh/youtube-genie/callback` |

Server-side variables (set in `.env` on the production server — never in the bundle):

| Variable | Purpose |
|---|---|
| `GOOGLE_CLIENT_SECRET` | Google OAuth token exchange — server-side only |
| `GEMINI_PROXY_KEY` | Authenticates with the WMS Gemini key proxy |
| `PORT` | Node.js server port (default: `3028`) |

**To change a build-time variable:**
1. Update `.env.local` on the developer machine
2. Run `.\deploy.ps1 -Build` from the `enhanced-youtube-genie` directory
3. The server will rebuild and restart the PM2 process automatically

---

## Changing the Admin Password

The admin password is set via the `VITE_ADMIN_PASSWORD` build variable in `.env.local`.

1. Open `C:\Development\github\aucdt-utilities\enhanced-youtube-genie\.env.local`
2. Add or update the line:
   ```
   VITE_ADMIN_PASSWORD=your-new-password
   ```
3. Deploy:
   ```powershell
   cd C:\Development\github\aucdt-utilities\enhanced-youtube-genie
   .\deploy.ps1 -Build
   ```

The new password takes effect immediately after the PM2 process restarts.

**Important:** The default password `tuc-ict-2026` must be changed before giving any user access to the admin URL. The password is baked into the JavaScript bundle — it is not cryptographically secure, but it is sufficient to prevent casual access. Treat the admin URL itself as the primary security boundary.

---

## Security Notes

- The admin panel is client-side only. There is no server-side auth for `#/admin`. The URL itself is the access control.
- Do not link the admin URL from any public-facing page or share it outside the ICT team.
- The admin password is visible in the compiled JavaScript bundle (obfuscated but not encrypted). Rotate it if the bundle is ever exposed or the URL is shared accidentally.
- The Google OAuth gate applies to all users including admins. You must be signed in with an authorised Google account before the admin URL is reachable.
- All AI calls route through the WMS Gemini proxy (`wms.techbridge.edu.gh`). The browser never calls Gemini directly. The `GEMINI_API_KEY` was revoked — do not attempt to restore it.
- No user data is sent to any third party. Form input is sent to the TUC WMS backend, which forwards to Gemini under the institution's API key.

---

## Troubleshooting

### Admin panel shows the login form but password is not accepted

1. Check that `VITE_ADMIN_PASSWORD` was set in `.env.local` before the last build
2. Confirm the build completed without errors (`.\deploy.ps1 -Build`)
3. If the password was never explicitly set, try the default: `tuc-ict-2026`
4. If still failing, check the compiled bundle for the variable:
   ```powershell
   ssh root@techbridge.edu.gh "grep -r 'tuc-ict' /var/www/vhosts/techbridge.edu.gh/ai-tools.techbridge.edu.gh/youtube-genie/dist/ 2>/dev/null | head -1"
   ```

### Locked out after 5 failed attempts

Close the browser tab entirely and navigate back to the admin URL. The lockout is session-scoped and resets on tab close.

### Stats show zero even after use

The stats are stored in the browser that generated descriptions — not the browser running the admin panel. If you are checking from a different device or browser, the count will be zero for that device.

### PM2 process is not running

```powershell
ssh root@techbridge.edu.gh "pm2 status youtube-genie"
```

If the status shows `stopped` or `errored`:
```powershell
ssh root@techbridge.edu.gh "pm2 restart youtube-genie && pm2 logs youtube-genie --lines 20"
```

If the process does not exist at all, redeploy:
```powershell
cd C:\Development\github\aucdt-utilities\enhanced-youtube-genie
.\deploy.ps1 -Build
```

### The app returns 502 Bad Gateway

The nginx reverse proxy cannot reach port 3028. Check:

1. PM2 process is running (see above)
2. Port is listening: `ssh root@techbridge.edu.gh "ss -tlnp | grep 3028"`
3. nginx config: `/var/www/vhosts/system/ai-tools.techbridge.edu.gh/conf/vhost_nginx.conf`

---

## Contact and Support

- **ICT Email:** ict@tuc.edu.gh
- **Head of ICT:** Daniel Frempong Twum — daniel.twum@techbridge.edu.gh
- **Office:** ICT Department, Techbridge University College, Oyibi, Greater Accra, Ghana

---

**Document Status:** Final — Version 1.0
**Next Review Date:** 30 June 2027
