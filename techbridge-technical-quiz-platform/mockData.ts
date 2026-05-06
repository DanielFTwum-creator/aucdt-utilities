
import { Question, QuestionType, Difficulty, QuizTemplate, TakeHomeProject } from './types';

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: QuestionType.MCQ,
    category: 'Java',
    difficulty: Difficulty.INTERMEDIATE,
    content: 'Which of the following is true about Java memory management?',
    options: [
      'The stack stores objects, and the heap stores local variables.',
      'The heap stores objects, and the stack stores local variables.',
      'Both heap and stack store objects.',
      'Garbage collection happens exclusively in the stack.'
    ],
    correctAnswer: 'The heap stores objects, and the stack stores local variables.',
    points: 10,
    tags: ['Memory', 'JVM']
  },
  {
    id: 'q2',
    type: QuestionType.CODE,
    category: 'Spring Boot',
    difficulty: Difficulty.ADVANCED,
    content: 'Write a Spring Boot controller method that handles a GET request for a specific user ID and returns a 404 if not found.',
    idealAnswer: '@GetMapping("/{id}")\npublic ResponseEntity<User> getUser(@PathVariable Long id) {\n  return repository.findById(id)\n    .map(ResponseEntity::ok)\n    .orElse(ResponseEntity.notFound().build());\n}',
    points: 25,
    tags: ['REST', 'Controllers']
  },
  {
    id: 'q3',
    type: QuestionType.SCENARIO,
    category: 'DevOps',
    difficulty: Difficulty.EXPERT,
    content: 'A production microservice is experiencing intermittent 504 Gateway Timeout errors. Walk through your debugging process.',
    idealAnswer: 'Check load balancer logs, verify pod health, check circuit breaker status, investigate database connection pool saturation...',
    points: 30,
    tags: ['SRE', 'Troubleshooting']
  }
];

