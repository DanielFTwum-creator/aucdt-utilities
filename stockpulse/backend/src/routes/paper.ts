import { Router, Response } from 'express';
import { requireAuth, AuthRequest } from '../middleware/auth';
import db from '../db/schema';
import { getQuote } from '../services/market';

const router = Router();

function ensureAccount(userId: number) {
  const account = db.prepare('SELECT * FROM paper_accounts WHERE user_id = ?').get(userId);
  if (!account) {
    db.prepare('INSERT INTO paper_accounts (user_id, cash_balance) VALUES (?, 100000)').run(userId);
    return db.prepare('SELECT * FROM paper_accounts WHERE user_id = ?').get(userId) as { id: number; user_id: number; cash_balance: number; reset_count: number };
  }
  return account as { id: number; user_id: number; cash_balance: number; reset_count: number };
}

router.get('/account', requireAuth, async (req: AuthRequest, res: Response) => {
  const account = ensureAccount(req.user!.id);
  const positions = db.prepare(
    'SELECT ticker, shares, avg_cost FROM paper_positions WHERE user_id = ? AND shares > 0'
  ).all(req.user!.id) as { ticker: string; shares: number; avg_cost: number }[];

  let portfolioValue = 0;
  if (positions.length > 0) {
    const quotes = await Promise.allSettled(positions.map(p => getQuote(p.ticker)));
    quotes.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        portfolioValue += r.value.price * positions[i].shares;
      } else {
        portfolioValue += positions[i].avg_cost * positions[i].shares;
      }
    });
  }

  res.json({
    cashBalance: account.cash_balance,
    portfolioValue,
    totalValue: account.cash_balance + portfolioValue,
    unrealizedPL: portfolioValue - positions.reduce((sum, p) => sum + p.avg_cost * p.shares, 0),
    resetCount: account.reset_count,
    initialCapital: 100000,
  });
});

router.get('/positions', requireAuth, async (req: AuthRequest, res: Response) => {
  const positions = db.prepare(
    'SELECT ticker, shares, avg_cost FROM paper_positions WHERE user_id = ? AND shares > 0'
  ).all(req.user!.id) as { ticker: string; shares: number; avg_cost: number }[];

  if (positions.length === 0) { res.json([]); return; }

  const quotes = await Promise.allSettled(positions.map(p => getQuote(p.ticker)));
  const enriched = positions.map((p, i) => {
    const price = quotes[i].status === 'fulfilled' ? (quotes[i] as PromiseFulfilledResult<{ price: number }>).value.price : p.avg_cost;
    const value = price * p.shares;
    const cost = p.avg_cost * p.shares;
    return {
      ticker: p.ticker,
      shares: p.shares,
      avgCost: p.avg_cost,
      currentPrice: price,
      value,
      cost,
      unrealizedPL: value - cost,
      unrealizedPLPercent: cost > 0 ? ((value - cost) / cost) * 100 : 0,
    };
  });
  res.json(enriched);
});

router.get('/orders', requireAuth, (req: AuthRequest, res: Response) => {
  const orders = db.prepare(
    'SELECT * FROM paper_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 100'
  ).all(req.user!.id);
  res.json(orders);
});

router.post('/order', requireAuth, async (req: AuthRequest, res: Response) => {
  const { ticker, action, shares, order_type = 'market', limit_price } = req.body as {
    ticker: string; action: 'buy' | 'sell'; shares: number; order_type?: string; limit_price?: number;
  };
  if (!ticker || !action || !shares) {
    res.status(400).json({ error: 'ticker, action, and shares are required' }); return;
  }
  if (!['buy', 'sell'].includes(action)) {
    res.status(400).json({ error: 'action must be buy or sell' }); return;
  }

  const account = ensureAccount(req.user!.id);
  let fillPrice: number;

  try {
    const quote = await getQuote(ticker.toUpperCase());
    fillPrice = quote.price;
    const slippage = fillPrice * 0.001 * (action === 'buy' ? 1 : -1);
    fillPrice = parseFloat((fillPrice + slippage).toFixed(4));
  } catch {
    res.status(400).json({ error: `Could not get price for ${ticker}` }); return;
  }

  if (action === 'buy') {
    const cost = fillPrice * shares;
    if (cost > account.cash_balance) {
      res.status(400).json({ error: `Insufficient cash. Need $${cost.toFixed(2)}, have $${account.cash_balance.toFixed(2)}` });
      return;
    }
    db.prepare('UPDATE paper_accounts SET cash_balance = cash_balance - ? WHERE user_id = ?').run(cost, req.user!.id);
    const existing = db.prepare('SELECT shares, avg_cost FROM paper_positions WHERE user_id = ? AND ticker = ?').get(req.user!.id, ticker.toUpperCase()) as { shares: number; avg_cost: number } | undefined;
    if (existing) {
      const newShares = existing.shares + shares;
      const newAvg = (existing.avg_cost * existing.shares + fillPrice * shares) / newShares;
      db.prepare('UPDATE paper_positions SET shares = ?, avg_cost = ?, updated_at = datetime(\'now\') WHERE user_id = ? AND ticker = ?').run(newShares, newAvg, req.user!.id, ticker.toUpperCase());
    } else {
      db.prepare('INSERT INTO paper_positions (user_id, ticker, shares, avg_cost) VALUES (?, ?, ?, ?)').run(req.user!.id, ticker.toUpperCase(), shares, fillPrice);
    }
  } else {
    const position = db.prepare('SELECT shares FROM paper_positions WHERE user_id = ? AND ticker = ?').get(req.user!.id, ticker.toUpperCase()) as { shares: number } | undefined;
    if (!position || position.shares < shares) {
      res.status(400).json({ error: `Insufficient shares. Have ${position?.shares ?? 0}, need ${shares}` });
      return;
    }
    const proceeds = fillPrice * shares;
    db.prepare('UPDATE paper_accounts SET cash_balance = cash_balance + ? WHERE user_id = ?').run(proceeds, req.user!.id);
    const newShares = position.shares - shares;
    if (newShares <= 0) {
      db.prepare('DELETE FROM paper_positions WHERE user_id = ? AND ticker = ?').run(req.user!.id, ticker.toUpperCase());
    } else {
      db.prepare('UPDATE paper_positions SET shares = ?, updated_at = datetime(\'now\') WHERE user_id = ? AND ticker = ?').run(newShares, req.user!.id, ticker.toUpperCase());
    }
  }

  const orderId = db.prepare(
    'INSERT INTO paper_orders (user_id, ticker, action, order_type, shares, limit_price, fill_price, status, filled_at) VALUES (?, ?, ?, ?, ?, ?, ?, \'filled\', datetime(\'now\'))'
  ).run(req.user!.id, ticker.toUpperCase(), action, order_type, shares, limit_price ?? null, fillPrice).lastInsertRowid;

  res.status(201).json({ orderId, ticker: ticker.toUpperCase(), action, shares, fillPrice, status: 'filled' });
});

router.post('/reset', requireAuth, (req: AuthRequest, res: Response) => {
  db.prepare('DELETE FROM paper_positions WHERE user_id = ?').run(req.user!.id);
  db.prepare('DELETE FROM paper_orders WHERE user_id = ?').run(req.user!.id);
  db.prepare('UPDATE paper_accounts SET cash_balance = 100000, reset_count = reset_count + 1, last_reset = datetime(\'now\') WHERE user_id = ?').run(req.user!.id);
  res.json({ message: 'Paper account reset to $100,000', cashBalance: 100000 });
});

export default router;
