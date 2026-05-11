
# Administrator Manual
## AI @ TechBridge Portal

### 1. Security Node Access
The Admin Dashboard is the command center for the TechBridge AI portal. It provides visibility into system health, audit logs, and diagnostic tools.

**Access URL**: Navigate to the "Admin Node" via the footer or navbar.

**Credentials (Phase 1)**:
- **Key**: `admin123` or `tb_admin_2025`
- *Note*: In production, this maps to the university SSO provider.

### 2. Session Security
To comply with SOC 2 standards, the system enforces a strict inactivity policy:
- **Timeout**: 5 Minutes (300 Seconds).
- **Triggers**: Lack of mouse movement, keyboard input, or clicks.
- **Action**: The session is immediately terminated, and a `SESSION_TIMEOUT` event is written to the ledger.

### 3. Audit Log Interpretation
The "Audit Intelligence" panel displays a live feed of system events.

| Event Type | Description | Severity |
|------------|-------------|----------|
| `LOGIN_SUCCESS` | Authorized user gained access. | Low |
| `LOGIN_FAILURE` | Invalid key attempted. Potential breach. | High |
| `SESSION_TIMEOUT` | Automated security termination. | Low |
| `CACHE_PURGE` | Manual reset of local security storage. | Medium |

### 4. Emergency Procedures
**System Lockout**:
If you are unable to log in, clear your browser's Local Storage to reset the session state.
```javascript
localStorage.clear()
```

**Audit Export**:
To export logs for external compliance review, open the browser console and run:
```javascript
console.table(JSON.parse(localStorage.getItem('tb_audit_logs')))
```
