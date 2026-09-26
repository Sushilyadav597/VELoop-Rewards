import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authApi from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Restore authentication state upon application refresh
  useEffect(() => {
    const restoreAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response && response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    if (response && response.token && response.user) {
      localStorage.setItem('token', response.token);
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
      setToken(response.token);
      setUser(response.user);
      return response;
    }
    throw new Error('Invalid registration response from server.');
  };

  const logout = () => {
    localStorage.removeItem('token');
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
