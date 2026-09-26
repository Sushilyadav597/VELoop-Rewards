const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { authenticate } = require('../middleware/authMiddleware');

// All wallet endpoints are protected by JWT authentication
router.use(authenticate);

// GET /api/wallet
router.get('/', walletController.getWallet);

// GET /api/wallet/transactions
router.get('/transactions', walletController.getTransactions);

module.exports = router;
