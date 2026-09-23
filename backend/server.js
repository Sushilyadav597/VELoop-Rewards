require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./src/config/db');
const { apiLimiter } = require('./src/middleware/rateLimiter.middleware');
const errorHandler = require('./src/middleware/errorHandler.middleware');
const { getServerTime } = require('./src/utils/time.utils');

// Route imports
const authRoutes = require('./src/routes/auth.routes');
const streakRoutes = require('./src/routes/streak.routes');
const walletRoutes = require('./src/routes/wallet.routes');
const devRoutes = require('./src/routes/dev.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Security & Parsing Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (e.g. Postman, curl) or any localhost origin
    if (!origin) return callback(null, true);
    if (
      origin === process.env.CLIENT_URL ||
      /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health & System Info
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VELoop Rewards - Daily Streak Backend API',
    serverTime: getServerTime().toISOString(),
    dbConnected: getDBStatus()
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/daily-streak', streakRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/dev', devRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to VELoop Rewards Daily Streak API',
    documentation: '/docs/API_DOCUMENTATION.md',
    serverTime: getServerTime().toISOString()
  });
});

// Centralized Error Handler (masks internal Mongo/system exceptions)
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VELoop Rewards Backend Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🛡️  Server-Side Authority: ENABLED`);
    console.log(`⏰ Authoritative Server Time: ${getServerTime().toISOString()}`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ [PORT CONFLICT]: Port ${PORT} is already in use by another process.`);
      console.error(`👉 Run: npx kill-port ${PORT} to free the port.\n`);
      process.exit(1);
    } else {
      console.error('Server error:', err);
    }
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
