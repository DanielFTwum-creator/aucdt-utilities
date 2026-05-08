# Analytics Dashboard Context (analytics-refactor)

## Project Stack
- **Frontend:** React with TypeScript (Vite)
- **React Version:** 19.2.5 (MANDATORY REQUIREMENT)
- **Styling:** CSS/Material Design/Tailwind v4
- **Features:** PWA (Service Workers, Manifest), Recharts
- **Environment:** Local dev on http://localhost:3000

## Techbridge Branding Rules
- **Primary Palette:** Indigo (#4F46E5), Slate, White, and Emerald.
- **Tone:** Analytical, precise, and professional.

## 6R Methodology UI/UX Enhancement Directives
These directives guide the "Analytical Precision" design evolution:

1. **REDUCE - Eliminate Cognitive Overload**
   - **Streamline Filters:** Use a centralized filter bar; avoid redundant dropdowns.
   - **Progressive Disclosure:** Show summary KPIs first; drill down into detailed charts.
   - **Visual Noise:** Remove unnecessary grid lines and borders in charts.

2. **REUSE - Narrative Consistency**
   - **Unified Typography:** Use **Inter** for all UI elements and chart labels.
   - **Component Patterns:** Standardize chart headers and export buttons.

3. **RECYCLE - Data Equity**
   - **Standardized Schemas:** Reuse the `FormData` and `AuditLog` patterns for consistency.
   - **Palette Evolution:** High-contrast professional palette: Indigo, Emerald, Amber, and Rose.

4. **RETHINK - Interaction Design**
   - **Interactive Charts:** Ensure every chart element (bar, line, slice) is clickable for drill-down.
   - **Contextual Actions:** Place export/print actions near the relevant data visualization.

5. **REFINE - Technical Polish**
   - **Accessibility:** 100% ARIA coverage; focus traps for modals.
   - **Performance:** Optimized `useMemo` for data processing.

6. **REIMAGINE - Experience Insight**
   - **Live Updates:** Real-time state transitions with subtle animations.
   - **Smart Analytics:** Gemini-powered trend analysis integrated into the dashboard.

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
