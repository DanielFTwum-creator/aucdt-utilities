CREATE DATABASE IF NOT EXISTS eligibility;
USE eligibility;

INSERT INTO criteria (id, criterion_name, criterion_type, requirement, is_mandatory) VALUES
('crit_001', 'High School Diploma', 'education', 'Must possess valid diploma', true),
('crit_002', 'Minimum GPA', 'academic', 'GPA >= 2.5', true),
('crit_003', 'Language Proficiency', 'skill', 'English proficiency test pass', false);

INSERT INTO eligibility_checks (id, student_id, program_id, eligibility_status, criteria_met, total_criteria) VALUES
('elig_001', 'STU001', 'PROG_CS', 'eligible', 3, 3),
('elig_002', 'STU002', 'PROG_ENG', 'eligible', 2, 3),
('elig_003', 'STU003', 'PROG_BUS', 'ineligible', 1, 3);
