# SashMade: Afro-Chic Studio - Software Requirements Specification
**IEEE Std 830-1998 Compliant**

| Field | Detail |
| :--- | :--- |
| **Document Version** | 3.0 (Final) |
| **Date** | February 2026 |
| **Status** | Production Ready |
| **Prepared For** | sashmade.com Development Team |
| **Prepared By** | Technical Architecture Team |
| **Classification** | Internal – Confidential |

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) defines the complete functional and non-functional requirements for the SashMade: Afro-Chic Studio web platform (sashmade.com). It serves as the authoritative contractual reference between stakeholders, designers, and developers. The document conforms to IEEE Std 830-1998 and encompasses all subsystems including AI-powered design tools, end-to-end e-commerce operations, and integrated payment processing via Techbridge/Hubtel Gateway.

### 1.2 Scope
SashMade is a React 19-based Single Page Application (SPA) deployed at sashmade.com that enables customers across Ghana and the African diaspora to:
*   Explore, analyse, and generate African textile patterns using AI (Google Gemini).
*   Browse, filter, and purchase fabric products, custom garments, and design assets.
*   Checkout securely via Hubtel Payment Gateway (Mobile Money, Card, Bank).
*   Track order lifecycle from placement through fulfilment and delivery.
*   Interact with an AI fashion consultant chatbot named 'Sash'.
*   Manage accounts, wishlists, and order histories.

The platform is explicitly out of scope for: physical inventory management hardware, third-party logistics integrations beyond shipping-status webhooks, and wholesale B2B procurement workflows.

### 1.3 Definitions, Acronyms, and Abbreviations
| Term / Acronym | Definition |
| :--- | :--- |
| **SRS** | Software Requirements Specification |
| **SPA** | Single Page Application |
| **AI / ML** | Artificial Intelligence / Machine Learning |
| **API** | Application Programming Interface |
| **FR** | Functional Requirement |
| **NFR** | Non-Functional Requirement |
| **E2E** | End-to-End (testing) |
| **UX** | User Experience |
| **WCAG** | Web Content Accessibility Guidelines |
| **MoMo** | Mobile Money (Ghana-specific payment method) |
| **Hubtel** | Techbridge/Hubtel Payment Gateway (primary PSP) |
| **PSP** | Payment Service Provider |
| **SKU** | Stock Keeping Unit |
| **JWT** | JSON Web Token (authentication) |
| **CDN** | Content Delivery Network |
| **GDPR** | General Data Protection Regulation |
| **NDPC** | National Data Protection Commission (Ghana) |
| **TDD** | Test-Driven Development |

### 1.4 References
*   IEEE Std 830-1998: Recommended Practice for Software Requirements Specifications.
*   Google Gemini API Documentation — Multimodal Vision & Chat (2025).
*   Hubtel Developer Portal: Payment Gateway API v3.
*   Techbridge Integration Manual — Direct Debit & Mobile Money (2025).
*   WCAG 2.2 — W3C Web Content Accessibility Guidelines.
*   NDPC Guidelines for Online Data Processors — Ghana, 2023.
*   React 19 Official Documentation.
*   OWASP Top 10 2021 — Application Security Risks.

### 1.5 Document Overview
Section 2 provides product context. Section 3 specifies all functional requirements. Section 4 covers external interface requirements. Section 5 defines system features. Sections 6–14 address non-functional requirements, data management, security, e-commerce specifics, payment processing, deployment, testing, and appendices.

---

## 2. Overall Description

### 2.1 Product Perspective
SashMade operates as a vertically integrated AI-enhanced e-commerce platform. It is a new, standalone system that communicates with the following external systems:
*   **Google Gemini API** for multimodal AI processing (pattern analysis, image generation, chat).
*   **Hubtel Payment Gateway** for all payment transactions (MoMo, debit/credit card, bank transfer).
*   **Courier/Logistics Webhook APIs** for real-time shipment tracking status updates.
*   **Cloud Object Storage** (AWS S3 or Cloudflare R2) for product images and AI-generated assets.
*   **SMTP / Transactional Email Service** (SendGrid or Mailchimp) for order confirmations and notifications.

The system is decomposed into four high-level subsystems: (1) the AI Design Studio, (2) the E-Commerce Storefront, (3) the Order & Fulfilment Engine, and (4) the Admin Console.

