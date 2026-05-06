import { Framework } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// STANDARD PROJECT REFRESH
// ─────────────────────────────────────────────────────────────────────────────
const STANDARD_DIRECTIVE_1 = `SESSION PERMANENT REQUIREMENTS:
1. React 19.2.4 ONLY
2. ZERO broken links - implement fully or exclude
3. Gap analysis mandatory after implementation (SRS ↔ Implementation two-way sync)
4. ALL diagnostics in /admin section only
5. Update SRS to match actual implementation

Confirm these requirements understood before proceeding.

EXECUTE PHASE 1 ONLY - DO NOT PROCEED UNTIL CONFIRMED

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

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`;

const STANDARD_DIRECTIVE_2 = `EXECUTE PHASE 2 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm Phase 1 is COMPLETE
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

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`;

const STANDARD_DIRECTIVE_3 = `EXECUTE PHASE 3 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm Phase 2 is COMPLETE
☐ Confirm React 19.2.4 in use
☐ Confirm admin section is locked and functional

IMPLEMENTATION:
☐ Integrate internal diagnostic/simulation tools in Admin section
☐ Create and verify Playwright E2E test suite
☐ Implement interactive test dashboard with screenshot capture
☐ Verify all core user flows via automated tests
☐ ALL diagnostic tools must remain in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs testing framework)
☐ Update SRS with testing framework documentation
☐ Verify all E2E tests pass

COMPLETION REQUIREMENTS:
✅ Playwright E2E suite created and passing
✅ Interactive test dashboard in /admin section
✅ Screenshot capture functional
✅ All core user flows verified
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`;

const STANDARD_DIRECTIVE_4 = `EXECUTE PHASE 4 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm Phase 3 is COMPLETE
☐ Confirm React 19.2.4 in use
☐ Confirm all previous phases are verified complete

IMPLEMENTATION:
☐ Generate System Architecture SVG diagram
☐ Generate Database/Data Flow SVG diagram
☐ Create comprehensive Admin Guide (.md)
☐ Create Deployment Guide (.md)
☐ Create Testing Guide (.md)
☐ Organise all files in /docs directory
☐ Ensure ZERO broken links in all documentation

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs documentation)
☐ Update SRS with all documentation artifacts

COMPLETION REQUIREMENTS:
✅ System Architecture SVG generated
✅ Database/Data Flow SVG generated
✅ Admin Guide, Deployment Guide, Testing Guide created
✅ All documents organised in /docs
✅ Gap analysis completed and SRS updated
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`;

const STANDARD_DIRECTIVE_5 = `EXECUTE PHASE 5 ONLY - DO NOT PROCEED UNTIL CONFIRMED

PRE-IMPLEMENTATION:
☐ Confirm Phase 4 is COMPLETE
☐ Confirm React 19.2.4 in use
☐ Confirm ALL phases 1-4 are verified complete

IMPLEMENTATION:
☐ Perform final Gap Analysis (SRS ↔ Implementation two-way sync)
☐ Synchronise SRS to as-built state (v3.0.0)
☐ Embed all SVG diagrams into SRS document
☐ Organise all guides and diagrams in /docs directory
☐ Final verification of ALL features and links

POST-IMPLEMENTATION:
☐ Verify ZERO broken links across entire application
☐ Confirm all diagnostics confined to /admin section
☐ Final accessibility audit (WCAG 2.1 AA)
☐ Confirm React version is still 19.2.4

COMPLETION REQUIREMENTS:
✅ Gap Analysis complete (SRS ↔ Implementation fully synced)
✅ SRS updated to as-built v3.0.0
✅ All SVGs embedded in SRS
✅ /docs organised and complete
✅ ZERO broken links verified
✅ State "PHASE 5 COMPLETE - REFRESH FINISHED"`;

// ─────────────────────────────────────────────────────────────────────────────
// HIPAA
// ─────────────────────────────────────────────────────────────────────────────
const HIPAA_DIRECTIVE_1 = `EXECUTE PHASE 1 ONLY - HIPAA FOUNDATION

PRE-FLIGHT CHECKS:
☐ Verify React version = 19.2.4 in package.json
☐ Review existing data handling - flag any PHI exposure
☐ Confirm SRS document exists

IMPLEMENTATION:
☐ Generate IEEE SRS with dedicated HIPAA compliance section
☐ Complete PHI data inventory (what, where, who has access)
☐ Create PHI storage map (at-rest and in-transit)
☐ Establish compliance directory structure (/docs/hipaa/)
☐ Execute initial gap analysis (SRS vs current state)

COMPLETION REQUIREMENTS:
✅ SRS with HIPAA section created
✅ PHI inventory and storage map documented
✅ Compliance structure established
✅ Gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`;

const HIPAA_DIRECTIVE_2 = `EXECUTE PHASE 2 ONLY - HIPAA ADMINISTRATIVE SAFEGUARDS (§164.308)

PRE-IMPLEMENTATION:
☐ Confirm Phase 1 COMPLETE
☐ PHI inventory reviewed and current

IMPLEMENTATION:
☐ RBAC system - role-based access to PHI data
☐ Unique user IDs for all accounts
☐ Auto logout after 15 minutes of inactivity
☐ Emergency access procedure (break-glass)
☐ Comprehensive audit logs for all PHI access
☐ Password policies (complexity, rotation, history)
☐ ALL admin/diagnostic tools in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs §164.308 implementation)
☐ Update SRS with administrative safeguards

COMPLETION REQUIREMENTS:
✅ RBAC operational with role separation
✅ Auto-logout 15min verified
✅ Audit logs capturing all PHI access
✅ Password policies enforced
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`;

const HIPAA_DIRECTIVE_3 = `EXECUTE PHASE 3 ONLY - HIPAA TECHNICAL SAFEGUARDS (§164.310, §164.312)

PRE-IMPLEMENTATION:
☐ Confirm Phase 2 COMPLETE
☐ Confirm RBAC and audit logs operational

IMPLEMENTATION:
☐ AES-256 encryption at rest for all PHI
☐ TLS 1.3 in transit (no downgrade to TLS 1.2)
☐ Data integrity controls (checksums/HMAC)
☐ MFA for all admin and PHI-access accounts
☐ Encrypted automated backups with restoration tests
☐ ZERO broken links in implemented features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs §164.310/312)
☐ Update SRS with technical safeguards

COMPLETION REQUIREMENTS:
✅ AES-256 at rest verified
✅ TLS 1.3 enforced
✅ MFA operational for admins
✅ Backup/restore tested
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`;

const HIPAA_DIRECTIVE_4 = `EXECUTE PHASE 4 ONLY - HIPAA PRIVACY & ACCESS CONTROLS

PRE-IMPLEMENTATION:
☐ Confirm Phase 3 COMPLETE
☐ Confirm encryption controls verified

IMPLEMENTATION:
☐ Minimum necessary access policy enforcement
☐ Patient consent tracking system
☐ Patient portal with rights management
☐ Accounting of disclosures log (6-year retention)
☐ Breach notification workflow (within 60 days of discovery)
☐ ZERO broken links in privacy features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Privacy Rule)
☐ Update SRS with privacy controls

COMPLETION REQUIREMENTS:
✅ Minimum necessary access enforced
✅ Consent tracking operational
✅ Disclosure accounting implemented
✅ Breach notification workflow documented
✅ Gap analysis completed and SRS updated
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`;

