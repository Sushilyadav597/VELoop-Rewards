const mongoose = require('mongoose');

const streakRewardSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: [true, 'Streak day is required'],
      min: [1, 'Streak day must be between 1 and 30'],
      max: [30, 'Streak day must be between 1 and 30']
    },
    title: {
      type: String,
      default: 'Daily Reward',
      trim: true
    },
    subtitle: {
      type: String,
      default: '',
      trim: true
    },
    rewardType: {
      type: String,
      enum: {
        values: ['VES', 'GIFT_CARD', 'ULTIMATE_GIFT_CARD', 'SPECIAL'],
        message: '{VALUE} is not a valid reward type'
      },
      required: [true, 'Reward type is required']
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'VES',
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Reward amount is required'],
      min: [0, 'Reward amount cannot be negative']
    },
    assetType: {
      type: String,
      enum: ['coin', 'coin-stack', 'gift-box', 'amazon-card', 'crown'],
      default: 'coin'
    },
    badge: {
      type: String,
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    configId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StreakConfig',
      default: null
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

// Compound unique index allowing multiple configurations while ensuring unique days per configuration
streakRewardSchema.index({ configId: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('StreakReward', streakRewardSchema);
