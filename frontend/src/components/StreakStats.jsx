import React from 'react';
import { Gift, CheckSquare2, Star } from 'lucide-react';

export const StreakStats = ({ streak }) => {
  const totalRewards = streak?.totalRewards ?? 7;
  const checkedIn = streak?.checkedIn ?? 1;
  const nextRewardAmount = streak?.nextReward?.amount ?? 10;
  const nextRewardCurrency = streak?.nextReward?.currency ?? 'VEs';
  const currencyDisplay = nextRewardCurrency === 'INR' ? '₹' : nextRewardCurrency;

  const stats = [
    {
      label: 'Total Rewards',
      value: totalRewards,
      icon: <Gift size={17} color="#C084FC" />,
      bgIcon: 'rgba(139, 92, 246, 0.22)',
      borderIcon: 'rgba(167, 139, 250, 0.35)',
      valueColor: '#FFFFFF'
    },
    {
      label: 'Checked In',
      value: checkedIn,
      icon: <CheckSquare2 size={17} color="#34D399" />,
      bgIcon: 'rgba(16, 185, 129, 0.22)',
      borderIcon: 'rgba(52, 211, 153, 0.35)',
      valueColor: '#FFFFFF'
    },
    {
      label: 'Next Reward',
      value: `+${nextRewardAmount} ${currencyDisplay}`,
      icon: <Star size={17} color="#FBBF24" fill="#F59E0B" fillOpacity={0.4} />,
      bgIcon: 'rgba(245, 158, 11, 0.22)',
      borderIcon: 'rgba(245, 158, 11, 0.45)',
      valueColor: '#FBBF24'
    }
  ];

  return (
    <div className="row g-2 g-sm-2.5 mb-3">
      {stats.map((stat, idx) => (
        <div key={idx} className="col-4">
          <div
            className="p-2 p-sm-3 d-flex flex-column flex-sm-row align-items-center align-items-sm-center text-center text-sm-start gap-1.5 gap-sm-2.5 h-100 position-relative overflow-hidden hover-lift"
            style={{
              background: 'linear-gradient(145deg, #160e3a 0%, #0d0824 100%)',
              borderRadius: '16px',
              border: '1.2px solid rgba(139, 92, 246, 0.26)',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)'
            }}
          >
            {/* Glowing Icon Wrapper */}
            <div
              className="d-flex align-items-center justify-content-center rounded-3 p-1 flex-shrink-0"
              style={{
                backgroundColor: stat.bgIcon,
                border: `1px solid ${stat.borderIcon}`,
                width: '34px',
                height: '34px',
                minWidth: '34px',
                boxShadow: `0 0 10px ${stat.bgIcon}`
              }}
            >
              {stat.icon}
            </div>

            {/* Label & Value */}
            <div className="w-100 overflow-hidden">
              <span
                className="d-block text-truncate"
                style={{
                  color: '#94A3B8',
                  fontSize: 'clamp(0.66rem, 1.5vw, 0.76rem)',
                  fontWeight: 600,
                  letterSpacing: '0.2px'
                }}
              >
                {stat.label}
              </span>
              <span
                className="fw-extrabold d-block text-truncate"
                style={{
                  color: stat.valueColor,
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1rem, 2.4vw, 1.35rem)',
                  lineHeight: '1.15'
                }}
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
