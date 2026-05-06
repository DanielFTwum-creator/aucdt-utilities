# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dmcdai.spec.ts >> Theme Persistence >> theme selection persists across page reload
- Location: tests\dmcdai.spec.ts:131:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByLabel('Select a display theme')
Expected: "light"
Received: "dark"
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for getByLabel('Select a display theme')
    8 × locator resolved to <select id="theme-switcher" aria-label="Select a display theme" class="w-full bg-[var(--color-background-input)] border border-[var(--color-border-input)] rounded-md p-2 text-xs text-[var(--color-foreground)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all">…</select>
      - unexpected value "dark"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - heading "dmcdAI" [level=1] [ref=e6]
    - navigation [ref=e7]:
      - button "Open AI-Driven Visual Design" [ref=e8] [cursor=pointer]:
        - img [ref=e11]
        - generic [ref=e13]: AI-Driven Visual Design
      - button "Open Automated Video Production" [ref=e14] [cursor=pointer]:
        - img [ref=e17]
        - generic [ref=e20]: Automated Video Production
      - button "Open Generative Content Creation" [ref=e21] [cursor=pointer]:
        - img [ref=e24]
        - generic [ref=e26]: Generative Content Creation
      - button "Open Personalized Media" [ref=e27] [cursor=pointer]:
        - img [ref=e30]
        - generic [ref=e32]: Personalized Media
      - button "Open Interactive Storytelling" [ref=e33] [cursor=pointer]:
        - img [ref=e36]
        - generic [ref=e38]: Interactive Storytelling
      - button "Open Sentiment Analysis" [ref=e39] [cursor=pointer]:
        - img [ref=e42]
        - generic [ref=e44]: Sentiment Analysis
      - button "Open AI-Assisted UX/UI Design" [ref=e45] [cursor=pointer]:
        - img [ref=e48]
        - generic [ref=e50]: AI-Assisted UX/UI Design
      - button "Open AI in Branding Systems" [ref=e51] [cursor=pointer]:
        - img [ref=e54]
        - generic [ref=e56]: AI in Branding Systems
      - button "Open Synthetic Media" [ref=e57] [cursor=pointer]:
        - img [ref=e60]
        - generic [ref=e62]: Synthetic Media
      - button "Open Ethics in AI Design" [ref=e63] [cursor=pointer]:
        - img [ref=e66]
        - generic [ref=e68]: Ethics in AI Design
      - button "Access Admin Panel" [ref=e70] [cursor=pointer]:
        - img [ref=e73]
        - generic [ref=e75]: Admin Panel
    - generic [ref=e76]:
      - generic [ref=e77]: Display Theme
      - combobox "Select a display theme" [ref=e78]:
        - option "Dark" [selected]
        - option "Light"
        - option "High Contrast"
    - generic [ref=e79]:
      - paragraph [ref=e80]: © 2026 Techbridge University College
      - paragraph [ref=e81]: Institutional Sandbox
  - generic [ref=e82]:
    - banner [ref=e83]:
      - generic [ref=e84]:
        - button "Go to dashboard" [ref=e85] [cursor=pointer]:
          - img [ref=e86]
        - generic [ref=e89]:
          - heading "Dashboard" [level=2] [ref=e90]
          - paragraph [ref=e91]: Welcome to the dmcdAI Learning Sandbox
      - generic [ref=e92]:
        - generic [ref=e93]:
          - paragraph [ref=e94]: Ama (Student)
          - paragraph [ref=e95]: BTech DMCD
        - img "User Avatar" [ref=e96]
    - main [ref=e97]:
      - generic [ref=e98]:
        - generic [ref=e99]:
          - heading "Explore AI in DMCD" [level=2] [ref=e100]
          - paragraph [ref=e101]: Select a module to begin your exploration into the transformative impact of AI on design and communication.
        - generic [ref=e102]:
          - 'button "Open module: AI-Driven Visual Design" [ref=e103] [cursor=pointer]':
            - generic [ref=e104]:
              - img [ref=e107]
              - heading "AI-Driven Visual Design" [level=3] [ref=e109]
              - paragraph [ref=e110]: Generate stunning graphics and visuals from text prompts.
          - 'button "Open module: Automated Video Production" [ref=e111] [cursor=pointer]':
            - generic [ref=e112]:
              - img [ref=e115]
              - heading "Automated Video Production" [level=3] [ref=e118]
              - paragraph [ref=e119]: Create and edit video content using AI-powered tools.
          - 'button "Open module: Generative Content Creation" [ref=e120] [cursor=pointer]':
            - generic [ref=e121]:
              - img [ref=e124]
              - heading "Generative Content Creation" [level=3] [ref=e126]
              - paragraph [ref=e127]: Craft blog posts, social media updates, and ad campaigns.
          - 'button "Open module: Personalized Media" [ref=e128] [cursor=pointer]':
            - generic [ref=e129]:
              - img [ref=e132]
              - heading "Personalized Media" [level=3] [ref=e134]
              - paragraph [ref=e135]: Simulate hyper-personalized user experiences at scale.
          - 'button "Open module: Interactive Storytelling" [ref=e136] [cursor=pointer]':
            - generic [ref=e137]:
              - img [ref=e140]
              - heading "Interactive Storytelling" [level=3] [ref=e142]
              - paragraph [ref=e143]: Build dynamic narratives that adapt to user choices.
          - 'button "Open module: Sentiment Analysis" [ref=e144] [cursor=pointer]':
            - generic [ref=e145]:
              - img [ref=e148]
              - heading "Sentiment Analysis" [level=3] [ref=e150]
              - paragraph [ref=e151]: Quantify audience emotion and brand perception.
          - 'button "Open module: AI-Assisted UX/UI Design" [ref=e152] [cursor=pointer]':
            - generic [ref=e153]:
              - img [ref=e156]
              - heading "AI-Assisted UX/UI Design" [level=3] [ref=e158]
              - paragraph [ref=e159]: Generate user flows and UI components from text.
          - 'button "Open module: AI in Branding Systems" [ref=e160] [cursor=pointer]':
            - generic [ref=e161]:
              - img [ref=e164]
              - heading "AI in Branding Systems" [level=3] [ref=e166]
              - paragraph [ref=e167]: Create dynamic, adaptive brand identities and logos.
          - 'button "Open module: Synthetic Media" [ref=e168] [cursor=pointer]':
            - generic [ref=e169]:
              - img [ref=e172]
              - heading "Synthetic Media" [level=3] [ref=e174]
              - paragraph [ref=e175]: Navigate the challenges and crisis of digital authenticity.
          - 'button "Open module: Ethics in AI Design" [ref=e176] [cursor=pointer]':
            - generic [ref=e177]:
              - img [ref=e180]
              - heading "Ethics in AI Design" [level=3] [ref=e182]
              - paragraph [ref=e183]: Apply frameworks for responsible and fair innovation.
