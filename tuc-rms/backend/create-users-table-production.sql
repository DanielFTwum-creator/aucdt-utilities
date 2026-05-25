-- Create tuc_rms_users table in production database
CREATE TABLE IF NOT EXISTS tuc_rms_users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('registrar','qa_officer','lecturer') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  staff_id VARCHAR(50) UNIQUE,
  department VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert TUC RMS staff credentials
-- Password: Admin@123 = $2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO
INSERT INTO tuc_rms_users (full_name, email, role, password_hash, is_active, staff_id, department) VALUES
('Dr. Andrew Richard Owusu Addo', 'registrar@techbridge.edu.gh', 'registrar', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'REG001', 'Registrar Office'),
('Mrs. Abena Mensah', 'qa@techbridge.edu.gh', 'qa_officer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'QA001', 'Quality Assurance'),
('Mr. Benjamin Asante Bucha', 'buchag@techbridge.edu.gh', 'lecturer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'LEC001', 'Department of Computing'),
('Dr. Grace Acheampong', 'grace.acheampong@techbridge.edu.gh', 'lecturer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'LEC002', 'Department of Sciences'),
('Prof. Samuel Kwame Boateng', 's.boateng@techbridge.edu.gh', 'registrar', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'REG002', 'Registrar Office');
