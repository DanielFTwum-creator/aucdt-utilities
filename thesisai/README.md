# ThesisAI - AI-Powered Thesis Assessment Platform

**Version:** 1.0.0  
**Organization:** AsanSka University College of Design and Technology (AUCDT)  
**License:** MIT

---

## 🎓 Executive Summary

ThesisAI is a production-ready, full-stack web application that leverages Claude AI to provide comprehensive thesis and research proposal assessment. Built with industry best practices, the platform helps students, supervisors, and academic reviewers improve thesis quality through AI-powered feedback.

### Key Features

- ✅ **AI-Powered Analysis** - Comprehensive thesis evaluation using Claude Sonnet 4
- 📊 **Multi-Dimensional Scoring** - Structure, argumentation, methodology, writing quality, and examinability
- 💬 **Detailed Feedback** - Section-by-section analysis with actionable recommendations
- 🎯 **Viva Preparation** - AI-predicted examination questions
- 📈 **Progress Tracking** - Version control and improvement monitoring
- 🤝 **Collaboration Tools** - Supervisor-student interaction features
- 🔐 **Secure & Scalable** - JWT authentication, Docker containerization

---

## 🏗️ Architecture

### Technology Stack

**Frontend:**
- React 18.2 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Router (Navigation)
- Axios (HTTP client)
- Lucide React (Icons)
- Framer Motion (Animations)

**Backend:**
- Java 17 + Spring Boot 3.2
- Spring Security + JWT
- Spring Data JPA
- MySQL 8.0
- Claude AI API integration
- Apache POI (DOCX processing)
- PDFBox (PDF processing)

**Infrastructure:**
- Docker & Docker Compose
- Ubuntu 24.04 LTS
- Nginx (Reverse proxy)
- Maven (Build tool)

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Load Balancer                          │
└─────────────┬───────────────────────────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───┴────────┐    ┌──────┴──────┐
│  Frontend  │    │   Backend   │
│  (React)   │◄───┤ (Spring Boot│
│  Port 3000 │    │  Port 8080) │
└────────────┘    └──────┬──────┘
                         │
                  ┌──────┴──────┬─────────────┐
                  │             │             │
            ┌─────┴──────┐ ┌───┴────┐  ┌────┴────────┐
            │   MySQL    │ │ Claude │  │   Upload    │
            │  Database  │ │   AI   │  │   Storage   │
            └────────────┘ └────────┘  └─────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop 20.10+
- Docker Compose 2.0+
- Claude API Key (from Anthropic)
- 8GB RAM minimum
- 10GB free disk space

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aucdt/thesisai.git
   cd thesisai
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your CLAUDE_API_KEY
   ```

3. **Build and start the application:**
   ```bash
   docker-compose up --build -d
   ```

4. **Initialize the database:**
   ```bash
   docker exec -i thesisai-mysql mysql -u root -proot_password_2025 thesisai < database/schema.sql
   ```

5. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - MySQL: localhost:3306

### Default Credentials

```
Email: admin@aucdt.edu.gh
Password: Admin@123
```

---

## 📖 User Guide

### For Students

1. **Upload Your Thesis:**
   - Navigate to Dashboard → Upload
   - Drag and drop your document (PDF, DOCX, TXT, MD)
   - Add title and document type
   - Click "Upload and Analyze"

2. **View Analysis:**
   - Analysis typically takes 2-5 minutes
   - View comprehensive scores and feedback
   - Read section-by-section recommendations
   - Review predicted viva questions

3. **Improve Your Thesis:**
   - Address identified weaknesses
   - Implement suggestions
   - Upload revised version
   - Track improvement over time

### For Supervisors

1. **Access Student Documents:**
   - View assigned students' submissions
   - Review AI analysis results
   - Add comments and annotations
   - Approve or request revisions

2. **Collaborate:**
   - Comment on specific sections
   - Share feedback sessions
   - Track student progress
   - Monitor revision history

---

## 🔧 Development

### Local Development Setup

**Backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
pnpm install
pnpm dev
```

### Project Structure

```
thesisai/
├── backend/
│   ├── src/main/java/edu/gh/aucdt/thesisai/
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/          # Business logic
│   │   ├── model/            # JPA entities
│   │   ├── repository/       # Data access
│   │   ├── security/         # Authentication
│   │   └── config/           # Configuration
│   ├── pom.xml              # Maven dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilities
│   ├── package.json
│   └── Dockerfile
├── database/
│   └── schema.sql           # Database schema
├── docker-compose.yml       # Container orchestration
└── README.md
```

