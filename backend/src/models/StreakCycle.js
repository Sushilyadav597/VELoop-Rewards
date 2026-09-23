const mongoose = require('mongoose');

const streakCycleSchema = new mongoose.Schema(
  {
    cycleId: {
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
    cycleNumber: {
      type: Number,
      default: 1
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'COMPLETED', 'RESET'],
      default: 'ACTIVE'
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    checkedInCount: {
      type: Number,
      default: 0
    },
    lastClaimAt: {
      type: Date,
      default: null
    },
    nextClaimAt: {
      type: Date,
      default: null
    },
    resetReason: {
      type: String,
      default: null
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('StreakCycle', streakCycleSchema);
