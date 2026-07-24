CREATE DATABASE IF NOT EXISTS lead_generation;
USE lead_generation;

INSERT INTO leads (id, full_name, email, phone, source, lead_score, status) VALUES
('lead_001', 'John Adams', 'john@example.com', '+233501234567', 'web', 85, 'qualified'),
('lead_002', 'Mary Johnson', 'mary@example.com', '+233502234567', 'referral', 72, 'contacted'),
('lead_003', 'Peter Smith', 'peter@example.com', '+233503234567', 'event', 60, 'new');

INSERT INTO lead_interactions (id, lead_id, interaction_type, notes) VALUES
('inter_001', 'lead_001', 'email', 'Sent initial inquiry'),
('inter_002', 'lead_002', 'call', 'Discussed program details'),
('inter_003', 'lead_003', 'meeting', 'Campus tour scheduled');
