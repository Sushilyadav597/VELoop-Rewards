import api from './api';

/**
 * Get complete daily streak information (streak status + 7 reward cards)
 * GET /api/daily-streak
 */
export const getDailyStreak = async () => {
  return await api.get('/daily-streak');
};

/**
 * Get concise daily streak status
 * GET /api/daily-streak/status
 */
export const getDailyStreakStatus = async () => {
  return await api.get('/daily-streak/status');
};

/**
 * Authoritatively claim today's streak reward
 * POST /api/daily-streak/claim
 * Sends strictly empty body {} - backend decides all parameters
 */
export const claimDailyStreak = async () => {
  return await api.post('/daily-streak/claim', {});
};

/**
 * Get paginated claim history for authenticated user
 * GET /api/daily-streak/history?page=1&limit=20
 */
export const getStreakHistory = async ({ page = 1, limit = 20 } = {}) => {
  return await api.get('/daily-streak/history', {
    params: { page, limit }
  });
};