```

# Test source

```ts
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
  111 |     await expect(page.getByText('AI Simulator Mode')).toBeVisible();
  112 |     await page.getByRole('button', { name: 'Disable AI Simulator' }).or(
  113 |       page.getByRole('button', { name: 'Enable AI Simulator' })
  114 |     ).click();
  115 |     // After toggle, button label should flip
  116 |     await expect(
  117 |       page.getByRole('button', { name: 'Disable AI Simulator' }).or(
  118 |         page.getByRole('button', { name: 'Enable AI Simulator' })
  119 |       )
  120 |     ).toBeVisible();
  121 |   });
  122 | 
  123 | });
  124 | 
  125 | test.describe('Theme Persistence', () => {
  126 | 
  127 |   test.beforeEach(async ({ page }) => {
  128 |     await automatedLogin(page);
  129 |   });
  130 | 
  131 |   test('theme selection persists across page reload', async ({ page }) => {
  132 |     await page.getByLabel('Select a display theme').selectOption('light');
  133 |     await page.reload();
> 134 |     await expect(page.getByLabel('Select a display theme')).toHaveValue('light');
      |                                                             ^ Error: expect(locator).toHaveValue(expected) failed
  135 |     const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  136 |     expect(theme).toBe('light');
  137 |   });
  138 | 
  139 |   test('high-contrast theme applies data-theme attribute', async ({ page }) => {
  140 |     await page.getByLabel('Select a display theme').selectOption('high-contrast');
  141 |     const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  142 |     expect(theme).toBe('high-contrast');
  143 |   });
  144 | 
  145 |   test('dark theme is default when no preference stored', async ({ page }) => {
  146 |     await page.evaluate(() => localStorage.removeItem('dmcdAI-theme'));
  147 |     await page.reload();
  148 |     await expect(page.getByLabel('Select a display theme')).toHaveValue('dark');
  149 |   });
  150 | 
  151 | });
  152 | 
  153 | test.describe('Accessibility', () => {
  154 | 
  155 |   test.beforeEach(async ({ page }) => {
  156 |     await automatedLogin(page);
  157 |   });
  158 | 
  159 |   test('all module cards have aria-label', async ({ page }) => {
  160 |     const cards = page.getByRole('button', { name: /Open module:/ });
  161 |     const count = await cards.count();
  162 |     expect(count).toBe(10);
  163 |   });
  164 | 
  165 |   test('login modal has role=dialog and aria-modal', async ({ page }) => {
  166 |     await page.goto('/#/admin');
  167 |     const dialog = page.locator('[role="dialog"][aria-modal="true"]');
  168 |     await expect(dialog).toBeVisible();
  169 |   });
  170 | 
  171 |   test('result areas have aria-live=polite', async ({ page }) => {
  172 |     await page.goto('/');
  173 |     await page.getByRole('button', { name: 'Open module: Sentiment Analysis' }).click();
  174 |     const liveRegion = page.locator('[aria-live="polite"]');
  175 |     await expect(liveRegion.first()).toBeAttached();
  176 |   });
  177 | 
  178 | });
  179 | 
```