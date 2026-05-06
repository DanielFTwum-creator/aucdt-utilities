import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  res.json({ message: 'Login successful (mock)' });
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful (mock)' });
});

router.get('/me', (req, res) => {
  res.json({ id: 1, username: 'admin', role: 'admin' });
});

export default router;
