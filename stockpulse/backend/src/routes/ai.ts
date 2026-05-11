import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';
import { getQuote } from '../services/market';
import { analyzeStock } from '../services/gemini';
import rateLimit from 'express-rate-limit';

const router = Router();

const freeLimiter = rateLimit({ windowMs: 3600000, max: 5, keyGenerator: (req) => String((req as AuthRequest).user?.id ?? req.ip ?? 'unknown'), validate: { keyGeneratorIpFallback: false } });
const premiumLimiter = rateLimit({ windowMs: 3600000, max: 60, keyGenerator: (req) => String((req as AuthRequest).user?.id ?? req.ip ?? 'unknown'), validate: { keyGeneratorIpFallback: false } });

router.post('/analyze/:ticker', requireAuth, async (req: AuthRequest, res: Response) => {
  const limiter = req.user!.tier === 'premium' ? premiumLimiter : freeLimiter;
  await new Promise<void>((resolve) => limiter(req, res, () => resolve()));
  if (res.headersSent) return;

  const ticker = String(req.params.ticker).toUpperCase();
  try {
    const quote = await getQuote(ticker);
    const result = await analyzeStock(
      ticker,
      quote.price,
      quote.change,
      quote.changePercent,
      quote.volume,
      quote.marketCap,
      quote.pe,
      quote.dayHigh,
      quote.dayLow,
      quote.fiftyTwoWeekHigh,
      quote.fiftyTwoWeekLow
    );

    db.prepare(
      'INSERT INTO ai_signals (user_id, ticker, signal, confidence, score, rationale, price_at_signal) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(req.user!.id, ticker, result.signal, result.confidence, result.score, result.rationale, quote.price);

    res.json({ ...result, ticker, priceAtAnalysis: quote.price, analyzedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: `Analysis failed: ${(err as Error).message}` });
  }
});

router.get('/signals', requireAuth, (req: AuthRequest, res: Response) => {
  const limit = req.user!.tier === 'premium' ? 100 : 10;
  const rows = db.prepare(
    'SELECT id, ticker, signal, confidence, score, rationale, price_at_signal, created_at FROM ai_signals WHERE user_id = ? ORDER BY created_at DESC LIMIT ?'
  ).all(req.user!.id, limit);
  res.json(rows);
});

router.get('/history/:ticker', requireAuth, (req: AuthRequest, res: Response) => {
  const ticker = String(req.params.ticker).toUpperCase();
  const rows = db.prepare(
    'SELECT id, signal, confidence, score, rationale, price_at_signal, created_at FROM ai_signals WHERE user_id = ? AND ticker = ? ORDER BY created_at DESC LIMIT 50'
  ).all(req.user!.id, ticker);
  res.json(rows);
});

export default router;
