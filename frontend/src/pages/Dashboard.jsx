import React, { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import useStreak from '../hooks/useStreak';
import useWallet from '../hooks/useWallet';
import StreakCard from '../components/StreakCard';
import Countdown from '../components/Countdown';
import ClaimModal from '../components/ClaimModal';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import styles from '../styles/globals.module.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const {
    streakData,
    loading: streakLoading,
    error: streakError,
    claiming,
    claimSuccessData,
    fetchStreak,
    checkStatus,
    claimToday,
    clearClaimSuccess
  } = useStreak(true);

  const {
    wallet,
    error: walletError,
    fetchWallet
  } = useWallet(true);

  // When a claim succeeds, re-fetch wallet balance immediately
  useEffect(() => {
    if (claimSuccessData) {
      fetchWallet();
    }
  }, [claimSuccessData, fetchWallet]);

  // Handle both streak data shapes (data object or streak object)
  const streak = streakData?.data || streakData?.streak;
  const rewards = streakData?.rewards || streakData?.data?.rewards || [];
  const serverTime = streakData?.serverTime || streak?.serverTime;

  // Authoritative eligibility check from backend
  const canClaim = Boolean((streak?.canClaim ?? streak?.isEligibleToday) && !claiming);
  const currentReward = streak?.currentReward || (canClaim ? streak?.nextReward : null) || rewards.find(r => r.day === streak?.currentDay);
  const nextReward = streak?.nextReward;

  const isGiftCardReward = (reward) => {
    return reward?.currency === 'INR' || (reward?.rewardType && reward.rewardType.includes('GIFT_CARD'));
  };

  const handleClaimClick = async () => {
    try {
      await claimToday();
    } catch (err) {
      // Error is caught and surfaced via streakError
    }
  };

  if (streakLoading && !streakData) {
    return <LoadingState message="Loading your daily rewards dashboard..." fullPage />;
  }

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.75rem 1.25rem 3.5rem' }}>
      {/* 1. Header / Welcome Banner with User Greeting and Balances */}
      <div
        className={styles.glassCard}
        style={{
          padding: '2rem 2.25rem',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', color: 'var(--accent-glow)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 800 }}>
            ⚡ VELOOP REWARDS — DAILY STREAK SYSTEM
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0.35rem 0', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name || 'Explorer'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, maxWidth: '580px' }}>
            Check in daily to build your 7-day streak, earn VEs coins, and unlock Amazon Gift Vouchers.
          </p>
        </div>

        {/* Authoritative Balances from Backend (PDF requirement: ₹ for Amazon Vouchers, never $) */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* VEs Coin Balance */}
          <div
            style={{
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              minWidth: '150px'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-glow)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              VEs Balance
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              🪙 {wallet ? (wallet.vesBalance ?? 0) : '0'}
            </div>
          </div>

          {/* Amazon Vouchers Total (INR ₹) */}
          <div
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              minWidth: '160px'
            }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--reward-gold)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
              Amazon Vouchers
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--reward-gold)', marginTop: '0.2rem' }}>
              🎟️ ₹{wallet ? (wallet.amazonVouchersTotal ?? 0) : '0'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Global Error Display (e.g. 409 conflict, network error) */}
      {(streakError || walletError) && (
        <ErrorState
          error={streakError || walletError}
          onRetry={() => {
            fetchStreak();
            fetchWallet();
          }}
          onDismiss={() => {}}
        />
      )}

      {/* 3. Visually Prominent Current Reward & Claim Action Section */}
      <div
        className={styles.glassCard}
        style={{
          padding: '2rem 2.25rem',
          marginBottom: '2.5rem',
          border: canClaim ? '2px solid var(--primary-accent)' : '1px solid var(--border-subtle)',
          boxShadow: canClaim ? '0 0 28px rgba(139, 92, 246, 0.25)' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          {/* Left: Streak Stats & Current Actionable Reward */}
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Streak Counter */}
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Current Streak
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--reward-gold)', marginTop: '0.2rem' }}>
                🔥 {streak ? streak.currentStreak : 0} {streak?.currentStreak === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            {/* Target Day */}
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                Active Cycle Target
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                Day {streak ? streak.currentDay : 1} <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>/ 7</span>
              </div>
            </div>

            {/* Current Reward Details */}
            {currentReward && (
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '2rem' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--accent-glow)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                  {canClaim ? "Eligible Today's Reward" : 'Upcoming Reward'}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--reward-gold)', marginTop: '0.2rem' }}>
                  {isGiftCardReward(currentReward)
                    ? `₹${currentReward.amount} Amazon Gift Voucher`
                    : `+${currentReward.amount} ${currentReward.currency || 'VEs'}`}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {currentReward.title || (isGiftCardReward(currentReward) ? 'Amazon Voucher' : 'Daily Check-in Bonus')}
                </div>
              </div>
            )}
          </div>

          {/* Right: Claim Button & Countdown Timer */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            {!canClaim && streak?.nextClaimAt && (
              <Countdown
                serverTime={serverTime}
                nextClaimAt={streak.nextClaimAt}
                onCountdownZero={checkStatus}
                label="Next Check-in Unlocks In"
              />
            )}

            <button
              onClick={handleClaimClick}
              disabled={!canClaim || claiming}
              className={canClaim ? `${styles.primaryButton} ${styles.pulseGlow}` : styles.primaryButton}
              style={{
                padding: '0.95rem 2.25rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '12px'
              }}
              aria-label={canClaim ? 'Claim daily streak reward' : 'Claim locked'}
            >
              {claiming ? (
                <>⏳ Claiming Reward...</>
              ) : canClaim ? (
                <>⚡ Claim Day {streak?.currentDay || 1} Reward</>
              ) : (
                <>🔒 Check-In Locked</>
              )}
            </button>
          </div>
        </div>

        {/* Next Reward Preview Footer if available */}
        {nextReward && !canClaim && (
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.88rem',
              color: 'var(--text-secondary)'
            }}
          >
            <span>
              Up Next: <strong>Day {nextReward.day}</strong> &rarr;{' '}
              <span style={{ color: 'var(--reward-gold)' }}>
                {isGiftCardReward(nextReward) ? `₹${nextReward.amount} Amazon Gift Voucher` : `+${nextReward.amount} ${nextReward.currency || 'VEs'}`}
              </span>
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Maintain check-ins every 24h to keep streak streak alive!
            </span>
          </div>
        )}
      </div>

      {/* 4. 7-Day Reward Cards Grid (Strictly Rendered from Backend) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              7-Day Streak Timeline
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.2rem 0 0' }}>
              All rewards are authoritatively configured and verified by the VELoop rewards engine.
            </p>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            Cycle: {streak?.cycleId || 'Active'}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
            gap: '1rem'
          }}
        >
          {rewards.map((reward) => (
            <StreakCard key={reward.day} reward={reward} />
          ))}
        </div>
      </div>

      {/* 5. Authoritative Claim Modal */}
      <ClaimModal
        isOpen={!!claimSuccessData}
        claimData={claimSuccessData}
        onClose={clearClaimSuccess}
      />
    </div>
  );
};

export default Dashboard;
