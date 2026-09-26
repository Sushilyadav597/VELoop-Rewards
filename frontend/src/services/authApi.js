import api from './api';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async ({ name, email, password }) => {
  return await api.post('/auth/register', { name, email, password });
};

/**
 * Log in an existing user
 * POST /api/auth/login
 */
export const login = async ({ email, password }) => {
  return await api.post('/auth/login', { email, password });
};

/**
 * Retrieve authenticated user profile
 * GET /api/auth/me
 */
export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};