export const MOCK_TAKE_HOMES: TakeHomeProject[] = [
  {
    id: 'th-easy',
    title: 'ICT Staff Registry API (Core)',
    duration: '48 Hours',
    difficulty: Difficulty.BEGINNER,
    overview: "Develop a practical Spring Boot service for the TechBridge ICT Unit to track internal staff assignments. This core assessment evaluates your ability to build a standard REST service, integrate with MariaDB, and provide a containerized environment.",
    userStories: [
      "As an ICT Admin, I can register a new staff member with their role and department.",
      "As a User, I can retrieve a list of all ICT personnel and their current status.",
      "As a System, all records must persist in a MariaDB instance and survive restarts.",
      "As a DevOps Engineer, I can use a Dockerfile to build and run the application instantly."
    ],
    technicalConstraints: [
      "Backend Framework: Spring Boot 3.x (Java 17+).",
      "Database: MariaDB (latest stable) for relational data persistence.",
      "Containerization: A multi-stage Dockerfile must be included.",
      "Persistence Layer: Use Spring Data JPA or MyBatis for database interaction.",
      "Initialization: Provide a simple SQL script or flyway migration for schema setup."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/staff", description: "Register a new ICT staff member. Body: { name, role, email }" },
      { method: "GET", path: "/api/staff", description: "Fetch all registered ICT personnel records." },
      { method: "GET", path: "/api/staff/:id", description: "Retrieve detailed record for a specific staff member." }
    ],
    databaseSchema: [
      "Table `ict_staff`: id (UUID), name (VARCHAR), role (VARCHAR), email (VARCHAR, UNIQUE), created_at (TIMESTAMP)"
    ],
    bonusTasks: [
      "Add basic field validation for email and mandatory fields.",
      "Implement a 'docker-compose.yml' that links the Spring Boot app and MariaDB."
    ],
    rubric: [
      { criterion: "MariaDB Connectivity & Persistence", weight: 45 },
      { criterion: "Dockerfile & Container Efficiency", weight: 35 },
      { criterion: "REST API Standards Compliance", weight: 20 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/onboarding-starter"
  },
  {
    id: 'th-medium',
    title: 'Advanced Campus Equipment Ledger',
    duration: '48 Hours',
    difficulty: Difficulty.INTERMEDIATE,
    overview: "Extend the basic registry into a full equipment tracking system for the ICT Unit. This project adds complexity through relational data mapping and cached lookups using Redis.",
    userStories: [
      "As a Technician, I can assign hardware assets to specific staff members.",
      "As a Manager, I can view an audit log of asset transitions (Available -> Assigned -> Repair).",
      "As a System, asset search results should be cached in Redis to minimize database load.",
      "As a DevOps Engineer, the environment must include a linked Database and Cache layer."
    ],
    technicalConstraints: [
      "Backend: Spring Boot 3.x with Spring Data Redis for caching.",
      "Database: MariaDB with optimized foreign key relationships.",
      "Infrastructure: Docker Compose required for multi-service orchestration (API + DB + Redis).",
      "Architecture: Separation of concerns between Service and Repository layers."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/assets", description: "Register a new campus asset." },
      { method: "GET", path: "/api/assets/search", description: "Search assets with Redis caching enabled." },
      { method: "PATCH", path: "/api/assets/:id/assign", description: "Update asset assignment and status." }
    ],
    databaseSchema: [
      "Table `assets`: id, serial_number, model, type, status, assigned_staff_id",
      "Table `ict_staff`: id, name, role, email",
      "Table `audit_log`: id, asset_id, action, timestamp"
    ],
    bonusTasks: [
      "Implement Spring Security with basic HTTP auth for administrative actions.",
      "Add a 'Health' dashboard showing DB and Redis connection status."
    ],
    rubric: [
      { criterion: "Redis Integration & Cache Strategy", weight: 30 },
      { criterion: "Relational Mapping & Integrity", weight: 30 },
      { criterion: "Orchestration (Docker Compose)", weight: 25 },
      { criterion: "Security Implementation", weight: 15 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/equipment-ledger-starter"
  },
  {
    id: 'th-hard',
    title: 'Distributed Institutional Performance Engine',
    duration: '72 Hours',
    difficulty: Difficulty.EXPERT,
    overview: "Build a high-performance, asynchronous ledger for processing institution-wide grade submissions and performance metrics. This Expert tier challenge evaluates advanced distributed system architecture.",
    userStories: [
      "As a Registrar, I can upload batch grade records (100k+ entries) via a single request.",
      "As a System, large batches are processed asynchronously using a task queue (RabbitMQ/Redis Streams).",
      "As an Admin, I can monitor real-time throughput metrics on a WebSocket-enabled dashboard.",
      "As a System, if a processing node fails, tasks must be automatically retried with zero data loss."
    ],
    technicalConstraints: [
      "Processing: Spring Boot with Asynchronous Event Listeners or Spring Batch.",
      "Messaging: Use RabbitMQ or Redis Streams for decoupling ingestion from processing.",
      "Persistence: MariaDB with batch-insert optimizations and transaction management.",
      "Frontend: React dashboard showing real-time processing charts (WebSockets).",
      "Resiliency: Implementation of a 'Circuit Breaker' pattern (e.g., Resilience4j)."
    ],
    apiSpecs: [
      { method: "POST", path: "/api/v1/ingest", description: "Initiate high-volume batch processing." },
      { method: "GET", path: "/api/v1/metrics/live", description: "WebSocket endpoint for live throughput data." },
      { method: "GET", path: "/api/v1/tasks/failed", description: "Retrieve records that failed processing for manual retry." }
    ],
    databaseSchema: [
      "Table `grade_batches`: id, filename, total_records, status, processed_at",
      "Table `grade_entries`: id, batch_id, student_id, grade, status, error_msg",
      "Table `metrics`: id, timestamp, records_per_second, error_rate"
    ],
    bonusTasks: [
      "Implement a distributed lock (Redlock) to ensure only one batch processor handles a file at a time.",
      "Integrate Grafana/Prometheus scraping endpoints for the orchestrator."
    ],
    rubric: [
      { criterion: "Distributed Processing & Fault Tolerance", weight: 40 },
      { criterion: "Database Ingestion Performance", weight: 30 },
      { criterion: "Real-time Observability & UX", weight: 20 },
      { criterion: "Scalability Documentation", weight: 10 }
    ],
    boilerplateUrl: "https://github.com/techbridge-ict/performance-engine-starter"
  }
];

export const MOCK_QUIZZES: QuizTemplate[] = [
  {
    id: 'quiz1',
    name: 'Full Stack Java Assessment v1',
    category: 'Technical Screen',
    timeLimit: 60,
    questions: ['q1', 'q2', 'q3'],
    passThreshold: 70
  }
];
