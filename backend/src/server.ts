import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiRateLimiter } from './middleware/rateLimitMiddleware';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(apiRateLimiter);

// Routes
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, '../public', 'index.html')); });
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Auth API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
