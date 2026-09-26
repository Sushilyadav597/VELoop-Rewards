import api from './api';

/**
 * Get authenticated user's wallet balances
 * GET /api/wallet
 */
export const getWallet = async () => {
  return await api.get('/wallet');
};

/**
 * Get paginated transaction history for authenticated user
 * GET /api/wallet/transactions?page=1&limit=20
 */
export const getWalletTransactions = async ({ page = 1, limit = 20 } = {}) => {
  return await api.get('/wallet/transactions', {
    params: { page, limit }
  });
};
