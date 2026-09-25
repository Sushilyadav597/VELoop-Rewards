import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import streakApi from '../services/streakApi';
import { useAuth } from './AuthContext';

const StreakContext = createContext();

// Resilient default rewards matching standard 7-day configuration
const INITIAL_DEFAULT_REWARDS = [
  { day: 1, title: 'Daily Reward', subtitle: '5 VEs', amount: 5, currency: 'VES', assetType: 'coin', status: 'CLAIMED', isToday: false },
  { day: 2, title: 'Daily Reward', subtitle: '10 VEs', amount: 10, currency: 'VES', assetType: 'coin', badge: 'Today', status: 'AVAILABLE', isToday: true },
  { day: 3, title: 'Daily Reward', subtitle: '15 VEs', amount: 15, currency: 'VES', assetType: 'coin', status: 'LOCKED', isToday: false },
  { day: 4, title: 'Daily Reward', subtitle: 'Amazon Gift Card', amount: 1, currency: 'INR', assetType: 'gift-box', badge: 'Gift Card', status: 'LOCKED', isToday: false },
  { day: 5, title: 'Daily Reward', subtitle: 'Amazon Gift Card', amount: 2, currency: 'INR', assetType: 'amazon-card', badge: 'Gift Card', status: 'LOCKED', isToday: false },
  { day: 6, title: 'Daily Reward', subtitle: '30 VEs', amount: 30, currency: 'VES', assetType: 'gift-box', badge: 'Coin', status: 'LOCKED', isToday: false },
  { day: 7, title: 'Amazon Card', subtitle: '₹5 Voucher', amount: 5, currency: 'INR', assetType: 'crown', badge: 'Grand', status: 'LOCKED', isToday: false }
];

const INITIAL_DEFAULT_STREAK = {
  currentStreak: 1,
  currentDay: 2,
  checkedIn: 1,
  totalRewards: 7,
  isEligibleToday: true,
  nextReward: { amount: 10, currency: 'VES' }
};

export const StreakProvider = ({ children }) => {
  const { user, token, updateWalletBalances, refreshWallet } = useAuth();

  const [streakState, setStreakState] = useState(INITIAL_DEFAULT_STREAK);
  const [rewards, setRewards] = useState(INITIAL_DEFAULT_REWARDS);
  const [serverTime, setServerTime] = useState(new Date().toISOString());
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
    if (showLoader) setIsLoading(true);
    setError(null);

    try {
      const data = await streakApi.getStreak();
      if (data && data.success) {
        setStreakState(data.streak);
        setRewards(data.rewards);
        setServerTime(data.serverTime);
      } else if (data && data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.warn('[StreakContext fetch notice]:', err.message);
      // In offline/initial phase, retain responsive defaults rather than blanking the UI
      if (!streakState) {
        setError(err.message || 'Connecting to rewards server...');
      }
    } finally {
      setIsLoading(false);
    }
  }, [streakState]);

  // Load initial streak state when token changes or unblock loader safely
  useEffect(() => {
    if (token) {
      refreshStreak(false);
    }
    // Safety timer to prevent any infinite blocking spinner during cold starts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
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
