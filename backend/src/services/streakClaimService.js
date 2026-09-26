const mongoose = require('mongoose');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const StreakReward = require('../models/StreakReward');
const StreakClaim = require('../models/StreakClaim');
const StreakCycle = require('../models/StreakCycle');
const WalletTransaction = require('../models/WalletTransaction');
const AuditLog = require('../models/AuditLog');
const streakService = require('./streakService');
const { getServerTime } = require('../utils/time.utils');

// In-flight concurrency lock per user ID to guard simultaneous requests
const inFlightClaims = new Set();

/**
 * Atomically process daily streak claim for authenticated user
 * @param {Object} params
 * @param {string} params.userId - Authenticated user ID
 * @param {string} params.ipAddress - Client IP address
 * @param {string} params.userAgent - Client User-Agent string
 * @returns {Promise<Object>} Claim result payload
 */
const claimReward = async ({ userId, ipAddress = '', userAgent = '' }) => {
  if (!userId) {
    const error = new Error('Authentication required.');
    error.statusCode = 401;
    throw error;
  }

  // 1. Verify User
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }
  if (!user.isActive) {
    const error = new Error('User account is deactivated.');
    error.statusCode = 403;
    throw error;
  }

  // 2. Verify Wallet
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    const error = new Error('Wallet not found for this user.');
    error.statusCode = 404;
    throw error;
  }

  // 3. Guard against simultaneous in-flight double-clicks in same event loop
  const lockKey = userId.toString();
  if (inFlightClaims.has(lockKey)) {
    const error = new Error('A reward claim for your account is currently being processed. Please wait.');
    error.statusCode = 409;
    throw error;
  }
  inFlightClaims.add(lockKey);

  let session = null;
  let supportsTransaction = false;

  // Cleanly detect whether MongoDB supports replica set transactions
  const topologyType = mongoose.connection.client?.topology?.description?.type;
  const isReplicaSet = ['ReplicaSetWithPrimary', 'Sharded', 'ReplicaSetNoPrimary'].includes(topologyType);

  if (isReplicaSet) {
    try {
      session = await mongoose.startSession();
      session.startTransaction();
      supportsTransaction = true;
    } catch (sessionErr) {
      if (session) {
        try {
          await session.endSession();
        } catch (e) {}
        session = null;
      }
      supportsTransaction = false;
    }
  }

  let claimDocCreated = false;
  let claimIdCreated = null;

  try {
    // 4. Authoritative Streak State from streakService
    const statusResult = await streakService.getStreakStatus(userId);
    const streakData = statusResult.data;

    if (!streakData.canClaim) {
      const error = new Error(
        streakData.streakStatus === 'COOLDOWN'
          ? 'Reward cooldown is active. Please wait until your next claim window.'
          : 'You are not eligible to claim a streak reward at this time.'
      );
      error.statusCode = 409;
      throw error;
    }

    const eligibleDay = streakData.currentDay;
    const cycleId = streakData.cycleId;
    const now = getServerTime();

    // 5. Authoritative Reward from MongoDB
    const reward = await StreakReward.findOne({ day: eligibleDay, active: true });
    if (!reward) {
      const error = new Error(`No active reward configuration found for Day ${eligibleDay}.`);
      error.statusCode = 404;
      throw error;
    }

    // 6. Currency & Ledger Field Resolution
    let fieldToUpdate = 'vesBalance';
    if (
      reward.currency === 'INR' ||
      reward.rewardType === 'GIFT_CARD' ||
      reward.rewardType === 'ULTIMATE_GIFT_CARD'
    ) {
      fieldToUpdate = 'amazonVouchersTotal';
    } else {
      fieldToUpdate = 'vesBalance';
    }

    const balanceBefore = Number(wallet[fieldToUpdate] || 0);
    const rewardAmount = Number(reward.amount || 0);
    const balanceAfter = balanceBefore + rewardAmount;

    // 7. Generate Unique Traceable IDs
    const claimId = `CLM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const transactionId = `TX-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    claimIdCreated = claimId;

    // 8. Create StreakClaim Document
    // Relies on { userId, cycleId, day } compound unique constraint
    const claim = new StreakClaim({
      claimId,
      userId: user._id,
      rewardId: reward._id,
      cycleId,
      day: eligibleDay,
      rewardType: reward.rewardType,
      amount: rewardAmount,
      currency: reward.currency,
      rewardSnapshot: {
        title: reward.title,
        subtitle: reward.subtitle,
        rewardType: reward.rewardType,
        currency: reward.currency,
        amount: rewardAmount,
        assetType: reward.assetType
      },
      transactionId,
      status: 'SUCCESS',
      claimedAt: now,
      ipAddress
    });

    try {
      await claim.save(supportsTransaction ? { session } : {});
      claimDocCreated = true;
    } catch (claimErr) {
      if (claimErr.code === 11000) {
        const conflictErr = new Error(`Day ${eligibleDay} reward has already been claimed for this cycle.`);
        conflictErr.statusCode = 409;
        throw conflictErr;
      }
      throw claimErr;
    }

    // 9. Atomic Wallet Increment
    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: wallet._id },
      { $inc: { [fieldToUpdate]: rewardAmount } },
      { new: true, ...(supportsTransaction ? { session } : {}) }
    );

    if (!updatedWallet) {
      const error = new Error('Wallet update failed.');
      error.statusCode = 500;
      throw error;
    }

    // 10. Create Traceable WalletTransaction
    const walletTx = new WalletTransaction({
      transactionId,
      userId: user._id,
      walletId: wallet._id,
      type: 'CREDIT',
      rewardType: reward.rewardType,
      amount: rewardAmount,
      currency: reward.currency,
      source: 'DAILY_STREAK',
      streakDay: eligibleDay,
      referenceId: claimId,
      balanceBefore,
      balanceAfter,
      status: 'COMPLETED'
    });
    await walletTx.save(supportsTransaction ? { session } : {});

    // 11. Update Active StreakCycle
    const config = await streakService.getActiveConfig();
    const cooldownMs = config.claimCooldownMs || 24 * 60 * 60 * 1000;
    const nextClaimDate = new Date(now.getTime() + cooldownMs);

    await StreakCycle.findOneAndUpdate(
      { cycleId, status: 'ACTIVE' },
      {
        currentStreak: eligibleDay,
        checkedInCount: eligibleDay,
        lastClaimAt: now,
        nextClaimAt: nextClaimDate
      },
      supportsTransaction ? { session } : {}
    );

    // 12. Create Security AuditLog
    const auditLog = new AuditLog({
      userId: user._id,
      action: 'CLAIM_SUCCESS',
      event: 'STREAK_CLAIM_SUCCESS',
      entity: 'STREAK_CLAIM',
      entityId: claimId,
      metadata: {
        cycleId,
        day: eligibleDay,
        amount: rewardAmount,
        currency: reward.currency,
        rewardType: reward.rewardType,
        transactionId,
        claimId
      },
      details: {
        balanceBefore,
        balanceAfter,
        creditedField: fieldToUpdate
      },
      ipAddress,
      userAgent
    });
    await auditLog.save(supportsTransaction ? { session } : {});

    // Commit Transaction if active
    if (supportsTransaction && session) {
      await session.commitTransaction();
    }

    return {
      claimId,
      transactionId,
      cycleId,
      day: eligibleDay,
      reward: {
        day: reward.day,
        title: reward.title,
        rewardType: reward.rewardType,
        currency: reward.currency,
        amount: reward.amount,
        assetType: reward.assetType
      },
      wallet: {
        id: updatedWallet._id.toString(),
        vesBalance: updatedWallet.vesBalance,
        amazonVouchersTotal: updatedWallet.amazonVouchersTotal
      },
      claimedAt: now.toISOString(),
      nextClaimAt: nextClaimDate.toISOString(),
      streakStatus: 'COOLDOWN'
    };
  } catch (error) {
    if (supportsTransaction && session) {
      try {
        await session.abortTransaction();
      } catch (abortErr) {}
    } else if (claimDocCreated && claimIdCreated) {
      // Standalone compensation rollback
      try {
        await StreakClaim.deleteOne({ claimId: claimIdCreated });
      } catch (rollbackErr) {}
    }
    throw error;
  } finally {
    if (session) {
      try {
        await session.endSession();
      } catch (e) {}
    }
    inFlightClaims.delete(lockKey);
  }
};

module.exports = {
  claimReward
};
