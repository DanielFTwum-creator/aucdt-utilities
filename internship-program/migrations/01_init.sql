CREATE TABLE IF NOT EXISTS internships (
  id VARCHAR(255) PRIMARY KEY,
  internship_title VARCHAR(255),
  company_name VARCHAR(255),
  location VARCHAR(255),
  start_date DATE,
  end_date DATE,
  duration_weeks INT,
  stipend DECIMAL(10,2),
  requirements TEXT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS intern_positions (
  id VARCHAR(255) PRIMARY KEY,
  internship_id VARCHAR(255),
  intern_name VARCHAR(255),
  university VARCHAR(255),
  position_start_date DATE,
  position_end_date DATE,
  department VARCHAR(100),
  supervisor_name VARCHAR(255),
  performance_rating DECIMAL(3,2),
  position_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (internship_id) REFERENCES internships(id)
);

INSERT INTO internships (id, internship_title, company_name, status) VALUES
('int_demo_001', 'Software Engineer Intern', 'TechCorp', 'active');

INSERT INTO intern_positions (id, internship_id, intern_name, university, position_status) VALUES
('ip_demo_001', 'int_demo_001', 'Intern One', 'AUCDT', 'ongoing');
