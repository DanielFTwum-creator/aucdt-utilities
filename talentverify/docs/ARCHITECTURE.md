# System Architecture

## Overview
TalentVerify is a modern web application built with React, Express, and SQLite. It uses a hybrid architecture with a client-side SPA and a lightweight backend API.

## Component Diagram

```mermaid
graph TD
    Client[Client Browser] -->|HTTP/JSON| Server[Express Server]
    Server -->|SQL| DB[(SQLite Database)]
    Server -->|API| Gemini[Google Gemini API]
    
    subgraph Frontend [React SPA]
        Auth[Auth Context]
        Router[React Router]
        Pages[Pages]
        Components[Components]
    end
    
    subgraph Backend [Node.js]
        API[API Routes]
        Services[Services]
        Middleware[Middleware]
    end
    
    Client --> Frontend
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Client
    participant API
    participant DB
    participant AI
    
    User->>Client: Submit Application
    Client->>API: POST /api/applications
    API->>AI: Analyze Responses
    AI-->>API: Analysis Results
    API->>DB: Save Application & Score
    DB-->>API: Confirmation
    API-->>Client: Success Response
    Client-->>User: Show Confirmation
```

## Security Model

- **Authentication**: Role-based (Admin, Recruiter, Candidate).
- **Authorization**: Protected Routes wrapper in React + API middleware.
- **Audit**: All critical actions logged to `audit_logs` table.
