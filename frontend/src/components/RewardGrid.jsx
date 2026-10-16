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
  const rowTop = sortedRewards.filter((r) => r.day <= 4);
  const rowBottom = sortedRewards.filter((r) => r.day > 4);
  const days1to6 = sortedRewards.filter((r) => r.day < 7);
  const day7Reward = sortedRewards.find((r) => r.day === 7) || sortedRewards[sortedRewards.length - 1];

  return (
    <div className={styles.gridWrapper}>
      {/* Centered tag banner matching reference designs */}
      <div className="text-center mb-2">
        <span className={styles.sparkleBanner}>
          <span style={{ color: '#FBBF24' }}>✦</span>
          <span>Come back tomorrow for more rewards!</span>
          <span style={{ color: '#FBBF24' }}>✦</span>
        </span>
      </div>

      {/* Responsive 4 + 3 Grid (Row 1: Days 1-4, Row 2: Days 5-7 matching Page 62 & 63) */}
      <div className={styles.gridContainer}>
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
