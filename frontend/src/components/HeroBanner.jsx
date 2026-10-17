import React from 'react';
import { Calendar, ChevronRight, Gift, Sparkles } from 'lucide-react';
import calendarImg from '../assets/images/Stay_Active.png';
import giftBoxImg from '../assets/images/Top_Left.png';
import flameImg from '../assets/images/Flame.png';
import CountdownTimer from './CountdownTimer';
import ClaimButton from './ClaimButton';
import styles from './HeroBanner.module.css';

/**
 * HeroBanner Component:
 * Matches official VELoop Rewards Daily Streak visual specification:
 * - Left: 3D Calendar illustration with coins & checkmark
 * - Center: Headline "Login Daily & Earn Bigger Rewards!" & subtext
 * - Right: Prominent, colorful, attractive 3D Gift Box with gold ribbons & coins
 * - Dedicated status strip below: [🔥 X Day Streak] & [📅 Streak Calendar >]
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
    <div className={styles.bannerWrapper}>
      {/* Main Hero Card Container */}
      <div className={`${styles.heroCard} anim-shine`}>
        {/* Ambient background glow orbs */}
        <div className={styles.glowPurple} />
        <div className={styles.glowGold} />

        <div className="card-body p-3 p-sm-3.5 p-md-4 position-relative z-1">
          {/* Top Brand Pill */}
          <div className="d-flex align-items-center justify-content-center mb-2 pb-1">
            <div className={styles.brandPill}>
              <Sparkles size={12} color="#FBBF24" />
              <span>VELoop Rewards • Daily Check-In</span>
            </div>
          </div>

          <div className="row align-items-center justify-content-between g-2 g-md-3">
            {/* Left 3D Calendar Hero Illustration */}
            <div className="col-auto d-flex justify-content-start flex-shrink-0">
              <div
                className="anim-float"
                style={{
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 10px 22px rgba(139, 92, 246, 0.45))'
                }}
              >
                <img
                  src={calendarImg}
                  alt="Daily Streak Calendar"
                  className={styles.heroCalendarImg}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Center Content: Headline, Subtitle, & Primary CTA */}
            <div className="col text-center px-1 px-md-3">
              <h2 className={styles.heroHeadline}>
                Login Daily &amp; Earn{' '}
                <span className={styles.goldGradientText}>
                  Bigger Rewards!
                </span>
              </h2>

              <p className={styles.heroSubtitle}>
                Maintain your streak and unlock exciting rewards every day.
              </p>

              {/* Primary Claim Action Button (if eligible today) */}
              {isEligibleToday && (
                <div className="d-flex justify-content-center pt-2.5">
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

            {/* Right Large 3D Gift Box (Visually Prominent, Colorful & Attractive!) */}
            <div className="col-auto d-flex justify-content-end flex-shrink-0">
              <div
                className="anim-float"
                style={{
                  animationDelay: '1.8s',
                  transformOrigin: 'center bottom',
                  filter: 'drop-shadow(0 12px 28px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.4))'
                }}
              >
                <img
                  src={giftBoxImg}
                  alt="VELoop Rewards Daily Gift Box"
                  className={styles.heroGiftBoxImg}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Status Strip directly below Hero Card matching mobile design reference */}
      <div className={styles.statusStrip}>
        {/* Streak Pill */}
        <div className={styles.streakPill}>
          <img
            src={flameImg}
            alt="Streak Flame"
            style={{
              width: '18px',
              height: '18px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.85))'
            }}
          />
          <span className="fw-extrabold text-warning">
            {currentStreakDays} Day Streak
          </span>
          {currentStreakDays > 0 && (
            <span className="d-none d-sm-inline" style={{ color: '#FDE68A', fontSize: '0.74rem' }}>
              • Keep it going!
            </span>
          )}
        </div>

        {/* Center: Countdown Timer or Today's Reward badge */}
        {nextClaimAt && !isEligibleToday ? (
          <CountdownTimer
            serverTime={serverTime}
            nextClaimAt={nextClaimAt}
            onCountdownExpire={onCountdownExpire}
            label="Next reward in"
          />
        ) : (
          <div className={styles.todayRewardPill}>
            <Gift size={14} color="#C4B5FD" />
            <span>
              Today's Reward:{' '}
              <strong style={{ color: '#FBBF24', fontFamily: 'var(--font-heading)' }}>
                {rewardDisplay}
              </strong>
            </span>
          </div>
        )}

        {/* Streak Calendar Trigger Pill */}
        <button
          onClick={onOpenHistory}
          className={styles.calendarTriggerBtn}
          title="View your streak check-in history"
        >
          <Calendar size={13} className="text-purple-300" />
          <span className="fw-semibold">Streak Calendar</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
