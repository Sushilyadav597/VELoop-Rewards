const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const streakRoutes = require('./routes/streakRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

// Configure CORS for React frontend communication
const clientURL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman) or matching frontend
    if (!origin || origin === clientURL || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'VELoop Rewards API is running'
  });
});

const devRoutes = require('./routes/dev.routes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/daily-streak', streakRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/dev', devRoutes);

module.exports = app;
