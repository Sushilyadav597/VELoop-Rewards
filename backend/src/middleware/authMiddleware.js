const { verifyToken } = require('../utils/token');
const User = require('../models/User');

/**
 * Authentication middleware that verifies JWT and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Missing Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header is required.'
      });
    }

    // 2. Malformed token format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1].trim()) {
      return res.status(401).json({
        success: false,
        error: 'Malformed authorization token. Format must be: Bearer <token>'
      });
    }

    const token = parts[1].trim();

    // 3. Verify JWT
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired. Please log in again.'
        });
      }
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication token.'
      });
    }

    // 4. Load user to ensure active account and current state
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or account is deactivated.'
      });
    }

    // 5. Attach safe user object to request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication verification failed.'
    });
  }
};

module.exports = {
  authenticate
};
