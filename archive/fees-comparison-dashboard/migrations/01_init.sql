CREATE DATABASE IF NOT EXISTS fees_comparison;
USE fees_comparison;

INSERT INTO institutions (id, institution_name, country, established_year, website_url) VALUES
('inst_001', 'AUCDT', 'Ghana', 2010, 'https://aucdt.edu.gh'),
('inst_002', 'University of Ghana', 'Ghana', 1948, 'https://ug.edu.gh'),
('inst_003', 'KNUST', 'Ghana', 1952, 'https://knust.edu.gh');

INSERT INTO fees_structure (id, institution_id, program_name, year, tuition_fee, accommodation_fee, other_fees, currency, academic_year) VALUES
('fee_001', 'inst_001', 'Computer Science', 1, 2500.00, 800.00, 300.00, 'GHS', '2025-2026'),
('fee_002', 'inst_002', 'Engineering', 1, 3000.00, 900.00, 400.00, 'GHS', '2025-2026'),
('fee_003', 'inst_003', 'Medicine', 1, 4500.00, 1200.00, 500.00, 'GHS', '2025-2026');
