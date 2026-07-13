# backend - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for backend.

### FILE: .dockerignore
```text
node_modules
npm-debug.log
.env
.env.local
.env.*.local
dist
*.log
.git
.gitignore
README.md
.vscode
.idea
*.md

```

### FILE: (environment files omitted)

> Environment files are never committed. See the repo's own `.env.example`
> for variable names; real values live only in the server's untracked
> `.env.local` / `.env.production`. This block was removed by the fleet
> secret-scrub (blueprint minus secrets).

### FILE: .gitignore
```text
node_modules
dist
.env
*.log
.DS_Store

```

### FILE: CREATION.md
```md
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

```

### FILE: Dockerfile
```text
# Multi-stage build for TUC Auth API (Node.js + TypeScript + Express)

# Stage 1: Builder
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript to JavaScript
RUN npm install --save-dev typescript@^5.9.3 && \
    npm run build && \
    npm uninstall typescript

# Stage 2: Production Runtime
FROM node:24-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Set ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose API port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/server.js"]

```

### FILE: docs/SRS.md
```md
﻿# System Requirements Specification (SRS)
## Project: backend
**Version:** 1.0 (Auto-Generated Baseline)
**Date:** 2026-03-07

---

## 1. Introduction
### 1.1 Purpose
This document defines the baseline system requirements for **backend**, ensuring alignment with the overarching Techbridge University College ecosystem standards.

### 1.2 Scope
This application provides utility functionality within the TUC ecosystem.

## 2. Institutional Compliance Mandates (Permanent)
To maintain alignment with the **Techbridge Scholarship Portal v2.0 Blueprint**, this project strictly adheres to the following constraints:

- **React Version:** Must operate on React 19.2.5.
- **Linguistic Standard:** Strict adherence to UK British English (e.g., *programme*, *colour*, *analyse*).
- **Security & Diagnostics:** All internal audit logs and test simulators must be isolated behind the `#/admin` hash route.
- **Deployment:** `vite.config.ts` must utilize relative base pathing (`base: './'`) to guarantee universal PWA hosting.
- **UI/UX Aesthetics:** Implementation of the "Warm Prestige" 6R aesthetic (TUC Gold, Cream, Ink) using `Playfair Display` and `Cormorant Garamond`.

## 3. Architecture & Tech Stack
- **Frontend Core:** React 19.2.5 + TypeScript
- **Build Tool:** Vite 7+
- **Styling:** Tailwind CSS v4

## 4. Revision History
| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2026-03-07 | 1.0 | Initial Scaffolding | ReactUIRemediator Agent |

```

### FILE: package.json
```json
{
  "name": "tuc-auth-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.3.1",
    "express": "^5.2.1",
    "express-rate-limit": "^8.2.1",
    "helmet": "^8.1.0",
    "jsonwebtoken": "^9.0.3",
    "morgan": "^1.10.1",
    "mysql2": "^3.17.4"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.6",
    "@types/express-rate-limit": "^5.1.3",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/morgan": "^1.9.10",
    "@types/node": "^25.3.0",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.9.3"
  }
}

```

### FILE: src/controllers/authController.ts
```typescript
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';

const JWT_SECRET = <REDACTED>
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Authentication required: Username and password must be provided' });
  }

  try {
    const user = await UserModel.findByUsername(username);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid TUC credentials' });
    }

    const isPasswordValid = [REDACTED_CREDENTIAL]

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid TUC credentials' });
    }

    const tokenPayload = [REDACTED_CREDENTIAL]
      id: user.id,
      username: user.username,
      role: user.role
    };

    const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
    const token = [REDACTED_CREDENTIAL]

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        email: user.email
      },
      message: 'TUC Central Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Client is expected to delete the token. 
  // Future implementation could involve blacklisting tokens in Redis.
  res.status(200).json({ success: true, message: 'Logout successful' });
};

export const validateToken = [REDACTED_CREDENTIAL]
  res.status(200).json({ 
    success: true, 
    valid: true, 
    user: (req as any).user 
  });
};


```

### FILE: src/middleware/authMiddleware.ts
```typescript
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = <REDACTED>

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = [REDACTED_CREDENTIAL]

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      (req as any).user = user;
      next();
    });
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

```

### FILE: src/middleware/errorHandler.ts
```typescript
import { Request, Response, NextFunction } from 'express'; export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => { console.error(err.stack); res.status(err.status || 500).json({ error: 'Internal Server Error', message: err.message || 'Something went wrong' }); };
```

### FILE: src/middleware/rateLimitMiddleware.ts
```typescript
import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 requests per minute
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

```

### FILE: src/models/User.ts
```typescript
import pool from '../utils/db';

export interface User {
  id: number;
  username: string;
  password?: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const [rows] = await (pool as any).execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error('Error in findByUsername:', error);
      throw error;
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await (pool as any).execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      
      if (rows.length === 0) {
        return null;
      }
      
      return rows[0] as User;
    } catch (error) {
      console.error('Error in findById:', error);
      throw error;
    }
  }

  static async create(userData: Partial<User>): Promise<number> {
    try {
      const { username, password, email, role } = userData;
      const [result] = await (pool as any).execute(
        'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
        [username, password, email, role || 'user']
      );
      return (result as any).insertId;
    } catch (error) {

      console.error('Error in create User:', error);
      throw error;
    }
  }
}


```

### FILE: src/routes/auth.ts
```typescript
import express from 'express'; const router = express.Router(); router.post('/login', (req, res) => res.json({ message: 'Login successful' })); router.post('/logout', (req, res) => res.json({ message: 'Logout successful' })); router.get('/me', (req, res) => res.json({ id: 1, username: 'admin', role: 'admin' })); export default router;
```

### FILE: src/routes/authRoutes.ts
```typescript
import { Router } from 'express';
import { login, logout, validateToken } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/validate', authenticateJWT, validateToken);

export default router;

```

### FILE: src/server.ts
```typescript
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRateLimiter } from './middleware/rateLimitMiddleware';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(apiRateLimiter);

// Routes
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public', 'index.html')); });
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

```

### FILE: src/utils/db.ts
```typescript
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;

```

### FILE: src/utils/logger.ts
```typescript
export const logger = { info: (m) => console.log('[INFO] ' + m), error: (m) => console.error('[ERROR] ' + m), warn: (m) => console.warn('[WARN] ' + m) };
```

### FILE: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*", "src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

```

### FILE: _tmp_66276_e65bb5685c576e3a331b33f844dfc7f2
```text

```

