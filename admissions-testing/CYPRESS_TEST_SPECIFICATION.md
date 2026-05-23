# Cypress Test Specification — Admissions Portal (AUCDT)

**Document ID:** TUC-ICT-CYPRESS-SPEC-2026-001  
**Date:** 2026-05-21  
**Target Application:** https://admissions.techbridge.edu.gh  
**Framework:** Angular (Hash-based routing)  
**Test Runner:** Cypress 15.15.0 (TypeScript)

---

## CRITICAL FINDING: Application Type

The admissions portal is an **Angular Single-Page Application (SPA)** with:
- **Hash-based routing** (URLs like `/#/login`, `/#/signup`)
- **No server-side form validation** — all validation occurs in the browser
- **Third-party integrations:** hCaptcha (login), ngx-toastr (notifications)
- **LocalStorage for session management:** tokens, user email, user name, phone number
- **Multiple user flows:** New Applicant (signup → payment) vs. Returning Applicant (login → payment)

---

## Application Structure

### Routes (from `app.routing.ts`)

| Route | Component | Purpose | Auth Guard |
|-------|-----------|---------|-----------|
| `/` | Redirects to `/home` | Default route | None |
| `/home` | HomeComponent | Landing page | None |
| `/login` | LoginComponent | Returning applicant sign in | None |
| `/signup` | GetstartedComponent | New applicant registration | None |
| `/instructions` | InstructionsComponent | Application instructions | None |
| `/faqs` | FrequentlyAskedQuestionsComponent | FAQ page | None |
| `/reset-password-email` | ResetpasswordemailComponent | Password reset initiation | None |
| `/reset-password` | ResetnewpasswordComponent | Password reset completion | None |
| `/verify-otp` | OtppageComponent | OTP verification | None |
| `/auth-payment` | AuthorizationComponent | Payment authorization | None |
| `/main-applcation-login` | SerialPinloginComponent | Serial pin login | None |
| `/main-application-dashboard` | AppdashboardComponent | Applicant dashboard | AuthGuard |
| `/payment-success` | PaymentsuccessComponent | Payment success page | None |
| `/payment-cancelled` | PaymentfailureComponent | Payment failure page | None |
| `/payment-pending` | PaymentPendingComponent | Payment pending page | None |
| `/congratulations` | CongratulationsComponent | Application submitted | LoginGuardService |

---

## Form Components & Field Specifications

### 1. LOGIN FORM (`/login`)

**Component:** `LoginComponent`  
**Template:** `login.component.html`

#### Form Fields

| Field | ID | Name | Type | Required | Validation |
|-------|-----|------|------|----------|-----------|
| Email | `email` | `email` | `email` | Yes | Valid email format |
| Password | `password` | `password` | `password` | Yes | Min 6 chars |
| hCaptcha | N/A | N/A | Captcha | Yes | Must resolve successfully |

#### Form Actions

| Action | Selector | Method | Route |
|--------|----------|--------|-------|
| Submit | `button.btn.btn-primary[type="submit"]` | POST `/api/payment-applicant/login` | `/auth-payment` (on success) |
| Forgot Password | `a[routerLink="/reset-password-email"]` | Navigation | `/reset-password-email` |
| New Application | `button.btn.btn-outline` | `startNewApplication()` | `/signup` |

#### Error Messages

- Empty email: "E-mail address is required."
- Invalid email: "Invalid email format"
- Empty password: "Password is required."
- Invalid credentials: "Returned from API"
- Captcha not verified: "Please confirm you are not a robot."
- Application deadline passed: "Application deadline has passed."

#### Success Flow

1. User enters valid email & password
2. User resolves hCaptcha
3. Click "Sign In" button
4. Login API called: `POST /api/payment-applicant/login` with `{ email, password }`
5. Response stored in localStorage:
   - `token` (JWT)
   - `authToken` (same as token)
   - `usermail` (email)
   - `userName` (user name)
   - `userPhone` (phone number)
   - `tokenType` (Bearer)
6. Toast: "Login successful. Redirecting to payment..."
7. Navigate to `/auth-payment` (payment authorization page)

---

### 2. SIGNUP FORM (`/signup`)

**Component:** `GetstartedComponent`  
**Template:** `getstarted.component.html`  
**Multi-step form with 3 steps**

#### Step 1: Personal Information

