import { useState, useEffect, useCallback } from 'react';
import * as streakApi from '../services/streakApi';

export const useStreak = (autoFetch = true) => {
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimSuccessData, setClaimSuccessData] = useState(null);

  const fetchStreak = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await streakApi.getDailyStreak();
      setStreakData(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to load daily streak information.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkStatus = useCallback(async () => {
    try {
      const statusData = await streakApi.getDailyStreakStatus();
      // If we already have streakData, refresh the streak state authoritatively
      await fetchStreak();
      return statusData;
    } catch (err) {
      console.warn('Status check warning:', err.message);
    }
  }, [fetchStreak]);

  const claimToday = useCallback(async () => {
    if (claiming) return;
    setClaiming(true);
    setError(null);
    try {
      // Backend dictates all parameters; send strictly empty body {}
      const claimResult = await streakApi.claimDailyStreak();
      setClaimSuccessData(claimResult);
      // Immediately refresh streak data authoritatively from backend
      await fetchStreak();
      return claimResult;
    } catch (err) {
      setError(err.message || 'Reward claim failed.');
      throw err;
    } finally {
      setClaiming(false);
    }
  }, [claiming, fetchStreak]);

  const clearClaimSuccess = useCallback(() => {
    setClaimSuccessData(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchStreak();
    }
  }, [autoFetch, fetchStreak]);

  return {
    streakData,
    loading,
    error,
    claiming,
    claimSuccessData,
    fetchStreak,
    checkStatus,
    claimToday,
    clearClaimSuccess
  };
};

export default useStreak;
