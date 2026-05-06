CREATE TABLE IF NOT EXISTS complaints (
  id VARCHAR(255) PRIMARY KEY,
  complainant_name VARCHAR(255),
  contact_email VARCHAR(255),
  complaint_category VARCHAR(100),
  complaint_description TEXT,
  severity_level VARCHAR(50),
  complaint_date DATETIME,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (complaint_category),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS resolutions (
  id VARCHAR(255) PRIMARY KEY,
  complaint_id VARCHAR(255),
  assigned_officer VARCHAR(255),
  resolution_plan TEXT,
  resolution_date DATE,
  outcome VARCHAR(100),
  satisfaction_rating INT,
  resolution_notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id),
  INDEX idx_complaint (complaint_id)
);

INSERT INTO complaints (id, complainant_name, complaint_category, status, complaint_date) VALUES
('cmp_demo_001', 'User One', 'General', 'open', '2024-02-20 09:30:00');

INSERT INTO resolutions (id, complaint_id, assigned_officer, resolution_date, outcome) VALUES
('res_demo_001', 'cmp_demo_001', 'Officer A', '2024-02-22', 'in_progress');
