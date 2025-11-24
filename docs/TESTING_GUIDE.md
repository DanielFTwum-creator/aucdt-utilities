# ThesisAI Testing Guide

**Version:** 1.0.0
**Last Updated:** November 24, 2025
**Testing Framework:** Vitest + React Testing Library

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Testing Environment Setup](#testing-environment-setup)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [End-to-End Testing](#end-to-end-testing)
6. [API Testing](#api-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Accessibility Testing](#accessibility-testing)
10. [Manual Testing Procedures](#manual-testing-procedures)
11. [Test Coverage Requirements](#test-coverage-requirements)
12. [Continuous Integration](#continuous-integration)
13. [Bug Reporting](#bug-reporting)
14. [Testing Best Practices](#testing-best-practices)

---

## 1. Testing Overview

### Testing Philosophy

ThesisAI follows a comprehensive testing strategy:

1. **Unit Tests:** Test individual components and functions in isolation
2. **Integration Tests:** Test component interactions and API integrations
3. **End-to-End Tests:** Test complete user workflows
4. **Performance Tests:** Ensure application meets performance requirements
5. **Security Tests:** Validate security measures and identify vulnerabilities

### Testing Stack

- **Test Runner:** Vitest 4.0
- **Testing Library:** React Testing Library 16.3
- **Coverage Tool:** Vitest Coverage (v8)
- **Mock Library:** Vitest built-in mocks
- **E2E Testing:** Playwright (optional)
- **API Testing:** Vitest + Axios
- **Performance Testing:** Apache Bench, Lighthouse

### Test Coverage Goals

- **Overall Coverage:** 80% minimum
- **Critical Paths:** 100% coverage
- **Unit Tests:** 90% coverage
- **Integration Tests:** 70% coverage

---

## 2. Testing Environment Setup

### 2.1 Install Dependencies

All testing dependencies are already included in `package.json`:

```bash
# Install dependencies
pnpm install

# Verify installation
pnpm list vitest @testing-library/react @vitest/coverage-v8
```

### 2.2 Test Configuration

The project includes `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.tsx',
        '**/*.test.ts',
      ],
    },
  },
})
```

### 2.3 Test Setup File

Located at `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})
```

### 2.4 Environment Variables for Testing

Create `.env.test`:

```bash
VITE_API_URL=http://localhost:8080/api
VITE_APP_VERSION=1.0.0-test
NODE_ENV=test
```

---

## 3. Unit Testing

### 3.1 Component Testing

#### Example: Testing App Component

Located at `src/test/App.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App Component', () => {
  it('renders the application header', () => {
    render(<App />)
    expect(screen.getByText('ThesisAI')).toBeInTheDocument()
  })

  it('displays the hero section', () => {
    render(<App />)
    expect(screen.getByText('AI-Powered Thesis Assessment')).toBeInTheDocument()
  })

  it('shows feature cards', () => {
    render(<App />)
    expect(screen.getByText('Document Analysis')).toBeInTheDocument()
    expect(screen.getByText('AI Evaluation')).toBeInTheDocument()
    expect(screen.getByText('Detailed Feedback')).toBeInTheDocument()
  })
})
```

#### Example: Testing FeatureCard Component

Located at `src/test/FeatureCard.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FileText } from 'lucide-react'
import App from '../App'

// Note: FeatureCard is internal to App.tsx, so we test it through App
describe('FeatureCard Component', () => {
  it('renders feature card with icon', () => {
    render(<App />)
    const card = screen.getByText('Document Analysis').closest('div')
    expect(card).toBeInTheDocument()
  })

  it('displays feature title and description', () => {
    render(<App />)
    expect(screen.getByText('Document Analysis')).toBeInTheDocument()
    expect(screen.getByText(/Upload thesis documents/)).toBeInTheDocument()
  })
})
```

### 3.2 Running Unit Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run specific test file
pnpm test App.test.tsx

# Run tests matching pattern
pnpm test --grep "renders"
```

### 3.3 Writing New Unit Tests

Template for creating new component tests:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import YourComponent from '../YourComponent'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    const handleClick = vi.fn()
    render(<YourComponent onClick={handleClick} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should display correct data', () => {
    const props = { title: 'Test Title', description: 'Test Description' }
    render(<YourComponent {...props} />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })
})
```

### 3.4 Utility Function Testing

Example testing utility functions:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate, validateEmail, truncateText } from '../utils/helpers'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2025-01-24')
      expect(formatDate(date)).toBe('January 24, 2025')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email', () => {
      expect(validateEmail('user@aucdt.edu.gh')).toBe(true)
    })

    it('rejects invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('truncates long text', () => {
      const text = 'This is a very long text that should be truncated'
      expect(truncateText(text, 20)).toBe('This is a very long...')
    })
  })
})
```

---

## 4. Integration Testing

### 4.1 API Integration Tests

Create `src/test/api/thesis.test.ts`:

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)

describe('Thesis API Integration', () => {
  beforeEach(() => {
    mock.reset()
  })

  afterEach(() => {
    mock.restore()
  })

  it('should fetch thesis list', async () => {
    const mockData = [
      { id: 1, title: 'Test Thesis 1', status: 'completed' },
      { id: 2, title: 'Test Thesis 2', status: 'processing' },
    ]

    mock.onGet('/api/theses').reply(200, mockData)

    const response = await axios.get('/api/theses')
    expect(response.status).toBe(200)
    expect(response.data).toEqual(mockData)
    expect(response.data).toHaveLength(2)
  })

  it('should upload thesis document', async () => {
    const formData = new FormData()
    formData.append('file', new Blob(['test']), 'thesis.pdf')
    formData.append('title', 'Test Thesis')

    mock.onPost('/api/theses').reply(201, { id: 1, status: 'uploaded' })

    const response = await axios.post('/api/theses', formData)
    expect(response.status).toBe(201)
    expect(response.data.status).toBe('uploaded')
  })

  it('should handle API errors', async () => {
    mock.onGet('/api/theses').reply(500, { error: 'Internal Server Error' })

    try {
      await axios.get('/api/theses')
    } catch (error: any) {
      expect(error.response.status).toBe(500)
      expect(error.response.data.error).toBe('Internal Server Error')
    }
  })
})
```

