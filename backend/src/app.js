const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const streakRoutes = require('./routes/streak.routes');
const walletRoutes = require('./routes/wallet.routes');

const app = express();

// Configure CORS for React frontend communication (supports 5173, 5174, etc.)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile, curl, postman)
    if (!origin) return callback(null, true);

    // Allow any localhost/127.0.0.1 port (e.g. 5173, 5174) or configured clientURL
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:') ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint & Root Welcome
app.get(['/', '/api', '/api/health', '/health'], (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'VELoop Rewards API is running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      streak: '/api/daily-streak',
      wallet: '/api/wallet'
    },
    timestamp: new Date().toISOString()
  });
});

const devRoutes = require('./routes/dev.routes');
const platformRoutes = require('./routes/platform.routes');

// Mount Routes (supports both /api/path and /path for resilient frontend compatibility)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/daily-streak', '/daily-streak'], streakRoutes);
app.use(['/api/wallet', '/wallet'], walletRoutes);
app.use(['/api/dev', '/dev'], devRoutes);
app.use(['/api', '/'], platformRoutes);

const errorHandler = require('./middleware/errorHandler.middleware');
app.use(errorHandler);

module.exports = app;
