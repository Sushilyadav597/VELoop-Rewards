import api from './api';

/**
 * Get complete daily streak information (streak status + 7 reward cards)
 * GET /api/daily-streak
 */
export const getDailyStreak = async () => {
  return await api.get('/daily-streak');
};

export const getStreak = getDailyStreak;

/**
 * Get concise daily streak status
 * GET /api/daily-streak/status
 */
export const getDailyStreakStatus = async () => {
  return await api.get('/daily-streak/status');
};

export const getStatus = getDailyStreakStatus;

/**
 * Authoritatively claim today's streak reward
 * POST /api/daily-streak/claim
 * Sends payload to backend which independently validates eligibility
 */
export const claimDailyStreak = async (payload = {}) => {
  return await api.post('/daily-streak/claim', payload);
};

export const claimReward = claimDailyStreak;

/**
 * Get paginated claim history for authenticated user
 * GET /api/daily-streak/history?page=1&limit=20
 */
export const getStreakHistory = async ({ page = 1, limit = 20 } = {}) => {
  return await api.get('/daily-streak/history', {
    params: { page, limit }
  });
};

export const getHistory = async () => {
  return await api.get('/daily-streak/history');
};

/**
 * Rotating Daily Drop Endpoints
 */
export const getRotatingDrop = async () => {
  return await api.get('/daily-streak/rotating-drop');
};

export const claimRotatingDrop = async () => {
  return await api.post('/daily-streak/rotating-drop/claim');
};

/**
 * Evaluator Anti-Cheat & Simulation APIs (/api/dev)
 */
export const advanceTime = async (hours = 24) => {
  return await api.post('/dev/advance-time', { hours });
};

export const resetClock = async () => {
  return await api.post('/dev/reset-clock');
};

export const resetUserStreak = async () => {
  return await api.post('/dev/reset-user-streak');
};

export const testConcurrency = async () => {
  return await api.post('/dev/test-concurrency');
};

export const getAuditLogs = async (limit = 30) => {
  return await api.get('/dev/audit-logs', { params: { limit } });
};

/**
 * Wallet API
 */
export const getWallet = async () => {
  return await api.get('/wallet');
};

const streakApi = {
  getDailyStreak,
  getStreak,
  getDailyStreakStatus,
  getStatus,
  claimDailyStreak,
  claimReward,
  getStreakHistory,
  getHistory,
  getRotatingDrop,
  claimRotatingDrop,
  advanceTime,
  resetClock,
  resetUserStreak,
  testConcurrency,
  getAuditLogs,
  getWallet
};

export default streakApi;