### 2.2 Product Functions — High Level
| Subsystem | Key Functions |
| :--- | :--- |
| **AI Design Studio** | Image analysis, seamless pattern generation, AI chatbot 'Sash' |
| **E-Commerce Storefront** | Product catalogue, search & filter, wishlist, cart, promotions |
| **Checkout & Payments** | Multi-method checkout, Hubtel MoMo/Card/Bank, invoicing |
| **Order & Fulfilment** | Order management, status tracking, returns & refunds |
| **User Accounts** | Registration, authentication, profile, address book, order history |
| **Admin Console** | Dashboard, inventory, order processing, analytics, system health |

### 2.3 User Classes and Characteristics
#### 2.3.1 Guest Visitor
Unauthenticated user browsing the catalogue. May add to cart but must register/log in to complete checkout. Limited access to AI tools (max 3 pattern analyses per session).

#### 2.3.2 Registered Customer
Authenticated user with full purchase rights. Has access to order history, saved addresses, wishlist, and unlimited AI Design Studio features.

#### 2.3.3 Designer / Creative Partner
A registered user with elevated privileges to upload original textile designs for sale on the marketplace. Subject to a design vetting workflow.

#### 2.3.4 Customer Support Agent
Internal staff member with read access to customer orders and the ability to initiate refunds and update order statuses through the Admin Console.

#### 2.3.5 System Administrator
Full-access internal user responsible for system configuration, user management, inventory updates, analytics, and system health monitoring.

### 2.4 Operating Environment
*   **Client:** Modern web browsers (Chrome 120+, Firefox 120+, Safari 17+, Edge 120+) on desktop, tablet, and mobile.
*   **Server:** Node.js 20 LTS / Express 5 on a containerised cloud environment.
*   **Database:** PostgreSQL 16 (primary relational store) + Redis 7 (session cache, rate limiting).
*   **CDN:** Static assets and product images served via CDN edge nodes.
*   **Connectivity:** Requires active internet; offline mode is not supported.

### 2.5 Design and Implementation Constraints
*   **Frontend framework:** React 19.2.4 (strict requirement; no downgrade permitted).
*   **AI provider:** Google Gemini API (gemini-2.5-flash for vision/generation; gemini-3-flash-preview for chat).
*   **Payment PSP:** Hubtel Gateway (Techbridge) exclusively for primary transactions.
*   **Compliance:** NDPC (Ghana), GDPR (diaspora customers in EU), PCI-DSS SAQ-A for card data handling.
*   **Currency:** Default GHS (Ghana Cedi); multi-currency display (USD, GBP, EUR) with live exchange rates.
*   **Language:** English primary; Twi and French localisation planned for v3.1.

### 2.6 User Documentation
*   **Administrator Guide:** `/docs/ADMIN_GUIDE.md`
*   **Deployment Guide:** `/docs/DEPLOYMENT_GUIDE.md`
*   **Testing Guide:** `/docs/TESTING_GUIDE.md`

### 2.7 Assumptions and Dependencies
*   Google Gemini API quota is sufficient for expected load.
*   Hubtel merchant account is provisioned and sandbox credentials are available.
*   Product photography and initial inventory data are provided by the business team.
*   SSL/TLS certificate is managed by the hosting provider or Cloudflare.
*   The logistics partner exposes a REST webhook for shipment status events.

---

## 3. System Features

### 3.1 Splash Homepage
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-01** | Display a Hero section with auto-rotating image carousel (3–5 curated fabric images, 5-second interval, manual nav arrows) and a primary Call-To-Action button linking to the storefront. | MUST | Business |
| **FR-02** | Display an 'About SashMade' section with brand heritage narrative, founder story, and cultural context. | MUST | Marketing |
| **FR-03** | Display a 'Features at a Glance' section summarising the AI Studio, Storefront, and Chatbot. | SHOULD | Marketing |
| **FR-04** | Display a customer testimonials carousel with star ratings and reviewer attribution. | SHOULD | Marketing |
| **FR-05** | Display a product gallery grid (8–12 items) pulling from the live catalogue API. | MUST | Business |
| **FR-06** | Render a responsive navigation bar with logo, links (Shop, AI Studio, About), Cart icon with item count badge, and Login/Account button. | MUST | UX |
| **FR-07** | Display a footer with social links, legal pages (Privacy Policy, Terms & Conditions, Refund Policy), contact details, and payment method icons. | MUST | Legal/UX |

