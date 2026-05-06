# Eligibility Checker Context (tuc-eligibility-checker)

## Project Stack
- **Frontend:** React with TypeScript (Vite)
- **React Version:** 19.2.4 (MANDATORY REQUIREMENT)
- **Styling:** CSS/Radix UI/Tailwind v3.4 (Moving to v4 in refresh)
- **Features:** Admission logic, Shadcn/ui components
- **Environment:** Local dev on http://localhost:3000

## Techbridge Branding Rules
- **Primary Palette:** Gold (#C8A84B), Deep Brown (Ink), White, and Green.
- **Tone:** Helpful, accurate, and encouraging.

## 6R Methodology UI/UX Enhancement Directives
These directives guide the "Path to Admission" design evolution:

1. **REDUCE - Eliminate Cognitive Overload**
   - **Form Fragmentation:** Combine small steps where logical; use progress bars to manage expectations.
   - **Visual Noise:** Remove redundant Radix borders; focus on clean, focused input fields.

2. **REUSE - Narrative Consistency**
   - **Shared Components:** Align `Input`, `Select`, and `Button` styles with the Scholarship Portal.
   - **Instructional Voice:** Use clear, consistent British International English for all requirements.

3. **RECYCLE - Data Equity**
   - **Validation Logic:** Standardize examination type and grade validation patterns.
   - **Theme Integration:** Leverage the Tri-Theme system established in other portals.

4. **RETHINK - Interaction Design**
   - **Instant Feedback:** Provide real-time eligibility scores as the user fills out the form.
   - **Requirement Highlighting:** Clearly mark mandatory subjects (Math, English) with distinct visual cues.

5. **REFINE - Technical Polish**
   - **Accessibility:** 100% Radix-standard ARIA coverage; keyboard-accessible dropdowns.
   - **Error Handling:** Replace generic alerts with contextual, helpful inline error messages.

6. **REIMAGINE - Achievement Experience**
   - **Success Visualization:** Animated results page celebrate eligibility with branded visuals.
   - **Next-Step Intelligence:** Smart redirection to the actual application portal based on results.

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
