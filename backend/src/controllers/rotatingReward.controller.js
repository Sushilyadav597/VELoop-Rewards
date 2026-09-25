const rotatingService = require('../services/rotatingReward.service');
const { logAuditEvent } = require('../services/audit.service');

/**
 * GET /api/daily-streak/rotating-drop
 * Get today's rotating drop status, cooldown, and schedule
 */
const getTodayDrop = async (req, res, next) => {
  try {
    const data = await rotatingService.getTodayDropStatus(req.user.userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/daily-streak/rotating-drop/claim
 * Claim today's rotating drop reward
 */
const claimTodayDrop = async (req, res, next) => {
  try {
    await logAuditEvent({
      userId: req.user.userId,
      event: 'ROTATING_DROP_CLAIM_REQUEST',
      details: {},
      req
    });

    const result = await rotatingService.claimTodayDrop(req.user.userId);

    await logAuditEvent({
      userId: req.user.userId,
      event: 'ROTATING_DROP_CLAIMED',
      details: { reward: result.reward },
      req
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTodayDrop,
  claimTodayDrop
};
