#!/usr/bin/env node
/**
 * Phase 2 — ARIA Accessibility Pass
 * Techbridge University College / TUC
 *
 * Per app:
 *   1. index.html — ensure lang="en", add role/aria-label to #root,
 *      inject skip-to-content link
 *   2. src/components/SkipLink.tsx      — reusable skip link component
 *   3. src/components/AccessibleLayout.tsx — <main> wrapper with aria-label
 *   4. src/a11y/aria-checklist.md       — manual ARIA checklist for devs
 *
 * Usage:
 *   node scripts/phase2-aria.js          # dry run
 *   node scripts/phase2-aria.js --apply  # write files
 *   node scripts/phase2-aria.js --apply --app=<name>
 */
const fs   = require('fs');
const path = require('path');

const APPLY   = process.argv.includes('--apply');
const APP_ARG = (process.argv.find(a => a.startsWith('--app=')) || '').replace('--app=', '');
const ROOT    = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  'node_modules','.git','dist','build','scripts','templates','thumbnail-generator',
  'backend','aucdt-portal-tests','tuc-portal-tests','docker','docs','archive',
  'catalogue','project-screenshots','project-screenshots-real','monitoring',
  'reports','build-validation-reports','proof-of-concept-screenshots',
  'master-thumbnail-catalog','playwright','src','gemini','genai','sync-from-d-drive'
]);

const BACKEND_APPS = new Set([
  'accommodation-management','alumni-network','career-services',
  'complaint-resolution-system','health-wellness-portal','internship-program',
  'library-management','mentorship-program','research-portal',
  'scholarship-tracker','student-payment-system','student-success-coach',
  'techbridge-dashboard','techbridge-sentinel-agent','newsfeed','NEWSFEED',
  'lecturer-assessment-portal','modern-product-dev-lifecycle','tsapro-mapping-review',
]);

// ── templates ─────────────────────────────────────────────────────────────────

const skipLinkTsx = `import React from 'react';

/**
 * SkipLink — allows keyboard users to skip directly to main content.
 * Usage: <SkipLink targetId="main-content" />
 */
export default function SkipLink({ targetId = 'main-content' }: { targetId?: string }) {
  return (
    <a
      href={\`#\${targetId}\`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#630f12] focus:text-white focus:rounded-lg focus:font-medium"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}
`;

const accessibleLayout = `import React from 'react';
import SkipLink from './SkipLink';

interface AccessibleLayoutProps {
  children: React.ReactNode;
  /** Describes this page/section for screen readers */
  label?: string;
}

/**
 * AccessibleLayout — wraps app content with proper landmark regions.
 * Usage: wrap your root component with <AccessibleLayout label="App Name">
 */
export default function AccessibleLayout({ children, label = 'Application' }: AccessibleLayoutProps) {
  return (
    <>
      <SkipLink targetId="main-content" />
      <main id="main-content" aria-label={label} tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
`;

const ariaChecklist = (appName) => {
  const title = appName.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return `# ARIA Accessibility Checklist — ${title}

## Status: Phase 2 Scaffolded

The following ARIA patterns have been scaffolded. Review and wire manually.

---

## Completed (automated)
- [x] \`<html lang="en">\` set in index.html
- [x] \`role="application"\` + \`aria-label\` on root div (#root)
- [x] Skip-to-content link injected in index.html
- [x] \`SkipLink.tsx\` component created
- [x] \`AccessibleLayout.tsx\` component created

## Pending (manual)

### Landmark Regions
- [ ] Wrap app content in \`<AccessibleLayout label="${title}">\`
- [ ] Ensure \`<nav aria-label="Main navigation">\` on nav elements
- [ ] Ensure \`<header role="banner">\` on page headers
- [ ] Ensure \`<footer role="contentinfo">\` on footers

### Interactive Elements
- [ ] All \`<button>\` elements have \`aria-label\` or visible text
- [ ] Icon-only buttons: \`<button aria-label="Close"><XIcon /></button>\`
- [ ] All \`<input>\` elements have associated \`<label>\` or \`aria-label\`
- [ ] Links have descriptive text (not "click here")

### Dynamic Content
- [ ] Loading states: \`<div aria-live="polite" aria-busy={loading}>\`
- [ ] Error messages: \`<p role="alert">{error}</p>\`
- [ ] Success notifications: \`<div aria-live="polite">\`

### Images
- [ ] Decorative images: \`<img alt="" aria-hidden="true" />\`
- [ ] Informational images: \`<img alt="Descriptive text" />\`

### Focus Management
- [ ] Modal dialogs trap focus (use \`aria-modal="true"\`)
- [ ] Focus returns to trigger after modal closes
- [ ] Logical tab order (no positive \`tabIndex\`)

### Colour & Contrast
- [ ] All text meets WCAG AA (4.5:1 normal, 3:1 large)
- [ ] TUC Maroon #630f12 on white: ✓ passes
- [ ] TUC Gold #ffcb05 on dark bg: verify contrast

---

## Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [axe DevTools](https://www.deque.com/axe/)
`;
};