### 4.2 Component Integration Tests

Test components with API interactions:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThesisUploadForm from '../components/ThesisUploadForm'
import axios from 'axios'

vi.mock('axios')

describe('ThesisUploadForm Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should submit thesis successfully', async () => {
    const mockPost = vi.mocked(axios.post).mockResolvedValue({
      data: { id: 1, status: 'uploaded' },
      status: 201,
    })

    render(<ThesisUploadForm />)

    const file = new File(['thesis content'], 'thesis.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload file/i)

    await userEvent.upload(input, file)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1)
      expect(screen.getByText(/uploaded successfully/i)).toBeInTheDocument()
    })
  })

  it('should display error on upload failure', async () => {
    vi.mocked(axios.post).mockRejectedValue({
      response: { data: { error: 'File too large' }, status: 413 },
    })

    render(<ThesisUploadForm />)

    const file = new File(['thesis content'], 'thesis.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/upload file/i)

    await userEvent.upload(input, file)
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/file too large/i)).toBeInTheDocument()
    })
  })
})
```

### 4.3 Running Integration Tests

```bash
# Run all integration tests
pnpm test -- --grep "Integration"

# Run specific integration test suite
pnpm test api/thesis.test.ts
```

---

## 5. End-to-End Testing

### 5.1 E2E Testing Setup (Playwright)

```bash
# Install Playwright (optional for E2E)
pnpm add -D @playwright/test

# Initialize Playwright
npx playwright install
```

### 5.2 E2E Test Example

Create `e2e/thesis-submission.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Thesis Submission Flow', () => {
  test('should complete full thesis submission', async ({ page }) => {
    // Navigate to application
    await page.goto('https://thesisai.aucdt.edu.gh')

    // Login
    await page.fill('[name="email"]', 'student@aucdt.edu.gh')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Wait for dashboard
    await expect(page).toHaveURL(/dashboard/)

    // Navigate to upload page
    await page.click('text=Upload Thesis')

    // Fill form
    await page.fill('[name="title"]', 'AI in Education')
    await page.fill('[name="abstract"]', 'This thesis explores...')
    await page.selectOption('[name="degree_level"]', 'master')

    // Upload file
    const fileInput = await page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-thesis.pdf')

    // Submit
    await page.click('button:has-text("Submit Thesis")')

    // Verify success
    await expect(page.locator('.success-message')).toBeVisible()
    await expect(page.locator('.success-message')).toContainText('submitted successfully')
  })
})
```

### 5.3 Running E2E Tests

```bash
# Run E2E tests
npx playwright test

