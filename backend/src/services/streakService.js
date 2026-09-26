const mongoose = require('mongoose');
const StreakConfig = require('../models/StreakConfig');
const StreakReward = require('../models/StreakReward');
const StreakClaim = require('../models/StreakClaim');
const StreakCycle = require('../models/StreakCycle');
const User = require('../models/User');
const { getServerTime } = require('../utils/time.utils');
const { DEFAULT_STREAK_CONFIG, DEFAULT_REWARDS } = require('../config/streakConfig');

/**
 * Retrieve active streak configuration from MongoDB
 * Fallback to standard 7-day configuration if database record is missing
 */
const getActiveConfig = async () => {
  try {
    let config = await StreakConfig.findOne({ isActive: true }).lean();
    if (!config) {
      // Auto-initialize standard configuration if not yet in database
      config = await StreakConfig.create({
        configKey: 'DEFAULT',
        ...DEFAULT_STREAK_CONFIG,
        isActive: true
      });
    }
    return config;
  } catch (err) {
    return DEFAULT_STREAK_CONFIG;
  }
};

/**
 * Retrieve active 7-day reward configuration from MongoDB
 * Guarantees rewards are authoritatively database-driven
 */
const getActiveRewards = async () => {
  try {
    let rewards = await StreakReward.find({ active: true }).sort({ day: 1 }).lean();
    if (!rewards || rewards.length === 0) {
      // Auto-initialize standard 7-day rewards if collection is empty
      await StreakReward.insertMany(DEFAULT_REWARDS);
      rewards = await StreakReward.find({ active: true }).sort({ day: 1 }).lean();
    }
    return rewards;
  } catch (err) {
    return DEFAULT_REWARDS;
  }
};

/**
 * Deterministically get or create the active StreakCycle for a user
 * Cycle ID format: CYC-<last-6-chars-of-userId>-<cycleNumber>
 */
const getOrCreateActiveCycle = async (userId, now) => {
  const userIdStr = userId.toString();

  let cycle = await StreakCycle.findOne({
    userId,
    status: 'ACTIVE'
  }).sort({ startedAt: -1 });

  if (!cycle) {
    const cycleCount = await StreakCycle.countDocuments({ userId });
    const cycleNumber = cycleCount + 1;
    const cycleId = `CYC-${userIdStr.slice(-6)}-${cycleNumber}`;

    cycle = await StreakCycle.create({
      cycleId,
      userId,
      cycleNumber,
      status: 'ACTIVE',
      currentStreak: 0,
      checkedInCount: 0,
      lastClaimAt: null,
      nextClaimAt: null,
      startedAt: now
    });
  }

  return cycle;
};

/**
 * Backend-authoritative missed-day evaluation
 * Checks if current server time exceeds (lastClaimAt + cooldown + gracePeriod)
 */
const evaluateMissedStreak = async (cycle, config, now) => {
  // If user has not claimed in this cycle or streak is 0, no missed window applies
  if (!cycle.lastClaimAt || cycle.currentStreak === 0) {
    return { missed: false, cycle };
  }

  const lastClaim = new Date(cycle.lastClaimAt);
  const cooldownMs = config.claimCooldownMs || 24 * 60 * 60 * 1000;
  const gracePeriodMs = config.claimGracePeriodMs || 24 * 60 * 60 * 1000;

  const nextEligibleTime = new Date(lastClaim.getTime() + cooldownMs);
  const missedDeadline = new Date(nextEligibleTime.getTime() + gracePeriodMs);

  // If server time is past deadline, user missed their claim window!
  if (now.getTime() > missedDeadline.getTime()) {
    // 1. Mark expired cycle as RESET
    await StreakCycle.findByIdAndUpdate(cycle._id, {
      status: 'RESET',
      resetReason: 'Missed check-in window deadline',
      completedAt: now
    });

    // 2. Create fresh active cycle starting at Day 1
    const cycleCount = await StreakCycle.countDocuments({ userId: cycle.userId });
    const newCycleNumber = cycleCount + 1;
    const newCycleId = `CYC-${cycle.userId.toString().slice(-6)}-${newCycleNumber}`;

    const newCycle = await StreakCycle.create({
      cycleId: newCycleId,
      userId: cycle.userId,
      cycleNumber: newCycleNumber,
      status: 'ACTIVE',
      currentStreak: 0,
      checkedInCount: 0,
      lastClaimAt: null,
      nextClaimAt: null,
      startedAt: now
    });

    return { missed: true, cycle: newCycle };
  }

  return { missed: false, cycle };
};

/**
 * Core Streak Calculation Service
 * Authoritative source of truth for:
 * - current streak day
 * - eligibility / canClaim
 * - cooldown timing
 * - next & current rewards
 * - card states for 7-day cycle
 */
