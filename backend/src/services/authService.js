const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const { generateToken } = require('../utils/token');

// Email regex pattern for RFC 5322 compliance checking
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Register a new user and initialize their wallet
 */
const registerUser = async ({ name, email, password }) => {
  // 1. Validation
  if (!name || typeof name !== 'string' || !name.trim()) {
    const error = new Error('Name is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    const error = new Error('A valid email address is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    const error = new Error('Password must be at least 6 characters long.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 2. Duplicate email check
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('An account with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // 3. Hash password (NEVER store plain-text passwords)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 4. Create User
  const defaultUsername = normalizedEmail.split('@')[0] + '_' + Math.random().toString(36).substring(2, 6);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    username: defaultUsername,
    passwordHash,
    role: 'USER',
    isActive: true
  });

  // 5. Create exactly one Wallet for the new user
  const wallet = await Wallet.create({
    userId: user._id,
    vesBalance: 0,
    amazonVouchersTotal: 0
  });

  // 6. Generate JWT containing safe identity info
  const token = generateToken(user);

  // 7. Return safe information (NEVER return passwordHash)
  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    },
    wallet: {
      id: wallet._id.toString(),
      vesBalance: wallet.vesBalance,
      amazonVouchersTotal: wallet.amazonVouchersTotal
    }
  };
};

/**
 * Authenticate existing user with email and password
 */
const loginUser = async ({ email, password }) => {
  // 1. Validation
  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.toLowerCase().trim();

  // 2. Locate user
  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    // Generic error message to prevent account enumeration
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // 3. Verify password hash
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account has been deactivated. Please contact support.');
    error.statusCode = 403;
    throw error;
  }

  // 4. Generate JWT
  const token = generateToken(user);

  // 5. Return safe payload (NEVER return passwordHash)
  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};

/**
 * Retrieve user by ID without sensitive credentials
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-passwordHash');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  registerUser,
  loginUser,
  getUserById
};
