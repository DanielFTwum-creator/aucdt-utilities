import { Router, Request, Response } from 'express';
import { getQuote, getHistory, searchTickers, getIndices, getNews } from '../services/market';
import { optionalAuth, AuthRequest } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

const quoteLimiter = rateLimit({ windowMs: 60000, max: 60 });
const searchLimiter = rateLimit({ windowMs: 60000, max: 20 });

router.get('/quote/:ticker', quoteLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  const ticker = String(req.params.ticker).toUpperCase();
  try {
    const data = await getQuote(ticker);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `Could not fetch quote for ${ticker}` });
  }
});

router.get('/quotes', quoteLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  const tickers = String(req.query.symbols || '').split(',').filter(Boolean).map(t => t.toUpperCase());
  if (tickers.length === 0) { res.status(400).json({ error: 'symbols param required' }); return; }
  if (tickers.length > 20) { res.status(400).json({ error: 'Maximum 20 symbols per request' }); return; }
  const results = await Promise.allSettled(tickers.map(t => getQuote(t)));
  const data = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { ticker: tickers[i], error: true }
  );
  res.json(data);
});

router.get('/history/:ticker', quoteLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  const ticker = String(req.params.ticker).toUpperCase();
  try {
    const { period = '1mo', interval = '1d' } = req.query as { period?: string; interval?: string };
    const data = await getHistory(ticker, period, interval);
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: `Could not fetch history for ${ticker}` });
  }
});

router.get('/search', searchLimiter, async (req: Request, res: Response) => {
  const q = String(req.query.q || '').trim();
  if (!q) { res.status(400).json({ error: 'Query param q required' }); return; }
  try {
    const results = await searchTickers(q);
    res.json(results);
  } catch {
    res.json([]);
  }
});

router.get('/indices', async (_req: Request, res: Response) => {
  try {
    res.json(await getIndices());
  } catch {
    res.json([]);
  }
});

router.get('/news/:ticker', quoteLimiter, async (req: Request, res: Response) => {
  const ticker = String(req.params.ticker).toUpperCase();
  try {
    res.json(await getNews(ticker));
  } catch {
    res.json([]);
  }
});

export default router;
