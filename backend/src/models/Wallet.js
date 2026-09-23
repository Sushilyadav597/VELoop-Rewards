const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      unique: true
    },
    vesBalance: {
      type: Number,
      default: 100,
      min: 0
    },
    gemsBalance: {
      type: Number,
      default: 120, // matching the 120 Gem balance shown in design reference
      min: 0
    },
    amazonVouchersTotal: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
