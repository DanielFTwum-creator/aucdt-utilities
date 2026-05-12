# Software Requirements Specification (SRS) - HIPAA Compliance

## 1. Introduction
This document outlines the requirements for achieving HIPAA compliance for the Bulletproof Directive framework.

## 2. HIPAA Compliance Section
### 2.1 PHI Data Inventory
- **Patient Identifiers:** Name, DOB, Medical Record Number (MRN), Social Security Number (SSN).
- **Clinical Data:** Diagnosis codes (ICD-10), treatment plans, lab results, medication history.
- **Administrative Data:** Insurance provider, billing information, provider notes.

### 2.2 PHI Storage Map
- **At Rest:** Encrypted using AES-256 in the primary Firestore database.
- **In Transit:** Encrypted using TLS 1.3 for all data transmission between client and server.
- **Backups:** Encrypted backups stored in a separate, restricted-access cloud bucket.

### 2.3 Compliance Structure
- **RBAC:** Role-Based Access Control implemented for all users.
- **Audit Logs:** Comprehensive logging of all access to PHI.
- **BAA:** Business Associate Agreement in place with all cloud service providers.
