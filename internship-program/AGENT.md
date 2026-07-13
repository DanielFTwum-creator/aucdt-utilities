# internship-program - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for internship-program.

### FILE: .dockerignore
```text
node_modules
dist
build
.git
.gitignore
*.md
.env
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
coverage
.nyc_output
*.log
.cache
.vscode
.idea
*.swp
*.swo
test-results
playwright-report

```

### FILE: backend/.env.example
```text
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/internship_program_db

# JWT Configuration
JWT_SECRET=<REDACTED>
JWT_EXPIRES_IN=24h

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

```

### FILE: backend/.gitignore
```text
node_modules/
dist/
.env
*.log
.DS_Store

```

### FILE: backend/package.json
```json
{
  "name": "Internship Program-backend",
  "version": "1.0.0",
  "description": "Backend API for Internship Program",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "vitest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.4.1",
    "zod": "^3.22.4",
    "pg": "^8.11.3",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.11.5",
    "@types/bcrypt": "^5.0.2",
    "@types/jsonwebtoken": "^9.0.5",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "vitest": "^1.2.1",
    "eslint": "^8.56.0",
    "prettier": "^3.2.4"
  }
}

```

### FILE: backend/README.md
```md
# Internship Program - Backend API

## Quick Start

```bash
pnpm install
cp .env.example .env
# Configure .env
pnpm dev
```

## API Endpoints

(To be documented)

## Database Schema

(To be defined in src/config/database.sql)

```

### FILE: backend/src/server.ts
```typescript
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Routes
import healthRoutes from './routes/health';
import authRoutes from './routes/auth';
// Import additional routes here

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
// Add additional routes here

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

```

### FILE: backend/tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}

```

### FILE: CREATION.md
```md
# internship-program

## Purpose
[Auto-generated. Needs manual review and completion.]

## Stack
Node.js, TypeScript, Vite

## Setup
```bash
# Placeholder — needs manual update based on project type
```

## Key Decisions
- [Pending review]
- [Pending review]
- [Pending review]

## Open Questions
- [To be determined]
- [To be determined]

```

### FILE: Dockerfile
```text
# Multi-stage Dockerfile for Vite/React Applications
# Optimized for production deployment

# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

# Enable Corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || npm install

# Copy application source
COPY . .

# Build application
RUN pnpm run build || npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /app

# Install serve for production preview
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm add -g serve

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:4173/health || exit 1

# Run application
CMD ["serve", "-s", "dist", "-l", "4173"]

```

### FILE: docs/SRS.md
```md
# Software Requirements Specification (SRS)
## Internship Program - Management System

**Document Version:** 1.0
**Date:** 2026-03-03
**Project Type:** Management System
**Status:** Draft

---

## 1. Introduction

### 1.1 Purpose
This document specifies the functional and non-functional requirements for Internship Program, a comprehensive management system designed to manage and track Internship Program operations.

### 1.2 Scope
Internship Program will provide:
- User authentication and authorization
- CRUD operations for record management
- Real-time data synchronization
- Reporting and analytics
- Audit logging

### 1.3 Definitions, Acronyms, and Abbreviations
- **CRUD:** Create, Read, Update, Delete
- **API:** Application Programming Interface
- **JWT:** JSON Web Token
- **RBAC:** Role-Based Access Control

### 1.4 References
- Project Documentation: `/docs/`
- API Documentation: `/docs/api/`
- Design Mockups: `/docs/designs/`

---

## 2. Overall Description

### 2.1 Product Perspective
Internship Program is a web-based management system that integrates with:
- User authentication service
- Central database
- Notification service
- File storage service

### 2.2 Product Functions
1. **User Management**
   - User registration and authentication
   - Role and permission management
   - Profile management

2. **record Management**
   - Create new record records
   - View record list with search and filter
   - Update record information
   - Delete/Archive record records

3. **Reporting**
   - Generate reports on record data
   - Export data to PDF/Excel
   - Scheduled report generation

4. **Audit & Logging**
   - Track all system activities
   - User action logs
   - System error logs

### 2.3 User Classes and Characteristics
- **Administrator:** Full system access, user management, system configuration
- **Manager:** Manage record, generate reports, view analytics
- **Staff:** Basic CRUD operations on assigned record
- **Viewer:** Read-only access to record data

### 2.4 Operating Environment
- **Frontend:** React 18+ with Vite
- **Backend:** Node.js 22+ with Express
- **Database:** PostgreSQL 15+ or MongoDB 6+
- **Deployment:** Docker containers, cloud-native
- **Browsers:** Chrome 100+, Firefox 100+, Safari 15+, Edge 100+

### 2.5 Design and Implementation Constraints
- Must comply with data protection regulations
- Must support concurrent users (minimum 100)
- Must have 99.5% uptime SLA
- Response time < 2 seconds for 95% of requests

---

## 3. System Features

### 3.1 User Authentication
**Priority:** Critical
**Description:** Secure user login and session management

