import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import streakApi from '../services/streakApi';
import { useAuth } from './AuthContext';

const StreakContext = createContext();

export const StreakProvider = ({ children }) => {
  const { user, token, updateWalletBalances, refreshWallet } = useAuth();

  const [streakState, setStreakState] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [serverTime, setServerTime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Claim process flow states
  const [isClaiming, setIsClaiming] = useState(false);
  const [cpaModalOpen, setCpaModalOpen] = useState(false);
  const [pendingClaimDay, setPendingClaimDay] = useState(null);
  const [claimSuccessData, setClaimSuccessData] = useState(null);

  /**
   * Authoritative fetch from backend: GET /api/daily-streak
   * Section 89, 93: UI never calculates status itself
   */
  const refreshStreak = useCallback(async (showLoader = false) => {
    if (!token) return;

    if (showLoader) setIsLoading(true);
    setError(null);

    try {
      const data = await streakApi.getStreak();
      if (data.success) {
        setStreakState(data.streak);
        setRewards(data.rewards);
        setServerTime(data.serverTime);
      }
    } catch (err) {
      console.error('[StreakContext fetch error]:', err);
      setError(err.message || 'Unable to connect to VELoop rewards server.');
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [token]);

  // Load initial streak state when token changes
  useEffect(() => {
    if (token) {
      refreshStreak(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [token, refreshStreak]);

  /**
   * Start claim flow: User clicks Claim -> disable button -> Open CPA Verification modal
   * Section 7, 41, 68, 91
   */
  const initiateClaim = (day) => {
    if (isClaiming) return;
    setError(null);
    setPendingClaimDay(day);
    setCpaModalOpen(true);
  };

  /**
   * Called once CPA Demo verification is completed
   * Sends actual authoritative request to POST /api/daily-streak/claim
   */
  const finalizeAuthoritativeClaim = async () => {
    setIsClaiming(true);
    setError(null);

    try {
      // Send claim request to backend.
      // Notice: backend ignores any client-tampered reward/amount and derives everything safely!
      const result = await streakApi.claimReward({ day: pendingClaimDay });

      if (result.success) {
        // Trigger celebratory confetti effect
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#8B5CF6', '#10B981', '#FBBF24']
        });

        // 1. Update backend wallet state
        if (result.wallet) {
          updateWalletBalances(result.wallet);
        } else {
          refreshWallet();
        }

        // 2. Refresh authoritative streak data from backend (Section 93)
        await refreshStreak(false);

        setClaimSuccessData(result);
        setCpaModalOpen(false);
      }
      return result;
    } catch (err) {
      console.error('[Claim error]:', err);
      setError(err.message || 'Reward claim could not be processed.');
      setCpaModalOpen(false);
      // Refresh to ensure UI shows authoritative state even on rejection
      await refreshStreak(false);
      throw err;
    } finally {
      setIsClaiming(false);
      setPendingClaimDay(null);
    }
  };

  const closeSuccessModal = () => {
    setClaimSuccessData(null);
  };

  return (
    <StreakContext.Provider
      value={{
        streak: streakState,
        rewards,
        serverTime,
        isLoading,
        error,
        isClaiming,
        cpaModalOpen,
        setCpaModalOpen,
        pendingClaimDay,
        claimSuccessData,
        refreshStreak,
        initiateClaim,
        finalizeAuthoritativeClaim,
        closeSuccessModal
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => useContext(StreakContext);
export default StreakContext;
