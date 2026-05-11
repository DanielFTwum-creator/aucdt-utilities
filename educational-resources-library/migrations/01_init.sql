CREATE TABLE IF NOT EXISTS resources (
  id VARCHAR(255) PRIMARY KEY,
  resource_title VARCHAR(255),
  resource_type VARCHAR(100),
  subject VARCHAR(255),
  file_size INT,
  download_count INT,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (resource_type),
  INDEX idx_subject (subject),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS resource_reviews (
  id VARCHAR(255) PRIMARY KEY,
  resource_id VARCHAR(255),
  reviewer_name VARCHAR(255),
  rating INT,
  review_text TEXT,
  helpfulness DECIMAL(3,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resource_id) REFERENCES resources(id),
  INDEX idx_resource (resource_id),
  INDEX idx_rating (rating)
);

INSERT INTO resources (id, resource_title, resource_type, subject, file_size, download_count, status) VALUES
('res_001', 'Python Programming Basics', 'textbook', 'Computer Science', 5242880, 1250, 'published'),
('res_002', 'Business Ethics Case Studies', 'case_study', 'Business', 1048576, 340, 'published'),
('res_003', 'React Advanced Patterns', 'tutorial', 'Web Development', 742400, 890, 'published');

INSERT INTO resource_reviews (id, resource_id, reviewer_name, rating, review_text, helpfulness) VALUES
('rev_001', 'res_001', 'Dr. Asante', 5, 'Excellent comprehensive guide for beginners', 0.95),
('rev_002', 'res_002', 'Prof. Mensah', 4, 'Good cases but could use more examples', 0.80),
('rev_003', 'res_003', 'Sarah Dev', 5, 'Best React resource I have found', 0.98);
