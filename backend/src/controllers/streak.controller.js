const streakService = require('../services/streak.service');
const { logAuditEvent } = require('../services/audit.service');

/**
 * GET /api/daily-streak
 * Returns complete streak state calculated by backend
 */
const getStreak = async (req, res, next) => {
  try {
    const status = await streakService.getStreakStatus(req.user.userId);
    res.json(status);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/daily-streak/status
 * Lightweight status check
 */
const getStatus = async (req, res, next) => {
  try {
    const status = await streakService.getStreakStatus(req.user.userId);
    res.json({
      success: true,
      serverTime: status.serverTime,
      currentStreak: status.streak.currentStreak,
      currentDay: status.streak.currentDay,
      checkedIn: status.streak.checkedIn,
      isEligibleToday: status.streak.isEligibleToday,
      nextClaimAt: status.streak.nextClaimAt,
      cooldownRemainingMs: status.streak.cooldownRemainingMs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/daily-streak/claim
 * Authoritative claim processing
 */
const claimStreak = async (req, res, next) => {
  try {
    await logAuditEvent({
      userId: req.user.userId,
      event: 'STREAK_CLAIM_REQUEST',
      details: { body: req.body },
      req
    });

    const result = await streakService.claimReward({
      userId: req.user.userId,
      clientPayload: req.body || {},
      req
    });

    res.status(200).json(result);
  } catch (err) {
    await logAuditEvent({
      userId: req.user.userId,
      event: 'STREAK_CLAIM_REJECTED',
      details: { error: err.message, statusCode: err.statusCode || 400 },
      req
    });
    next(err);
  }
};

/**
 * GET /api/daily-streak/history
 * Returns user check-in history
 */
const getHistory = async (req, res, next) => {
  try {
    const history = await streakService.getStreakHistory(req.user.userId);
    res.json({
      success: true,
      history
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStreak,
  getStatus,
  claimStreak,
  getHistory
};
