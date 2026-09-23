const mongoose = require('mongoose');
const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const StreakConfig = require('../models/StreakConfig');
const { getDBStatus } = require('../config/db');
const { DEFAULT_STREAK_CONFIG } = require('../config/streakConfig');
const { getAllRewards, getRewardByDay } = require('./reward.service');
const { creditRewardToWallet } = require('./wallet.service');
const { logAuditEvent } = require('./audit.service');
const { getServerTime } = require('../utils/time.utils');

// In-Memory Fallback State (when Mongo is starting / not connected)
const inMemoryCycles = new Map();
const inMemoryClaims = [];
// In-flight concurrency lock per user
const claimLocks = new Set();

/**
 * Get active streak configuration
 */
const getActiveConfig = async () => {
  if (getDBStatus()) {
    try {
      const cfg = await StreakConfig.findOne({ isActive: true }).lean();
      if (cfg) return cfg;
    } catch (e) {
      // fallback
    }
  }
  return DEFAULT_STREAK_CONFIG;
};

/**
 * Get or initialize current active cycle for user
 */
const getOrCreateActiveCycle = async (userId) => {
  const userIdStr = userId.toString();
  const config = await getActiveConfig();
  const now = getServerTime();

  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      let cycle = await StreakCycle.findOne({
        userId,
        status: 'ACTIVE'
      }).sort({ startedAt: -1 });

      if (!cycle) {
        const cycleCount = await StreakCycle.countDocuments({ userId });
        const cycleId = `CYC-${userIdStr.slice(-4)}-${cycleCount + 1}-${Date.now().toString(36)}`;
        cycle = await StreakCycle.create({
          cycleId,
          userId,
          cycleNumber: cycleCount + 1,
          status: 'ACTIVE',
          currentStreak: 0,
          checkedInCount: 0,
          startedAt: now
        });
      }
      return cycle;
    } catch (err) {
      console.warn('[StreakCycle DB fallback]:', err.message);
    }
  }

  // Memory fallback
  let userCycles = inMemoryCycles.get(userIdStr) || [];
  let activeCycle = userCycles.find(c => c.status === 'ACTIVE');
  if (!activeCycle) {
    const cycleNumber = userCycles.length + 1;
    const cycleId = `CYC-${userIdStr.slice(-4)}-${cycleNumber}-${Date.now().toString(36)}`;
    activeCycle = {
      cycleId,
      userId: userIdStr,
      cycleNumber,
      status: 'ACTIVE',
      currentStreak: 0,
      checkedInCount: 0,
      lastClaimAt: null,
      nextClaimAt: null,
      startedAt: now
    };
    userCycles.push(activeCycle);
    inMemoryCycles.set(userIdStr, userCycles);
  }
  return activeCycle;
};

/**
 * Check if the streak was missed and reset if necessary (Section 15, 16, 49, 50)
 */
const evaluateMissedStreak = async (cycle, config) => {
  if (!cycle.lastClaimAt || cycle.currentStreak === 0) {
    return { missed: false, cycle };
  }

  const now = getServerTime();
  const lastClaim = new Date(cycle.lastClaimAt);
  const cooldownMs = config.claimCooldownMs;
  const gracePeriodMs = config.claimGracePeriodMs;

  const nextEligibleTime = new Date(lastClaim.getTime() + cooldownMs);
  const missedDeadline = new Date(nextEligibleTime.getTime() + gracePeriodMs);

  // If server time is past deadline, user missed their streak window!
  if (now.getTime() > missedDeadline.getTime()) {
    const userId = cycle.userId;
    const userIdStr = userId.toString();

    // Mark current cycle as RESET
    if (getDBStatus()) {
      try {
        await StreakCycle.findByIdAndUpdate(cycle._id, {
          status: 'RESET',
          resetReason: 'Missed check-in window deadline',
          completedAt: now
        });
      } catch (err) {
        console.warn('[EvaluateMissedStreak DB error]:', err.message);
      }
    } else {
      cycle.status = 'RESET';
      cycle.resetReason = 'Missed check-in window deadline';
      cycle.completedAt = now;
    }

    // Log security audit event
    await logAuditEvent({
      userId,
      event: 'STREAK_RESET',
      details: {
        reason: 'Missed window',
        previousStreak: cycle.currentStreak,
        lastClaimAt: cycle.lastClaimAt,
        deadline: missedDeadline,
        serverTime: now
      }
    });

    // Create fresh active cycle starting at Day 1
    const newCycle = await getOrCreateActiveCycle(userId);
    return { missed: true, cycle: newCycle };
  }

  return { missed: false, cycle };
};

