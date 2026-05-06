CREATE TABLE IF NOT EXISTS brand_assets (
  id VARCHAR(255) PRIMARY KEY,
  asset_name VARCHAR(255),
  asset_type VARCHAR(100),
  version VARCHAR(50),
  file_path VARCHAR(500),
  approval_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type (asset_type),
  INDEX idx_status (approval_status)
);

CREATE TABLE IF NOT EXISTS design_standards (
  id VARCHAR(255) PRIMARY KEY,
  standard_name VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  value VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
);

INSERT INTO brand_assets (id, asset_name, asset_type, version, file_path, approval_status) VALUES
('ba_001', 'AUCDT Logo', 'logo', '2.0', '/assets/aucdt-logo-v2.svg', 'approved'),
('ba_002', 'Brand Color Palette', 'palette', '1.0', '/assets/colors.json', 'approved'),
('ba_003', 'Typography Guide', 'font', '1.5', '/assets/fonts/guide.pdf', 'approved');

INSERT INTO design_standards (id, standard_name, category, description, value, status) VALUES
('ds_001', 'Primary Color', 'color', 'Main brand color for CTAs', '#0066CC', 'active'),
('ds_002', 'Secondary Color', 'color', 'Supporting brand color', '#00B4D8', 'active'),
('ds_003', 'Body Font', 'typography', 'Default body text font', 'Inter, sans-serif', 'active');
