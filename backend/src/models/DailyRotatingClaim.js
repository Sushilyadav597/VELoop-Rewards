const mongoose = require('mongoose');

const dailyRotatingClaimSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      index: true
    },
    dateKey: {
      type: String, // Format: YYYY-MM-DD based on authoritative serverTime
      required: true,
      index: true
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6
    },
    dropName: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: ''
    },
    reward: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    claimedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Compound unique index ensuring at most 1 rotating drop claim per user per calendar day
dailyRotatingClaimSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model('DailyRotatingClaim', dailyRotatingClaimSchema);