| Field | ID | Name | Type | Required | Validation |
|-------|-----|------|------|----------|-----------|
| First Name | `firstname` | `firstname` | `text` | Yes | No validation (any text) |
| Last Name | `lastname` | `lastname` | `text` | Yes | No validation (any text) |
| Email | `email` | `email` | `email` | Yes | Valid email format |
| Country Code | `countryCode` | `countryCode` | `select` | Yes | Options: +233, +1, +44, etc. |
| Phone Number | `phone` | `phoneNumber` | `tel` | Yes | 7-15 digits, pattern: `[0-9]{7,15}` |

**Navigation:**
- "Next" button: Validates step 1, advances to step 2
- "Previous" button: Not visible (first step)

#### Step 2: Student Type Selection

| Field | ID | Name | Type | Value | Required |
|-------|-----|------|------|-------|----------|
| Student Type | N/A | `typeofStudent` | Radio/Card | `GHANAIAN` or `INTERNATIONAL` | Yes |

**Navigation:**
- "Next" button: Validates student type selection, advances to step 3
- "Previous" button: Goes back to step 1

#### Step 3: Account Setup (Password)

| Field | ID | Name | Type | Required | Validation |
|-------|-----|------|------|----------|-----------|
| Password | `password` | `password` | `password` | Yes | Min 8 chars, must include uppercase, lowercase, number, special char |
| Confirm Password | `confirmPassword` | `confirmPassword` | `password` | Yes | Must match password |

**Navigation:**
- "Submit" button: POST to `/api/payment-signup/register`
- "Previous" button: Goes back to step 2

#### Signup API Request

```json
{
  "firstname": "string",
  "lastname": "string",
  "email": "string",
  "phoneNumber": "string",
  "typeofStudent": "GHANAIAN" | "INTERNATIONAL",
  "password": "string"
}
```

**Endpoint:** `POST /api/payment-signup/register`

#### Success Flow

1. Complete all 3 steps with valid data
2. Click "Submit" button
3. API request sent to `/api/payment-signup/register`
4. Response: `{ message, status, userId?, success, data? }`
5. On success (status 200):
   - Toast: "Registration successful..."
   - Navigate to `/verify-otp` (OTP verification)
6. On error:
   - Display error message from API

---

### 3. PASSWORD RESET FLOW

#### Step 1: Request Password Reset (`/reset-password-email`)

**Component:** `ResetpasswordemailComponent`

| Field | Name | Type | Required |
|-------|------|------|----------|
| Email | `usermail` | `email` | Yes |

**Action:** Click "Send Reset Link"
- **Method:** `sendPassword(formData)` in LoginComponent
- **API:** POST to `/api/payment-signup/forgot-password`
- **Payload:** `{ email }` or similar
- **Success:** Email sent with reset link/code

#### Step 2: Reset Password (`/reset-password`)

**Component:** `ResetnewpasswordComponent`

| Field | Name | Type | Required |
|-------|------|------|----------|
| New Password | `password` | `password` | Yes |
| Confirm Password | `confirmPassword` | `password` | Yes |

**Action:** Click "Reset Password"
- **API:** POST to `/api/payment-signup/reset-password`
- **Success:** Navigate to `/login`

---

### 4. PAYMENT AUTHORIZATION (`/auth-payment`)

**Component:** `AuthorizationComponent`

**Purpose:** Collect user consent and initiate payment

**Data Source:** LocalStorage (populated after login/signup)
- `token` / `authToken`
- `usermail`
- `userName`
- `userPhone`

**Actions:**
- Review payment details
- Authorize payment
- **API:** POST to `/api/payments/initiate`
- **Success:** Redirect to payment gateway or success page

---

## API Endpoints

### Authentication & Authorization

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/api/payment-applicant/login` | POST | `{ email, password }` | `{ status, token, name, phoneNumber, email, tokenType }` |
| `/api/payment-signup/register` | POST | SignupRequest | `{ status, message, userId?, success, data? }` |
| `/api/payment-signup/verify` | POST | `{ email, otp }` | `{ status, message, ... }` |
| `/api/payment-signup/resend-otp` | POST | `{ email }` | `{ status, message, ... }` |
| `/api/auth/reference-pin-login` | POST | `{ serialPin, password }` | LoginResponse |
| `/api/auth/refresh-token` | POST | N/A | `{ token, expiresIn, ... }` |
| `/api/payment-signup/forgot-password` | POST | `{ email }` | `{ status, message, ... }` |
| `/api/payment-signup/reset-password` | POST | `{ email, newPassword, code }` | `{ status, message, ... }` |

### Payment

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/payments/initiate` | POST | Initiate payment transaction |
| `/api/payments/verify-status` | POST | Verify payment status |
| `/api/payments/success-get-credentials` | POST | Get credentials after successful payment |