### 3.2 AI Design Studio

#### 3.2.1 Visual Decoder (Fabric Analyser)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-10** | Accept image uploads (PNG, JPG, WEBP, max 5 MB) via drag-and-drop or file picker. | MUST | AI |
| **FR-11** | Display image preview immediately on upload before AI processing. | MUST | UX |
| **FR-12** | Submit image to Gemini Vision API and return structured metadata: Pattern Name, Cultural Origin, Historical Significance, Suggested Styling, Estimated Value Range. | MUST | AI |
| **FR-13** | Extract and display a 6-colour palette from the fabric image with hex codes and colour names. | MUST | AI |
| **FR-14** | Allow authenticated customers to save analysis results to their account profile. | SHOULD | UX |
| **FR-15** | Guest users may perform up to 3 analyses per session before a registration prompt is displayed. | MUST | Business |

#### 3.2.2 Generative Loom (Pattern Generator)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-20** | Accept free-text prompts for AI-driven textile pattern generation. | MUST | AI |
| **FR-21** | Provide a library of at least 12 preset prompt templates (e.g., 'Kente Royale', 'Adinkra Minimal', 'Batik Coastal'). | MUST | UX |
| **FR-22** | Generate high-resolution (1024×1024 px minimum) seamless pattern images via Gemini image generation. | MUST | AI |
| **FR-23** | Display generated image with prompt history (last 10 prompts in session). | MUST | UX |
| **FR-24** | Allow download of generated pattern as PNG. | MUST | UX |
| **FR-25** | Allow authenticated users to add a generated pattern to the marketplace for sale (triggers designer vetting workflow). | COULD | Business |
| **FR-26** | Display a loading skeleton/spinner with estimated time during generation. | MUST | UX |

#### 3.2.3 Style Oracle (AI Chatbot)
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-30** | Present a conversational chat interface with the 'Sash' AI persona. | MUST | AI |
| **FR-31** | Maintain context-aware session chat history (retained for the browser session duration). | MUST | AI |
| **FR-32** | Provide fashion advice on fabric pairing, styling, occasion dressing, and cultural significance. | MUST | AI |
| **FR-33** | Allow users to share a product URL in chat; Sash shall retrieve product details and advise on it. | SHOULD | AI/UX |
| **FR-34** | Display typing indicator while the AI is generating a response. | MUST | UX |
| **FR-35** | Provide quick-reply suggestion chips for common queries. | SHOULD | UX |

### 3.3 E-Commerce Storefront

#### 3.3.1 Product Catalogue
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-40** | Display a paginated product grid (24 items per page) with image, name, price (GHS primary), and 'Add to Cart' button. | MUST | E-Commerce |
| **FR-41** | Support filtering by category, origin, price range, and availability. | MUST | E-Commerce |
| **FR-42** | Support full-text keyword search with debounced API calls (300ms debounce). | MUST | E-Commerce |
| **FR-43** | Support sorting by Newest, Price Low–High, Price High–Low, Most Popular, Top Rated. | MUST | E-Commerce |
| **FR-44** | Display a Product Detail Page (PDP) with: image gallery, description, size chart, material composition, cultural story, reviews, and related products. | MUST | E-Commerce |
| **FR-45** | Allow customers to select size, colour variant, and quantity on the PDP. | MUST | E-Commerce |
| **FR-46** | Display real-time stock availability status. | MUST | E-Commerce |
| **FR-47** | Support a wishlist feature for authenticated users. | SHOULD | E-Commerce |

#### 3.3.2 Shopping Cart
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-50** | Persist cart in browser localStorage for guest users and database-backed for authenticated users. | MUST | E-Commerce |
| **FR-51** | Allow quantity adjustment and item removal within the cart. | MUST | E-Commerce |
| **FR-52** | Display order summary: line items, subtotal, estimated shipping, promotional discounts, and total. | MUST | E-Commerce |
| **FR-53** | Allow entry and validation of promotional/discount codes. | MUST | E-Commerce |
| **FR-54** | Merge guest cart with authenticated cart upon login. | MUST | E-Commerce |
| **FR-55** | Display a cross-sell recommendation block at the bottom of the cart. | COULD | Business |

