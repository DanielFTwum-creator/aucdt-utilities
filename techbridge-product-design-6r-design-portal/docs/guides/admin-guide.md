# Administrator Guide
## TechBridge 6R Workshop Portal - Faculty Hub

### 1. Accessing the Faculty Hub
The Faculty Hub is a restricted area for institutional oversight.
1. Locate the **"Pioneer Portal"** (or **"Faculty Access"** if logged in) button in the header.
2. Click the button to trigger the authentication prompt.
3. Enter the institutional key: `techbridge2024`.

### 2. Monitoring Institutional Logs
The **Institutional Audit Logs** table provides real-time visibility into system usage:
- **Timestamp**: Exact moment of action.
- **Faculty/User**: Identification of the actor (ADMIN or USER_ID).
- **Action Command**: Type of operation (LOGIN, NAV, SECURITY_FAIL, etc.).
- **Operational Details**: Contextual information about the action.

### 3. Log Management
For privacy or reset purposes, logs can be purged:
- Click the **"Clear Records"** button in the Faculty Hub.
- Confirm the browser warning to permanently delete the institutional audit history from LocalStorage.

### 4. Running the Testbed
To verify system integrity:
1. Navigate to the **"Testbed"** tab (visible only to authenticated Faculty).
2. Click **"Execute Suite"** to run the automated validation routines.
3. Review failure snapshots if any test fails.
