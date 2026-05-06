
# System Addendum for Techbridge TSAP
## CLAUDE - Conversational Language Audit & User Diagnostic Engine

**Version:** 1.0 (Conceptual) 
**Date:** November 15, 2025  

---

## 1. Introduction

### 1.1. Purpose

This document outlines the conceptual framework and requirements for the **Conversational Language Audit & User Diagnostic Engine (CLAUDE)**, a proposed AI-powered enhancement for the TSAP system. CLAUDE is envisioned as an intelligent assistant designed to streamline administrative tasks, provide regulatory insights, and enhance the overall user experience through a natural language interface.

### 1.2. Scope

The CLAUDE system add-on is intended to:
-   Provide natural language querying for salary calculations.
-   Offer intelligent summarization and analysis of the audit log.
-   Explain complex tax and SSNIT regulations in simple terms.
-   Assist administrators in diagnosing system issues and running self-tests.

This feature is designed as a non-critical enhancement; the core functionality of TSAP will remain fully operational without it.

---

## 2. Core Features & Functionality

### 2.1. Natural Language Salary Queries

Instead of manually filling out the form, an administrator could use natural language prompts to perform calculations.

**Example Prompts:**
-   `"Calculate the net monthly pay for a new Lecturer at grade SM0105/4."`
-   `"What would the take-home pay be for an annual salary of ₵45,000 with a ₵2,000 monthly allowance and a student loan?"`
-   `"Show me the annual breakdown for the Registrar, but override the SSNIT exemption."`

The system would parse the request, populate the calculator fields, and present the final breakdown for user verification.

### 2.2. Intelligent Audit Log Analysis

CLAUDE will provide a powerful interface for querying the security audit log.

**Example Prompts:**
-   `"Summarize all salary calculations performed last week."`
-   `"Show me all calculations where the allowance was manually overridden."`
-   `"Were there any failed login attempts yesterday?"`
-   `"List all administrative changes made to the Grade/Step list in the last month."`

The engine would generate concise, human-readable summaries and highlight anomalies or important trends.

### 2.3. Regulatory and Compliance Explanations

The assistant will act as an embedded knowledge base for Ghanaian tax and social security laws.

**Example Prompts:**
-   `"Explain how PAYE is calculated for an income of ₵80,000 per year."`
-   `"Why is the SSNIT contribution capped?"`
-   `"What is the current student loan deduction rate?"`

### 2.4. System Diagnostics Assistant

CLAUDE can simplify system maintenance and testing.

**Example Prompts:**
-   `"Run the self-test suite for all Senior Management grades."`
-   `"Check for any calculation discrepancies in the system."`
-   `"What's the current application version and localStorage usage?"`

---

## 3. Proposed Integration

### 3.1. User Interface

-   A collapsible chat-style widget would be accessible from all pages.
-   Context-aware help icons (`?`) next to complex fields (like PAYE or SSNIT) would open CLAUDE with a pre-filled prompt for an explanation.
-   A dedicated "CLAUDE Audit" tab within the Admin Panel would provide an advanced natural language interface for log analysis.

### 3.2. Data Flow

1.  User enters a prompt into the CLAUDE interface.
2.  The prompt is securely sent to a dedicated processing module (conceptual).
3.  The module interprets the intent and queries the relevant application data (e.g., `StepCodesContext`, `auditLogService`).
4.  A response is formulated and displayed to the user. For calculations, the main UI form is updated.

---

## 4. Technical & Security Considerations

### 4.1. Technology Stack (Conceptual)

-   **Frontend Integration**: The CLAUDE interface would be built as a standard React component.
-   **Language Processing**: Would leverage a pre-trained Large Language Model (LLM) fine-tuned on Ghanaian tax law and the application's data structures.
-   **Data Privacy**: No Personally Identifiable Information (PII) or sensitive salary data would be transmitted to external servers. All processing would ideally happen client-side or within a secure, isolated environment compliant with Techbridge data policies.

### 4.2. Security

-   **Data Sanitization**: All user prompts would be strictly sanitized to prevent injection attacks.
-   **Scoped Access**: The engine's access to application data would be read-only, except for populating the calculator form fields. It would not have permissions to directly modify persistent data like audit logs or passwords.
