const mongoose = require('mongoose');

const streakClaimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: [true, 'Claim ID is required'],
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },
    rewardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakReward',
      default: null
    },
    cycleId: {
      type: String,
      required: [true, 'Cycle reference ID is required'],
      index: true
    },
    day: {
      type: Number,
      required: [true, 'Streak day is required'],
      min: [1, 'Streak day must be between 1 and 30'],
      max: [30, 'Streak day must be between 1 and 30']
    },
    rewardType: {
      type: String,
      required: [true, 'Reward type is required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required']
    },
    rewardSnapshot: {
      title: String,
      subtitle: String,
      rewardType: String,
      currency: String,
      amount: Number,
      assetType: String
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction reference ID is required']
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    },
    claimedAt: {
      type: Date,
      default: Date.now
    },
    ipAddress: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Compound unique index to strictly prevent duplicate claims per user, cycle, and streak day
streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('StreakClaim', streakClaimSchema);
