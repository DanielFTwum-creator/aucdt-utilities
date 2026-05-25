-- Populate users table in production database (aucdt_online_dev)
-- Password hash: Admin@123 = $2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO

INSERT INTO users (full_name, email, role, password_hash, is_active, staff_id, department) VALUES
('Dr. Andrew Richard Owusu Addo', 'registrar@techbridge.edu.gh', 'registrar', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'REG001', 'Registrar Office'),
('Mrs. Abena Mensah', 'qa@techbridge.edu.gh', 'qa_officer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'QA001', 'Quality Assurance'),
('Mr. Benjamin Asante Bucha', 'buchag@techbridge.edu.gh', 'lecturer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'LEC001', 'Department of Computing'),
('Dr. Grace Acheampong', 'grace.acheampong@techbridge.edu.gh', 'lecturer', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'LEC002', 'Department of Sciences'),
('Prof. Samuel Kwame Boateng', 's.boateng@techbridge.edu.gh', 'registrar', '$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO', 1, 'REG002', 'Registrar Office');
