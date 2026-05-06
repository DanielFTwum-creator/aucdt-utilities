# Brand Guideline Checker Context (brand-guideline-checker)

## Project Stack
- **Frontend:** React with TypeScript (Vite)
- **React Version:** 19.2.4 (MANDATORY REQUIREMENT)
- **Styling:** CSS/Tailwind
- **Features:** AI Brand Analysis (Gemini), Image Processing, Institutional Compliance
- **Environment:** Local dev on http://localhost:3000

## Techbridge Branding Rules
- **Primary Palette:** Gold (#C8A84B), Deep Brown (Ink), White, and Green.
- **Tone:** Precise, professional, and visually disciplined.

## 6R Methodology UI/UX Enhancement Directives
These directives guide the "Visual Discipline" design evolution:

1. **REDUCE - Eliminate Cognitive Overload**
   - **Upload Focus:** Simplify the asset upload area; remove secondary decorative elements during the analysis phase.
   - **Result Clarity:** Group analysis results into clear categories (Colors, Typography, Logo Placement).

2. **REUSE - Narrative Consistency**
   - **Branding Lockups:** Use standard institutional header/footer patterns from the core portal suite.
   - **Validation Icons:** Standardize pass/fail indicators with consistent institutional checkmarks.

3. **RECYCLE - Asset Equity**
   - **Reference Guidelines:** Use the official TUC brand manual as the primary logic anchor for AI analysis.
   - **Palette Enforcement:** Ensure the analysis engine strictly references the #C8A84B gold hex code.

4. **RETHINK - Interaction Design**
   - **Side-by-Side Review:** Provide a visual comparison view between uploaded assets and institutional standards.
   - **Immediate Ingestion:** Use Gemini to provide qualitative feedback on brand "feel" and alignment.

5. **REFINE - Technical Polish**
   - **Accessibility:** 100% ARIA coverage for all analysis result cards and image preview components.
   - **Color Accuracy:** Implement high-fidelity color extraction logic for precise hex-code matching.

6. **REIMAGINE - Identity Experience**
   - **Branded Report:** Generate a high-fidelity "Compliance Certificate" PDF for approved assets.
   - **Smart Correction:** (AI) Provide specific corrective hex codes or font suggestions when violations occur.

## Phased Project Refresh Directives
Execute these phases sequentially to ensure project integrity and prevent context truncation:

### PHASE 1: FOUNDATION SETUP
**Directive:** `EXECUTE PHASE 1: FOUNDATION SETUP - Focus on project synchronization and SRS generation. 1. Perform full project sync and verify all files. 2. Generate/Update comprehensive IEEE Standard SRS for current application state (v3.0.0). 3. Update project metadata and core configuration. 4. Verify React 19.2.4 version compliance. STATE "PHASE 1 COMPLETE" when finished.`

### PHASE 2: CORE IMPLEMENTATION (SECURITY & UX)
**Directive:** `EXECUTE PHASE 2: CORE IMPLEMENTATION - Focus on Admin security, Audit logging, and Accessibility. 1. Implement/Verify password-protected Admin section (#/admin). 2. Integrate comprehensive Audit Logging for all administrative actions. 3. Ensure 100% ARIA/Tooltip coverage for accessibility. 4. Implement/Verify Light, Dark, and High-Contrast themes. STATE "PHASE 2 COMPLETE" when finished.`

### PHASE 3: TESTING FRAMEWORK INTEGRATION
**Directive:** `EXECUTE PHASE 3: TESTING FRAMEWORK - Focus on self-testing and E2E automation. 1. Integrate internal diagnostic/simulation tools in Admin section. 2. Create and verify Playwright E2E test suite. 3. Implement interactive test dashboard with screenshot capture. 4. Verify all core user flows via automated tests. STATE "PHASE 3 COMPLETE" when finished.`

### PHASE 4: DOCUMENTATION & DIAGRAMS
**Directive:** `EXECUTE PHASE 4: DOCUMENTATION & DIAGRAMS - Focus on architectural visualization. 1. Generate System Architecture SVG diagram. 2. Generate Database/Data Flow SVG diagram. 3. Create comprehensive Admin Guide (.md). 4. Create Deployment and Testing Guides (.md). STATE "PHASE 4 COMPLETE" when finished.`

### PHASE 5: FINAL ALIGNMENT & PACKAGING
**Directive:** `EXECUTE PHASE 5: FINAL ALIGNMENT - Focus on SRS synchronization and documentation organization. 1. Perform final Gap Analysis between SRS and Implementation. 2. Synchronize SRS with "as-built" state (v3.0.0). 3. Embed all SVG diagrams into the SRS document. 4. Organize all guides and diagrams in the /docs directory. STATE "PHASE 5 COMPLETE - REFRESH FINISHED" when complete.`

## Mandatory Project Requirements (Permanent)
1. **React Version:** Must remain strictly at **19.2.4**.
2. **ZERO Broken Links:** Every UI element must be fully functional or explicitly removed.
3. **Gap Analysis:** A two-way synchronization between SRS and Implementation is required after every major change.
4. **Isolated Diagnostics:** All test simulations, audit logs, and diagnostic tools must reside exclusively in the password-protected `#/admin` section.
5. **Documentation Sync:** The SRS must always be updated to match the "as-built" state of the application.
