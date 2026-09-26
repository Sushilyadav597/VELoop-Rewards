const walletService = require('../services/walletService');

/**
 * GET /api/wallet
 * Returns authenticated user's wallet balances
 */
const getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    const wallet = await walletService.getWalletByUserId(userId);

    return res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve wallet.'
    });
  }
};

/**
 * GET /api/wallet/transactions
 * Returns authenticated user's paginated transaction history
 */
const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const result = await walletService.getWalletTransactions(userId, { page, limit });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve wallet transactions.'
    });
  }
};

module.exports = {
  getWallet,
  getTransactions
};
