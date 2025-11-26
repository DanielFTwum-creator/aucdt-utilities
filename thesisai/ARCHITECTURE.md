# ThesisAI - System Architecture Documentation

## Overview

ThesisAI is a modern, cloud-native application designed with microservices principles, containerization, and scalability in mind.

## Architecture Layers

### 1. Presentation Layer (Frontend)

**Technology:** React 18 + TypeScript + Vite

**Components:**
- `pages/` - Route-level components (Dashboard, Upload, Analysis)
- `components/` - Reusable UI components
- `services/` - API integration layer
- `hooks/` - Custom React hooks
- `utils/` - Helper functions

**State Management:**
- React Context API for global state
- Local component state for UI interactions
- React Router for navigation

**Key Features:**
- Server-side rendering ready
- Progressive Web App (PWA) capabilities
- Responsive design (mobile-first)
- Accessibility (WCAG 2.1 AA)

### 2. Application Layer (Backend)

**Technology:** Spring Boot 3.2 + Java 17

**Package Structure:**
```
edu.gh.aucdt.thesisai/
├── controller/      # REST API endpoints
├── service/         # Business logic
├── model/           # JPA entities
├── repository/      # Data access
├── dto/             # Data transfer objects
├── security/        # Authentication & authorization
├── config/          # Application configuration
└── util/            # Utility classes
```

**Design Patterns:**
- **Repository Pattern** - Data access abstraction
- **Service Layer** - Business logic separation
- **DTO Pattern** - API contract management
- **Builder Pattern** - Object construction
- **Strategy Pattern** - Algorithm encapsulation (AI analysis)

**Key Components:**

1. **ClaudeAIService**
   - Interfaces with Anthropic API
   - Handles thesis analysis requests
   - Parses AI responses
   - Error handling and retry logic

2. **AnalysisService**
   - Orchestrates analysis workflow
   - Manages async processing
   - Saves analysis results
   - Generates feedback reports

3. **DocumentService**
   - File upload handling
   - Text extraction (PDF, DOCX)
   - Document metadata management
   - Storage management

4. **SecurityService**
   - JWT token generation/validation
   - User authentication
   - Role-based access control
   - Session management

### 3. Data Layer

**Primary Database:** MySQL 8.0

**Schema Design Principles:**
- Normalized to 3NF
- Indexed for performance
- Foreign key constraints
- Soft deletes where applicable
- Audit columns (created_at, updated_at)

**Key Tables:**

1. **users**
   - User accounts and profiles
   - Role-based permissions
   - Authentication data

2. **documents**
   - Uploaded thesis files
   - Metadata and versioning
   - Status tracking

3. **analyses**
   - AI analysis results
   - Score breakdowns
   - Processing metadata

4. **feedback_reports**
   - Detailed feedback items
   - Section-specific comments
   - Severity indicators

### 4. Integration Layer

**Claude AI Integration:**
```
┌─────────────┐
│  Backend    │
│  Service    │
└──────┬──────┘
       │
       │ HTTPS
       │ POST /v1/messages
       │
┌──────▼──────┐
│  Claude AI  │
│   API       │
└─────────────┘
```

**Request Flow:**
1. Document uploaded
2. Text extracted
3. Prompt constructed
4. API call to Claude
5. Response parsed
6. Results stored
7. User notified

## Data Flow

### Document Upload & Analysis Flow

```
┌─────────┐     ┌──────────┐     ┌─────────┐     ┌─────────┐
│ Browser │────>│ Frontend │────>│ Backend │────>│  MySQL  │
└─────────┘     └──────────┘     └────┬────┘     └─────────┘
                                       │
                                       │
                                  ┌────▼────┐
                                  │ Claude  │
                                  │   AI    │
                                  └────┬────┘
                                       │
                                  ┌────▼────┐
                                  │ Results │
                                  │  Store  │
                                  └─────────┘
```

1. **Upload Phase**
   - User selects file
   - File validated (size, type)
   - Uploaded to server
   - Stored in file system
   - Record created in database

2. **Analysis Phase** (Async)
   - Text extracted from document
   - Analysis prompt constructed
   - Sent to Claude AI
   - Response received and parsed
   - Scores calculated
   - Feedback items created
   - Viva questions generated

