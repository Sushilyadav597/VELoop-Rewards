const app = require('../backend/server');
const { connectDB } = require('../backend/src/config/db');

module.exports = async (req, res) => {
  // Ensure database connection is established before serving requests
  await connectDB();
  return app(req, res);
};
