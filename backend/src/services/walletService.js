const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');

/**
 * Retrieve user's wallet
 * @param {string} userId - Authenticated user ID
 */
const getWalletByUserId = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      vesBalance: 0,
      amazonVouchersTotal: 0,
      gemsBalance: 0
    });
  }

  return {
    id: wallet._id.toString(),
    vesBalance: wallet.vesBalance || 0,
    amazonVouchersTotal: wallet.amazonVouchersTotal || 0,
    gemsBalance: wallet.gemsBalance || 0
  };
};

/**
 * Retrieve paginated wallet transactions for user
 * @param {string} userId - Authenticated user ID
 * @param {Object} query - { page, limit }
 */
const getWalletTransactions = async (userId, { page = 1, limit = 20 } = {}) => {
  let pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;

  let limitNum = parseInt(limit, 10);
  if (isNaN(limitNum) || limitNum < 1) limitNum = 20;
  if (limitNum > 100) limitNum = 100;

  const skip = (pageNum - 1) * limitNum;
  const filter = { userId };

  const total = await WalletTransaction.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const transactions = await WalletTransaction.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const formattedTransactions = transactions.map((tx) => ({
    transactionId: tx.transactionId,
    type: tx.type,
    rewardType: tx.rewardType,
    amount: tx.amount,
    currency: tx.currency,
    source: tx.source,
    streakDay: tx.streakDay,
    referenceId: tx.referenceId,
    balanceBefore: tx.balanceBefore,
    balanceAfter: tx.balanceAfter,
    status: tx.status,
    createdAt: tx.createdAt ? new Date(tx.createdAt).toISOString() : null
  }));

  return {
    transactions: formattedTransactions,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  };
};

module.exports = {
  getWalletByUserId,
  getWalletTransactions
};
