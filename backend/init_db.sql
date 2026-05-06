-- TUC Auth Database Initialization
CREATE DATABASE IF NOT EXISTS tuc_auth;
USE tuc_auth;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role ENUM('admin', 'user', 'viewer') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit Logs Table (Centralized)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    severity ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert Default Admin (Password: admin123)
-- Note: In a real scenario, use high-entropy hashes.
INSERT INTO users (username, password, email, role) 
VALUES ('admin', '$2a$10$X.J6S.F4uT4uU.vC.vC.vC.vC.vC.vC.vC.vC.vC.vC.vC.vC', 'admin@techbridge.edu.gh', 'admin')
ON DUPLICATE KEY UPDATE username=username;
