CREATE DATABASE IF NOT EXISTS timetable_mgmt;
USE timetable_mgmt;

INSERT INTO schedules (id, module_code, module_name, lecturer, day_of_week, start_time, end_time, room_number, capacity) VALUES
('sched_001', 'CS101', 'Introduction to Computing', 'Dr. Ama Owusu', 'Monday', '08:00:00', '09:30:00', 'Room 201', 45),
('sched_002', 'MATH201', 'Calculus II', 'Prof. Kofi Mensah', 'Tuesday', '10:00:00', '11:30:00', 'Hall A', 100),
('sched_003', 'PHYS101', 'Physics I', 'Dr. Yaa Boateng', 'Wednesday', '14:00:00', '15:30:00', 'Lab 2', 30);

INSERT INTO schedule_conflicts (id, schedule_id_1, schedule_id_2, conflict_type, severity) VALUES
('conf_001', 'sched_001', 'sched_002', 'room_overlap', 'low'),
('conf_002', 'sched_002', 'sched_003', 'lecturer_overlap', 'high');
