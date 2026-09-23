const mongoose = require('mongoose');

const streakClaimSchema = new mongoose.Schema(
  {
    claimId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true
    },
    cycleId: {
      type: String,
      required: true,
      index: true
    },
    day: {
      type: Number,
      required: true,
      min: 1,
      max: 30
    },
    rewardSnapshot: {
      title: String,
      subtitle: String,
      rewardType: String,
      currency: String,
      amount: Number,
      assetType: String
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED'],
      default: 'SUCCESS'
    },
    transactionId: {
      type: String,
      required: true
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
  { timestamps: true }
);

// Crucial compound unique constraint matching Section 62 to prevent duplicate claims
streakClaimSchema.index({ userId: 1, cycleId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('StreakClaim', streakClaimSchema);
