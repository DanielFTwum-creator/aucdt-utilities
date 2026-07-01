import db from '../db/schema';
import { getQuote } from './market';

let intervalId: NodeJS.Timeout | null = null;

export function startAlertWorker() {
  if (intervalId) return;

  console.log('Starting Price Alerts background worker...');
  
  // Run every 60 seconds
  intervalId = setInterval(async () => {
    try {
      const activeAlerts = db.prepare(
        'SELECT id, ticker, condition, target_value FROM alerts WHERE active = 1'
      ).all() as { id: number; ticker: string; condition: string; target_value: number }[];

      if (activeAlerts.length === 0) return;

      // Group alerts by ticker to minimize API calls
      const tickerSet = new Set(activeAlerts.map(a => a.ticker));
      const quotes = new Map<string, number>();

      for (const ticker of tickerSet) {
        try {
          const q = await getQuote(ticker);
          quotes.set(ticker, q.price);
        } catch (e) {
          console.error(`Alert worker failed to fetch quote for ${ticker}:`, e);
        }
      }

      const triggerStmt = db.prepare(
        "UPDATE alerts SET active = 0, triggered_at = datetime('now') WHERE id = ?"
      );

      try {
        db.exec('BEGIN TRANSACTION');
        for (const alert of activeAlerts) {
          const currentPrice = quotes.get(alert.ticker);
          if (currentPrice === undefined) continue;

          let triggered = false;
          if (alert.condition === 'above' && currentPrice >= alert.target_value) {
            triggered = true;
          } else if (alert.condition === 'below' && currentPrice <= alert.target_value) {
            triggered = true;
          }

          if (triggered) {
            triggerStmt.run(alert.id);
            console.log(`[ALERTS] Triggered: ${alert.ticker} is ${alert.condition} ${alert.target_value} (Current: ${currentPrice})`);
          }
        }
        db.exec('COMMIT');
      } catch (txErr) {
        db.exec('ROLLBACK');
        throw txErr;
      }
    } catch (err) {
      console.error('Alert worker error:', err);
    }
  }, 60 * 1000);
}
