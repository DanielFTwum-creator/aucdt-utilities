import express from 'express';
import cors from 'cors';
import path from 'path';
import {generalLimiter} from './rateLimiter';
import fs from 'fs';
import routes from './routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

app.use(cors());
app.use(express.json());
app.use(generalLimiter);

// ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {recursive: true});
}

// Serve uploaded files
app.use('/uploads', express.static(uploadsDir));

// API routes
app.use('/api', routes);

// health
app.get('/api/health', (_req, res) => {
  res.json({status: 'ok', env: process.env.NODE_ENV || 'development'});
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`TechBridge Strategy Dashboard backend listening on port ${PORT}`);
});
