CREATE TABLE IF NOT EXISTS job_postings (
  id VARCHAR(255) PRIMARY KEY,
  job_title VARCHAR(255),
  company_name VARCHAR(255),
  location VARCHAR(255),
  salary_range VARCHAR(100),
  job_description TEXT,
  posting_date DATE,
  deadline_date DATE,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_company (company_name),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS job_applications (
  id VARCHAR(255) PRIMARY KEY,
  job_posting_id VARCHAR(255),
  applicant_name VARCHAR(255),
  applicant_email VARCHAR(255),
  resume_url VARCHAR(500),
  application_date DATETIME,
  application_status VARCHAR(50),
  interview_date DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_posting_id) REFERENCES job_postings(id),
  INDEX idx_posting (job_posting_id),
  INDEX idx_status (application_status)
);

INSERT INTO job_postings (id, job_title, company_name, status) VALUES
('job_demo_001', 'Software Engineer', 'TechCorp', 'open');

INSERT INTO job_applications (id, job_posting_id, applicant_name, applicant_email, application_date, application_status) VALUES
('ja_demo_001', 'job_demo_001', 'Applicant One', 'applicant1@example.com', '2024-02-10 11:00:00', 'applied');
