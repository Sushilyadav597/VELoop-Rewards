const streakService = require('../services/streakService');
const streakClaimService = require('../services/streakClaimService');

/**
 * GET /api/daily-streak/status
 * Returns authoritative streak status matching Section 8 format
 */
const getStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await streakService.getStreakStatus(userId);

    return res.status(200).json({
      success: true,
      data: result.data
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve streak status.'
    });
  }
};

/**
 * GET /api/daily-streak
 * Returns complete streak state, card statuses, and metadata for frontend rendering
 */
const getDailyStreak = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await streakService.getStreakStatus(userId);

    return res.status(200).json({
      success: true,
      serverTime: result.serverTime,
      streak: result.streak,
      rewards: result.rewards,
      data: result.data
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve daily streak data.'
    });
  }
};

/**
 * POST /api/daily-streak/claim
 * Atomically claims eligible streak reward for authenticated user
 * Client-provided amounts, days, currencies, or userIds are strictly ignored
 */
const claim = async (req, res) => {
  try {
    const userId = req.user.id;
    const ipAddress = req.ip || req.connection?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const result = await streakClaimService.claimReward({
      userId,
      ipAddress,
      userAgent
    });

    return res.status(200).json({
      success: true,
      message: 'Daily streak reward claimed successfully',
      data: result,
      claimedReward: result.reward,
      ...result
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Claim processing failed.'
    });
  }
};

/**
 * GET /api/daily-streak/history
 * Returns paginated claim history for authenticated user
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit } = req.query;
    const result = await streakService.getClaimHistory(userId, { page, limit });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      error: error.message || 'Failed to retrieve claim history.'
    });
  }
};

module.exports = {
  getStatus,
  getDailyStreak,
  claim,
  getHistory
};