const HIPAA_DIRECTIVE_5 = `EXECUTE PHASE 5 ONLY - HIPAA TESTING & TECHNICAL DOCUMENTATION

PRE-IMPLEMENTATION:
☐ Confirm Phase 4 COMPLETE
☐ All safeguards operational

IMPLEMENTATION:
☐ Execute HIPAA-specific E2E test suite
☐ Risk assessment document (NIST 800-30)
☐ Security architecture SVG (system-level)
☐ PHI data flow SVG diagram
☐ HIPAA compliance checklist
☐ Incident response plan (IRP)
☐ Business Associate Agreement (BAA) template
☐ ALL tests and diagnostics in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs full implementation)
☐ Update SRS to as-built state

COMPLETION REQUIREMENTS:
✅ HIPAA test suite passing
✅ Risk assessment complete
✅ Architecture and data flow SVGs generated
✅ IRP and BAA template created
✅ Gap analysis completed and SRS updated
✅ State "PHASE 5 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 6 UNTIL CONFIRMED`;

const HIPAA_DIRECTIVE_6 = `EXECUTE PHASE 6 ONLY - HIPAA ADMINISTRATIVE DOCUMENTATION

PRE-IMPLEMENTATION:
☐ Confirm ALL Phases 1-5 COMPLETE
☐ All technical controls verified

IMPLEMENTATION:
☐ Administrator guide for HIPAA controls
☐ Staff training guide and programme
☐ Patient rights guide
☐ Final SRS sync to as-built state (v3.0.0)
☐ Organise all artefacts in /docs/hipaa/
☐ Final verification - ZERO broken links

COMPLETION REQUIREMENTS:
✅ All documentation created and reviewed
✅ /docs/hipaa/ organised and complete
✅ SRS updated to v3.0.0 as-built
✅ ZERO broken links verified
✅ State "PHASE 6 COMPLETE - HIPAA REFRESH FINISHED"`;

// ─────────────────────────────────────────────────────────────────────────────
// PCI-DSS
// ─────────────────────────────────────────────────────────────────────────────
const PCI_DIRECTIVE_1 = `EXECUTE PHASE 1 ONLY - PCI-DSS FOUNDATION & SCOPE

PRE-FLIGHT CHECKS:
☐ Verify React version = 19.2.4
☐ Identify all cardholder data entry points
☐ Confirm SRS document exists

IMPLEMENTATION:
☐ Generate IEEE SRS with PCI-DSS section
☐ Define CDE (Cardholder Data Environment) boundaries
☐ Create data flow diagram showing all CHD movement
☐ Document data retention policies
☐ Execute initial gap analysis (SRS vs current state)

COMPLETION REQUIREMENTS:
✅ SRS with PCI-DSS section created
✅ CDE scope defined and documented
✅ Data flow diagram complete
✅ Retention policies documented
✅ Gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_2 = `EXECUTE PHASE 2 ONLY - NETWORK SECURITY (REQ 1-2)

PRE-IMPLEMENTATION:
☐ Confirm Phase 1 COMPLETE
☐ CDE boundary map reviewed

IMPLEMENTATION:
☐ Network segmentation isolating CDE
☐ Firewall rules (ingress/egress for CDE)
☐ Remove all vendor-supplied defaults (passwords, SNMP)
☐ Maintain system inventory for CDE components
☐ ZERO broken links in network security features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Req 1-2)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ CDE isolated via network segmentation
✅ Firewall rules documented and tested
✅ All defaults removed
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_3 = `EXECUTE PHASE 3 ONLY - DATA PROTECTION (REQ 3-4)

PRE-IMPLEMENTATION:
☐ Confirm Phase 2 COMPLETE

IMPLEMENTATION:
☐ AES-256 encryption for stored CHD
☐ PAN masking (show max 6 first / 4 last digits)
☐ TLS 1.2+ for all CHD in transit (TLS 1.3 preferred)
☐ No storage of sensitive authentication data post-authorisation
☐ Key management procedures and hardware security modules

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Req 3-4)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ AES-256 verified for all CHD at rest
✅ PAN masking implemented
✅ TLS enforced for CHD in transit
✅ No SAD storage confirmed
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_4 = `EXECUTE PHASE 4 ONLY - VULNERABILITY MANAGEMENT (REQ 5-6)

PRE-IMPLEMENTATION:
☐ Confirm Phase 3 COMPLETE

IMPLEMENTATION:
☐ Anti-malware deployment on all applicable systems
☐ Secure SDLC with code review processes
☐ Vulnerability scanning (internal and external quarterly)
☐ WAF deployment protecting web-facing applications
☐ Security patching SLAs (critical: 30 days, high: 60 days)

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Req 5-6)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Anti-malware operational
✅ Secure SDLC process documented
✅ Vulnerability scanning scheduled
✅ WAF protecting all web interfaces
✅ Gap analysis completed and SRS updated
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_5 = `EXECUTE PHASE 5 ONLY - ACCESS CONTROLS (REQ 7-8)

PRE-IMPLEMENTATION:
☐ Confirm Phase 4 COMPLETE

IMPLEMENTATION:
☐ RBAC with need-to-know principle for CHD
☐ Unique user IDs for all system accounts
☐ MFA for all access to CDE
☐ Password policies (length, complexity, rotation, lockout)
☐ Session timeout for idle connections
☐ ALL admin/diagnostic tools in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Req 7-8)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ RBAC need-to-know enforced
✅ MFA operational for all CDE access
✅ Password and lockout policies verified
✅ Session timeout tested
✅ Gap analysis completed and SRS updated
✅ State "PHASE 5 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 6 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_6 = `EXECUTE PHASE 6 ONLY - MONITORING & TESTING (REQ 10-11)

PRE-IMPLEMENTATION:
☐ Confirm Phase 5 COMPLETE

IMPLEMENTATION:
☐ Comprehensive audit logs for all CDE access
☐ Daily log review process with alerting
☐ NTP time synchronisation across all CDE systems
☐ File integrity monitoring (FIM) for critical files
☐ Annual penetration test (internal and external)
☐ Quarterly ASV vulnerability scans

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Req 10-11)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Audit logging with daily review process
✅ FIM operational
✅ Penetration test scheduled and documented
✅ Gap analysis completed and SRS updated
✅ State "PHASE 6 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 7 UNTIL CONFIRMED`;

const PCI_DIRECTIVE_7 = `EXECUTE PHASE 7 ONLY - SECURITY POLICY (REQ 12)

PRE-IMPLEMENTATION:
☐ Confirm ALL Phases 1-6 COMPLETE

IMPLEMENTATION:
☐ Information security policy (annual review cycle)
☐ PCI-DSS compliance manual
☐ Security awareness training programme
☐ Architecture diagrams (network, data flow)
☐ Self-Assessment Questionnaire (SAQ) completion
☐ Final SRS sync to as-built state (v3.0.0)
☐ ZERO broken links verified across all features

COMPLETION REQUIREMENTS:
✅ Security policy published and signed off
✅ Compliance manual complete
✅ Training programme documented
✅ SAQ completed
✅ SRS updated to v3.0.0 as-built
✅ State "PHASE 7 COMPLETE - PCI-DSS REFRESH FINISHED"`;

