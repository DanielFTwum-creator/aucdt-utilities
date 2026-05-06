# Admin Guide - Container Health Auditor (App ID 110)

## 1. Access Control
- **Login URL**: `/login`
- **Default Credentials**: `admin` / `admin` (Change immediately in production!)
- **Role**: Administrator (Full Access)

## 2. System Monitoring
Navigate to **Admin > Diagnostics** to view:
- API Latency
- Database Connection Status
- Metric Ingestion Rate

## 3. Database Management
Navigate to **Admin > DB Monitor** to view:
- Database Size (Quota Usage)
- Query Performance (Latency)
- Active Connections

## 4. Sentinel Integration
Navigate to **Admin > Sentinel Interface** to:
- View the live JSON health report sent to The Sentinel.
- Simulate autonomous remediation actions (e.g., Scaling, Restarting).
- View orchestrator logs.

## 5. Troubleshooting
### Common Issues
- **Missing Metrics**: Check Prometheus connection in `server.ts`.
- **High Latency**: Check Database Monitor for slow queries.
- **Login Failed**: Verify `authStore` state or clear local storage.

### Logs
View system logs at **Admin > Logs**. Use filters to isolate ERROR or WARN events.
