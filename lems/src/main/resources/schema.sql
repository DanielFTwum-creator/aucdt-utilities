-- LEMS production schema — applied manually to the lems database on the server.
-- Dev profile uses ddl-auto:update (H2) and never runs this file.

CREATE DATABASE IF NOT EXISTS lems;
USE lems;

-- Programmes Table
CREATE TABLE IF NOT EXISTS programmes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(50),
    description TEXT
);

-- Lecturers Table
CREATE TABLE IF NOT EXISTS lecturers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department VARCHAR(100)
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    description TEXT,
    semester INT,
    programme_id BIGINT NOT NULL,
    FOREIGN KEY (programme_id) REFERENCES programmes(id) ON DELETE CASCADE
);

-- Course_Lecturers Junction Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS course_lecturers (
    course_id BIGINT NOT NULL,
    lecturer_id BIGINT NOT NULL,
    PRIMARY KEY (course_id, lecturer_id),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE
);

-- Lecturer_Evaluations Table
CREATE TABLE IF NOT EXISTS lecturer_evaluations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    student_feedback TEXT,
    semester INT,
    recommend VARCHAR(20),
    dedupe_hash VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Evaluation_Ratings Table
CREATE TABLE IF NOT EXISTS evaluation_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    evaluation_id BIGINT NOT NULL,
    criteria_number INT NOT NULL,
    criteria_name VARCHAR(255),
    rating INT NOT NULL,
    section VARCHAR(100),
    FOREIGN KEY (evaluation_id) REFERENCES lecturer_evaluations(id) ON DELETE CASCADE
);

-- Audit_Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_course_programme ON courses(programme_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_lecturer ON lecturer_evaluations(lecturer_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_course ON lecturer_evaluations(course_id);
CREATE INDEX IF NOT EXISTS idx_rating_evaluation ON evaluation_ratings(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_logs(created_at);