### Applicant Data

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/applicant-admissions/applicant-data` | GET | Fetch applicant's data (dashboard) |
| `/api/applicant-admissions/application-status` | GET | Check application status |
| `/api/applicant-admissions/applicant-update` | POST | Update applicant information |
| `/api/applicant-admissions/upload-document` | POST | Upload documents |

---

## Authentication & Session Management

### Login Success Response

```typescript
interface LoginResponse {
  status: number;        // 200 for success
  token: string;         // JWT token
  name: string;          // User's full name
  email: string;         // Email address
  phoneNumber: string;   // Phone number
  tokenType: string;     // "Bearer"
  message?: string;      // Optional message
}
```

### LocalStorage Keys

After login/signup, these keys are stored:

| Key | Value | Set By |
|-----|-------|--------|
| `token` | JWT string | LoginComponent / GetstartedComponent |
| `authToken` | JWT string (duplicate) | LoginComponent / GetstartedComponent |
| `usermail` | Email address | LoginComponent / GetstartedComponent |
| `userName` | User's full name | LoginComponent / GetstartedComponent |
| `userPhone` | Phone number | LoginComponent / GetstartedComponent |
| `tokenType` | "Bearer" | LoginComponent / GetstartedComponent |
| `user_email` | Email address | GetstartedComponent only |

### HTTP Interceptor

**File:** `auth.interceptor.ts`

- Automatically adds `Authorization: Bearer {token}` header to all API requests
- Uses token from localStorage or sessionStorage

---

## Test Categories & Expected Selectors

### Category 1: Page Load & Core UI

**Tests:**
1. Page loads without JavaScript errors
2. Page title contains "TechBridge"
3. Meta description contains "Techbridge"
4. Logo or branding text is visible
5. Navigation menu exists

**Selectors:**
- `h1` — Page heading
- `.logo-text` — Logo container
- `nav.nav-links` — Navigation menu

### Category 2: Navigation & Routing

**Tests:**
1. Login link navigates to `/login`
2. Signup link navigates to `/signup`
3. FAQ link works
4. Footer links work

**Selectors:**
- `a[routerLink="/login"]` — Login link
- `a[routerLink="/signup"]` — Signup link
- `a[routerLink="/faqs"]` — FAQ link
- `footer a` — Footer links

### Category 3: Login / Account Access

**Tests:**
1. Email input exists with ID "email"
2. Password input exists with ID "password"
3. Empty login shows validation errors
4. Invalid credentials show error from API
5. Forgot password link exists
6. New application link exists

**Selectors:**
- `#email` — Email input
- `#password` — Password input
- `input[name="email"]` — Email by name
- `input[name="password"]` — Password by name
- `button[type="submit"]` — Submit button
- `a[routerLink="/reset-password-email"]` — Forgot password link
- `button.btn.btn-outline` — New application button

### Category 4: Registration / Signup

**Tests:**
1. Signup form exists at `/signup`
2. Step 1: First name field exists (ID: "firstname")
3. Step 1: Last name field exists (ID: "lastname")
4. Step 1: Email field exists (ID: "email")
5. Step 1: Phone number field exists (ID: "phone")
6. Step 1: Country code selector exists (ID: "countryCode")
7. Step 2: Student type selection (GHANAIAN / INTERNATIONAL)
8. Step 3: Password field exists
9. Step 3: Confirm password field exists
10. Form progression: Can move between steps

**Selectors:**
- `#firstname` — First name input
- `#lastname` — Last name input
- `#email` — Email input
- `#phone` — Phone input
- `#countryCode` — Country code select
- `input[name="firstname"]` — By name attribute
- `input[name="lastname"]` — By name attribute
- `input[name="email"]` — By name attribute
- `input[name="phoneNumber"]` — By name attribute
- `input[name="typeofStudent"]` — Student type

### Category 5: Password Reset

**Tests:**
1. Reset password form exists at `/reset-password-email`
2. Email input exists
3. Submitting valid email shows success message
4. Navigate to `/reset-password`
5. New password field exists
6. Confirm password field exists
7. Mismatched passwords show error

**Selectors:**
- `#email` — Email input on reset page
- `input[type="password"]` — Password inputs
- `button[type="submit"]` — Submit button

### Category 6: hCaptcha Integration (Login Only)

