const app = require('../backend/src/app');
const { connectDB } = require('../backend/src/config/db');

let dbInitPromise = null;

module.exports = async (req, res) => {
  // Strip /api/index.js if Vercel internal rewrite prepended it
  if (req.url && req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/';
  }

  // Ensure DB connection is initiated once and cached across warm lambda containers
  if (!dbInitPromise) {
    dbInitPromise = connectDB().catch(err => {
      console.warn('[Vercel DB Init Notice]:', err.message);
      dbInitPromise = null; // Reset so subsequent requests can retry
      throw err;
    });
  }

  try {
    await dbInitPromise;
    return app(req, res);
  } catch (err) {
    console.error('[Vercel Serverless Error]:', err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'VELoop API Serverless Error',
        message: err.message || 'Database connection or server error.'
      });
    }
  }
};

