# Software Requirements Specification (SRS) - PCI-DSS Compliance

## 1. Introduction
This document outlines the requirements for achieving PCI-DSS compliance for the Bulletproof Directive framework.

## 2. PCI-DSS Compliance Section
### 2.1 CDE Boundaries
- **Cardholder Data Environment (CDE):** Includes all systems that store, process, or transmit cardholder data.
- **Scope:** Primary database, payment processing API, and web server.

### 2.2 Data Flow Diagram
- **Flow:** User -> Web Server -> Payment Gateway -> Card Network.
- **Encryption:** TLS 1.2+ used for all segments.

### 2.3 Retention Policies
- **Cardholder Data:** Retained only for the duration of the transaction.
- **Logs:** Retained for 1 year, with 3 months immediately available.