### API Endpoints

**Authentication:**
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout

**Documents:**
- `POST /api/v1/documents/upload` - Upload document
- `GET /api/v1/documents` - List user documents
- `GET /api/v1/documents/{id}` - Get document details
- `DELETE /api/v1/documents/{id}` - Delete document
- `POST /api/v1/documents/{id}/analyze` - Start analysis

**Analysis:**
- `GET /api/v1/analysis/{id}` - Get analysis results
- `GET /api/v1/analysis/{id}/feedback` - Get feedback reports

### Database Schema

Key tables:
- `users` - User accounts and roles
- `documents` - Uploaded thesis documents
- `analyses` - AI analysis results
- `feedback_reports` - Detailed feedback items
- `viva_questions` - Predicted examination questions
- `comments` - Collaboration comments
- `supervisions` - Supervisor-student relationships

---

## 🎨 Design System

### Color Palette

- **Navy Blue** (#1e3a5f) - Primary brand color, headers
- **Amber** (#f59e0b) - Accent color, CTAs
- **Blue** (#2563eb) - Secondary actions
- **Slate** (#475569) - Body text

### Typography

- **Headings:** Crimson Text (Serif) - Academic gravitas
- **Body:** Inter (Sans-serif) - Readability

### Design Principles

1. **Academic Excellence** - Professional, trustworthy interface
2. **Clarity First** - Clear hierarchy and information architecture
3. **Purposeful Motion** - Smooth transitions and micro-interactions
4. **Generous Whitespace** - Breathing room for content
5. **Accessibility** - WCAG 2.1 AA compliant

---

## 🔐 Security

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Secure password hashing (BCrypt)
- Session management
- CORS protection

### Data Protection

- Encrypted database connections
- Secure file storage
- Input validation and sanitization
- SQL injection prevention
- XSS protection

### API Security

- Rate limiting
- Request validation
- Error handling
- Audit logging

---

## 📊 Performance

### Optimization Strategies

**Frontend:**
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Minification

**Backend:**
- Database indexing
- Query optimization
- Connection pooling
- Async processing
- Caching (Redis integration ready)

### Performance Metrics

- Page load time: < 2 seconds
- API response time: < 500ms (excluding AI analysis)
- AI analysis time: 2-5 minutes (100-page document)
- Concurrent users: 100+ (scalable to 1000+)

---

## 🧪 Testing

### Test Strategy

**Unit Tests:**
```bash
# Backend
cd backend
mvn test

# Frontend
cd frontend
pnpm test
```

**Integration Tests:**
```bash
docker-compose -f docker-compose.test.yml up
```

**E2E Tests:**
```bash
pnpm test:e2e
```

---

## 🚢 Deployment

### Production Deployment

1. **Configure environment:**
   ```bash
   cp .env.production .env
   # Set production values
   ```

2. **Build Docker images:**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

3. **Deploy:**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. **Set up SSL/TLS:**
   ```bash
   # Configure Let's Encrypt
   certbot --nginx -d thesisai.aucdt.edu.gh
   ```

### Scaling

**Horizontal Scaling:**
```bash
docker-compose up --scale backend=3
```

**Load Balancing:**
- Nginx reverse proxy
- Round-robin distribution
- Health checks

---

## 📈 Monitoring & Maintenance

### Health Checks

```bash
# Backend health
curl http://localhost:8080/actuator/health

# Database health
docker exec thesisai-mysql mysqladmin ping
```

### Logs

```bash
# View all logs
docker-compose logs -f

# Backend logs
docker logs thesisai-backend -f

# Frontend logs
docker logs thesisai-frontend -f
```

### Backup

```bash
# Database backup
docker exec thesisai-mysql mysqldump -u root -p thesisai > backup.sql

# Restore
docker exec -i thesisai-mysql mysql -u root -p thesisai < backup.sql
```

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Standards

- **Java:** Google Java Style Guide
- **TypeScript:** Airbnb TypeScript Style Guide
- **Commits:** Conventional Commits specification

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details

---

## 📧 Support

- **Email:** support@ai.aucdt.edu.gh
- **Documentation:** https://docs.thesisai.aucdt.edu.gh
- **Issue Tracker:** https://github.com/aucdt/thesisai/issues

---

## 🙏 Acknowledgments

- AsanSka University College of Design and Technology
- Anthropic (Claude AI)
- Open source community

---

**Built with ❤️ by AUCDT Development Team**

Last updated: November 23, 2025
