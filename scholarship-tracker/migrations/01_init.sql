CREATE TABLE IF NOT EXISTS scholarships (
  id VARCHAR(255) PRIMARY KEY,
  scholarship_name VARCHAR(255),
  award_amount DECIMAL(10,2),
  eligibility_criteria TEXT,
  deadline_date DATE,
  provider VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_provider (provider),
  INDEX idx_deadline (deadline_date)
);

CREATE TABLE IF NOT EXISTS scholarship_applications (
  id VARCHAR(255) PRIMARY KEY,
  scholarship_id VARCHAR(255),
  applicant_name VARCHAR(255),
  gpa DECIMAL(3,2),
  application_date DATETIME,
  approval_status VARCHAR(50),
  amount_awarded DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (scholarship_id) REFERENCES scholarships(id),
  INDEX idx_scholarship (scholarship_id),
  INDEX idx_status (approval_status)
);

INSERT INTO scholarships (id, scholarship_name, award_amount, provider, deadline_date, status) VALUES
('sch_demo_001', 'Merit Scholarship', 5000.00, 'AUCDT', '2024-12-31', 'active');

INSERT INTO scholarship_applications (id, scholarship_id, applicant_name, gpa, application_date, approval_status) VALUES
('app_demo_001', 'sch_demo_001', 'Student One', 3.8, '2024-02-10 09:00:00', 'pending');
