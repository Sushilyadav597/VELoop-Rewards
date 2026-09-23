import React from 'react';
import { Calendar, CheckCircle2, Star } from 'lucide-react';

export const StreakStats = ({ streak }) => {
  const totalRewards = streak?.totalRewards ?? 7;
  const checkedIn = streak?.checkedIn ?? 1;
  const nextRewardAmount = streak?.nextReward?.amount ?? 10;
  const nextRewardCurrency = streak?.nextReward?.currency ?? 'VEs';

  const stats = [
    {
      label: 'Total Rewards',
      value: totalRewards,
      icon: <Calendar size={18} className="text-secondary" />,
      accentColor: '#94A3B8'
    },
    {
      label: 'Checked In',
      value: checkedIn,
      icon: <CheckCircle2 size={18} className="text-success" />,
      accentColor: '#10B981'
    },
    {
      label: 'Next Reward',
      value: `+${nextRewardAmount} ${nextRewardCurrency === 'INR' ? '₹' : nextRewardCurrency}`,
      icon: <Star size={18} className="text-warning" fill="#F59E0B" fillOpacity={0.25} />,
      accentColor: '#F59E0B'
    }
  ];

  return (
    <div className="row g-2 g-md-3 mb-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="col-4">
          <div
            className="p-2 p-md-3 d-flex align-items-center gap-2 gap-md-3 h-100"
            style={{
              background: 'linear-gradient(145deg, #16103c 0%, #100b2b 100%)',
              borderRadius: '14px',
              border: '1px solid rgba(139, 92, 246, 0.22)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.25)'
            }}
          >
            <div
              className="d-flex align-items-center justify-content-center p-2 rounded-circle"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                minWidth: '36px',
                height: '36px'
              }}
            >
              {stat.icon}
            </div>

            <div className="text-truncate">
              <span className="text-muted d-block small" style={{ fontSize: '0.75rem', letterSpacing: '0.2px' }}>
                {stat.label}
              </span>
              <span className="fw-bold text-white fs-6 fs-md-5">
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