### 3.4 Checkout & Order Placement
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-60** | Implement a multi-step checkout flow: (1) Contact Info, (2) Delivery Address, (3) Shipping Method, (4) Payment, (5) Review & Confirm. | MUST | E-Commerce |
| **FR-61** | Support guest checkout with optional account creation post-order. | MUST | E-Commerce |
| **FR-62** | Allow authenticated users to select from saved addresses or add a new address. | MUST | E-Commerce |
| **FR-63** | Display available shipping methods with estimated delivery dates and costs. | MUST | E-Commerce |
| **FR-64** | Integrate Hubtel Payment Gateway to support MoMo, Cards, Bank Transfer. | MUST | Payments |
| **FR-65** | Redirect to Hubtel-hosted payment page for card transactions (PCI-DSS SAQ-A compliant). | MUST | Compliance |
| **FR-66** | Handle Hubtel payment callbacks and update order status accordingly. | MUST | Payments |
| **FR-67** | Generate a unique Order Reference Number (SML-YYYYMMDD-XXXXX). | MUST | E-Commerce |
| **FR-68** | Send an order confirmation email with itemised receipt. | MUST | E-Commerce |
| **FR-69** | Display an Order Confirmation page with order summary and next-steps guidance. | MUST | UX |
| **FR-70** | Implement idempotency keys in all payment API calls. | MUST | Payments |
| **FR-71** | Support multi-currency display (GHS, USD, GBP, EUR). | SHOULD | Business |

### 3.5 Order Management
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-80** | Maintain order lifecycle states: Pending Payment → Confirmed → Processing → Shipped → Delivered → Completed / Cancelled / Refunded. | MUST | E-Commerce |
| **FR-81** | Allow authenticated customers to view full order history. | MUST | E-Commerce |
| **FR-82** | Allow customers to view shipment tracking status. | MUST | E-Commerce |
| **FR-83** | Allow customers to submit a return/refund request within 14 days. | MUST | E-Commerce |
| **FR-84** | Send automated email/SMS notifications on order status transitions. | MUST | E-Commerce |
| **FR-85** | Allow admins to manually update order status and trigger refund via Hubtel API. | MUST | Admin |
| **FR-86** | Generate downloadable PDF invoice for any completed order. | SHOULD | E-Commerce |

### 3.6 User Account Management
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-90** | Support registration via email/password and social OAuth. | MUST | Auth |
| **FR-91** | Enforce email verification before account activation. | MUST | Security |
| **FR-92** | Support password reset via time-limited email link. | MUST | Security |
| **FR-93** | Allow users to manage profile details. | MUST | UX |
| **FR-94** | Allow users to manage multiple saved delivery addresses. | MUST | UX |
| **FR-95** | Implement JWT-based session management. | MUST | Security |
| **FR-96** | Provide a data export function (GDPR/NDPC). | MUST | Compliance |
| **FR-97** | Provide account deletion with a 30-day soft-delete grace period. | MUST | Compliance |

