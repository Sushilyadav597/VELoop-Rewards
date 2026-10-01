const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streak.controller');
const { requireAuth, optionalAuth } = require('../middleware/auth.middleware');
const { claimLimiter } = require('../middleware/rateLimiter.middleware');

const rotatingController = require('../controllers/rotatingReward.controller');

// GET /api/daily-streak (supports optional auth: guest view or user-specific streak)
router.get('/', optionalAuth, streakController.getStreak);

// GET /api/daily-streak/status
router.get('/status', optionalAuth, streakController.getStatus);

// POST /api/daily-streak/claim (rate-limited and authenticated)
router.post('/claim', requireAuth, claimLimiter, streakController.claimStreak);

// GET /api/daily-streak/history
router.get('/history', requireAuth, streakController.getHistory);

// Dynamic 24h Rotating Daily Reward Routes
router.get('/rotating-drop', optionalAuth, rotatingController.getTodayDrop);
router.post('/rotating-drop/claim', requireAuth, claimLimiter, rotatingController.claimTodayDrop);


module.exports = router;

