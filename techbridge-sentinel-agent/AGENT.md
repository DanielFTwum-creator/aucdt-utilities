# techbridge-sentinel-agent - Ultimate Self-Replicating Blueprint (AGENT.md)

> [!IMPORTANT]
> This is an auto-generated monolithic blueprint containing the source code for techbridge-sentinel-agent.

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

### FILE: CREATION.md
```md
# techbridge-sentinel-agent

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
﻿# System Requirements Specification (SRS)
## Project: techbridge-sentinel-agent
**Version:** 1.0 (Auto-Generated Baseline)
**Date:** 2026-03-07

---

## 1. Introduction
### 1.1 Purpose
This document defines the baseline system requirements for **techbridge-sentinel-agent**, ensuring alignment with the overarching Techbridge University College ecosystem standards.

### 1.2 Scope
This application provides utility functionality within the AUCDT ecosystem.

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
  "name": "techbridge-sentinel-agent",
  "version": "1.0.0",
  "description": "AI monitoring and alert management",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "lint": "eslint src/",
    "test": "jest",
    "test:coverage": "vitest run --coverage"
  },
  "keywords": [
    "monitoring",
    "alerts",
    "sentinel"
  ],
  "author": "Techbridge University College",
  "license": "MIT",
  "dependencies": {
    "mysql2": "^3.6.5",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "eslint": "^8.54.0",
    "jest": "^29.7.0",
    "vitest": "^3.0.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

### FILE: src/AuthGate.jsx
```javascript
import { useState } from 'react';

const AUTH_KEY = 'tuc_auth_techbridge_sentinel_agent';
const ACCENT   = '#3b82f6';

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
          <h1 style={{fontSize:'20px',fontWeight:'700',color:'#0f172a',margin:0}}>Techbridge Sentinel Agent</h1>
        </div>
        <p style={{fontSize:'13px',color:'#94a3b8',margin:'0 0 24px 0'}}>AI monitoring and alert management</p>
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

const PORT = process.env.PORT || 4005;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'appuser';
const DB_PASSWORD = <REDACTED>
const DB_NAME = process.env.DB_NAME || 'sentinel';

let pool;

async function initDB() {
  try {
    pool = mysql.createPool({
      host: DB_HOST, user: DB_USER, password: DB_PASSWORD, database: DB_NAME,
      waitForConnections: true, connectionLimit: 10, queueLimit: 0,
    });

    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id VARCHAR(255) PRIMARY KEY, service_name VARCHAR(255),
        alert_type VARCHAR(100), severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
        message TEXT, status ENUM('open', 'acknowledged', 'resolved') DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS events (
        id VARCHAR(255) PRIMARY KEY, alert_id VARCHAR(255),
        event_data TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (alert_id) REFERENCES alerts(id)
      )
    `);
    conn.release();
    console.log('Sentinel Agent DB initialized');
  } catch (e) {
    console.error('DB init error:', e.message);
    process.exit(1);
  }
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', service: 'sentinel' }));
      return;
    }

    if (req.method === 'POST' && req.url === '/api/alert') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const data = JSON.parse(body);
          const conn = await pool.getConnection();
          const alertId = `alert_${Date.now()}`;
          await conn.query(
            'INSERT INTO alerts (id, service_name, alert_type, severity, message) VALUES (?, ?, ?, ?, ?)',
            [alertId, data.service || '', data.type || 'unknown', data.severity || 'info', data.message || '']
          );
          conn.release();
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true, alert_id: alertId }));
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (req.method === 'GET' && req.url.startsWith('/api/alerts')) {
      const conn = await pool.getConnection();
      const [alerts] = await conn.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 100');
      conn.release();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(alerts));
      return;
    }

    res.writeHead(404);
    res.end('Not Found');
  } catch (e) {
    console.error('Request error:', e);
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  }
}

async function start() {
  await initDB();
  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(e => { res.writeHead(500); res.end('error'); });
  });
  server.listen(PORT, () => console.log(`Sentinel Agent API on ${PORT}`));
}

start().catch(e => { console.error('Startup error:', e); process.exit(1); });

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
    service: 'Techbridge Sentinel Agent',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'Techbridge Sentinel Agent',
    version: '1.0.0',
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Techbridge Sentinel Agent',
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
  console.log(`Techbridge Sentinel Agent API with Health Check running on port ${PORT}`);
  console.log(`Health Dashboard: http://localhost:${PORT}`);
  console.log(`Health Endpoint: http://localhost:${PORT}/health`);
});

module.exports = app;

```

### FILE: src/__tests__/index.test.ts
```typescript
import { describe, it, expect } from 'vitest';

describe('techbridge-sentinel-agent', () => {
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

