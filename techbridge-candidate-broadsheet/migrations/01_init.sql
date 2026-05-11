CREATE TABLE IF NOT EXISTS candidates (
  id VARCHAR(255) PRIMARY KEY,
  candidate_number VARCHAR(100),
  full_name VARCHAR(255),
  exam_center VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_candidate_number (candidate_number),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS results (
  id VARCHAR(255) PRIMARY KEY,
  candidate_id VARCHAR(255),
  subject VARCHAR(100),
  score INT,
  grade VARCHAR(2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id),
  INDEX idx_candidate (candidate_id),
  INDEX idx_grade (grade)
);

INSERT INTO candidates (id, candidate_number, full_name, exam_center, status) VALUES
('cand_001', 'GHA2024001', 'Yaw Boateng', 'Accra Central', 'completed'),
('cand_002', 'GHA2024002', 'Abena Kwakye', 'Kumasi', 'completed'),
('cand_003', 'GHA2024003', 'Bismark Owusu', 'Takoradi', 'completed');

INSERT INTO results (id, candidate_id, subject, score, grade) VALUES
('res_001', 'cand_001', 'English', 78, 'A'),
('res_002', 'cand_002', 'Mathematics', 92, 'A+'),
('res_003', 'cand_003', 'Science', 85, 'A');
