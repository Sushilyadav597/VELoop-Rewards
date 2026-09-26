const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
const { authenticate } = require('../middleware/authMiddleware');

// All streak endpoints are protected by JWT authentication
router.use(authenticate);

// GET /api/daily-streak
router.get('/', streakController.getDailyStreak);

// GET /api/daily-streak/status
router.get('/status', streakController.getStatus);

// GET /api/daily-streak/history
router.get('/history', streakController.getHistory);

// POST /api/daily-streak/claim
router.post('/claim', streakController.claim);

module.exports = router;