// ─────────────────────────────────────────────────────────────────────────────
// SOC 2
// ─────────────────────────────────────────────────────────────────────────────
const SOC2_DIRECTIVE_1 = `EXECUTE PHASE 1 ONLY - SOC 2 FOUNDATION & SCOPE

PRE-FLIGHT CHECKS:
☐ Verify React version = 19.2.4
☐ Identify in-scope systems and services
☐ Confirm SRS document exists

IMPLEMENTATION:
☐ Generate IEEE SRS with SOC 2 section
☐ Define audit scope (Type I or Type II)
☐ Identify applicable Trust Service Criteria (TSC)
☐ Draft system description for auditors
☐ Execute initial gap analysis (SRS vs current state)

COMPLETION REQUIREMENTS:
✅ SRS with SOC 2 section created
✅ Scope and TSC criteria documented
✅ System description drafted
✅ Gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_2 = `EXECUTE PHASE 2 ONLY - ORGANISATION & MANAGEMENT (CC1)

PRE-IMPLEMENTATION:
☐ Confirm Phase 1 COMPLETE

IMPLEMENTATION:
☐ Document organisational structure and responsibilities
☐ Establish information security policy framework
☐ Board/management security oversight procedures
☐ Third-party risk management programme
☐ ZERO broken links in implemented features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs CC1)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Org structure and RACI documented
✅ Security policy framework published
✅ Third-party risk management in place
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_3 = `EXECUTE PHASE 3 ONLY - COMMUNICATION & MONITORING (CC2-CC3)

PRE-IMPLEMENTATION:
☐ Confirm Phase 2 COMPLETE

IMPLEMENTATION:
☐ Security awareness training programme
☐ Internal and external communication mechanisms
☐ SIEM monitoring and alerting
☐ Incident escalation procedures

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs CC2-CC3)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Security training programme documented
✅ SIEM/monitoring operational
✅ Incident escalation process defined
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_4 = `EXECUTE PHASE 4 ONLY - RISK ASSESSMENT (CC4-CC5)

PRE-IMPLEMENTATION:
☐ Confirm Phase 3 COMPLETE

IMPLEMENTATION:
☐ Formal risk assessment process and schedule
☐ Risk register with scoring and owner assignment
☐ Business Continuity / Disaster Recovery (BC/DR) plan
☐ Incident response plan (IRP) with tabletop exercises

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs CC4-CC5)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Risk register current and reviewed
✅ BC/DR plan tested
✅ IRP tested via tabletop exercise
✅ Gap analysis completed and SRS updated
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_5 = `EXECUTE PHASE 5 ONLY - ACCESS CONTROLS (CC6)

PRE-IMPLEMENTATION:
☐ Confirm Phase 4 COMPLETE

IMPLEMENTATION:
☐ IAM system with role-based access
☐ MFA for all user accounts
☐ Periodic access reviews (quarterly minimum)
☐ Privileged access management (PAM)
☐ Comprehensive audit logging for access events
☐ ALL diagnostics and admin tools in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs CC6)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ IAM and MFA operational
✅ Access review process running
✅ PAM implemented
✅ Audit logging for access events verified
✅ Gap analysis completed and SRS updated
✅ State "PHASE 5 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 6 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_6 = `EXECUTE PHASE 6 ONLY - OPERATIONS & CHANGE MANAGEMENT (CC7-CC8)

PRE-IMPLEMENTATION:
☐ Confirm Phase 5 COMPLETE

IMPLEMENTATION:
☐ Documented operations procedures
☐ Change management process (request → approval → test → deploy)
☐ Environment separation (dev / staging / production)
☐ Encryption controls for data at rest and in transit

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs CC7-CC8)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Change management process operational
✅ Environment separation verified
✅ Encryption controls confirmed
✅ Gap analysis completed and SRS updated
✅ State "PHASE 6 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 7 UNTIL CONFIRMED`;

const SOC2_DIRECTIVE_7 = `EXECUTE PHASE 7 ONLY - TESTING & EVIDENCE COLLECTION

PRE-IMPLEMENTATION:
☐ Confirm ALL Phases 1-6 COMPLETE

IMPLEMENTATION:
☐ Control testing for all implemented TSC criteria
☐ Evidence collection and artefact packaging
☐ SOC 2 system description (final)
☐ Architecture diagrams (network and data flow)
☐ Audit readiness assessment
☐ Final SRS sync to as-built state (v3.0.0)
☐ ZERO broken links verified

COMPLETION REQUIREMENTS:
✅ All controls tested with evidence collected
✅ SOC 2 description finalised
✅ Architecture diagrams complete
✅ SRS updated to v3.0.0 as-built
✅ State "PHASE 7 COMPLETE - SOC 2 REFRESH FINISHED"`;

// ─────────────────────────────────────────────────────────────────────────────
// GDPR
// ─────────────────────────────────────────────────────────────────────────────
const GDPR_DIRECTIVE_1 = `EXECUTE PHASE 1 ONLY - GDPR FOUNDATION & DATA MAPPING

PRE-FLIGHT CHECKS:
☐ Verify React version = 19.2.4
☐ Identify all personal data processed
☐ Confirm SRS document exists

IMPLEMENTATION:
☐ Generate IEEE SRS with GDPR section
☐ Complete PII data inventory (what, where, how long)
☐ Create PII storage map (at-rest and in-transit)
☐ Article 30 records of processing activities (RoPA)
☐ Data flow mapping across all systems
☐ Document legal basis for each processing activity
☐ Establish compliance structure (/docs/gdpr/)
☐ Execute initial gap analysis (SRS vs current state)

COMPLETION REQUIREMENTS:
✅ SRS with GDPR section created
✅ PII inventory, storage map, and RoPA documented
✅ Legal basis documented for all processing
✅ Gap analysis report generated
✅ State "PHASE 1 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 2 UNTIL CONFIRMED`;

const GDPR_DIRECTIVE_2 = `EXECUTE PHASE 2 ONLY - LAWFUL BASIS & CONSENT (ART 5-7, 12-14)

PRE-IMPLEMENTATION:
☐ Confirm Phase 1 COMPLETE
☐ Legal basis documented for all processing activities

IMPLEMENTATION:
☐ Consent management system (granular, withdrawable)
☐ Privacy notices (Art 13/14 compliant)
☐ Legitimate Interest Assessments (LIA) where applicable
☐ Data Processing Agreement (DPA) templates
☐ Age verification (Art 8 - COPPA/GDPR-K)
☐ ZERO broken links in consent/privacy features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Art 5-7, 12-14)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Consent management operational and logged
✅ Privacy notices accessible and compliant
✅ DPA templates available
✅ Gap analysis completed and SRS updated
✅ State "PHASE 2 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 3 UNTIL CONFIRMED`;

const GDPR_DIRECTIVE_3 = `EXECUTE PHASE 3 ONLY - DATA SUBJECT RIGHTS (ART 15-22)

PRE-IMPLEMENTATION:
☐ Confirm Phase 2 COMPLETE

IMPLEMENTATION:
☐ DSAR portal (respond within 30 days)
☐ Right to rectification (Art 16)
☐ Right to erasure / right to be forgotten (Art 17)
☐ Data portability export (Art 20 - machine-readable)
☐ Right to object and restrict processing (Art 21-22)
☐ ZERO broken links in data subject rights features

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Art 15-22)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ DSAR portal operational with 30-day SLA
✅ Erasure and portability workflows tested
✅ Right to object process documented
✅ Gap analysis completed and SRS updated
✅ State "PHASE 3 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 4 UNTIL CONFIRMED`;

