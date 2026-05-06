# Accommodation Management

## Purpose
Housing allocation and accommodation management system for student residential services. Manages dorm assignments, room allocations, occupancy tracking, and resident communications for on-campus housing.

## Stack
- Node.js Express 5.2.1
- TypeScript (dev)
- MySQL2 3.3.0 (MariaDB compatible)
- CORS 2.8.6
- UUID 11.1.0
- Vitest 3.0.0 (testing)

## Setup
1. pnpm install
2. Create .env file with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
3. pnpm run dev (nodemon with hot reload, port 3000)
4. pnpm test (run Vitest tests)
5. Set up MySQL database with accommodation schema

## Key Decisions
- Express.js selected for lightweight REST API serving accommodation allocation logic.
- MySQL/MariaDB chosen for relational data integrity (students, rooms, assignments, occupancy).
- CORS enabled to support future frontend applications (React/Vue).
- Nodemon for development to enable rapid API iteration without restart.

## Open Questions
- Will this integrate with student information system for automatic enrollment sync?
- Should the system support waitlist management and student preference ranking?

