const mongoose = require('mongoose');

const walletTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
      index: true
    },
    type: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      default: 'CREDIT'
    },
    rewardType: {
      type: String,
      default: 'VES'
    },
    amount: {
      type: Number,
      required: [true, 'Transaction amount is required']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required']
    },
    source: {
      type: String,
      default: 'DAILY_STREAK'
    },
    streakDay: {
      type: Number,
      default: null
    },
    referenceId: {
      type: String,
      required: [true, 'Reference ID is required']
    },
    balanceBefore: {
      type: Number,
      required: [true, 'Balance before is required']
    },
    balanceAfter: {
      type: Number,
      required: [true, 'Balance after is required']
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED'],
      default: 'COMPLETED'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('WalletTransaction', walletTransactionSchema);
