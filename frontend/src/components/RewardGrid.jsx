import React from 'react';
import RewardCard from './RewardCard';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

export const RewardGrid = ({
  rewards = [],
  isClaiming,
  serverTime,
  onClaim,
  onCountdownExpire
}) => {
  // Sort rewards by day
  const sortedRewards = [...rewards].sort((a, b) => a.day - b.day);
  const row1 = sortedRewards.filter((r) => r.day <= 4);
  const row2 = sortedRewards.filter((r) => r.day > 4);

  return (
    <div className="mb-3 mb-md-4">
      {/* Centered tag banner matching reference screenshot */}
      <div className="text-center mb-3">
        <span
          className="d-inline-flex align-items-center gap-1.5 px-3 py-1 fw-medium"
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(167, 139, 250, 0.28)',
            borderRadius: '999px',
            color: '#C4B5FD',
            fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)',
            letterSpacing: '0.4px',
            boxShadow: '0 0 16px rgba(139, 92, 246, 0.12)'
          }}
        >
          <span style={{ color: '#A78BFA' }}>✦</span>
          <span>Come back tomorrow for more rewards!</span>
          <span style={{ color: '#A78BFA' }}>✦</span>
        </span>
      </div>

      {/* Desktop View: Single 7-card row across the page (Page 62) */}
      <div className={styles.desktopSevenRow}>
        {sortedRewards.map((reward) => (
          <div key={reward.day} className={styles.rewardCol}>
            <RewardCard
              reward={reward}
              isClaiming={isClaiming}
              serverTime={serverTime}
              onClaim={onClaim}
              onCountdownExpire={onCountdownExpire}
            />
          </div>
        ))}
      </div>

      {/* Mobile & Tablet View: 4 cards in Row 1, 3 cards in Row 2 (Page 63) */}
      <div className={styles.mobileGridContainer}>
        {/* Row 1: Day 1 - 4 */}
        <div className={styles.rewardRowFour}>
          {row1.map((reward) => (
            <div key={reward.day} className={styles.rewardCol}>
              <RewardCard
                reward={reward}
                isClaiming={isClaiming}
                serverTime={serverTime}
                onClaim={onClaim}
                onCountdownExpire={onCountdownExpire}
              />
            </div>
          ))}
        </div>

        {/* Row 2: Day 5 - 7 */}
        <div className={styles.rewardRowThree}>
          {row2.map((reward) => (
            <div key={reward.day} className={styles.rewardCol}>
              <RewardCard
                reward={reward}
                isClaiming={isClaiming}
                serverTime={serverTime}
                onClaim={onClaim}
                onCountdownExpire={onCountdownExpire}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardGrid;
