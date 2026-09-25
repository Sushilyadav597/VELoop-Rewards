const mongoose = require('mongoose');
const { ROTATING_DROPS } = require('../config/rotatingRewardsConfig');
const DailyRotatingClaim = require('../models/DailyRotatingClaim');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const { getOrCreateWallet } = require('./wallet.service');
const { getServerTime } = require('../utils/time.utils');
const { getDBStatus } = require('../config/db');

// In-memory fallback if MongoDB is offline
const inMemoryRotatingClaims = new Map();

/**
 * Format server time into a consistent date string: YYYY-MM-DD
 */
const getDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Fetch current active rotating drop and check user claim status
 */
const getTodayDropStatus = async (userId) => {
  const now = getServerTime();
  const dateKey = getDateKey(now);
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

  const todayDrop = ROTATING_DROPS.find(d => d.dayOfWeek === dayOfWeek) || ROTATING_DROPS[0];

  // Calculate next rotation at midnight server time
  const nextRotation = new Date(now);
  nextRotation.setHours(24, 0, 0, 0);
  const cooldownRemainingMs = Math.max(0, nextRotation.getTime() - now.getTime());

  let isClaimedToday = false;
  let claimRecord = null;

  const userIdStr = userId.toString();

  if (getDBStatus()) {
    try {
      claimRecord = await DailyRotatingClaim.findOne({
        $or: [{ userId }, { userId: userIdStr }],
        dateKey
      });
      if (claimRecord) isClaimedToday = true;
    } catch (err) {
      console.warn('[RotatingReward DB fetch notice]:', err.message);
    }
  }

  if (!claimRecord) {
    const memoryKey = `${userIdStr}_${dateKey}`;
    if (inMemoryRotatingClaims.has(memoryKey)) {
      isClaimedToday = true;
      claimRecord = inMemoryRotatingClaims.get(memoryKey);
    }
  }

  return {
    success: true,
    serverTime: now.toISOString(),
    dateKey,
    dayOfWeek,
    isClaimedToday,
    claimedAt: claimRecord ? claimRecord.claimedAt : null,
    nextRotationAt: nextRotation.toISOString(),
    cooldownRemainingMs,
    todayDrop,
    schedule: ROTATING_DROPS
  };
};

/**
 * Claim the authoritative rotating drop for today
 */
const claimTodayDrop = async (userId) => {
  const now = getServerTime();
  const dateKey = getDateKey(now);
  const dayOfWeek = now.getDay();
  const userIdStr = userId.toString();

  const todayDrop = ROTATING_DROPS.find(d => d.dayOfWeek === dayOfWeek) || ROTATING_DROPS[0];

  // Next rotation timestamp
  const nextRotation = new Date(now);
  nextRotation.setHours(24, 0, 0, 0);

  // 1. Verify not already claimed today
  let alreadyClaimed = false;
  if (getDBStatus()) {
    try {
      const existing = await DailyRotatingClaim.findOne({
        $or: [{ userId }, { userId: userIdStr }],
        dateKey
      });
      if (existing) alreadyClaimed = true;
    } catch (err) {
      console.warn('[RotatingReward DB check notice]:', err.message);
    }
  }

  const memoryKey = `${userIdStr}_${dateKey}`;
  if (!alreadyClaimed && inMemoryRotatingClaims.has(memoryKey)) {
    alreadyClaimed = true;
  }

  if (alreadyClaimed) {
    const error = new Error("You have already claimed today's daily rotating drop! Come back tomorrow for the next reward.");
    error.statusCode = 400;
    throw error;
  }

  // 2. Calculate balance updates
  const wallet = await getOrCreateWallet(userId);
  const incUpdates = {};

  if (todayDrop.currency === 'VES') {
    incUpdates.vesBalance = todayDrop.amount;
  } else {
    // Amazon Voucher / INR
    incUpdates.amazonVouchersTotal = todayDrop.amount;
  }

  if (todayDrop.bonusVes) {
    incUpdates.vesBalance = (incUpdates.vesBalance || 0) + todayDrop.bonusVes;
  }

  if (todayDrop.bonusGems) {
    incUpdates.gemsBalance = (incUpdates.gemsBalance || 0) + todayDrop.bonusGems;
  }

  let updatedWallet = null;
  const txId = `TX-ROT-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  if (getDBStatus()) {
    try {
      // Record claim first with unique index check
      await DailyRotatingClaim.create({
        userId,
        dateKey,
        dayOfWeek,
        dropName: todayDrop.name,
        theme: todayDrop.theme,
        reward: todayDrop,
        claimedAt: now
      });

      // Update wallet atomically
      updatedWallet = await Wallet.findOneAndUpdate(
        { $or: [{ userId }, { userId: userIdStr }] },
        { $inc: incUpdates },
        { new: true, upsert: true }
      );

      // Record transaction
      await WalletTransaction.create({
        transactionId: txId,
        userId,
        currency: todayDrop.currency,
        type: 'CREDIT',
        amount: todayDrop.amount,
        source: 'DAILY_ROTATING_DROP',
        referenceId: `ROT-${dateKey}`,
        balanceBefore: wallet.vesBalance || 0,
        balanceAfter: updatedWallet.vesBalance || 0,
        status: 'COMPLETED'
      });
    } catch (dbErr) {
      if (dbErr.code === 11000) {
        const error = new Error("Today's rotating reward was already claimed.");
        error.statusCode = 409;
        throw error;
      }
      console.warn('[RotatingReward DB claim fallback]:', dbErr.message);
    }
  }

  // Fallback memory state update
  if (!updatedWallet) {
    inMemoryRotatingClaims.set(memoryKey, {
      userId: userIdStr,
      dateKey,
      dayOfWeek,
      dropName: todayDrop.name,
      theme: todayDrop.theme,
      reward: todayDrop,
      claimedAt: now
    });

    if (incUpdates.vesBalance) wallet.vesBalance = (wallet.vesBalance || 0) + incUpdates.vesBalance;
    if (incUpdates.gemsBalance) wallet.gemsBalance = (wallet.gemsBalance || 0) + incUpdates.gemsBalance;
    if (incUpdates.amazonVouchersTotal) wallet.amazonVouchersTotal = (wallet.amazonVouchersTotal || 0) + incUpdates.amazonVouchersTotal;
    updatedWallet = wallet;
  }

  return {
    success: true,
    message: `Claimed today's rotating drop: ${todayDrop.subtitle}!`,
    reward: todayDrop,
    wallet: updatedWallet,
    nextRotationAt: nextRotation.toISOString()
  };
};

/**
 * Clear rotating drop claims for user (used during dev reset)
 */
const resetRotatingClaimsForUser = async (userId) => {
  const userIdStr = userId.toString();
  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      await DailyRotatingClaim.deleteMany({ userId });
    } catch (err) {
      console.warn('[RotatingReward DB reset notice]:', err.message);
    }
  }

  // Clear in-memory
  for (const key of inMemoryRotatingClaims.keys()) {
    if (key.startsWith(`${userIdStr}_`)) {
      inMemoryRotatingClaims.delete(key);
    }
  }
};

module.exports = {
  getTodayDropStatus,
  claimTodayDrop,
  resetRotatingClaimsForUser
};
