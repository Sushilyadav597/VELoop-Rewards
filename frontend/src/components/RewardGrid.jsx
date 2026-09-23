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
  return (
    <div className="mb-4">
      {/* Centered subtitle tag */}
      <div className="text-center mb-3">
        <span
          className="text-secondary small fw-medium px-3 py-1"
          style={{
            background: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '999px',
            fontSize: '0.78rem',
            letterSpacing: '0.3px'
          }}
        >
          ✦ Come back tomorrow for more rewards! ✦
        </span>
      </div>

      {/* Responsive Reward Grid */}
      <div className={styles.rewardGrid}>
        {rewards.map((reward) => (
          <div key={reward.day} className={styles.rewardGridItem}>
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
  );
};

export default RewardGrid;
