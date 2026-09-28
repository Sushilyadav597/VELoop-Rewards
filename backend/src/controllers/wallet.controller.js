const { getOrCreateWallet, getWalletTransactions } = require('../services/wallet.service');

const getWallet = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const wallet = await getOrCreateWallet(userId);
    res.json({
      success: true,
      wallet: {
        vesBalance: wallet.vesBalance,
        gemsBalance: wallet.gemsBalance,
        amazonVouchersTotal: wallet.amazonVouchersTotal,
        updatedAt: wallet.updatedAt
      }
    });
  } catch (err) {
    next(err);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const transactions = await getWalletTransactions(userId);
    res.json({
      success: true,
      transactions
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWallet,
  getTransactions
};
