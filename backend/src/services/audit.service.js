const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const { getDBStatus } = require('../config/db');
const { getServerTime } = require('../utils/time.utils');

const inMemoryAuditLogs = [];

const logAuditEvent = async ({ userId, action, event, details = {}, req = null }) => {
  const timestamp = getServerTime();
  const ipAddress = req?.headers?.['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
  const userAgent = req?.headers?.['user-agent'] || 'internal';

  const logEntry = {
    userId: (userId && mongoose.isValidObjectId(userId)) ? userId : null,
    action: action || event || 'SYSTEM_ACTION',
    event: event || action,
    details,
    ipAddress,
    userAgent,
    timestamp
  };

  inMemoryAuditLogs.unshift({ ...logEntry, id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` });
  if (inMemoryAuditLogs.length > 200) inMemoryAuditLogs.pop();

  if (getDBStatus()) {
    try {
      await AuditLog.create(logEntry);
    } catch (err) {
      console.error('[AuditLog Error]:', err.message);
    }
  }

  return logEntry;
};

const getRecentAuditLogs = async (limit = 50) => {
  if (getDBStatus()) {
    try {
      const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
      if (logs && logs.length > 0) return logs;
    } catch (e) {
      // fallback
    }
  }
  return inMemoryAuditLogs.slice(0, limit);
};

module.exports = {
  logAuditEvent,
  getRecentAuditLogs
};
