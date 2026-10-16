import React from 'react';
import { Calendar, ChevronRight, Gift, Sparkles } from 'lucide-react';
import topLeftImg from '../assets/images/Top_Left.png';
import topRightImg from '../assets/images/Top_right.png';
import flameImg from '../assets/images/Flame.png';
import CountdownTimer from './CountdownTimer';
import ClaimButton from './ClaimButton';

/**
 * HeroBanner Component (Section 4 & Page 62/63):
 * Matches the official VELoop Rewards Daily Streak hero:
 * - 3D Calendar Hero on left
 * - Headline: "Login Daily & Earn Bigger Rewards!"
 * - Subtitle: "Maintain your streak and unlock exciting rewards every day."
 * - 3D Gift Box on right
 * - Status pills: [🔥 X Day Streak] and [📅 Streak Calendar >]
 * - Primary CTA / Countdown timer when cooling down
 */
export const HeroBanner = ({
  streak,
  todayReward,
  serverTime,
  isClaiming = false,
  onClaim,
  onOpenHistory,
  onCountdownExpire
}) => {
  const currentStreakDays = streak?.currentStreak ?? 0;
  const currentDay = streak?.currentDay ?? 1;
  const isEligibleToday = streak?.isEligibleToday ?? false;
  const nextClaimAt = streak?.nextClaimAt ?? null;

  // Format today's reward details
  const rewardAmount = todayReward?.amount ?? streak?.nextReward?.amount ?? 10;
  const rewardCurrency = todayReward?.currency ?? streak?.nextReward?.currency ?? 'VEs';
  const rewardDisplay = rewardCurrency === 'INR' ? `₹${rewardAmount} Gift Card` : `+${rewardAmount} ${rewardCurrency}`;

  // Determine claim button status
  let claimStatus = 'AVAILABLE';
  if (isClaiming) {
    claimStatus = 'LOADING';
  } else if (!isEligibleToday && nextClaimAt) {
    claimStatus = 'COOLDOWN';
  } else if (!isEligibleToday && !nextClaimAt && currentStreakDays > 0) {
    claimStatus = 'CLAIMED';
  } else if (isEligibleToday) {
    claimStatus = 'AVAILABLE';
  }

  return (
    <div className="mb-3">
      <div
        className="card border-0 overflow-hidden position-relative hover-lift anim-shine"
        style={{
          background: 'linear-gradient(135deg, #181045 0%, #110a2e 50%, #0a061c 100%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(139, 92, 246, 0.42)',
          boxShadow: '0 16px 45px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* Ambient background glow orbs */}
        <div
          className="position-absolute"
          style={{
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, transparent 70%)',
            top: '-50px',
            left: '-20px',
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute"
          style={{
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
            bottom: '-40px',
            right: '-20px',
            pointerEvents: 'none'
          }}
        />

        <div className="card-body p-3 p-sm-3.5 p-md-4 position-relative z-1">
          {/* Top Row: Small Brand Tag + Streak Calendar Link */}
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2 pb-1">
            <div
              className="d-inline-flex align-items-center gap-1.5 px-2.5 py-1"
              style={{
                background: 'rgba(139, 92, 246, 0.18)',
                border: '1px solid rgba(167, 139, 250, 0.35)',
                borderRadius: '999px',
                color: '#C4B5FD',
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              <Sparkles size={12} color="#FBBF24" />
              <span>VELoop Rewards • Daily Check-In</span>
            </div>

            {/* Streak Calendar Trigger Pill */}
            <button
              onClick={onOpenHistory}
              className="btn btn-sm d-flex align-items-center gap-1.5 px-3 py-1 border-0 hover-lift text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '999px',
                fontSize: '0.78rem'
              }}
              title="View your streak check-in history"
            >
              <Calendar size={13} className="text-purple-300" />
              <span className="fw-semibold">Streak Calendar</span>
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="row align-items-center justify-content-between g-2 g-md-3">
            {/* Left 3D Calendar Hero Illustration (Shown on all screen sizes) */}
            <div className="col-auto d-flex justify-content-start flex-shrink-0">
              <div
                className="anim-float"
                style={{
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 8px 20px rgba(139, 92, 246, 0.45))'
                }}
              >
                <img
                  src={topLeftImg}
                  alt="Daily Streak Calendar"
                  style={{
                    height: 'clamp(44px, 8vw, 80px)',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Center Content: Headline, Subtitle, Status Pills & CTA */}
            <div className="col text-center px-1 px-md-3">
              <h2
                className="fw-extrabold mb-1 tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.2rem, 3.2vw, 2.05rem)',
                  lineHeight: '1.18',
                  color: '#FFFFFF'
                }}
              >
                Login Daily & Earn{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  Bigger Rewards!
                </span>
              </h2>

              <p
                className="mb-2.5 mx-auto"
                style={{
                  color: '#94A3B8',
                  fontSize: 'clamp(0.74rem, 1.6vw, 0.88rem)',
                  maxWidth: '440px',
                  lineHeight: '1.4'
                }}
              >
                Maintain your streak and unlock exciting rewards every day.
              </p>

              {/* Status Pills Row: Flame Streak + Today's Reward + Timer */}
              <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-2.5">
                {/* Streak Pill */}
                <div
                  className="d-flex align-items-center gap-1.5 px-3 py-1 hover-lift"
                  style={{
                    background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.28) 100%)',
                    border: '1.2px solid rgba(245, 158, 11, 0.6)',
                    borderRadius: '999px',
                    boxShadow: '0 0 16px rgba(245, 158, 11, 0.2)'
                  }}
                >
                  <img
                    src={flameImg}
                    alt="Streak Flame"
                    style={{
                      width: '18px',
                      height: '18px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))'
                    }}
                  />
                  <span className="fw-extrabold text-warning" style={{ fontSize: '0.86rem' }}>
                    {currentStreakDays} Day Streak
                  </span>
                </div>

                {/* Today's Reward Pill */}
                <div
                  className="d-flex align-items-center gap-1.5 px-3 py-1 hover-lift"
                  style={{
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1.2px solid rgba(167, 139, 250, 0.45)',
                    borderRadius: '999px',
                    boxShadow: '0 0 16px rgba(139, 92, 246, 0.2)'
                  }}
                >
                  <Gift size={15} color="#C4B5FD" />
                  <span className="fw-bold" style={{ color: '#E2E8F0', fontSize: '0.84rem' }}>
                    Today's Reward:{' '}
                    <strong style={{ color: '#FBBF24', fontFamily: 'var(--font-heading)' }}>
                      {rewardDisplay}
                    </strong>
                  </span>
                </div>

                {/* Countdown Timer if Cooling Down */}
                {nextClaimAt && !isEligibleToday && (
                  <CountdownTimer
                    serverTime={serverTime}
                    nextClaimAt={nextClaimAt}
                    onCountdownExpire={onCountdownExpire}
                    label="Next reward in"
                  />
                )}
              </div>

              {/* Primary Claim Action Button (if eligible today) */}
              {isEligibleToday && (
                <div className="d-flex justify-content-center pt-1">
                  <ClaimButton
                    status={claimStatus}
                    rewardText={rewardDisplay}
                    size="md"
                    disabled={isClaiming}
                    onClick={() => onClaim && onClaim(currentDay)}
                    ariaLabel={`Claim Today's Reward ${rewardDisplay}`}
                  />
                </div>
              )}
            </div>

            {/* Right 3D Gift Box Illustration (Shown on all screen sizes) */}
            <div className="col-auto d-flex justify-content-end flex-shrink-0">
              <div
                className="anim-float"
                style={{
                  animationDelay: '1.8s',
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 8px 20px rgba(245, 158, 11, 0.4))'
                }}
              >
                <img
                  src={topRightImg}
                  alt="Streak Gift Box"
                  style={{
                    height: 'clamp(44px, 8vw, 80px)',
                    width: 'auto',
                    objectFit: 'contain'
                  }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
