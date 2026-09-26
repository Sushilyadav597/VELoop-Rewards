import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // Restore and verify authentication state upon application refresh
  useEffect(() => {
    const restoreAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response && response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          setToken(storedToken);
        } else if (response && response.success === false) {
          logout();
        }
      } catch (err) {
        // Only log out if it is an explicit 401 Unauthorized from backend
        if (err?.status === 401) {
          logout();
        }
      }
    };

    restoreAuth();
  }, []);

  const login = async (emailOrName, password) => {
    const response = await authApi.login({ email: emailOrName, password });
    if (response && response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error('Invalid login response from server.');
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    if (response && response.token && response.user) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error('Invalid registration response from server.');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
export default AuthContext;
