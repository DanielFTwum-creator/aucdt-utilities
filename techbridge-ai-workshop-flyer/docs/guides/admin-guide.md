# Administrator Guide
**Project:** Techbridge AI Workshop Flyer
**Version:** 1.0

---

## 1. Accessing the Admin Panel
There are two methods to access the secured Administrator Dashboard:

1.  **UI Footer Link**: Scroll to the very bottom right of the page. Click the faint "Admin" text link.
2.  **Keyboard Shortcut**: Press `Ctrl + Shift + A` simultaneously anywhere on the page.

## 2. Authentication
*   **Default Password**: `admin`
*   **Note**: This password is hardcoded for demonstration purposes. For production use, see `components/AdminPanel.tsx` line 25 to update logic.

## 3. Dashboard Features

### 3.1 Audit Logs
The **Audit Logs** tab tracks user interactions within the current session.
*   **Events Tracked**: Login attempts, theme changes, dashboard toggles.
*   **Data Persistence**: Logs are stored in-memory. Reloading the page clears the logs.
*   **Clear History**: Use the "Clear History" button to wipe the current session logs.

### 3.2 Diagnostics (Self-Testing)
The **Diagnostics** tab provides tools to verify system integrity.
*   **Run Diagnostics**: Click this button to execute the client-side test suite (`utils/diagnostics.ts`).
*   **Checks Performed**:
    *   DOM Integrity (Root/Main elements existence).
    *   Theme System (CSS Variable injection).
    *   Accessibility (Alt text compliance).
    *   Interactive Controls (Focusable buttons).
    *   Content Rendering (Speaker cards).

## 4. Theme Management
The administrator can verify visual integrity across three modes using the floating toggle widget in the top-right corner:
*   ☀️ **Light Mode**: Professional, high-readability.
*   🌙 **Dark Mode**: Default Sci-Fi aesthetic.
*   👁️‍🗨️ **High Contrast**: WCAG AAA compliance (pure black/yellow).

## 5. Troubleshooting
*   **Panel won't open**: Ensure no browser extensions are blocking keyboard shortcuts.
*   **Logs empty**: Logs are volatile. If the page was refreshed, logs are lost.
*   **Diagnostics Fail**: Check the browser console (F12) for detailed error messages if the UI shows a "Fail" status.