# Run in headed mode
npx playwright test --headed

# Run specific test
npx playwright test thesis-submission.spec.ts

# Generate test report
npx playwright show-report
```

---

## 6. API Testing

### 6.1 Manual API Testing with cURL

#### Authentication Endpoints

```bash
# Register new user
curl -X POST https://thesisai.aucdt.edu.gh/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@aucdt.edu.gh",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student",
    "department": "Computer Science",
    "studentId": "CS2025001"
  }'

# Login
curl -X POST https://thesisai.aucdt.edu.gh/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@aucdt.edu.gh",
    "password": "password123"
  }'

# Expected response:
# {
#   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": { "id": 1, "email": "student@aucdt.edu.gh", "role": "student" }
# }
```

#### Thesis Endpoints

```bash
# Get JWT token from login response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# List all theses
curl -X GET https://thesisai.aucdt.edu.gh/api/theses \
  -H "Authorization: Bearer $TOKEN"

# Get specific thesis
curl -X GET https://thesisai.aucdt.edu.gh/api/theses/1 \
  -H "Authorization: Bearer $TOKEN"

# Upload thesis
curl -X POST https://thesisai.aucdt.edu.gh/api/theses \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@thesis.pdf" \
  -F "title=AI in Education" \
  -F "abstract=This thesis explores..." \
  -F "fieldOfStudy=Computer Science" \
  -F "degreeLevel=master"

# Update thesis
curl -X PUT https://thesisai.aucdt.edu.gh/api/theses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "abstract": "Updated abstract"
  }'

# Delete thesis
curl -X DELETE https://thesisai.aucdt.edu.gh/api/theses/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### Assessment Endpoints

```bash
# Create assessment
curl -X POST https://thesisai.aucdt.edu.gh/api/assessments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "thesisId": 1,
    "assessmentType": "ai"
  }'

# Get assessment results
curl -X GET https://thesisai.aucdt.edu.gh/api/assessments/1 \
  -H "Authorization: Bearer $TOKEN"

# List assessments for thesis
curl -X GET https://thesisai.aucdt.edu.gh/api/theses/1/assessments \
  -H "Authorization: Bearer $TOKEN"
```

### 6.2 Automated API Testing

Create `src/test/api/integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'
let authToken: string

describe('API Integration Tests', () => {
  it('should register a new user', async () => {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email: `test${Date.now()}@aucdt.edu.gh`,
      password: 'TestPassword123!',
      firstName: 'Test',
      lastName: 'User',
      role: 'student',
      department: 'CS',
    })

    expect(response.status).toBe(201)
    expect(response.data).toHaveProperty('id')
  })

  it('should login and receive token', async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'student@aucdt.edu.gh',
      password: 'password123',
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('token')
    authToken = response.data.token
  })

  it('should access protected endpoint with token', async () => {
    const response = await axios.get(`${BASE_URL}/theses`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.status).toBe(200)
    expect(Array.isArray(response.data)).toBe(true)
  })
})
```

---

## 7. Performance Testing

### 7.1 Load Testing with Apache Bench

```bash
# Install Apache Bench
sudo apt install apache2-utils -y

# Basic load test
ab -n 1000 -c 50 https://thesisai.aucdt.edu.gh/

# Test with authentication
ab -n 500 -c 25 -H "Authorization: Bearer $TOKEN" \
   https://thesisai.aucdt.edu.gh/api/theses

# Test file upload endpoint
ab -n 100 -c 10 -p thesis.pdf -T application/pdf \
   https://thesisai.aucdt.edu.gh/api/theses/upload
```

### 7.2 Frontend Performance Testing

#### Lighthouse Testing

```bash
# Install Lighthouse
npm install -g lighthouse

# Run Lighthouse audit
lighthouse https://thesisai.aucdt.edu.gh \
  --output html \
  --output-path ./lighthouse-report.html \
  --chrome-flags="--headless"

# View report
xdg-open lighthouse-report.html
```

#### Performance Metrics Targets

| Metric | Target | Description |
|--------|--------|-------------|
| First Contentful Paint | < 1.8s | Time until first content renders |
| Time to Interactive | < 3.8s | Time until page is fully interactive |
| Speed Index | < 3.4s | How quickly content is visually displayed |
| Total Blocking Time | < 200ms | Sum of all time periods between FCP and TTI |
| Largest Contentful Paint | < 2.5s | Time until largest content element renders |
| Cumulative Layout Shift | < 0.1 | Measure of visual stability |

