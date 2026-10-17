import React from 'react';
import RewardCard from './RewardCard';
import styles from '../pages/DailyStreak/DailyStreak.module.css';

/**
 * RewardGrid Component:
 * Displays 7 daily streak reward cards.
 * On Desktop (>= 992px): Sleek 7-column single row matching desktop specification.
 * On Mobile (< 992px): 2 rows (Days 1-4, Days 5-7 centered) matching mobile specification.
 */
export const RewardGrid = ({
  rewards = [],
  isClaiming,
  serverTime,
  onClaim,
  onCountdownExpire
}) => {
  // Sort rewards by day 1 to 7
  const sortedRewards = [...rewards].sort((a, b) => a.day - b.day);
  const rowTop = sortedRewards.filter((r) => r.day <= 4);
  const rowBottom = sortedRewards.filter((r) => r.day > 4);

  return (
    <div className={styles.gridWrapper}>
      {/* Centered tag banner matching reference designs */}
      <div className="text-center mb-2.5">
        <span className={styles.sparkleBanner}>
          <span style={{ color: '#FBBF24' }}>✦</span>
          <span>Come back tomorrow for more rewards!</span>
          <span style={{ color: '#FBBF24' }}>✦</span>
        </span>
      </div>

      {/* Desktop 7-Column Row Layout (>= 992px) */}
      <div className={styles.desktopGrid}>
        {sortedRewards.map((reward) => (
          <div key={reward.day} className={styles.cardCol}>
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

      {/* Mobile/Tablet 2-Row Layout (< 992px) */}
      <div className={styles.mobileGrid}>
        {/* Row 1: Days 1 to 4 */}
        <div className={styles.rowTop}>
          {rowTop.map((reward) => (
            <div key={reward.day} className={styles.cardCol}>
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

        {/* Row 2: Days 5 to 7 */}
        <div className={styles.rowBottom}>
          {rowBottom.map((reward) => (
            <div key={reward.day} className={styles.cardCol}>
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
