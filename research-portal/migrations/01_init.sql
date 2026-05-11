CREATE TABLE IF NOT EXISTS research_papers (
  id VARCHAR(255) PRIMARY KEY,
  paper_title VARCHAR(500),
  author_names TEXT,
  publication_date DATE,
  research_area VARCHAR(255),
  abstract TEXT,
  document_url VARCHAR(500),
  citation_count INT,
  approval_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS citations (
  id VARCHAR(255) PRIMARY KEY,
  paper_id VARCHAR(255),
  citing_paper_title VARCHAR(500),
  citation_date DATE,
  citation_impact VARCHAR(50),
  journal_name VARCHAR(255),
  citation_format VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (paper_id) REFERENCES research_papers(id)
);

INSERT INTO research_papers (id, paper_title, research_area, approval_status) VALUES
('rp_demo_001', 'Research on AI Education', 'AI in Education', 'submitted');

INSERT INTO citations (id, paper_id, citing_paper_title, citation_date) VALUES
('ct_demo_001', 'rp_demo_001', 'Citation Example', '2024-01-01');
