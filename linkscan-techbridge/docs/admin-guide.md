# ADMINISTRATOR GUIDE
## LinkScan Techbridge

### 1. Overview
LinkScan Techbridge is used to verify the integrity of paths within the `admissions-dev.techbridge.edu.gh` domain.

### 2. Authentication
- **Route:** `/admin`
- **Default Token:** `adminTUC%`
- Authentication provides access to diagnostic scans and failure simulation tools.

### 3. Running Scans
- **Run Full Suite:** Scans all registered endpoints sequentially.
- **Category Scan:** Scans only a specific group (e.g., API & System).
- **Manual Check:** Click the external link icon to verify manually in a new tab.

### 4. Failure Simulation
Used for testing UI responsiveness to server errors:
- **NORMAL:** Standard behavior using actual server responses.
- **ERR_404:** Force all scan results to return 404 (Not Found).
- **ERR_500:** Force all scan results to return 500 (Internal Error).

### 5. Audit Logs
Located in the sidebar of the admin dashboard. Tracks:
- Authentication attempts.
- Scan execution timestamps.
- Simulation state changes.
