import { useState, useEffect, useCallback } from 'react';
import * as walletApi from '../services/walletApi';

export const useWallet = (autoFetch = true) => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await walletApi.getWallet();
      const walletObj = res?.wallet || res?.data || null;
      if (walletObj) {
        setWallet(walletObj);
      }
      return walletObj;
    } catch (err) {
      setError(err.message || 'Failed to load wallet data.');
      throw err;
    }
  }, []);

  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      const res = await walletApi.getWalletTransactions(params);
      const txList = res?.transactions || res?.data?.transactions || (Array.isArray(res?.data) ? res.data : []);
      setTransactions(txList);
      return txList;
    } catch (err) {
      setError(err.message || 'Failed to load wallet transactions.');
      throw err;
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchWallet(), fetchTransactions()]);
    } catch (err) {
      // Handled in sub-functions
    } finally {
      setLoading(false);
    }
  }, [fetchWallet, fetchTransactions]);

  useEffect(() => {
    if (autoFetch) {
      refreshAll();
    }
  }, [autoFetch, refreshAll]);

  return {
    wallet,
    transactions,
    loading,
    error,
    fetchWallet,
    fetchTransactions,
    refreshAll
  };
};

export default useWallet;