// ── helpers ───────────────────────────────────────────────────────────────────

function toTitle(appName) {
  return appName.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function hasARIA(dir) {
  const srcDir = path.join(dir, 'src');
  const check = (d) => {
    try {
      for (const f of fs.readdirSync(d, { withFileTypes: true })) {
        if (f.isDirectory()) { if (check(path.join(d, f.name))) return true; }
        else if (f.name.match(/\.(tsx|jsx|ts|js|html)$/)) {
          try {
            const c = fs.readFileSync(path.join(d, f.name), 'utf8');
            if (c.includes('aria-')) return true;
          } catch { /* */ }
        }
      }
    } catch { /* */ }
    return false;
  };
  // Also check index.html at app root
  try {
    const ih = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    if (ih.includes('aria-')) return true;
  } catch { /* */ }
  return check(fs.existsSync(srcDir) ? srcDir : dir);
}

function patchIndexHtml(htmlPath, appName) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  let changed = false;
  const title = toTitle(appName);

  // 1. Ensure lang="en" on <html>
  if (!html.match(/<html[^>]*lang=/)) {
    html = html.replace(/<html([^>]*)>/, '<html$1 lang="en">');
    changed = true;
  }

  // 2. Add role + aria-label to root div
  if (!html.includes('role="application"') && !html.includes("role='application'")) {
    html = html.replace(
      /(<div\s+id=["']root["'])(>)/,
      `$1 role="application" aria-label="${title}"$2`
    );
    changed = true;
  }

  // 3. Inject skip link before #root div (only once)
  if (!html.includes('skip-to-main') && !html.includes('skip to main')) {
    const skipHtml = `    <a href="#main-content" class="skip-to-main" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;z-index:9999;" onfocus="this.style.left='8px';this.style.width='auto';this.style.height='auto';" onblur="this.style.left='-9999px';this.style.width='1px';this.style.height='1px';" aria-label="Skip to main content">Skip to main content</a>\n`;
    html = html.replace(/(\s*<div\s+id=["']root["'])/, `\n${skipHtml}$1`);
    changed = true;
  }

  if (changed) fs.writeFileSync(htmlPath, html);
  return changed;
}

// ── discovery ─────────────────────────────────────────────────────────────────

const targets = [];
for (const e of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!e.isDirectory() || SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
  if (APP_ARG && e.name !== APP_ARG) continue;
  if (BACKEND_APPS.has(e.name)) continue;
  const dir = path.join(ROOT, e.name);
  if (!fs.existsSync(path.join(dir, 'package.json'))) continue;
  if (!fs.existsSync(path.join(dir, 'index.html'))) continue;
  if (!hasARIA(dir)) targets.push(e.name);
}

console.log(`\nApps needing ARIA: ${targets.length}`);
if (!APPLY) {
  targets.slice(0, 20).forEach(a => console.log('  ', a));
  if (targets.length > 20) console.log(`  ... and ${targets.length - 20} more`);
  console.log('\nRe-run with --apply to scaffold.');
  process.exit(0);
}

// ── apply ─────────────────────────────────────────────────────────────────────

let done = 0, htmlPatched = 0, errors = 0;
for (const appName of targets) {
  try {
    const dir    = path.join(ROOT, appName);
    const srcDir = path.join(dir, 'src');
    fs.mkdirSync(path.join(srcDir, 'components'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'a11y'), { recursive: true });

    // index.html
    const htmlPath = path.join(dir, 'index.html');
    const htmlChanged = patchIndexHtml(htmlPath, appName);
    if (htmlChanged) htmlPatched++;

    // Components (write only if absent)
    const skipPath = path.join(srcDir, 'components', 'SkipLink.tsx');
    if (!fs.existsSync(skipPath)) fs.writeFileSync(skipPath, skipLinkTsx);

    const layoutPath = path.join(srcDir, 'components', 'AccessibleLayout.tsx');
    if (!fs.existsSync(layoutPath)) fs.writeFileSync(layoutPath, accessibleLayout);

    const checklistPath = path.join(srcDir, 'a11y', 'aria-checklist.md');
    if (!fs.existsSync(checklistPath)) fs.writeFileSync(checklistPath, ariaChecklist(appName));

    console.log(`  ✓ ${appName}${htmlChanged ? ' (html patched)' : ''}`);
    done++;
  } catch (err) {
    console.log(`  ✗ ${appName} — ${err.message}`);
    errors++;
  }
}

console.log(`\nDone: ${done} apps, ${htmlPatched} index.html files patched, ${errors} errors.`);
