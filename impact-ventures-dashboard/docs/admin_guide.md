# Admin Guide — Impact Ventures Dashboard

## Accessing the Admin Panel

Navigate to `#/admin` (append `#/admin` to the app URL). You will be prompted for the admin password.

**Default password:** `admin123`  
Change this in `src/App.tsx` → `ADMIN_PASSWORD` constant before deploying to production.

## Session Management

- Session persists in `sessionStorage` for the browser tab lifetime.
- Closing the tab clears the session automatically.
- Click **Logout** to end the session manually.

## Audit Log

All significant actions are logged automatically:

| Event | Trigger |
|---|---|
| `ADMIN_LOGIN_SUCCESS` | Correct password entered |
| `ADMIN_LOGIN_FAIL` | Incorrect password attempt |
| `ADMIN_LOGOUT` | Logout button clicked |
| `DIAGNOSTIC_RUN` | Storage test executed |

- Logs are stored in `localStorage` under key `impact-ventures-audit-logs`
- Maximum 200 entries retained (oldest entries trimmed automatically)
- Timestamps shown in local browser timezone

## Diagnostics Tab

| Check | Description |
|---|---|
| LocalStorage Access | Verifies browser storage read/write works |
| Portfolio Count | Displays current APP_DATA length (data integrity) |
| Gemini API Key | Checks if `GEMINI_API_KEY` env var is present |

## Security Notes

- The admin password is hardcoded in the frontend bundle — this is suitable for internal/demo use only
- For production with sensitive data, replace with a proper backend authentication flow
- Session tokens are not transmitted to any server; they exist only in the user's browser
