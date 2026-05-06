# Database Schema Guide
## Lecturer Assessment & Evaluation Portal

This document provides the recommended MySQL database schemas required to support the data persistence needs of the Lecturer Assessment & Evaluation Portal.

The schemas are designed using relational database best practices, including normalization to reduce data redundancy and foreign key constraints to ensure data integrity.

### Design Choices
-   **Engine & Character Set:** All tables use the `InnoDB` engine for transaction support (ACID compliance) and `utf8mb4` for full Unicode compatibility.
-   **Primary Keys:** `VARCHAR` is used for most primary keys (`id` fields) to align with the string-based IDs used in the application's data model.
-   **Foreign Keys:** Constraints are used to link related tables (e.g., an evaluation must link to a valid course and lecturer). `ON DELETE RESTRICT` is used on core entities to prevent the accidental deletion of a lecturer or programme if they have associated data. `ON DELETE CASCADE` is used on junction and detail tables, so that deleting a primary record (e.g., an evaluation) also cleans up its associated ratings.
-   **Many-to-Many Relationship:** A junction table, `Course_Lecturers`, correctly models the relationship where one course can have multiple lecturers and one lecturer can teach multiple courses.
-   **Ratings Normalization:** Individual ratings are stored in a separate `Evaluation_Ratings` table rather than in a single JSON column. This approach is more efficient for querying, aggregation, and analysis of specific criteria.
-   **Indexes:** Indexes are added to all foreign key columns to ensure optimal query performance when joining tables.

---

### SQL `CREATE TABLE` Statements

#### 1. Core Entities (Programmes, Lecturers, Courses)

These tables store the foundational curriculum data.

```sql
-- Represents an academic programme (e.g., B.Tech Digital Media)
CREATE TABLE Programmes (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Represents a lecturer
CREATE TABLE Lecturers (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Represents a course, linked to a single programme
CREATE TABLE Courses (
    id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    programme_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    KEY idx_programme_id (programme_id),
    CONSTRAINT fk_course_programme
        FOREIGN KEY (programme_id) REFERENCES Programmes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 2. Junction Table (Course-Lecturer Relationship)

This table models the many-to-many relationship between courses and lecturers.

```sql
-- Links courses to the lecturers who teach them
CREATE TABLE Course_Lecturers (
    course_id VARCHAR(50) NOT NULL,
    lecturer_id VARCHAR(50) NOT NULL,
    PRIMARY KEY (course_id, lecturer_id),
    KEY idx_lecturer_id (lecturer_id),
    CONSTRAINT fk_cl_course
        FOREIGN KEY (course_id) REFERENCES Courses(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cl_lecturer
        FOREIGN KEY (lecturer_id) REFERENCES Lecturers(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

#### 3. Evaluation Data

These tables store the actual assessment submissions.

```sql
-- The main table for a single evaluation submission
CREATE TABLE Lecturer_Evaluations (
    id VARCHAR(50) NOT NULL,
    programme_id VARCHAR(50) NOT NULL,
    lecturer_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    semester TINYINT UNSIGNED NOT NULL,
    recommend ENUM('Recommend', 'Not Recommend', 'Neutral') NOT NULL DEFAULT 'Neutral',
    comment TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_programme_id_eval (programme_id),
    KEY idx_lecturer_id_eval (lecturer_id),
    KEY idx_course_id_eval (course_id),
    CONSTRAINT fk_eval_programme
        FOREIGN KEY (programme_id) REFERENCES Programmes(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_eval_lecturer
        FOREIGN KEY (lecturer_id) REFERENCES Lecturers(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_eval_course
        FOREIGN KEY (course_id) REFERENCES Courses(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Stores the individual rating for each criterion within an evaluation
CREATE TABLE Evaluation_Ratings (
    evaluation_id VARCHAR(50) NOT NULL,
    criterion_id VARCHAR(10) NOT NULL, -- Corresponds to keys in `assessmentCriteria`
    rating TINYINT UNSIGNED NOT NULL,
    PRIMARY KEY (evaluation_id, criterion_id),
    CONSTRAINT fk_rating_evaluation
        FOREIGN KEY (evaluation_id) REFERENCES Lecturer_Evaluations(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Note: The 20 official assessment criteria are defined in the application's code (`types.ts`) and are not stored in the database in this schema. For a more extensible system, an `Assessment_Criteria` table could be created, and `Evaluation_Ratings.criterion_id` could be a foreign key to it.*


#### 4. Audit Log Data

This table stores the system's audit trail.

```sql
-- Logs important system events like curriculum updates and submissions
CREATE TABLE Audit_Logs (
    id VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    event VARCHAR(255) NOT NULL,
    status ENUM('Success', 'Failure', 'Info') NOT NULL,
    details TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```