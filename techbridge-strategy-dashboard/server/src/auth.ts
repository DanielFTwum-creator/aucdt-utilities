import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const SECRET = process.env.BACKEND_SECRET || 'dev-secret-change-me';

export function generateToken(payload: object, expiresIn = '6h') {
  return jwt.sign(payload, SECRET, {expiresIn});
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return res.status(401).json({ok: false, error: 'Missing Authorization header'});
  const token = m[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    // attach to request
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ok: false, error: 'Invalid token'});
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ok: false, error: 'Missing user in request'});
    if ((user as any).role !== role) return res.status(403).json({ok: false, error: 'Forbidden'});
    next();
  };
}
