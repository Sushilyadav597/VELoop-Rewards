const mongoose = require('mongoose');

const streakConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: 'DEFAULT',
      unique: true
    },
    cycleDays: {
      type: Number,
      default: 7
    },
    claimCooldownMs: {
      type: Number,
      default: 24 * 60 * 60 * 1000 // 24 hours
    },
    claimGracePeriodMs: {
      type: Number,
      default: 24 * 60 * 60 * 1000 // 24 hours
    },
    autoResetOnMissed: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StreakConfig', streakConfigSchema);
