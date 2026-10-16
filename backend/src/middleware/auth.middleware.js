const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'veloop_super_secure_jwt_secret_key_2026_internship_production';

/**
 * Protect routes via Bearer JWT token
 * Injects req.user with decoded verified identity.
 */
const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please provide a valid Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const uid = decoded.userId || decoded.id;
    // Securely bind user identity exclusively from the verified token
    req.user = {
      userId: uid,
      id: uid,
      username: decoded.username || (decoded.email ? decoded.email.split('@')[0] : 'user'),
      email: decoded.email,
      role: decoded.role || 'USER'
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Your session has expired. Please log in again.'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid or forged authentication token.'
    });
  }
};

/**
 * Optional Auth: If Bearer JWT is valid, injects req.user; otherwise proceeds with req.user = null.
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const uid = decoded.userId || decoded.id;
      req.user = {
        userId: uid,
        id: uid,
        username: decoded.username || (decoded.email ? decoded.email.split('@')[0] : 'user'),
        email: decoded.email,
        role: decoded.role || 'USER'
      };
    }
  } catch (err) {
    // Non-blocking: proceed as guest
    req.user = null;
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth,
  JWT_SECRET
};

