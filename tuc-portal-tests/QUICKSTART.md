# Quick Start Guide - AUCDT Portal Testing

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to project directory
cd aucdt-portal-tests

# Install Node.js packages
pnpm install

# Install Playwright browsers
pnpx playwright install
```

### Step 2: Configure Test Credentials (1 minute)

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your test credentials
# Use a text editor to update:
# - TEST_USERNAME
# - TEST_PASSWORD  
# - TEST_EMAIL
```

### Step 3: Run Your First Test (2 minutes)

```bash
# Run all tests
pnpm test

# Or run in UI mode to see what's happening
pnpm run test:ui

# Or run with visible browser
pnpm run test:headed
```

That's it! Your tests are now running. 🎉

## 📊 View Results

After tests complete:

```bash
# Open HTML report
pnpm run test:report
```

## 🔍 What Tests Are Included?

✅ **Login Tests** - User authentication and validation
✅ **E2E Tests** - Complete application workflows  
✅ **Performance Tests** - Page load and speed metrics
✅ **Accessibility Tests** - WCAG compliance checks
✅ **Visual Tests** - Screenshot comparison

## 🎯 Next Steps

1. **Customize selectors** - Update page objects in `utils/` folder to match your app
2. **Add more tests** - Create new test files in `tests/` folder
3. **Update test data** - Modify `test-data/testData.ts` with your data
4. **Set up CI/CD** - Configure GitHub Actions or Jenkins for automated testing

## 💡 Quick Commands

```bash
# Run specific test file
npx playwright test tests/login.spec.ts

# Run in specific browser
npx playwright test --project=chromium

# Debug mode
npm run test:debug

# Generate test code
npm run test:codegen
```

## 🆘 Need Help?

Check the main [README.md](README.md) for detailed documentation.

## 🐳 Docker Quick Start

If you prefer Docker:

```bash
# Build and run tests in Docker
docker-compose up --build

# Run tests with database
docker-compose --profile database up --build
```

---

**Happy Testing! 🚀**
