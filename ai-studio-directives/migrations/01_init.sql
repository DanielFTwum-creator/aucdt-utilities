CREATE TABLE IF NOT EXISTS directives (
  id VARCHAR(255) PRIMARY KEY,
  directive_name VARCHAR(255),
  prompt_text TEXT,
  category VARCHAR(100),
  usage_count INT,
  effectiveness_score DECIMAL(3,2),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS executions (
  id VARCHAR(255) PRIMARY KEY,
  directive_id VARCHAR(255),
  execution_date DATETIME,
  input_tokens INT,
  output_tokens INT,
  model_used VARCHAR(100),
  result_quality VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (directive_id) REFERENCES directives(id),
  INDEX idx_directive (directive_id),
  INDEX idx_quality (result_quality)
);

INSERT INTO directives (id, directive_name, prompt_text, category, usage_count, effectiveness_score, status) VALUES
('dir_001', 'Code Documentation', 'Generate comprehensive docstrings for Python functions...', 'coding', 145, 0.92, 'active'),
('dir_002', 'Content Generation', 'Write engaging educational content about...', 'content', 89, 0.88, 'active'),
('dir_003', 'Email Templates', 'Draft professional email responses...', 'communication', 230, 0.95, 'active');

INSERT INTO executions (id, directive_id, execution_date, input_tokens, output_tokens, model_used, result_quality) VALUES
('exec_001', 'dir_001', '2024-02-25 09:30:00', 350, 520, 'claude-haiku', 'excellent'),
('exec_002', 'dir_002', '2024-02-25 08:15:00', 450, 680, 'claude-haiku', 'excellent'),
('exec_003', 'dir_003', '2024-02-25 10:45:00', 200, 300, 'claude-haiku', 'good');