### 7.3 Database Performance Testing

```bash
# Connect to database
docker exec -it thesisai-postgres psql -U thesisai_user -d thesisai_db

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM theses WHERE user_id = 1;

# Check slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

# Check table statistics
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 8. Security Testing

### 8.1 SSL/TLS Testing

```bash
# Test SSL configuration
openssl s_client -connect thesisai.aucdt.edu.gh:443

# Check certificate expiry
echo | openssl s_client -servername thesisai.aucdt.edu.gh \
  -connect thesisai.aucdt.edu.gh:443 2>/dev/null | \
  openssl x509 -noout -dates

# Online SSL test
# Visit: https://www.ssllabs.com/ssltest/
```

### 8.2 Security Headers Testing

```bash
# Check security headers
curl -I https://thesisai.aucdt.edu.gh/ | grep -E \
  "(Strict-Transport|X-Frame|X-Content|X-XSS|Content-Security)"

# Expected headers:
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
```

### 8.3 Vulnerability Scanning

```bash
# Install OWASP ZAP
sudo apt install zaproxy -y

# Basic security scan
zap-cli quick-scan --self-contained \
  --start-options '-config api.disablekey=true' \
  https://thesisai.aucdt.edu.gh

# Install Nikto
sudo apt install nikto -y

# Run Nikto scan
nikto -h https://thesisai.aucdt.edu.gh -output nikto-report.html
```

### 8.4 Authentication Testing

#### Test JWT Token Expiration

```bash
# Login and get token
TOKEN=$(curl -X POST https://thesisai.aucdt.edu.gh/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@aucdt.edu.gh","password":"password123"}' \
  | jq -r '.token')

# Test with valid token
curl -H "Authorization: Bearer $TOKEN" \
  https://thesisai.aucdt.edu.gh/api/theses

# Test with expired token (wait 24+ hours or set short expiry in dev)
curl -H "Authorization: Bearer $EXPIRED_TOKEN" \
  https://thesisai.aucdt.edu.gh/api/theses
# Expected: 401 Unauthorized

# Test with invalid token
curl -H "Authorization: Bearer invalid_token" \
  https://thesisai.aucdt.edu.gh/api/theses
# Expected: 401 Unauthorized
```

---

## 9. Accessibility Testing

### 9.1 Automated Accessibility Testing

```bash
# Install axe-core
pnpm add -D @axe-core/react

# Run accessibility tests
pnpm test -- --grep "accessibility"
```

### 9.2 Accessibility Test Example

```typescript
import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import App from '../App'

expect.extend(toHaveNoViolations)

describe('Accessibility Tests', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

### 9.3 Manual Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators are visible
- [ ] Screen reader compatible
- [ ] No flashing content that could trigger seizures
- [ ] Semantic HTML elements used correctly
- [ ] ARIA attributes used where appropriate
- [ ] Error messages are clear and accessible

---

## 10. Manual Testing Procedures

### 10.1 User Registration Flow

1. Navigate to registration page
2. Fill in all required fields:
   - Email: `newuser@aucdt.edu.gh`
   - Password: `SecurePassword123!`
   - First Name: `John`
   - Last Name: `Doe`
   - Role: Select `Student`
   - Department: `Computer Science`
   - Student ID: `CS2025999`
3. Click "Register" button
4. Verify success message appears
5. Verify email confirmation sent (if applicable)
6. Verify redirect to login or dashboard

### 10.2 Login Flow

1. Navigate to login page
2. Enter email: `student@aucdt.edu.gh`
3. Enter password: `password123`
4. Click "Login" button
5. Verify redirect to dashboard
6. Verify user name displayed in header
7. Test "Remember Me" checkbox
8. Test "Forgot Password" link

### 10.3 Thesis Upload Flow

1. Login as student
2. Navigate to "Upload Thesis" page
3. Fill thesis details:
   - Title: `AI in Education Research`
   - Abstract: `This thesis explores...`
   - Field of Study: `Computer Science`
   - Degree Level: `Master's`
4. Click "Choose File" and select PDF (< 50MB)
5. Verify file name displays
6. Click "Upload" button
7. Verify progress indicator shows
8. Verify success message
9. Verify thesis appears in "My Theses" list

### 10.4 Assessment Review Flow

1. Login as faculty
2. Navigate to "Pending Assessments"
3. Click on thesis to review
4. View thesis document
5. Review AI-generated assessment
6. Modify scores if needed
7. Add manual feedback
8. Submit final assessment
9. Verify notification sent to student

### 10.5 Cross-Browser Testing

Test on the following browsers:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 10.6 Responsive Design Testing

Test on the following screen sizes:

- [ ] Mobile (320px - 480px)
- [ ] Tablet (481px - 768px)
- [ ] Desktop (769px - 1024px)
- [ ] Large Desktop (1025px+)

---

## 11. Test Coverage Requirements

### 11.1 Running Coverage Reports

```bash
# Run tests with coverage
pnpm test:coverage

# View coverage report in browser
open coverage/index.html
```

### 11.2 Coverage Thresholds

Configure in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
})
```

### 11.3 Coverage Report Example

```
-------------------------------|---------|----------|---------|---------|
File                          | % Stmts | % Branch | % Funcs | % Lines |
-------------------------------|---------|----------|---------|---------|
All files                     |   95.83 |    91.67 |     100 |   95.83 |
 src                          |   95.83 |    91.67 |     100 |   95.83 |
  App.tsx                     |     100 |      100 |     100 |     100 |
  main.tsx                    |     100 |      100 |     100 |     100 |
