# Testing Guide - Secret Vault Manager (App ID 118)

## Test Strategy

### Unit Tests
- Component testing with Vitest
- Store testing (Zustand)
- Utility function testing

### Integration Tests
- API endpoint testing
- Database operations
- Authentication flows

### E2E Tests
- User workflows
- Admin panel access
- Sentinel integration

## Running Tests

```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## Test Cases

### Authentication
- ✓ Login with valid credentials
- ✓ Login with invalid credentials
- ✓ Protected route access
- ✓ Logout functionality

### API Endpoints
- ✓ GET /api/v1/entities
- ✓ GET /api/v1/dashboard/overview
- ✓ GET /api/v1/sentinel/health-report
- ✓ POST /api/v1/sentinel/remediation

### Database
- ✓ Schema initialization
- ✓ Seed data generation
- ✓ Query performance
- ✓ Data integrity

## Manual Testing Checklist

- [ ] Dashboard loads with data
- [ ] Theme toggle works (dark/light)
- [ ] Admin login flow
- [ ] Health monitoring updates
- [ ] Sentinel console displays reports
- [ ] Remediation simulation works
