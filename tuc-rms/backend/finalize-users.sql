-- Update users table with correct emails and roles

-- Keep registrar (Stephanie)
-- Update QA officer
UPDATE tuc_rms_users SET
  full_name='QA Officer',
  email='qa@techbridge.edu.gh',
  role='qa_officer',
  staff_id='QA001',
  department='Quality Assurance'
WHERE id=2;

-- Update production admin user (Daniel Twum)
UPDATE tuc_rms_users SET
  full_name='Daniel Frempong Twum',
  email='daniel.twum@techbridge.edu.gh',
  role='registrar',
  staff_id='ADMIN001',
  department='ICT Department'
WHERE id=5;

-- Verify final user list
SELECT id, full_name, email, role, staff_id FROM tuc_rms_users ORDER BY role, full_name;
