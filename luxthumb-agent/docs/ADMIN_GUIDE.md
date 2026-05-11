# LuxThumb Designer — Admin Guide

**Version:** 1.0  
**Date:** 9 May 2026  
**Audience:** System administrators and IT personnel  

---

## 1. Overview

The Admin Panel is a password-protected dashboard within LuxThumb Designer that provides:
- **Audit Logging:** Real-time tracking of all user actions (design saves, exports, deletions)
- **Audit Dashboard:** Summary statistics and expandable log entries
- **Log Management:** Export audit logs (JSON, CSV), clear logs, view audit trail
- **Compliance:** WCAG AA accessible, user agent metadata capture, immutable log retention

This guide covers accessing the admin panel, interpreting logs, and managing audit data.

---

## 2. Accessing the Admin Panel

### 2.1 Open Admin Panel
1. Navigate to `https://luxthumb.techbridge.edu.gh/`
2. In the sidebar header, locate the **"Admin"** button (top-right corner, icon: lock + gear)
3. Click the button to open the **Admin Login dialog**

### 2.2 Enter Password
1. A modal dialog appears with:
   - Title: "Admin Login"
   - Passcode field (`#admin-password`)
   - "Login" and "Cancel" buttons
2. Enter the admin password: **`admin123`**
3. Click **Login**

### 2.3 Authentication Result
- **Correct password:** Admin Panel displays, sidebar switches to audit dashboard view
- **Incorrect password:** Password field clears, focus returns to input for retry
- **No incorrect-attempt limit:** Re-enter password and retry (no lockout)

### 2.4 Logout
- Click the **Logout** button in the Admin Panel header (red button, top-right)
- Admin panel closes, main app UI restores

---

## 3. Admin Dashboard Overview

Once logged in, the Admin Panel displays:

### 3.1 Header
```
┌─────────────────────────────────────────┐
│ ADMIN CONSOLE  │  Audit Dashboard │ [Logout]
└─────────────────────────────────────────┘
```
- Left: Section label and title
- Right: Red "Logout" button

### 3.2 Control Buttons
```
[ Export JSON ] [ Export CSV ] [ Clear All ]
```
- **Export JSON:** Downloads `luxthumb_audit_logs_{date}.json` containing full audit log array
- **Export CSV:** Downloads `luxthumb_audit_logs_{date}.csv` with headers (Timestamp, Action, Details)
- **Clear All:** Deletes all audit logs from IndexedDB (with confirmation dialog)
- All buttons are **disabled** if audit logs are empty

### 3.3 Statistics Cards
Four cards display aggregated metrics:

| Card | Metric | Purpose |
|---|---|---|
| **Total Entries** | Count of all audit log records | System activity volume |
| **Design Saves** | Count of `design_save` actions | Design history size |
| **Exports** | Count of all `export_format_*` actions | Download frequency |
| **Last Activity** | Timestamp of most recent log | Monitor recency |

