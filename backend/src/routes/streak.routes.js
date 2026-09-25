const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streak.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { claimLimiter } = require('../middleware/rateLimiter.middleware');

const rotatingController = require('../controllers/rotatingReward.controller');

// All streak routes require authentication
router.use(requireAuth);

// GET /api/daily-streak
router.get('/', streakController.getStreak);

// GET /api/daily-streak/status
router.get('/status', streakController.getStatus);

// POST /api/daily-streak/claim (rate-limited and protected)
router.post('/claim', claimLimiter, streakController.claimStreak);

// GET /api/daily-streak/history
router.get('/history', streakController.getHistory);

// Dynamic 24h Rotating Daily Reward Routes
router.get('/rotating-drop', rotatingController.getTodayDrop);
router.post('/rotating-drop/claim', claimLimiter, rotatingController.claimTodayDrop);

module.exports = router;

