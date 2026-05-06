import { Frameworks } from './types';

export const FRAMEWORKS: Frameworks = {
    standard: {
      name: 'Standard Project Refresh',
      color: 'bg-blue-500',
      phases: [
        {
          id: 'std-1',
          name: 'Phase 1: Foundation Setup',
          directive: `EXECUTE PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 1: Foundation Setup
1. Clean project synchronisation - reset to latest stable version
2. Generate IEEE standard SRS document for current application state
3. Regenerate primary AI agent component

COMPLETION REQUIREMENTS:
- Confirm SRS document created
- Confirm agent component ready
- State "PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Clean project sync', 'Generate IEEE SRS', 'Regenerate AI agent']
        },
        {
          id: 'std-2',
          name: 'Phase 2: Core Implementation',
          directive: `EXECUTE PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 2: Core Implementation
1. Implement secure Admin section with configurable password auth
2. Add comprehensive audit logging for admin actions
3. Implement full accessibility support (screen readers, keyboard nav)
4. Add user-selectable themes: Light, Dark, High-contrast accessibility mode

COMPLETION REQUIREMENTS:
- Confirm admin security implemented
- Confirm accessibility features added
- State "PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Admin security', 'Audit logging', 'Accessibility support', 'Theme system']
        },
        {
          id: 'std-3',
          name: 'Phase 3: Testing Framework',
          directive: `EXECUTE PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 3: Testing Framework
1. Integrate self-testing capabilities into application
2. Develop comprehensive Playwright test suite for critical user journeys
3. Create interactive "Playwright Self-Test" tab in frontend
4. Enable real-time test result display with screenshot capture

COMPLETION REQUIREMENTS:
- Confirm test framework integrated
- Confirm Playwright tests created
- State "PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Self-testing capabilities', 'Playwright suite', 'Interactive test tab', 'Screenshot capture']
        },
        {
          id: 'std-4',
          name: 'Phase 4: Documentation & Diagrams',
          directive: `EXECUTE PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

PROJECT REFRESH - PHASE 4: Documentation & Diagrams
1. Generate System Architecture Diagram (SVG format)
2. Generate Database Architecture Diagram (SVG format) with tables, columns, relationships
3. Create Administrator Guide (comprehensive manual)
4. Create Deployment Guide (step-by-step production deployment)
5. Create Testing Guide (manual and automated test instructions)

COMPLETION REQUIREMENTS:
- Confirm all SVG diagrams generated
- Confirm all three guides created
- State "PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['System architecture SVG', 'Database diagram SVG', 'Admin guide', 'Deployment guide', 'Testing guide']
        },
        {
          id: 'std-5',
          name: 'Phase 5: Final Documentation & Illustration',
          directive: `EXECUTE PHASE 5 ONLY - FINAL PHASE

## 🚀 PROJECT REFRESH - PHASE 5: Final Documentation & Illustration

Your goal is to complete the final documentation for [PROJECT_NAME]. This involves two main parts: 1) Generating all necessary SVG diagrams and 2) Assembling the final documentation.

---

### 1. 🎨 SVG Diagram Generation

Generate all the following diagrams as self-contained, high-quality SVG code.
* **Style:** Use a clean, professional, and consistent style for all diagrams.
* **Format:** Where appropriate, use Mermaid syntax as the source and render it to SVG.
* **Clarity:** Ensure all components are clearly labeled and all text is legible.

**Diagrams to Generate:**

1.  **High-Level System Architecture:**
    * **Description:** A high-level overview showing the main components.
    * **Components:** Include [e.g., "Web Client (React)", "Mobile App", "API Gateway", "Backend Server (Node.js)", "PostgreSQL Database", "Third-Party APIs (Stripe, Twilio)"].

2.  **Technology Stack Diagram:**
    * **Description:** A visual breakdown of the technologies used.
    * **Categories:** Organise by "Frontend," "Backend," "Database," "DevOps," and "External Services."
    * **Technologies:** Include [e.g., "React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Docker", "AWS S3", "Stripe API"].

3.  **Data Flow Diagram (DFD):**
    * **Description:** Show the data flow for a critical user process.
    * **Process:** Map the [e.g., "New User Registration and Authentication"] process.
    * **Entities:** Show data moving between the [e.g., "User", "Web App", "API", "Database", "Email Service"].

4.  **UML Use Case Diagram:**
    * **Description:** Show the main interactions between actors and the system.
    * **Actors:** Include [e.g., "Guest", "Registered User", "Administrator"].
    * **Use Cases:** Include [e.g., "View Item", "Create Account", "Log In", "Make Purchase", "Manage Inventory"].

5.  **UML Sequence Diagram:**
    * **Description:** Detail the sequence of calls for a specific interaction.
    * **Interaction:** Map the [e.g., "User Login"] process.
    * **Lifelines:** Include [e.g., "User", "Browser", "API Gateway", "Auth Service", "Database"].

---

### 2. 📚 Documentation & Assembly

1.  **Update IEEE SRS Document:**
    * Integrate all newly implemented features and final architecture details into the main SRS document.
    * **Embed SVGs:** Embed all 5 diagrams generated in Step 1 into the relevant sections of the SRS document (e.g., embed the System Architecture diagram in the "System Architecture" section).

2.  **Generate Board-Level Presentation Diagrams:**
    * **Simplify:** Create simplified, high-impact versions of the "System Architecture" and "Technology Stack" diagrams. These should be clean, easy to read from a distance, and suitable for a presentation.
    * **Format:** Provide these as separate SVG files.

3.  **Create /docs Directory:**
    * Organise the final documentation into a clean /docs directory structure.
    * **Structure:**
        \`\`\`
        /docs
        ├── /svg (contains all individual SVG diagram files)
        ├── /presentation (contains the 2 simplified presentation SVGs)
        ├── SRS_[PROJECT_NAME]_Final.md (or .pdf)
        └── README.md
        \`\`\`
4.  **Collate Documents:** Place the updated SRS, the individual SVG files, and the presentation diagrams into the organised /docs folder.

---

### 3. ✅ Completion Requirements

Confirm completion by performing the following checks and stating the final line.

* Confirm all 5 core SVG diagrams are generated and embedded in the SRS.
* Confirm the 2 simplified presentation SVGs are generated.
* Confirm the final SRS document is fully updated with all features.
* Confirm the /docs directory is created, organised, and contains all final assets.
* State: "**ALL PHASES COMPLETE - PROJECT REFRESH FINISHED**"`,
          items: ['Generate 5 core SVGs', 'Update & Embed in SRS', 'Board presentation SVGs', 'Organise /docs folder']
        }
      ]
    },
    hipaa: {
      name: 'HIPAA Healthcare Compliance',
      color: 'bg-red-500',
      phases: [
        {
          id: 'hipaa-1',
          name: 'Phase 1: Foundation & Compliance Baseline',
          directive: `EXECUTE HIPAA PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: This application handles Protected Health Information (PHI)
ALL implementations must comply with HIPAA Security Rule requirements

HIPAA PROJECT REFRESH - PHASE 1: Foundation & Compliance Baseline
1. Generate IEEE SRS document with dedicated HIPAA compliance section
2. Document all PHI data elements (what data qualifies as PHI)
3. Document PHI storage locations (databases, files, logs)
4. Reset project to clean HIPAA-compliant baseline
5. Create initial compliance documentation structure

COMPLETION REQUIREMENTS:
- Confirm SRS with HIPAA section created
- Confirm PHI inventory documented
- State "HIPAA PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['IEEE SRS with HIPAA section', 'PHI data inventory', 'PHI storage map', 'Compliance structure']
        },
        {
          id: 'hipaa-2',
          name: 'Phase 2: Administrative Safeguards (§164.308)',
          directive: `EXECUTE HIPAA PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 2: Administrative Safeguards (§164.308)
1. Implement role-based access control (Admin, Provider, Staff roles)
2. Add unique user identification with secure authentication
3. Implement automatic logout after 15 minutes inactivity
4. Add emergency access procedures with break-glass logging
5. Create comprehensive audit logging system:
   - Log all PHI access events
   - Log all PHI modifications
   - Log all PHI deletions
   - Log all authentication attempts
   - Log all authorisation failures
6. Implement password requirements:
   - Minimum 12 characters
   - Complexity requirements (upper, lower, number, special)
   - 90-day expiration policy
   - Password history (prevent reuse of last 5)

COMPLETION REQUIREMENTS:
- Confirm RBAC implemented and tested
- Confirm audit logging active for all PHI operations
- Confirm automatic logout working
- State "HIPAA PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['RBAC system', 'Unique user IDs', 'Auto logout 15min', 'Emergency access', 'Comprehensive audit logs', 'Password policies']
        },
        {
          id: 'hipaa-3',
          name: 'Phase 3: Technical Safeguards (§164.310, §164.312)',
          directive: `EXECUTE HIPAA PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 3: Technical Safeguards (§164.310, §164.312)
1. Implement encryption at rest (AES-256 for all PHI storage)
2. Implement encryption in transit (TLS 1.3 minimum for all connections)
3. Add integrity controls (checksums/hashing for PHI records)
4. Implement multi-factor authentication (MFA) for administrative access
5. Add transmission security (secure API endpoints only, no unencrypted PHI)
6. Create automatic encrypted backup system:
   - Daily encrypted backups of all PHI
   - Secure offsite backup storage
   - Backup restoration testing procedures

COMPLETION REQUIREMENTS:
- Confirm AES-256 encryption active for stored PHI
- Confirm TLS 1.3 enforced for all data transmission
- Confirm MFA working for admin accounts
- Confirm encrypted backups operational
- State "HIPAA PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['AES-256 at rest', 'TLS 1.3 in transit', 'Integrity controls', 'MFA for admins', 'Encrypted backups']
        },
        {
          id: 'hipaa-4',
          name: 'Phase 4: Privacy & Access Controls',
          directive: `EXECUTE HIPAA PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 4: Privacy & Access Controls
1. Implement minimum necessary access principle (role-based PHI visibility)
2. Add patient consent tracking and management system
3. Create authorisation/disclosure logging (track who accessed what PHI, when, why)
4. Implement patient right of access features:
   - Patient portal to view their own PHI
   - Download PHI in portable format
   - Request corrections to PHI
5. Add accounting of disclosures functionality
6. Create breach notification workflow system with automated alerts

COMPLETION REQUIREMENTS:
- Confirm minimum necessary access enforced
- Confirm patient portal working with access controls
- Confirm disclosure tracking active
- Confirm breach workflow operational
- State "HIPAA PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Minimum necessary access', 'Consent tracking', 'Patient portal', 'Accounting of disclosures', 'Breach notification']
        },
        {
          id: 'hipaa-5',
          name: 'Phase 5: Testing & Technical Documentation',
          directive: `EXECUTE HIPAA PHASE 5 ONLY - DO NOT PROCEED TO OTHER PHASES

HIPAA PROJECT REFRESH - PHASE 5: Testing & Technical Documentation
1. Create HIPAA-specific Puppeteer test suite covering:
   - Authentication/authorisation tests
   - Encryption verification tests (at rest and in transit)
   - Audit log integrity tests
   - Role-based access control tests
   - Session timeout tests
   - MFA functionality tests
2. Generate Risk Assessment Document (HIPAA Security Rule requirement)
3. Create HIPAA Security Architecture Diagram (SVG format)
4. Create PHI Data Flow Diagram (SVG format) showing data lifecycle
5. Generate HIPAA Compliance Checklist (164.308, 164.310, 164.312)
6. Create Incident Response Plan document
7. Create Business Associate Agreement (BAA) template

COMPLETION REQUIREMENTS:
- Confirm all Puppeteer tests passing
- Confirm risk assessment complete
- Confirm all diagrams generated
- Confirm compliance checklist complete
- State "HIPAA PHASE 5 COMPLETE - READY FOR PHASE 6"

DO NOT PROCEED TO PHASE 6 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['HIPAA test suite', 'Risk assessment', 'Security architecture SVG', 'PHI data flow SVG', 'Compliance checklist', 'Incident response plan', 'BAA template']
        },
        {
          id: 'hipaa-6',
          name: 'Phase 6: Administrative Documentation',
          directive: `EXECUTE HIPAA PHASE 6 ONLY - FINAL PHASE

HIPAA PROJECT REFRESH - PHASE 6: Administrative Documentation & Finalization
1. Create comprehensive HIPAA Administrator Guide including:
   - User access control management procedures
   - Audit log review procedures (monthly review requirements)
   - Breach response procedures (step-by-step)
   - Backup and disaster recovery procedures
   - System maintenance procedures
2. Create HIPAA Training Guide for staff members
3. Create Patient Rights Guide (notice of privacy practices)
4. Update deployment guide with HIPAA security requirements
5. Update final IEEE SRS with all implemented HIPAA features
6. Embed all SVG diagrams in SRS document
7. Organise all documents in /docs/hipaa/ directory structure:
   - /docs/hipaa/compliance/
   - /docs/hipaa/policies/
   - /docs/hipaa/training/
   - /docs/hipaa/technical/

FINAL COMPLIANCE VERIFICATION:
✓ Confirm encryption implemented for all PHI (at rest and in transit)
✓ Confirm comprehensive audit logging active and tested
✓ Confirm MFA implemented for administrative access
✓ Confirm automatic session timeout working (15 minutes)
✓ Confirm role-based access control enforced
✓ Confirm all HIPAA documentation complete and organised
✓ Confirm all test suites passing
✓ Confirm patient access portal functional

STATE "HIPAA COMPLIANCE REFRESH COMPLETE - ALL 6 PHASES FINISHED" when complete

This is the final phase - complete all tasks and perform final verification.`,
          items: ['Administrator guide', 'Training guide', 'Patient rights guide', 'Updated SRS', 'Organised /docs/hipaa/', 'Final verification']
        }
      ]
    },
    pci: {
      name: 'PCI-DSS Payment Security',
      color: 'bg-green-500',
      phases: [
        {
          id: 'pci-1',
          name: 'Phase 1: Foundation & Scope',
          directive: `EXECUTE PCI-DSS PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: This application handles Cardholder Data (CHD).
ALL implementations must comply with PCI-DSS requirements.

PCI-DSS PROJECT REFRESH - PHASE 1: Foundation & Scope
1. Generate IEEE SRS document with dedicated PCI-DSS compliance section.
2. Define Cardholder Data Environment (CDE) boundaries:
   - Identify all systems, networks, and people that store, process, or transmit cardholder data.
   - Document the scope of the CDE and ensure it is isolated from non-CDE systems.
3. Perform Data Flow Mapping:
   - Map all flows of cardholder data into, out of, and within the CDE.
   - Document all locations where cardholder data is stored.
4. Establish Data Retention Policies:
   - Define formal retention and disposal policies for cardholder data.
   - Ensure data is only retained as long as necessary for business, legal, or regulatory requirements.
   - Implement secure deletion procedures for data that has exceeded the retention period.

COMPLETION REQUIREMENTS:
- Confirm SRS with PCI-DSS section created.
- Confirm CDE boundaries are defined and documented.
- Confirm data flow mapping is complete.
- Confirm retention and disposal policies are established.
- State "PCI-DSS PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['SRS with PCI-DSS section', 'CDE boundaries', 'Data flow diagram', 'Retention policies']
        },
        {
          id: 'pci-2',
          name: 'Phase 2: Network Security (Req 1-2)',
          directive: `EXECUTE PCI-DSS PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: Network security is the first line of defense for the CDE.

PCI-DSS PROJECT REFRESH - PHASE 2: Network Security (Req 1-2)
1. Implement Network Segmentation:
   - Isolate the CDE from all other networks using firewalls or VLANs.
   - Restrict traffic to only what is necessary for business purposes.
2. Configure Firewall Rules:
   - Implement firewall and router configurations that restrict traffic to only authorized protocols and ports.
   - Deny all traffic by default.
3. Remove Default Settings:
   - Change all vendor-supplied default passwords and security parameters.
   - Remove unnecessary services, protocols, and software.
4. System Inventory:
   - Maintain an accurate inventory of all system components in the CDE.

COMPLETION REQUIREMENTS:
- Confirm network segmentation is implemented and tested.
- Confirm firewall rules are configured and deny-by-default.
- Confirm all default passwords and settings are changed.
- Confirm system inventory is up-to-date.
- State "PCI-DSS PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Network segmentation', 'Firewall rules', 'Remove defaults', 'System inventory']
        },
        {
          id: 'pci-3',
          name: 'Phase 3: Data Protection (Req 3-4)',
          directive: `EXECUTE PCI-DSS PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: Data protection is the core of PCI-DSS compliance.

PCI-DSS PROJECT REFRESH - PHASE 3: Data Protection (Req 3-4)
1. Implement Encryption at Rest:
   - Use strong cryptography (AES-256 or equivalent) to protect stored cardholder data.
   - Implement secure key management procedures (rotation, access control).
2. Mask Primary Account Numbers (PAN):
   - Ensure PAN is masked when displayed (only first 6 and last 4 digits visible).
3. Implement Encryption in Transit:
   - Use strong cryptography (TLS 1.2 or higher) for all transmission of cardholder data over public networks.
4. Prohibit Storage of Sensitive Authentication Data:
   - Ensure sensitive authentication data (e.g., CVV, full track data) is not stored after authorization.

COMPLETION REQUIREMENTS:
- Confirm AES-256 encryption is active for stored cardholder data.
- Confirm PAN masking is implemented.
- Confirm TLS 1.2+ is enforced for all transmissions.
- Confirm sensitive authentication data is not stored.
- State "PCI-DSS PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['AES-256 at rest', 'PAN masking', 'TLS 1.2+', 'No sensitive auth data storage', 'Key management']
        },
        {
          id: 'pci-4',
          name: 'Phase 4: Vulnerability Management (Req 5-6)',
          directive: `EXECUTE PCI-DSS PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: Vulnerability management is essential to prevent unauthorized access.

PCI-DSS PROJECT REFRESH - PHASE 4: Vulnerability Management (Req 5-6)
1. Implement Anti-Malware:
   - Deploy anti-malware software on all systems commonly affected by malware.
   - Ensure software is kept up to date and performs regular scans.
2. Secure SDLC:
   - Implement processes to identify and address security vulnerabilities in software development.
   - Conduct code reviews for all custom code.
3. Vulnerability Scanning:
   - Perform internal and external vulnerability scans at least quarterly.
   - Remediate all high-risk vulnerabilities.
4. WAF/Code Review:
   - Implement a Web Application Firewall (WAF) to protect web-facing applications.

COMPLETION REQUIREMENTS:
- Confirm anti-malware is deployed and active.
- Confirm secure SDLC processes are documented and followed.
- Confirm vulnerability scans are performed and high-risk issues remediated.
- Confirm WAF is operational.
- State "PCI-DSS PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Anti-malware', 'Secure SDLC', 'Vulnerability scanning', 'WAF/code review']
        },
        {
          id: 'pci-5',
          name: 'Phase 5: Access Controls (Req 7-8)',
          directive: `EXECUTE PCI-DSS PHASE 5 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: Strict access control is required to limit exposure of CHD.

PCI-DSS PROJECT REFRESH - PHASE 5: Access Controls (Req 7-8)
1. Implement RBAC (Need-to-Know):
   - Restrict access to cardholder data to only those individuals whose job requires such access.
2. Unique User IDs:
   - Assign a unique ID to each person with computer access.
3. MFA for CDE:
   - Implement Multi-Factor Authentication (MFA) for all access to the CDE.
4. Password Policies:
   - Enforce strong password requirements (length, complexity, rotation).
5. Session Management:
   - Implement automatic session timeouts after 15 minutes of inactivity.

COMPLETION REQUIREMENTS:
- Confirm RBAC is implemented based on need-to-know.
- Confirm unique user IDs are assigned.
- Confirm MFA is enforced for all CDE access.
- Confirm password policies and session timeouts are active.
- State "PCI-DSS PHASE 5 COMPLETE - READY FOR PHASE 6"

DO NOT PROCEED TO PHASE 6 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['RBAC need-to-know', 'Unique user IDs', 'MFA for CDE', 'Password policies', 'Session timeout']
        },
        {
          id: 'pci-6',
          name: 'Phase 6: Monitoring & Testing (Req 10-11)',
          directive: `EXECUTE PCI-DSS PHASE 6 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: Continuous monitoring is required to detect security incidents.

PCI-DSS PROJECT REFRESH - PHASE 6: Monitoring & Testing (Req 10-11)
1. Audit Logging:
   - Implement comprehensive audit logging for all access to system components.
2. Daily Log Review:
   - Review logs for all system components at least daily.
3. Time Synchronization:
   - Synchronize all system clocks using a reliable time source (e.g., NTP).
4. File Integrity Monitoring (FIM):
   - Implement FIM to alert on unauthorized modification of critical files.
5. Penetration Testing:
   - Perform internal and external penetration tests at least annually.

COMPLETION REQUIREMENTS:
- Confirm comprehensive audit logging is active.
- Confirm daily log review process is established.
- Confirm time synchronization is active.
- Confirm FIM is operational and penetration testing is scheduled.
- State "PCI-DSS PHASE 6 COMPLETE - READY FOR PHASE 7"

DO NOT PROCEED TO PHASE 7 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Comprehensive audit logs', 'Daily log review', 'Time sync', 'File integrity monitoring', 'Pen testing']
        },
        {
          id: 'pci-7',
          name: 'Phase 7: Security Policy (Req 12)',
          directive: `EXECUTE PCI-DSS PHASE 7 ONLY - FINAL PHASE

CRITICAL: Security policies provide the framework for all other controls.

PCI-DSS PROJECT REFRESH - PHASE 7: Security Policy (Req 12)
1. Security Policy:
   - Establish, publish, and maintain a comprehensive information security policy.
2. Compliance Manual:
   - Create a compliance manual documenting all PCI-DSS controls.
3. Training Programme:
   - Implement a security awareness training programme for all employees.
4. Architecture Diagrams:
   - Maintain up-to-date network and data flow diagrams.
5. Self-Assessment Questionnaire (SAQ):
   - Complete the appropriate SAQ to attest to compliance.

COMPLETION REQUIREMENTS:
- Confirm security policy is published and maintained.
- Confirm compliance manual is complete.
- Confirm security awareness training is conducted.
- Confirm all diagrams are up-to-date and SAQ is completed.
- State "PCI-DSS COMPLIANCE REFRESH COMPLETE - ALL 7 PHASES FINISHED"`,
          items: ['Security policy', 'Compliance manual', 'Training programme', 'Architecture diagrams', 'SAQ']
        }
      ]
    },
    soc2: {
      name: 'SOC 2 Trust Services',
      color: 'bg-purple-500',
      phases: [
        {
          id: 'soc2-1',
          name: 'Phase 1: Foundation & Scope',
          directive: `EXECUTE SOC 2 PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 1: Foundation & Scope
1. Define Scope:
   - Identify the specific Trust Services Criteria (TSC) to be covered (Security, Availability, Processing Integrity, Confidentiality, Privacy).
   - Define the system boundary and system description.
2. Foundation:
   - Generate IEEE SRS document with dedicated SOC 2 compliance section.
   - Assign internal compliance team and responsibilities.

COMPLETION REQUIREMENTS:
- Confirm TSC criteria defined.
- Confirm system boundary and description documented.
- Confirm SRS with SOC 2 section created.
- State "SOC 2 PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['SRS with SOC 2 section', 'Define scope (Type I/II)', 'Identify TSC criteria', 'System description']
        },
        {
          id: 'soc2-2',
          name: 'Phase 2: Organisation & Management (CC1)',
          directive: `EXECUTE SOC 2 PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 2: Organisation & Management (CC1)
1. Governance:
   - Establish organisational structure and reporting lines.
   - Define board oversight responsibilities.
2. Policies:
   - Develop and publish comprehensive security policies.
   - Ensure policies are reviewed and approved by management.
3. Risk Management:
   - Implement third-party risk management procedures.

COMPLETION REQUIREMENTS:
- Confirm organisational structure documented.
- Confirm security policies published and approved.
- Confirm third-party risk management procedures implemented.
- State "SOC 2 PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Org structure', 'Security policy framework', 'Board oversight', 'Third-party risk mgmt']
        },
        {
          id: 'soc2-3',
          name: 'Phase 3: Communication & Monitoring (CC2-CC3)',
          directive: `EXECUTE SOC 2 PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 3: Communication & Monitoring (CC2-CC3)
1. Training:
   - Implement security awareness training for all employees.
2. Monitoring:
   - Implement SIEM for continuous monitoring of system activity.
3. Incident Management:
   - Define incident escalation and response procedures.

COMPLETION REQUIREMENTS:
- Confirm security training conducted.
- Confirm SIEM implemented and operational.
- Confirm incident response and escalation procedures defined.
- State "SOC 2 PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Security training', 'Communication mechanisms', 'SIEM monitoring', 'Incident escalation']
        },
        {
          id: 'soc2-4',
          name: 'Phase 4: Risk Assessment (CC4-CC5)',
          directive: `EXECUTE SOC 2 PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 4: Risk Assessment (CC4-CC5)
1. Risk Assessment:
   - Perform formal risk assessment process.
   - Maintain a risk register.
2. Business Continuity:
   - Develop Business Continuity (BC) and Disaster Recovery (DR) plans.
   - Test BC/DR plans.

COMPLETION REQUIREMENTS:
- Confirm risk assessment performed and risk register maintained.
- Confirm BC/DR plans developed and tested.
- State "SOC 2 PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Risk assessment process', 'Risk register', 'BC/DR plan', 'Incident response plan']
        },
        {
          id: 'soc2-5',
          name: 'Phase 5: Access Controls (CC6)',
          directive: `EXECUTE SOC 2 PHASE 5 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 5: Access Controls (CC6)
1. IAM:
   - Implement robust Identity and Access Management (IAM) system.
   - Enforce MFA for all users.
2. Access Reviews:
   - Conduct periodic access reviews.
3. Privileged Access:
   - Implement Privileged Access Management (PAM).

COMPLETION REQUIREMENTS:
- Confirm IAM system implemented.
- Confirm MFA enforced.
- Confirm access reviews conducted.
- Confirm PAM implemented.
- State "SOC 2 PHASE 5 COMPLETE - READY FOR PHASE 6"

DO NOT PROCEED TO PHASE 6 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['IAM system', 'MFA for all', 'Access reviews', 'Privileged access mgmt', 'Audit logging']
        },
        {
          id: 'soc2-6',
          name: 'Phase 6: Operations & Change (CC7-CC8)',
          directive: `EXECUTE SOC 2 PHASE 6 ONLY - DO NOT PROCEED TO OTHER PHASES

SOC 2 PROJECT REFRESH - PHASE 6: Operations & Change (CC7-CC8)
1. Operations:
   - Document and follow operational procedures.
2. Change Management:
   - Implement formal change management process.
3. Environment:
   - Ensure separation of development, staging, and production environments.
4. Encryption:
   - Implement encryption controls for data at rest and in transit.

COMPLETION REQUIREMENTS:
- Confirm operational procedures documented.
- Confirm change management process implemented.
- Confirm environment separation.
- Confirm encryption controls implemented.
- State "SOC 2 PHASE 6 COMPLETE - READY FOR PHASE 7"

DO NOT PROCEED TO PHASE 7 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Operations procedures', 'Change management', 'Environment separation', 'Encryption controls']
        },
        {
          id: 'soc2-7',
          name: 'Phase 7: Testing & Evidence',
          directive: `EXECUTE SOC 2 PHASE 7 ONLY - FINAL PHASE

SOC 2 PROJECT REFRESH - PHASE 7: Testing & Evidence
1. Testing:
   - Conduct control testing to verify effectiveness.
2. Evidence:
   - Collect evidence for all controls.
3. Finalisation:
   - Prepare SOC 2 description and audit readiness report.

COMPLETION REQUIREMENTS:
- Confirm control testing performed.
- Confirm evidence collected.
- Confirm SOC 2 description and audit readiness report prepared.
- State "SOC 2 COMPLIANCE REFRESH COMPLETE - ALL 7 PHASES FINISHED"`,
          items: ['Control testing', 'Evidence collection', 'SOC 2 description', 'Architecture diagrams', 'Audit readiness']
        }
      ]
    },
    gdpr: {
      name: 'GDPR Data Protection',
      color: 'bg-indigo-500',
      phases: [
        {
          id: 'gdpr-1',
          name: 'Phase 1: Foundation & Data Mapping',
          directive: `EXECUTE GDPR PHASE 1 ONLY - DO NOT PROCEED TO OTHER PHASES

CRITICAL: This application handles Personally Identifiable Information (PII).
ALL implementations must comply with GDPR requirements.

GDPR PROJECT REFRESH - PHASE 1: Foundation & Data Mapping
1. Generate IEEE SRS document with dedicated GDPR compliance section
2. Document all PII data elements (what data qualifies as PII)
3. Document PII storage locations (databases, files, logs)
4. Create comprehensive data inventory (Article 30)
5. Map data flows (where data comes from, where it goes, who has access)
6. Document legal basis for processing for each data type
7. Create initial compliance documentation structure

COMPLETION REQUIREMENTS:
- Confirm SRS with GDPR section created
- Confirm PII inventory documented
- Confirm PII storage locations mapped
- Confirm data flows mapped
- Confirm legal basis documented
- State "GDPR PHASE 1 COMPLETE - READY FOR PHASE 2"

DO NOT PROCEED TO PHASE 2 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['SRS with GDPR section', 'PII data inventory', 'PII storage map', 'Data inventory (Art 30)', 'Data flow mapping', 'Legal basis documentation', 'Compliance structure']
        },
        {
          id: 'gdpr-2',
          name: 'Phase 2: Lawful Basis (Art 5-7, 12-14)',
          directive: `EXECUTE GDPR PHASE 2 ONLY - DO NOT PROCEED TO OTHER PHASES

GDPR PROJECT REFRESH - PHASE 2: Lawful Basis (Art 5-7, 12-14)
1. Consent:
   - Implement granular consent management system.
2. Notices:
   - Publish clear privacy notices.
3. Documentation:
   - Create Data Processing Agreement (DPA) templates for processors.
   - Document Legitimate Interest Assessments (LIA) where applicable.

COMPLETION REQUIREMENTS:
- Confirm consent management implemented.
- Confirm privacy notices published.
- Confirm DPA templates created.
- Confirm LIA assessments documented.
- State "GDPR PHASE 2 COMPLETE - READY FOR PHASE 3"

DO NOT PROCEED TO PHASE 3 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Consent management', 'Privacy notices', 'LIA assessments', 'DPA templates', 'Age verification']
        },
        {
          id: 'gdpr-3',
          name: 'Phase 3: Data Subject Rights (Art 15-22)',
          directive: `EXECUTE GDPR PHASE 3 ONLY - DO NOT PROCEED TO OTHER PHASES

GDPR PROJECT REFRESH - PHASE 3: Data Subject Rights (Art 15-22)
1. DSAR:
   - Implement Data Subject Access Request (DSAR) portal.
2. Rights:
   - Implement procedures for right to rectification, erasure, portability, and objection.

COMPLETION REQUIREMENTS:
- Confirm DSAR portal functional.
- Confirm procedures for all data subject rights implemented.
- State "GDPR PHASE 3 COMPLETE - READY FOR PHASE 4"

DO NOT PROCEED TO PHASE 4 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['DSAR portal', 'Right to rectification', 'Right to erasure', 'Data portability', 'Right to object']
        },
        {
          id: 'gdpr-4',
          name: 'Phase 4: Security (Art 25, 32)',
          directive: `EXECUTE GDPR PHASE 4 ONLY - DO NOT PROCEED TO OTHER PHASES

GDPR PROJECT REFRESH - PHASE 4: Security (Art 25, 32)
1. Privacy by Design:
   - Implement privacy by design and default.
2. Security:
   - Enforce strong encryption (AES-256 + TLS 1.3).
3. Breach Management:
   - Implement breach detection and 72-hour notification procedures.

COMPLETION REQUIREMENTS:
- Confirm privacy by design implemented.
- Confirm encryption enforced.
- Confirm breach detection and notification procedures operational.
- State "GDPR PHASE 4 COMPLETE - READY FOR PHASE 5"

DO NOT PROCEED TO PHASE 5 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['Privacy by design', 'AES-256 + TLS 1.3', 'Breach detection', '72-hour notification', 'Auto-deletion']
        },
        {
          id: 'gdpr-5',
          name: 'Phase 5: Accountability (Art 24, 35-39)',
          directive: `EXECUTE GDPR PHASE 5 ONLY - DO NOT PROCEED TO OTHER PHASES

GDPR PROJECT REFRESH - PHASE 5: Accountability (Art 24, 35-39)
1. DPIA:
   - Implement Data Protection Impact Assessment (DPIA) system.
2. DPO:
   - Appoint Data Protection Officer (DPO) if required.
3. Processors:
   - Manage data processors and ensure compliance.

COMPLETION REQUIREMENTS:
- Confirm DPIA system implemented.
- Confirm DPO appointed (if applicable).
- Confirm processor management procedures in place.
- State "GDPR PHASE 5 COMPLETE - READY FOR PHASE 6"

DO NOT PROCEED TO PHASE 6 - WAIT FOR EXPLICIT INSTRUCTION`,
          items: ['DPIA system', 'DPO appointment', 'Processor management', 'Compliance audits']
        },
        {
          id: 'gdpr-6',
          name: 'Phase 6: Documentation & Training',
          directive: `EXECUTE GDPR PHASE 6 ONLY - FINAL PHASE

GDPR PROJECT REFRESH - PHASE 6: Documentation & Training
1. Records:
   - Maintain Article 30 records of processing activities.
2. Training:
   - Conduct GDPR training programme.
3. Finalisation:
   - Organise compliance documentation in /docs/gdpr/.

COMPLETION REQUIREMENTS:
- Confirm Article 30 records maintained.
- Confirm training conducted.
- Confirm compliance documentation organised.
- State "GDPR COMPLIANCE REFRESH COMPLETE - ALL 6 PHASES FINISHED"`,
          items: ['Article 30 records', 'Training programme', 'Compliance diagrams', 'Cookie consent', 'Organised /docs/gdpr/']
        }
      ]
    }
  };