/**
 * Get comprehensive daily streak status (Section 56, 57, 94)
 */
const getStreakStatus = async (userId) => {
  const userIdStr = userId.toString();
  const config = await getActiveConfig();
  let cycle = await getOrCreateActiveCycle(userId);

  // Missed day evaluation
  const missedCheck = await evaluateMissedStreak(cycle, config);
  cycle = missedCheck.cycle;

  const now = getServerTime();
  const totalDays = config.cycleDays || 7;
  const rewards = await getAllRewards();

  // Load claims for current cycle
  let claims = [];
  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      claims = await StreakClaim.find({
        userId,
        cycleId: cycle.cycleId,
        status: 'SUCCESS'
      }).sort({ day: 1 }).lean();
    } catch (e) {
      claims = inMemoryClaims.filter(c => c.userId === userIdStr && c.cycleId === cycle.cycleId);
    }
  } else {
    claims = inMemoryClaims.filter(c => c.userId === userIdStr && c.cycleId === cycle.cycleId);
  }

  const claimedDaysSet = new Set(claims.map(c => c.day));
  const checkedInCount = claimedDaysSet.size;
  const currentStreak = checkedInCount;

  // Determine current actionable day
  // If user has claimed Day 1, current target is Day 2. If nothing claimed, target is Day 1.
  let currentTargetDay = checkedInCount + 1;
  let cycleCompleted = false;

  if (currentTargetDay > totalDays) {
    currentTargetDay = totalDays;
    cycleCompleted = true;
  }

  // Calculate next claim time and eligibility
  let nextClaimAt = null;
  let isEligibleNow = false;

  if (checkedInCount === 0) {
    // New cycle / Day 1 is immediately available
    isEligibleNow = true;
    nextClaimAt = null;
  } else {
    const lastClaim = new Date(cycle.lastClaimAt);
    const unlockTime = new Date(lastClaim.getTime() + config.claimCooldownMs);
    nextClaimAt = unlockTime;

    if (now.getTime() >= unlockTime.getTime()) {
      isEligibleNow = !cycleCompleted;
    } else {
      isEligibleNow = false;
    }
  }

  // Construct card status array for days 1 to totalDays
  const cardStates = rewards.map((reward) => {
    const day = reward.day;
    let status = 'LOCKED';
    let cardNextClaimAt = null;

    if (claimedDaysSet.has(day)) {
      status = 'CLAIMED';
    } else if (day === currentTargetDay) {
      if (isEligibleNow) {
        status = 'AVAILABLE';
      } else {
        status = 'LOCKED';
        cardNextClaimAt = nextClaimAt;
      }
    } else {
      status = 'LOCKED';
    }

    return {
      day,
      status,
      badge: reward.badge,
      title: reward.title,
      subtitle: reward.subtitle,
      rewardType: reward.rewardType,
      currency: reward.currency,
      amount: reward.amount,
      assetType: reward.assetType,
      isToday: day === currentTargetDay,
      nextClaimAt: cardNextClaimAt
    };
  });

  // Next reward details for stats bar (Section 24, 27)
  const nextRewardObj = rewards.find(r => r.day === currentTargetDay) || rewards[0];

  return {
    success: true,
    serverTime: now.toISOString(),
    streak: {
      cycleId: cycle.cycleId,
      cycleNumber: cycle.cycleNumber,
      currentStreak,
      currentDay: currentTargetDay,
      checkedIn: checkedInCount,
      totalRewards: totalDays,
      status: cycleCompleted ? 'COMPLETED' : 'ACTIVE',
      isEligibleToday: isEligibleNow,
      nextClaimAt: nextClaimAt ? nextClaimAt.toISOString() : null,
      cooldownRemainingMs: nextClaimAt ? Math.max(0, nextClaimAt.getTime() - now.getTime()) : 0,
      nextReward: {
        day: nextRewardObj.day,
        amount: nextRewardObj.amount,
        currency: nextRewardObj.currency,
        title: nextRewardObj.title,
        subtitle: nextRewardObj.subtitle,
        rewardType: nextRewardObj.rewardType,
        assetType: nextRewardObj.assetType
      }
    },
    rewards: cardStates
  };
};

/**
 * Authoritative Claim Reward Execution
 * Full anti-cheat, atomic concurrency, idempotency, and previous-day validation.
 */
