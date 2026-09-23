const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.Mixed,
      index: true
    },
    event: {
      type: String,
      enum: [
        'STREAK_CLAIM_REQUEST',
        'STREAK_CLAIM_SUCCESS',
        'STREAK_CLAIM_REJECTED',
        'STREAK_RESET',
        'DUPLICATE_CLAIM',
        'INVALID_CLAIM',
        'USER_LOGIN',
        'USER_REGISTER',
        'DEV_TIME_ADVANCE'
      ],
      required: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
