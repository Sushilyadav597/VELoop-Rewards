const mongoose = require('mongoose');

const streakRewardSchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 30
    },
    title: {
      type: String,
      default: 'Daily Reward'
    },
    subtitle: {
      type: String,
      default: ''
    },
    rewardType: {
      type: String,
      enum: ['VES', 'GIFT_CARD', 'ULTIMATE_GIFT_CARD', 'SPECIAL'],
      required: true
    },
    currency: {
      type: String,
      default: 'VES'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
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
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StreakReward', streakRewardSchema);
