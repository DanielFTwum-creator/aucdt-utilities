-- Fix password hashes that got corrupted with escaped backslashes
UPDATE tuc_rms_users SET password_hash='$2b$10$QhIRgGJO4DnMKRgbn3B/7.UcKsAqg2gNXnKc14OgBxc7AuVnMBTuO' WHERE id IN (6,7,8,9,10);

SELECT id, email, password_hash FROM tuc_rms_users;
