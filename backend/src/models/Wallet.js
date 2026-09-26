const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true
    },
    vesBalance: {
      type: Number,
      default: 0,
      min: [0, 'VES balance cannot be negative']
    },
    amazonVouchersTotal: {
      type: Number,
      default: 0,
      min: [0, 'Amazon vouchers total cannot be negative']
    },
    gemsBalance: {
      type: Number,
      default: 0,
      min: [0, 'Gems balance cannot be negative']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Wallet', walletSchema);
