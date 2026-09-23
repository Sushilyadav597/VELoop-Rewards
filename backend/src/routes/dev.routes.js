const express = require('express');
const router = express.Router();
const devController = require('../controllers/dev.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/advance-time', devController.advanceTime);
router.post('/reset-clock', devController.resetClock);
router.get('/audit-logs', devController.getAuditLogsList);

// User-specific dev actions require auth
router.post('/reset-user-streak', requireAuth, devController.resetUserStreak);
router.post('/test-concurrency', requireAuth, devController.testConcurrency);

module.exports = router;
