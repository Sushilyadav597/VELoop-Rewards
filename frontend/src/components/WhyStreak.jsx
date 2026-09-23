import React from 'react';
import { Flame, TrendingUp, Gift, ShieldCheck } from 'lucide-react';

export const WhyStreak = () => {
  const benefits = [
    {
      icon: <Flame size={20} className="text-warning" />,
      title: 'Stay Active',
      description: 'Keep your streak alive & earn more!'
    },
    {
      icon: <TrendingUp size={20} className="text-info" />,
      title: 'Bigger Streak',
      description: 'More consecutive logins, bigger rewards!'
    },
    {
      icon: <Gift size={20} className="text-purple-400" color="#C084FC" />,
      title: 'Exclusive Rewards',
      description: 'Get coins, gift cards & special bonuses!'
    },
    {
      icon: <ShieldCheck size={20} className="text-success" />,
      title: "Don't Miss Out",
      description: 'Come back every day & unlock all rewards!'
    }
  ];

  return (
    <div className="mb-4">
      {/* Title */}
      <div className="text-center mb-3">
        <h3 className="h6 text-secondary text-uppercase fw-bold tracking-wider mb-0" style={{ letterSpacing: '1px' }}>
          ✦ Why Maintain Your Streak? ✦
        </h3>
      </div>

      {/* 4 Cards Grid */}
      <div className="row g-2 g-md-3">
        {benefits.map((item, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div
              className="p-3 text-center h-100"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(139, 92, 246, 0.18)',
                borderRadius: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                className="d-inline-flex align-items-center justify-content-center p-2 rounded-circle mb-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                {item.icon}
              </div>
              <h4 className="fw-bold text-white small mb-1" style={{ fontSize: '0.85rem' }}>
                {item.title}
              </h4>
              <p className="text-muted mb-0" style={{ fontSize: '0.74rem' }}>
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhyStreak;
