export const srsContent = `
### **Software Requirements Specification for OmniExtract**

**Version 1.0**

---

### **Table of Contents**

1.  **Introduction**
    1.1. Purpose
    1.2. Scope
    1.3. Definitions, Acronyms, and Abbreviations
    1.4. References
    1.5. Overview
2.  **Overall Description**
    2.1. Product Perspective
    2.2. Product Functions
    2.3. User Characteristics
    2.4. Constraints
    2.5. Assumptions and Dependencies
3.  **Specific Requirements**
    3.1. External Interface Requirements
        3.1.1. User Interfaces
        3.1.2. Software Interfaces
    3.2. Functional Requirements
        3.2.1. FR-1: Mode Selection
        3.2.2. FR-2: File Upload
        3.2.3. FR-3: Email Extraction
        3.2.4. FR-4: Invoice Data Extraction
        3.2.5. FR-5: Results Display
        3.2.6. FR-6: Data Export
    3.3. Non-Functional Requirements
        3.3.1. NFR-1: Performance
        3.3.2. NFR-2: Usability
        3.3.3. NFR-3: Reliability
        3.3.4. NFR-4: Security

---

### **1. Introduction**

#### **1.1 Purpose**

This Software Requirements Specification (SRS) document defines the functional and non-functional requirements for the web application **OmniExtract**. It is intended for the project's developers, testers, and project managers to ensure a common understanding of the system's features, capabilities, and constraints.

#### **1.2 Scope**

OmniExtract is a web-based utility designed to extract structured data from Portable Document Format (PDF) files. The system provides two primary modes of operation:
1.  **Email Extraction:** Scans PDF documents to identify, collect, and list all unique email addresses.
2.  **Invoice Data Extraction:** Leverages the Google Gemini Artificial Intelligence (AI) model to parse PDF documents (both text-based and image-based/scanned) to extract structured data from invoices and receipts.

The application is designed to be a client-side tool that operates within a user's web browser, providing an intuitive interface for uploading files, processing them, and exporting the extracted data as .txt or .csv files.

#### **1.3 Definitions, Acronyms, and Abbreviations**

*   **AI:** Artificial Intelligence
*   **API:** Application Programming Interface
*   **CSV:** Comma-Separated Values
*   **FR:** Functional Requirement
*   **GUI:** Graphical User Interface
*   **IEEE:** Institute of Electrical and Electronics Engineers
*   **NFR:** Non-Functional Requirement
*   **OCR:** Optical Character Recognition
*   **PDF:** Portable Document Format
*   **SRS:** Software Requirements Specification

#### **1.4 References**

*   **IEEE Std 830-1998:** Recommended Practice for Software Requirements Specifications.
*   **Google Gemini API Documentation:** Official documentation for the 'gemini-2.5-flash' model and its capabilities.
*   **PDF.js Library Documentation:** Documentation for the Mozilla PDF rendering and parsing library.

#### **1.5 Overview**

This document is organized into three main sections. Section 1 provides an introduction to the project and this document. Section 2 gives an overall description of the product, its users, and operational constraints. Section 3 details the specific functional and non-functional requirements the software must satisfy.

### **2. Overall Description**

#### **2.1 Product Perspective**

OmniExtract is a self-contained, client-side web application that depends on external services for its core functionality. It integrates with:
1.  **PDF.js Library:** A third-party JavaScript library for rendering and parsing PDF documents within the browser.
2.  **Google Gemini API:** An external AI service used for the intelligent analysis and data extraction of invoice documents.

The application does not require any local software installation beyond a modern web browser.

#### **2.2 Product Functions**

The primary functions of OmniExtract are:
*   Allow users to select an extraction mode (Emails or Invoice Data).
*   Provide an interface for uploading a single PDF file.
*   Process the uploaded PDF based on the selected mode.
*   Display real-time progress updates during processing.
*   Present extracted data in a clear, readable format.
*   Enable users to copy or download the extracted data.
*   Display user-friendly error messages and notifications.

#### **2.3 User Characteristics**

The intended users of OmniExtract include office administrators, accountants, data entry personnel, researchers, and any individual who needs to quickly extract information from PDF documents without manual effort. Users are expected to have basic computer and web browser literacy but do not require any specialized technical knowledge.

#### **2.4 Constraints**

*   The application must run in a modern web browser that supports HTML5, CSS3, and modern JavaScript (ES6+).
*   An active internet connection is required to load the necessary libraries (PDF.js, Tailwind CSS) from a CDN and to communicate with the Google Gemini API.
*   **A valid Google GenAI API key must be provided in the application's runtime environment ('process.env.API_KEY'). The application will not function without it.**
*   The application's performance for invoice extraction is subject to the latency and rate limits of the Google Gemini API.
*   The application is designed to process one PDF file at a time.

#### **2.5 Assumptions and Dependencies**

*   Users will provide valid, unencrypted, and uncorrupted PDF files.
*   The third-party CDNs for libraries and the Google Gemini API service are available and operational.
*   The provided Google GenAI API key is valid and possesses a sufficient quota to handle user requests.

### **3. Specific Requirements**

#### **3.1 External Interface Requirements**

##### **3.1.1 User Interfaces**

The application shall provide a clean, single-page graphical user interface (GUI) consisting of:
*   **Header:** Displays the application name "OmniExtract" and a brief description.
*   **Mode Selector:** A toggle or button group allowing the user to select between "Extract Emails" and "Extract Invoice Data".
*   **File Upload Area:** A styled drag-and-drop area and a "Choose File" button for uploading PDF files. It will display the selected file's name and size.
*   **Loading/Progress Indicator:** When processing, a loading spinner and a text message shall display the current status (e.g., "Rendering page 5 of 33...").
*   **Results Display:** A dedicated section to show the extracted data. This section will include the total count of items found, a scrollable view of the data, and action buttons.
*   **Message Box:** A modal dialog for displaying success notifications, warnings, or error messages to the user.

##### **3.1.2 Software Interfaces**

*   **PDF.js API:** The system will use the 'pdf.js' library to parse PDF documents. It will utilize functions for loading documents ('getDocument') and processing individual pages ('getPage', 'getTextContent', 'render').
*   **Google Gemini API:** The system will interface with the 'gemini-2.5-flash' model via the '@google/genai' SDK for invoice data extraction. It will make API calls in two distinct ways:
    1.  **Text-based:** By sending the full extracted text from a PDF along with a predefined JSON schema for the AI to populate.
    2.  **Image-based (OCR):** By sending individual, base64-encoded page images along with a prompt and the same JSON schema.

#### **3.2 Functional Requirements**

##### **FR-1: Mode Selection**
*   **FR-1.1:** The user shall be able to select one of two extraction modes: "Extract Emails" or "Extract Invoice Data".
*   **FR-1.2:** The selected mode shall determine the processing logic applied to the uploaded PDF.

##### **FR-2: File Upload**
*   **FR-2.1:** The system shall allow the user to upload a file with a '.pdf' extension.
*   **FR-2.2:** Upon file selection, the system shall display the file's name and size.

##### **FR-3: Email Extraction**
*   **FR-3.1:** When in "Extract Emails" mode, the system shall extract all text content from every page of the PDF.
*   **FR-3.2:** The system shall apply a regular expression to the extracted text to find all email addresses.
*   **FR-3.3:** The system shall filter the list of found emails to ensure uniqueness (case-insensitive) and sort them alphabetically.

##### **FR-4: Invoice Data Extraction**
*   **FR-4.1: Dual-Path Processing:** The system shall first attempt to extract text from the PDF. If the extracted text is empty or minimal, the system shall automatically fall back to an image-based OCR approach.
*   **FR-4.2: OCR Fallback:** In OCR mode, the system shall render each page of the PDF into a JPEG image.
*   **FR-4.3: AI Data Parsing:** The system shall send the prepared data (either text or page images) to the Gemini API with a system prompt and a strict JSON schema requesting the following fields: 'isInvoice', 'vendorName', 'customerName', 'invoiceId', 'issueDate', 'lineItems' (with 'quantity', 'description', 'unitPrice', 'total'), 'subtotal', 'discount', and 'grandTotal'.
*   **FR-4.4: Multi-Page Invoice Handling:** The system shall process each page of a PDF as a potential separate invoice, collecting valid invoice data from all pages.

##### **FR-5: Results Display**
*   **FR-5.1:** If in "Email" mode, the system shall display the total count of unique emails and list them in a scrollable view.
*   **FR-5.2:** If in "Invoice" mode, the system shall display the total number of data rows extracted and show the final CSV-formatted data in a scrollable '<pre>' block.

##### **FR-6: Data Export**
*   **FR-6.1: Copy to Clipboard:** The system shall provide a "Copy All" button that copies the entire extracted dataset (all emails or the full CSV content) to the user's clipboard.
*   **FR-6.2: Download as File:** The system shall provide a download button.
    *   **FR-6.2.1:** In "Email" mode, this button shall be labeled "Download as TXT" and shall download a '_emails.txt' file.
    *   **FR-6.2.2:** In "Invoice" mode, this button shall be labeled "Download as CSV" and shall download a '_invoice_data.csv' file.
*   **FR-6.3: CSV Formatting:** The generated CSV from invoice data shall be structured with two sections: (1) A summary of each invoice found, and (2) A comprehensive list of all line items from all invoices, linked by 'invoiceId'.

#### **3.3 Non-Functional Requirements**

##### **NFR-1: Performance**
*   **NFR-1.1:** Email extraction should be processed quickly, as it is a client-side text operation.
*   **NFR-1.2:** To avoid API rate-limiting errors (HTTP 429), API requests for multi-page image-based PDFs shall be sent sequentially, not in parallel. A small delay (e.g., 1 second) shall be introduced between page requests.
*   **NFR-1.3:** The user shall be kept informed of long-running operations via a progress indicator.

##### **NFR-2: Usability**
*   **NFR-2.1:** The user interface shall be intuitive, responsive, and easy to navigate on both desktop and mobile devices.
*   **NFR-2.2:** The system shall provide clear visual feedback for all user actions, including file selection, loading states, and success/error outcomes.
*   **NFR-2.3:** Error messages shall be clear, and user-friendly, and suggest a course of action where possible.

##### **NFR-3: Reliability**
*   **NFR-3.1:** The application shall gracefully handle errors during PDF parsing (e.g., from a corrupted file) and display an appropriate error message.
*   **NFR-3.2:** The application shall handle errors from the Gemini API (e.g., invalid API key, quota exceeded) and inform the user.
*   **NFR-3.3:** The failure to process a single page in a multi-page document should not prevent the processing of other pages.

##### **NFR-4: Security**
*   **NFR-4.1:** The Google GenAI API key shall be managed as an environment variable and must not be hard-coded or exposed in the client-side source code accessible to the end-user.
`;
