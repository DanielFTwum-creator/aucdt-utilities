# AUCDT Portal Automated Testing Suite

Comprehensive automated testing solution for the AUCDT Admissions Portal using Playwright and TypeScript.

## 🚀 Features

- **End-to-End Testing**: Complete user journey testing
- **Login & Authentication**: Comprehensive login flow testing
- **Performance Testing**: Page load and performance metrics
- **Visual Regression**: Screenshot comparison testing
- **Accessibility Testing**: WCAG compliance checks
- **Cross-Browser Testing**: Chrome, Firefox, Safari, and mobile browsers
- **Page Object Model**: Maintainable and scalable test architecture
- **Detailed Reporting**: HTML, JSON, and JUnit reports
- **CI/CD Ready**: GitHub Actions, Jenkins compatible

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

## 🔧 Installation

1. **Clone or download this project**

```bash
# If using Git
git clone <your-repo-url>
cd aucdt-portal-tests

# Or simply extract the ZIP file
```

2. **Install dependencies**

```bash
npm install
```

3. **Install Playwright browsers**

```bash
npx playwright install
```

4. **Configure environment variables**

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your test credentials
nano .env  # or use your preferred editor
```

## 🏃‍♂️ Running Tests

### Run all tests

```bash
npm test
```

### Run tests in headed mode (see browser)

```bash
npm run test:headed
```

### Run tests in UI mode (interactive)

```bash
npm run test:ui
```

### Run specific test file

```bash
npx playwright test tests/login.spec.ts
```

### Run tests in specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run tests in debug mode

```bash
npm run test:debug
```

### Generate test code with codegen

```bash
npm run test:codegen
```

## 📊 View Test Reports

After running tests, view the HTML report:

```bash
npm run test:report
```

Or open manually:

```bash
npx playwright show-report
```

## 📁 Project Structure

```
aucdt-portal-tests/
├── tests/                      # Test files
│   ├── login.spec.ts          # Login functionality tests
│   ├── e2e.spec.ts            # End-to-end tests
│   ├── accessibility.spec.ts  # Accessibility tests
│   ├── performance.spec.ts    # Performance tests
│   └── visual.spec.ts         # Visual regression tests
├── utils/                      # Utilities and Page Objects
│   ├── BasePage.ts            # Base page object class
│   ├── LoginPage.ts           # Login page object
│   ├── DashboardPage.ts       # Dashboard page object
│   └── helpers.ts             # Helper functions
├── test-data/                  # Test data
│   └── testData.ts            # Test data configuration
├── config/                     # Configuration files
│   └── environment.ts         # Environment configuration
├── test-results/               # Test results (auto-generated)
│   ├── html-report/           # HTML test reports
│   ├── screenshots/           # Test screenshots
│   └── results.json           # JSON test results
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json              # TypeScript configuration
├── package.json               # Project dependencies
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🧪 Test Suites

### 1. Login Tests (`tests/login.spec.ts`)

- Display login page elements
- Valid credentials login
- Invalid credentials handling
- Empty field validation
- Form clearing
- Navigation to forgot password
- Navigation to registration
- Special characters in password
- Responsive design testing

### 2. End-to-End Tests (`tests/e2e.spec.ts`)

- Complete application flow
- User registration and login
- Full user journey with logout
- Form validation across application
- Session persistence testing

### 3. Performance Tests (`tests/performance.spec.ts`)

- Page load time measurement
- Login action performance
- Performance metrics collection
- Network performance analysis
- API response time tracking

### 4. Accessibility Tests (`tests/accessibility.spec.ts`)

- Page title verification
- Form label accessibility
- Keyboard navigation support
- Console error detection
- Resource loading verification

### 5. Visual Regression Tests (`tests/visual.spec.ts`)

- Full page screenshots
- Component-level screenshots
- Error state screenshots
- Mobile viewport testing
- Tablet viewport testing

## 🎯 Page Object Model

The project uses the Page Object Model (POM) design pattern for better maintainability:

### BasePage
- Common methods used across all pages
- Element interaction utilities
- Waiting and navigation helpers

### LoginPage
- Login-specific methods and locators
- Form interaction methods
- Error handling

### DashboardPage
- Dashboard-specific methods
- Navigation methods
- User profile interactions

## 📝 Writing New Tests

1. **Create a new test file in `tests/` directory**

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../utils/LoginPage';

test.describe('My New Tests', () => {
  test('My first test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    // Add your test steps
  });
});
```

2. **Create new page objects in `utils/` directory**

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyNewPage extends BasePage {
  readonly myElement: Locator;

  constructor(page: Page) {
    super(page);
    this.myElement = page.locator('#my-element');
  }

  async myMethod(): Promise<void> {
    await this.clickElement(this.myElement);
  }
}
```

## 🔍 Debugging Tests

### Visual debugging with UI mode

```bash
npm run test:ui
```

### Debug specific test

```bash
npx playwright test --debug tests/login.spec.ts
```

### View traces

```bash
npx playwright show-trace test-results/trace.zip
```

## 🌐 Cross-Browser Testing

Tests run on multiple browsers by default:

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

Configure in `playwright.config.ts`

## 📱 Mobile Testing

Tests automatically run on mobile viewports:

- Pixel 5 (Mobile Chrome)
- iPhone 12 (Mobile Safari)

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/tests.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Jenkins

```groovy
pipeline {
    agent any
    
    stages {
        stage('Install') {
            steps {
                sh 'npm install'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
    }
    
    post {
        always {
            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
        }
    }
}
```

## 🛠️ Customization

### Update test data

Edit `test-data/testData.ts`:

```typescript
export const TestData = {
  validCredentials: {
    username: 'your_username',
    password: 'your_password'
  },
  // Add more test data
};
```

### Update selectors

Edit page objects in `utils/` to match your application's selectors.

### Configure timeouts

Edit `playwright.config.ts`:

```typescript
timeout: 30 * 1000,  // Test timeout
expect: {
  timeout: 5000      // Assertion timeout
},
```

## 📈 Best Practices

1. **Keep tests independent**: Each test should be able to run standalone
2. **Use meaningful test names**: Describe what the test does
3. **Use Page Object Model**: Keep selectors in page objects
4. **Handle waits properly**: Use explicit waits instead of hard waits
5. **Clean test data**: Clean up after tests when necessary
6. **Use data-testid**: Add data-testid attributes to elements for stable selectors
7. **Screenshot on failure**: Already configured in playwright.config.ts
8. **Regular maintenance**: Update tests when UI changes

## 🐛 Troubleshooting

### Tests failing on CI but passing locally

- Ensure browsers are installed: `npx playwright install --with-deps`
- Check timeout configurations
- Verify environment variables are set in CI

### Element not found errors

- Check if selectors match the application
- Add explicit waits before interacting with elements
- Verify page is fully loaded

### Slow test execution

- Run tests in parallel (already configured)
- Reduce unnecessary waits
- Use `networkidle` strategically

### Screenshot comparison failures

- First run creates baseline screenshots
- Subsequent runs compare against baseline
- Update baselines when UI legitimately changes

## 📞 Support & Contribution

For questions or issues:

1. Check existing test documentation
2. Review Playwright documentation: https://playwright.dev
3. Create an issue in the project repository
4. Contact the test automation team

## 📄 License

MIT License

## 🎓 Resources

- [Playwright Documentation](https://playwright.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Testing Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model](https://playwright.dev/docs/pom)

---

**Happy Testing! 🚀**
