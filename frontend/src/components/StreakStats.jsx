import React from 'react';
import { CalendarCheck, CheckSquare2, Star } from 'lucide-react';
import styles from './StreakStats.module.css';

/**
 * StreakStats Component:
 * Displays the 3 key metric cards: Total Rewards, Checked In, and Next Reward.
 */
export const StreakStats = ({ streak }) => {
  const totalRewards = streak?.totalRewards ?? 7;
  const checkedIn = streak?.checkedIn ?? (streak?.currentStreak ?? 0);
  const nextRewardAmount = streak?.nextReward?.amount ?? 10;
  const nextRewardCurrency = streak?.nextReward?.currency ?? 'VEs';
  const currencyDisplay = nextRewardCurrency === 'INR' ? '₹' : nextRewardCurrency;

  const stats = [
    {
      label: 'Total Rewards',
      value: totalRewards,
      icon: <CalendarCheck size={18} color="#C084FC" />,
      bgIcon: 'rgba(139, 92, 246, 0.22)',
      borderIcon: 'rgba(167, 139, 250, 0.4)',
      valueColor: '#FFFFFF'
    },
    {
      label: 'Checked In',
      value: checkedIn,
      icon: <CheckSquare2 size={18} color="#34D399" />,
      bgIcon: 'rgba(16, 185, 129, 0.22)',
      borderIcon: 'rgba(52, 211, 153, 0.4)',
      valueColor: '#FFFFFF'
    },
    {
      label: 'Next Reward',
      value: `+${nextRewardAmount} ${currencyDisplay}`,
      icon: <Star size={18} color="#FBBF24" fill="#F59E0B" fillOpacity={0.4} />,
      bgIcon: 'rgba(245, 158, 11, 0.22)',
      borderIcon: 'rgba(245, 158, 11, 0.5)',
      valueColor: '#FBBF24'
    }
  ];

  return (
    <div className={`row g-2 g-sm-2.5 ${styles.statsRow}`}>
      {stats.map((stat, idx) => (
        <div key={idx} className="col-4">
          <div className={styles.statCard}>
            {/* Glowing Icon Container */}
            <div
              className={styles.iconWrapper}
              style={{
                backgroundColor: stat.bgIcon,
                border: `1.2px solid ${stat.borderIcon}`,
                boxShadow: `0 0 12px ${stat.bgIcon}`
              }}
            >
              {stat.icon}
            </div>

            {/* Label & Value */}
            <div className="w-100 overflow-hidden">
              <span className={styles.label}>
                {stat.label}
              </span>
              <span
                className={styles.value}
                style={{ color: stat.valueColor }}
              >
                {stat.value}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StreakStats;
