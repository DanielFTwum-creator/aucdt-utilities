CREATE TABLE IF NOT EXISTS generation_requests (
  id VARCHAR(255) PRIMARY KEY,
  request_type VARCHAR(100),
  description TEXT,
  prompt TEXT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (request_type),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS generated_content (
  id VARCHAR(255) PRIMARY KEY,
  request_id VARCHAR(255),
  content_url VARCHAR(500),
  content_type VARCHAR(100),
  generation_time_ms INT,
  quality_score DECIMAL(3,2),
  approval_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES generation_requests(id),
  INDEX idx_request (request_id),
  INDEX idx_approval (approval_status)
);

INSERT INTO generation_requests (id, request_type, description, prompt, status) VALUES
('req_001', 'cartoon_animation', 'Comic character design', 'Create a playful cartoon character...', 'completed'),
('req_002', 'illustration', 'Educational infographic', 'Design an infographic about climate...', 'in_progress'),
('req_003', 'animation', '3D logo intro', 'Animate the AUCDT logo in 3D...', 'pending');

INSERT INTO generated_content (id, request_id, content_url, content_type, generation_time_ms, quality_score, approval_status) VALUES
('gen_001', 'req_001', '/content/cartoon_001.mp4', 'animation', 45000, 0.88, 'approved'),
('gen_002', 'req_002', '/content/infographic_001.png', 'image', 30000, 0.85, 'pending_review'),
('gen_003', 'req_003', '/content/logo_intro_001.mp4', 'animation', 60000, 0.92, 'approved');
