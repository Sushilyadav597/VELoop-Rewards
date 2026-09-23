const { getOrCreateWallet, getWalletTransactions } = require('../services/wallet.service');

const getWallet = async (req, res, next) => {
  try {
    const wallet = await getOrCreateWallet(req.user.userId);
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
    const transactions = await getWalletTransactions(req.user.userId);
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
