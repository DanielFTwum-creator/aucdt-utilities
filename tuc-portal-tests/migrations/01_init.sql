CREATE TABLE IF NOT EXISTS test_suites (
  id VARCHAR(255) PRIMARY KEY,
  suite_name VARCHAR(255),
  project_name VARCHAR(255),
  test_count INT,
  status VARCHAR(50),
  last_run DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_project (project_name),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS test_cases (
  id VARCHAR(255) PRIMARY KEY,
  suite_id VARCHAR(255),
  test_name VARCHAR(255),
  test_type VARCHAR(100),
  status VARCHAR(50),
  execution_time_ms INT,
  failure_reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (suite_id) REFERENCES test_suites(id),
  INDEX idx_suite (suite_id),
  INDEX idx_status (status)
);

INSERT INTO test_suites (id, suite_name, project_name, test_count, status, last_run) VALUES
('ts_001', 'API Integration Tests', 'aucdt-utilities', 45, 'passed', '2024-02-25 08:30:00'),
('ts_002', 'Unit Tests', 'analytics-refactor', 120, 'passed', '2024-02-25 07:45:00'),
('ts_003', 'E2E Tests', 'aucdt-portal-tests', 35, 'failed', '2024-02-25 06:15:00');

INSERT INTO test_cases (id, suite_id, test_name, test_type, status, execution_time_ms) VALUES
('tc_001', 'ts_001', 'POST /api/user creates new user', 'integration', 'passed', 245),
('tc_002', 'ts_002', 'calculateGPA function returns correct value', 'unit', 'passed', 12),
('tc_003', 'ts_003', 'Login flow completes successfully', 'e2e', 'failed', 3450);
