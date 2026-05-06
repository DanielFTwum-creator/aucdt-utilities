
# System Requirements Specification
## Project: TECHBRIDGE Scholarship Portal
**Version**: 2.0 - Final Institutional Edition
**Date**: 2026-03-05

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the "as-built" system requirements for the TECHBRIDGE Scholarship Portal. This web-based application is built with **React 19.2.4** to digitize the scholarship agreement process for PhD scholars, replacing manual paperwork with a validated, secure, and efficient digital workflow.

### 1.2 Scope
The TECHBRIDGE Scholarship Portal allows scholars to:
- Input personal and academic details with enforced input masking.
- Provide guarantor and witness information for legal attestation.
- Review a high-fidelity "Official Bond Record" with dual theme support.
- Digitally sign the "Deed of Bond" using either typography or a canvas pad.
- Submit the application with automated PDF/PNG attachments to institutional receptors.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: System Requirements Specification
- **SPA**: Single Page Application
- **JSON**: JavaScript Object Notation
- **Scholar**: The primary user applying for the PhD scholarship.
- **Guarantor**: A legal entity guaranteeing the scholar's bond.
- **oklch/oklab**: Modern CSS colour spaces (isolated in this build for rendering compatibility).

---

## 2. Overall Description

### 2.1 Product Perspective
This is a premium standalone web application (Client-Side SPA) communicating with the `/aucdt-dev/sendMail` API. It is optimized for both desktop execution and mobile PWA standalone usage.

### 2.2 Product Functions
- **Multi-step Wizard**: Standardised 4-step data entry (Scholar -> Programme -> Guarantor -> Review).
- **Data Validation & Masking**: Real-time format checking and `react-imask` enforcement.
- **Dual Signature Pad**: Support for typed previews and handwritten canvas rasterisation.
- **Digital Record Generation**: Dynamic generation of a legally-comprehensive "Execution Bond" certificate.
- **AI Compliance Audit**: qualitative review and scoring via Google Gemini.

### 2.3 User Characteristics
- **Primary User**: PhD Candidates (Staff/Faculty).
- **Secondary User**: Admissions Officers and Registrar (Email recipients).

---

### 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Scholar & Guarantor Management
- **FR-01**: Capture Title, Full Name, ID/Passport, Parent Name, Address, Email, and Phone.
- **FR-02**: **Input Masking**: Enforce `aaa-000000000-0` for IDs and `+000 00 000 0000` for Phone numbers.
- **FR-03**: Support separate data collection for a Legal Guarantor and two Attestation Witnesses.

#### 3.1.2 Programme & Bond Details
- **FR-04**: Capture Department, PhD Subject, and specific Funding Source.
- **FR-05**: Require numeric entry for service bond years (Mandatory 10-year service clause default).


#### 3.1.3 Review & Execution
- **FR-06**: Render an "Official Bond Record" containing all captured data points.
- **FR-07**: Provide dual-mode signature (Typographic vs. Handwriting Canvas).
- **FR-08**: **Theme Selection**: Allow users to toggle between **Classic Dark** and **Print-Friendly Light** modes for the digital record.
- **FR-09**: **QR Code**: Generate a TUC Gold QR code for digital verification.

#### 3.1.4 Data Submission
- **FR-10**: Construct a JSON payload using the `receiverEmailId`/`senderEmailId` schema.
- **FR-11**: **Dual PNG Attachments**: Automatically encode and attach the Certificate and the Signature as PNG buffers.
- **FR-12**: Dispatch confirmation emails to both institutional receptors and the Scholar.

### 3.2 Accessibility & Diagnostics
- **FR-13**: **Tooltips**: 100% contextual tooltip coverage for all UI actions (FR-13 compliance).
- **FR-14**: Support High Contrast mode with sRGB fallback for 100% accessibility compliance.
- **FR-15**: Secure Admin Dashboard containing real-time audit logs and Critical Path simulations.

---

## 4. Appendices
- **A. Data Dictionary**: See `src/types.ts` for schema definitions.
- **B. Tech Stack**: React 19.2.4, TypeScript, Tailwind CSS v4, jsPDF, html2canvas.