Example:
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Total Entries│  │Design Saves  │  │  Exports     │  │Last Activity │
│      47      │  │      12      │  │      28      │  │  2:34:15 PM  │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
```

### 3.4 Audit Log Table
Below the statistics, an expandable log list displays:
- **Row order:** Most recent first (descending by timestamp)
- **Collapsed view:** Shows action badge, timestamp, truncated details
- **Expanded view:** Full log details (ID, action, details, timestamp ISO, user agent metadata)

---

## 4. Understanding Audit Logs

### 4.1 Logged Actions

| Action | Trigger | Details |
|---|---|---|
| `design_save` | User clicks "Save Copy to History" button | Format: `Design saved: {brand name}` |
| `design_delete` | User deletes a saved design | Format: `Design deleted: {design name}` |
| `export_format_png` | User clicks PNG download button | Format: `PNG exported: {filename}.png` |
| `export_format_pdf` | User clicks PDF download button | Format: `PDF exported: {filename}.pdf` |
| `export_format_jpg` | User clicks JPG download button | Format: `JPG exported: {filename}.jpg` |
| `export_format_json` | User clicks JSON config download | Format: `JSON config exported for brand: {brand name}` |

### 4.2 Log Entry Structure
Each log entry contains:
```json
{
  "id": "log_1715266800123_a7b2c9d4",
  "timestamp": 1715266800123,
  "action": "export_format_png",
  "details": "PNG exported: NEXUS_AI_thumbnail.png",
  "ipMetadata": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) ..."
}
```

| Field | Description |
|---|---|
| `id` | Unique identifier: `log_{timestamp}_{random_string}` |
| `timestamp` | Milliseconds since epoch (JavaScript Date compatible) |
| `action` | One of the 7 logged action types |
| `details` | Human-readable description of the action and context |
| `ipMetadata` | First 100 characters of `navigator.userAgent` (not true IP; browser signature) |

### 4.3 Reading Timestamps
- **Collapsed view:** Displayed in user's local timezone (e.g. "15/05/2026, 14:34:15")
- **Expanded view:** Displayed in ISO 8601 UTC format (e.g. "2026-05-15T13:34:15.123Z")
- Conversion: Subtract your timezone offset from UTC timestamp to get local time

---

## 5. Managing Audit Logs

### 5.1 Export Audit Logs

#### JSON Export
1. Click **Export JSON** button
2. Browser downloads file: `luxthumb_audit_logs_2026-05-15.json`
3. File contains full array of AuditLog objects:
   ```json
   [
     {"id": "log_...", "timestamp": ..., "action": "...", ...},
     {"id": "log_...", "timestamp": ..., "action": "...", ...},
     ...
   ]
   ```
4. Use for programmatic processing, archival, or long-term storage

#### CSV Export
1. Click **Export CSV** button
2. Browser downloads file: `luxthumb_audit_logs_2026-05-15.csv`
3. File is comma-separated with headers:
   ```
   Timestamp,Action,Details
   "15/05/2026, 14:34:15","export_format_png","PNG exported: NEXUS_AI_thumbnail.png"
   "15/05/2026, 14:30:42","design_save","Design saved: NEXUS AI"
   ...
   ```
4. Open in Excel, Google Sheets, or any spreadsheet tool for analysis

### 5.2 View Detailed Logs
1. In the audit log table, click any log entry row
2. Entry expands to show:
   - **ID:** Unique identifier for reference
   - **Action:** Type of action
   - **Details:** Context (e.g. filename, brand name)
   - **Timestamp (ISO):** Date-time in UTC
   - **Metadata:** User agent string (browser/OS fingerprint)
3. Click again to collapse

### 5.3 Clear All Logs
1. Click **Clear All** button
2. Confirmation dialog appears:
   ```
   "Clear all audit logs? This action cannot be undone."
   [OK]  [Cancel]
   ```
3. Click **OK** to confirm deletion (irreversible)
4. All logs deleted from IndexedDB; table refreshes to empty state
5. Statistics cards reset to 0

---

## 6. Log Retention & Storage

### 6.1 Storage Location
- **Medium:** Browser IndexedDB (`luxthumb_audit_logs` key)
- **Scope:** Local storage on the user's device/browser
- **Durability:** Persists across browser sessions until cleared
- **Capacity:** 50 MB+ typical (depends on browser/device)

### 6.2 Retention Policy
- **Maximum entries:** 1000 audit logs per browser session
- **Eviction:** When limit exceeded, oldest logs are purged first
- **No automatic expiry:** Logs persist indefinitely until manually cleared or browser cache is cleared
- **Backup strategy:** Regularly export JSON/CSV for archival

### 6.3 Privacy & Security
- **User agent capture:** First 100 characters of `navigator.userAgent` (not true IP address)
- **No PII collected:** No user names, email, or credentials in logs
- **No request bodies:** Only action type and outcome logged
- **Audit trail:** Transparency-focused; designed for compliance review, not privacy tracking

---

## 7. Troubleshooting

### 7.1 Forgot Admin Password
- Password is hardcoded (demo): **`admin123`**
- If you don't remember it, contact IT department for reset
- *Production note:* Implement OAuth or environment-based secret instead of hardcoded password

### 7.2 Admin Button Not Visible
- Ensure you're on the LuxThumb Designer main page
- Check that JavaScript is enabled in browser
- Look for admin button in top-right corner of sidebar
- If still missing, reload page (F5)

### 7.3 Export Button Disabled
- Export buttons are disabled if no audit logs exist
- Ensure users have performed at least one action (save design, export, etc.)
- Check IndexedDB in browser DevTools: `luxthumb_audit_logs` key should contain array

### 7.4 Logs Not Appearing
- **Browser storage issue:** IndexedDB may be disabled or full
  - Clear browser cache and reload
  - Check Developer Tools → Application → IndexedDB
- **Action not logged:** Verify action type is in the 7 logged types (see section 4.1)
- **Lost on browser close:** If "Delete browsing data on exit" is enabled, logs are cleared

### 7.5 Export File Not Downloading
- Check browser's download settings
- Verify pop-up blocker is not blocking file download
- Try export again; check browser console for errors (F12 → Console tab)

---

## 8. Best Practices

1. **Regular Exports:** Export audit logs weekly or monthly and store externally (drive, cloud)
2. **Review Frequency:** Review audit logs monthly for unusual activity patterns
3. **Clear When Done:** Clear logs periodically to prevent hitting the 1000-entry limit (or export first)
4. **Document Changes:** Note significant events (new feature releases, config changes) in exported logs for context
5. **Multi-Admin Access:** This is a single-password system; for multiple admins, implement OAuth or separate roles
6. **Verify Accuracy:** Cross-check log timestamps with user reports of actions taken
7. **Compliance:** If required by policy, archive exported logs for audit trail retention periods (e.g. 1 year)

---

## 9. Additional Resources

- **SRS Document:** See `docs/TUC-ICT-SRS-2026-LUXTHUMB.md` for full system requirements
- **Architecture:** See `docs/architecture.svg` for system design overview
- **Deployment:** See `docs/DEPLOYMENT_GUIDE.md` for hosting and environment setup
- **Testing:** See `docs/TESTING_GUIDE.md` for admin panel test procedures

---

**Document Owner:** ICT Department, Techbridge University College  
**Last Updated:** 9 May 2026  
**Review Cycle:** Quarterly
