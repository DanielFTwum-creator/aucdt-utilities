# AUCDT Utilities: Master Migration & Best Practices Guide
**Source Project:** Techbridge Scholarship Portal (v2.0)
**Application Scope:** All projects within `../aucdt-utilities`

## 1. Core Environment Standards
To ensure institutional consistency and stability across all AUCDT utilities, the following environmental constraints must be enforced:

### 1.1 Version Locking
- **React Version:** Strictly **19.2.5**.
- **Reasoning:** Ensures compatibility with modern React features while maintaining a stable, audited dependency tree across all tools.

### 1.2 Pathing Strategy
- **Requirement:** Always use **Relative Paths (`./`)**.
- **Vite Config (`vite.config.ts`):**
  ```typescript
  export default defineConfig({
    base: './', // CRITICAL for universal hosting
    // ... rest of config
  });
  ```
- **Entry Point (`index.html`):** Ensure all script, manifest, and link tags start with `./`.

## 2. Linguistic Standard: UK British English
All AUCDT utilities must strictly adhere to UK British English for UI labels, documentation, and system logs.

| US Spelling (Avoid) | UK Spelling (Mandatory) |
| :--- | :--- |
| Program | Programme |
| Color | Colour |
| Center | Centre |
| Analyze | Analyse |
| Catalog | Catalogue |
| Behavior | Behaviour |
| Finalize | Finalise |

## 3. UI/UX: The "Warm Prestige" (6R) Aesthetic
Apply the **6R Methodology** (Reduce, Reuse, Recycle, Rethink, Refine, Reimagine) to all utility interfaces.

### 3.1 Typography & Contrast
- **Headings:** `Playfair Display` or `Cinzel`.
- **Body:** `Cormorant Garamond` or `EB Garamond`.
- **Light Mode Fix:** Body text must be at least `#1A1A1A` on cream backgrounds to meet WCAG 2.1 AA (4.5:1 ratio).
- **Outline Headings:** Apply a subtle stroke (e.g., `-webkit-text-stroke: 1px #2C2C2C`) in light mode to prevent "background bleed."

### 3.2 Tailwind CSS v4 Theme Toggling
Explicitly define variants in `src/index.css` to enable class-based toggling:
```css
/* Configure Tailwind v4 Variants */
@variant dark (&:where(.dark, .dark *));
@variant high-contrast (&:where(.high-contrast, .high-contrast *));

@layer base {
  body {
    @apply bg-tuc-cream text-tuc-ink transition-colors duration-500;
  }
  .dark body {
    @apply bg-tuc-ink text-tuc-cream;
  }
}
```

## 4. Security & Diagnostics Isolation
- **Pattern:** Use Hash-based routing (`#/admin`) for all internal tools.
- **Enforcement:** Diagnostics, simulation engines, and audit logs must NEVER be accessible via the main user flow.
- **Manifest:** Shortcuts should point directly to the hash route (e.g., `"url": "./#/admin"`).

## 5. Notification & Validation
- **Requirement:** Implement a granular **Toast system** for field-level validation.
- **Logic:** Avoid generic "Form Error" alerts. Use contextual feedback (e.g., *"Guarantor ID is required for legal attestation"*).

## 6. Testing Infrastructure
Adopt a dual-layered testing approach for every utility:
1. **Internal Simulation:** In-browser state injection for rapid React logic checks.
2. **External E2E:** Playwright-based "Critical Path" validation.
3. **Visual Reporting:** Automated generation of a `catalogue.html` showcasing screenshots of all application states (especially theme transitions).

---
**Status: 100% BLUEPRINT VERIFIED**
