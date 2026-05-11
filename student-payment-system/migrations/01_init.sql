CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(255) PRIMARY KEY,
  student_id VARCHAR(255),
  student_name VARCHAR(255),
  amount DECIMAL(10,2),
  payment_date DATETIME,
  semester VARCHAR(50),
  payment_method VARCHAR(100),
  transaction_id VARCHAR(255),
  status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_student (student_id),
  INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(255) PRIMARY KEY,
  payment_id VARCHAR(255),
  invoice_number VARCHAR(50),
  student_id VARCHAR(255),
  invoice_date DATE,
  due_date DATE,
  total_amount DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  balance_due DECIMAL(10,2),
  invoice_status VARCHAR(50),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id),
  INDEX idx_invoice (invoice_number)
);

INSERT INTO payments (id, student_id, student_name, amount, payment_date, status) VALUES
('pay_demo_001', 'std_001', 'Student One', 1500.00, '2024-02-15 12:00:00', 'completed');

INSERT INTO invoices (id, payment_id, invoice_number, student_id, total_amount, amount_paid, balance_due, invoice_status) VALUES
('inv_demo_001', 'pay_demo_001', 'INV-2024-0001', 'std_001', 1500.00, 1500.00, 0.00, 'paid');
