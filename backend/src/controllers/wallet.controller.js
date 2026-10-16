const walletService = require('../services/walletService');

const getWallet = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const wallet = await walletService.getWalletByUserId(userId);
    return res.status(200).json({
      success: true,
      data: wallet,
      wallet
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Failed to retrieve wallet.'
    });
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const { page, limit } = req.query;
    const result = await walletService.getWalletTransactions(userId, { page, limit });
    return res.status(200).json({
      success: true,
      data: result,
      transactions: result.transactions,
      pagination: result.pagination
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Failed to retrieve transactions.'
    });
  }
};

module.exports = {
  getWallet,
  getTransactions
};
