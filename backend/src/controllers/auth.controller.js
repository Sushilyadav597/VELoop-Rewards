const authService = require('../services/authService');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/token');

// In-memory demo users store for fallback/quick testing
const inMemoryUsers = new Map();

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    const effectiveName = name || username || (email ? email.split('@')[0] : 'User');
    const result = await authService.registerUser({
      name: effectiveName,
      email,
      password
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token: result.token,
      user: result.user,
      wallet: result.wallet
    });
  } catch (error) {
    const status = error.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: error.message || 'Registration failed.'
    });
  }
};

/**
 * Log in existing user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const result = await authService.loginUser({ email, username, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: result.token,
      user: result.user,
      wallet: result.wallet
    });
  } catch (error) {
    const status = error.statusCode || 401;
    return res.status(status).json({
      success: false,
      error: error.message || 'Authentication failed.'
    });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const userProfile = await authService.getUserById(userId);

    const wallet = await Wallet.findOne({ userId });

    return res.status(200).json({
      success: true,
      user: userProfile,
      wallet: wallet ? {
        id: wallet._id.toString(),
        vesBalance: wallet.vesBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      } : null
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve profile.'
    });
  }
};

/**
 * Demo Login: provides instant token for evaluation accounts
 * POST /api/auth/demo-login
 */
const demoLogin = async (req, res, next) => {
  try {
    const { accountType = 'new' } = req.body;
    const username = accountType === 'vip' ? 'demo_day7' : (accountType === 'day2' ? 'demo_day2' : 'demo_new');

    let user = await User.findOne({
      $or: [{ username }, { email: `${username}@veloop.io` }]
    });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('password123', salt);
      user = await User.create({
        username,
        email: `${username}@veloop.io`,
        passwordHash,
        name: accountType === 'vip' ? 'VIP VELoop Tester' : (accountType === 'day2' ? 'Active Streak Tester' : 'New VELoop Member'),
        role: 'TESTER'
      });
    }

    let wallet = await Wallet.findOne({ userId: user._id });
    if (!wallet) {
      wallet = await Wallet.create({
        userId: user._id,
        vesBalance: 100,
        amazonVouchersTotal: 0
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      },
      wallet: {
        id: wallet._id.toString(),
        vesBalance: wallet.vesBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Demo login failed.'
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin,
  inMemoryUsers
};
