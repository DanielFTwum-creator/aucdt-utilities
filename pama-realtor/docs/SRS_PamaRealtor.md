# Software Requirements Specification (SRS)
## for Pama Realtor

**Version:** 1.0.2
**Date:** October 26, 2023
**Status:** Phase 5 Complete

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to present a detailed description of the Pama Realtor web application. It will explain the purpose and features of the system, the interfaces of the system, what the system will do, and the constraints under which it must operate. This document is intended for both the stakeholders and the developers of the system.

### 1.2 Scope
Pama Realtor is a modern, responsive client-side web application designed to facilitate the browsing, renting, and purchasing of real estate properties. The application allows users to:
- Browse a curated catalog of properties (Rent/Sale).
- Filter properties dynamically by search keywords and town location.
- Select properties for "Purchase/Rent" or schedule "Drive-to-View" visits.
- Manage a shopping cart with real-time subtotal, service charge (5%), and total calculations.
- Complete a secure checkout process collecting User Details (Name, Email, Phone) and Location (Region, Town, Area, Address Type).
- Interact with an integrated AI Assistant for natural language property inquiries.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **UI:** User Interface
- **AI:** Artificial Intelligence (powered by Google Gemini)
- **SPA:** Single Page Application
- **VAT:** Value Added Tax (currently set to 0.00)

---

## 2. Overall Description

### 2.1 Product Perspective
Pama Realtor is a standalone web application. It utilizes a React 18 frontend architecture, styled with Tailwind CSS, and integrates the Google GenAI SDK for AI functionalities. It is designed to be lightweight, fast, and deployable on any static web hosting service.

### 2.2 Product Functions
- **Property Catalog Display:** Visual grid of available properties with price, location, and type indicators.
- **Advanced Filtering:** Text-based search and dropdown filtering for Towns.
- **Cart & Checkout:** Persistent cart state (within session) allowing users to accumulate services before a consolidated checkout.
- **AI Concierge:** A floating chat agent capable of answering questions about listed properties using the `gemini-2.5-flash` model.

### 2.3 User Classes and Characteristics
- **Guest User:** Browses properties and interacts with the AI agent.
- **Customer:** Adds items to the cart and performs checkout.

### 2.4 Operating Environment
- **Browser:** Modern versions of Chrome, Firefox, Safari, and Edge.
- **Device:** Responsive design supports Mobile, Tablet, and Desktop viewports.

---

## 3. System Features

### 3.1 Property Management & Display
- **Description:** The system renders a list of properties from a structured data source (`MOCK_PROPERTIES`).
- **Inputs:** User search string, Town selection.
- **Outputs:** Filtered list of `PropertyCard` components.
- **Constraint:** Images are loaded from external sources (Lorem Picsum).

### 3.2 Shopping Cart System
- **Description:** A slide-out drawer component (`CartDrawer`) managing user selections.
- **Functional Requirements:**
  - Add items with specific service types ("Purchase/Rent" vs "Drive-to-View").
  - Prevent duplicate additions of the exact same item+service combination.
  - Calculate 5% Service Charge on the subtotal.
  - Allow item removal.

### 3.3 Checkout Module
- **Description:** A multi-field form capturing necessary customer data.
- **Data Points:** Name, Email, Phone, Region, Town, Area, Address Type (Home/Office/Campus).
- **Validation:** HTML5 required field validation.
- **Post-Condition:** Displays an Order Confirmation screen upon successful submission.

### 3.4 AI Assistant
- **Description:** An embedded chat interface (`AIAssistant`) using the Google GenAI SDK.
- **Model:** `gemini-2.5-flash`.
- **Context:** The agent is fed the current `MOCK_PROPERTIES` list as system instructions to provide accurate, grounded answers.
- **Behavior:** Acts as a polite, professional real estate agent named "Pama".

---

## 4. Non-Functional Requirements

### 4.1 Performance
- **Load Time:** Application bundle shall be optimized for quick loading using ESM imports.
- **Responsiveness:** UI interactions (filtering, opening cart) should feel instantaneous (< 100ms).

### 4.2 Reliability
- **Dependency Management:** Critical dependencies (React, Lucide) are pinned to stable versions to ensure consistent runtime behavior.
- **Error Handling:** The AI component handles network/API errors gracefully without breaking the main app.

### 4.3 Security
- **API Key Safety:** API keys are accessed via `process.env` and not hardcoded in the source.
- **Data:** No user data is currently persisted to a backend (client-side only for Phase 1).

---

## 5. Appendices

### 5.1 Technology Stack
- **Framework:** React 18.3.1
- **Language:** TypeScript
- **Styling:** Tailwind CSS (CDN)
- **Icons:** Lucide React
- **AI SDK:** @google/genai

### 5.2 Assumptions
- Users have an active internet connection.
- A valid `API_KEY` is provided in the environment for AI features.