const claimReward = async ({ userId, clientPayload = {}, req = null }) => {
  const userIdStr = userId.toString();
  const now = getServerTime();
  const config = await getActiveConfig();

  // 1. Double-click & Concurrency Lock per user (Section 41, 42, 102)
  if (claimLocks.has(userIdStr)) {
    await logAuditEvent({
      userId,
      event: 'DUPLICATE_CLAIM',
      details: { reason: 'Concurrent request in-flight lock' },
      req
    });
    const error = new Error('A claim request is already in progress. Please wait.');
    error.statusCode = 409;
    throw error;
  }

  claimLocks.add(userIdStr);

  try {
    // 2. Fetch active cycle and evaluate missed streak
    let cycle = await getOrCreateActiveCycle(userId);
    const missedCheck = await evaluateMissedStreak(cycle, config);
    cycle = missedCheck.cycle;

    // 3. Load claims in this cycle
    let claims = [];
    if (getDBStatus() && mongoose.isValidObjectId(userId)) {
      try {
        claims = await StreakClaim.find({
          userId,
          cycleId: cycle.cycleId,
          status: 'SUCCESS'
        }).sort({ day: 1 }).lean();
      } catch (e) {
        claims = inMemoryClaims.filter(c => c.userId === userIdStr && c.cycleId === cycle.cycleId);
      }
    } else {
      claims = inMemoryClaims.filter(c => c.userId === userIdStr && c.cycleId === cycle.cycleId);
    }

    const claimedDays = new Set(claims.map(c => c.day));
    const nextDayToClaim = claimedDays.size + 1;

    // 4. Validate cycle bounds
    if (nextDayToClaim > config.cycleDays) {
      const error = new Error('You have completed this streak cycle! A new cycle will start on your next check-in.');
      error.statusCode = 400;
      throw error;
    }

    // 5. Anti-Cheat: Validate client requested day (Section 14, 18, 99)
    // Backend ignores client day or validates it strictly
    if (clientPayload.day !== undefined && Number(clientPayload.day) !== nextDayToClaim) {
      await logAuditEvent({
        userId,
        event: 'INVALID_CLAIM',
        details: {
          clientDay: clientPayload.day,
          expectedDay: nextDayToClaim,
          reason: 'Day jump / tampering detected'
        },
        req
      });
      const error = new Error(`Invalid claim request for Day ${clientPayload.day}. You are currently eligible for Day ${nextDayToClaim}.`);
      error.statusCode = 400;
      throw error;
    }

    // 6. Anti-Cheat: Validate previous day was claimed (Section 13)
    if (nextDayToClaim > 1 && !claimedDays.has(nextDayToClaim - 1)) {
      await logAuditEvent({
        userId,
        event: 'INVALID_CLAIM',
        details: { reason: 'Previous day was not completed' },
        req
      });
      const error = new Error(`Cannot claim Day ${nextDayToClaim}: Previous day was not claimed.`);
      error.statusCode = 400;
      throw error;
    }

    // 7. Check Cooldown / Waiting Period (Section 9, 10, 11, 12)
    if (cycle.lastClaimAt) {
      const lastClaim = new Date(cycle.lastClaimAt);
      const unlockTime = new Date(lastClaim.getTime() + config.claimCooldownMs);

      if (now.getTime() < unlockTime.getTime()) {
        const remainingMs = unlockTime.getTime() - now.getTime();
        const error = new Error(`Reward is still locked. Next claim available at ${unlockTime.toISOString()}`);
        error.statusCode = 400;
        error.nextClaimAt = unlockTime;
        error.cooldownRemainingMs = remainingMs;
        throw error;
      }
    }

    // 8. Fetch AUTHORITATIVE Reward Config from Backend (Section 36, 98: Client reward is IGNORED!)
    const configuredReward = await getRewardByDay(nextDayToClaim);
    if (!configuredReward) {
      const error = new Error(`No reward configured for Day ${nextDayToClaim}`);
      error.statusCode = 500;
      throw error;
    }

    // 9. Generate Reference ID & Claim Record (Section 19, 37, 62)
    const claimId = `CLM-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const referenceId = `STREAK-${cycle.cycleId}-D${nextDayToClaim}`;
    const ipAddress = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';

    // Record StreakClaim in DB with compound unique constraint
    let claimRecord = null;
    if (getDBStatus() && mongoose.isValidObjectId(userId)) {
      try {
        claimRecord = await StreakClaim.create({
          claimId,
          userId,
          cycleId: cycle.cycleId,
          day: nextDayToClaim,
          rewardSnapshot: {
            title: configuredReward.title,
            subtitle: configuredReward.subtitle,
            rewardType: configuredReward.rewardType,
            currency: configuredReward.currency,
            amount: configuredReward.amount,
            assetType: configuredReward.assetType
          },
          status: 'SUCCESS',
          transactionId: referenceId,
          claimedAt: now,
          ipAddress
        });
      } catch (dbErr) {
        if (dbErr.code === 11000) {
          // MongoDB Unique Key violation -> Duplicate request handled safely!
          await logAuditEvent({
            userId,
            event: 'DUPLICATE_CLAIM',
            details: { reason: 'MongoDB duplicate key on (userId, cycleId, day)' },
            req
          });
          const error = new Error('This reward has already been claimed.');
          error.statusCode = 409;
          throw error;
        }
        throw dbErr;
      }
    } else {
      // Memory unique check
      const exists = inMemoryClaims.some(c => c.userId === userIdStr && c.cycleId === cycle.cycleId && c.day === nextDayToClaim);
      if (exists) {
        const error = new Error('This reward has already been claimed.');
        error.statusCode = 409;
        throw error;
      }
      claimRecord = {
        claimId,
        userId: userIdStr,
        cycleId: cycle.cycleId,
        day: nextDayToClaim,
        rewardSnapshot: configuredReward,
        status: 'SUCCESS',
        transactionId: referenceId,
        claimedAt: now,
        ipAddress
      };
      inMemoryClaims.push(claimRecord);
    }

    // 10. Credit Wallet & Record Immutable Wallet Transaction (Section 38, 39, 63)
    const walletResult = await creditRewardToWallet({
      userId,
      reward: configuredReward,
      streakDay: nextDayToClaim,
      referenceId
    });

    // 11. Update Cycle Progress
    const updatedStreak = nextDayToClaim;
    const isCycleComplete = updatedStreak >= config.cycleDays;
    const nextClaimTime = new Date(now.getTime() + config.claimCooldownMs);

    if (getDBStatus()) {
      await StreakCycle.findByIdAndUpdate(cycle._id, {
        currentStreak: updatedStreak,
        checkedInCount: updatedStreak,
        lastClaimAt: now,
        nextClaimAt: nextClaimTime,
        status: isCycleComplete ? 'COMPLETED' : 'ACTIVE',
        completedAt: isCycleComplete ? now : null
      });
    } else {
      cycle.currentStreak = updatedStreak;
      cycle.checkedInCount = updatedStreak;
      cycle.lastClaimAt = now;
      cycle.nextClaimAt = nextClaimTime;
      if (isCycleComplete) {
        cycle.status = 'COMPLETED';
        cycle.completedAt = now;
      }
    }

    // 12. Record Audit Log
    await logAuditEvent({
      userId,
      event: 'STREAK_CLAIM_SUCCESS',
      details: {
        cycleId: cycle.cycleId,
        day: nextDayToClaim,
        reward: configuredReward,
        walletTransaction: walletResult.transaction.transactionId
      },
      req
    });

    // Return fresh state
    return {
      success: true,
      message: `Day ${nextDayToClaim} claimed successfully!`,
      serverTime: now.toISOString(),
      claimedReward: {
        day: nextDayToClaim,
        title: configuredReward.title,
        amount: configuredReward.amount,
        currency: configuredReward.currency,
        rewardType: configuredReward.rewardType
      },
      wallet: {
        vesBalance: walletResult.wallet.vesBalance,
        gemsBalance: walletResult.wallet.gemsBalance,
        amazonVouchersTotal: walletResult.wallet.amazonVouchersTotal
      },
      transaction: walletResult.transaction,
      nextClaimAt: nextClaimTime.toISOString()
    };
  } finally {
    // Release in-flight lock
    claimLocks.delete(userIdStr);
  }
};

/**
 * Get claim history for user (Section 58)
 */
const getStreakHistory = async (userId) => {
  const userIdStr = userId.toString();
  if (getDBStatus() && mongoose.isValidObjectId(userId)) {
    try {
      const claims = await StreakClaim.find({ userId })
        .sort({ claimedAt: -1 })
        .limit(50)
        .lean();
      if (claims && claims.length > 0) return claims;
    } catch (e) {
      // fallback
    }
  }
  return inMemoryClaims.filter(c => c.userId === userIdStr);
};

module.exports = {
  getActiveConfig,
  getStreakStatus,
  claimReward,
  getStreakHistory,
  evaluateMissedStreak,
  getOrCreateActiveCycle
};
