CREATE TABLE IF NOT EXISTS books (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(20),
  publication_year INT,
  total_copies INT,
  available_copies INT,
  category VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_author (author),
  INDEX idx_category (category)
);

CREATE TABLE IF NOT EXISTS checkouts (
  id VARCHAR(255) PRIMARY KEY,
  book_id VARCHAR(255),
  borrower_id VARCHAR(255),
  checkout_date DATETIME,
  due_date DATE,
  return_date DATE,
  status VARCHAR(50),
  late_fee DECIMAL(10,2),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id),
  INDEX idx_book (book_id),
  INDEX idx_status (status)
);

INSERT INTO books (id, title, author, category, total_copies, available_copies) VALUES
('bk_demo_001', 'Computer Science Basics', 'Author A', 'Technology', 10, 7);

INSERT INTO checkouts (id, book_id, borrower_id, checkout_date, due_date, status) VALUES
('ck_demo_001', 'bk_demo_001', 'std_001', '2024-02-01 09:00:00', '2024-02-15', 'checked_out');
