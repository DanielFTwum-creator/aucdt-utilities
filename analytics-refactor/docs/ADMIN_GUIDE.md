# Admin Guide

## Accessing the Admin Panel

1. Navigate to the dashboard (`http://localhost:3000` or production URL).
2. Click **Sign In** (top right of the header).
3. Enter admin credentials from your `.env` file:
   - Username: `VITE_ADMIN_USERNAME`
   - Password: `VITE_ADMIN_PASSWORD`
4. After successful login, the **Admin Panel** tab appears in the dashboard.

**Default dev credentials:** `admin` / `analytics2024`
Change these before any production deployment.

---

## Admin Panel Features

### Audit Log

Every significant user action is recorded:

| Event | Trigger |
|---|---|
| `ADMIN_LOGIN` | Successful admin sign-in |
| `ADMIN_LOGOUT` | Sign-out button clicked |
| `EXPORT_PDF` / `EXPORT_CSV` / `EXPORT_EXCEL` | File exported |
| `DATA_IMPORT` | JSON file imported |
| `DATE_FILTER` | Date range filter applied |

Logs are stored in `sessionStorage` and cleared on page reload. To persist logs, use the **Download Audit Log** button in the Admin Panel.

### Statistics

The admin panel shows live counts for:
- Total sessions since page load
- Export count by format
- Filter changes applied
- Data import events

### Data Management

**Import data:**
1. Click **Import JSON** in the Admin Panel.
2. Select a phpMyAdmin-exported JSON file.
3. The app validates the file and, if valid, replaces the current dataset.

**Reset to default:**
Reload the page — default data from `public/data/` is re-fetched.

---

## Security Notes

- Credentials are stored in `import.meta.env` (build-time) and compared client-side.
- This is suitable for internal dashboards on a private network.
- For public-facing deployments, replace with a server-side auth flow (TUC Auth API).
- Admin token is stored in `sessionStorage` (not `localStorage`) — cleared on tab close.

---

## Account Lockout

After **5 consecutive failed login attempts**, the sign-in form is locked for **15 minutes**. The lockout is tracked in `sessionStorage`.

To reset during development, open DevTools → Application → Session Storage → clear `adminLockout`.
