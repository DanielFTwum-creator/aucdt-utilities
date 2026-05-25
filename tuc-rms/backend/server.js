const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const { auditMiddleware } = require('./middleware');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Audit middleware (logs authenticated POST/PUT/DELETE)
app.use(auditMiddleware);

// Rate limiting on login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Routes
app.use('/api/auth/login', loginLimiter);
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
app.use('/api/users', require('./routes/users'));
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/results', require('./routes/results'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/test', require('./routes/test-runner'));

// Health checks
app.get('/api/health', (req, res) => {
  const uptime = Math.floor(process.uptime());
  res.json({
    status: 'ok',
    service: 'tuc-rms-api',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health/full', async (req, res) => {
  const db = require('./db');
  const uptime = Math.floor(process.uptime());
  const memUsage = process.memoryUsage();

  try {
    await db.execute('SELECT 1');
    const dbStatus = 'ok';
    res.json({
      status: 'ok',
      service: 'tuc-rms-api',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatus,
        error: null
      },
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      }
    });
  } catch (err) {
    res.json({
      status: 'degraded',
      service: 'tuc-rms-api',
      timestamp: new Date().toISOString(),
      uptime: uptime,
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'error',
        error: err.message
      },
      memory: {
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        rss: Math.round(memUsage.rss / 1024 / 1024)
      }
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`TUC RMS Server running on port ${PORT}`));
