# backend

## Purpose
Centralized authentication and authorization API (tuc-auth-api) serving as the security backbone for Techbridge University College. Manages user credentials, JWT token issuance, and rate-limited access control across the entire institutional platform.

## Stack
- Node.js 24.x
- TypeScript 5.9.3
- Express 5.2.1
- MySQL2 3.17.4
- jsonwebtoken 9.0.3
- bcryptjs 3.0.3
- Helmet 8.1.0
- express-rate-limit 8.2.1
- CORS 2.8.6

## Setup
1. Navigate to project directory: `cd backend`
2. Install dependencies: `pnpm install`
3. Configure environment variables: `cp .env.example .env.local`
4. Start development server with hot reload: `pnpm run dev`
5. Build for production: `pnpm run build`
6. Start production server: `pnpm start`

## Key Decisions
- **Type-Safe Authentication:** Full TypeScript implementation with strict type definitions for all credential and token workflows.
- **Security-First Middleware:** Helmet, rate-limiting, and CORS enforced at Express middleware level with zero-trust assumptions.
- **Relational Persistence:** MySQL2 with async/await patterns for deterministic credential storage and audit compatibility.

## Open Questions
- **OAuth2/SAML Integration:** Should authentication support institutional single-sign-on (SSO) or remain password-only?
- **Token Refresh Strategy:** What is the optimal JWT expiration window (currently 7d) and refresh token rotation policy?