const getStreakStatus = async (userId) => {
  // 1. Validate user existence
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Authoritative Server Time
  const now = getServerTime();

  // 3. Retrieve active configuration & rewards from MongoDB
  const config = await getActiveConfig();
  const rewards = await getActiveRewards();
  const totalDays = config.cycleDays || 7;

  // 4. Retrieve or initialize current active cycle
  let cycle = await getOrCreateActiveCycle(userId, now);

  // 5. Evaluate missed streak deadline
  const missedCheck = await evaluateMissedStreak(cycle, config, now);
  cycle = missedCheck.cycle;

  // 6. Retrieve verified claims for this cycle
  const claims = await StreakClaim.find({
    userId,
    cycleId: cycle.cycleId,
    status: 'SUCCESS'
  }).sort({ day: 1 }).lean();

  const claimedDaysSet = new Set(claims.map((c) => c.day));
  const checkedInCount = claimedDaysSet.size;
  const currentStreak = cycle.currentStreak ?? checkedInCount;

  // 7. Calculate actionable day and eligibility
  let currentTargetDay = 1;
  let canClaim = false;
  let nextClaimAt = null;
  let streakStatus = 'READY';

  if (checkedInCount === 0) {
    // First-time user / fresh cycle: eligible for Day 1 immediately
    currentTargetDay = 1;
    canClaim = true;
    nextClaimAt = null;
    streakStatus = 'READY';
  } else if (checkedInCount >= totalDays) {
    // All 7 days in this cycle have been claimed!
    const lastClaim = new Date(cycle.lastClaimAt);
    const cooldownMs = config.claimCooldownMs || 24 * 60 * 60 * 1000;
    const unlockTime = new Date(lastClaim.getTime() + cooldownMs);

    if (now.getTime() >= unlockTime.getTime()) {
      // Cooldown passed: user is ready for new cycle Day 1
      currentTargetDay = 1;
      canClaim = true;
      nextClaimAt = null;
      streakStatus = 'READY';
    } else {
      // In cooldown after completing Day 7
      currentTargetDay = totalDays;
      canClaim = false;
      nextClaimAt = unlockTime.toISOString();
      streakStatus = 'COOLDOWN';
    }
  } else {
    // Intermediate days (Day 1..6 claimed)
    const nextDay = checkedInCount + 1;
    const lastClaim = new Date(cycle.lastClaimAt);
    const cooldownMs = config.claimCooldownMs || 24 * 60 * 60 * 1000;
    const unlockTime = new Date(lastClaim.getTime() + cooldownMs);

    if (now.getTime() >= unlockTime.getTime()) {
      // 24-hour cooldown elapsed: actionable for next day!
      currentTargetDay = nextDay;
      canClaim = true;
      nextClaimAt = null;
      streakStatus = 'READY';
    } else {
      // Still in cooldown window
      currentTargetDay = nextDay;
      canClaim = false;
      nextClaimAt = unlockTime.toISOString();
      streakStatus = 'COOLDOWN';
    }
  }

  // 8. Determine current and next rewards
  const currentRewardObj = rewards.find((r) => r.day === currentTargetDay) || rewards[0];
  const nextTargetDay = currentTargetDay >= totalDays ? 1 : currentTargetDay + 1;
  const nextRewardObj = rewards.find((r) => r.day === nextTargetDay) || rewards[0];

  // 9. Construct 7-day card states for frontend rendering
  const cardStates = rewards.map((reward) => {
    const day = reward.day;
    let cardStatus = 'LOCKED';
    let cardNextClaimAt = null;

    if (claimedDaysSet.has(day)) {
      cardStatus = 'CLAIMED';
    } else if (day === currentTargetDay) {
      if (canClaim) {
        cardStatus = 'AVAILABLE';
      } else {
        cardStatus = 'LOCKED';
        cardNextClaimAt = nextClaimAt;
      }
    } else {
      cardStatus = 'LOCKED';
    }

    return {
      day,
      status: cardStatus,
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

  // 10. Clean, normalized response data
  const data = {
    serverTime: now.toISOString(),
    cycleId: cycle.cycleId,
    currentDay: currentTargetDay,
    currentStreak,
    checkedIn: checkedInCount,
    canClaim,
    nextClaimAt,
    lastClaimAt: cycle.lastClaimAt ? new Date(cycle.lastClaimAt).toISOString() : null,
    streakStatus,
    currentReward: {
      day: currentRewardObj.day,
      title: currentRewardObj.title,
      rewardType: currentRewardObj.rewardType,
      currency: currentRewardObj.currency,
      amount: currentRewardObj.amount,
      assetType: currentRewardObj.assetType
    },
    nextReward: {
      day: nextRewardObj.day,
      title: nextRewardObj.title,
      rewardType: nextRewardObj.rewardType,
      currency: nextRewardObj.currency,
      amount: nextRewardObj.amount,
      assetType: nextRewardObj.assetType
    }
  };

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
      canClaim,
      nextClaimAt,
      lastClaimAt: cycle.lastClaimAt ? new Date(cycle.lastClaimAt).toISOString() : null,
      streakStatus
    },
    rewards: cardStates,
    data
  };
};

/**
 * Retrieve paginated daily streak claim history for authenticated user
 * @param {string} userId - User ID
 * @param {Object} query - { page, limit }
 */
const getClaimHistory = async (userId, { page = 1, limit = 20 } = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  let pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) pageNum = 1;

  let limitNum = parseInt(limit, 10);
  if (isNaN(limitNum) || limitNum < 1) limitNum = 20;
  if (limitNum > 100) limitNum = 100;

  const skip = (pageNum - 1) * limitNum;
  const filter = { userId: user._id, status: 'SUCCESS' };

  const total = await StreakClaim.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum) || 1;

  const claims = await StreakClaim.find(filter)
    .sort({ claimedAt: -1 })
    .skip(skip)
    .limit(limitNum)
    .lean();

  const history = claims.map((c) => ({
    claimId: c.claimId,
    cycleId: c.cycleId,
    day: c.day,
    reward: c.rewardSnapshot || {
      title: 'Daily Reward',
      rewardType: c.rewardType,
      currency: c.currency,
      amount: c.amount,
      assetType: 'coin'
    },
    rewardType: c.rewardType,
    currency: c.currency,
    amount: c.amount,
    transactionId: c.transactionId,
    status: c.status,
    claimedAt: c.claimedAt ? new Date(c.claimedAt).toISOString() : null
  }));

  return {
    history,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages
    }
  };
};

module.exports = {
  getStreakStatus,
  getClaimHistory,
  getActiveConfig,
  getActiveRewards,
  getOrCreateActiveCycle,
  evaluateMissedStreak
};
