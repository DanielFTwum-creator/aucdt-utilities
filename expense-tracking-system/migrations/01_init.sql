CREATE TABLE IF NOT EXISTS expenses (
  id VARCHAR(255) PRIMARY KEY,
  category VARCHAR(100),
  amount DECIMAL(10,2),
  description VARCHAR(255),
  expense_date DATE,
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS expense_reports (
  id VARCHAR(255) PRIMARY KEY,
  period VARCHAR(50),
  total_amount DECIMAL(12,2),
  total_items INT,
  approved_amount DECIMAL(12,2),
  approval_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_period (period),
  INDEX idx_status (approval_status)
);

INSERT INTO expenses (id, category, amount, description, expense_date, status) VALUES
('exp_001', 'Travel', 250.50, 'Conference attendance', '2024-01-15', 'approved'),
('exp_002', 'Materials', 125.75, 'Office supplies', '2024-01-18', 'approved'),
('exp_003', 'Utilities', 500.00, 'Electricity bill', '2024-01-20', 'pending');

INSERT INTO expense_reports (id, period, total_amount, total_items, approved_amount, approval_status) VALUES
('rep_001', 'January 2024', 876.25, 3, 876.25, 'approved'),
('rep_002', 'February 2024', 1200.00, 5, 0, 'pending'),
('rep_003', 'March 2024', 650.50, 2, 650.50, 'approved');
