const express = require('express');
const router = express.Router();
const { optionalAuth, requireAuth } = require('../middleware/auth.middleware');
const { getSpinStatus, executeSpin } = require('../services/spin.service');
const { getUserTasks, completeTask } = require('../services/tasks.service');
const { getLeaderboard } = require('../services/leaderboard.service');
const { getUserBadges } = require('../services/badges.service');
const { getUserNotifications, markAsRead } = require('../services/notifications.service');
const { getWalletStats, debitPoints } = require('../services/wallet.service');

// 1. LUCKY SPIN
router.get('/spin/status', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const status = await getSpinStatus(userId);
    res.json({ success: true, ...status });
  } catch (err) {
    next(err);
  }
});

router.post('/spin', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { useGems } = req.body || {};
    const result = await executeSpin({ userId, useGems });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 2. TASKS & ACTIVITIES
router.get('/tasks', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const tasks = await getUserTasks(userId);
    res.json({ success: true, tasks });
  } catch (err) {
    next(err);
  }
});

router.post('/tasks/:id/complete', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const taskId = req.params.id;
    const result = await completeTask({ userId, taskId });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// 3. LEADERBOARD
router.get('/leaderboard', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { timeframe } = req.query;
    const leaderboard = await getLeaderboard(userId, timeframe);
    res.json({ success: true, ...leaderboard });
  } catch (err) {
    next(err);
  }
});

// 4. BADGES & ACHIEVEMENTS
router.get('/badges', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const badgesData = await getUserBadges(userId);
    res.json({ success: true, ...badgesData });
  } catch (err) {
    next(err);
  }
});

// 5. NOTIFICATIONS
router.get('/notifications', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const data = await getUserNotifications(userId);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
});

router.post('/notifications/:id/read', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const data = await markAsRead(userId, req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// 6. WALLET STATS & WITHDRAWAL
router.get('/wallet-stats', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const statsData = await getWalletStats(userId);
    res.json({ success: true, ...statsData });
  } catch (err) {
    next(err);
  }
});

router.post('/wallet/withdraw', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    const { amount, currency = 'INR', method = 'AMAZON_VOUCHER', accountDetails } = req.body;
    
    const result = await debitPoints({
      userId,
      amount: Number(amount),
      currency,
      source: 'WITHDRAWAL',
      referenceId: `WD-${Date.now()}`,
      description: `Redeemed ${currency === 'INR' ? '₹' + amount : amount + ' ' + currency} via ${method}`
    });

    res.json({
      success: true,
      message: `Successfully redeemed ${currency === 'INR' ? '₹' + amount : amount + ' ' + currency}!`,
      wallet: result.wallet,
      transaction: result.transaction
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
