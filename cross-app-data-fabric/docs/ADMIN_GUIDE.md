# Admin Guide - Cross-App Data Fabric (App ID 162)

## Admin Access

**Default Credentials:**
- Username: `admin`
- Password: `admin`

**IMPORTANT:** Change these credentials in production!

## Admin Panel Features

### 1. Diagnostics (`/admin/diagnostics`)
System self-checks and health diagnostics

### 2. Database Monitor (`/admin/db-monitor`)
Database size, query performance, connection status

### 3. Logs (`/admin/logs`)
System logs with filtering and search

### 4. Performance (`/admin/performance`)
Real-time system resource monitoring

### 5. Testing (`/admin/testing`)
Automated test suite runner

### 6. Sentinel Console (`/admin/sentinel`)
**PRIMARY INTERFACE FOR THE SENTINEL**

- View health reports sent to Sentinel
- Monitor remediation actions
- Simulate autonomous operations
- View orchestrator logs

## Monitoring

### Health Score Algorithm

Health scores are calculated based on:
- Entity status (active/inactive)
- Performance metrics
- Error rates
- Resource utilization

Thresholds:
- **Healthy:** 80-100%
- **Warning:** 50-79%
- **Critical:** 0-49%

## Troubleshooting

### Issue: Database locked
```bash
rm cad.db
npm run dev  # Reinitialize
```

### Issue: Admin login not working
Check browser console for authentication errors

### Issue: Sentinel connection failed
Verify SENTINEL_URL environment variable

## Maintenance

### Backup Database
```bash
cp cad.db cad_backup_$(date +%Y%m%d).db
```

### Clear Database
```bash
rm cad.db
npm run dev  # Will reseed
```
