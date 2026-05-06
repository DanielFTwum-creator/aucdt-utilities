import rateLimit from 'express-rate-limit';

// Global rate limiter: 200 requests per 15 minutes per IP for general endpoints
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {ok: false, error: 'Too many requests, please try later.'},
});

// Strict limiter for write endpoints: 30 requests per 15 minutes
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {ok: false, error: 'Too many requests to write endpoints, slow down.'},
});

export default generalLimiter;
