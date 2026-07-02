import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import marketRouter from './routes/market';
import watchlistRouter from './routes/watchlist';
import portfolioRouter from './routes/portfolio';
import paperRouter from './routes/paper';
import alertsRouter from './routes/alerts';
import aiRouter from './routes/ai';
import adminRouter from './routes/admin';

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
}));

app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/market', marketRouter);
app.use('/api/watchlist', watchlistRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/paper', paperRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/admin', adminRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

import { startAlertWorker } from './services/alertWorker';

app.listen(PORT, () => {
  console.log(`StockPulse API running on http://localhost:${PORT}`);
  startAlertWorker();
});

export default app;
