import React from 'react';
import { CalendarCheck, TrendingUp, Gift, ShieldCheck } from 'lucide-react';

export const WhyStreak = () => {
  const benefits = [
    {
      icon: <CalendarCheck size={18} color="#C084FC" />,
      bgIcon: 'rgba(139, 92, 246, 0.2)',
      borderIcon: 'rgba(167, 139, 250, 0.35)',
      title: 'Stay Active',
      description: 'Keep your streak alive & earn more!'
    },
    {
      icon: <TrendingUp size={18} color="#FBBF24" />,
      bgIcon: 'rgba(245, 158, 11, 0.2)',
      borderIcon: 'rgba(245, 158, 11, 0.4)',
      title: 'Bigger Streak',
      description: 'More consecutive logins, bigger rewards!'
    },
    {
      icon: <Gift size={18} color="#A78BFA" />,
      bgIcon: 'rgba(139, 92, 246, 0.2)',
      borderIcon: 'rgba(167, 139, 250, 0.35)',
      title: 'Exclusive Rewards',
      description: 'Get coins, gift cards & special bonuses!'
    },
    {
      icon: <ShieldCheck size={18} color="#34D399" />,
      bgIcon: 'rgba(16, 185, 129, 0.2)',
      borderIcon: 'rgba(52, 211, 153, 0.35)',
      title: "Don't Miss Out",
      description: 'Come back every day & unlock all rewards!'
    }
  ];

  return (
    <div className="mb-4">
      {/* Centered Heading with Star Glints */}
      <div className="text-center mb-3">
        <span
          className="fw-bold text-uppercase d-inline-flex align-items-center gap-2"
          style={{
            color: '#C4B5FD',
            fontSize: 'clamp(0.74rem, 1.8vw, 0.84rem)',
            letterSpacing: '1.2px'
          }}
        >
          <span style={{ color: '#A78BFA' }}>✦</span>
          <span>Why Maintain Your Streak?</span>
          <span style={{ color: '#A78BFA' }}>✦</span>
        </span>
      </div>

      {/* 4 Benefit Cards Grid: 4 columns on desktop/tablet, 2x2 on mobile */}
      <div className="row g-2 g-sm-2.5">
        {benefits.map((item, idx) => (
          <div key={idx} className="col-6 col-md-3">
            <div
              className="p-2.5 p-sm-3 text-center h-100 d-flex flex-column align-items-center justify-content-start hover-lift"
              style={{
                background: 'linear-gradient(180deg, rgba(21, 14, 56, 0.7) 0%, rgba(13, 8, 36, 0.85) 100%)',
                border: '1.2px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '16px',
                boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)'
              }}
            >
              {/* Rounded Glowing Icon Holder */}
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2"
                style={{
                  backgroundColor: item.bgIcon,
                  border: `1px solid ${item.borderIcon}`,
                  width: '36px',
                  height: '36px',
                  boxShadow: `0 0 10px ${item.bgIcon}`
                }}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h4
                className="fw-bold text-white mb-1"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(0.8rem, 1.8vw, 0.9rem)',
                  letterSpacing: '0.2px'
                }}
              >
                {item.title}
              </h4>

              {/* Subtitle / Description */}
              <p
                className="mb-0"
                style={{
                  color: '#94A3B8',
                  fontSize: 'clamp(0.68rem, 1.4vw, 0.75rem)',
                  lineHeight: '1.35'
                }}
              >
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
