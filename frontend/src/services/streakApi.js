import api from './api';

export const streakApi = {
  // Streak Endpoints
  getStreak: () => api.get('/daily-streak'),
  getStatus: () => api.get('/daily-streak/status'),
  claimReward: (payload = {}) => api.post('/daily-streak/claim', payload),
  getHistory: () => api.get('/daily-streak/history'),

  // Wallet Endpoints
  getWallet: () => api.get('/wallet'),
  getTransactions: () => api.get('/wallet/transactions'),

  // Auth Endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  demoLogin: (accountType) => api.post('/auth/demo-login', { accountType }),
  getMe: () => api.get('/auth/me'),

  // Evaluator Simulation Endpoints
  advanceTime: (hours = 24) => api.post('/dev/advance-time', { hours }),
  resetClock: () => api.post('/dev/reset-clock'),
  resetUserStreak: () => api.post('/dev/reset-user-streak'),
  testConcurrency: () => api.post('/dev/test-concurrency'),
  getAuditLogs: (limit = 30) => api.get(`/dev/audit-logs?limit=${limit}`)
};

export default streakApi;
