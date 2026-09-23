import React from 'react';
import { Lock, Check, Gift } from 'lucide-react';
import RoyalCrown from '../assets/RoyalCrown';

export const UltimateReward = ({ ultimateReward, currentStreak = 0 }) => {
  const isClaimed = currentStreak >= 7;
  const rewardAmount = ultimateReward?.amount ?? 5;
  const rewardSubtitle = ultimateReward?.subtitle || 'Amazon Gift Card';

  return (
    <div
      className="card border-0 mb-4 overflow-hidden position-relative"
      style={{
        background: 'linear-gradient(135deg, #1b1242 0%, #130c30 60%, #0d0822 100%)',
        borderRadius: '20px',
        border: '1.5px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 8px 30px rgba(245, 158, 11, 0.12)'
      }}
    >
      {/* Golden glow aura background */}
      <div
        className="position-absolute"
        style={{
          width: '280px',
          height: '280px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%)',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none'
        }}
      />

      <div className="card-body p-3 p-md-4">
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
          {/* Left: Crown asset with floating levitation */}
          <div className="d-flex align-items-center gap-3">
            <div className="anim-float">
              <RoyalCrown size={72} />
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-warning text-dark fw-bold px-2 py-1" style={{ fontSize: '0.72rem' }}>
                  DAY 7 REWARD
                </span>
                <span className="text-muted small">Special Milestone</span>
              </div>
              <h3 className="h5 fw-bold text-white mb-0">
                Ultimate Reward
              </h3>
              <div className="d-flex align-items-baseline gap-2 mt-1">
                <span className="fs-3 fw-bolder text-warning">
                  ₹{rewardAmount}
                </span>
                <span className="text-secondary small fw-medium">
                  {rewardSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Unlock status badge / lock */}
          <div className="d-flex align-items-center">
            {isClaimed ? (
              <div
                className="d-flex align-items-center gap-2 px-3 py-2 text-success fw-bold small"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px'
                }}
              >
                <Check size={16} /> Claimed
              </div>
            ) : (
              <div
                className="d-flex align-items-center gap-2 px-3 py-2 text-secondary small fw-medium"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px'
                }}
              >
                <Lock size={15} className="text-muted" />
                <span>Unlock on Day 7</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateReward;