3. **Result Phase**
   - User notified (websocket/polling)
   - Results displayed in UI
   - Available for download
   - Version tracked

## Security Architecture

### Authentication Flow

```
┌─────────┐                    ┌──────────┐
│ Browser │                    │  Backend │
└────┬────┘                    └─────┬────┘
     │                               │
     │  POST /auth/login            │
     │  {email, password}           │
     │─────────────────────────────>│
     │                               │
     │                          ┌────▼────┐
     │                          │Validate │
     │                          │  User   │
     │                          └────┬────┘
     │                               │
     │  JWT Token                    │
     │<─────────────────────────────┤
     │                               │
     │  Subsequent Requests          │
     │  Authorization: Bearer <JWT>  │
     │─────────────────────────────>│
     │                               │
```

### Authorization Model

**Role Hierarchy:**
```
ADMIN
  ├── Full system access
  ├── User management
  └── System configuration

SUPERVISOR
  ├── Assigned student documents
  ├── Analysis review
  ├── Comment and feedback
  └── Approval workflow

STUDENT
  ├── Own documents only
  ├── Upload and analyze
  └── View own results

REVIEWER
  ├── Assigned documents
  └── Read-only access
```

## Scalability Strategy

### Horizontal Scaling

**Frontend:**
- Stateless React app
- CDN distribution
- Multiple instances behind load balancer

**Backend:**
- Stateless Spring Boot services
- Multiple instances
- Session stored in Redis (future)
- Load balancer with health checks

**Database:**
- Master-slave replication
- Read replicas for queries
- Write to master only

### Vertical Scaling

- Resource limits in Docker
- Auto-scaling based on metrics
- Database connection pooling

### Caching Strategy

**Frontend:**
- Browser caching
- Service worker cache
- CDN edge caching

**Backend:**
- Query result caching
- API response caching
- Static resource caching

## Performance Optimization

### Frontend Optimization

1. **Code Splitting**
   ```typescript
   const AnalysisView = lazy(() => import('./pages/AnalysisView'));
   ```

2. **Image Optimization**
   - WebP format
   - Lazy loading
   - Responsive images

3. **Bundle Size**
   - Tree shaking
   - Minification
   - Compression (gzip/brotli)

### Backend Optimization

1. **Database Queries**
   - Indexed columns
   - Query optimization
   - Batch operations
   - Connection pooling

2. **Async Processing**
   ```java
   @Async
   public void analyzeDocument(Long documentId) {
       // Long-running task
   }
   ```

3. **API Response**
   - Pagination
   - Selective field projection
   - Compression

## Monitoring & Observability

### Metrics to Track

**Application Metrics:**
- Request rate
- Response time
- Error rate
- Active users
- Analysis queue depth

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network throughput

**Business Metrics:**
- Documents analyzed
- Average scores
- User growth
- Conversion rate

### Logging Strategy

**Log Levels:**
- ERROR: System failures
- WARN: Unusual conditions
- INFO: Business events
- DEBUG: Detailed execution

**Centralized Logging:**
- ELK Stack (future)
- Structured JSON logs
- Correlation IDs
- User context

## Disaster Recovery

### Backup Strategy

**Database:**
- Daily full backup
- Hourly incremental backup
- Point-in-time recovery
- Off-site storage

**Files:**
- Replicated storage
- Version control
- Regular backups

### Recovery Procedures

**RTO (Recovery Time Objective):** 4 hours
**RPO (Recovery Point Objective):** 1 hour

## Future Enhancements

1. **Real-time Collaboration**
   - WebSocket integration
   - Live document editing
   - Instant notifications

2. **Advanced Analytics**
   - Machine learning insights
   - Predictive scoring
   - Trend analysis

3. **Mobile Apps**
   - iOS application
   - Android application
   - React Native

4. **API Gateway**
   - Rate limiting
   - Request routing
   - API versioning

5. **Service Mesh**
   - Istio integration
   - Traffic management
   - Circuit breakers

---

**Version:** 1.0  
**Last Updated:** November 23, 2025  
**Author:** AUCDT Development Team
