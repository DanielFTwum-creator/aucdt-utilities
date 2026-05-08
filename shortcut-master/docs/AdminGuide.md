# Administrator Guide
## Shortcut Master Application

### 1. Introduction
This guide is intended for teachers and system administrators responsible for managing the Shortcut Master application.

### 2. Accessing the Admin Panel
1. Navigate to the `/admin` route of the application.
2. Enter the administrative password (Default: `admin123`).
3. Upon successful authentication, you will be redirected to the Admin Dashboard.

### 3. Dashboard Features
- **Diagnostics**: View real-time system health, including React version (19.2.5), API connectivity, and uptime.
- **Audit Logs**: Monitor all administrative actions, including login attempts and test executions.
- **Self-Testing**: Access the "Self-Testing" tab to run automated browser tests.

### 4. Running Self-Tests
1. Go to the **Self-Testing** tab in the Admin Dashboard.
2. Click **Run Critical Path** to verify basic navigation and content loading.
3. Click **Test Admin Auth** to verify security protocols.
4. Review the visual confirmation (screenshot) and step-by-step results.

### 5. Troubleshooting
- **AI Not Responding**: Check your internet connection. Ensure the `GEMINI_API_KEY` is correctly configured in the environment.
- **Tests Failing**: Ensure the `APP_URL` environment variable matches the current deployment URL.
