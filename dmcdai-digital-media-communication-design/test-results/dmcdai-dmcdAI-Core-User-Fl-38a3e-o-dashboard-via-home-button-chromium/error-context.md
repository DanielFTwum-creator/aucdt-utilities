# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dmcdai.spec.ts >> dmcdAI Core User Flows >> should navigate back to dashboard via home button
- Location: tests\dmcdai.spec.ts:40:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Techbridge 2FA Login')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Techbridge 2FA Login')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:react-babel] C:\\Development\\aucdt-utilities\\dmcdai-digital-media-communication-design\\App.tsx: Identifier 'getHash' has already been declared. (25:6) 28 | const { isAuthenticated, isAdmin } = useAuth();"
  - generic [ref=e5]: C:/Development/aucdt-utilities/dmcdai-digital-media-communication-design/App.tsx:25:6
  - generic [ref=e6]: "23 | const getHash = () => typeof window !== 'undefined' ? window.location.hash.replace(/^#\\/?/, '') : ''; 24 | 25 | const getHash = () => typeof window !== 'undefined' ? window.location.hash.replace(/^#\\/?/, '') : ''; | ^ 26 | 27 | const App: React.FC = () => {"
  - generic [ref=e7]: at constructor (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:367:19) at TypeScriptParserMixin.raise (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:6624:19) at TypeScriptScopeHandler.checkRedeclarationInScope (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:1646:19) at TypeScriptScopeHandler.declareName (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:1612:12) at TypeScriptScopeHandler.declareName (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:4909:11) at TypeScriptParserMixin.declareNameFromIdentifier (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:7594:16) at TypeScriptParserMixin.checkIdentifier (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:7590:12) at TypeScriptParserMixin.checkLVal (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:7527:12) at TypeScriptParserMixin.parseVarId (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:13488:10) at TypeScriptParserMixin.parseVarId (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:9805:11) at TypeScriptParserMixin.parseVar (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:13459:12) at TypeScriptParserMixin.parseVarStatement (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:13306:10) at TypeScriptParserMixin.parseVarStatement (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:9469:31) at TypeScriptParserMixin.parseStatementContent (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:12927:23) at TypeScriptParserMixin.parseStatementContent (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:9569:18) at TypeScriptParserMixin.parseStatementLike (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:12843:17) at TypeScriptParserMixin.parseModuleItem (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:12820:17) at TypeScriptParserMixin.parseBlockOrModuleBlockBody (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:13392:36) at TypeScriptParserMixin.parseBlockBody (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:13385:10) at TypeScriptParserMixin.parseProgram (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:12698:10) at TypeScriptParserMixin.parseTopLevel (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:12688:25) at TypeScriptParserMixin.parse (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:14568:25) at TypeScriptParserMixin.parse (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:10183:18) at parse (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+parser@7.28.5\node_modules\@babel\parser\lib\index.js:14602:38) at parser (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+core@7.28.5\node_modules\@babel\core\lib\parser\index.js:41:34) at parser.next (<anonymous>) at normalizeFile (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+core@7.28.5\node_modules\@babel\core\lib\transformation\normalize-file.js:64:37) at normalizeFile.next (<anonymous>) at run (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+core@7.28.5\node_modules\@babel\core\lib\transformation\index.js:22:50) at run.next (<anonymous>) at transform (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+core@7.28.5\node_modules\@babel\core\lib\transform.js:22:33) at transform.next (<anonymous>) at step (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:261:32) at C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:273:13 at async.call.result.err.err (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:223:11) at C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:189:28 at C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\@babel+core@7.28.5\node_modules\@babel\core\lib\gensync-utils\async.js:67:7 at C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:113:33 at step (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:287:14) at C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:273:13 at async.call.result.err.err (C:\Development\aucdt-utilities\dmcdai-digital-media-communication-design\node_modules\.pnpm\gensync@1.0.0-beta.2\node_modules\gensync\index.js:223:11
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.
    - text: You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | const TEST_EMAIL = process.env.DMCDAI_TEST_EMAIL ?? 'student@techbridge.edu.gh';
  4   | 
  5   | async function automatedLogin(page: Page) {
  6   |   await page.goto('/', { waitUntil: 'networkidle' });
  7   |   await page.evaluate(() => {
  8   |     (window as any).__dmcdaiAuto2FAEnabled = true;
  9   |   });
> 10  |   await expect(page.getByText('Techbridge 2FA Login')).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
  11  |   await page.locator('#email').fill(TEST_EMAIL);
  12  |   const sendCodeButton = page.getByRole('button', { name: 'Send code' });
  13  |   await expect(sendCodeButton).toBeVisible();
  14  |   await sendCodeButton.click();
  15  |   await page.locator('#code').waitFor({ state: 'visible' });
  16  |   const otp = await page.evaluate(() => (window as any).__dmcdaiPendingOtp as string);
  17  |   await page.locator('#code').fill(otp);
  18  |   await page.getByRole('button', { name: 'Verify code' }).click();
  19  |   await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  20  | }
  21  | 
  22  | test.describe('dmcdAI Core User Flows', () => {
  23  | 
  24  |   test.beforeEach(async ({ page }) => {
  25  |     await automatedLogin(page);
  26  |   });
  27  | 
  28  |   test('should display the dashboard and institutional branding', async ({ page }) => {
  29  |     await expect(page.getByText('dmcdAI')).toBeVisible();
  30  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  31  |     await expect(page.getByText('Techbridge University College')).toBeVisible();
  32  |   });
  33  | 
  34  |   test('should navigate to Visual Design module', async ({ page }) => {
  35  |     await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
  36  |     await expect(page.getByText('Image Prompt')).toBeVisible();
  37  |     await expect(page.locator('h2')).toContainText('AI-Driven Visual Design');
  38  |   });
  39  | 
  40  |   test('should navigate back to dashboard via home button', async ({ page }) => {
  41  |     await page.getByRole('button', { name: 'Open module: AI-Driven Visual Design' }).click();
  42  |     await page.getByRole('button', { name: 'Go to dashboard' }).click();
  43  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  44  |   });
  45  | 
  46  |   test('should navigate all 10 modules from sidebar', async ({ page }) => {
  47  |     const moduleLabels = [
  48  |       'Open AI-Driven Visual Design',
  49  |       'Open Automated Video Production',
  50  |       'Open Generative Content Creation',
  51  |       'Open Personalized Media',
  52  |       'Open Interactive Storytelling',
  53  |       'Open Sentiment Analysis',
  54  |       'Open AI-Assisted UX/UI Design',
  55  |       'Open AI in Branding Systems',
  56  |       'Open Synthetic Media',
  57  |       'Open Ethics in AI Design',
  58  |     ];
  59  |     for (const label of moduleLabels) {
  60  |       await page.getByRole('button', { name: label }).click();
  61  |       await page.getByRole('button', { name: 'Go to dashboard' }).click();
  62  |     }
  63  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  64  |   });
  65  | 
  66  | });
  67  | 
  68  | test.describe('Admin Security Flow', () => {
  69  | 
  70  |   test('direct hash navigation to /admin shows login modal', async ({ page }) => {
  71  |     await page.goto('/#/admin');
  72  |     await expect(page.getByText('Admin Login')).toBeVisible();
  73  |     await expect(page.locator('label[for="password"]')).toBeVisible();
  74  |   });
  75  | 
  76  |   test('incorrect password shows error message', async ({ page }) => {
  77  |     await page.goto('/#/admin');
  78  |     await page.locator('#password').fill('wrong-password');
  79  |     await page.getByRole('button', { name: 'Login' }).click();
  80  |     await expect(page.getByText('Incorrect password')).toBeVisible();
  81  |   });
  82  | 
  83  |   test('correct password grants admin access', async ({ page }) => {
  84  |     await page.goto('/#/admin');
  85  |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
  86  |     await page.getByRole('button', { name: 'Login' }).click();
  87  |     await expect(page.getByText('Admin Control Center')).toBeVisible();
  88  |   });
  89  | 
  90  |   test('admin logout redirects to dashboard', async ({ page }) => {
  91  |     await page.goto('/#/admin');
  92  |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
  93  |     await page.getByRole('button', { name: 'Login' }).click();
  94  |     await page.getByRole('button', { name: 'Logout from Admin Panel' }).click();
  95  |     await expect(page.getByText('Explore AI in DMCD')).toBeVisible();
  96  |     await expect(page.getByText('Admin Control Center')).not.toBeVisible();
  97  |   });
  98  | 
  99  |   test('cancel on login modal clears admin hash', async ({ page }) => {
  100 |     await page.goto('/#/admin');
  101 |     await page.getByRole('button', { name: 'Cancel login' }).click();
  102 |     await expect(page.getByText('Admin Login')).not.toBeVisible();
  103 |     expect(page.url()).not.toContain('#/admin');
  104 |   });
  105 | 
  106 |   test('simulator toggle is visible in diagnostics tab', async ({ page }) => {
  107 |     await page.goto('/#/admin');
  108 |     await page.locator('#password').fill('dmcdai-admin-2025-secure');
  109 |     await page.getByRole('button', { name: 'Login' }).click();
  110 |     await page.getByRole('button', { name: 'System Diagnostics' }).click();
```