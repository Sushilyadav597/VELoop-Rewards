const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { getDBStatus } = require('../config/db');
const { getServerTime } = require('../utils/time.utils');

const inMemoryWallets = new Map();
const inMemoryTransactions = [];

const getOrCreateWallet = async (userId) => {
  const userIdStr = userId.toString();
  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = await Wallet.create({
          userId,
          vesBalance: 100,
          gemsBalance: 120, // initial 120 Gems shown on design navbar
          amazonVouchersTotal: 0
        });
      }
      return wallet;
    } catch (err) {
      console.warn('[Wallet DB fallback]:', err.message);
    }
  }

  if (!inMemoryWallets.has(userIdStr)) {
    inMemoryWallets.set(userIdStr, {
      userId: userIdStr,
      vesBalance: 100,
      gemsBalance: 120,
      amazonVouchersTotal: 0,
      updatedAt: getServerTime()
    });
  }
  return inMemoryWallets.get(userIdStr);
};

const creditRewardToWallet = async ({ userId, reward, streakDay, referenceId }) => {
  const userIdStr = userId.toString();
  const wallet = await getOrCreateWallet(userId);
  const now = getServerTime();
  const txId = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  let balanceBefore = 0;
  let balanceAfter = 0;
  const currency = reward.currency || 'VES';

  if (currency === 'VES') {
    balanceBefore = wallet.vesBalance;
    balanceAfter = balanceBefore + reward.amount;
  } else {
    // Gift Card / INR
    balanceBefore = wallet.amazonVouchersTotal || 0;
    balanceAfter = balanceBefore + reward.amount;
  }

  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      const updateFields = currency === 'VES'
        ? { $inc: { vesBalance: reward.amount } }
        : { $inc: { amazonVouchersTotal: reward.amount } };

      const updatedWallet = await Wallet.findOneAndUpdate(
        { userId },
        updateFields,
        { new: true, upsert: true }
      );

      const txRecord = await WalletTransaction.create({
        transactionId: txId,
        userId,
        currency,
        type: 'CREDIT',
        amount: reward.amount,
        source: 'DAILY_STREAK',
        referenceId,
        streakDay,
        balanceBefore,
        balanceAfter,
        status: 'COMPLETED'
      });

      return {
        wallet: updatedWallet,
        transaction: txRecord
      };
    } catch (err) {
      console.warn('[Wallet credit DB error, falling back]:', err.message);
    }
  }

  // Fallback memory update
  const memWallet = inMemoryWallets.get(userIdStr);
  if (currency === 'VES') {
    memWallet.vesBalance = balanceAfter;
  } else {
    memWallet.amazonVouchersTotal = balanceAfter;
  }
  memWallet.updatedAt = now;

  const memTx = {
    transactionId: txId,
    userId: userIdStr,
    currency,
    type: 'CREDIT',
    amount: reward.amount,
    source: 'DAILY_STREAK',
    referenceId,
    streakDay,
    balanceBefore,
    balanceAfter,
    status: 'COMPLETED',
    createdAt: now
  };
  inMemoryTransactions.unshift(memTx);

  return {
    wallet: memWallet,
    transaction: memTx
  };
};

const getWalletTransactions = async (userId, limit = 20) => {
  const userIdStr = userId.toString();
  if (getDBStatus()) {
    try {
      const txs = await WalletTransaction.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
      if (txs && txs.length > 0) return txs;
    } catch (err) {
      // fallback
    }
  }
  return inMemoryTransactions.filter(t => t.userId === userIdStr).slice(0, limit);
};

module.exports = {
  getOrCreateWallet,
  creditRewardToWallet,
  getWalletTransactions
};
