const streakService = require('../services/streakService');
const streakClaimService = require('../services/streakClaimService');
const { logAuditEvent } = require('../services/audit.service');

/**
 * GET /api/daily-streak
 * Returns complete streak state calculated by backend
 */
const getStreak = async (req, res, next) => {
  try {
    const userId = req.user ? (req.user.id || req.user.userId) : null;
    const status = await streakService.getStreakStatus(userId);
    return res.status(200).json({
      success: true,
      serverTime: status.serverTime,
      streak: status.streak,
      rewards: status.rewards,
      data: status.data
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Failed to retrieve streak data.'
    });
  }
};

/**
 * GET /api/daily-streak/status
 * Lightweight status check (Protected by JWT)
 */
const getStatus = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const status = await streakService.getStreakStatus(userId);
    return res.status(200).json({
      success: true,
      data: status.data,
      serverTime: status.serverTime,
      currentStreak: status.streak.currentStreak,
      currentDay: status.streak.currentDay,
      checkedIn: status.streak.checkedIn,
      isEligibleToday: status.streak.canClaim,
      canClaim: status.streak.canClaim,
      nextClaimAt: status.streak.nextClaimAt,
      cooldownRemainingMs: status.streak.cooldownRemainingMs,
      streakStatus: status.streak.streakStatus
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Failed to retrieve streak status.'
    });
  }
};

/**
 * POST /api/daily-streak/claim
 * Authoritative claim processing (client payload ignored, server authoritative)
 */
const claimStreak = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const ipAddress = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    await logAuditEvent({
      userId,
      event: 'STREAK_CLAIM_REQUEST',
      details: { body: req.body },
      req
    });

    const result = await streakClaimService.claimReward({
      userId,
      ipAddress,
      userAgent
    });

    await logAuditEvent({
      userId,
      event: 'STREAK_CLAIM_SUCCESS',
      details: { claimId: result.claimId, day: result.day, reward: result.reward },
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Daily streak reward claimed successfully',
      data: result,
      claimedReward: result.reward,
      wallet: result.wallet,
      transaction: {
        transactionId: result.transactionId,
        amount: result.reward.amount,
        currency: result.reward.currency
      },
      currentStreak: result.day,
      updatedStreak: result.day,
      serverTime: result.claimedAt,
      nextClaimAt: result.nextClaimAt
    });
  } catch (err) {
    const userId = req.user?.id || req.user?.userId;
    if (userId) {
      await logAuditEvent({
        userId,
        event: 'STREAK_CLAIM_REJECTED',
        details: { error: err.message, statusCode: err.statusCode || 400 },
        req
      });
    }
    const status = err.statusCode || 400;
    return res.status(status).json({
      success: false,
      error: err.message || 'Streak claim failed.'
    });
  }
};

/**
 * GET /api/daily-streak/history
 * Returns user check-in history with pagination
 */
const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user.userId;
    const { page, limit } = req.query;
    const historyResult = await streakService.getClaimHistory(userId, { page, limit });

    return res.status(200).json({
      success: true,
      data: historyResult,
      history: historyResult.history,
      pagination: historyResult.pagination
    });
  } catch (err) {
    const status = err.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: err.message || 'Failed to retrieve claim history.'
    });
  }
};

module.exports = {
  getStreak,
  getStatus,
  claimStreak,
  getHistory
};