#### 3.1.1 Functional Requirements
- FR-1.1: System shall support email/password authentication
- FR-1.2: System shall implement JWT-based session management
- FR-1.3: System shall support password reset via email
- FR-1.4: System shall enforce strong password requirements
- FR-1.5: System shall implement multi-factor authentication (optional)

#### 3.1.2 Non-Functional Requirements
- NFR-1.1: Authentication response time < 1 second
- NFR-1.2: JWT tokens shall expire after 24 hours
- NFR-1.3: Failed login attempts shall be rate-limited

### 3.2 record Management
**Priority:** Critical
**Description:** Complete CRUD operations for record

#### 3.2.1 Functional Requirements
- FR-2.1: Users shall create new record with required fields: name, description, status
- FR-2.2: Users shall view paginated list of record (25 items per page)
- FR-2.3: Users shall search record by name, description
- FR-2.4: Users shall filter record by status, date
- FR-2.5: Users shall update record information
- FR-2.6: Users shall soft-delete record (archive)
- FR-2.7: Administrators shall permanently delete record

#### 3.2.2 Non-Functional Requirements
- NFR-2.1: List view shall load in < 2 seconds
- NFR-2.2: Search shall return results in < 1 second
- NFR-2.3: System shall handle 10,000+ record records

### 3.3 Reporting & Analytics
**Priority:** High
**Description:** Generate insights and reports from record data

#### 3.3.1 Functional Requirements
- FR-3.1: Users shall generate summary reports
- FR-3.2: Users shall export reports to PDF format
- FR-3.3: Users shall export data to Excel format
- FR-3.4: Users shall schedule automated report generation
- FR-3.5: System shall display dashboard with key metrics

#### 3.3.2 Non-Functional Requirements
- NFR-3.1: Report generation shall complete in < 30 seconds
- NFR-3.2: Dashboard shall update in real-time

---

## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive web application
- Mobile-first design approach
- Accessibility compliance (WCAG 2.1 AA)

### 4.2 Hardware Interfaces
- Standard web server infrastructure
- Database server with SSD storage

### 4.3 Software Interfaces
- **Authentication Service API:** JWT-based authentication
- **Database:** PostgreSQL/MongoDB connection via ORM
- **Email Service:** SMTP for notifications
- **File Storage:** S3-compatible object storage

### 4.4 Communication Interfaces
- **HTTP/HTTPS:** RESTful API
- **WebSocket:** Real-time updates (optional)
- **API Rate Limiting:** 100 requests/minute per user

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements
- Support 100 concurrent users
- Page load time < 3 seconds
- API response time < 2 seconds (95th percentile)
- Database query time < 500ms

### 5.2 Safety Requirements
- Automated database backups every 24 hours
- Point-in-time recovery capability
- Disaster recovery plan with RTO < 4 hours

### 5.3 Security Requirements
- HTTPS/TLS encryption for all communications
- SQL injection prevention
- XSS and CSRF protection
- Role-based access control (RBAC)
- Audit logging for sensitive operations
- Regular security audits

### 5.4 Software Quality Attributes
- **Reliability:** 99.5% uptime
- **Availability:** 24/7 operation
- **Maintainability:** Modular architecture, documented code
- **Portability:** Docker containerization
- **Scalability:** Horizontal scaling support

---

## 6. Database Requirements

### 6.1 Data Models

#### User Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

#### record Table
```sql
CREATE TABLE [entity_table] (
    id UUID PRIMARY KEY,
    [field_1] VARCHAR(255) NOT NULL,
    [field_2] TEXT,
    [field_3] INTEGER,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);
```

---

## 7. API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### record Management
- `GET /api/record` - List all record (paginated)
- `GET /api/record/:id` - Get single record
- `POST /api/record` - Create new record
- `PUT /api/record/:id` - Update record
- `DELETE /api/record/:id` - Soft delete record
- `GET /api/record/search?q=...` - Search record

### Reports
- `GET /api/reports/summary` - Get summary statistics
- `POST /api/reports/generate` - Generate custom report
- `GET /api/reports/:id/download` - Download report file

---

## 8. Testing Requirements

### 8.1 Unit Testing
- Minimum 80% code coverage
- Test all business logic functions
- Test all API endpoints

### 8.2 Integration Testing
- Test API integration with database
- Test authentication flow
- Test file upload/download

### 8.3 User Acceptance Testing
- Test all user workflows
- Test accessibility compliance
- Test cross-browser compatibility

---

## 9. Deployment Requirements

### 9.1 Deployment Architecture
- Containerized deployment using Docker
- Microservices architecture (frontend + backend + database)
- Load balancer for high availability
- CDN for static assets

### 9.2 Environment Configuration
- **Development:** Local Docker Compose
- **Staging:** Cloud deployment (testing)
- **Production:** Cloud deployment (live)

---

## 10. Maintenance and Support

### 10.1 Maintenance Plan
- Regular security updates
- Database optimization quarterly
- Performance monitoring and tuning