const GDPR_DIRECTIVE_4 = `EXECUTE PHASE 4 ONLY - SECURITY MEASURES (ART 25, 32)

PRE-IMPLEMENTATION:
☐ Confirm Phase 3 COMPLETE

IMPLEMENTATION:
☐ Privacy by design and default (Art 25)
☐ AES-256 at rest + TLS 1.3 in transit
☐ Breach detection system
☐ 72-hour breach notification to supervisory authority
☐ Automated data deletion per retention schedules
☐ ALL diagnostics in /admin section only

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Art 25, 32)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ Privacy by design implemented
✅ Encryption verified
✅ 72-hour breach notification workflow tested
✅ Auto-deletion running per schedule
✅ Gap analysis completed and SRS updated
✅ State "PHASE 4 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 5 UNTIL CONFIRMED`;

const GDPR_DIRECTIVE_5 = `EXECUTE PHASE 5 ONLY - ACCOUNTABILITY (ART 24, 35-39)

PRE-IMPLEMENTATION:
☐ Confirm Phase 4 COMPLETE

IMPLEMENTATION:
☐ Data Protection Impact Assessment (DPIA) system
☐ DPO appointment or documented decision not to appoint
☐ Processor management (sub-processor DPAs, audit rights)
☐ Regular compliance audit schedule

POST-IMPLEMENTATION:
☐ Execute gap analysis (SRS vs Art 24, 35-39)
☐ Update SRS

COMPLETION REQUIREMENTS:
✅ DPIA process operational
✅ DPO status documented
✅ Processor management framework in place
✅ Compliance audit schedule established
✅ Gap analysis completed and SRS updated
✅ State "PHASE 5 COMPLETE - GAP ANALYSIS REPORT ATTACHED"

DO NOT PROCEED TO PHASE 6 UNTIL CONFIRMED`;

const GDPR_DIRECTIVE_6 = `EXECUTE PHASE 6 ONLY - DOCUMENTATION & TRAINING

PRE-IMPLEMENTATION:
☐ Confirm ALL Phases 1-5 COMPLETE

IMPLEMENTATION:
☐ Finalise Article 30 Records of Processing Activities
☐ Staff training programme and records
☐ GDPR compliance diagrams (data flow, processing map)
☐ Cookie consent banner and preference centre
☐ Organise all artefacts in /docs/gdpr/
☐ Final SRS sync to as-built state (v3.0.0)
☐ ZERO broken links verified

COMPLETION REQUIREMENTS:
✅ RoPA finalised and current
✅ Training records complete
✅ /docs/gdpr/ organised
✅ SRS updated to v3.0.0 as-built
✅ State "PHASE 6 COMPLETE - GDPR REFRESH FINISHED"`;

