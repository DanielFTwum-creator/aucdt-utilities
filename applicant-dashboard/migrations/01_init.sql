CREATE TABLE IF NOT EXISTS applicants (
  id VARCHAR(255) PRIMARY KEY,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  program_applied VARCHAR(255),
  application_date DATETIME,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(255) PRIMARY KEY,
  applicant_id VARCHAR(255),
  application_number VARCHAR(100),
  gpa DECIMAL(3,2),
  test_score INT,
  documents_submitted BOOLEAN,
  admission_decision VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (applicant_id) REFERENCES applicants(id),
  INDEX idx_applicant (applicant_id),
  INDEX idx_decision (admission_decision)
);

INSERT INTO applicants (id, full_name, email, phone, program_applied, status) VALUES
('app_001', 'Kwame Asante', 'kwame@example.com', '+233123456789', 'Computer Science', 'submitted'),
('app_002', 'Ama Osei', 'ama@example.com', '+233123456790', 'Business Administration', 'submitted'),
('app_003', 'Kofi Mensah', 'kofi@example.com', '+233123456791', 'Engineering', 'submitted');

INSERT INTO applications (id, applicant_id, application_number, gpa, test_score, documents_submitted, admission_decision) VALUES
('appl_001', 'app_001', 'APP2024001', 3.5, 85, true, 'pending'),
('appl_002', 'app_002', 'APP2024002', 3.8, 92, true, 'pending'),
('appl_003', 'app_003', 'APP2024003', 3.2, 78, true, 'pending');
