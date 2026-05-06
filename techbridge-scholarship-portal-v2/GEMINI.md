# Techbridge Scholarship Portal Context

## Project Stack
- **Frontend:** React with TypeScript (Vite)
- **React Version:** 19.2.4 (MANDATORY REQUIREMENT)
- **Styling:** CSS/Material Design/Tailwind v4
- **Features:** PWA (Service Workers, Manifest)
- **Environment:** Local dev on http://localhost:3000

## Techbridge Branding Rules
- **Primary Palette:** Gold (#C8A84B), Deep Brown (Ink), White, and Green.
- **Tone:** Professional, academic, and accessible.

## 6R Methodology UI/UX Enhancement Directives
These directives guide the "Warm Prestige" editorial design evolution:

1. **REDUCE - Eliminate Cognitive Overload**
   - **Streamline Auth:** Remove redundant security badges (e.g., "Handshake Protocol"); simplify to "Login."
   - **Progressive Disclosure:** Show only the current step prominently; dim future steps to prevent overwhelm.
   - **Visual Weight:** Transition from heavy dark cards to light, breathable designs with subtle gold borders.

2. **REUSE - Narrative Consistency**
   - **Editorial Hierarchy:** Apply "Magazine Cover" principles using **Playfair Display** for headings.
   - **Hollywood Dashboard:** Use high-density information layouts that remain legible and professional.

3. **RECYCLE - Brand Equity**
   - **Logo Integration:** Center and emphasize the institutional logo as a primary anchor.
   - **Palette Evolution:** Sophisticated "Warm Prestige" palette: Gold (#D4AF37), Cream (#FFF8F0), Burgundy, and Navy.

4. **RETHINK - Interaction Design**
   - **Trust vs. Theater:** Replace "security theater" (excessive shields/warnings) with clean, professional trust indicators.
   - **Step Indicators:** Use intuitive labels (e.g., "Scholar Identity: 1 of 4") instead of abstract numbers.

5. **REFINE - Technical Polish**
   - **Premium Inputs:** 12px rounded corners, specific focus states, and floating label interactions.
   - **Typography Scale:** Strict adherence to a refined type scale for clear information architecture.

6. **REIMAGINE - Experience Gamification**
   - **Micro-interactions:** Animated authentication entrances and subtle gradient shifts on interactive elements.
   - **Form Intelligence:** Inline validation with helpful, contextual feedback instead of generic error alerts.

## Phased Project Refresh Directives
Execute these phases sequentially to ensure project integrity and prevent context truncation:

### PHASE 1: FOUNDATION SETUP
**Directive:** `EXECUTE PHASE 1: FOUNDATION SETUP - Focus on project synchronization and SRS generation. 1. Perform full project sync and verify all files. 2. Generate comprehensive IEEE Standard SRS for current application state. 3. Update project metadata and core configuration. 4. Verify React 19.2.4 version compliance. STATE "PHASE 1 COMPLETE" when finished.`

### PHASE 2: CORE IMPLEMENTATION (SECURITY & UX)
**Directive:** `EXECUTE PHASE 2: CORE IMPLEMENTATION - Focus on Admin security, Audit logging, and Accessibility. 1. Implement/Verify password-protected Admin section (#/admin). 2. Integrate comprehensive Audit Logging for all administrative actions. 3. Ensure 100% ARIA/Tooltip coverage for accessibility. 4. Implement/Verify Light, Dark, and High-Contrast themes. STATE "PHASE 2 COMPLETE" when finished.`

### PHASE 3: TESTING FRAMEWORK INTEGRATION
**Directive:** `EXECUTE PHASE 3: TESTING FRAMEWORK - Focus on self-testing and E2E automation. 1. Integrate internal diagnostic/simulation tools in Admin section. 2. Create and verify Playwright E2E test suite. 3. Implement interactive test dashboard with screenshot capture. 4. Verify all core user flows via automated tests. STATE "PHASE 3 COMPLETE" when finished.`

### PHASE 4: DOCUMENTATION & DIAGRAMS
**Directive:** `EXECUTE PHASE 4: DOCUMENTATION & DIAGRAMS - Focus on architectural visualization. 1. Generate System Architecture SVG diagram. 2. Generate Database/Data Flow SVG diagram. 3. Create comprehensive Admin Guide (.md). 4. Create Deployment and Testing Guides (.md). STATE "PHASE 4 COMPLETE" when finished.`

### PHASE 5: FINAL ALIGNMENT & PACKAGING
**Directive:** `EXECUTE PHASE 5: FINAL ALIGNMENT - Focus on SRS synchronization and documentation organization. 1. Perform final Gap Analysis between SRS and Implementation. 2. Synchronize SRS with "as-built" state (v2.0). 3. Embed all SVG diagrams into the SRS document. 4. Organize all guides and diagrams in the /docs directory. STATE "PHASE 5 COMPLETE - REFRESH FINISHED" when complete.

## Mandatory Project Requirements (Permanent)
1. **React Version:** Must remain strictly at **19.2.4**.
2. **Zero Broken Links:** Every UI element must be fully functional or explicitly removed.
3. **Gap Analysis:** A two-way synchronization between SRS and Implementation is required after every major change.
4. **Isolated Diagnostics:** All test simulations, audit logs, and diagnostic tools must reside exclusively in the password-protected `#/admin` section.
5. **Documentation Sync:** The SRS must always be updated to match the "as-built" state of the application.
6. **UK British English:** All UI labels, documentation, legal text, and system logs must strictly use UK British English (e.g., 'programme', 'colour', 'centre', 'analyse').
7. **Toastr Notifications:** Use the integrated Toast system for all field-level validation and system feedback.
8. **Relative Paths:** All script, link, and asset paths must use relative root paths (`./`) as configured in `vite.config.ts` to ensure compatibility across diverse hosting environments.

## Project Phases & Status
- **PHASE 1: FOUNDATION** (✅ COMPLETE)
  - React 19.2.4 verified. IEEE Standard SRS established. Initial gap analysis performed.
- **PHASE 2: SECURITY & ACCESSIBILITY** (✅ COMPLETE)
  - Admin auth implemented. Hash-based routing (#/admin) active. 100% tooltip/ARIA coverage. Light/Dark/High-Contrast themes active.
- **PHASE 3: TESTING FRAMEWORK** (✅ COMPLETE)
  - Playwright E2E suite integrated. Admin Simulator UI operational. Screenshot capture/history enabled.
- **PHASE 4: DOCUMENTATION** (✅ COMPLETE)
  - System and Data architecture SVGs generated. Admin, Deployment, and Testing guides published.
- **PHASE 5: FINAL ALIGNMENT** (✅ COMPLETE)
  - SRS synchronized with v2.0 implementation. 100% Alignment verified. /docs directory organized.

## Project Structure & Constraints
- **Public Assets:** All PWA assets (sw.js, manifest.json, logos) must stay in the `/public` folder.
- **Entry Point:** The main React entry is `/src/index.tsx`.
- **MIME Rules:** Ensure all script tags in `index.html` use absolute paths (starting with `/`) to avoid MIME type errors.

## Coding Preferences
- Use **UK British English** strictly for all UI text, documentation, and test logs.
- When suggesting React components, prefer functional components with Hooks.
- Always check for PWA compatibility when adding new assets.