-------------------------------|---------|----------|---------|---------|
```

---

## 12. Continuous Integration

### 12.1 GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8.15.0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run linter
        run: pnpm lint

      - name: Run tests
        run: pnpm test

      - name: Run coverage
        run: pnpm test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          fail_ci_if_error: true
```

---

## 13. Bug Reporting

### 13.1 Bug Report Template

```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable, add screenshots

## Environment
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 96, Firefox 95]
- Device: [e.g., Desktop, iPhone 13]
- Screen Size: [e.g., 1920x1080]

## Additional Context
Any other context about the problem
```

### 13.2 Severity Levels

- **Critical:** System crash, data loss, security vulnerability
- **High:** Major functionality broken, no workaround
- **Medium:** Functionality impaired, workaround available
- **Low:** Minor issue, cosmetic problem

---

## 14. Testing Best Practices

### 14.1 General Testing Principles

1. **Write tests first** (TDD approach when possible)
2. **Keep tests simple and focused** (one assertion per test)
3. **Use descriptive test names** (should read like documentation)
4. **Avoid test interdependencies** (tests should run in any order)
5. **Mock external dependencies** (APIs, databases, third-party services)
6. **Test edge cases** (null, undefined, empty, very large values)
7. **Maintain test code quality** (tests should be as clean as production code)

### 14.2 Test Naming Convention

```typescript
// Good
it('should display error message when email is invalid', () => {})

// Bad
it('test1', () => {})
```

### 14.3 AAA Pattern

Structure tests using Arrange-Act-Assert:

```typescript
it('should calculate total price correctly', () => {
  // Arrange
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 },
  ]

  // Act
  const total = calculateTotal(items)

  // Assert
  expect(total).toBe(35)
})
```

### 14.4 Test Data Management

```typescript
// Use test fixtures
const mockUser = {
  id: 1,
  email: 'test@aucdt.edu.gh',
  role: 'student',
}

const mockThesis = {
  id: 1,
  title: 'Test Thesis',
  userId: 1,
  status: 'completed',
}

// Use factories for complex objects
function createMockThesis(overrides = {}) {
  return {
    id: 1,
    title: 'Test Thesis',
    abstract: 'Test abstract',
    status: 'uploaded',
    ...overrides,
  }
}
```

---

## Testing Checklist

### Before Release

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] E2E tests passing
- [ ] Code coverage meets requirements (80%+)
- [ ] Manual testing completed
- [ ] Cross-browser testing done
- [ ] Responsive design tested
- [ ] Accessibility tests passing
- [ ] Performance tests meeting targets
- [ ] Security scan completed
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Documentation updated

---

## Support and Resources

**Testing Documentation:**
- Vitest: https://vitest.dev
- React Testing Library: https://testing-library.com/react
- Playwright: https://playwright.dev

**Contact:**
AUCDT IT Department
Email: itsupport@aucdt.edu.gh

---

*Document Version: 1.0.0*
*Last Updated: November 24, 2025*
*Next Review: February 24, 2026*
