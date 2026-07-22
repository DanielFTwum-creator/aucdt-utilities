-- 003 — fill two gaps left by 001/002 so the app can be fully DB-backed:
--   (a) the daily_health_checks table was never created (no table, no routes)
--   (b) the medications table shipped empty, so a DB-backed pharmacy would be blank
-- Idempotent and non-destructive: safe to re-run, leaves the 50 seeded staff intact.
USE tuc_sickbay;

CREATE TABLE IF NOT EXISTS daily_health_checks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  temperature DECIMAL(4,1),
  symptoms JSON NULL,                               -- JSON array of symptom strings
  status ENUM('Healthy','Needs Monitor','Refer to Sickbay'),
  notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Seed the standard sick-bay medication inventory. A unique key on batch_number
-- makes INSERT IGNORE idempotent (re-running never duplicates a line, and never
-- overwrites quantities the nurse has since adjusted).
ALTER TABLE medications ADD UNIQUE KEY IF NOT EXISTS uq_med_batch (batch_number);

INSERT IGNORE INTO medications
  (name, category, quantity_on_hand, unit, reorder_threshold, batch_number, expiry_date, over_stock_threshold)
VALUES
  ('Paracetamol 500mg Tablets',        'Analgesics',       450, 'tablets',   100, 'B-PC2026A', '2027-08-15', 1000),
  ('Ibuprofen 400mg Tablets',          'Analgesics',        40, 'tablets',   100, 'B-IB2026B', '2026-11-20',  500),
  ('Salbutamol Inhaler (100mcg/dose)', 'Inhalers',          15, 'inhalers',    5, 'B-SB2026X', '2026-08-10',   30),
  ('Cetirizine 10mg (Antihistamine)',  'Antihistamines',   320, 'tablets',    50, 'B-CT2025C', '2025-12-01',  400),
  ('Amoxicillin 250mg Capsules',       'Other',           1200, 'tablets',   200, 'B-AMX991',  '2028-01-30', 1000),
  ('Oral Rehydration Salts (ORS)',     'Gastrointestinal',  80, 'sachets',    30, 'B-ORS102',  '2027-04-12',  200),
  ('Antacid Chewable Tablets',         'Gastrointestinal', 150, 'tablets',    50, 'B-ANT881',  '2027-03-05',  300),
  ('Sterile Gauze Rolls & Bandages',   'First Aid',         25, 'rolls',      10, 'B-GZ004',   '2029-06-30',   80),
  ('Methylated Spirit 250ml',          'First Aid',          8, 'bottles',     5, 'B-MS112',   '2028-09-15',   20);
