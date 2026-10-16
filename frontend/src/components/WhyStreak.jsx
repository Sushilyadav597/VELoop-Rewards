import React from 'react';
import stayActiveImg from '../assets/images/Stay_Active.png';
import biggerStreakImg from '../assets/images/Bigger_Streak.png';
import exclusiveRewardImg from '../assets/images/Exclusive-reward.png';
import trustImg from '../assets/images/Trust.png';

export const WhyStreak = () => {
  const benefits = [
    {
      img: stayActiveImg,
      alt: 'Stay Active',
      title: 'Stay Active',
      description: 'Keep your streak alive & earn more!'
    },
    {
      img: biggerStreakImg,
      alt: 'Bigger Streak',
      title: 'Bigger Streak',
      description: 'More consecutive logins, bigger rewards!'
    },
    {
      img: exclusiveRewardImg,
      alt: 'Exclusive Rewards',
      title: 'Exclusive Rewards',
      description: 'Get coins, gift cards & special bonuses!'
    },
    {
      img: trustImg,
      alt: "Don't Miss Out",
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
              {/* 3D Visual Benefit Asset */}
              <div
                className="d-inline-flex align-items-center justify-content-center mb-2 flex-shrink-0 anim-float"
                style={{
                  filter: 'drop-shadow(0 6px 14px rgba(139, 92, 246, 0.4))'
                }}
              >
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{
                    width: 'clamp(40px, 6vw, 48px)',
                    height: 'clamp(40px, 6vw, 48px)',
                    objectFit: 'contain'
                  }}
                  loading="lazy"
                />
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
