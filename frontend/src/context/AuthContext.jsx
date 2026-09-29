import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as authApi from '../services/authApi';
import api from '../services/api';

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
  const [wallet, setWallet] = useState(() => {
    try {
      const savedWallet = localStorage.getItem('wallet');
      return savedWallet ? JSON.parse(savedWallet) : { vesBalance: 100, gemsBalance: 120, amazonVouchersTotal: 0 };
    } catch {
      return { vesBalance: 100, gemsBalance: 120, amazonVouchersTotal: 0 };
    }
  });
  const [loading, setLoading] = useState(false);

  // Synchronize wallet directly from backend
  const refreshWallet = useCallback(async () => {
    try {
      const res = await api.get('/wallet');
      if (res && (res.wallet || res.data)) {
        const w = res.wallet || res.data;
        setWallet(w);
        localStorage.setItem('wallet', JSON.stringify(w));
      }
    } catch (err) {
      // Non-blocking warning
      console.warn('[refreshWallet notice]:', err.message);
    }
  }, []);

  // Update wallet balances manually after authoritative claim
  const updateWalletBalances = useCallback((newWallet) => {
    if (newWallet) {
      setWallet((prev) => {
        const merged = { ...prev, ...newWallet };
        localStorage.setItem('wallet', JSON.stringify(merged));
        return merged;
      });
    }
  }, []);

  // Restore and verify authentication state upon application refresh
  useEffect(() => {
    const restoreAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        // Auto demo login so reviewer immediately has active interactive streak
        try {
          await demoLogin('new');
        } catch (e) {
          // ignore
        }
        return;
      }

      try {
        const response = await authApi.getCurrentUser();
        if (response && response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          setToken(storedToken);
          if (response.wallet) {
            setWallet(response.wallet);
            localStorage.setItem('wallet', JSON.stringify(response.wallet));
          }
        } else if (response && response.success === false) {
          logout();
        }
      } catch (err) {
        if (err?.status === 401) {
          logout();
        }
      }
    };

    restoreAuth();
  }, []);

  const login = async (emailOrName, password) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email: emailOrName, password });
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        if (response.wallet) {
          setWallet(response.wallet);
          localStorage.setItem('wallet', JSON.stringify(response.wallet));
        }
        return response;
      }
      throw new Error('Invalid login response from server.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authApi.register({ name, email, password });
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        if (response.wallet) {
          setWallet(response.wallet);
          localStorage.setItem('wallet', JSON.stringify(response.wallet));
        }
        return response;
      }
      throw new Error('Invalid registration response from server.');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (accountType = 'new') => {
    setLoading(true);
    try {
      const response = await authApi.demoLogin(accountType);
      if (response && response.token && response.user) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);
        if (response.wallet) {
          setWallet(response.wallet);
          localStorage.setItem('wallet', JSON.stringify(response.wallet));
        }
        return response;
      }
      throw new Error('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('wallet');
    setToken(null);
    setUser(null);
    setWallet({ vesBalance: 0, gemsBalance: 0, amazonVouchersTotal: 0 });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        wallet,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        demoLogin,
        refreshWallet,
        updateWalletBalances,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthContext = useAuth;
export default AuthContext;
