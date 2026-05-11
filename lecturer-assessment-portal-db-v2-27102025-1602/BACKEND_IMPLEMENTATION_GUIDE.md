# Backend Implementation Guide (Java Spring Boot)
## Lecturer Assessment & Evaluation Portal (LEMS)

This document provides a detailed guide for developers tasked with building the Java Spring Boot middle tier for the LEMS application.

---

### 1. Project Setup & Dependencies

It is recommended to use the [Spring Initializr](https://start.spring.io/) to bootstrap the project with the following configuration:

-   **Project:** Maven
-   **Language:** Java
-   **Spring Boot:** 3.2.x or later
-   **Packaging:** Jar
-   **Java:** 17 or later

**Key Dependencies:**
-   **Spring Web:** For building RESTful APIs (`spring-boot-starter-web`).
-   **Spring Data JPA:** To persist data in SQL stores with JPA (`spring-boot-starter-data-jpa`).
-   **MySQL Driver:** The JDBC driver for MySQL (`mysql-connector-j`).
-   **Spring Security:** To secure the admin endpoints (`spring-boot-starter-security`).
-   **Validation:** For request data validation (`spring-boot-starter-validation`).
-   **Lombok:** (Optional) To reduce boilerplate code for getters, setters, etc.

#### `pom.xml` (Example)
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <!-- Add other dependencies as needed -->
</dependencies>
```

---

### 2. Configuration (`application.properties`)

The application's configuration should be managed in `src/main/resources/application.properties`. For production, use environment variables to override these settings.

```properties
# Server Configuration
server.port=8080

# Database Connection
spring.datasource.url=jdbc:mysql://localhost:3306/lems
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
spring.jpa.hibernate.ddl-auto=update # Use 'validate' in production

# API Configuration
# This is a custom property you'll need to create a @ConfigurationProperties class for.
gemini.api.key=YOUR_GOOGLE_GEMINI_API_KEY_HERE
aucdt.email.api.url=https://portal.aucdt.edu.gh/aucdt-dev/emailEnquiry

# Security (for admin endpoints)
# A more robust solution like JWT is recommended for a real production app.
# For now, Basic Auth can be configured.
spring.security.user.name=admin
spring.security.user.password=admin123
```

---

### 3. Project Structure

A standard, domain-driven structure is recommended:

```
com.aucdt.lems
├── config        // SecurityConfig, AppConfig, etc.
├── controller    // REST API controllers (e.g., EvaluationController)
├── dto           // Data Transfer Objects for API requests/responses
├── entity        // JPA entities mirroring the database schema
├── exception     // Custom exception classes and global handler
├── repository    // Spring Data JPA repositories (e.g., EvaluationRepository)
└── service       // Business logic (e.g., EvaluationService, GeminiService)
```

---

### 4. JPA Entity Design

Translate the database schema into JPA entities.

**Example: `LecturerEvaluation.java`**
```java
@Entity
@Table(name = "Lecturer_Evaluations")
@Data // Lombok annotation
public class LecturerEvaluation {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "programme_id", nullable = false)
    private Programme programme;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lecturer_id", nullable = false)
    private Lecturer lecturer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    private int semester;

    @Enumerated(EnumType.STRING)
    private Recommendation recommend;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private Instant timestamp;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EvaluationRating> ratings = new ArrayList<>();
}
```

**Example: `EvaluationRating.java`**
```java
@Entity
@Table(name = "Evaluation_Ratings")
@Data
public class EvaluationRating {

    @EmbeddedId
    private EvaluationRatingId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("evaluationId")
    private LecturerEvaluation evaluation;

    private int rating;

    // The composite key class
    @Embeddable
    @Data
    public static class EvaluationRatingId implements Serializable {
        private String evaluationId;
        private String criterionId;
    }
}
```
Create similar entities for `Programme`, `Lecturer`, `Course`, and `AuditLog`, including `@ManyToMany` for the `Course` <-> `Lecturer` relationship.

---

### 5. API Endpoint Contract

This defines the API that the React frontend will consume. All endpoints should be prefixed with `/api/v1`.

#### 5.1 Curriculum Endpoints
-   **`GET /curriculum/all`**: Fetches all programmes, courses, and lecturers in a single payload.
    -   **Response:** `200 OK` with a JSON body:
        ```json
        {
          "programmes": [ { "id": "dmcd_btech", "name": "..." } ],
          "courses": [ { "id": "aucdt_115", "name": "...", "programmeId": "...", "lecturerIds": ["addo"] } ],
          "lecturers": [ { "id": "addo", "name": "Dr. Addo" } ]
        }
        ```

#### 5.2 Evaluation Endpoints
-   **`POST /evaluations`**: Submits a new student evaluation.
    -   **Request Body:**
        ```json
        {
          "programmeId": "dmcd_btech",
          "lecturerId": "addo",
          "courseId": "aucdt_115",
          "semester": 1,
          "ratings": { "1": 5, "2": 4, ... },
          "recommend": "Recommend",
          "comment": "Great course!"
        }
        ```
    -   **Action:** The service layer should save the evaluation and its ratings to the database. It should also trigger the email notification via the AUCDT Email API and create an audit log entry.
    -   **Response:** `201 Created`.

#### 5.3 Admin Endpoints (Secured)
-   **`GET /admin/dashboard-stats`**: Fetches all data needed for the admin dashboard views.
    -   **Response:** `200 OK` with a comprehensive JSON payload containing `statistics`, `programmeAnalytics`, `lecturerSummaries`, `evaluations`, and `auditLogs`.

-   **`POST /admin/curriculum/upload`**: Uploads a new curriculum PDF.
    -   **Request:** `multipart/form-data` with the PDF file.
    -   **Action:**
        1.  The service layer receives the file.
        2.  It calls a `GeminiService` to send the file to the Google Gemini API.
        3.  It validates and parses the JSON response from Gemini.
        4.  It performs a transactional database update: delete all old curriculum and evaluations, then insert the new data.
        5.  Creates an audit log for success or failure.
    -   **Response:** `200 OK` on success, or an appropriate `4xx/5xx` error on failure.

#### 5.4 Authentication
-   **`POST /login`**: A simple endpoint for the frontend to check the admin password. (For a production system, implement JWT or session-based authentication with Spring Security).
    -   **Request:** `{"password": "admin123"}`
    -   **Response:** `200 OK` on success, `401 Unauthorized` on failure.
