import React from 'react';
import { Lock, Check, Sparkles } from 'lucide-react';
import RoyalCrown from '../assets/RoyalCrown';

export const UltimateReward = ({ ultimateReward, currentStreak = 0 }) => {
  const isClaimed = currentStreak >= 7;
  const rewardAmount = ultimateReward?.amount ?? 5;
  const rewardSubtitle = ultimateReward?.subtitle || 'Amazon Gift Card';

  return (
    <div
      className="card border-0 mb-3 mb-md-4 overflow-hidden position-relative h-100 hover-lift anim-shine"
      style={{
        background: 'linear-gradient(135deg, #1f134c 0%, #130b32 60%, #0c0722 100%)',
        borderRadius: '22px',
        border: '1.5px solid rgba(245, 158, 11, 0.5)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(245, 158, 11, 0.18)',
        minHeight: '135px'
      }}
    >
      {/* Radiant Golden Glow Orb Background */}
      <div
        className="position-absolute"
        style={{
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%)',
          top: '-70px',
          left: '20px',
          pointerEvents: 'none'
        }}
      />
      <div
        className="position-absolute"
        style={{
          width: '260px',
          height: '260px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          bottom: '-60px',
          right: '-20px',
          pointerEvents: 'none'
        }}
      />

      <div className="card-body p-3 p-md-4 position-relative z-1 d-flex flex-column justify-content-center">
        <div className="d-flex align-items-center justify-content-between gap-2 gap-sm-3">
          {/* Left: 3D Royal Crown with Golden Aura */}
          <div className="d-flex align-items-center gap-2 gap-sm-3">
            <div
              className="anim-float flex-shrink-0"
              style={{ filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.45))' }}
            >
              <RoyalCrown size={72} className="d-none d-sm-block" />
              <RoyalCrown size={58} className="d-block d-sm-none" />
            </div>

            {/* Center Info: Ultimate Reward, ₹5, Amazon Gift Card */}
            <div>
              <div className="d-flex align-items-center gap-1.5">
                <span
                  className="d-block fw-bold text-uppercase tracking-wider mb-0"
                  style={{
                    color: '#C4B5FD',
                    fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)',
                    letterSpacing: '1px'
                  }}
                >
                  Ultimate Reward
                </span>
                <Sparkles size={13} color="#FBBF24" />
              </div>

              <div
                className="fw-extrabold text-white my-0"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.85rem, 4.2vw, 2.5rem)',
                  lineHeight: '1.05',
                  textShadow: '0 2px 14px rgba(245, 158, 11, 0.4)'
                }}
              >
                ₹{rewardAmount}
              </div>

              {/* Amazon Gift Card Brand Pill */}
              <div
                className="d-inline-flex align-items-center gap-1.5 mt-1 px-2 py-0.5"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                <span
                  className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle flex-shrink-0"
                  style={{ width: '16px', height: '16px' }}
                >
                  <span
                    style={{
                      color: '#111827',
                      fontSize: '11px',
                      fontWeight: 900,
                      lineHeight: '1',
                      fontFamily: 'system-ui, sans-serif'
                    }}
                  >
                    a
                  </span>
                </span>
                <span
                  className="fw-semibold text-truncate text-white"
                  style={{
                    fontSize: 'clamp(0.72rem, 1.8vw, 0.82rem)'
                  }}
                >
                  {rewardSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Lock / Claimed Status Badge */}
          <div className="text-end flex-shrink-0">
            {isClaimed ? (
              <div
                className="d-inline-flex flex-column align-items-center gap-1 px-3 py-2 text-success fw-bold small"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.18)',
                  border: '1.2px solid rgba(16, 185, 129, 0.5)',
                  borderRadius: '16px',
                  boxShadow: '0 0 14px rgba(16, 185, 129, 0.3)'
                }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '34px', height: '34px', backgroundColor: '#10B981', color: '#FFFFFF' }}
                >
                  <Check size={20} strokeWidth={3.5} />
                </div>
                <span style={{ fontSize: '0.78rem' }}>Claimed</span>
              </div>
            ) : (
              <div className="d-inline-flex flex-column align-items-center gap-1">
                {/* Purple Lock Icon Circle with Ambient Glow */}
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'rgba(139, 92, 246, 0.22)',
                    border: '1.5px solid rgba(167, 139, 250, 0.45)',
                    boxShadow: '0 0 18px rgba(139, 92, 246, 0.35)'
                  }}
                >
                  <Lock size={19} color="#E9D5FF" />
                </div>
                <span
                  className="fw-bold text-center d-block"
                  style={{
                    color: '#C4B5FD',
                    fontSize: 'clamp(0.68rem, 1.6vw, 0.78rem)',
                    letterSpacing: '0.3px'
                  }}
                >
                  Unlock on Day 7
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltimateReward;
