CREATE TABLE IF NOT EXISTS components (
  id VARCHAR(255) PRIMARY KEY,
  component_name VARCHAR(255),
  component_type VARCHAR(100),
  status VARCHAR(50),
  version VARCHAR(20),
  usage_count INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (component_type),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS design_tokens (
  id VARCHAR(255) PRIMARY KEY,
  token_name VARCHAR(255),
  token_type VARCHAR(100),
  value VARCHAR(255),
  category VARCHAR(100),
  deprecation_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_deprecation (deprecation_status)
);

INSERT INTO components (id, component_name, component_type, status, version, usage_count) VALUES
('comp_001', 'Button Component', 'form', 'published', '2.1.0', 450),
('comp_002', 'Card Component', 'layout', 'published', '1.5.0', 320),
('comp_003', 'Modal Component', 'overlay', 'published', '3.0.0', 85);

INSERT INTO design_tokens (id, token_name, token_type, value, category, deprecation_status) VALUES
('tok_001', 'spacing-unit', 'spacing', '8px', 'spacing', 'active'),
('tok_002', 'color-primary', 'color', '#0066CC', 'colors', 'active'),
('tok_003', 'font-size-body', 'typography', '14px', 'typography', 'active');
