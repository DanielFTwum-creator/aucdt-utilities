# Admissions Portal Cypress Tests — Quick Start

**TL;DR Version — Just want to run tests? Start here.**

---

## 📋 Pre-flight Checklist

- [ ] Test file copied: `cypress/e2e/techbridge/admissions.cy.ts`
- [ ] Dependencies installed: `npm install`
- [ ] Internet connected
- [ ] Backend running: https://portal.aucdt.edu.gh

---

## ⚡ Run Tests (Choose One)

### 1️⃣ **Headless (CI/CD Pipeline)**
```bash
npm run test:admissions
```
**Duration:** 10-15 minutes  
**Output:** Console + screenshots on failure

### 2️⃣ **Interactive (Cypress UI)**
```bash
npx cypress open
```
**Duration:** Variable (you control)  
**Output:** Watch tests run live, inspect elements

### 3️⃣ **Specific Test Category**
```bash
npx cypress run --spec 'cypress/e2e/techbridge/admissions.cy.ts' --grep "Login"
```
**Duration:** 1-2 minutes  
**Output:** Only tests matching "Login"

---

## 📊 Expected Results

| Scenario | Pass Rate | Time | Notes |
|----------|-----------|------|-------|
| First run (no config) | 60-70% | 12 min | hCaptcha tests fail |
| With API mock | 80-85% | 10 min | Some payment tests fail |
| Fully configured | 95%+ | 10-15 min | All tests pass |

---

## 🐛 Test Failures (Normal & Expected)

### These WILL fail (requires backend config)
- ❌ Login submission tests
- ❌ Signup submission tests  
- ❌ Payment authorization tests
- ❌ Any test requiring API call

**Why?** hCaptcha and external API require mocking

**Fix:** See CYPRESS_REWRITE_GUIDE.md

### These SHOULD pass
- ✅ All page load tests
- ✅ All navigation tests
- ✅ All form field existence tests
- ✅ All responsiveness tests
- ✅ All accessibility tests

---

## 📁 Important Files

| File | Size | Purpose |
|------|------|---------|
| `admissions.cy.ts` | 400 lines | Main test suite (60+ tests) |
| `CYPRESS_TEST_SPECIFICATION.md` | 400 lines | Technical reference |
| `CYPRESS_REWRITE_GUIDE.md` | 300 lines | How-to guide |
| `TEST_REWRITE_SUMMARY.md` | 300 lines | Complete summary |

---

## 🚀 One-Minute Setup

```bash
# 1. Copy test file
cp path/to/admissions.cy.ts cypress/e2e/techbridge/

# 2. Install dependencies
npm install

# 3. Run tests
npm run test:admissions
```

Done! ✅

---

## 📍 File Locations

**Test file should be at:**
```
C:\Development\github\aucdt-utilities\cypress\cypress\e2e\techbridge\admissions.cy.ts
```

**Cypress config at:**
```
C:\Development\github\aucdt-utilities\cypress\cypress.config.js
```

**Package.json in:**
```
C:\Development\github\aucdt-utilities\cypress\
```

---

## 🔧 Common Commands

```bash
# Run all tests headless
npm run test:admissions

# Run tests with UI
npx cypress open

# Run specific test
npx cypress run --spec 'cypress/e2e/techbridge/admissions.cy.ts' --grep "Page Load"

# Run with video
npx cypress run --spec 'cypress/e2e/techbridge/admissions.cy.ts' --record

# Run in Firefox
npx cypress run --spec 'cypress/e2e/techbridge/admissions.cy.ts' --browser firefox

# Generate HTML report
npx cypress run --spec 'cypress/e2e/techbridge/admissions.cy.ts' --reporter html
```

---

## 🎯 Test Suites (60+ tests total)

1. **Page Load & Core UI** (5 tests)
2. **Navigation & Routing** (6 tests) ← Easiest to pass
3. **Login Form** (7 tests)
4. **Signup Registration** (12 tests) ← Longest
5. **Password Reset** (5 tests)
6. **Form Validation** (3 tests)
7. **Accessibility** (5 tests)
8. **Responsiveness** (8 tests) ← Best for mobile testing
9. **Payment Flow** (2 tests)
10. **Error Handling** (2 tests)
11. **General Functionality** (3 tests)

---

## ⚠️ Common Issues & Fixes

### "Port is already in use"
```bash
# Kill existing process or use different port
npx cypress run --port 3001
```

### "Cannot find module 'cypress'"
```bash
# Reinstall dependencies
npm install
# or
pnpm install
```

### "net::ERR_NAME_NOT_RESOLVED"
```bash
# Check internet connection and verify URL
curl https://admissions.techbridge.edu.gh
```

### "Tests timing out"
```bash
# Increase timeout in cypress.config.js
defaultCommandTimeout: 10000  // Default
responseTimeout: 10000       // API calls
taskTimeout: 10000           // Async tasks
```

---

## 📈 Test Categories & Expected Pass Rates

| Category | Tests | Expected | Status |
|----------|-------|----------|--------|
| Navigation | 6 | 100% ✅ | Ready |
| Page Load | 5 | 100% ✅ | Ready |
| Forms | 14 | 85% ⚠️ | Needs API mock |
| Auth | 7 | 70% ⚠️ | Needs hCaptcha mock |
| Accessibility | 5 | 90% ✅ | Ready |
| Responsive | 8 | 100% ✅ | Ready |
| Payment | 2 | 50% ⚠️ | Needs session |
| Other | 13 | 85% ⚠️ | Needs API mock |
| **TOTAL** | **60+** | **80-85%** | **⚠️ In progress** |

---

## 🔐 Authentication Notes

After successful login, these keys are stored in localStorage:
```javascript
localStorage.getItem('token')         // JWT token
localStorage.getItem('usermail')      // Email
localStorage.getItem('userName')      // Name
localStorage.getItem('userPhone')     // Phone
localStorage.getItem('tokenType')     // "Bearer"
```

Tests verify these are set correctly.

---

## 📞 Need Help?

### Test failures?
Read: `CYPRESS_REWRITE_GUIDE.md` → "Debugging Test Failures"

### Need to understand a test?
Check: `admissions.cy.ts` → Inline comments on each test

### API questions?
See: `CYPRESS_TEST_SPECIFICATION.md` → "API Endpoints"

### General how-to?
Read: `CYPRESS_REWRITE_GUIDE.md` → Full implementation guide

---

## ✅ Success Checklist

After running tests, you should see:
- [ ] Test count: 60+ tests executed
- [ ] Pass rate: 60%+ minimum (80%+ if configured)
- [ ] No fatal errors in console
- [ ] Screenshots for failed tests (in `cypress/screenshots/`)

**Perfect pass?** 95%+ pass rate = all configuration complete ✨

---

## 🎓 Learn More

- **Cypress docs:** https://docs.cypress.io
- **Angular docs:** https://angular.io/docs
- **hCaptcha:** https://www.hcaptcha.com/
- **This project:** See documentation files in Collaborations folder

---

**Version:** 1.0  
**Last Updated:** 2026-05-21  
**Status:** Ready to use ✅

Print this page or keep it handy! 📱

---

```
❓ Quick Q&A

Q: Why do login tests fail?
A: hCaptcha and API call require mocking (not your machine's problem!)

Q: How long do tests take?
A: 10-15 minutes for full suite. Some tests take longer.

Q: Can I run individual tests?
A: Yes! Use --grep flag: npx cypress run --grep "Login"

Q: Where are test results?
A: Console output + screenshots in cypress/screenshots/

Q: What's the success rate?
A: Expect 60-70% first run, 95%+ after configuration.
```
