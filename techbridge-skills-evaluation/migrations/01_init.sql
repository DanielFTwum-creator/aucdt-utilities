CREATE DATABASE IF NOT EXISTS skills_evaluation;
USE skills_evaluation;

INSERT INTO competencies (id, competency_name, competency_category, proficiency_levels) VALUES
('comp_001', 'Critical Thinking', 'cognitive', 5),
('comp_002', 'Communication', 'interpersonal', 5),
('comp_003', 'Problem Solving', 'technical', 5);

INSERT INTO skill_assessments (id, student_id, competency_id, proficiency_level, assessment_score, feedback) VALUES
('skill_001', 'STU001', 'comp_001', 4, 85.50, 'Excellent analytical approach'),
('skill_002', 'STU002', 'comp_002', 3, 72.00, 'Good verbal skills, needs written improvement'),
('skill_003', 'STU003', 'comp_003', 4, 88.00, 'Strong algorithm design');
