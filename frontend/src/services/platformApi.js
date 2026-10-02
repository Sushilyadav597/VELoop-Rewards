import api from './api';

// Spin APIs
export const getSpinStatus = async () => {
  return await api.get('/spin/status');
};

export const executeSpin = async ({ useGems = false } = {}) => {
  return await api.post('/spin', { useGems });
};

// Tasks APIs
export const getTasks = async () => {
  return await api.get('/tasks');
};

export const completeTask = async (taskId) => {
  return await api.post(`/tasks/${taskId}/complete`);
};

// Leaderboard APIs
export const getLeaderboard = async (timeframe = 'weekly') => {
  return await api.get('/leaderboard', { params: { timeframe } });
};

// Badges APIs
export const getBadges = async () => {
  return await api.get('/badges');
};

// Notifications APIs
export const getNotifications = async () => {
  return await api.get('/notifications');
};

export const markNotificationRead = async (notificationId = 'all') => {
  return await api.post(`/notifications/${notificationId}/read`);
};

// Wallet Stats & Withdrawals
export const getWalletStats = async () => {
  return await api.get('/wallet-stats');
};

export const withdrawFunds = async ({ amount, currency, method, accountDetails }) => {
  return await api.post('/wallet/withdraw', { amount, currency, method, accountDetails });
};
