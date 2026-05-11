-- Brand Guideline Checker Database Schema

CREATE TABLE IF NOT EXISTS guidelines (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  rule_name VARCHAR(255) NOT NULL,
  description TEXT,
  severity ENUM('warning', 'error', 'info') DEFAULT 'warning',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audits (
  id VARCHAR(255) PRIMARY KEY,
  guideline_id VARCHAR(255) NOT NULL,
  content_url VARCHAR(500),
  status ENUM('pass', 'fail', 'pending') DEFAULT 'pending',
  score INT DEFAULT 0,
  audit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guideline_id) REFERENCES guidelines(id) ON DELETE CASCADE
);

CREATE INDEX idx_audits_guideline ON audits(guideline_id);
CREATE INDEX idx_audits_date ON audits(audit_date);

-- Sample guidelines
INSERT INTO guidelines (id, category, rule_name, description, severity) VALUES 
  ('rule_001', 'logo', 'Minimum Size', 'Logo must be at least 100px', 'error'),
  ('rule_002', 'color', 'Brand Colors', 'Use approved color palette', 'error'),
  ('rule_003', 'typography', 'Font Usage', 'Use brand fonts only', 'warning');
