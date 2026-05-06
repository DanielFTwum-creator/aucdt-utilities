CREATE DATABASE IF NOT EXISTS brainiac_challenge;
USE brainiac_challenge;

INSERT INTO challenges (id, challenge_name, difficulty, category, points) VALUES
('ch_001', 'Math Logic Puzzles', 'medium', 'mathematics', 100),
('ch_002', 'Coding Challenge 1', 'hard', 'programming', 150),
('ch_003', 'Science Quiz', 'easy', 'science', 50);

INSERT INTO challenge_submissions (id, challenge_id, student_id, score, is_correct, time_taken) VALUES
('sub_001', 'ch_001', 'STU001', 100, true, 1800),
('sub_002', 'ch_002', 'STU002', 150, true, 3600),
('sub_003', 'ch_003', 'STU003', 45, false, 900);

INSERT INTO leaderboard (id, student_id, total_points, challenges_completed, ranking) VALUES
('lb_001', 'STU001', 250, 5, 1),
('lb_002', 'STU002', 200, 4, 2),
('lb_003', 'STU003', 150, 3, 3);
