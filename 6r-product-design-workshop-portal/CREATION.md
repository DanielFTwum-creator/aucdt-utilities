# 6r-product-design-workshop-portal

## Purpose
A dedicated learning portal for the 6R Product Design Workshop, providing students and staff with instructional modules, design quests, and a portfolio showcase. It facilitates the mastery of the 6R methodology through structured lessons and interactive design audits.

## Stack
- React 19.2.5
- TypeScript
- Vite 7.3.1
- Tailwind CSS 4.2+
- React Router DOM 7.1.0
- Vitest
- Lucide React
- Prismjs
- Docker (nginx:alpine)

## Setup
1. Navigate to the project directory: `cd 6r-product-design-workshop-portal`
2. Install dependencies: `pnpm install`
3. Configure environment variables: Create a `.env.local` file and add `GEMINI_API_KEY=your_key_here`
4. Start the development server: `pnpm run dev`

## Key Decisions
- **Modular Lesson Architecture:** Content is split into modules and lessons with dedicated overview and detail pages to reduce cognitive overload (6R Reduce).
- **Quest-Based Learning:** Implementation of a "Design Audit Quest" that requires active submission and evaluation, moving beyond passive consumption.
- **Integrated Showcase:** A dedicated portfolio and showcase section to allow students to demonstrate the application of the 6R methodology to real-world products.

## Open Questions
- **ARIA Compliance:** The SRS indicates that 100% ARIA coverage is currently non-compliant; which components require the most urgent accessibility remediation?
- **Admin Isolation:** The SRS notes that the admin section is not yet fully isolated/protected; what is the preferred authentication mechanism for the `#/admin` route?