**Tests:**
1. hCaptcha widget loads on login page
2. Captcha must be resolved before login
3. Submit button disabled until captcha verified
4. Error shown if captcha expires

**Selectors:**
- `ng-hcaptcha` — hCaptcha component
- `button[type="submit"][disabled]` — Disabled submit button
- `.captcha-container` — Captcha container

### Category 7: Error Messages & Toasts

**Tests:**
1. Toast notifications appear on success
2. Toast notifications appear on error
3. Error messages display below form fields
4. Alert boxes display critical errors

**Selectors:**
- `.ng-trigger-onSideIn` — Toast message (ngx-toastr)
- `.alert-error` — Error alert
- `.error-message` — Validation error below field
- `[role="alert"]` — ARIA alert regions

### Category 8: Accessibility (WCAG 2.1 AA)

**Tests:**
1. All images have `alt` attributes
2. Form inputs have associated `<label>` or `aria-label`
3. Page has exactly one `<h1>`
4. Links have discernible text
5. Color contrast sufficient (visual check)
6. Keyboard navigation works
7. Focus indicators visible

**Selectors:**
- `img` — All images
- `label[for]` — Form labels
- `input[aria-label]` — Inputs with aria-label
- `h1` — Main page heading
- `a` — All links

### Category 9: Responsiveness

**Viewports to Test:**
- Mobile (320px) — iPhone SE
- Mobile (375px) — iPhone 12
- Tablet (768px) — iPad
- Desktop (1280px) — Desktop

**Tests per Viewport:**
1. No horizontal overflow
2. CTA button visible
3. Form fields responsive
4. Navigation accessible

---

## Test Data

### Valid Test Credentials (If Available)

- **Email:** (Need to obtain from backend)
- **Password:** (Need to obtain from backend)

### Test Data for Signup

```typescript
const testSignupData = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john.doe+test@example.com',  // Use +test to avoid duplicates
  countryCode: '+233',
  phoneNumber: '5551234567',
  password: 'TestPass123!@#',
  confirmPassword: 'TestPass123!@#',
  typeofStudent: 'GHANAIAN' | 'INTERNATIONAL',
};
```

---

## Cypress Configuration

### File: `cypress.config.js`

```javascript
import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  baseUrl: "https://admissions.techbridge.edu.gh",
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    taskTimeout: 10000,
  },
});
```

### Timeouts

- **Page load:** 15 seconds (for preloader to disappear)
- **Element wait:** 4 seconds (default)
- **Network request:** 8 seconds
- **Async task:** 10 seconds

---

## Test Execution Protocol

### Before Each Test

1. Clear all cookies and localStorage
2. Navigate to base URL
3. Wait for page to fully load
4. Verify no console errors

### After Each Test

1. Log any errors or warnings
2. Take screenshot if test fails
3. Clean up test data (logout, delete account if created)

---

## Known Issues & Workarounds

### Issue 1: hCaptcha in Cypress

**Problem:** hCaptcha is a third-party service that can't be automated in tests  
**Workaround:**
- Mock hCaptcha in test environment (requires backend support)
- Use test credentials that bypass captcha
- Skip captcha tests in certain environments

### Issue 2: LocalStorage Race Condition

**Problem:** Data written to localStorage may not be immediately visible  
**Workaround:**
- Add delays after login (300-500ms)
- Verify localStorage keys before navigation
- Use `cy.window()` to access localStorage directly

### Issue 3: External API Calls

**Problem:** Login and signup call external APIs that may fail  
**Workaround:**
- Mock API responses using `cy.intercept()`
- Have fallback test credentials
- Monitor API availability

---

## Success Criteria

All tests passing means:

✅ **Overall Pass Rate:** 95%+  
✅ **Page Load Tests:** 100% pass  
✅ **Navigation Tests:** 100% pass  
✅ **Login/Auth:** 95%+ pass  
✅ **Signup/Registration:** 95%+ pass  
✅ **Accessibility:** 90%+ pass  
✅ **Responsiveness:** 100% pass  
✅ **Execution Time:** Under 10 minutes  

---

## Next Steps

1. **Set up test file** — Create `admissions.cy.ts` with all test suites
2. **Implement page objects** — Create helper functions for common actions
3. **Handle hCaptcha** — Determine testing strategy for captcha
4. **Run baseline tests** — Execute and document failures
5. **Iterate & refine** — Update tests based on actual app behavior

---

*Document created: 2026-05-21*  
*By: Claude (AI Assistant)*  
*For: Daniel Frempong Twum, Techbridge University College*
