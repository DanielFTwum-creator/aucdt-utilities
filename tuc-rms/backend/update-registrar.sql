-- Update registrar to Stephanie Acquah-Djan
UPDATE tuc_rms_users SET
  full_name='Stephanie Acquah-Djan',
  email='stephanie.acquah-djan@techbridge.edu.gh',
  role='registrar',
  staff_id='REG001',
  department='Registrar Office'
WHERE id=1;

-- Verify
SELECT id, full_name, email, role FROM tuc_rms_users WHERE role='registrar';
