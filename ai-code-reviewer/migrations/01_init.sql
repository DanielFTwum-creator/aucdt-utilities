CREATE TABLE IF NOT EXISTS code_reviews (
  id VARCHAR(255) PRIMARY KEY,
  repository_name VARCHAR(255),
  branch_name VARCHAR(255),
  reviewer_ai VARCHAR(100),
  review_score INT,
  review_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_repo (repository_name),
  INDEX idx_status (review_status)
);

CREATE TABLE IF NOT EXISTS review_findings (
  id VARCHAR(255) PRIMARY KEY,
  review_id VARCHAR(255),
  finding_type VARCHAR(100),
  severity VARCHAR(50),
  line_number INT,
  recommendation TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (review_id) REFERENCES code_reviews(id),
  INDEX idx_review (review_id),
  INDEX idx_severity (severity)
);

INSERT INTO code_reviews (id, repository_name, branch_name, reviewer_ai, review_score, review_status) VALUES
('rev_001', 'aucdt-utilities', 'feature/api-v2', 'claude-haiku', 88, 'completed'),
('rev_002', 'analytics-refactor', 'main', 'claude-haiku', 92, 'completed'),
('rev_003', 'portal-tests', 'develop', 'claude-haiku', 85, 'in_progress');

INSERT INTO review_findings (id, review_id, finding_type, severity, line_number, recommendation) VALUES
('fin_001', 'rev_001', 'performance', 'major', 125, 'Consider memoization for expensive calculations'),
('fin_002', 'rev_002', 'bug', 'critical', 89, 'Potential null pointer exception at this location'),
('fin_003', 'rev_003', 'style', 'minor', 234, 'Function naming does not follow conventions');
