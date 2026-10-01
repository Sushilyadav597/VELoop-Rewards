import React from 'react';
import { Flame, Calendar, ChevronRight, Gift, Sparkles, Clock } from 'lucide-react';
import CalendarHero from '../assets/CalendarHero';
import GiftBox from '../assets/GiftBox';
import CountdownTimer from './CountdownTimer';
import ClaimButton from './ClaimButton';

/**
 * HeroBanner Component (Section 4):
 * Creates a strong, visually dominant hero section with:
 * - Small VELoop branding
 * - Main heading: "Your Daily Streak"
 * - Current streak: "🔥 X Day Streak"
 * - Short motivational message: "Keep your streak alive and unlock bigger rewards."
 * - Today's reward: "🎁 Today's Reward: +30 VEs"
 * - Countdown: "⏳ Next reward available in 08:42:17"
 * - Attractive reward/streak visuals
 * - Primary CTA: [ Claim Today's Reward ] (Visually dominant)
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
    <div className="mb-3 mb-md-4">
      {/* Main Hero Card Container */}
      <div
        className="card border-0 overflow-hidden position-relative hover-lift anim-shine"
        style={{
          background: 'linear-gradient(135deg, #181045 0%, #110a2e 50%, #0a061c 100%)',
          borderRadius: '24px',
          border: '1.5px solid rgba(139, 92, 246, 0.45)',
          boxShadow: '0 18px 50px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.14)'
        }}
      >
        {/* Ambient background glow orbs */}
        <div
          className="position-absolute"
          style={{
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, transparent 70%)',
            top: '-60px',
            left: '-30px',
            pointerEvents: 'none'
          }}
        />
        <div
          className="position-absolute"
          style={{
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.2) 0%, transparent 70%)',
            bottom: '-40px',
            right: '-20px',
            pointerEvents: 'none'
          }}
        />

        <div className="card-body p-3 p-sm-4 p-md-4 position-relative z-1">
          {/* Top Row: Small VELoop Branding & Live Status */}
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
                letterSpacing: '0.6px',
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
            {/* Left Visual: 3D Calendar Hero Illustration */}
            <div className="col-auto d-none d-sm-flex justify-content-start">
              <div
                className="anim-float"
                style={{
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 8px 20px rgba(139, 92, 246, 0.4))'
                }}
              >
                <CalendarHero size={88} />
              </div>
            </div>

            {/* Center Content: Main Heading, Message, Streak Info & Primary CTA */}
            <div className="col text-center px-1 px-md-3">
              <h2
                className="fw-extrabold mb-1 text-white tracking-tight"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(1.4rem, 3.8vw, 2.1rem)',
                  lineHeight: '1.15'
                }}
              >
                Your Daily Streak
              </h2>

              <p
                className="mb-3 mx-auto"
                style={{
                  color: '#94A3B8',
                  fontSize: 'clamp(0.78rem, 1.8vw, 0.92rem)',
                  maxWidth: '440px',
                  lineHeight: '1.4'
                }}
              >
                Keep your streak alive and unlock bigger rewards.
              </p>

              {/* Motivational Highlight Row: Streak + Today's Reward + Countdown */}
              <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
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
                  <Flame
                    size={16}
                    fill="#F59E0B"
                    color="#F59E0B"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.8))' }}
                  />
                  <span className="fw-extrabold text-warning" style={{ fontSize: '0.88rem' }}>
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
                  <span className="fw-bold" style={{ color: '#E2E8F0', fontSize: '0.86rem' }}>
                    Today's Reward:{' '}
                    <strong style={{ color: '#FBBF24', fontFamily: 'var(--font-heading)' }}>
                      {rewardDisplay}
                    </strong>
                  </span>
                </div>

                {/* Countdown Timer or Ready Indicator */}
                {nextClaimAt && !isEligibleToday && (
                  <CountdownTimer
                    serverTime={serverTime}
                    nextClaimAt={nextClaimAt}
                    onCountdownExpire={onCountdownExpire}
                    label="Next reward in"
                  />
                )}
              </div>

              {/* Primary CTA (Visually Dominant) */}
              <div className="d-flex justify-content-center pt-1">
                <ClaimButton
                  status={claimStatus}
                  rewardText={rewardDisplay}
                  size="lg"
                  disabled={isClaiming || (!isEligibleToday && Boolean(nextClaimAt))}
                  onClick={() => onClaim && onClaim(currentDay)}
                  ariaLabel={`Claim Today's Reward ${rewardDisplay}`}
                />
              </div>
            </div>

            {/* Right Visual: 3D Gift Box Illustration */}
            <div className="col-auto d-none d-sm-flex justify-content-end">
              <div
                className="anim-float"
                style={{
                  animationDelay: '1.8s',
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 8px 20px rgba(245, 158, 11, 0.4))'
                }}
              >
                <GiftBox size={86} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