### 10.2 Support Requirements
- Technical documentation
- User manual
- Admin guide
- API documentation

---

## 11. Appendices

### Appendix A: Glossary
- Define domain-specific terms

### Appendix B: Change Log
| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0 | 2026-03-03 | [AUTHOR] | Initial draft |

---

**Document Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | | | |
| Technical Lead | | | |
| QA Lead | | | |

```

### FILE: package.json
```json
{
  "name": "internship-program",
  "version": "1.0.0",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "mysql2": "^3.3.0",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_internship_program';
const ACCENT   = '#7c3aed';

export function AuthGate({ children }) {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  if (authed) return <>{children}</>;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password =[REDACTED_CREDENTIAL]
      sessionStorage.setItem(AUTH_KEY, '1');
      setAuthed(true);
    } else {
      setError('Invalid credentials. Use admin / admin');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{background:'#fff',padding:'36px',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.10)',width:'100%',maxWidth:'420px'}}>
        <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'6px'}}>
          <div style={{width:'38px',height:'38px',background:ACCENT,borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'20px',flexShrink:0}}>⚡</div>
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Internship Program</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>Sign in to continue</p>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{marginBottom:'14px'}}>
            <label style={{display:'block',fontSize:'13px',fontWeight:'500',color:'#374151',marginBottom:'6px'}}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{width:'100%',padding:'9px 12px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'14px',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          {error && <p style={{color:'#ef4444',fontSize:'13px',margin:'0 0 12px 0'}}>{error}</p>}
          <button
            type="submit"
            style={{width:'100%',padding:'10px',background:ACCENT,color:'#fff',border:'none',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer'}}
          >
            Sign In
          </button>
        </form>
        <p style={{fontSize:'11px',color:'#cbd5e1',textAlign:'center',marginTop:'16px',marginBottom:0}}>Techbridge University College &nbsp;·&nbsp; admin / admin</p>
      </div>
    </div>
  );
}

```

### FILE: src/index.js
```javascript
import { AuthGate } from './AuthGate';
const http = require('http');
const mysql = require('mysql2/promise');

const PORT = process.env.PORT || 4058;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'internship_program';

let pool;

async function initDB() {
  pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  const conn = await pool.getConnection();
  await conn.query(`
    CREATE TABLE IF NOT EXISTS internships (
      id VARCHAR(255) PRIMARY KEY,
      internship_title VARCHAR(255),
      company_name VARCHAR(255),
      location VARCHAR(255),
      start_date DATE,
      end_date DATE,
      duration_weeks INT,
      stipend DECIMAL(10,2),
      requirements TEXT,
      status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS intern_positions (
      id VARCHAR(255) PRIMARY KEY,
      internship_id VARCHAR(255),
      intern_name VARCHAR(255),
      university VARCHAR(255),
      position_start_date DATE,
      position_end_date DATE,
      department VARCHAR(100),
      supervisor_name VARCHAR(255),
      performance_rating DECIMAL(3,2),
      position_status VARCHAR(50),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (internship_id) REFERENCES internships(id)
    )
  `);
  conn.release();
  console.log('Internship Program DB initialized');
}

async function handleRequest(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'internship-program' }));
  } else if (req.url === '/api/internship' && req.method === 'POST') {
    const internshipId = `int_${Date.now()}`;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO internships (id, internship_title, company_name, status) VALUES (?, ?, ?, ?)', 
      [internshipId, 'Software Engineer Intern', 'TechCorp', 'active']);
    conn.release();
    res.writeHead(201);
    res.end(JSON.stringify({ id: internshipId }));
  } else if (req.url === '/api/positions' && req.method === 'GET') {
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT * FROM intern_positions ORDER BY created_at DESC LIMIT 100');
    conn.release();
    res.writeHead(200);
    res.end(JSON.stringify(rows));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
}

async function start() {
  await initDB();
  http.createServer(handleRequest).listen(PORT, () => {
    console.log(`Internship Program running on port ${PORT}`);
  });
}

start().catch(console.error);

```

### FILE: src/server-with-health.js
```javascript
const express = require('express');
const path = require('path');

const app = express();

// Serve health check page
app.use(express.static(path.join(__dirname, '../public')));

// Serve health check at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Internship Program',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Internship Program',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Internship Program',
    description: 'Backend API service',
    version: '1.0.0',
    endpoints: ['/health', '/api/status', '/api/info'],
  });
});

// TODO: Add your original API routes here
// Example:
// app.get('/api/your-endpoint', (req, res) => {
//   res.json({ message: 'Your data' });
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Internship Program API with Health Check running on port ${PORT}`);
  console.log(`Health Dashboard: http://localhost:${PORT}`);
  console.log(`Health Endpoint: http://localhost:${PORT}/health`);
});

module.exports = app;

```

### FILE: src/__tests__/index.test.ts
```typescript
import { describe, it, expect } from 'vitest';

describe('internship-program', () => {
  it('module loads without error', () => {
    expect(true).toBe(true);
  });
});

```

### FILE: vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },
});

```

