-- ThesisAI Database Schema
-- Version: 1.0
-- Database: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS thesisai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thesisai;

-- Users table with role-based access
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('STUDENT', 'SUPERVISOR', 'ADMIN', 'REVIEWER') NOT NULL DEFAULT 'STUDENT',
    student_id VARCHAR(50),
    department VARCHAR(100),
    programme VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- Documents table
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('PDF', 'DOCX', 'TXT', 'MD') NOT NULL,
    file_size BIGINT NOT NULL,
    word_count INT,
    page_count INT,
    document_type ENUM('PROPOSAL', 'THESIS', 'CHAPTER', 'OTHER') DEFAULT 'PROPOSAL',
    status ENUM('UPLOADED', 'ANALYZING', 'COMPLETED', 'FAILED') DEFAULT 'UPLOADED',
    version INT DEFAULT 1,
    parent_document_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_document_id) REFERENCES documents(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB;

-- AI Analysis table
CREATE TABLE analyses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    analysis_type VARCHAR(50) DEFAULT 'COMPREHENSIVE',
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    structure_score DECIMAL(5,2),
    argumentation_score DECIMAL(5,2),
    methodology_score DECIMAL(5,2),
    writing_quality_score DECIMAL(5,2),
    examinability_score DECIMAL(5,2),
    overall_score DECIMAL(5,2),
    processing_time INT,
    tokens_used INT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    INDEX idx_document_id (document_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Feedback reports
CREATE TABLE feedback_reports (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_id BIGINT NOT NULL,
    section VARCHAR(100) NOT NULL,
    feedback_type ENUM('STRENGTH', 'WEAKNESS', 'SUGGESTION', 'QUESTION') NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    severity ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    page_reference VARCHAR(50),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE,
    INDEX idx_analysis_id (analysis_id),
    INDEX idx_section (section)
) ENGINE=InnoDB;

-- Viva questions predictions
CREATE TABLE viva_questions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_id BIGINT NOT NULL,
    question TEXT NOT NULL,
    category VARCHAR(100),
    difficulty ENUM('EASY', 'MEDIUM', 'HARD') DEFAULT 'MEDIUM',
    suggested_preparation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (analysis_id) REFERENCES analyses(id) ON DELETE CASCADE,
    INDEX idx_analysis_id (analysis_id)
) ENGINE=InnoDB;

-- Collaboration comments
CREATE TABLE comments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    parent_comment_id BIGINT NULL,
    content TEXT NOT NULL,
    section_reference VARCHAR(100),
    is_resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    INDEX idx_document_id (document_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Supervisor-student relationships
CREATE TABLE supervisions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    supervisor_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status ENUM('ACTIVE', 'COMPLETED', 'TERMINATED') DEFAULT 'ACTIVE',
    start_date DATE NOT NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_supervision (supervisor_id, student_id),
    INDEX idx_supervisor_id (supervisor_id),
    INDEX idx_student_id (student_id)
) ENGINE=InnoDB;

-- Document sharing/permissions
CREATE TABLE document_permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    document_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    permission_type ENUM('VIEW', 'COMMENT', 'EDIT') DEFAULT 'VIEW',
    granted_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_permission (document_id, user_id),
    INDEX idx_document_id (document_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id BIGINT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_action (action)
) ENGINE=InnoDB;

-- System settings
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(50) DEFAULT 'STRING',
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB;

-- Insert default admin user (password: Admin@123)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified, is_active) 
VALUES ('admin@aucdt.edu.gh', '$2a$10$8K1p/a0dL3.L4Y8Z3LX2l.v8nKLDz7Z6P9r4J6YnKL2m3N4o5P6q7', 'System', 'Administrator', 'ADMIN', TRUE, TRUE);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('max_file_size', '10485760', 'INTEGER', 'Maximum file size in bytes (10MB)'),
('max_page_count', '500', 'INTEGER', 'Maximum pages per document'),
('analysis_timeout', '300', 'INTEGER', 'Analysis timeout in seconds'),
('supported_file_types', '["PDF","DOCX","TXT","MD"]', 'JSON', 'Supported document types'),
('claude_model', 'claude-sonnet-4-20250514', 'STRING', 'Claude AI model identifier'),
('maintenance_mode', 'false', 'BOOLEAN', 'System maintenance mode flag');
