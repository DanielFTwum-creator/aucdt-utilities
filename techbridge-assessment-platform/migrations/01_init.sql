CREATE DATABASE IF NOT EXISTS assessment_platform;
USE assessment_platform;

INSERT INTO assessments (id, assessment_name, assessment_type, max_score, created_by) VALUES
('ass_001', 'Mathematics Final Exam', 'summative', 100, 'admin_001'),
('ass_002', 'English Proficiency Test', 'diagnostic', 80, 'admin_002'),
('ass_003', 'Science Pre-Assessment', 'formative', 50, 'admin_003');

INSERT INTO assessment_results (id, assessment_id, student_id, score, percentage, status) VALUES
('res_001', 'ass_001', 'STU001', 85, 85.00, 'passed'),
('res_002', 'ass_002', 'STU002', 72, 90.00, 'passed'),
('res_003', 'ass_003', 'STU003', 32, 64.00, 'passed');
