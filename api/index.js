const app = require('../backend/server');
const { connectDB } = require('../backend/src/config/db');

let dbInitPromise = null;

module.exports = async (req, res) => {
  // Normalize req.url if Vercel internal rewrite passed x-matched-path or /api/index.js
  if (req.headers && req.headers['x-matched-path']) {
    req.url = req.headers['x-matched-path'];
  } else if (req.url && req.url.startsWith('/api/index.js')) {
    req.url = req.url.replace('/api/index.js', '') || '/';
  }

  // Ensure DB connection is initiated once and cached across warm lambda containers
  if (!dbInitPromise) {
    dbInitPromise = connectDB().catch(err => {
      console.warn('[Vercel DB Init Notice]:', err.message);
      return false;
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
        message: err.message
      });
    }
  }
};

