CREATE TABLE IF NOT EXISTS portfolios (
  id VARCHAR(255) PRIMARY KEY,
  owner_name VARCHAR(255),
  owner_type VARCHAR(50),
  profile_url VARCHAR(500),
  bio TEXT,
  verified BOOLEAN,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_owner (owner_name),
  INDEX idx_verified (verified)
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id VARCHAR(255) PRIMARY KEY,
  portfolio_id VARCHAR(255),
  item_title VARCHAR(255),
  item_description TEXT,
  item_media_url VARCHAR(500),
  category VARCHAR(100),
  views_count INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (portfolio_id) REFERENCES portfolios(id),
  INDEX idx_portfolio (portfolio_id),
  INDEX idx_category (category)
);

INSERT INTO portfolios (id, owner_name, owner_type, profile_url, bio, verified) VALUES
('port_001', 'Ama Osei', 'student', 'ama-osei.portfolio.tech', 'Full-stack developer and designer', true),
('port_002', 'James Asante', 'faculty', 'prof-jamesasante.edu', 'Computer Science Professor', true),
('port_003', 'Grace Kwakye', 'alumni', 'grace-kwakye.dev', 'Product Manager at TechCorp', true);

INSERT INTO portfolio_items (id, portfolio_id, item_title, item_description, item_media_url, category, views_count) VALUES
('item_001', 'port_001', 'E-Learning Platform', 'React-based online education system', '/media/elearning-demo.png', 'project', 450),
('item_002', 'port_002', 'Database Design Course', 'Comprehensive course on relational databases', '/media/course-db.pdf', 'course', 1200),
('item_003', 'port_003', 'AI Product Strategy', 'Case study on implementing AI in products', '/media/ai-strategy.pdf', 'article', 890);
