const authService = require('../services/authService');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      token: result.token,
      user: result.user,
      wallet: result.wallet
    });
  } catch (error) {
    const status = error.statusCode || 500;
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: result.token,
      user: result.user
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
const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile.'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
