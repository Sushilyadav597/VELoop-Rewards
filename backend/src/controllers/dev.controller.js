const { advanceServerTimeMs, resetVirtualServerTime, getServerTime, getVirtualTimeOffsetMs } = require('../utils/time.utils');
const { logAuditEvent, getRecentAuditLogs } = require('../services/audit.service');
const streakService = require('../services/streak.service');
const StreakCycle = require('../models/StreakCycle');
const StreakClaim = require('../models/StreakClaim');
const WalletTransaction = require('../models/WalletTransaction');
const { getDBStatus } = require('../config/db');

/**
 * Advance virtual server time (e.g. by 24h or 48h)
 * POST /api/dev/advance-time { hours: 24 }
 */
const advanceTime = async (req, res, next) => {
  try {
    const hours = parseFloat(req.body.hours) || 24;
    const ms = hours * 60 * 60 * 1000;
    const newServerTime = advanceServerTimeMs(ms);

    await logAuditEvent({
      userId: req.user?.userId || null,
      event: 'DEV_TIME_ADVANCE',
      details: { advancedHours: hours, newServerTime },
      req
    });

    res.json({
      success: true,
      message: `Virtual server clock advanced by ${hours} hours.`,
      serverTime: newServerTime.toISOString(),
      offsetHours: (getVirtualTimeOffsetMs() / (60 * 60 * 1000)).toFixed(1)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset virtual server clock back to system time
 * POST /api/dev/reset-clock
 */
const resetClock = async (req, res, next) => {
  try {
    const realTime = resetVirtualServerTime();
    res.json({
      success: true,
      message: 'Virtual server clock reset to real system time.',
      serverTime: realTime.toISOString(),
      offsetHours: 0
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Reset streak for current user to Day 1 (for testing clean slate)
 * POST /api/dev/reset-user-streak
 */
const resetUserStreak = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    if (getDBStatus()) {
      await StreakCycle.updateMany({ userId, status: 'ACTIVE' }, { status: 'RESET', resetReason: 'Manual test reset' });
    }
    // New active cycle
    const newCycle = await streakService.getOrCreateActiveCycle(userId);

    await logAuditEvent({
      userId,
      event: 'STREAK_RESET',
      details: { reason: 'Dev manual test reset' },
      req
    });

    const status = await streakService.getStreakStatus(userId);
    res.json({
      success: true,
      message: 'User streak has been reset to Day 1.',
      status
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Run concurrent claim test on the backend (Section 42, 102)
 * Sends 2 simultaneous claim requests and verifies only 1 succeeds!
 * POST /api/dev/test-concurrency
 */
const testConcurrency = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Trigger two claims simultaneously
    const promise1 = streakService.claimReward({ userId, clientPayload: {}, req })
      .then(res => ({ request: 1, status: 'SUCCESS', data: res }))
      .catch(err => ({ request: 1, status: 'REJECTED', error: err.message, code: err.statusCode }));

    const promise2 = streakService.claimReward({ userId, clientPayload: {}, req })
      .then(res => ({ request: 2, status: 'SUCCESS', data: res }))
      .catch(err => ({ request: 2, status: 'REJECTED', error: err.message, code: err.statusCode }));

    const results = await Promise.all([promise1, promise2]);

    const successes = results.filter(r => r.status === 'SUCCESS');
    const rejected = results.filter(r => r.status === 'REJECTED');

    res.json({
      success: true,
      description: 'Concurrency Test: 2 simultaneous claim requests executed',
      passed: successes.length === 1 && rejected.length === 1,
      expected: 'Exactly 1 SUCCESS and 1 REJECTED (no double reward)',
      results
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get audit logs for evaluator inspection (Section 64)
 * GET /api/dev/audit-logs
 */
const getAuditLogsList = async (req, res, next) => {
  try {
    const logs = await getRecentAuditLogs(req.query.limit || 50);
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  advanceTime,
  resetClock,
  resetUserStreak,
  testConcurrency,
  getAuditLogsList
};
