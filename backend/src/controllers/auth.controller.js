const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { getOrCreateWallet } = require('../services/wallet.service');
const { logAuditEvent } = require('../services/audit.service');
const { JWT_SECRET } = require('../middleware/auth.middleware');

// In-memory demo users store for fallback/quick testing
const inMemoryUsers = new Map();

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    {
      userId: user._id ? user._id.toString() : user.id,
      username: user.username,
      role: user.role || 'USER'
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username, email, and password.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let user = null;
    if (getDBStatus()) {
      try {
        const existing = await User.findOne({ $or: [{ email }, { username }] });
        if (existing) {
          return res.status(400).json({
            success: false,
            error: 'Username or email already in use.'
          });
        }
        user = await User.create({
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          passwordHash,
          name: name || username
        });
      } catch (err) {
        console.warn('[Register DB fallback]:', err.message);
      }
    }

    if (!user) {
      const id = `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      user = {
        _id: id,
        id,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        name: name || username,
        role: 'USER'
      };
      inMemoryUsers.set(user.username, user);
    }

    const token = signToken(user);
    const wallet = await getOrCreateWallet(user._id || user.id);

    await logAuditEvent({
      userId: user._id || user.id,
      event: 'USER_REGISTER',
      details: { username: user.username },
      req
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      },
      wallet: {
        vesBalance: wallet.vesBalance,
        gemsBalance: wallet.gemsBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Login existing user
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide username and password.'
      });
    }

    let user = null;
    if (getDBStatus()) {
      try {
        user = await User.findOne({
          $or: [{ username: username.toLowerCase() }, { email: username.toLowerCase() }]
        });
      } catch (e) {
        // fallback
      }
    }

    if (!user) {
      user = inMemoryUsers.get(username.toLowerCase());
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid username or password.'
      });
    }

    const token = signToken(user);
    const wallet = await getOrCreateWallet(user._id || user.id);

    await logAuditEvent({
      userId: user._id || user.id,
      event: 'USER_LOGIN',
      details: { username: user.username },
      req
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      },
      wallet: {
        vesBalance: wallet.vesBalance,
        gemsBalance: wallet.gemsBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user details and wallet
 */
const getMe = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user.userId);
    res.json({
      success: true,
      user: req.user,
      wallet: {
        vesBalance: wallet.vesBalance,
        gemsBalance: wallet.gemsBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Demo Login: provides instant token for evaluation accounts
 */
const demoLogin = async (req, res, next) => {
  try {
    const { accountType = 'new' } = req.body;
    const username = accountType === 'vip' ? 'demo_day7' : (accountType === 'day2' ? 'demo_day2' : 'demo_new');

    let user = null;
    if (getDBStatus()) {
      try {
        user = await User.findOne({ username });
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
      } catch (err) {
        console.warn('[Demo login DB lookup]:', err.message);
      }
    }

    if (!user) {
      user = inMemoryUsers.get(username);
      if (!user) {
        const id = new mongoose.Types.ObjectId().toString();
        user = {
          _id: id,
          id,
          username,
          name: accountType === 'vip' ? 'VIP VELoop Tester' : (accountType === 'day2' ? 'Active Streak Tester' : 'New VELoop Member'),
          role: 'TESTER'
        };
        inMemoryUsers.set(username, user);
      }
    }

    const token = signToken(user);
    const userId = user._id || user.id;
    const wallet = await getOrCreateWallet(userId);

    res.json({
      success: true,
      token,
      user: {
        id: userId,
        username: user.username,
        name: user.name,
        role: user.role
      },
      wallet: {
        vesBalance: wallet.vesBalance,
        gemsBalance: wallet.gemsBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  demoLogin,
  inMemoryUsers
};
