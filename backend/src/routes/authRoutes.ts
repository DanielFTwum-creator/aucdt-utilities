import { Router } from 'express';
import { login, logout, validateToken } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { loginRateLimiter } from '../middleware/rateLimitMiddleware';

const router = Router();

router.post('/login', loginRateLimiter, login);
router.post('/logout', logout);
router.get('/validate', authenticateJWT, validateToken);

export default router;