### 3.7 Admin Console
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-100** | Restrict access to /admin/* routes; require admin credentials (username + TOTP 2FA). | MUST | Security |
| **FR-101** | Dashboard: display real-time KPIs. | MUST | Admin |
| **FR-102** | Inventory management: CRUD operations for products, variants, SKUs. | MUST | Admin |
| **FR-103** | Order queue: view all orders, filter by status, print packing slips. | MUST | Admin |
| **FR-104** | Customer management: view customer profiles, order histories. | MUST | Admin |
| **FR-105** | Promotions management: create discount codes. | SHOULD | Business |
| **FR-106** | System diagnostics: API health checks, error logs. | MUST | Admin |
| **FR-107** | Audit log: immutable log of all admin actions. | MUST | Compliance |
| **FR-108** | Theme management: toggle Light, Dark, and High-Contrast themes. | COULD | UX |

### 3.8 Automated Testing Framework
| ID | Requirement | Priority | Source |
| :--- | :--- | :--- | :--- |
| **FR-110** | Expose an /admin/testing UI for executing automated E2E test suites. | MUST | QA |
| **FR-111** | Use Playwright to verify critical paths. | MUST | QA |
| **FR-112** | Display real-time test execution logs and pass/fail status. | MUST | QA |
| **FR-113** | Capture and store screenshots for failed tests. | MUST | QA |
| **FR-114** | Allow one-click test suite re-run from the admin UI. | SHOULD | QA |

---

## 4. External Interface Requirements
*   **User Interfaces:** Responsive (mobile/tablet/desktop), Afro-Chic aesthetic, WCAG 2.2 AA.
*   **Hardware Interfaces:** Standard web browsers; Camera/file API for uploads.
*   **Software Interfaces:** Google Gemini API, Hubtel Payment Gateway, Logistics Webhooks, SendGrid/Mailchimp, AWS S3/Cloudflare R2.
*   **Communications:** HTTPS (TLS 1.3), SSE for AI streaming, WebSockets for admin dashboard.

---

## 5. Payment Processing — Hubtel / Techbridge Gateway
*   **MoMo Flow:** Initiate -> USSD Prompt -> Callback -> Verify.
*   **Card Flow:** Initiate -> Redirect to Hubtel -> 3DS -> Redirect Back -> Verify.
*   **Security:** API credentials server-side only, HMAC-SHA256 callback validation, Idempotency keys, PCI-DSS SAQ-A (hosted pages).

---

## 6. Non-Functional Requirements
*   **Performance:** LCP <= 2.5s, AI response <= 10s, Hubtel init <= 5s.
*   **Reliability:** 99.9% uptime, API retry logic, graceful degradation.
*   **Security:** HTTPS, JWT (RS256), Rate limiting, OWASP Top 10, CSP, bcrypt passwords, TOTP 2FA for admins.
*   **Usability & Accessibility:** WCAG 2.2 Level AA, Keyboard navigable, Contrast ratios.
*   **Maintainability:** Airbnb Style Guide, Versioned APIs, Unit test coverage >= 80%.

---

## 7. Data Management
The following diagram illustrates the conceptual database schema.

![Database Schema](/docs/database_architecture.svg)

*   **Entities:** User, Product, SKU, Order, OrderItem, Payment, Shipment, DiscountCode, Review, AuditLog.
*   **Retention:** Indefinite for orders/payments, 30-day grace for deleted users, 90 days for AI images.
*   **Privacy:** NDPC/GDPR compliance, Cookie consent, Privacy Policy.

---

## 8. System Architecture Overview
The following diagrams illustrate the architecture and user flow of the SashMade platform.

### 8.1 High-Level Architecture
![System Architecture](/docs/system_architecture.svg)

### 8.2 Customer Journey
![Customer Journey](/docs/user_journey.svg)

*   **Frontend:** React 19, TypeScript, Tailwind CSS.
*   **Backend:** Node.js 20, Express 5, TypeScript.
*   **Database:** PostgreSQL 16, Redis 7.
*   **Infrastructure:** Docker, Kubernetes/PaaS, CI/CD (GitHub Actions).

---

## 9. Testing Requirements
*   **Unit:** Jest + React Testing Library (>= 80% coverage).
*   **Integration:** API tests, Payment callback tests.
*   **E2E:** Playwright-based tests accessible from Admin Console.
*   **Security:** OWASP ZAP scan, Penetration testing.
*   **Acceptance:** UAT with representative users.

---

## 10. Deployment and DevOps
*   **Environments:** Local Dev, Staging (Hubtel Sandbox), Production (Live).
*   **CI/CD:** Lint -> Unit Test -> Docker Build -> Deploy Staging -> E2E Test -> Manual Gate -> Deploy Production.
*   **Monitoring:** APM (Sentry/Datadog), Uptime checks, Alerting.

---

## 11. Regulatory and Compliance
*   **Data Protection:** Ghana NDPC, GDPR.
*   **Payment:** PCI-DSS SAQ-A, AML.
*   **Consumer Protection:** Refund Policy, Accurate descriptions.

---

## 12. Requirements Traceability Matrix
(Mapped in full document)

---

## 13. Document Revision History
*   **3.0 (2026-02-23):** Full IEEE Std 830-1998 restructure. Added Hubtel/Techbridge payment integration, compliance, deployment, testing.

---

## 14. Appendices
*   **A:** Hubtel Payment API Quick Reference.
*   **B:** Order Status State Machine.
*   **C:** Priority Classification.
*   **D:** Contact & Approval.
