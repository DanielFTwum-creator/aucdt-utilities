# Ghana University Fees Dashboard Context (ghana-university-fees-dashboard)

## Project Stack
- **Frontend:** React with TypeScript (Vite)
- **React Version:** 19.2.5 (MANDATORY REQUIREMENT)
- **Styling:** CSS/Tailwind
- **Features:** Institutional Fee Analytics, Recharts, Multi-Year Comparison
- **Environment:** Local dev on http://localhost:3000

## Techbridge Branding Rules
- **Primary Palette:** Gold (#C8A84B), Deep Brown (Ink), White, and Green.
- **Tone:** Analytical, transparent, and authoritative.

## 6R Methodology UI/UX Enhancement Directives
These directives guide the "Financial Transparency" design evolution:

1. **REDUCE - Eliminate Cognitive Overload**
   - **Fee Breakdown:** Group related fees (Tuition, SRC, Hostel) into collapsible categories.
   - **Summary Focus:** Highlight the "Average Annual Cost" prominently to reduce manual calculation.

2. **REUSE - Narrative Consistency**
   - **Institutional Typography:** Use **Inter** for all data tables and **Playfair Display** for financial reports.
   - **Pattern Recognition:** Standardize the "Year-over-Year" trend visualization across all fee categories.

3. **RECYCLE - Brand Equity**
   - **Logo Anchoring:** Persistent TUC logo in the dashboard masthead to assert financial authority.
   - **Shared Patterns:** Integrate the standard "Phase Tracker" and "Audit Stream" components.

4. **RETHINK - Interaction Design**
   - **Dynamic Comparison:** Enable side-by-side fee comparisons between different institutions or departments.
   - **Interactive Projections:** Allow users to simulate fee increases using a strategic "What-If" slider.

5. **REFINE - Technical Polish**
   - **Accessibility:** 100% ARIA/Tooltip coverage for all interactive chart segments and table headers.
   - **Data Precision:** Implement strict numeric formatting for all currency values (GHS).

6. **REIMAGINE - Fiscal Experience**
   - **Strategic Summaries:** (AI) Gemini-powered qualitative analysis of fee trends and affordability.
   - **Boardroom Mode:** A dedicated high-contrast presentation mode for financial committee briefings.

## Phased Project Refresh Directives
Execute these phases sequentially to ensure project integrity and prevent context truncation:

### PHASE 1: FOUNDATION SETUP
**Directive:** `EXECUTE PHASE 1: FOUNDATION SETUP - Focus on project synchronization and SRS generation. 1. Perform full project sync and verify all files. 2. Generate/Update comprehensive IEEE Standard SRS for current application state (v3.0.0). 3. Update project metadata and core configuration. 4. Verify React 19.2.5 version compliance. STATE "PHASE 1 COMPLETE" when finished.`

### PHASE 2: CORE IMPLEMENTATION (SECURITY & UX)
**Directive:** `EXECUTE PHASE 2: CORE IMPLEMENTATION - Focus on Admin security, Audit logging, and Accessibility. 1. Implement/Verify password-protected Admin section (#/admin). 2. Integrate comprehensive Audit Logging for all administrative actions. 3. Ensure 100% ARIA/Tooltip coverage for accessibility. 4. Implement/Verify Light, Dark, and High-Contrast themes. STATE "PHASE 2 COMPLETE" when finished.`

### PHASE 3: TESTING FRAMEWORK INTEGRATION
**Directive:** `EXECUTE PHASE 3: TESTING FRAMEWORK - Focus on self-testing and E2E automation. 1. Integrate internal diagnostic/simulation tools in Admin section. 2. Create and verify Playwright E2E test suite. 3. Implement interactive test dashboard with screenshot capture. 4. Verify all core user flows via automated tests. STATE "PHASE 3 COMPLETE" when finished.`

### PHASE 4: DOCUMENTATION & DIAGRAMS
**Directive:** `EXECUTE PHASE 4: DOCUMENTATION & DIAGRAMS - Focus on architectural visualization. 1. Generate System Architecture SVG diagram. 2. Generate Database/Data Flow SVG diagram. 3. Create comprehensive Admin Guide (.md). 4. Create Deployment and Testing Guides (.md). STATE "PHASE 4 COMPLETE" when finished.`

### PHASE 5: FINAL ALIGNMENT & PACKAGING
**Directive:** `EXECUTE PHASE 5: FINAL ALIGNMENT - Focus on SRS synchronization and documentation organization. 1. Perform final Gap Analysis between SRS and Implementation. 2. Synchronize SRS with "as-built" state (v3.0.0). 3. Embed all SVG diagrams into the SRS document. 4. Organize all guides and diagrams in the /docs directory. STATE "PHASE 5 COMPLETE - REFRESH FINISHED" when complete.`

## Mandatory Project Requirements (Permanent)
1. **React Version:** Must remain strictly at **19.2.5**.
2. **ZERO Broken Links:** Every UI element must be fully functional or explicitly removed.
3. **Gap Analysis:** A two-way synchronization between SRS and Implementation is required after every major change.
4. **Isolated Diagnostics:** All test simulations, audit logs, and diagnostic tools must reside exclusively in the password-protected `#/admin` section.
5. **Documentation Sync:** The SRS must always be updated to match the "as-built" state of the application.
