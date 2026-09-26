const mongoose = require('mongoose');

const streakConfigSchema = new mongoose.Schema(
  {
    configKey: {
      type: String,
      default: 'DEFAULT',
      unique: true,
      trim: true
    },
    cycleDays: {
      type: Number,
      default: 7,
      min: [1, 'Cycle days must be at least 1']
    },
    claimCooldownMs: {
      type: Number,
      default: 24 * 60 * 60 * 1000 // 24 hours cooldown
    },
    claimGracePeriodMs: {
      type: Number,
      default: 24 * 60 * 60 * 1000 // 24 hours grace window
    },
    autoResetOnMissed: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StreakConfig', streakConfigSchema);
