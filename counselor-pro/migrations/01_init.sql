CREATE DATABASE IF NOT EXISTS counselor_pro;
USE counselor_pro;

INSERT INTO counselors (id, full_name, specialization, license_number, availability_status, email) VALUES
('couns_001', 'Dr. Sarah Anderson', 'Academic Counseling', 'LC001234', 'available', 'sarah.anderson@aucdt.edu.gh'),
('couns_002', 'Ms. Grace Mensah', 'Career Counseling', 'LC001235', 'available', 'grace.mensah@aucdt.edu.gh'),
('couns_003', 'Dr. James Owusu', 'Mental Health', 'LC001236', 'on_leave', 'james.owusu@aucdt.edu.gh');

INSERT INTO sessions (id, student_id, counselor_id, session_date, duration_minutes, session_notes, outcome) VALUES
('sess_001', 'STU001', 'couns_001', '2026-02-20 10:00:00', 45, 'Discussed course selection and career path', 'Advised on Computer Science program'),
('sess_002', 'STU002', 'couns_002', '2026-02-21 14:00:00', 60, 'Explored internship opportunities', 'Referred to industry partners'),
('sess_003', 'STU003', 'couns_003', '2026-02-19 11:00:00', 30, 'Addressed academic concerns', 'Scheduled follow-up session');
