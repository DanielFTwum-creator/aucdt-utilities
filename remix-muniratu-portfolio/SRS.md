# Software Requirements Specification (SRS)
## Muniratu Portfolio Application

**Version:** 1.0
**Date:** 2026-02-20
**Status:** Phase 1 Complete

---

## 1. Introduction

### 1.1 Purpose
The purpose of this document is to define the software requirements for the Muniratu Portfolio Application. This application serves as a professional digital portfolio for Muniratu, showcasing services in photography, web design, graphic design, and photo editing.

### 1.2 Scope
The application is a responsive single-page application (SPA) built with React and TypeScript. It includes features for displaying portfolio items, listing services, facilitating client bookings, and providing an AI-powered assistant for user interaction.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SPA:** Single Page Application
- **SRS:** Software Requirements Specification
- **AI:** Artificial Intelligence
- **UI/UX:** User Interface / User Experience

---

## 2. Overall Description

### 2.1 Product Perspective
The product is a standalone web application hosted on a cloud platform. It leverages the Gemini API for AI capabilities and uses modern web technologies (React, Tailwind CSS, Framer Motion) for a high-quality user experience.

### 2.2 User Characteristics
- **Potential Clients:** Individuals or businesses seeking creative services.
- **General Visitors:** Users browsing the portfolio for inspiration or information.

### 2.3 Assumptions and Dependencies
- Users have a modern web browser with JavaScript enabled.
- The application relies on the Gemini API for the AI agent features.
- Internet connection is required for all features.

---

## 3. Specific Requirements

### 3.1 Functional Requirements

#### 3.1.1 Navigation
- **FR-01:** The system shall provide a responsive navigation bar.
- **FR-02:** The navigation bar shall stick to the top of the viewport on scroll.
- **FR-03:** The navigation shall include links to Home, About, Services, Projects, and Contact.

#### 3.1.2 Hero Section
- **FR-04:** The system shall display a hero section with a headline, subheadline, and call-to-action buttons.
- **FR-05:** The hero section shall include animated entrance effects.

#### 3.1.3 Services Section
- **FR-06:** The system shall list available services: Photography, Web Design, Graphic Design, Photo Editing.
- **FR-07:** Users shall be able to filter services by category.

#### 3.1.4 Portfolio Section
- **FR-08:** The system shall display a grid of selected works.
- **FR-09:** Each portfolio item shall display a title and category on hover.

#### 3.1.5 Video Carousel
- **FR-10:** The system shall display a carousel of video content.
- **FR-11:** The carousel shall auto-advance and allow manual navigation.

#### 3.1.6 Booking System
- **FR-12:** The system shall provide a multi-step booking widget.
- **FR-13:** Users shall be able to select a service, date, and time.
- **FR-14:** The system shall validate user input before confirming the booking.

#### 3.1.7 AI Agent
- **FR-15:** The system shall include a floating AI chat agent.
- **FR-16:** The agent shall answer questions about Muniratu's services and background using the Gemini API.
- **FR-17:** The agent shall maintain conversation context.

#### 3.1.8 Contact Form
- **FR-18:** The system shall provide a contact form for general inquiries.
- **FR-19:** The system shall display contact information (Phone, Email, Location).

### 3.1.9 Exclusions
- **EX-01:** Social media links are excluded until valid URLs are provided to ensure zero broken links.
- **EX-02:** "View All Projects" page is excluded as the single-page layout sufficiently showcases the portfolio.

### 3.1.10 Admin Dashboard
- **FR-20:** The system shall provide a password-protected admin area.
- **FR-21:** The admin area shall include a dashboard with key statistics.
- **FR-22:** The admin area shall provide system diagnostics (React version, API status).
- **FR-23:** The admin area shall provide an audit log of system events.

### 3.1.11 Theming
- **FR-24:** Users shall be able to switch between Light, Dark, and High-Contrast themes.
- **FR-25:** Theme preference shall be persisted in local storage.

### 3.1.12 Testing
- **FR-26:** The system shall provide an interactive testing suite in the admin area.
- **FR-27:** The testing suite shall simulate critical user journeys (Navigation, Booking).
- **FR-28:** The system shall include a Playwright test script for external E2E testing.

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance
- **NFR-01:** The application shall load the initial view within 2 seconds on broadband connections.
- **NFR-02:** Animations shall run smoothly at 60fps on supported devices.

#### 3.2.2 Reliability
- **NFR-03:** The booking system shall handle input errors gracefully.
- **NFR-04:** The AI agent shall provide fallback responses if the API is unavailable.

#### 3.2.3 Design Constraints
- **DC-01:** The UI shall follow a consistent color palette (Orange/Black/White).
- **DC-02:** Typography shall use 'Inter' for body text and 'Playfair Display' for headings.

#### 3.2.4 Security
- **SEC-01:** Admin routes must be protected by authentication.
- **SEC-02:** All administrative actions must be logged.

#### 3.2.5 Accessibility
- **ACC-01:** The application must support keyboard navigation.
- **ACC-02:** The application must provide a High-Contrast mode for visually impaired users.

---

## 4. Interface Requirements

### 4.1 User Interfaces
- **Desktop:** Optimized for 1920x1080 and lower resolutions.
- **Mobile:** Optimized for touch interaction on iOS and Android devices.

### 4.2 Software Interfaces
- **Gemini API:** Used for natural language processing in the AI agent.
- **Lucide React:** Used for iconography.
- **Framer Motion:** Used for animation primitives.

---

## 5. Appendices
- **A:** Tech Stack: React 19, Vite, Tailwind CSS 4, TypeScript.
