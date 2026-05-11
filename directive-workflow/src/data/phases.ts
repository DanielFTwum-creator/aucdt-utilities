import type { Phase } from "../types";

export const PHASES: Phase[] = [
  {
    id: "session",
    label: "SESSION START",
    icon: "🚀",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    title: "Session Kickoff",
    subtitle: "Paste this FIRST in every new AI Studio session",
    tag: "Always First",
    content: `SESSION PERMANENT REQUIREMENTS:
1. React 19.2.4 ONLY
2. ZERO broken links - implement fully or exclude
3. Gap analysis mandatory after implementation (SRS ↔ Implementation two-way sync)
4. ALL diagnostics in /admin section only
5. Update SRS to match actual implementation

Confirm these requirements understood before proceeding.`,
  },
  {
    id: "phase1",
    label: "PHASE 1",
    icon: "🔍",
    color: "#34d399",
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    title: "Foundation & Compliance",
    subtitle: "Pre-flight checks, SRS generation, gap analysis",
    tag: "Required",
    content: `EXECUTE PHASE 1 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-FLIGHT CHECKS (MANDATORY):
☐ Verify React version = 19.2.4 in package.json
☐ Review all existing links/buttons - flag any broken ones
☐ Confirm SRS document exists and is current

IMPLEMENTATION:
☐ Clean project synchronisation - reset to latest stable
☐ Generate/update IEEE standard SRS for current state
☐ Regenerate primary AI agent component
☐ Execute initial gap analysis (SRS vs current implementation)

COMPLETION REQUIREMENTS:
✅ All pre-flight checks passed
✅ SRS document created/updated
✅ Initial gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`,
  },
  {
    id: "phase2",
    label: "PHASE 2",
    icon: "🔒",
    color: "#60a5fa",
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    title: "Security & Accessibility",
    subtitle: "Admin auth, diagnostics routing, themes, a11y",
    tag: "Required",
    content: `EXECUTE PHASE 2 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm React 19.2.4 in use
☐ Review all planned links - ensure all are implementable

IMPLEMENTATION:
☐ Admin section with password-protected auth
☐ Move ALL diagnostics to /admin/* routes
☐ Comprehensive audit logging for admin actions
☐ Full accessibility support (screen readers, keyboard nav, ARIA labels)
☐ User-selectable themes: Light, Dark, High-contrast
☐ Ensure ZERO broken links in implemented features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs implementation)
☐ Update SRS with admin/accessibility features
☐ Verify all admin diagnostic routes functional

COMPLETION REQUIREMENTS:
✅ Admin security implemented & tested
✅ All diagnostics moved to admin section
✅ Accessibility features verified
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`,
  },
  {
    id: "phase3",
    label: "PHASE 3",
    icon: "🧪",
    color: "#fb923c",
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
    title: "Testing Framework",
    subtitle: "Puppeteer suite, self-testing, screenshot capture",
    tag: "Required",
    content: `EXECUTE PHASE 3 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm React 19.2.4 in use
☐ Verify all test-related links will be functional

IMPLEMENTATION:
☐ Integrate self-testing capabilities
☐ Develop Puppeteer test suite for critical user journeys
☐ Create interactive "Puppeteer Self-Test" tab in /admin/testing
☐ Enable real-time test result display with screenshot capture
☐ Test ALL implemented links/features
☐ Remove or implement any non-functional elements

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs implementation)
☐ Update SRS with testing framework details
☐ Verify zero broken links in test interfaces

COMPLETION REQUIREMENTS:
✅ Test framework integrated
✅ Puppeteer tests functional
✅ Admin testing section operational
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`,
  },
  {
    id: "phase4",
    label: "PHASE 4",
    icon: "📄",
    color: "#c084fc",
    gradient: "linear-gradient(135deg, #c084fc, #9333ea)",
    title: "Documentation & Diagrams",
    subtitle: "SVG architecture diagrams, admin/deploy/test guides",
    tag: "Required",
    content: `EXECUTE PHASE 4 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Gather current implementation details
☐ Confirm all features are documented

IMPLEMENTATION:
☐ Generate System Architecture Diagram (SVG) - show admin structure
☐ Generate Database Architecture Diagram (SVG) - tables, columns, relationships
☐ Create Administrator Guide (all admin features, diagnostics access)
☐ Create Deployment Guide (production deployment steps)
☐ Create Testing Guide (manual and automated test procedures)
☐ Document React 19.2.4 requirement in all guides

POST-IMPLEMENTATION:
☐ Execute gap analysis (documentation vs implementation)
☐ Ensure all implemented features are documented
☐ Verify all documentation links are valid

COMPLETION REQUIREMENTS:
✅ All SVG diagrams generated
✅ All three guides created
✅ Gap analysis completed
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`,
  },
  {
    id: "phase5",
    label: "PHASE 5",
    icon: "🏁",
    color: "#f472b6",
    gradient: "linear-gradient(135deg, #f472b6, #db2777)",
    title: "Final Verification",
    subtitle: "100% SRS alignment, /docs structure, board diagrams",
    tag: "Final",
    content: `EXECUTE PHASE 5 ONLY - FINAL PHASE

FINAL IMPLEMENTATION:
☐ Update IEEE SRS document with ALL implemented features
☐ Embed SVG diagrams directly in SRS
☐ Generate board-level presentation diagrams (data flow, tech stack)
☐ Create /docs directory structure
☐ Collate all documents into /docs folder

MANDATORY FINAL GAP ANALYSIS:
☐ Complete two-way verification:
   - Every SRS feature → Implemented (or removed from SRS)
   - Every implemented feature → Documented in SRS
☐ Generate final Gap Analysis Report
☐ Confirm 100% alignment
☐ Document React 19.2.4 requirement in SRS
☐ Document admin-only diagnostic architecture in SRS

FINAL CHECKLIST:
✅ SRS 100% matches implementation
✅ Zero broken links in entire application
✅ All diagnostics in admin section
✅ React 19.2.4 confirmed
✅ Gap analysis shows 100% alignment
✅ /docs directory organised

COMPLETION REQUIREMENTS:
✅ State "ALL PHASES COMPLETE - FINAL GAP ANALYSIS CONFIRMS 100% ALIGNMENT"
✅ Attach final Gap Analysis Report

This is the final phase - complete all tasks.`,
  },
  {
    id: "singleshot",
    label: "SINGLE SHOT",
    icon: "⚡",
    color: "#fbbf24",
    gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
    title: "Master Single-Shot",
    subtitle: "All 5 phases in one prompt for fast execution",
    tag: "Power Mode",
    content: `MASTER PROJECT REFRESH - ENFORCE ALL PERMANENT REQUIREMENTS

PERMANENT REQUIREMENTS (CHECK FIRST):
☐ React version = 19.2.4 (verify package.json)
☐ ZERO broken links policy in effect
☐ Gap analysis mandatory after each section
☐ All diagnostics go to /admin/* routes

EXECUTION CHECKLIST:

☐ 1. FOUNDATION & COMPLIANCE
   - Verify React 19.2.4
   - Generate/update IEEE SRS
   - Initial gap analysis (SRS vs implementation)

☐ 2. SECURITY & ACCESSIBILITY
   - Password-protected admin section
   - Move ALL diagnostics to /admin routes
   - Audit logging for admin actions
   - Full accessibility + themes (Light/Dark/High-contrast)
   - NO broken links in implementation
   - Gap analysis + SRS update

☐ 3. TESTING FRAMEWORK
   - Integrate self-testing capabilities
   - Create Puppeteer test suite
   - Add /admin/testing tab with screenshot capture
   - Test all links - implement or remove broken ones
   - Gap analysis + SRS update

☐ 4. DOCUMENTATION
   - System Architecture SVG (show admin structure)
   - Database Architecture SVG
   - Admin Guide, Deployment Guide, Testing Guide
   - Document React 19.2.4 requirement
   - Gap analysis + verify documentation alignment

☐ 5. FINAL VERIFICATION
   - Update final SRS with ALL features
   - Embed diagrams in SRS
   - Complete two-way gap analysis
   - Confirm 100% alignment
   - Organise all files in /docs directory

COMPLETION PROTOCOL:
- Mark each ☐ item as ✅ when complete
- Include gap analysis report after sections 1-5
- If ANY requirement cannot be met, STOP and report
- Final confirmation must include "100% ALIGNMENT VERIFIED"

BEGIN EXECUTION NOW`,
  },
  {
    id: "rescue",
    label: "RESCUE",
    icon: "🛟",
    color: "#f87171",
    gradient: "linear-gradient(135deg, #f87171, #dc2626)",
    title: "Rescue / Troubleshoot",
    subtitle: "Restore dropped requirements mid-session",
    tag: "Emergency",
    content: `CRITICAL REMINDER - RESTORE PERMANENT REQUIREMENTS:

React 19.2.4 ONLY — verify package.json NOW
ZERO broken links — implement fully or exclude
Gap analysis required — SRS ↔ Implementation two-way sync
ALL diagnostics in /admin section only
Update SRS to match actual implementation

---

[IF GAP ANALYSIS WAS SKIPPED]
Execute gap analysis now — compare SRS vs implementation.
Generate gap analysis report showing all discrepancies.
Two-way sync: SRS → Implementation AND Implementation → SRS.

---

[IF REACT VERSION CHANGED]
STOP — Rollback immediately. Restore React 19.2.4.
Verify package.json before any further work.

---

[IF BROKEN LINKS ADDED]
STOP — Review all links/buttons added this session.
Either fully implement or remove them entirely.
ZERO broken links is a non-negotiable requirement.

---

[IF DIAGNOSTICS ON PUBLIC PAGES]
STOP — Move all diagnostic/monitoring/test pages to /admin/* routes.
Public pages must contain ZERO diagnostic UI.

Confirm all requirements restored before continuing.`,
  },
];
