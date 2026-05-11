# Alumni Network

## Purpose
Alumni engagement and networking platform connecting graduates with institution, peers, and career opportunities. Facilitates mentorship, event coordination, fund-raising campaigns, and lifelong community building for Techbridge University College alumni.

## Stack
- Node.js Express 5.2.1
- TypeScript (dev)
- MySQL2 3.3.0 (MariaDB compatible)
- CORS 2.8.6
- UUID 11.1.0
- Vitest 3.0.0

## Setup
1. pnpm install
2. Create .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
3. pnpm run dev (nodemon, port 3000)
4. pnpm test (unit tests with Vitest)
5. Initialize MySQL database with alumni schema (profiles, events, messages, connections)

## Key Decisions
- Express REST API chosen for scalable alumni data management and real-time engagement features.
- MySQL provides relational integrity for alumni profiles, event registrations, and network connections.
- Separate frontend application will consume this API (React, Vue, or native mobile).
- CORS enabled to support multiple client applications and future integrations.

## Open Questions
- Will the platform support anonymous alumni feedback and satisfaction surveys?
- Should the system include AI-powered alumni profile matching for mentorship recommendations?
