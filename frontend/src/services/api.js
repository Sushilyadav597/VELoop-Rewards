import axios from 'axios';

// Base API instance configured with environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: inject Bearer JWT from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: extract data or format error
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected network error occurred.';

    // If 401 Unauthorized, token is expired or invalid
    if (status === 401) {
      // Clear token to allow clean redirect to login
      localStorage.removeItem('token');
    }

    const enhancedError = new Error(message);
    enhancedError.status = status;
    enhancedError.originalError = error;
    return Promise.reject(enhancedError);
  }
);

export default api;