// ─────────────────────────────────────────────────────────────────────────────
// FRAMEWORK DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
export const FRAMEWORKS: Framework[] = [
    {
        id: 'standard',
        title: 'Standard Project Refresh',
        phases: [
            {
                id: 1,
                title: 'FOUNDATION SETUP',
                description: 'Synchronise project, verify all files, generate/update IEEE SRS v3.0.0, verify React 19.2.4 compliance',
                status: 'In Progress',
                tasks: [
                    { id: 's1-t1', title: 'Verify React version = 19.2.4 in package.json', status: 'In Progress' },
                    { id: 's1-t2', title: 'Review all existing links/buttons — flag any broken ones', status: 'In Progress' },
                    { id: 's1-t3', title: 'Confirm SRS document exists and is current', status: 'In Progress' },
                    { id: 's1-t4', title: 'Clean project synchronisation — reset to latest stable', status: 'In Progress' },
                    { id: 's1-t5', title: 'Generate/update IEEE Standard SRS for current state', status: 'In Progress' },
                    { id: 's1-t6', title: 'Regenerate primary AI agent component', status: 'In Progress' },
                    { id: 's1-t7', title: 'Execute initial gap analysis (SRS vs current implementation)', status: 'In Progress' },
                ],
                deliverables: ['SRS.md (v1.0.0 — IEEE 830)', 'Gap Analysis Report (Phase 1)', 'React 19.2.4 confirmation log'],
                directive: STANDARD_DIRECTIVE_1,
            },
            {
                id: 2,
                title: 'CORE IMPLEMENTATION',
                description: 'Admin section with password-protection, Audit Logging, 100% ARIA coverage, Light/Dark/High-Contrast themes',
                status: 'Pending',
                tasks: [
                    { id: 's2-t1', title: 'Confirm React 19.2.4 in use', status: 'In Progress' },
                    { id: 's2-t2', title: 'Review all planned links — ensure all are implementable', status: 'In Progress' },
                    { id: 's2-t3', title: 'Implement admin section with password-protected auth (#/admin)', status: 'In Progress' },
                    { id: 's2-t4', title: 'Move ALL diagnostics to /admin/* routes', status: 'In Progress' },
                    { id: 's2-t5', title: 'Implement comprehensive audit logging for admin actions', status: 'In Progress' },
                    { id: 's2-t6', title: 'Add full ARIA labels, keyboard navigation, screen reader support', status: 'In Progress' },
                    { id: 's2-t7', title: 'Implement Light, Dark, and High-Contrast themes', status: 'In Progress' },
                    { id: 's2-t8', title: 'Verify ZERO broken links in all implemented features', status: 'In Progress' },
                    { id: 's2-t9', title: 'Execute gap analysis and update SRS', status: 'In Progress' },
                ],
                deliverables: ['Admin section (/admin route + auth)', 'Audit log system', 'Theme switcher (3 modes)', 'Gap Analysis Report (Phase 2)', 'Updated SRS.md'],
                directive: STANDARD_DIRECTIVE_2,
            },
            {
                id: 3,
                title: 'TESTING FRAMEWORK',
                description: 'Internal diagnostics in Admin section, Playwright E2E suite, interactive test dashboard with screenshot capture',
                status: 'Pending',
                tasks: [
                    { id: 's3-t1', title: 'Integrate internal diagnostic/simulation tools in Admin section', status: 'In Progress' },
                    { id: 's3-t2', title: 'Create Playwright E2E test suite covering all core flows', status: 'In Progress' },
                    { id: 's3-t3', title: 'Implement interactive test dashboard with screenshot capture', status: 'In Progress' },
                    { id: 's3-t4', title: 'Verify all core user flows via automated tests', status: 'In Progress' },
                    { id: 's3-t5', title: 'Confirm all diagnostic tools are in /admin only', status: 'In Progress' },
                    { id: 's3-t6', title: 'Execute gap analysis and update SRS', status: 'In Progress' },
                ],
                deliverables: ['Playwright E2E suite (playwright.config.ts)', 'Test dashboard in /admin', 'Screenshot capture tooling', 'Gap Analysis Report (Phase 3)', 'Updated SRS.md'],
                directive: STANDARD_DIRECTIVE_3,
            },
            {
                id: 4,
                title: 'DOCUMENTATION & DIAGRAMS',
                description: 'System Architecture SVG, Database/Data Flow SVG, Admin Guide (.md), Deployment and Testing Guides (.md)',
                status: 'Pending',
                tasks: [
                    { id: 's4-t1', title: 'Generate System Architecture SVG diagram', status: 'In Progress' },
                    { id: 's4-t2', title: 'Generate Database/Data Flow SVG diagram', status: 'In Progress' },
                    { id: 's4-t3', title: 'Create comprehensive Admin Guide (.md)', status: 'In Progress' },
                    { id: 's4-t4', title: 'Create Deployment Guide (.md)', status: 'In Progress' },
                    { id: 's4-t5', title: 'Create Testing Guide (.md)', status: 'In Progress' },
                    { id: 's4-t6', title: 'Organise all files in /docs directory', status: 'In Progress' },
                    { id: 's4-t7', title: 'Verify ZERO broken links in all documentation', status: 'In Progress' },
                    { id: 's4-t8', title: 'Execute gap analysis and update SRS', status: 'In Progress' },
                ],
                deliverables: ['docs/Architecture.svg', 'docs/Database.svg', 'docs/AdminGuide.md', 'docs/DeploymentGuide.md', 'docs/TestingGuide.md', 'Gap Analysis Report (Phase 4)', 'Updated SRS.md'],
                directive: STANDARD_DIRECTIVE_4,
            },
            {
                id: 5,
                title: 'FINAL ALIGNMENT & PACKAGING',
                description: 'Gap Analysis (SRS ↔ Implementation), SRS sync to as-built v3.0.0, embed SVGs into SRS, organise /docs',
                status: 'Pending',
                tasks: [
                    { id: 's5-t1', title: 'Perform final Gap Analysis (SRS ↔ Implementation two-way sync)', status: 'In Progress' },
                    { id: 's5-t2', title: 'Synchronise SRS to as-built state (v3.0.0)', status: 'In Progress' },
                    { id: 's5-t3', title: 'Embed all SVG diagrams into SRS document', status: 'In Progress' },
                    { id: 's5-t4', title: 'Organise all guides and diagrams in /docs directory', status: 'In Progress' },
                    { id: 's5-t5', title: 'Verify ZERO broken links across entire application', status: 'In Progress' },
                    { id: 's5-t6', title: 'Confirm all diagnostics confined to /admin section', status: 'In Progress' },
                    { id: 's5-t7', title: 'Final accessibility audit (WCAG 2.1 AA)', status: 'In Progress' },
                    { id: 's5-t8', title: 'Confirm React version is still 19.2.4', status: 'In Progress' },
                ],
                deliverables: ['SRS.md (v3.0.0 — as-built)', 'Final Gap Analysis Report', 'Organised /docs directory', 'ZERO broken links confirmation'],
                directive: STANDARD_DIRECTIVE_5,
            },
        ],
    },
    {
        id: 'hipaa',
        title: 'HIPAA Healthcare Compliance',
        phases: [
            {
                id: 1, title: 'Foundation & Compliance Baseline', status: 'In Progress',
                description: 'IEEE SRS with HIPAA section, PHI data inventory, PHI storage map, compliance structure',
                tasks: [
                    { id: 'h1-t1', title: 'Verify React 19.2.4 in package.json', status: 'In Progress' },
                    { id: 'h1-t2', title: 'Generate IEEE SRS with HIPAA compliance section', status: 'In Progress' },
                    { id: 'h1-t3', title: 'Complete PHI data inventory (what, where, who has access)', status: 'In Progress' },
                    { id: 'h1-t4', title: 'Create PHI storage map (at-rest and in-transit)', status: 'In Progress' },
                    { id: 'h1-t5', title: 'Establish /docs/hipaa/ compliance structure', status: 'In Progress' },
                    { id: 'h1-t6', title: 'Execute initial gap analysis', status: 'In Progress' },
                ],
                deliverables: ['SRS.md with HIPAA section', 'PHI Data Inventory', 'PHI Storage Map', 'Gap Analysis Report (Phase 1)'],
                directive: HIPAA_DIRECTIVE_1,
            },
            {
                id: 2, title: 'Administrative Safeguards (§164.308)', status: 'Pending',
                description: 'RBAC system, unique user IDs, auto logout 15min, emergency access, comprehensive audit logs, password policies',
                tasks: [
                    { id: 'h2-t1', title: 'Implement RBAC system with role separation', status: 'In Progress' },
                    { id: 'h2-t2', title: 'Assign unique user IDs for all accounts', status: 'In Progress' },
                    { id: 'h2-t3', title: 'Implement auto logout after 15 minutes of inactivity', status: 'In Progress' },
                    { id: 'h2-t4', title: 'Create emergency access (break-glass) procedure', status: 'In Progress' },
                    { id: 'h2-t5', title: 'Implement comprehensive audit logs for all PHI access', status: 'In Progress' },
                    { id: 'h2-t6', title: 'Enforce password policies (complexity, rotation, history)', status: 'In Progress' },
                ],
                deliverables: ['RBAC configuration', 'Auto-logout implementation', 'Audit log system', 'Password policy document', 'Gap Analysis Report (Phase 2)'],
                directive: HIPAA_DIRECTIVE_2,
            },
            {
                id: 3, title: 'Technical Safeguards (§164.310, §164.312)', status: 'Pending',
                description: 'AES-256 at rest, TLS 1.3 in transit, integrity controls, MFA for admins, encrypted backups',
                tasks: [
                    { id: 'h3-t1', title: 'Implement AES-256 encryption for all PHI at rest', status: 'In Progress' },
                    { id: 'h3-t2', title: 'Enforce TLS 1.3 for all PHI in transit', status: 'In Progress' },
                    { id: 'h3-t3', title: 'Add data integrity controls (checksums/HMAC)', status: 'In Progress' },
                    { id: 'h3-t4', title: 'Implement MFA for all admin and PHI-access accounts', status: 'In Progress' },
                    { id: 'h3-t5', title: 'Configure encrypted automated backups with restoration tests', status: 'In Progress' },
                ],
                deliverables: ['AES-256 encryption verified', 'TLS 1.3 configuration', 'MFA implementation', 'Backup/restore test results', 'Gap Analysis Report (Phase 3)'],
                directive: HIPAA_DIRECTIVE_3,
            },
            {
                id: 4, title: 'Privacy & Access Controls', status: 'Pending',
                description: 'Minimum necessary access, consent tracking, patient portal, accounting of disclosures, breach notification',
                tasks: [
                    { id: 'h4-t1', title: 'Enforce minimum necessary access policy', status: 'In Progress' },
                    { id: 'h4-t2', title: 'Build patient consent tracking system', status: 'In Progress' },
                    { id: 'h4-t3', title: 'Implement patient portal with rights management', status: 'In Progress' },
                    { id: 'h4-t4', title: 'Create accounting of disclosures log (6-year retention)', status: 'In Progress' },
                    { id: 'h4-t5', title: 'Build breach notification workflow (60-day window)', status: 'In Progress' },
                ],
                deliverables: ['Consent tracking system', 'Patient portal', 'Disclosure accounting log', 'Breach notification workflow', 'Gap Analysis Report (Phase 4)'],
                directive: HIPAA_DIRECTIVE_4,
            },
            {
                id: 5, title: 'Testing & Technical Documentation', status: 'Pending',
                description: 'HIPAA test suite, risk assessment, security architecture SVG, PHI data flow SVG, compliance checklist, incident response plan, BAA template',
                tasks: [
                    { id: 'h5-t1', title: 'Execute HIPAA-specific E2E test suite', status: 'In Progress' },
                    { id: 'h5-t2', title: 'Complete risk assessment (NIST 800-30)', status: 'In Progress' },
                    { id: 'h5-t3', title: 'Generate Security Architecture SVG', status: 'In Progress' },
                    { id: 'h5-t4', title: 'Generate PHI Data Flow SVG', status: 'In Progress' },
                    { id: 'h5-t5', title: 'Create HIPAA compliance checklist', status: 'In Progress' },
                    { id: 'h5-t6', title: 'Draft Incident Response Plan (IRP)', status: 'In Progress' },
                    { id: 'h5-t7', title: 'Create Business Associate Agreement (BAA) template', status: 'In Progress' },
                ],
                deliverables: ['HIPAA test suite results', 'Risk Assessment (NIST 800-30)', 'Security Architecture SVG', 'PHI Data Flow SVG', 'Compliance Checklist', 'IRP', 'BAA Template', 'Gap Analysis Report (Phase 5)'],
                directive: HIPAA_DIRECTIVE_5,
            },
            {
                id: 6, title: 'Administrative Documentation', status: 'Pending',
                description: 'Administrator guide, training guide, patient rights guide, updated SRS, organised /docs/hipaa/, final verification',
                tasks: [
                    { id: 'h6-t1', title: 'Write administrator guide for HIPAA controls', status: 'In Progress' },
                    { id: 'h6-t2', title: 'Create staff training guide and programme', status: 'In Progress' },
                    { id: 'h6-t3', title: 'Write patient rights guide', status: 'In Progress' },
                    { id: 'h6-t4', title: 'Sync SRS to as-built state (v3.0.0)', status: 'In Progress' },
                    { id: 'h6-t5', title: 'Organise all artefacts in /docs/hipaa/', status: 'In Progress' },
                    { id: 'h6-t6', title: 'Verify ZERO broken links', status: 'In Progress' },
                ],
                deliverables: ['Admin Guide', 'Staff Training Guide', 'Patient Rights Guide', 'SRS v3.0.0 (as-built)', 'Organised /docs/hipaa/'],
                directive: HIPAA_DIRECTIVE_6,
            },
        ],
    },
    {
        id: 'pci',
        title: 'PCI-DSS Payment Security',
        phases: [
            {
                id: 1, title: 'Foundation & Scope', status: 'In Progress',
                description: 'SRS with PCI-DSS section, CDE boundaries, data flow diagram, retention policies',
                tasks: [
                    { id: 'p1-t1', title: 'Verify React 19.2.4 in package.json', status: 'In Progress' },
                    { id: 'p1-t2', title: 'Generate IEEE SRS with PCI-DSS section', status: 'In Progress' },
                    { id: 'p1-t3', title: 'Define and document CDE boundaries', status: 'In Progress' },
                    { id: 'p1-t4', title: 'Create data flow diagram (all CHD movement)', status: 'In Progress' },
                    { id: 'p1-t5', title: 'Document data retention policies', status: 'In Progress' },
                    { id: 'p1-t6', title: 'Execute initial gap analysis', status: 'In Progress' },
                ],
                deliverables: ['SRS.md with PCI-DSS section', 'CDE scope document', 'Data flow diagram', 'Retention policy', 'Gap Analysis Report (Phase 1)'],
                directive: PCI_DIRECTIVE_1,
            },
            {
                id: 2, title: 'Network Security (Req 1-2)', status: 'Pending',
                description: 'Network segmentation, firewall rules, remove defaults, system inventory',
                tasks: [
                    { id: 'p2-t1', title: 'Implement network segmentation isolating CDE', status: 'In Progress' },
                    { id: 'p2-t2', title: 'Configure and document firewall rules (ingress/egress)', status: 'In Progress' },
                    { id: 'p2-t3', title: 'Remove all vendor-supplied defaults', status: 'In Progress' },
                    { id: 'p2-t4', title: 'Maintain system inventory for CDE components', status: 'In Progress' },
                ],
                deliverables: ['Network segmentation diagram', 'Firewall rule set', 'Defaults removal checklist', 'CDE system inventory', 'Gap Analysis Report (Phase 2)'],
                directive: PCI_DIRECTIVE_2,
            },
            {
                id: 3, title: 'Data Protection (Req 3-4)', status: 'Pending',
                description: 'AES-256 at rest, PAN masking, TLS 1.2+, no sensitive auth data storage, key management',
                tasks: [
                    { id: 'p3-t1', title: 'Implement AES-256 encryption for stored CHD', status: 'In Progress' },
                    { id: 'p3-t2', title: 'Implement PAN masking (first 6 / last 4 digits)', status: 'In Progress' },
                    { id: 'p3-t3', title: 'Enforce TLS 1.2+ for all CHD in transit', status: 'In Progress' },
                    { id: 'p3-t4', title: 'Confirm no SAD storage post-authorisation', status: 'In Progress' },
                    { id: 'p3-t5', title: 'Implement key management procedures', status: 'In Progress' },
                ],
                deliverables: ['AES-256 configuration', 'PAN masking implementation', 'TLS certificate configuration', 'Key management procedures', 'Gap Analysis Report (Phase 3)'],
                directive: PCI_DIRECTIVE_3,
            },
            {
                id: 4, title: 'Vulnerability Management (Req 5-6)', status: 'Pending',
                description: 'Anti-malware, secure SDLC, vulnerability scanning, WAF/code review',
                tasks: [
                    { id: 'p4-t1', title: 'Deploy anti-malware on all applicable systems', status: 'In Progress' },
                    { id: 'p4-t2', title: 'Establish secure SDLC with code review', status: 'In Progress' },
                    { id: 'p4-t3', title: 'Schedule quarterly vulnerability scanning (internal + external)', status: 'In Progress' },
                    { id: 'p4-t4', title: 'Deploy WAF protecting web-facing applications', status: 'In Progress' },
                    { id: 'p4-t5', title: 'Document security patching SLAs', status: 'In Progress' },
                ],
                deliverables: ['Anti-malware deployment report', 'Secure SDLC process document', 'Vulnerability scan schedule', 'WAF configuration', 'Gap Analysis Report (Phase 4)'],
                directive: PCI_DIRECTIVE_4,
            },
            {
                id: 5, title: 'Access Controls (Req 7-8)', status: 'Pending',
                description: 'RBAC need-to-know, unique user IDs, MFA for CDE, password policies, session timeout',
                tasks: [
                    { id: 'p5-t1', title: 'Configure RBAC with need-to-know for CHD', status: 'In Progress' },
                    { id: 'p5-t2', title: 'Assign unique user IDs for all system accounts', status: 'In Progress' },
                    { id: 'p5-t3', title: 'Implement MFA for all CDE access', status: 'In Progress' },
                    { id: 'p5-t4', title: 'Enforce password complexity and lockout policies', status: 'In Progress' },
                    { id: 'p5-t5', title: 'Implement session timeout for idle connections', status: 'In Progress' },
                ],
                deliverables: ['RBAC configuration', 'MFA implementation', 'Password policy document', 'Session timeout configuration', 'Gap Analysis Report (Phase 5)'],
                directive: PCI_DIRECTIVE_5,
            },
            {
                id: 6, title: 'Monitoring & Testing (Req 10-11)', status: 'Pending',
                description: 'Comprehensive audit logs, daily log review, time sync, file integrity monitoring, pen testing',
                tasks: [
                    { id: 'p6-t1', title: 'Implement comprehensive audit logs for all CDE access', status: 'In Progress' },
                    { id: 'p6-t2', title: 'Configure daily log review with alerting', status: 'In Progress' },
                    { id: 'p6-t3', title: 'Configure NTP time synchronisation across CDE systems', status: 'In Progress' },
                    { id: 'p6-t4', title: 'Deploy file integrity monitoring (FIM)', status: 'In Progress' },
                    { id: 'p6-t5', title: 'Schedule annual penetration test', status: 'In Progress' },
                    { id: 'p6-t6', title: 'Schedule quarterly ASV vulnerability scans', status: 'In Progress' },
                ],
                deliverables: ['Audit log system', 'FIM deployment', 'Pen test schedule', 'ASV scan schedule', 'Gap Analysis Report (Phase 6)'],
                directive: PCI_DIRECTIVE_6,
            },
            {
                id: 7, title: 'Security Policy (Req 12)', status: 'Pending',
                description: 'Security policy, compliance manual, training programme, architecture diagrams, SAQ',
                tasks: [
                    { id: 'p7-t1', title: 'Write information security policy (annual review)', status: 'In Progress' },
                    { id: 'p7-t2', title: 'Create PCI-DSS compliance manual', status: 'In Progress' },
                    { id: 'p7-t3', title: 'Develop security awareness training programme', status: 'In Progress' },
                    { id: 'p7-t4', title: 'Create network and data flow architecture diagrams', status: 'In Progress' },
                    { id: 'p7-t5', title: 'Complete Self-Assessment Questionnaire (SAQ)', status: 'In Progress' },
                    { id: 'p7-t6', title: 'Sync SRS to as-built state (v3.0.0)', status: 'In Progress' },
                    { id: 'p7-t7', title: 'Verify ZERO broken links', status: 'In Progress' },
                ],
                deliverables: ['Security Policy', 'Compliance Manual', 'Training Programme', 'Architecture Diagrams', 'SAQ', 'SRS v3.0.0 (as-built)'],
                directive: PCI_DIRECTIVE_7,
            },
        ],
    },
    {
        id: 'soc2',
        title: 'SOC 2 Trust Services',
        phases: [
            {
                id: 1, title: 'Foundation & Scope', status: 'In Progress',
                description: 'SRS with SOC 2 section, define scope (Type I/II), identify TSC criteria, system description',
                tasks: [
                    { id: 'sc1-t1', title: 'Verify React 19.2.4 in package.json', status: 'In Progress' },
                    { id: 'sc1-t2', title: 'Generate IEEE SRS with SOC 2 section', status: 'In Progress' },
                    { id: 'sc1-t3', title: 'Define audit scope (Type I or Type II)', status: 'In Progress' },
                    { id: 'sc1-t4', title: 'Identify applicable Trust Service Criteria (TSC)', status: 'In Progress' },
                    { id: 'sc1-t5', title: 'Draft system description for auditors', status: 'In Progress' },
                    { id: 'sc1-t6', title: 'Execute initial gap analysis', status: 'In Progress' },
                ],
                deliverables: ['SRS.md with SOC 2 section', 'Scope definition', 'TSC criteria list', 'System description draft', 'Gap Analysis Report (Phase 1)'],
                directive: SOC2_DIRECTIVE_1,
            },
            {
                id: 2, title: 'Organisation & Management (CC1)', status: 'Pending',
                description: 'Org structure, security policy framework, board oversight, third-party risk management',
                tasks: [
                    { id: 'sc2-t1', title: 'Document organisational structure and RACI', status: 'In Progress' },
                    { id: 'sc2-t2', title: 'Establish information security policy framework', status: 'In Progress' },
                    { id: 'sc2-t3', title: 'Document board/management security oversight procedures', status: 'In Progress' },
                    { id: 'sc2-t4', title: 'Implement third-party risk management programme', status: 'In Progress' },
                ],
                deliverables: ['Org structure / RACI', 'Security policy framework', 'Oversight procedures', 'Third-party risk programme', 'Gap Analysis Report (Phase 2)'],
                directive: SOC2_DIRECTIVE_2,
            },
            {
                id: 3, title: 'Communication & Monitoring (CC2-CC3)', status: 'Pending',
                description: 'Security training, communication mechanisms, SIEM monitoring, incident escalation',
                tasks: [
                    { id: 'sc3-t1', title: 'Build security awareness training programme', status: 'In Progress' },
                    { id: 'sc3-t2', title: 'Establish internal and external communication mechanisms', status: 'In Progress' },
                    { id: 'sc3-t3', title: 'Deploy SIEM monitoring and alerting', status: 'In Progress' },
                    { id: 'sc3-t4', title: 'Define incident escalation procedures', status: 'In Progress' },
                ],
                deliverables: ['Training programme', 'Communication plan', 'SIEM configuration', 'Escalation procedures', 'Gap Analysis Report (Phase 3)'],
                directive: SOC2_DIRECTIVE_3,
            },
            {
                id: 4, title: 'Risk Assessment (CC4-CC5)', status: 'Pending',
                description: 'Risk assessment process, risk register, BC/DR plan, incident response plan',
                tasks: [
                    { id: 'sc4-t1', title: 'Establish formal risk assessment process and schedule', status: 'In Progress' },
                    { id: 'sc4-t2', title: 'Create risk register with scoring and owner assignment', status: 'In Progress' },
                    { id: 'sc4-t3', title: 'Develop and test BC/DR plan', status: 'In Progress' },
                    { id: 'sc4-t4', title: 'Create IRP with tabletop exercise', status: 'In Progress' },
                ],
                deliverables: ['Risk register', 'BC/DR plan', 'IRP', 'Tabletop exercise results', 'Gap Analysis Report (Phase 4)'],
                directive: SOC2_DIRECTIVE_4,
            },
            {
                id: 5, title: 'Access Controls (CC6)', status: 'Pending',
                description: 'IAM system, MFA for all, access reviews, privileged access management, audit logging',
                tasks: [
                    { id: 'sc5-t1', title: 'Implement IAM system with role-based access', status: 'In Progress' },
                    { id: 'sc5-t2', title: 'Enforce MFA for all user accounts', status: 'In Progress' },
                    { id: 'sc5-t3', title: 'Establish quarterly access review process', status: 'In Progress' },
                    { id: 'sc5-t4', title: 'Implement Privileged Access Management (PAM)', status: 'In Progress' },
                    { id: 'sc5-t5', title: 'Configure comprehensive audit logging for access events', status: 'In Progress' },
                ],
                deliverables: ['IAM configuration', 'MFA implementation', 'Access review process', 'PAM implementation', 'Audit logs', 'Gap Analysis Report (Phase 5)'],
                directive: SOC2_DIRECTIVE_5,
            },
            {
                id: 6, title: 'Operations & Change Management (CC7-CC8)', status: 'Pending',
                description: 'Operations procedures, change management, environment separation, encryption controls',
                tasks: [
                    { id: 'sc6-t1', title: 'Document operations procedures', status: 'In Progress' },
                    { id: 'sc6-t2', title: 'Implement change management process (request → approval → test → deploy)', status: 'In Progress' },
                    { id: 'sc6-t3', title: 'Verify environment separation (dev / staging / production)', status: 'In Progress' },
                    { id: 'sc6-t4', title: 'Confirm encryption controls at rest and in transit', status: 'In Progress' },
                ],
                deliverables: ['Operations procedures', 'Change management process', 'Environment separation verification', 'Encryption controls audit', 'Gap Analysis Report (Phase 6)'],
                directive: SOC2_DIRECTIVE_6,
            },
            {
                id: 7, title: 'Testing & Evidence Collection', status: 'Pending',
                description: 'Control testing, evidence collection, SOC 2 description, architecture diagrams, audit readiness',
                tasks: [
                    { id: 'sc7-t1', title: 'Execute control testing for all TSC criteria', status: 'In Progress' },
                    { id: 'sc7-t2', title: 'Collect and package evidence artefacts', status: 'In Progress' },
                    { id: 'sc7-t3', title: 'Finalise SOC 2 system description', status: 'In Progress' },
                    { id: 'sc7-t4', title: 'Generate architecture and data flow diagrams', status: 'In Progress' },
                    { id: 'sc7-t5', title: 'Complete audit readiness assessment', status: 'In Progress' },
                    { id: 'sc7-t6', title: 'Sync SRS to as-built state (v3.0.0)', status: 'In Progress' },
                ],
                deliverables: ['Control testing results', 'Evidence package', 'SOC 2 system description', 'Architecture diagrams', 'SRS v3.0.0 (as-built)'],
                directive: SOC2_DIRECTIVE_7,
            },
        ],
    },
    {
        id: 'gdpr',
        title: 'GDPR Data Protection',
        phases: [
            {
                id: 1, title: 'Foundation & Data Mapping', status: 'In Progress',
                description: 'SRS with GDPR section, PII data inventory, PII storage map, Article 30 RoPA, data flow mapping, legal basis documentation',
                tasks: [
                    { id: 'g1-t1', title: 'Verify React 19.2.4 in package.json', status: 'In Progress' },
                    { id: 'g1-t2', title: 'Generate IEEE SRS with GDPR section', status: 'In Progress' },
                    { id: 'g1-t3', title: 'Complete PII data inventory (what, where, how long)', status: 'In Progress' },
                    { id: 'g1-t4', title: 'Create PII storage map (at-rest and in-transit)', status: 'In Progress' },
                    { id: 'g1-t5', title: 'Create Article 30 Records of Processing Activities (RoPA)', status: 'In Progress' },
                    { id: 'g1-t6', title: 'Map data flows across all systems', status: 'In Progress' },
                    { id: 'g1-t7', title: 'Document legal basis for each processing activity', status: 'In Progress' },
                    { id: 'g1-t8', title: 'Establish /docs/gdpr/ compliance structure', status: 'In Progress' },
                    { id: 'g1-t9', title: 'Execute initial gap analysis', status: 'In Progress' },
                ],
                deliverables: ['SRS.md with GDPR section', 'PII Inventory', 'PII Storage Map', 'Article 30 RoPA', 'Data Flow Map', 'Legal Basis Register', 'Gap Analysis Report (Phase 1)'],
                directive: GDPR_DIRECTIVE_1,
            },
            {
                id: 2, title: 'Lawful Basis & Consent (Art 5-7, 12-14)', status: 'Pending',
                description: 'Consent management, privacy notices, LIA assessments, DPA templates, age verification',
                tasks: [
                    { id: 'g2-t1', title: 'Build consent management system (granular, withdrawable)', status: 'In Progress' },
                    { id: 'g2-t2', title: 'Write Art 13/14-compliant privacy notices', status: 'In Progress' },
                    { id: 'g2-t3', title: 'Conduct Legitimate Interest Assessments (LIA) where applicable', status: 'In Progress' },
                    { id: 'g2-t4', title: 'Create Data Processing Agreement (DPA) templates', status: 'In Progress' },
                    { id: 'g2-t5', title: 'Implement age verification (Art 8)', status: 'In Progress' },
                ],
                deliverables: ['Consent management system', 'Privacy notices', 'LIA records', 'DPA templates', 'Age verification', 'Gap Analysis Report (Phase 2)'],
                directive: GDPR_DIRECTIVE_2,
            },
            {
                id: 3, title: 'Data Subject Rights (Art 15-22)', status: 'Pending',
                description: 'DSAR portal, right to rectification, right to erasure, data portability, right to object',
                tasks: [
                    { id: 'g3-t1', title: 'Build DSAR portal (30-day response SLA)', status: 'In Progress' },
                    { id: 'g3-t2', title: 'Implement right to rectification (Art 16)', status: 'In Progress' },
                    { id: 'g3-t3', title: 'Implement right to erasure / right to be forgotten (Art 17)', status: 'In Progress' },
                    { id: 'g3-t4', title: 'Implement data portability export (Art 20 — machine-readable)', status: 'In Progress' },
                    { id: 'g3-t5', title: 'Implement right to object and restrict processing (Art 21-22)', status: 'In Progress' },
                ],
                deliverables: ['DSAR portal', 'Erasure workflow', 'Portability export', 'Objection process', 'Gap Analysis Report (Phase 3)'],
                directive: GDPR_DIRECTIVE_3,
            },
            {
                id: 4, title: 'Security Measures (Art 25, 32)', status: 'Pending',
                description: 'Privacy by design, AES-256 + TLS 1.3, breach detection, 72-hour notification, auto-deletion',
                tasks: [
                    { id: 'g4-t1', title: 'Implement privacy by design and default (Art 25)', status: 'In Progress' },
                    { id: 'g4-t2', title: 'Enforce AES-256 at rest + TLS 1.3 in transit', status: 'In Progress' },
                    { id: 'g4-t3', title: 'Deploy breach detection system', status: 'In Progress' },
                    { id: 'g4-t4', title: 'Build 72-hour breach notification workflow', status: 'In Progress' },
                    { id: 'g4-t5', title: 'Implement automated data deletion per retention schedules', status: 'In Progress' },
                ],
                deliverables: ['Privacy by design documentation', 'Encryption verification', 'Breach detection system', '72-hour notification workflow', 'Auto-deletion schedule', 'Gap Analysis Report (Phase 4)'],
                directive: GDPR_DIRECTIVE_4,
            },
            {
                id: 5, title: 'Accountability (Art 24, 35-39)', status: 'Pending',
                description: 'DPIA system, DPO appointment, processor management, compliance audits',
                tasks: [
                    { id: 'g5-t1', title: 'Build DPIA system with screening questionnaire', status: 'In Progress' },
                    { id: 'g5-t2', title: 'Document DPO appointment (or documented reason not to appoint)', status: 'In Progress' },
                    { id: 'g5-t3', title: 'Implement processor management (sub-processor DPAs, audit rights)', status: 'In Progress' },
                    { id: 'g5-t4', title: 'Establish compliance audit schedule', status: 'In Progress' },
                ],
                deliverables: ['DPIA system', 'DPO documentation', 'Processor register', 'Audit schedule', 'Gap Analysis Report (Phase 5)'],
                directive: GDPR_DIRECTIVE_5,
            },
            {
                id: 6, title: 'Documentation & Training', status: 'Pending',
                description: 'Article 30 records, training programme, compliance diagrams, cookie consent, organised /docs/gdpr/',
                tasks: [
                    { id: 'g6-t1', title: 'Finalise Article 30 Records of Processing Activities', status: 'In Progress' },
                    { id: 'g6-t2', title: 'Create staff training programme and records', status: 'In Progress' },
                    { id: 'g6-t3', title: 'Generate GDPR compliance diagrams (data flow, processing map)', status: 'In Progress' },
                    { id: 'g6-t4', title: 'Build cookie consent banner and preference centre', status: 'In Progress' },
                    { id: 'g6-t5', title: 'Organise all artefacts in /docs/gdpr/', status: 'In Progress' },
                    { id: 'g6-t6', title: 'Sync SRS to as-built state (v3.0.0)', status: 'In Progress' },
                    { id: 'g6-t7', title: 'Verify ZERO broken links', status: 'In Progress' },
                ],
                deliverables: ['Article 30 RoPA (final)', 'Training records', 'GDPR compliance diagrams', 'Cookie consent system', 'Organised /docs/gdpr/', 'SRS v3.0.0 (as-built)'],
                directive: GDPR_DIRECTIVE_6,
            },
        ],
    },
];
